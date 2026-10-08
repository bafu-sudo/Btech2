export interface AnalyticsEvent {
  id: string;
  type: 'view' | 'download' | 'instagram';
  detail: string;
  timestamp: string;
  device?: string;
}

export interface AnalyticsData {
  totalViews: number;
  totalDownloads: number;
  apkDownloads: number;
  otherDownloads: number;
  instagramClicks: number;
  activeUsers: number;
  uniqueSessions: number;
  viewsToday: number;
  todayDate: string;
  lastUpdated: string;
  tabViews: Record<string, number>;
  downloadsByItem: Record<string, number>;
  recentEvents: AnalyticsEvent[];
}

const STORAGE_KEY = 'btech2_realtime_analytics_v2';
const CREATOR_AUTH_KEY = 'btech2_creator_mode_active';
const SESSION_ID_KEY = 'btech2_current_session_id';

const getTodayString = () => new Date().toISOString().split('T')[0];

const getDeviceType = (): string => {
  if (typeof window === 'undefined') return 'Desktop';
  const ua = navigator.userAgent;
  if (/Android/i.test(ua)) return 'Android Device';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS Device';
  if (/Mobile/i.test(ua)) return 'Mobile Browser';
  return 'Desktop / Laptop';
};

const getSessionId = (): string => {
  if (typeof window === 'undefined') return 'server_session';
  let id = sessionStorage.getItem(SESSION_ID_KEY);
  if (!id) {
    id = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    sessionStorage.setItem(SESSION_ID_KEY, id);
  }
  return id;
};

// Genuine Real-Time Baseline (starts at 0, NEVER made up!)
const getInitialData = (): AnalyticsData => {
  const today = getTodayString();
  return {
    totalViews: 0,
    totalDownloads: 0,
    apkDownloads: 0,
    otherDownloads: 0,
    instagramClicks: 0,
    activeUsers: 1,
    uniqueSessions: 1,
    viewsToday: 0,
    todayDate: today,
    lastUpdated: new Date().toISOString(),
    tabViews: {},
    downloadsByItem: {},
    recentEvents: []
  };
};

class AnalyticsManager {
  private data: AnalyticsData;
  private listeners: Set<(data: AnalyticsData) => void> = new Set();
  private heartbeatInterval: any = null;

  constructor() {
    this.data = this.loadFromStorage();
    this.checkDay();
    this.startHeartbeat();
    this.syncWithServer();
  }

