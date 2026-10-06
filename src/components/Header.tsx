import React from 'react';
import { Volume2, VolumeX, Sparkles, User, Award } from 'lucide-react';
import { brassAudio } from '../audio/brassAudio';

interface HeaderProps {
  activeTab: 'academy' | 'scales' | 'accidentals' | 'scores' | 'trombone' | 'percussion' | 'quiz' | 'about';
  setActiveTab: (tab: 'academy' | 'scales' | 'accidentals' | 'scores' | 'trombone' | 'percussion' | 'quiz' | 'about') => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isMuted,
  setIsMuted
}) => {
  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    brassAudio.setMuted(next);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2.5 sm:px-6">
        {/* Zone 1: Brand title, one line wordmark */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('academy')}
            className="flex items-center gap-2 text-left transition-opacity hover:opacity-90"
          >
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-amber-400">
              btech
            </span>
            <span className="hidden text-xs text-slate-400 md:inline" aria-hidden="true">
              ·
            </span>
            <span className="hidden text-xs font-medium text-slate-400 md:inline">
              British Brass Band Academy
            </span>
          </button>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="flex items-center gap-1 sm:gap-3 lg:gap-5 overflow-x-auto py-1 text-xs font-medium text-slate-300 scrollbar-none">
          <button
            onClick={() => setActiveTab('academy')}
            className={`whitespace-nowrap px-2 py-1 transition-colors ${
              activeTab === 'academy'
                ? 'border-b-2 border-amber-400 font-semibold text-amber-400'
                : 'hover:text-amber-200'
            }`}
          >
            Instruments
          </button>

          <button
            onClick={() => setActiveTab('scales')}
            className={`whitespace-nowrap px-2 py-1 transition-colors ${
              activeTab === 'scales'
                ? 'border-b-2 border-amber-400 font-semibold text-amber-400'
                : 'hover:text-amber-200'
            }`}
          >
            All Brass Scales
          </button>

          <button
            onClick={() => setActiveTab('accidentals')}
            className={`whitespace-nowrap px-2 py-1 transition-colors ${
              activeTab === 'accidentals'
                ? 'border-b-2 border-amber-400 font-semibold text-amber-400'
                : 'hover:text-amber-200'
            }`}
          >
            Sharps & Flats
          </button>

          <button
            onClick={() => setActiveTab('scores')}
            className={`whitespace-nowrap px-2 py-1 transition-colors ${
              activeTab === 'scores'
                ? 'border-b-2 border-amber-400 font-semibold text-amber-400'
                : 'hover:text-amber-200'
            }`}
          >
            <span className="flex items-center gap-1">
              <span>25+ Free Scores</span>
              <span className="rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[10px] text-amber-300 font-bold border border-amber-500/30">Hymns & Marches</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('trombone')}
            className={`whitespace-nowrap px-2 py-1 transition-colors ${
              activeTab === 'trombone'
                ? 'border-b-2 border-amber-400 font-semibold text-amber-400'
                : 'hover:text-amber-200'
            }`}
          >
            Trombone Slide
          </button>

          <button
            onClick={() => setActiveTab('percussion')}
            className={`whitespace-nowrap px-2 py-1 transition-colors ${
              activeTab === 'percussion'
                ? 'border-b-2 border-amber-400 font-semibold text-amber-400'
                : 'hover:text-amber-200'
            }`}
          >
            Percussion
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`whitespace-nowrap px-2 py-1 transition-colors ${
              activeTab === 'quiz'
                ? 'border-b-2 border-amber-400 font-semibold text-amber-400'
                : 'hover:text-amber-200'
            }`}
          >
            Theory Quiz
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`whitespace-nowrap px-2 py-1 transition-colors ${
              activeTab === 'about'
                ? 'border-b-2 border-amber-400 font-semibold text-amber-400'
                : 'hover:text-amber-200'
            }`}
          >
            About Founder
          </button>
        </nav>

        {/* Zone 3: Primary actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute brass sound' : 'Mute brass sound'}
            title={isMuted ? 'Unmute Brass Audio' : 'Mute Brass Audio'}
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 transition-colors hover:border-slate-700 hover:text-amber-400 shrink-0"
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4" />}
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className="hidden xl:flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-xs font-semibold text-amber-300 transition-colors hover:bg-amber-500/20 whitespace-nowrap"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Nokuvimba Bafu</span>
          </button>
        </div>
      </div>
    </header>
  );
};
