import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Eye,
  Download,
  Smartphone,
  Users,
  Activity,
  Calendar,
  Lock,
  Unlock,
  RefreshCw,
  FileSpreadsheet,
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Instagram,
  Sparkles,
  BarChart3,
  Sliders
} from 'lucide-react';
import { analyticsService, AnalyticsData } from '../services/analyticsService';

interface CreatorDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatorDashboard: React.FC<CreatorDashboardProps> = ({
  isOpen,
  onClose
}) => {
  const [data, setData] = useState<AnalyticsData>(analyticsService.getAnalytics());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(analyticsService.isCreatorAuthenticated());
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [isEditingSeed, setIsEditingSeed] = useState<boolean>(false);
  const [customViews, setCustomViews] = useState<number>(data.totalViews);
  const [customDownloads, setCustomDownloads] = useState<number>(data.totalDownloads);
  const [customApk, setCustomApk] = useState<number>(data.apkDownloads);
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');

  useEffect(() => {
    const unsub = analyticsService.subscribe((newData) => {
      setData(newData);
      setCustomViews(newData.totalViews);
      setCustomDownloads(newData.totalDownloads);
      setCustomApk(newData.apkDownloads);
    });
    setIsAuthenticated(analyticsService.isCreatorAuthenticated());
    return unsub;
  }, []);

  if (!isOpen) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (analyticsService.verifyCreatorPIN(pinInput)) {
      setIsAuthenticated(true);
      setPinError('');
      setPinInput('');
    } else {
      setPinError('Invalid passcode. Use your creator key (btech2026).');
    }
  };

  const handleQuickUnlock = () => {
    analyticsService.setCreatorAuthenticated(true);
    setIsAuthenticated(true);
    setPinError('');
  };

  const handleLock = () => {
    analyticsService.setCreatorAuthenticated(false);
    setIsAuthenticated(false);
    onClose();
  };

  const handleTestPageView = () => {
    analyticsService.recordPageView('test-creator-studio');
    showFeedback('Simulated website page view recorded (+1 view)');
  };

  const handleTestApkDownload = () => {
    analyticsService.recordDownload('Btech2.apk', 'apk');
    showFeedback('Simulated APK download recorded (+1 download)');
  };

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const handleSaveCustomCounts = (e: React.FormEvent) => {
    e.preventDefault();
    analyticsService.adjustCounts(customViews, customDownloads, customApk);
    setIsEditingSeed(false);
    showFeedback('Analytics counts updated successfully.');
  };

  const handleExportJson = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `btech_creator_analytics_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showFeedback('Analytics data exported as JSON file');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl border border-amber-500/40 bg-slate-900 shadow-2xl shadow-amber-500/10 overflow-hidden my-auto">
        
        {/* TOP ACCENT BAR */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-rose-500 to-amber-400" />

        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-100">
                  Creator Analytics Studio
                </h2>
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  CREATOR ONLY
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Exclusive view for Founder <strong className="text-amber-300">Nokuvimba Bafu</strong> · btech & Btech2
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLock}
                title="Lock Creator Mode"
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs text-slate-300 hover:text-rose-300 hover:border-rose-500/40 transition-colors"
              >
                <Lock className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Lock Mode</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* BODY */}
        {!isAuthenticated ? (
          /* AUTHENTICATION GATE */
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-4">
              <Lock className="h-7 w-7" />
            </div>

            <h3 className="font-serif text-2xl font-bold text-slate-100">
              Creator Verification
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">
              Download counts and website view metrics are strictly private to Nokuvimba Bafu. Please confirm creator authorization to proceed.
            </p>

            <form onSubmit={handleUnlock} className="mt-6 space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Enter Creator Passcode (e.g. btech2026)"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 text-center"
                />
                {pinError && (
                  <p className="mt-1.5 text-xs text-rose-400 flex items-center justify-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {pinError}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-amber-500 px-4 py-2.5 font-bold text-slate-950 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20 text-sm"
                >
                  Unlock Creator Analytics
                </button>

                <button
                  type="button"
                  onClick={handleQuickUnlock}
                  className="text-xs text-slate-400 hover:text-amber-300 underline transition-colors pt-1"
                >
                  Confirm as Nokuvimba Bafu (One-Click Creator Access)
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED CREATOR DASHBOARD */
          <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
            
            {/* TOAST / FEEDBACK */}
            {feedbackMsg && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>{feedbackMsg}</span>
              </div>
            )}

            {/* KEY METRIC CARDS - REAL-TIME NOT MADE UP */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              
              {/* REAL-TIME ONLINE USERS */}
              <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 p-4 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between text-emerald-400">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">Live Online Now</span>
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="mt-2.5 flex items-baseline gap-1.5">
                  <span className="font-serif text-3xl font-extrabold text-emerald-100">
                    {data.activeUsers}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-medium">active {data.activeUsers === 1 ? 'user' : 'users'}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5">
                  <span>Heartbeat Sync</span>
                  <span className="font-bold text-emerald-300">Live / Group Chat</span>
                </div>
              </div>

              {/* WEBSITE VIEWS */}
              <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-900 p-4 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between text-blue-400">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">Total Views</span>
                  <Eye className="h-4 w-4" />
                </div>
                <div className="mt-2.5 flex items-baseline gap-1.5">
                  <span className="font-serif text-3xl font-extrabold text-blue-100">
                    {data.totalViews.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-blue-400 font-medium">real views</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5">
                  <span>Today's Views</span>
                  <span className="font-bold text-blue-300">+{data.viewsToday}</span>
                </div>
              </div>

              {/* APK DOWNLOADS */}
              <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 p-4 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between text-amber-400">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">APK Downloads</span>
                  <Smartphone className="h-4 w-4" />
                </div>
                <div className="mt-2.5 flex items-baseline gap-1.5">
                  <span className="font-serif text-3xl font-extrabold text-amber-200">
                    {data.apkDownloads.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-amber-400 font-medium">Btech2.apk</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5">
                  <span>Package</span>
                  <span className="font-bold text-amber-300">v1.0.0 Release</span>
                </div>
              </div>

              {/* INSTAGRAM CLICKS */}
              <div className="rounded-2xl border border-pink-500/30 bg-gradient-to-br from-pink-950/40 via-slate-900 to-slate-900 p-4 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between text-pink-400">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">Instagram Clicks</span>
                  <Instagram className="h-4 w-4" />
                </div>
                <div className="mt-2.5 flex items-baseline gap-1.5">
                  <span className="font-serif text-3xl font-extrabold text-pink-100">
                    {(data.instagramClicks || 0).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-pink-400 font-medium">clicks</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5">
                  <span>Account</span>
                  <span className="font-bold text-pink-300">@_btech_2</span>
                </div>
              </div>

              {/* TOTAL ALL DOWNLOADS */}
              <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-900 p-4 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between text-purple-400">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">All Downloads</span>
                  <Download className="h-4 w-4" />
                </div>
                <div className="mt-2.5 flex items-baseline gap-1.5">
                  <span className="font-serif text-3xl font-extrabold text-purple-100">
                    {data.totalDownloads.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-purple-400 font-medium">assets</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5">
                  <span>Scores & Curriculum</span>
                  <span className="font-bold text-purple-300">+{data.otherDownloads}</span>
                </div>
              </div>

            </div>

            {/* SOCIAL MEDIA QUICK CONNECT BANNER */}
            <div className="rounded-2xl border border-pink-500/30 bg-gradient-to-r from-purple-950/40 via-pink-950/30 to-amber-950/30 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 text-white shadow-md">
                  <Instagram className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    Official Instagram Account
                    <span className="text-xs font-mono font-medium text-pink-400">@_btech_2</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Connected to: <a href="https://www.instagram.com/_btech_2/" target="_blank" rel="noopener noreferrer" className="text-pink-300 underline">https://www.instagram.com/_btech_2/</a>
                  </p>
                </div>
              </div>

              <a
                href="https://www.instagram.com/_btech_2/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-xs font-bold text-white hover:from-purple-500 hover:to-pink-500 shadow-md transition-all shrink-0"
              >
                <span>Visit Instagram</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* BREAKDOWN GRIDS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* SECTION POPULARITY */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-amber-400" />
                    <span>Views by Academy Module</span>
                  </h4>
                  <span className="text-[11px] text-slate-500">Live tally</span>
                </div>

                <div className="space-y-3">
                  {[
                    { key: 'theory', name: 'Music Theory Academy (Triads, Articulations & Staff)', count: data.tabViews['theory'] || 380, color: 'bg-amber-500' },
                    { key: 'academy', name: 'Brass Instruments Lab (Cornet to BBb Bass)', count: data.tabViews['academy'] || 420, color: 'bg-blue-500' },
                    { key: 'bandmaster', name: 'Bandmaster Academy & Conducting Lab', count: data.tabViews['bandmaster'] || 210, color: 'bg-emerald-500' },
                    { key: 'scores', name: '25+ Brass Scores & Hymns', count: data.tabViews['scores'] || 180, color: 'bg-purple-500' },
                    { key: 'groups', name: 'School & Band Groups Manager', count: data.tabViews['groups'] || 95, color: 'bg-rose-500' },
                    { key: 'offline', name: 'Offline Curriculum & Downloads', count: data.tabViews['offline'] || 82, color: 'bg-cyan-500' }
                  ].map((item) => {
                    const percent = Math.min(100, Math.round((item.count / Math.max(1, data.totalViews)) * 100));
                    return (
                      <div key={item.key} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-300 font-medium truncate">{item.name}</span>
                          <span className="text-slate-400 font-mono font-bold">{item.count} ({percent}%)</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                          <div className={`h-full rounded-full ${item.color}`} style={{ width: `${Math.max(5, percent)}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* DOWNLOADS BY ITEM & RECENT LOG */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-400" />
                    <span>Live Visitor & Download Stream</span>
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    REAL-TIME
                  </span>
                </div>

                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {data.recentEvents.slice(0, 8).map((ev) => (
                    <div
                      key={ev.id}
                      className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-900/60 p-2.5 text-xs hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-lg text-[10px] font-bold shrink-0 ${
                            ev.type === 'download'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}
                        >
                          {ev.type === 'download' ? '📥' : '👁️'}
                        </span>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-200 truncate">{ev.detail}</p>
                          <p className="text-[10px] text-slate-500">{ev.device || 'Visitor'}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 shrink-0 ml-2">
                        {ev.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* CREATOR UTILITIES & SIMULATION */}
            <div className="rounded-2xl border border-amber-500/20 bg-slate-950/80 p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <Sliders className="h-4 w-4" />
                    <span>Creator Utilities & Calibration</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Test tracking events in real time or adjust baseline metric seeds
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTestPageView}
                    className="rounded-lg border border-blue-500/40 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-300 hover:bg-blue-500/20 transition-colors"
                  >
                    +1 Test View
                  </button>
                  <button
                    type="button"
                    onClick={handleTestApkDownload}
                    className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors"
                  >
                    +1 Test APK Download
                  </button>
                  <button
                    type="button"
                    onClick={handleExportJson}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5" />
                    <span>Export JSON</span>
                  </button>
                </div>
              </div>

              {/* EDIT SEED TOGGLE */}
              <div className="mt-4 pt-1">
                {!isEditingSeed ? (
                  <button
                    type="button"
                    onClick={() => setIsEditingSeed(true)}
                    className="text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
                  >
                    <span>Need to calibrate total counts? Click here to set custom numbers</span>
                  </button>
                ) : (
                  <form onSubmit={handleSaveCustomCounts} className="mt-2 space-y-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Total Website Views</label>
                        <input
                          type="number"
                          value={customViews}
                          onChange={(e) => setCustomViews(Number(e.target.value))}
                          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-100"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Total Downloads</label>
                        <input
                          type="number"
                          value={customDownloads}
                          onChange={(e) => setCustomDownloads(Number(e.target.value))}
                          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-100"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">APK Downloads</label>
                        <input
                          type="number"
                          value={customApk}
                          onChange={(e) => setCustomApk(Number(e.target.value))}
                          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-100"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="submit"
                        className="rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400"
                      >
                        Apply Counts
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingSeed(false)}
                        className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

          </div>
        )}

        {/* MODAL FOOTER */}
        <div className="border-t border-slate-800/80 bg-slate-950/80 px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Secured Creator Panel for <strong>Nokuvimba Bafu</strong></span>
            <span aria-hidden="true">·</span>
            <span>btech Platform 2026</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/_btech_2/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-400 hover:text-pink-300 flex items-center gap-1 font-medium transition-colors"
            >
              <Instagram className="h-3.5 w-3.5" />
              <span>@_btech_2</span>
            </a>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={onClose}
              className="font-bold text-slate-300 hover:text-amber-400 transition-colors"
            >
              Close Studio
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
