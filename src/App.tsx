import React, { useEffect, useState } from 'react';
import Tuner from './components/Tuner';
import { Header } from './components/Header';
import { BrassAcademy } from './components/BrassAcademy';
import { ScaleStudio } from './components/ScaleStudio';
import { SharpsFlatsMasterclass } from './components/SharpsFlatsMasterclass';
import { ScoreLibrary } from './components/ScoreLibrary';
import { TromboneSlideStudio } from './components/TromboneSlideStudio';
import { PercussionLab } from './components/PercussionLab';
import { QuizStudio } from './components/QuizStudio';
import { AboutFounder } from './components/AboutFounder';
import MusicTutor from './components/MusicTutor';
import { SchoolBandManager } from './components/SchoolBandManager';
import { BandmasterAcademy } from './components/BandmasterAcademy';
import { OfflineLearning } from './components/OfflineLearning';
import { TheoryAcademy } from './components/TheoryAcademy';
import { CreatorDashboard } from './components/CreatorDashboard';
import { DownloadThankYouModal } from './components/DownloadThankYouModal';
import {
analyticsService,
AnalyticsData,
} from './services/analyticsService';
import {
Instagram,
Smartphone,
ShieldCheck,
Eye,
Download,
} from 'lucide-react';

type ActiveTab =
| 'academy'
| 'theory'
| 'bandmaster'
| 'offline'
| 'groups'
| 'chat'
| 'scales'
| 'accidentals'
| 'scores'
| 'trombone'
| 'percussion'
| 'quiz'
| 'about'
| 'musicTutor'
| 'tuner';

