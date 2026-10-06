import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Square, 
  Volume2, 
  Sparkles, 
  BookOpen, 
  Music, 
  RotateCcw,
  Sliders,
  Award,
  ChevronRight,
  Download,
  Info,
  Clock,
  Tag,
  Search,
  X
} from 'lucide-react';
import { BRASS_SCORES } from '../data/scoresData';
import { ScorePiece, MelodyNote } from '../types';
import { brassAudio } from '../audio/brassAudio';

export const ScoreLibrary: React.FC = () => {
  const [selectedPiece, setSelectedPiece] = useState<ScorePiece>(BRASS_SCORES[0]);
  const [selectedInstrumentPart, setSelectedInstrumentPart] = useState<'Bb' | 'Eb' | 'Concert'>('Bb');
  const [activeNoteIndex, setActiveNoteIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [tempoMultiplier, setTempoMultiplier] = useState<number>(1.0);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [timbreChoice, setTimbreChoice] = useState<'auto' | 'cornet' | 'horn' | 'euphonium' | 'trombone'>('auto');
  const [stopPlaybackFn, setStopPlaybackFn] = useState<(() => void) | null>(null);
  const [showAbcView, setShowAbcView] = useState<boolean>(false);

  const categories = ['All', 'Salvation Army Hymn', 'British Band March', 'Cornet Solo & Air', 'Folk & Traditional'];

  const filteredScores = BRASS_SCORES.filter(score => {
    const matchesCategory = categoryFilter === 'All' || score.category === categoryFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      score.title.toLowerCase().includes(q) ||
      score.subtitle.toLowerCase().includes(q) ||
      score.composer.toLowerCase().includes(q) ||
      score.origin.toLowerCase().includes(q) ||
      (score.lyricsOrVerse && score.lyricsOrVerse.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  // Cleanup on unmount or piece switch
  useEffect(() => {
    return () => {
      if (stopPlaybackFn) stopPlaybackFn();
    };
  }, [stopPlaybackFn]);

  const handleStop = () => {
    if (stopPlaybackFn) {
      stopPlaybackFn();
      setStopPlaybackFn(null);
    }
    setIsPlaying(false);
    setActiveNoteIndex(null);
  };

  const handlePlayPiece = () => {
    if (isPlaying) {
      handleStop();
      return;
    }

    setIsPlaying(true);

    const notesToPlay = selectedPiece.melodyNotes.map(n => {
      let freq = n.freqBb;
      if (selectedInstrumentPart === 'Eb') freq = n.freqEb;
      if (selectedInstrumentPart === 'Concert') freq = n.freqConcert;

      const baseBeatDurationMs = (60000 / selectedPiece.tempoBpm) * n.durationBeats;
      return {
        freqHz: freq,
        durationMs: baseBeatDurationMs,
        isRest: n.isRest
      };
    });

    const timbre = timbreChoice !== 'auto'
      ? timbreChoice
      : (selectedInstrumentPart === 'Eb' ? 'horn' : 'cornet');

    const cancel = brassAudio.playScoreMelody(
      notesToPlay,
      tempoMultiplier,
      idx => {
        setActiveNoteIndex(idx);
      },
      () => {
        setIsPlaying(false);
        setActiveNoteIndex(null);
      },
      timbre
    );

    setStopPlaybackFn(() => cancel);
  };

  const handleNoteAudition = (note: MelodyNote, index: number) => {
    if (isPlaying) handleStop();
    setActiveNoteIndex(index);
    let freq = note.freqBb;
    if (selectedInstrumentPart === 'Eb') freq = note.freqEb;
    if (selectedInstrumentPart === 'Concert') freq = note.freqConcert;

    const timbre = timbreChoice !== 'auto'
      ? timbreChoice
      : (selectedInstrumentPart === 'Eb' ? 'horn' : 'cornet');
    brassAudio.playBrassTone(freq, 0.7, timbre);
  };

  const activeNote = activeNoteIndex !== null ? selectedPiece.melodyNotes[activeNoteIndex] : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
          <Sparkles className="h-4 w-4" />
          <span>Interactive Sheet Music & Practice Repertoire</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
          Salvation Army & British Brass Band Repertoire (27 Authentic Scores)
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-3xl">
          Practise real authentic music directly in your browser. Choose between B♭, E♭, and Concert pitch parts, adjust tempos to practice slowly, and follow interactive note-by-note valve fingerings and trombone slide positions.
        </p>
      </div>

      {/* Main Grid: Left = Song Explorer & List, Right = Score Reader & Player */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Song Directory & Filters */}
        <div className="lg:col-span-4 space-y-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search hymns, marches, titles..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2.5 pl-10 pr-9 text-xs text-slate-200 placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg">
            <span className="text-xs uppercase font-semibold text-slate-400 block mb-2">
              Filter by Repertoire Category:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                    categoryFilter === cat
                      ? 'bg-amber-400 font-bold text-slate-950'
                      : 'border border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Song List Cards */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 shadow-lg max-h-[640px] overflow-y-auto space-y-2">
            <div className="px-2 py-1 text-xs font-semibold text-slate-400 flex items-center justify-between">
              <span>{filteredScores.length} Available Scores</span>
              <span className="text-[11px] text-amber-400">Click to load</span>
            </div>

            {filteredScores.map(score => {
              const isSelected = selectedPiece.id === score.id;
              return (
                <button
                  key={score.id}
                  onClick={() => {
                    handleStop();
                    setSelectedPiece(score);
                  }}
                  className={`w-full text-left rounded-xl p-3 transition-all border flex items-start justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? 'border-amber-400 bg-amber-400/10 shadow-md ring-1 ring-amber-400/40'
                      : 'border-slate-800/80 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-serif text-sm font-bold text-slate-100">
                        {score.title}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {score.subtitle}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-2">
                      <span className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-300">
                        {score.category.split(' ')[0]}
                      </span>
                      <span>{score.timeSignature}</span>
                      <span>·</span>
                      <span>{score.tempoBpm} BPM</span>
                      <span>·</span>
                      <span className={score.difficulty === 'Beginner' ? 'text-emerald-400' : 'text-amber-400'}>
                        {score.difficulty}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${isSelected ? 'text-amber-400 translate-x-1' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Score Runner & Stave Viewer */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-3xl border border-amber-500/30 bg-slate-900/90 p-6 sm:p-8 shadow-2xl">
            {/* Score Title & Header Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="rounded-md bg-amber-400/20 px-2 py-0.5 font-mono text-[11px] font-bold text-amber-300">
                    {selectedPiece.category}
                  </span>
                  <span className="text-xs text-slate-400">
                    {selectedPiece.origin}
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100">
                  {selectedPiece.title}
                </h2>
                <div className="text-xs text-slate-400 mt-0.5">
                  Composer: <strong className="text-slate-200">{selectedPiece.composer}</strong>
                </div>
              </div>

              {/* Playback Button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePlayPiece}
                  className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all shadow-lg active:scale-95 ${
                    isPlaying
                      ? 'bg-rose-500 text-white hover:bg-rose-600'
                      : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Square className="h-4 w-4 fill-white" />
                      <span>Stop Playing</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 fill-slate-950" />
                      <span>Play Score</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Transposition & Practice Controls Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl bg-slate-950 border border-slate-800 p-4 mb-6">
              {/* Part selector */}
              <div>
                <span className="text-xs uppercase font-semibold text-slate-400 block mb-2">
                  Instrument Part Transposition:
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      if (isPlaying) handleStop();
                      setSelectedInstrumentPart('Bb');
                    }}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                      selectedInstrumentPart === 'Bb'
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                    }`}
                  >
                    B♭ Brass (Cornet / Euph / Trombone)
                  </button>
                  <button
                    onClick={() => {
                      if (isPlaying) handleStop();
                      setSelectedInstrumentPart('Eb');
                    }}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                      selectedInstrumentPart === 'Eb'
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                    }`}
                  >
                    E♭ Brass (Tenor Horn / Soprano)
                  </button>
                  <button
                    onClick={() => {
                      if (isPlaying) handleStop();
                      setSelectedInstrumentPart('Concert');
                    }}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                      selectedInstrumentPart === 'Concert'
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                    }`}
                  >
                    Concert (Bass Trombone / Piano)
                  </button>
                </div>

                {/* Timbre override */}
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px]">
                  <span className="text-slate-500 font-semibold mr-1">Timbre:</span>
                  {[
                    { id: 'auto', label: 'Auto' },
                    { id: 'cornet', label: 'Cornet' },
                    { id: 'horn', label: 'Tenor Horn' },
                    { id: 'euphonium', label: 'Euphonium' },
                    { id: 'trombone', label: 'Trombone' }
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTimbreChoice(t.id as any)}
                      className={`rounded px-2 py-0.5 transition-colors ${
                        timbreChoice === t.id
                          ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tempo & Speed Slider */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="uppercase font-semibold flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-amber-400" />
                    <span>Practice Tempo:</span>
                  </span>
                  <span className="font-mono text-amber-300 font-bold">
                    {Math.round(selectedPiece.tempoBpm * tempoMultiplier)} BPM ({Math.round(tempoMultiplier * 100)}%)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTempoMultiplier(0.75)}
                    className="rounded bg-slate-900 px-2 py-1 text-[11px] text-slate-400 hover:text-white border border-slate-800"
                  >
                    Slow 75%
                  </button>
                  <input
                    type="range"
                    min="0.5"
                    max="1.4"
                    step="0.05"
                    value={tempoMultiplier}
                    onChange={e => setTempoMultiplier(parseFloat(e.target.value))}
                    className="flex-1 accent-amber-400 cursor-pointer"
                  />
                  <button
                    onClick={() => setTempoMultiplier(1.0)}
                    className="rounded bg-slate-900 px-2 py-1 text-[11px] text-slate-400 hover:text-white border border-slate-800"
                  >
                    Normal 100%
                  </button>
                </div>
              </div>
            </div>

            {/* ACTIVE NOTE READOUT BOX (Valve Fingerings & Trombone Slide) */}
            <div className="rounded-2xl border border-amber-500/20 bg-slate-950 p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 font-serif text-2xl font-bold">
                    {activeNote 
                      ? (selectedInstrumentPart === 'Bb' ? activeNote.writtenBb : selectedInstrumentPart === 'Eb' ? activeNote.writtenEb : activeNote.concert)
                      : (selectedInstrumentPart === 'Bb' ? selectedPiece.melodyNotes[0].writtenBb : selectedInstrumentPart === 'Eb' ? selectedPiece.melodyNotes[0].writtenEb : selectedPiece.melodyNotes[0].concert)}
                  </div>
                  <div>
                    <div className="text-xs uppercase font-semibold text-slate-400">
                      Active Note Fingering Guide ({selectedInstrumentPart} Part):
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs">
                      <span>
                        Valves: <strong className="text-amber-300 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                          {activeNote 
                            ? (selectedInstrumentPart === 'Eb' 
                                ? (activeNote.valvesEb.length > 0 ? activeNote.valvesEb.join('+') : 'Open')
                                : (activeNote.valvesBb.length > 0 ? activeNote.valvesBb.join('+') : 'Open'))
                            : (selectedPiece.melodyNotes[0].valvesBb.length > 0 ? selectedPiece.melodyNotes[0].valvesBb.join('+') : 'Open')}
                        </strong>
                      </span>
                      <span>
                        Trombone: <strong className="text-sky-300 font-bold bg-sky-400/10 px-2 py-0.5 rounded border border-sky-400/30">
                          Pos {activeNote ? activeNote.slidePosTrombone : selectedPiece.melodyNotes[0].slidePosTrombone}
                        </strong>
                      </span>
                      <span>
                        Sounds: <strong className="text-emerald-400 font-mono">
                          Concert {activeNote ? activeNote.concert : selectedPiece.melodyNotes[0].concert}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-400">
                  <span>Key: </span>
                  <strong className="text-slate-200">
                    {selectedInstrumentPart === 'Bb' ? selectedPiece.keySignatureBb : selectedInstrumentPart === 'Eb' ? selectedPiece.keySignatureEb : selectedPiece.keySignatureConcert}
                  </strong>
                </div>
              </div>
            </div>

            {/* INTERACTIVE NOTE-BY-NOTE STAVE RUNNER */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="uppercase font-semibold">Melody Stave Runner (Click any note to audition and see fingerings):</span>
                <span>{selectedPiece.melodyNotes.length} Notes in Melody</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {selectedPiece.melodyNotes.map((note, index) => {
                  const isActive = activeNoteIndex === index;
                  const displayNote = selectedInstrumentPart === 'Bb' ? note.writtenBb : selectedInstrumentPart === 'Eb' ? note.writtenEb : note.concert;
                  const displayValves = selectedInstrumentPart === 'Eb' ? note.valvesEb : note.valvesBb;
                  const valveString = displayValves.length > 0 ? displayValves.join('+') : 'Open';

                  return (
                    <button
                      key={index}
                      onClick={() => handleNoteAudition(note, index)}
                      className={`flex flex-col items-center justify-between rounded-xl p-2.5 transition-all border text-center cursor-pointer ${
                        isActive
                          ? 'border-emerald-400 bg-emerald-500/20 text-white shadow-lg scale-105 ring-2 ring-emerald-400/60'
                          : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-mono text-slate-500">
                        {note.durationName.split(' ')[0]}
                      </span>

                      <div className="my-1">
                        <div className="font-serif text-xl font-bold text-slate-100">
                          {displayNote}
                        </div>
                        {note.lyricSnippet && (
                          <div className="text-[10px] text-amber-300/80 italic truncate max-w-[65px]">
                            {note.lyricSnippet}
                          </div>
                        )}
                      </div>

                      <div className="mt-1 w-full pt-1 border-t border-slate-800 text-[10px]">
                        <span className="font-bold text-amber-400">
                          {valveString}
                        </span>
                        <span className="text-slate-500 block text-[9px]">
                          P{note.slidePosTrombone}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Historical Notes & Lyrics Section */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-3">
              <div>
                <h4 className="font-serif text-sm font-bold text-slate-200">
                  Historical Background
                </h4>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  {selectedPiece.historicalNote}
                </p>
              </div>

              {selectedPiece.lyricsOrVerse && (
                <div className="pt-3 border-t border-slate-800/80">
                  <h4 className="font-serif text-sm font-bold text-amber-300">
                    Sacred / Hymn Verse
                  </h4>
                  <p className="mt-1 text-xs text-slate-300 italic leading-relaxed">
                    "{selectedPiece.lyricsOrVerse}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
