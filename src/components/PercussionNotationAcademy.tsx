import React, { useState } from 'react';
import {
  Zap,
  Volume2,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Award,
  Layers,
  ChevronRight,
  Music,
  Info
} from 'lucide-react';
import { brassAudio } from '../audio/brassAudio';

export const PercussionNotationAcademy: React.FC = () => {
  const [selectedSubTab, setSelectedSubTab] = useState<'clef' | 'auxiliary' | 'builder' | 'ear-training' | 'comparison'>('clef');
  
  // Interactive Percussion Staff State (Part 18, 27)
  const [activeStaffInstrument, setActiveStaffInstrument] = useState<string>('snare');

  // Rhythm Builder State (Part 28)
  const [builderBeats, setBuilderBeats] = useState<Array<{ id: number; inst: 'snare' | 'bassdrum' | 'cymbal' | 'cowbell'; name: string; dur: string }>>([
    { id: 1, inst: 'bassdrum', name: 'Bass Drum', dur: 'Quarter (1)' },
    { id: 2, inst: 'snare', name: 'Side Drum', dur: 'Quarter (2)' },
    { id: 3, inst: 'bassdrum', name: 'Bass Drum', dur: 'Quarter (3)' },
    { id: 4, inst: 'cymbal', name: 'Clash Cymbal', dur: 'Quarter (4)' }
  ]);
  const [isBuilderPlaying, setIsBuilderPlaying] = useState<boolean>(false);
  const [activeBuilderStep, setActiveBuilderStep] = useState<number | null>(null);

  // Ear Training State (Part 29)
  const [earTrainingIndex, setEarTrainingIndex] = useState<number>(0);
  const [earUserGuess, setEarUserGuess] = useState<string | null>(null);
  const [showEarResult, setShowEarResult] = useState<boolean>(false);

  const percussionInstrumentsStaff = [
    { id: 'snare', name: 'Side Drum (Snare)', pos: '3rd Space (C)', clef: 'Neutral / Percussion', symbol: 'Standard Oval Notehead', role: 'Rolls, flams, accents, military cadences', sound: 'snare' as const },
    { id: 'bassdrum', name: 'Concert Bass Drum', pos: '1st Space (F)', clef: 'Neutral / Percussion', symbol: 'Large Oval Notehead', role: 'Pulse foundation, downbeats', sound: 'bassdrum' as const },
    { id: 'cymbal', name: 'Clash / Crash Cymbal', pos: 'Above 5th Line (G/A)', clef: 'Neutral / Percussion', symbol: 'X Notehead', role: 'Climaxes, crash accents', sound: 'cymbal' as const },
    { id: 'triangle', name: 'Triangle', pos: 'Above Staff with legend', clef: 'Neutral / Percussion', symbol: 'Triangle or diamond notehead', role: 'High shimmering bell accents', sound: 'triangle' as const },
    { id: 'tambourine', name: 'Tambourine', pos: '4th Line (D)', clef: 'Neutral / Percussion', symbol: 'Slash or standard notehead', role: 'Jingles, thumb rolls, rhythms', sound: 'tambourine' as const },
    { id: 'cowbell', name: 'Cowbell', pos: '3rd Line or 2nd Space', clef: 'Neutral / Percussion', symbol: 'Square or accented notehead', role: 'Rhythmic offbeat syncopation', sound: 'cowbell' as const },
    { id: 'woodblock', name: 'Woodblock', pos: '2nd Line (G)', clef: 'Neutral / Percussion', symbol: 'Standard notehead with WB mark', role: 'Crisp dry hollow clicks', sound: 'woodblock' as const },
    { id: 'claves', name: 'Claves', pos: 'Single line or 3rd Space', clef: 'Neutral / Percussion', symbol: 'Cross or oval notehead', role: 'Latin / Caribbean clave pulse', sound: 'claves' as const },
    { id: 'timpani', name: 'Timpani (Kettle Drums)', pos: 'Bass Clef (F & C lines)', clef: 'Bass Clef (Pitched!)', symbol: 'Standard Pitched Notes', role: 'Pitched harmonic bass foundation', sound: 'timpani' as const },
    { id: 'glockenspiel', name: 'Glockenspiel', pos: 'Treble Clef (High C-C)', clef: 'Treble Clef (Pitched!)', symbol: 'Standard Pitched Notes', role: 'Melodic bell sparkle, doubles cornet', sound: 'glockenspiel' as const }
  ];

  const earTrainingChallenges = [
    { target: 'snare', name: 'Side Drum (Snare)', hint: 'Listen for the crisp buzz/snap of the snare wires.' },
    { target: 'bassdrum', name: 'Concert Bass Drum', hint: 'Listen for the deep, thunderous low fundamental pulse.' },
    { target: 'cymbal', name: 'Clash Cymbal', hint: 'Listen for the metallic crash splash.' },
    { target: 'triangle', name: 'Triangle', hint: 'Listen for the high shimmering metallic chime.' },
    { target: 'cowbell', name: 'Cowbell', hint: 'Listen for the hollow metal dual-tone strike.' },
    { target: 'woodblock', name: 'Wood Block', hint: 'Listen for the short, dry, wooden click.' }
  ];

  const currentEarChallenge = earTrainingChallenges[earTrainingIndex];

  const handlePlayEarChallenge = () => {
    brassAudio.playPercussion(currentEarChallenge.target as any);
  };

  // Play rhythm builder measure
  const handlePlayRhythmBuilder = () => {
    if (isBuilderPlaying) {
      setIsBuilderPlaying(false);
      setActiveBuilderStep(null);
      return;
    }

    setIsBuilderPlaying(true);
    let step = 0;
    const intervalMs = 450; // ~133 BPM

    const runStep = () => {
      if (step >= builderBeats.length) {
        setIsBuilderPlaying(false);
        setActiveBuilderStep(null);
        return;
      }

      setActiveBuilderStep(step);
      const beat = builderBeats[step];
      brassAudio.playPercussion(beat.inst);

      step++;
      setTimeout(runStep, intervalMs);
    };

    runStep();
  };

  const handleAddBuilderBeat = (inst: 'snare' | 'bassdrum' | 'cymbal' | 'cowbell', name: string) => {
    if (builderBeats.length >= 8) return; // 2 bars max in 4/4
    setBuilderBeats([...builderBeats, { id: Date.now(), inst, name, dur: `Beat ${builderBeats.length + 1}` }]);
  };

  const handleClearBuilder = () => {
    setBuilderBeats([]);
    setActiveBuilderStep(null);
  };

  return (
    <div className="rounded-3xl border border-amber-500/30 bg-slate-900/90 p-6 sm:p-8 shadow-2xl space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            <Zap className="h-4 w-4" />
            <span>Dedicated Percussion Notation Academy</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100">
            Reading & Understanding Percussion Notation
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Why percussion notation is distinct: while brass staff positions represent pitch, percussion staff positions and noteheads represent <strong>specific instruments and physical striking techniques</strong>. Always check the score legend!
          </p>
        </div>
      </div>

      {/* Academy Sub-Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-800 pb-2 scrollbar-none">
        {[
          { id: 'clef', label: '1. Neutral Clef & Staff Layout' },
          { id: 'auxiliary', label: '2. Auxiliary Instruments & Symbols' },
          { id: 'comparison', label: '3. Pitched vs Non-Pitched (Glock vs Snare)' },
          { id: 'builder', label: '4. Interactive Rhythm Builder' },
          { id: 'ear-training', label: '5. Percussion Ear Training' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedSubTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedSubTab === tab.id
                ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:bg-slate-950 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: NEUTRAL CLEF & INTERACTIVE STAFF EXPLORER */}
      {selectedSubTab === 'clef' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-100">
                  The Neutral / Percussion Clef (|| or rectangular blocks)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Click any instrument below to highlight its traditional staff line/space assignment and hear its sound:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {percussionInstrumentsStaff.map((inst) => {
                const isSelected = activeStaffInstrument === inst.id;
                return (
                  <button
                    key={inst.id}
                    onClick={() => {
                      setActiveStaffInstrument(inst.id);
                      brassAudio.playPercussion(inst.sound);
                    }}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/20 shadow-lg scale-102 text-white'
                        : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-serif font-bold text-sm text-slate-100">{inst.name}</span>
                      <span className="text-[10px] bg-slate-950 border border-slate-800 text-amber-400 px-2 py-0.5 rounded font-mono font-bold">
                        {inst.clef.split(' ')[0]}
                      </span>
                    </div>
                    <div className="text-xs text-amber-300 font-mono mt-1">
                      Staff Position: {inst.pos}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Notehead: {inst.symbol}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2 line-clamp-2">
                      {inst.role}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AUXILIARY PERCUSSION */}
      {selectedSubTab === 'auxiliary' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
            <h3 className="font-serif text-lg font-bold text-slate-100 mb-2">
              Auxiliary Percussion (Triangle, Tambourine, Cowbell, Woodblock, Claves)
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              In brass band test pieces and festival suites, auxiliary percussion instruments provide color, syncopation, and dramatic punch:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Triangle', sound: 'triangle' as const, sym: 'Triangle shape or triangle notehead', strike: 'Hold by suspension loop with non-dominant hand; strike with metal beater near top corner.' },
                { name: 'Tambourine', sound: 'tambourine' as const, sym: 'Standard notes or tremolo trill lines for shake rolls', strike: 'Hold at 45 degree angle; strike with knuckles/fist or use thumb roll across head.' },
                { name: 'Cowbell', sound: 'cowbell' as const, sym: 'Square or diamond notehead on line 3', strike: 'Mount on bass drum rim or stand; strike lip for deep tone or edge for sharp accents.' },
                { name: 'Wood Block', sound: 'woodblock' as const, sym: 'Cross/oval notes with WB indication', strike: 'Strike above slot with medium hard rubber or wooden mallet.' },
                { name: 'Claves', sound: 'claves' as const, sym: 'High ledger line or separate 1-line staff', strike: 'Rest one clave loosely on cupped palm forming acoustic soundbox; strike with other.' }
              ].map(aux => (
                <div key={aux.name} className="p-4 rounded-xl border border-slate-800 bg-slate-900 space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-base font-bold text-amber-300">{aux.name}</span>
                      <button
                        onClick={() => brassAudio.playPercussion(aux.sound)}
                        className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 text-xs font-bold hover:bg-amber-300 flex items-center gap-1"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                        <span>Hear Tone</span>
                      </button>
                    </div>
                    <div className="text-xs font-mono text-slate-400 mt-1">Symbol: {aux.sym}</div>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">{aux.strike}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PITCHED VS NON-PITCHED */}
      {selectedSubTab === 'comparison' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
            <h3 className="font-serif text-lg font-bold text-slate-100 mb-2">
              Crucial Distinction: Pitched vs. Non-Pitched Percussion
            </h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Beginners often assume all percussion uses the same notation. In reality, the brass band percussion section is divided into two distinct worlds:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl border border-amber-500/30 bg-slate-900 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-lg font-bold text-amber-300">Non-Pitched (Snare, Bass Drum, Cymbals)</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-2">
                  <li>• Uses the <strong>Neutral Clef (two vertical lines)</strong>.</li>
                  <li>• Lines represent <strong>different instruments</strong>, not pitch frequencies.</li>
                  <li>• Different noteheads (circle, X, diamond) distinguish hits, rimshots, choke crashes.</li>
                </ul>
                <button
                  onClick={() => brassAudio.playPercussion('snare')}
                  className="w-full py-2 bg-slate-950 border border-slate-800 text-xs font-bold text-amber-300 rounded-lg hover:bg-slate-800"
                >
                  Play Side Drum (Neutral)
                </button>
              </div>

              <div className="p-5 rounded-xl border border-emerald-500/30 bg-slate-900 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-lg font-bold text-emerald-300">Tuned / Pitched (Glockenspiel, Timpani, Xylophone)</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-2">
                  <li>• Uses standard <strong>Treble or Bass Clef</strong>.</li>
                  <li>• Staff lines represent <strong>exact musical pitches (C, D, E, F...)</strong>.</li>
                  <li>• Glockenspiel sounds 2 octaves higher than written; Timpani requires precise pedal pitch tuning.</li>
                </ul>
                <button
                  onClick={() => brassAudio.playPercussion('glockenspiel')}
                  className="w-full py-2 bg-slate-950 border border-slate-800 text-xs font-bold text-emerald-300 rounded-lg hover:bg-slate-800"
                >
                  Play Glockenspiel (Pitched C6)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INTERACTIVE RHYTHM BUILDER */}
      {selectedSubTab === 'builder' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-100">
                  Interactive Rhythm Builder (4/4 Measure)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Add instrument hits into the measure, then click "Play Pattern" to listen to your custom cadence:
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePlayRhythmBuilder}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isBuilderPlaying
                      ? 'bg-rose-500 text-white'
                      : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                  }`}
                >
                  <Play className="h-4 w-4 fill-current" />
                  <span>{isBuilderPlaying ? 'Stop Pattern' : 'Play Pattern'}</span>
                </button>

                <button
                  onClick={handleClearBuilder}
                  className="px-3 py-2 rounded-xl border border-slate-800 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Visual Beat Track */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 overflow-x-auto min-h-[90px] mb-6">
              {builderBeats.length === 0 ? (
                <span className="text-xs text-slate-500 italic mx-auto">Click buttons below to add instrument beats to the pattern.</span>
              ) : (
                builderBeats.map((b, idx) => {
                  const isActive = activeBuilderStep === idx;
                  return (
                    <div
                      key={b.id}
                      className={`flex-1 min-w-[70px] p-3 rounded-xl border text-center transition-all ${
                        isActive
                          ? 'border-amber-400 bg-amber-500/20 text-amber-200 scale-105 shadow'
                          : 'border-slate-800 bg-slate-950 text-slate-300'
                      }`}
                    >
                      <span className="font-mono text-xs font-bold text-amber-400 block">{idx + 1}</span>
                      <span className="text-xs font-serif font-bold block mt-1 truncate">{b.name}</span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Add Beat Buttons */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold mr-1">Add to Pattern:</span>
              <button
                onClick={() => handleAddBuilderBeat('bassdrum', 'Bass Drum')}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:text-amber-400"
              >
                + Bass Drum
              </button>
              <button
                onClick={() => handleAddBuilderBeat('snare', 'Side Drum')}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:text-amber-400"
              >
                + Side Drum
              </button>
              <button
                onClick={() => handleAddBuilderBeat('cymbal', 'Cymbal')}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:text-amber-400"
              >
                + Clash Cymbal
              </button>
              <button
                onClick={() => handleAddBuilderBeat('cowbell', 'Cowbell')}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:text-amber-400"
              >
                + Cowbell
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PERCUSSION EAR TRAINING */}
      {selectedSubTab === 'ear-training' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-100">
                  Percussion Ear Training & Instrument Identification
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click "Play Sound", listen carefully to the acoustic timbre, and select the matching instrument:
                </p>
              </div>
              <span className="text-xs font-mono text-amber-400">
                Challenge {earTrainingIndex + 1} of {earTrainingChallenges.length}
              </span>
            </div>

            <div className="my-6 text-center">
              <button
                onClick={handlePlayEarChallenge}
                className="px-6 py-3 rounded-2xl bg-amber-400 text-slate-950 font-bold text-sm hover:bg-amber-300 transition-all shadow inline-flex items-center gap-2"
              >
                <Volume2 className="h-5 w-5" />
                <span>Play Mysterious Instrument Sound</span>
              </button>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {['snare', 'bassdrum', 'cymbal', 'triangle', 'cowbell', 'woodblock'].map((opt) => {
                const isSelected = earUserGuess === opt;
                const isCorrect = opt === currentEarChallenge.target;
                const labelMap: Record<string, string> = {
                  snare: 'Side Drum (Snare)',
                  bassdrum: 'Concert Bass Drum',
                  cymbal: 'Clash Cymbal',
                  triangle: 'Triangle',
                  cowbell: 'Cowbell',
                  woodblock: 'Wood Block'
                };

                return (
                  <button
                    key={opt}
                    onClick={() => {
                      setEarUserGuess(opt);
                      setShowEarResult(true);
                      brassAudio.playFeedback(isCorrect);
                    }}
                    className={`p-3.5 rounded-xl border text-center font-bold text-xs transition-all ${
                      isSelected
                        ? isCorrect
                          ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                          : 'border-rose-500 bg-rose-500/20 text-rose-300'
                        : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {labelMap[opt]}
                  </button>
                );
              })}
            </div>

            {showEarResult && (
              <div className={`mt-5 p-4 rounded-xl border ${
                earUserGuess === currentEarChallenge.target
                  ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-200'
                  : 'border-rose-500/50 bg-rose-950/40 text-rose-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">
                    {earUserGuess === currentEarChallenge.target ? '✓ Correct Ear!' : '✗ Not quite.'}
                  </span>
                  <button
                    onClick={() => {
                      setEarUserGuess(null);
                      setShowEarResult(false);
                      setEarTrainingIndex((earTrainingIndex + 1) % earTrainingChallenges.length);
                    }}
                    className="text-xs font-bold underline"
                  >
                    Next Challenge →
                  </button>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  {currentEarChallenge.hint}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

