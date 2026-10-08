import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const ANALYTICS_FILE = path.join(DATA_DIR, 'realtime_analytics.json');
const CHAT_FILE = path.join(DATA_DIR, 'groupchat_messages.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Active sessions tracking (in memory for real-time heartbeats)
const activeSessions = new Map(); // sessionId -> { lastSeen, userName, page }

function getActiveUsersCount() {
  const now = Date.now();
  // 60-second window for genuine online presence
  for (const [id, data] of activeSessions.entries()) {
    if (now - data.lastSeen > 60000) {
      activeSessions.delete(id);
    }
  }
  return Math.max(1, activeSessions.size);
}

function loadAnalytics() {
  try {
    if (fs.existsSync(ANALYTICS_FILE)) {
      const content = fs.readFileSync(ANALYTICS_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn('Error reading analytics file, starting fresh', err);
  }

  // Real zero baseline - NOT made up
  const initial = {
    totalViews: 0,
    totalDownloads: 0,
    apkDownloads: 0,
    otherDownloads: 0,
    instagramClicks: 0,
    uniqueVisitors: 0,
    tabViews: {},
    downloadsByItem: {},
    recentEvents: []
  };
  saveAnalytics(initial);
  return initial;
}

function saveAnalytics(data) {
  try {
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Error saving analytics file', err);
  }
}

function loadChat() {
  try {
    if (fs.existsSync(CHAT_FILE)) {
      const content = fs.readFileSync(CHAT_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn('Error reading chat file', err);
  }

  const initial = [
    {
      id: 'welcome-nokuvimba',
      userName: 'Nokuvimba Bafu',
      role: 'Founder & Bandmaster',
      instrument: 'Bb Cornet',
      avatar: '🎺',
      message: 'Welcome to the Btech2 Live Band Room! This group chat connects brass students, players, and bandmasters in real time. Share questions about rehearsals, fingerings, or Salvation Army pieces!',
      timestamp: 'Today',
      isFounder: true
    }
  ];
  saveChat(initial);
  return initial;
}

function saveChat(messages) {
  try {
    fs.writeFileSync(CHAT_FILE, JSON.stringify(messages, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Error saving chat file', err);
  }
}

export function handleRealtimeMiddleware(req, res, next) {
  const url = req.url || '';

  // Parse JSON helper for Vite connect middleware
  const parseJsonBody = (callback) => {
    if (req.body) {
      callback(req.body);
      return;
    }
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const parsed = body ? JSON.parse(body) : {};
        callback(parsed);
      } catch {
        callback({});
      }
    });
  };

  // 1. GET /api/analytics
  if (url === '/api/analytics' && req.method === 'GET') {
    const analytics = loadAnalytics();
    analytics.activeUsers = getActiveUsersCount();
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(analytics));
    return;
  }

  // 2. POST /api/analytics/heartbeat (Real-time active users & viewer counting)
  if (url === '/api/analytics/heartbeat' && req.method === 'POST') {
    parseJsonBody((data) => {
      const sessionId = data.sessionId || req.headers['x-session-id'] || 'session_' + Math.random().toString(36).slice(2);
      activeSessions.set(sessionId, {
        lastSeen: Date.now(),
        userName: data.userName || 'Brass Learner',
        page: data.page || 'home'
      });
      const activeCount = getActiveUsersCount();
      const analytics = loadAnalytics();
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        success: true,
        activeUsers: activeCount,
        totalViews: analytics.totalViews,
        totalDownloads: analytics.totalDownloads,
        apkDownloads: analytics.apkDownloads,
        instagramClicks: analytics.instagramClicks || 0
      }));
    });
    return;
  }

  // 3. POST /api/analytics/view (Real website view)
  if (url === '/api/analytics/view' && req.method === 'POST') {
    parseJsonBody((data) => {
      const analytics = loadAnalytics();
      analytics.totalViews = (analytics.totalViews || 0) + 1;
      const tab = data.tab || 'home';
      analytics.tabViews = analytics.tabViews || {};
      analytics.tabViews[tab] = (analytics.tabViews[tab] || 0) + 1;

      if (data.sessionId) {
        activeSessions.set(data.sessionId, {
          lastSeen: Date.now(),
          userName: data.userName || 'Visitor',
          page: tab
        });
      }

      analytics.recentEvents = analytics.recentEvents || [];
      const newEvent = {
        id: 'ev_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        type: 'view',
        detail: `Viewed: ${tab}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        device: data.device || 'Web Browser'
      };
      analytics.recentEvents = [newEvent, ...analytics.recentEvents.slice(0, 39)];

      saveAnalytics(analytics);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, totalViews: analytics.totalViews }));
    });
    return;
  }

  // 4. POST /api/analytics/download (Real APK or score download)
  if (url === '/api/analytics/download' && req.method === 'POST') {
    parseJsonBody((data) => {
      const analytics = loadAnalytics();
      analytics.totalDownloads = (analytics.totalDownloads || 0) + 1;
      const item = data.item || 'Btech2.apk';
      const isApk = data.type === 'apk' || item.toLowerCase().includes('.apk');

      if (isApk) {
        analytics.apkDownloads = (analytics.apkDownloads || 0) + 1;
      } else {
        analytics.otherDownloads = (analytics.otherDownloads || 0) + 1;
      }

      analytics.downloadsByItem = analytics.downloadsByItem || {};
      analytics.downloadsByItem[item] = (analytics.downloadsByItem[item] || 0) + 1;

      analytics.recentEvents = analytics.recentEvents || [];
      const newEvent = {
        id: 'dl_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        type: 'download',
        detail: `Downloaded: ${item}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        device: data.device || 'Android / Web'
      };
      analytics.recentEvents = [newEvent, ...analytics.recentEvents.slice(0, 39)];

      saveAnalytics(analytics);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        success: true,
        totalDownloads: analytics.totalDownloads,
        apkDownloads: analytics.apkDownloads
      }));
    });
    return;
  }

  // 5. POST /api/analytics/instagram-click (Real Instagram link clicks)
  if (url === '/api/analytics/instagram-click' && req.method === 'POST') {
    parseJsonBody((data) => {
      const analytics = loadAnalytics();
      analytics.instagramClicks = (analytics.instagramClicks || 0) + 1;

      analytics.recentEvents = analytics.recentEvents || [];
      const newEvent = {
        id: 'ig_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        type: 'instagram',
        detail: 'Clicked official Instagram link (@_btech_2)',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        device: data.device || 'Web'
      };
      analytics.recentEvents = [newEvent, ...analytics.recentEvents.slice(0, 39)];

      saveAnalytics(analytics);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        success: true,
        instagramClicks: analytics.instagramClicks
      }));
    });
    return;
  }

  // 6. GET /api/chat/messages (Real group chat messages)
  if (url === '/api/chat/messages' && req.method === 'GET') {
    const messages = loadChat();
    const activeCount = getActiveUsersCount();
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      messages,
      activeUsers: activeCount
    }));
    return;
  }

  // 7. POST /api/chat/messages (Post real message to group chat)
  if (url === '/api/chat/messages' && req.method === 'POST') {
    parseJsonBody((data) => {
      if (!data.message || !data.message.trim()) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Message cannot be empty' }));
        return;
      }

      const messages = loadChat();
      const newMessage = {
        id: 'msg_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        userName: (data.userName || 'Brass Student').trim(),
        role: data.role || 'Brass Learner',
        instrument: data.instrument || 'Bb Cornet',
        avatar: data.avatar || '🎺',
        message: data.message.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString(),
        isFounder: Boolean(data.isFounder)
      };

      messages.push(newMessage);
      // Keep up to 200 messages
      const trimmed = messages.slice(-200);
      saveChat(trimmed);

      // Keep user active in heartbeat
      if (data.sessionId) {
        activeSessions.set(data.sessionId, {
          lastSeen: Date.now(),
          userName: newMessage.userName,
          page: 'group-chat'
        });
      }

      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        success: true,
        message: newMessage,
        activeUsers: getActiveUsersCount()
      }));
    });
    return;
  }

  next();
}