export default function App() {
const [activeTab, setActiveTab] =
useState<ActiveTab>('academy');

const [isMuted, setIsMuted] =
useState<boolean>(false);

const [isCreatorOpen, setIsCreatorOpen] =
useState<boolean>(false);

const [isCreatorMode, setIsCreatorMode] =
useState<boolean>(false);

const [isThankYouOpen, setIsThankYouOpen] =
useState<boolean>(false);

const [analyticsData, setAnalyticsData] =
useState<AnalyticsData>(
analyticsService.getAnalytics()
);

useEffect(() => {
analyticsService.recordPageView(activeTab);
}, [activeTab]);

useEffect(() => {
const unsubscribe = analyticsService.subscribe((data) => {
setAnalyticsData(data);
setIsCreatorMode(
analyticsService.isCreatorAuthenticated()
);
});


if (
  typeof window !== 'undefined' &&
  (
    window.location.search.includes('creator') ||
    window.location.hash === '#creator'
  )
) {
  setIsCreatorOpen(true);
}

return unsubscribe;


}, []);

const handleApkDownloadClick = () => {
analyticsService.recordDownload(
'Btech2.apk',
'apk'
);


setIsThankYouOpen(true);


};

const handleInstagramClick = () => {
analyticsService.recordInstagramClick();
};

return ( <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-black">


  <Header
    activeTab={activeTab}
    setActiveTab={setActiveTab}
    isMuted={isMuted}
    setIsMuted={setIsMuted}
    onOpenCreator={() => setIsCreatorOpen(true)}
  />

  <div className="border-b border-slate-900 bg-slate-900/50 py-3 px-4">
    <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-center sm:justify-between gap-3">

      <div className="flex items-center gap-2 text-xs text-slate-300">

        <span className="font-serif font-bold text-amber-400">
          Btech2 Mobile & Web
        </span>

        <span
          aria-hidden="true"
          className="text-slate-600"
        >
          Â·
        </span>

        <span className="hidden sm:inline text-slate-400">
          Brass education for cornet, horn, trombone,
          euphonium & tuba
        </span>

      </div>

      <div className="flex flex-wrap items-center justify-center gap-2.5">

        <a
          href={
            import.meta.env.BASE_URL +
            'app-release.apk'
          }
          download="Btech2.apk"
          onClick={handleApkDownloadClick}
          className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-md transition hover:bg-amber-400 hover:scale-105"
        >
          <Smartphone className="h-4 w-4" />
          <span>
            Download Btech2 APK
          </span>
        </a>

        <a
          href="https://www.instagram.com/_btech_2/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleInstagramClick}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:brightness-110 hover:scale-105"
        >
          <Instagram className="h-4 w-4" />

          <span>
            Connect with us on Instagram
          </span>

          <span className="rounded bg-black/25 px-1.5 py-0.5 font-mono text-[10px] text-pink-100">
            @_btech_2
          </span>
        </a>

      </div>
    </div>
  </div>

  <main className="flex-1">

    {activeTab === 'academy' && (
      <BrassAcademy />
    )}

    {activeTab === 'theory' && (
      <TheoryAcademy />
    )}

    {activeTab === 'bandmaster' && (
      <BandmasterAcademy />
    )}

    {activeTab === 'offline' && (
      <OfflineLearning />
    )}

    {activeTab === 'groups' && (
      <SchoolBandManager
        onNavigateToTab={(tab) =>
          setActiveTab(tab)
        }
      />
    )}

    {activeTab === 'chat' && (
      <SchoolBandManager
        initialSubTab="chat"
        onNavigateToTab={(tab) =>
          setActiveTab(tab)
        }
      />
    )}

    {activeTab === 'musicTutor' && (
      <MusicTutor />
    )}

    {activeTab === 'tuner' && (
      <Tuner />
    )}

    {activeTab === 'scales' && (
      <ScaleStudio />
    )}

    {activeTab === 'accidentals' && (
      <SharpsFlatsMasterclass />
    )}

    {activeTab === 'scores' && (
      <ScoreLibrary />
    )}

    {activeTab === 'trombone' && (
      <TromboneSlideStudio />
    )}

    {activeTab === 'percussion' && (
      <PercussionLab />
    )}

    {activeTab === 'quiz' && (
      <QuizStudio />
    )}

    {activeTab === 'about' && (
      <AboutFounder />
    )}

  </main>

  <section className="border-t border-slate-900 bg-slate-950/90 py-8 px-4 text-center">
    <div className="mx-auto max-w-3xl">

      <p className="font-serif text-base sm:text-lg font-semibold text-amber-300 italic">
        "I struggled to teach myself brass music, so I want to make it easier for the next person."
      </p>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">

        <span>
          Founded by <strong>Nokuvimba Bafu</strong>
        </span>

        <span aria-hidden="true">
          Â·
        </span>

        <span>
          Zimbabwe
        </span>

        <span aria-hidden="true">
          Â·
        </span>

        <span>
          Dedicated to Salvation Army & British Brass Band Learners Worldwide
        </span>

        <span aria-hidden="true">
          Â·
        </span>

        <a
          href="https://www.instagram.com/_btech_2/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleInstagramClick}
          className="inline-flex items-center gap-1 font-semibold text-pink-400 hover:text-pink-300 transition-colors"
        >
          <Instagram className="h-3 w-3" />

          <span>
            Connect on Instagram: @_btech_2
          </span>
        </a>

      </div>
    </div>
  </section>

  <footer className="border-t border-slate-900/80 bg-slate-950 py-6 px-4 text-xs text-slate-500">

    <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">

      <div className="flex flex-wrap items-center gap-2">

        <span className="font-serif font-bold text-amber-400">
          Btech2
        </span>

        <span aria-hidden="true">
          Â·
        </span>

        <span>
          The Complete Brass Band & Conducting Academy
        </span>

        <span aria-hidden="true">
          Â·
        </span>

        <span className="text-amber-300 font-medium">
          "Learn. Practise. Conduct. Perform."
        </span>

      </div>

      <div className="flex flex-wrap items-center gap-3 text-slate-400">

        <a
          href="https://www.instagram.com/_btech_2/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleInstagramClick}
          className="flex items-center gap-1 text-pink-400 hover:text-pink-300 font-medium transition-colors"
        >
          <Instagram className="h-3.5 w-3.5" />

          <span>
            Connect with us on Instagram (@_btech_2)
          </span>
        </a>

        <span
          aria-hidden="true"
          className="text-slate-700"
        >
          Â·
        </span>

        <button
          type="button"
          onClick={() =>
            setIsCreatorOpen(true)
          }
          className="flex items-center gap-1 text-slate-500 hover:text-amber-400 transition-colors"
          title="Creator Only: View Website Views & Download Counts"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-amber-500/70" />

          <span>
            Creator Portal (Nokuvimba Only)
          </span>
        </button>

      </div>
    </div>
  </footer>

  {isCreatorMode && (
    <aside
      aria-label="Creator Analytics Quick View"
      onClick={() =>
        setIsCreatorOpen(true)
      }
      className="fixed bottom-4 right-4 z-40 flex items-center gap-2.5 rounded-full border border-amber-500/50 bg-slate-900/95 px-3.5 py-2 text-xs font-semibold text-amber-300 shadow-xl shadow-amber-500/10 backdrop-blur hover:bg-slate-800 transition-all cursor-pointer"
      title="Click to open Creator Analytics Studio"
    >

      <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />

      <span className="font-bold">
        ðŸ‘‘ Creator Mode
      </span>

      <span className="text-slate-600">
        |
      </span>

      <span className="flex items-center gap-1 text-blue-300">
        <Eye className="h-3.5 w-3.5" />

        <span>
          {analyticsData.totalViews.toLocaleString()}
        </span>
      </span>

      <span className="text-slate-600">
        |
      </span>

      <span className="flex items-center gap-1 text-amber-300">
        <Download className="h-3.5 w-3.5" />

        <span>
          {analyticsData.apkDownloads.toLocaleString()} APK
        </span>
      </span>

    </aside>
  )}

  <CreatorDashboard
    isOpen={isCreatorOpen}
    onClose={() =>
      setIsCreatorOpen(false)
    }
  />

  <DownloadThankYouModal
    isOpen={isThankYouOpen}
    onClose={() =>
      setIsThankYouOpen(false)
    }
    downloadedItemName="Btech2.apk (Android Package)"
    onOpenGroupChat={() =>
      setActiveTab('chat')
    }
  />

</div>


);
}


