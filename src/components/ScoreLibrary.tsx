import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause,
  Square, 
  Volume2, 
  VolumeX,
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
  X,
  CheckCircle2,
  HardDrive,
  ShieldCheck,
  FileText,
  Layers,
  HelpCircle,
  Eye
} from 'lucide-react';
import { BRASS_SCORES } from '../data/scoresData';
import { ScorePiece, MelodyNote } from '../types';
import { brassAudio } from '../audio/brassAudio';
import { generateScorePdf } from '../data/pdfGenerator';
import { renderMelodyToWavBlob } from '../audio/wavRenderer';
import {
  saveOfflineItem,
  getAllOfflineItems,
  removeOfflineItem,
  OfflineStoredItem
} from '../data/offlineStorage';
import { analyticsService } from '../services/analyticsService';

export const ScoreLibrary: React.FC = () => {
  const [selectedPiece, setSelectedPiece] = useState<ScorePiece>(BRASS_SCORES[0]);
  const [selectedInstrumentPart, setSelectedInstrumentPart] = useState<'Bb Cornet / Trumpet' | 'Eb Tenor Horn' | 'Trombone / Euphonium' | 'Conductor Full Lead'>('Bb Cornet / Trumpet');
  const [activeNoteIndex, setActiveNoteIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [tempoMultiplier, setTempoMultiplier] = useState<number>(1.0);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [instrumentFilter, setInstrumentFilter] = useState<string>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [licenseFilter, setLicenseFilter] = useState<string>('All');
  const [timbreChoice, setTimbreChoice] = useState<'auto' | 'cornet' | 'horn' | 'euphonium' | 'trombone'>('auto');
  const [showAttributionModal, setShowAttributionModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [stopPlaybackFn, setStopPlaybackFn] = useState<(() => void) | null>(null);
  const [offlineCacheIds, setOfflineCacheIds] = useState<string[]>([]);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [isGeneratingDownload, setIsGeneratingDownload] = useState<boolean>(false);

  const categories = [
    'All',
    'Salvation Army Hymn',
    'British Band March',
    'Cornet Solo & Air',
    'Folk & Traditional',
    'Zimbabwe Brass Medley'
  ];

  // Refresh list of cached offline items
  useEffect(() => {
    getAllOfflineItems().then(items => {
      setOfflineCacheIds(items.map(i => i.id));
    });
  }, []);

  const filteredScores = BRASS_SCORES.filter(score => {
    const matchesCategory = categoryFilter === 'All' || score.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === 'All' || score.difficulty === difficultyFilter;
    const matchesLicense = licenseFilter === 'All' || 
      (licenseFilter === 'Public Domain' && (!score.license || score.license === 'Public Domain')) ||
      (score.license && score.license.includes(licenseFilter));

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      score.title.toLowerCase().includes(q) ||
      score.subtitle.toLowerCase().includes(q) ||
      score.composer.toLowerCase().includes(q) ||
      score.origin.toLowerCase().includes(q) ||
      (score.lyricsOrVerse && score.lyricsOrVerse.toLowerCase().includes(q));

    return matchesCategory && matchesDifficulty && matchesLicense && matchesSearch;
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
    setIsPaused(false);
    setActiveNoteIndex(null);
  };

  const handlePlayPiece = () => {
    if (isPlaying) {
      handleStop();
      return;
    }

    setIsPlaying(true);
    setIsPaused(false);

    const notesToPlay = selectedPiece.melodyNotes.map(n => {
      let freq = n.freqBb;
      if (selectedInstrumentPart.includes('Eb')) freq = n.freqEb;
      if (selectedInstrumentPart.includes('Conductor') || selectedInstrumentPart.includes('Trombone')) freq = n.freqConcert;

      const baseBeatDurationMs = (60000 / selectedPiece.tempoBpm) * n.durationBeats;
      return {
        freqHz: freq,
        durationMs: baseBeatDurationMs,
        isRest: n.isRest
      };
    });

    const timbre = timbreChoice !== 'auto'
      ? timbreChoice
      : (selectedInstrumentPart.includes('Eb') ? 'horn' : selectedInstrumentPart.includes('Trombone') ? 'trombone' : 'cornet');

    const cancel = brassAudio.playScoreMelody(
      notesToPlay,
      tempoMultiplier,
      idx => {
        setActiveNoteIndex(idx);
      },
      () => {
        if (isLooping) {
          // Restart loop if enabled
          setTimeout(() => handlePlayPiece(), 400);
        } else {
          setIsPlaying(false);
          setActiveNoteIndex(null);
        }
      },
      timbre
    );

    setStopPlaybackFn(() => cancel);
  };

  const handleNoteAudition = (note: MelodyNote, index: number) => {
    if (isPlaying) handleStop();
    setActiveNoteIndex(index);
    let freq = note.freqBb;
    if (selectedInstrumentPart.includes('Eb')) freq = note.freqEb;
    if (selectedInstrumentPart.includes('Conductor') || selectedInstrumentPart.includes('Trombone')) freq = note.freqConcert;

    const timbre = timbreChoice !== 'auto'
      ? timbreChoice
      : (selectedInstrumentPart.includes('Eb') ? 'horn' : 'cornet');
    brassAudio.playBrassTone(freq, 0.7, timbre);
  };

  // REAL PDF DOWNLOAD HANDLER
  const handleDownloadScorePdf = () => {
    try {
      setIsGeneratingDownload(true);
      setActionNotice('Compiling authentic musical score PDF with staves and fingerings...');
      
      const doc = generateScorePdf(selectedPiece, selectedInstrumentPart);
      const filename = `${selectedPiece.title.replace(/[^a-zA-Z0-9]/g, '_')}_${selectedInstrumentPart.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      doc.save(filename);
      analyticsService.recordDownload(selectedPiece.title, 'score');

      setIsGeneratingDownload(false);
      setActionNotice(`Downloaded authentic PDF score: "${filename}".`);
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err) {
      console.error(err);
      setIsGeneratingDownload(false);
      setActionNotice('Score file generation error. Please try again.');
    }
  };

  // REAL AUDIO WAV DOWNLOAD HANDLER (Synthesized Brass Demonstration)
  const handleDownloadAudioSample = () => {
    try {
      setIsGeneratingDownload(true);
      setActionNotice('Rendering authentic 44.1kHz brass audio sample...');

      const notes = selectedPiece.melodyNotes.map(n => ({
        freqHz: selectedInstrumentPart.includes('Eb') ? n.freqEb : n.freqBb,
        durationMs: (60000 / selectedPiece.tempoBpm) * n.durationBeats,
        isRest: n.isRest
      }));

      const wavBlob = renderMelodyToWavBlob(
        notes,
        tempoMultiplier,
        selectedInstrumentPart.includes('Eb') ? 'horn' : 'cornet'
      );

      const url = URL.createObjectURL(wavBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedPiece.title.replace(/[^a-zA-Z0-9]/g, '_')}_Audio_Sample.wav`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      setIsGeneratingDownload(false);
      setActionNotice('Downloaded genuine audio sample (PCM WAV).');
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err) {
      console.error(err);
      setIsGeneratingDownload(false);
      setActionNotice('Audio sample not available.');
    }
  };

  // REAL OFFLINE STORAGE SAVE (IndexedDB)
  const handleSaveScoreOffline = async () => {
    try {
      setIsGeneratingDownload(true);
      setActionNotice('Caching actual PDF score & musical data into IndexedDB...');

      const doc = generateScorePdf(selectedPiece, selectedInstrumentPart);
      const pdfBlob = doc.output('blob');

      const offlineItem: OfflineStoredItem = {
        id: `score-${selectedPiece.id}`,
        title: `${selectedPiece.title} (${selectedInstrumentPart})`,
        category: 'score',
        fileType: 'Printable Score PDF',
        sizeBytes: pdfBlob.size,
        formattedSize: `${(pdfBlob.size / 1024).toFixed(1)} KB`,
        dateAdded: new Date().toLocaleDateString('en-GB'),
        license: selectedPiece.license || 'Public Domain',
        attribution: `${selectedPiece.composer} · ${selectedPiece.origin}`,
        blobData: pdfBlob,
        meta: {
          key: selectedPiece.keySignatureConcert,
          tempo: selectedPiece.tempoBpm,
          difficulty: selectedPiece.difficulty
        }
      };

      await saveOfflineItem(offlineItem);
      const items = await getAllOfflineItems();
      setOfflineCacheIds(items.map(i => i.id));

      setIsGeneratingDownload(false);
      setActionNotice(`✓ "${selectedPiece.title}" saved to Offline Library. Available without internet!`);
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err) {
      console.error(err);
      setIsGeneratingDownload(false);
      setActionNotice('Could not save resource offline.');
    }
  };

  const isPieceOffline = offlineCacheIds.includes(`score-${selectedPiece.id}`);
  const activeNote = activeNoteIndex !== null ? selectedPiece.melodyNotes[activeNoteIndex] : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header Banner */}
      <div className="relative mb-8 overflow-hidden rounded-3xl border border-amber-500/30 bg-slate-900 p-8 sm:p-10 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
              <ShieldCheck className="h-4 w-4" />
              <span>Btech2 Free Music Library · Verified Legal Repertoire</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-slate-100">
              Salvation Army & British Brass Band Free Scores
            </h1>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
              Every score in this library is from verified <strong>Public Domain</strong> or open non-commercial educational brass arrangements. Download <strong>real printable PDF scores</strong>, listen to <strong>sample playback</strong>, download audio, and save pieces to your <strong>Offline Library</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => setShowAttributionModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-all"
            >
              <Info className="h-4 w-4" />
              <span>Licensing & Attribution Policy</span>
            </button>
          </div>
        </div>

        {/* Action Notice Flash Box */}
        {actionNotice && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-xs font-medium text-amber-200 flex items-center justify-between">
            <span>{actionNotice}</span>
            <button onClick={() => setActionNotice(null)} className="text-amber-400 hover:text-white font-bold text-sm ml-2">Ã—</button>
          </div>
        )}
      </div>

      {/* Main Grid: Left Column = Search & Scores, Right Column = Score Player & Sheet Music */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Explorer & Directory */}
        <div className="lg:col-span-4 space-y-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by title, composer, hymn..."
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

          {/* Category Filter Pills */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-semibold text-slate-400">
                Filter by Category:
              </span>
              <span className="text-[11px] font-mono text-amber-400">
                {filteredScores.length} Scores
              </span>
            </div>
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

            {/* Difficulty & License Quick Toggles */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">Difficulty</span>
                <select
                  value={difficultyFilter}
                  onChange={e => setDifficultyFilter(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-300"
                >
                  <option value="All">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">Licence Status</span>
                <select
                  value={licenseFilter}
                  onChange={e => setLicenseFilter(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-300"
                >
                  <option value="All">All Verified</option>
                  <option value="Public Domain">Public Domain</option>
                  <option value="Creative Commons">Creative Commons</option>
                </select>
              </div>
            </div>
          </div>

          {/* Song Directory List */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 shadow-lg max-h-[600px] overflow-y-auto space-y-2">
            {filteredScores.map(score => {
              const isSelected = selectedPiece.id === score.id;
              const isCached = offlineCacheIds.includes(`score-${score.id}`);

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
                      {isCached && (
                        <span className="text-emerald-400 font-bold text-[10px]" title="Saved Offline">
                          ✓ Offline
                        </span>
                      )}
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

        {/* Right Column: Interactive Score Card & Audio Center */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-3xl border border-amber-500/30 bg-slate-900/90 p-6 sm:p-8 shadow-2xl">
            {/* Top Score Title & Primary Actions */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
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
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <span>Composer: <strong className="text-slate-200">{selectedPiece.composer}</strong></span>
                  <span>·</span>
                  <span className="text-emerald-400 font-medium">Licence: {selectedPiece.license || 'Public Domain'}</span>
                </div>
              </div>

              {/* Action Buttons: Download PDF, Save Offline, Play */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleDownloadScorePdf}
                  disabled={isGeneratingDownload}
                  title="Download actual printable sheet music PDF"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-all shadow"
                >
                  <Download className="h-4 w-4" />
                  <span>Download PDF</span>
                </button>

                <button
                  onClick={handleSaveScoreOffline}
                  disabled={isGeneratingDownload}
                  title="Store actual PDF & music in browser IndexedDB"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                    isPieceOffline
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-950 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  <HardDrive className="h-4 w-4" />
                  <span>{isPieceOffline ? '✓ Saved Offline' : 'Save Offline'}</span>
                </button>

                <button
                  onClick={handlePlayPiece}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow ${
                    isPlaying
                      ? 'bg-rose-500 text-white hover:bg-rose-600'
                      : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Square className="h-4 w-4 fill-white" />
                      <span>Stop</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 fill-slate-950" />
                      <span>Listen to Sample</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* AUDIO CONTROLLER BAR (Seek, Loop, Speed, Download Audio) */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-bold text-slate-400 flex items-center gap-1.5">
                    <Music className="h-4 w-4 text-amber-400" />
                    <span>Generated Btech2 Playback Audio</span>
                  </span>
                  <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded">
                    Web Audio Synthesized Brass
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Loop Toggle */}
                  <button
                    onClick={() => setIsLooping(!isLooping)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                      isLooping
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Loop: {isLooping ? 'ON' : 'OFF'}</span>
                  </button>

                  {/* Download Real Audio Sample (WAV) */}
                  <button
                    onClick={handleDownloadAudioSample}
                    disabled={isGeneratingDownload}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-900 text-slate-300 hover:text-amber-300 border border-slate-800 flex items-center gap-1 transition-all"
                  >
                    <Download className="h-3 w-3" />
                    <span>Download Audio (WAV)</span>
                  </button>
                </div>
              </div>

              {/* Tempo & Speed adjustments */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">Playback Speed:</span>
                  {[0.75, 1.0, 1.25].map(spd => (
                    <button
                      key={spd}
                      onClick={() => setTempoMultiplier(spd)}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                        tempoMultiplier === spd
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                  <span className="text-amber-300 font-mono font-bold ml-1">
                    {Math.round(selectedPiece.tempoBpm * tempoMultiplier)} BPM
                  </span>
                </div>

                {/* Part selector */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">Part:</span>
                  <select
                    value={selectedInstrumentPart}
                    onChange={e => {
                      if (isPlaying) handleStop();
                      setSelectedInstrumentPart(e.target.value as any);
                    }}
                    className="bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs text-slate-200"
                  >
                    <option value="Bb Cornet / Trumpet">B♭ Cornet / Trumpet (Treble)</option>
                    <option value="Eb Tenor Horn">E♭ Tenor Horn (Treble)</option>
                    <option value="Trombone / Euphonium">Trombone / Euphonium</option>
                    <option value="Conductor Full Lead">Conductor Lead (Concert Pitch)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* FINGERING GUIDE & ACTIVE NOTE CARD */}
            <div className="rounded-2xl border border-amber-500/20 bg-slate-950 p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 font-serif text-2xl font-bold">
                    {activeNote 
                      ? (selectedInstrumentPart.includes('Eb') ? activeNote.writtenEb : activeNote.writtenBb)
                      : (selectedInstrumentPart.includes('Eb') ? selectedPiece.melodyNotes[0].writtenEb : selectedPiece.melodyNotes[0].writtenBb)}
                  </div>
                  <div>
                    <div className="text-xs uppercase font-semibold text-slate-400">
                      Active Note Fingering Guide ({selectedInstrumentPart}):
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs">
                      <span>
                        Valves: <strong className="text-amber-300 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                          {activeNote 
                            ? (selectedInstrumentPart.includes('Eb') 
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
                    {selectedInstrumentPart.includes('Eb') ? selectedPiece.keySignatureEb : selectedPiece.keySignatureBb}
                  </strong>
                </div>
              </div>
            </div>

            {/* INTERACTIVE NOTE-BY-NOTE STAVE RUNNER */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="uppercase font-semibold">Interactive Note Runner (Audition note on click):</span>
                <span>{selectedPiece.melodyNotes.length} Notes</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {selectedPiece.melodyNotes.map((note, index) => {
                  const isActive = activeNoteIndex === index;
                  const displayNote = selectedInstrumentPart.includes('Eb') ? note.writtenEb : note.writtenBb;
                  const displayValves = selectedInstrumentPart.includes('Eb') ? note.valvesEb : note.valvesBb;
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

            {/* HISTORICAL NOTES & LEGAL ATTRIBUTION PANEL */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-sm font-bold text-slate-200">
                  Historical Background
                </h4>
                <button
                  onClick={() => setShowAttributionModal(true)}
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-medium"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>View Licence & Source</span>
                </button>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {selectedPiece.historicalNote}
              </p>

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

      {/* LICENCE & ATTRIBUTION MODAL */}
      {showAttributionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-amber-500/30 bg-slate-900 p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-amber-400" />
                <h3 className="font-serif text-lg font-bold text-slate-100">
                  Licence & Attribution Details
                </h3>
              </div>
              <button
                onClick={() => setShowAttributionModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div><strong className="text-slate-400">Piece Title:</strong> {selectedPiece.title}</div>
                <div><strong className="text-slate-400">Composer / Origin:</strong> {selectedPiece.composer} · {selectedPiece.origin}</div>
                <div><strong className="text-slate-400">Licence Status:</strong> <span className="text-emerald-400 font-bold">{selectedPiece.license || 'Public Domain'}</span></div>
                <div><strong className="text-slate-400">Redistribution:</strong> Permitted for free educational & church brass use</div>
                <div><strong className="text-slate-400">Offline Caching:</strong> Permitted (IndexedDB client storage)</div>
                <div><strong className="text-slate-400">Audio Type:</strong> Generated Btech2 synthesized brass demonstration</div>
              </div>

              <p className="text-slate-400 leading-relaxed">
                Btech2 strictly provides music that is legally reusable under Public Domain or Open Educational standards. No copyrighted commercial scores are scraped or redistributed.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-right">
              <button
                onClick={() => setShowAttributionModal(false)}
                className="px-5 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

