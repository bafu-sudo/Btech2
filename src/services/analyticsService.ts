export interface AnalyticsData {
totalViews: number;
apkDownloads: number;
instagramClicks: number;
pageViews: Record<string, number>;
}

type AnalyticsListener = (data: AnalyticsData) => void;

const STORAGE_KEY = 'btech2_analytics';

const defaultAnalytics: AnalyticsData = {
totalViews: 0,
apkDownloads: 0,
instagramClicks: 0,
pageViews: {},
};

function loadAnalytics(): AnalyticsData {
try {
const saved = localStorage.getItem(STORAGE_KEY);

if (!saved) {
  return { ...defaultAnalytics };
}

const parsed = JSON.parse(saved);

return {
  totalViews:
    typeof parsed.totalViews === 'number'
      ? parsed.totalViews
      : 0,

  apkDownloads:
    typeof parsed.apkDownloads === 'number'
      ? parsed.apkDownloads
      : 0,

  instagramClicks:
    typeof parsed.instagramClicks === 'number'
      ? parsed.instagramClicks
      : 0,

  pageViews:
    parsed.pageViews &&
    typeof parsed.pageViews === 'object'
      ? parsed.pageViews
      : {},
};

} catch {
return { ...defaultAnalytics };
}
}

let analytics: AnalyticsData = loadAnalytics();

const listeners = new Set<AnalyticsListener>();

function saveAnalytics() {
try {
localStorage.setItem(
STORAGE_KEY,
JSON.stringify(analytics)
);
} catch {
// Ignore storage errors.
}

listeners.forEach((listener) => {
listener({ ...analytics });
});
}

export const analyticsService = {
getAnalytics(): AnalyticsData {
return { ...analytics };
},

subscribe(listener: AnalyticsListener) {
listeners.add(listener);

listener({ ...analytics });

return () => {
  listeners.delete(listener);
};

},

recordPageView(page: string) {
analytics.totalViews += 1;

analytics.pageViews[page] =
  (analytics.pageViews[page] || 0) + 1;

saveAnalytics();

},

recordDownload(
_fileName: string,
_type: string
) {
analytics.apkDownloads += 1;
saveAnalytics();
},

recordInstagramClick() {
analytics.instagramClicks += 1;
saveAnalytics();
},

isCreatorAuthenticated(): boolean {
return true;
},
};
