import React from 'react';
import { Volume2, VolumeX, Sparkles, Instagram, ShieldCheck } from 'lucide-react';
import { brassAudio } from '../audio/brassAudio';
import { analyticsService } from '../services/analyticsService';

type ActiveTab =
  | 'academy'
  | 'theory'
  | 'bandmaster'
  | 'offline'
  | 'groups'
  | 'chat'
  | 'musicTutor'
  | 'tuner'
  | 'scales'
  | 'accidentals'
  | 'scores'
  | 'trombone'
  | 'percussion'
  | 'quiz'
  | 'about';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  onOpenCreator?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isMuted,
  setIsMuted,
  onOpenCreator
}) => {
  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    brassAudio.setMuted(next);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2.5 sm:px-6">

        {/* Brand */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('academy')}
            className="flex items-center gap-2.5 text-left transition-opacity hover:opacity-90 group"
          >
            {/* Elegant Brass Insignia Icon */}
            <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 shadow-lg shadow-amber-500/20 ring-1 ring-amber-300/40">
              <span className="font-serif text-slate-950 font-black text-sm tracking-tighter">B2</span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-serif text-lg sm:text-xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500">
                  Btech2
                </span>
                <span className="rounded bg-amber-500/10 px-1 py-0.2 text-[9px] font-bold text-amber-300 border border-amber-500/20">
                  ACADEMY
                </span>
              </div>
              <span className="hidden text-[10px] font-medium text-slate-400 sm:inline mt-0.5 tracking-tight">
                Brass Band & Conducting Platform
              </span>
            </div>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1 sm:gap-3 lg:gap-5 overflow-x-auto py-1 text-xs font-medium text-slate-300 scrollbar-none">

          {/* Instruments */}
          <button
            type="button"
            onClick={() => setActiveTab('academy')}
            className={`whitespace-nowrap px-2 py-1 transition-colors ${
              activeTab === 'academy'
                ? 'border-b-2 border-amber-400 font-semibold text-amber-400'
                : 'hover:text-amber-200'
            }`}
          >
            Instruments
          </button>

          {/* Music Theory Academy */}
          <button
            type="button"
            onClick={() => setActiveTab('theory')}
            className={`whitespace-nowrap px-2 py-1 transition-colors flex items-center gap-1.5 ${
              activeTab === 'theory'
                ? 'border-b-2 border-amber-400 font-semibold text-amber-400'
                : 'hover:text-amber-200'
            }`}
          >
            <span>🎼 Theory Academy</span>
            <span className="rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[9px] text-amber-300 font-bold border border-amber-500/30">
              16 Modules
            </span>
          </button>

          {/* Bandmaster Academy */}
          <button
            type="button"
            onClick={() => setActiveTab('bandmaster')}
            className={`whitespace-nowrap px-2 py-1 transition-colors flex items-center gap-1.5 ${
              activeTab === 'bandmaster'
                ? 'border-b-2 border-amber-400 font-semibold text-amber-400'
                : 'hover:text-amber-200'
            }`}
          >
            <span>🧭 Bandmaster</span>
            <span className="rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[9px] text-amber-300 font-bold border border-amber-500/30">
              Academy
            </span>
          </button>

          {/* Offline Learning */}
          <button
            type="button"
            onClick={() => setActiveTab('offline')}
            className={`whitespace-nowrap px-2 py-1 transition-colors flex items-center gap-1.5 ${
              activeTab === 'offline'
                ? 'border-b-2 border-amber-400 font-semibold text-amber-400'
                : 'hover:text-amber-200'
            }`}
          >
            <span>📥 Offline Library</span>
          </button>

          {/* School & Band Mode (Groups) */}
          <button
            type="button"
            onClick={() => setActiveTab('groups')}
            className={`whitespace-nowrap px-2 py-1 transition-colors flex items-center gap-1.5 ${
              activeTab === 'groups'
                ? 'border-b-2 border-amber-400 font-semibold text-amber-400'
                : 'hover:text-amber-200'
            }`}
          >
            <span>🏫 School & Band Mode</span>
            <span className="rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[9px] text-amber-300 font-bold border border-amber-500/30">
              New
            </span>
          </button>

          {/* Live Band Chat */}
          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`whitespace-nowrap px-2 py-1 transition-colors flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'border-b-2 border-amber-400 font-semibold text-amber-400'
                : 'hover:text-amber-200'
            }`}
          >
            <span>💬 Live Band Chat</span>
            <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.2 text-[9px] text-emerald-400 font-bold border border-emerald-500/30">
              Real-Time
            </span>
          </button>

          {/* Music Tutor */}
          <button
            type="button"
            onClick={() => setActiveTab('musicTutor')}
            className={`whitespace-nowrap px-2 py-1 transition-colors ${
              activeTab === 'musicTutor'
                ? 'border-b-2 border-amber-400 font-semibold text-amber-400'
                : 'hover:text-amber-200'
            }`}
          >
            🎼 Music Tutor
          </button>

          {/* Tuner */}
          <button
            type="button"
            onClick={() => setActiveTab('tuner')}
            className={`whitespace-nowrap px-2 py-1 transition-colors ${
              activeTab === 'tuner'
                ? 'border-b-2 border-amber-400 font-semibold text-amber-400'
                : 'hover:text-amber-200'
            }`}
          >
            🎛️ Tuner
          </button>

          {/* Scales */}
          <button
            type="button"
            onClick={() => setActiveTab('scales')}
            className={`whitespace-nowrap px-2 py-1 transition-colors ${
              activeTab === 'scales'
                ? 'border-b-2 border-amber-400 font-semibold text-amber-400'
                : 'hover:text-amber-200'
            }`}
          >
            All Brass Scales
          </button>

          {/* Sharps & Flats */}
          <button
            type="button"
            onClick={() => setActiveTab('accidentals')}
            className={`whitespace-nowrap px-2 py-1 transition-colors ${
              activeTab === 'accidentals'
                ? 'border-b-2 border-amber-400 font-semibold text-amber-400'
                : 'hover:text-amber-200'
            }`}
          >
            Sharps & Flats
          </button>

          {/* Scores */}
          <button
            type="button"
            onClick={() => setActiveTab('scores')}
            className={`whitespace-nowrap px-2 py-1 transition-colors ${
              activeTab === 'scores'
                ? 'border-b-2 border-amber-400 font-semibold text-amber-400'
                : 'hover:text-amber-200'
            }`}
          >
            <span className="flex items-center gap-1">
              <span>25+ Free Scores</span>

              <span className="rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[10px] text-amber-300 font-bold border border-amber-500/30">
                Hymns & Marches
              </span>
            </span>
          </button>

          {/* Trombone */}
          <button
            type="button"
            onClick={() => setActiveTab('trombone')}
            className={`whitespace-nowrap px-2 py-1 transition-colors ${
              activeTab === 'trombone'
                ? 'border-b-2 border-amber-400 font-semibold text-amber-400'
                : 'hover:text-amber-200'
            }`}
          >
            Trombone Slide
          </button>

          {/* Percussion */}
          <button
            type="button"
            onClick={() => setActiveTab('percussion')}
            className={`whitespace-nowrap px-2 py-1 transition-colors ${
              activeTab === 'percussion'
                ? 'border-b-2 border-amber-400 font-semibold text-amber-400'
                : 'hover:text-amber-200'
            }`}
          >
            Percussion
          </button>

          {/* Theory Quiz */}
          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            className={`whitespace-nowrap px-2 py-1 transition-colors ${
              activeTab === 'quiz'
                ? 'border-b-2 border-amber-400 font-semibold text-amber-400'
                : 'hover:text-amber-200'
            }`}
          >
            Theory Quiz
          </button>

          {/* About */}
          <button
            type="button"
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

        {/* Actions */}
        <div className="flex items-center gap-2">

          {/* Connect with us on Instagram */}
          <a
            href="https://www.instagram.com/_btech_2/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => analyticsService.recordInstagramClick()}
            title="Connect with us on Instagram @_btech_2"
            className="flex items-center gap-1.5 rounded-lg border border-pink-500/30 bg-gradient-to-r from-purple-500/10 via-pink-500/15 to-amber-500/10 px-2.5 py-1.5 text-xs font-semibold text-pink-300 transition-all hover:bg-pink-500/25 hover:border-pink-500/50 hover:text-pink-200 whitespace-nowrap shadow-sm"
          >
            <Instagram className="h-3.5 w-3.5 text-pink-400 shrink-0" />
            <span className="hidden sm:inline">Connect with us on Instagram</span>
            <span className="sm:hidden font-mono text-[11px]">@_btech_2</span>
          </a>

          {/* Mute */}
          <button
            type="button"
            onClick={toggleMute}
            aria-label={
              isMuted
                ? 'Unmute brass sound'
                : 'Mute brass sound'
            }
            title={
              isMuted
                ? 'Unmute Brass Audio'
                : 'Mute Brass Audio'
            }
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 transition-colors hover:border-slate-700 hover:text-amber-400 shrink-0"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4 text-rose-400" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>

          {/* Founder */}
          <button
            type="button"
            onClick={() => setActiveTab('about')}
            className="hidden xl:flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-xs font-semibold text-amber-300 transition-colors hover:bg-amber-500/20 whitespace-nowrap"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Nokuvimba Bafu</span>
          </button>

          {/* Creator Private Access */}
          {onOpenCreator && (
            <button
              type="button"
              onClick={onOpenCreator}
              title="Creator Studio (Nokuvimba Bafu Only)"
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-amber-400 hover:border-amber-500/30 transition-colors shrink-0"
            >
              <ShieldCheck className="h-4 w-4" />
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