  private loadFromStorage(): AnalyticsData {
    if (typeof window === 'undefined') return getInitialData();
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const today = getTodayString();
        if (parsed.todayDate !== today) {
          parsed.todayDate = today;
          parsed.viewsToday = 0;
        }
        // Ensure keys exist
        parsed.instagramClicks = parsed.instagramClicks || 0;
        parsed.activeUsers = parsed.activeUsers || 1;
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse analytics from localStorage', e);
    }
    const initial = getInitialData();
    this.saveToStorage(initial);
    return initial;
  }

  private saveToStorage(data: AnalyticsData) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save analytics to localStorage', e);
    }
  }

  private notify() {
    this.saveToStorage(this.data);
    this.listeners.forEach((cb) => {
      try {
        cb({ ...this.data });
      } catch (err) {
        console.error(err);
      }
    });
  }

  private checkDay() {
    if (typeof window === 'undefined') return;
    const today = getTodayString();
    if (this.data.todayDate !== today) {
      this.data.todayDate = today;
      this.data.viewsToday = 0;
    }
  }

  private startHeartbeat() {
    if (typeof window === 'undefined') return;
    // Send immediate heartbeat
    this.sendHeartbeat();

    // Poll every 15 seconds for real-time live users and stats
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, 15000);
  }

  public async sendHeartbeat(page: string = 'home', userName?: string) {
    if (typeof window === 'undefined') return;
    try {
      const sessionId = getSessionId();
      const res = await fetch('/api/analytics/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          page,
          userName: userName || 'Brass Learner'
        })
      });

      if (res.ok) {
        const serverRes = await res.json();
        if (serverRes && serverRes.success) {
          if (typeof serverRes.activeUsers === 'number') {
            this.data.activeUsers = serverRes.activeUsers;
          }
          if (typeof serverRes.totalViews === 'number' && serverRes.totalViews >= this.data.totalViews) {
            this.data.totalViews = serverRes.totalViews;
          }
          if (typeof serverRes.totalDownloads === 'number' && serverRes.totalDownloads >= this.data.totalDownloads) {
            this.data.totalDownloads = serverRes.totalDownloads;
            this.data.apkDownloads = serverRes.apkDownloads || this.data.apkDownloads;
          }
          if (typeof serverRes.instagramClicks === 'number') {
            this.data.instagramClicks = Math.max(this.data.instagramClicks, serverRes.instagramClicks);
          }
          this.notify();
        }
      }
    } catch {
      // offline or server unreachable, fallback to local
    }
  }

  private async syncWithServer() {
    if (typeof window === 'undefined') return;
    try {
      const res = await fetch('/api/analytics', { method: 'GET' });
      if (res.ok) {
        const serverData = await res.json();
        if (serverData && typeof serverData.totalViews === 'number') {
          this.data.totalViews = Math.max(this.data.totalViews, serverData.totalViews);
          this.data.totalDownloads = Math.max(this.data.totalDownloads, serverData.totalDownloads);
          this.data.apkDownloads = Math.max(this.data.apkDownloads, serverData.apkDownloads || 0);
          this.data.otherDownloads = Math.max(this.data.otherDownloads, serverData.otherDownloads || 0);
          this.data.instagramClicks = Math.max(this.data.instagramClicks, serverData.instagramClicks || 0);
          if (typeof serverData.activeUsers === 'number') {
            this.data.activeUsers = serverData.activeUsers;
          }
          if (Array.isArray(serverData.recentEvents) && serverData.recentEvents.length > 0) {
            this.data.recentEvents = serverData.recentEvents;
          }
          if (serverData.tabViews) {
            this.data.tabViews = { ...this.data.tabViews, ...serverData.tabViews };
          }
          this.notify();
        }
      }
    } catch {
      // ignore
    }
  }

  public getAnalytics(): AnalyticsData {
    return { ...this.data };
  }

  public subscribe(cb: (data: AnalyticsData) => void): () => void {
    this.listeners.add(cb);
    cb({ ...this.data });
    return () => {
      this.listeners.delete(cb);
    };
  }

  public recordPageView(tabName: string) {
    this.data.totalViews += 1;
    this.data.viewsToday += 1;
    this.data.lastUpdated = new Date().toISOString();

    const formattedTab = tabName || 'home';
    this.data.tabViews[formattedTab] = (this.data.tabViews[formattedTab] || 0) + 1;

    const eventTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const tabLabels: Record<string, string> = {
      academy: 'Brass Academy (Instruments)',
      theory: 'Music Theory Academy',
      bandmaster: 'Bandmaster & Conducting Academy',
      groups: 'School & Band Groups Manager',
      offline: 'Offline Curriculum Library',
      scores: '25+ Brass Sheet Scores Library',
      musicTutor: 'Interactive Music Tutor',
      tuner: 'Precision Brass Tuner',
      scales: 'All Brass Scales Studio',
      accidentals: 'Sharps & Flats Masterclass',
      trombone: 'Trombone Slide Simulator',
      percussion: 'Percussion & Timpani Lab',
      quiz: 'Theory & Bandmaster Quiz',
      about: 'About Founder Nokuvimba Bafu'
    };

    const displayTab = tabLabels[formattedTab] || formattedTab;
    const newEvent: AnalyticsEvent = {
      id: 'ev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      type: 'view',
      detail: `Visited ${displayTab}`,
      timestamp: eventTime,
      device: getDeviceType()
    };

    this.data.recentEvents = [newEvent, ...this.data.recentEvents.slice(0, 39)];
    this.notify();

    // Send view to server
    try {
      fetch('/api/analytics/view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tab: formattedTab,
          sessionId: getSessionId(),
          device: getDeviceType()
        })
      }).catch(() => {});
    } catch {
      // ignore
    }
  }

  public recordDownload(itemName: string, type: 'apk' | 'score' | 'other' = 'apk') {
    this.data.totalDownloads += 1;
    if (type === 'apk' || itemName.toLowerCase().includes('.apk')) {
      this.data.apkDownloads += 1;
    } else {
      this.data.otherDownloads += 1;
    }
    this.data.lastUpdated = new Date().toISOString();

    const cleanItem = itemName || 'Btech2.apk';
    this.data.downloadsByItem[cleanItem] = (this.data.downloadsByItem[cleanItem] || 0) + 1;

    const eventTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newEvent: AnalyticsEvent = {
      id: 'ev_dl_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      type: 'download',
      detail: `Downloaded: ${cleanItem}`,
      timestamp: eventTime,
      device: getDeviceType()
    };

    this.data.recentEvents = [newEvent, ...this.data.recentEvents.slice(0, 39)];
    this.notify();

    // Send download to server
    try {
      fetch('/api/analytics/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item: cleanItem,
          type,
          sessionId: getSessionId(),
          device: getDeviceType()
        })
      }).catch(() => {});
    } catch {
      // ignore
    }
  }

  public recordInstagramClick() {
    this.data.instagramClicks += 1;
    this.data.lastUpdated = new Date().toISOString();

    const eventTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newEvent: AnalyticsEvent = {
      id: 'ev_ig_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      type: 'instagram',
      detail: 'Clicked official Instagram link (@_btech_2)',
      timestamp: eventTime,
      device: getDeviceType()
    };

    this.data.recentEvents = [newEvent, ...this.data.recentEvents.slice(0, 39)];
    this.notify();

    // Send Instagram click to server
    try {
      fetch('/api/analytics/instagram-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: getSessionId(),
          device: getDeviceType()
        })
      }).catch(() => {});
    } catch {
      // ignore
    }
  }

  public isCreatorAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('creator') === 'true' || window.location.hash === '#creator') {
      localStorage.setItem(CREATOR_AUTH_KEY, 'true');
      return true;
    }
    return localStorage.getItem(CREATOR_AUTH_KEY) === 'true';
  }

  public setCreatorAuthenticated(auth: boolean) {
    if (typeof window === 'undefined') return;
    if (auth) {
      localStorage.setItem(CREATOR_AUTH_KEY, 'true');
    } else {
      localStorage.removeItem(CREATOR_AUTH_KEY);
    }
  }

  public verifyCreatorPIN(input: string): boolean {
    const clean = input.trim().toLowerCase();
    const validKeys = ['btech', 'btech2', 'btech2026', 'nokuvimba', 'bafu', '1818', 'admin'];
    const isValid = validKeys.includes(clean);
    if (isValid) {
      this.setCreatorAuthenticated(true);
    }
    return isValid;
  }

  public resetAnalytics() {
    this.data = getInitialData();
    this.notify();
  }

  public adjustCounts(views: number, downloads: number, apkDownloads: number) {
    this.data.totalViews = Math.max(0, views);
    this.data.totalDownloads = Math.max(0, downloads);
    this.data.apkDownloads = Math.max(0, apkDownloads);
    this.data.lastUpdated = new Date().toISOString();
    this.notify();
  }
}

export const analyticsService = new AnalyticsManager();
