import React from 'react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  Music,
  BookOpen,
  Compass,
  Download,
  GraduationCap,
  Sliders,
  Layers,
  Hash,
  FileText,
  MoveHorizontal,
  Disc,
  Award,
  Heart
} from 'lucide-react';
import { brassAudio } from '../audio/brassAudio';

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

        {/* Navigation Tiles */}
        <nav className="flex items-center gap-1 sm:gap-2 lg:gap-3 overflow-x-auto py-1 text-xs font-medium text-slate-300 scrollbar-none">

          {/* Instruments / Academy */}
          <button
            type="button"
            onClick={() => setActiveTab('academy')}
            className={`whitespace-nowrap px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'academy'
                ? 'bg-amber-400/15 text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'hover:text-amber-200 hover:bg-slate-900/60'
            }`}
          >
            <Music className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span>Instruments</span>
          </button>

          {/* Music Theory Academy */}
          <button
            type="button"
            onClick={() => setActiveTab('theory')}
            className={`whitespace-nowrap px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'theory'
                ? 'bg-amber-400/15 text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'hover:text-amber-200 hover:bg-slate-900/60'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span>Theory Academy</span>
            <span className="rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[9px] text-amber-300 font-bold border border-amber-500/30">
              16 Modules
            </span>
          </button>

          {/* Bandmaster Academy */}
          <button
            type="button"
            onClick={() => setActiveTab('bandmaster')}
            className={`whitespace-nowrap px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'bandmaster'
                ? 'bg-amber-400/15 text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'hover:text-amber-200 hover:bg-slate-900/60'
            }`}
          >
            <Compass className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span>Bandmaster</span>
            <span className="rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[9px] text-amber-300 font-bold border border-amber-500/30">
              Academy
            </span>
          </button>

          {/* Offline Learning */}
          <button
            type="button"
            onClick={() => setActiveTab('offline')}
            className={`whitespace-nowrap px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'offline'
                ? 'bg-amber-400/15 text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'hover:text-amber-200 hover:bg-slate-900/60'
            }`}
          >
            <Download className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span>Offline Library</span>
          </button>

          {/* School & Band Mode (Groups) */}
          <button
            type="button"
            onClick={() => setActiveTab('groups')}
            className={`whitespace-nowrap px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'groups'
                ? 'bg-amber-400/15 text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'hover:text-amber-200 hover:bg-slate-900/60'
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span>School & Band Mode</span>
            <span className="rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[9px] text-amber-300 font-bold border border-amber-500/30">
              New
            </span>
          </button>

          {/* Music Tutor */}
          <button
            type="button"
            onClick={() => setActiveTab('musicTutor')}
            className={`whitespace-nowrap px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'musicTutor'
                ? 'bg-amber-400/15 text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'hover:text-amber-200 hover:bg-slate-900/60'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span>Music Tutor</span>
          </button>

          {/* Tuner */}
          <button
            type="button"
            onClick={() => setActiveTab('tuner')}
            className={`whitespace-nowrap px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'tuner'
                ? 'bg-amber-400/15 text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'hover:text-amber-200 hover:bg-slate-900/60'
            }`}
          >
            <Sliders className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span>Tuner</span>
          </button>

          {/* Scales */}
          <button
            type="button"
            onClick={() => setActiveTab('scales')}
            className={`whitespace-nowrap px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'scales'
                ? 'bg-amber-400/15 text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'hover:text-amber-200 hover:bg-slate-900/60'
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span>All Brass Scales</span>
          </button>

          {/* Sharps & Flats */}
          <button
            type="button"
            onClick={() => setActiveTab('accidentals')}
            className={`whitespace-nowrap px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'accidentals'
                ? 'bg-amber-400/15 text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'hover:text-amber-200 hover:bg-slate-900/60'
            }`}
          >
            <Hash className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span>Sharps & Flats</span>
          </button>

          {/* Scores */}
          <button
            type="button"
            onClick={() => setActiveTab('scores')}
            className={`whitespace-nowrap px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'scores'
                ? 'bg-amber-400/15 text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'hover:text-amber-200 hover:bg-slate-900/60'
            }`}
          >
            <FileText className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span>25+ Free Scores</span>
            <span className="rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[10px] text-amber-300 font-bold border border-amber-500/30">
              Hymns & Marches
            </span>
          </button>

          {/* Trombone */}
          <button
            type="button"
            onClick={() => setActiveTab('trombone')}
            className={`whitespace-nowrap px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'trombone'
                ? 'bg-amber-400/15 text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'hover:text-amber-200 hover:bg-slate-900/60'
            }`}
          >
            <MoveHorizontal className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span>Trombone Slide</span>
          </button>

          {/* Percussion */}
          <button
            type="button"
            onClick={() => setActiveTab('percussion')}
            className={`whitespace-nowrap px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'percussion'
                ? 'bg-amber-400/15 text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'hover:text-amber-200 hover:bg-slate-900/60'
            }`}
          >
            <Disc className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span>Percussion</span>
          </button>

          {/* Theory Quiz */}
          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            className={`whitespace-nowrap px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'quiz'
                ? 'bg-amber-400/15 text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'hover:text-amber-200 hover:bg-slate-900/60'
            }`}
          >
            <Award className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span>Theory Quiz</span>
          </button>

          {/* About */}
          <button
            type="button"
            onClick={() => setActiveTab('about')}
            className={`whitespace-nowrap px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'about'
                ? 'bg-amber-400/15 text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'hover:text-amber-200 hover:bg-slate-900/60'
            }`}
          >
            <Heart className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span>About Founder</span>
          </button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">

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

        </div>
      </div>
    </header>
  );
};

