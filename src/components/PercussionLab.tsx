import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Square, 
  Volume2, 
  Sparkles, 
  Activity, 
  Clock, 
  Music,
  CheckCircle2,
  Zap,
  BookOpen,
  Award,
  Layers
} from 'lucide-react';
import { brassAudio } from '../audio/brassAudio';
import percussionHeroImg from '../assets/images/drum_kit_percussion_1791391792789.jpg';
import { PercussionNotationAcademy } from './PercussionNotationAcademy';

export const PercussionLab: React.FC = () => {
  const [isPlayingMarch, setIsPlayingMarch] = useState<boolean>(false);
  const [tempo, setTempo] = useState<number>(120); // 120 BPM standard British march
  const [currentBeat, setCurrentBeat] = useState<number>(1);
  const [activePad, setActivePad] = useState<string | null>(null);
  const [selectedRudiment, setSelectedRudiment] = useState<number>(0);
  const [isPracticingRudiment, setIsPracticingRudiment] = useState<boolean>(false);
  const [activeRudimentStep, setActiveRudimentStep] = useState<number>(0);
  const [activeKitPart, setActiveKitPart] = useState<string | null>(null);
  
  const marchTimerRef = useRef<number | null>(null);
  const rudimentTimerRef = useRef<number | null>(null);

  const percussionInstruments = [
    {
      id: 'snare',
      name: 'Side Drum (Snare)',
      role: 'Military cadence, buzz rolls, 5-stroke rolls & rim shots',
      hotkey: 'S',
      color: 'from-amber-600 to-amber-700'
    },
    {
      id: 'bassdrum',
      name: 'Concert Bass Drum',
      role: 'Downbeat pulse (beats 1 & 2 in 2/4 march, heavy fundamental)',
      hotkey: 'B',
      color: 'from-rose-700 to-rose-900'
    },
    {
      id: 'cymbal',
      name: 'Clash Cymbals (Crash)',
      role: 'Tutti climaxes, crashes and march offbeat accents',
      hotkey: 'C',
      color: 'from-yellow-500 to-amber-600'
    },
    {
      id: 'timpani',
      name: 'Timpani (Kettle Drums)',
      role: 'Tuned harmonic foundation in F & C pedal brass resonance',
      hotkey: 'T',
      color: 'from-sky-700 to-indigo-900'
    },
    {
      id: 'glockenspiel',
      name: 'Glockenspiel / Bells',
      role: 'High octave tuned metal bells playing melodic counterpoint',
      hotkey: 'G',
      color: 'from-emerald-600 to-teal-800'
    }
  ];

  const rudiments = [
    {
      name: 'Single Stroke Roll',
      sticking: 'R - L - R - L - R - L - R - L',
      notes: ['R', 'L', 'R', 'L', 'R', 'L', 'R', 'L'],
      type: 'snare',
      desc: 'The fundamental alternating stroke. Keep wrist loose and stick heights identical.'
    },
    {
      name: 'Double Stroke Roll (Long Roll)',
      sticking: 'R - R - L - L - R - R - L - L',
      notes: ['R', 'R', 'L', 'L', 'R', 'R', 'L', 'L'],
      type: 'snare',
      desc: 'Primary roll technique for British brass band march cadences and sustained military rolls.'
    },
    {
      name: 'Single Paradiddle',
      sticking: 'R - L - R - R - L - R - L - L',
      notes: ['R', 'L', 'R', 'R', 'L', 'R', 'L', 'L'],
      type: 'snare',
      desc: 'Accented downbeat on beat 1 with a quick bounce double. Bridges hand leads seamlessly.'
    },
    {
      name: 'Flam Accent & Tap',
      sticking: 'lR - L - R - rL - R - L',
      notes: ['lR', 'L', 'R', 'rL', 'R', 'L'],
      type: 'snare',
      desc: 'Grace note preceding the main stroke. Gives crisp martial articulation.'
    },
    {
      name: 'March Cadence Downbeat & Snare',
      sticking: 'Bass - Snare - Bass - Snare+Cym',
      notes: ['Bass', 'Snare', 'Bass', 'Cymbal'],
      type: 'hybrid',
      desc: 'The classic British Salvation Army and Contest street march pulse.'
    }
  ];

  const handleTriggerPercussion = (type: 'snare' | 'bassdrum' | 'cymbal' | 'timpani' | 'glockenspiel') => {
    setActivePad(type);
    setActiveKitPart(type);
    brassAudio.playPercussion(type);
    setTimeout(() => {
      setActivePad(null);
      setActiveKitPart(null);
    }, 180);
  };

  // Keyboard controls for percussion pads
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const k = e.key.toLowerCase();
      if (k === 's') handleTriggerPercussion('snare');
      if (k === 'b') handleTriggerPercussion('bassdrum');
      if (k === 'c') handleTriggerPercussion('cymbal');
      if (k === 't') handleTriggerPercussion('timpani');
      if (k === 'g') handleTriggerPercussion('glockenspiel');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // British 2/4 March Beat Engine
  useEffect(() => {
    if (!isPlayingMarch) {
      if (marchTimerRef.current) clearInterval(marchTimerRef.current);
      return;
    }

    const intervalMs = (60 / tempo) * 1000;
    let beat = 1;

    marchTimerRef.current = window.setInterval(() => {
      setCurrentBeat(beat);

      if (beat === 1) {
        brassAudio.playPercussion('bassdrum');
        setActiveKitPart('bassdrum');
      } else if (beat === 2) {
        brassAudio.playPercussion('snare');
        setActiveKitPart('snare');
      }
      setTimeout(() => setActiveKitPart(null), 120);

      beat = beat === 1 ? 2 : 1;
    }, intervalMs);

    return () => {
      if (marchTimerRef.current) clearInterval(marchTimerRef.current);
    };
  }, [isPlayingMarch, tempo]);

  // Rudiment practice player loop
  useEffect(() => {
    if (!isPracticingRudiment) {
      if (rudimentTimerRef.current) clearInterval(rudimentTimerRef.current);
      return;
    }

    const currentRud = rudiments[selectedRudiment];
    let step = 0;
    const stepDurationMs = 240;

    rudimentTimerRef.current = window.setInterval(() => {
      setActiveRudimentStep(step);
      const note = currentRud.notes[step];

      if (note === 'Bass') {
        brassAudio.playPercussion('bassdrum');
        setActiveKitPart('bassdrum');
      } else if (note === 'Cymbal') {
        brassAudio.playPercussion('cymbal');
        brassAudio.playPercussion('snare');
        setActiveKitPart('cymbal');
      } else {
        brassAudio.playPercussion('snare');
        setActiveKitPart('snare');
      }
      setTimeout(() => setActiveKitPart(null), 120);

      step = (step + 1) % currentRud.notes.length;
    }, stepDurationMs);

    return () => {
      if (rudimentTimerRef.current) clearInterval(rudimentTimerRef.current);
    };
  }, [isPracticingRudiment, selectedRudiment]);

  const toggleMarchEngine = () => {
    if (isPracticingRudiment) setIsPracticingRudiment(false);
    setIsPlayingMarch(!isPlayingMarch);
  };

  const toggleRudimentPractice = () => {
    if (isPlayingMarch) setIsPlayingMarch(false);
    setIsPracticingRudiment(!isPracticingRudiment);
  };

  const rhythmValues = [
    {
      name: 'Semibreve (Whole Note)',
      beats: '4 Beats',
      symbol: '𝅝',
      britishTradition: 'Held for 4 full beats. Used in solemn hymn tunes like "Crimond" or "Deep Harmony".'
    },
    {
      name: 'Minim (Half Note)',
      beats: '2 Beats',
      symbol: '𝅗𝅥',
      britishTradition: 'Half the length of a semibreve. Drives lyrical cantabile melodies across the cornet and horn sections.'
    },
    {
      name: 'Crotchet (Quarter Note)',
      beats: '1 Beat',
      symbol: '𝅘𝅥',
      britishTradition: 'The heartbeat of brass band marching. In 2/4 march time, each measure contains two crotchet beats.'
    },
    {
      name: 'Quaver (Eighth Note)',
      beats: '1/2 Beat',
      symbol: '𝅘𝅥𝅮',
      britishTradition: 'Often played as crisp off-beats by the Tenor Horns and 2nd/3rd cornets in British street marches.'
    },
    {
      name: 'Semiquaver (Sixteenth Note)',
      beats: '1/4 Beat',
      symbol: '𝅘𝅥𝅯',
      britishTradition: 'Fast technical passages, double and triple-tongued flourishes in Arban cornet variations.'
    },
    {
      name: 'Triplet',
      beats: '3 in the time of 2',
      symbol: '3 𝅘𝅥',
      britishTradition: 'Classic 6/8 march swing ("The Floral Dance") or fanfare fanfares ("Knight Templar").'
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Hero Banner */}
      <div className="relative mb-10 overflow-hidden rounded-3xl border border-amber-500/30 bg-slate-900 shadow-2xl">
        <div className="relative grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="p-8 sm:p-10 lg:col-span-7 z-10">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
              <Zap className="h-4 w-4" />
              <span>Btech2 Percussion Academy</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-100 leading-tight">
              Percussion & Rhythm Lab
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Master the heartbeat of the brass band. Interactive animated drum kit, side drum rudiments, timpani tuning, clash cymbals, glockenspiel notation, and British Whit Friday march cadence simulation.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={toggleMarchEngine}
                className="flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-xs sm:text-sm font-bold text-slate-950 transition-all hover:bg-amber-300 shadow-lg"
              >
                {isPlayingMarch ? <Square className="h-4 w-4 fill-slate-950" /> : <Play className="h-4 w-4 fill-slate-950" />}
                <span>{isPlayingMarch ? 'Stop March Pulse' : 'Play 2/4 Whit Friday March'}</span>
              </button>
            </div>
          </div>

          <div className="relative h-64 lg:h-full lg:col-span-5 min-h-[280px] overflow-hidden">
            <img
              src={percussionHeroImg}
              alt="Orchestral Brass Band Drum Kit and Percussion"
              className="h-full w-full object-cover object-center brightness-90 contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent lg:bg-gradient-to-r lg:from-slate-900 lg:via-transparent" />
            <div className="absolute bottom-3 right-4 rounded-lg bg-slate-950/80 px-3 py-1.5 text-[11px] font-medium text-amber-300 backdrop-blur-md border border-amber-500/20">
              Concert Snare & Tuned Percussion
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: ANIMATED DRUM KIT & INTERACTIVE VISUALIZER */}
      <div className="mb-10 rounded-2xl border border-amber-500/30 bg-slate-900/90 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs uppercase font-semibold text-amber-400 tracking-wider">
              Interactive Drum Stage & Notation
            </span>
            <h2 className="font-serif text-2xl font-bold text-slate-100">
              Brass Band Percussion Stage
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Click any drum on the visual stage or tap keyboard hotkeys (S, B, C, T, G) to trigger authentic synthesized percussion.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-950 border border-slate-800 text-slate-400 px-3 py-1.5 rounded-lg">
              Hotkeys: <strong className="text-amber-400">S B C T G</strong>
            </span>
          </div>
        </div>

        {/* Visual Animated SVG Percussion Rig */}
        <div className="relative aspect-[16/9] max-h-[380px] w-full rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center p-4">
          <svg className="w-full h-full max-w-3xl" viewBox="0 0 600 320">
            {/* Stage floor glow */}
            <ellipse cx="300" cy="270" rx="260" ry="40" fill="#1e293b" fillOpacity="0.4" />

            {/* Timpani 1 & 2 (Far Left) */}
            <g
              onClick={() => handleTriggerPercussion('timpani')}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <ellipse
                cx="110"
                cy="190"
                rx="48"
                ry="30"
                fill={activeKitPart === 'timpani' ? '#38bdf8' : '#0f172a'}
                stroke={activeKitPart === 'timpani' ? '#e0f2fe' : '#0284c7'}
                strokeWidth="4"
              />
              <path d="M 62 190 Q 110 280 158 190 Z" fill="#0369a1" fillOpacity="0.3" stroke="#0284c7" strokeWidth="2" />
              <text x="110" y="195" textAnchor="middle" fill="#bae6fd" fontSize="12" fontWeight="bold">Timpani [T]</text>
            </g>

            {/* Concert Bass Drum (Center Left) */}
            <g
              onClick={() => handleTriggerPercussion('bassdrum')}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <circle
                cx="235"
                cy="170"
                r="64"
                fill={activeKitPart === 'bassdrum' ? '#f43f5e' : '#1e1b4b'}
                stroke={activeKitPart === 'bassdrum' ? '#ffe4e6' : '#e11d48'}
                strokeWidth={activeKitPart === 'bassdrum' ? '6' : '4'}
              />
              <circle cx="235" cy="170" r="50" fill="none" stroke="#be123c" strokeWidth="2" strokeDasharray="4,4" />
              <text x="235" y="174" textAnchor="middle" fill="#fecdd3" fontSize="13" fontWeight="bold">Bass Drum [B]</text>
              <text x="235" y="192" textAnchor="middle" fill="#fda4af" fontSize="9">Pulse Foundation</text>
            </g>

            {/* Snare / Side Drum (Center Right) */}
            <g
              onClick={() => handleTriggerPercussion('snare')}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <ellipse
                cx="370"
                cy="195"
                rx="48"
                ry="26"
                fill={activeKitPart === 'snare' ? '#fbbf24' : '#1e293b'}
                stroke={activeKitPart === 'snare' ? '#fef08a' : '#d97706'}
                strokeWidth={activeKitPart === 'snare' ? '6' : '4'}
              />
              <line x1="335" y1="195" x2="405" y2="195" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
              <text x="370" y="199" textAnchor="middle" fill="#fef3c7" fontSize="12" fontWeight="bold">Side Drum [S]</text>
              <text x="370" y="214" textAnchor="middle" fill="#fde68a" fontSize="9">Snare / Rolls</text>
            </g>

            {/* Clash / Crash Cymbal (Top Center) */}
            <g
              onClick={() => handleTriggerPercussion('cymbal')}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <ellipse
                cx="310"
                cy="75"
                rx="52"
                ry="18"
                fill={activeKitPart === 'cymbal' ? '#fef08a' : '#78350f'}
                stroke={activeKitPart === 'cymbal' ? '#ffffff' : '#eab308'}
                strokeWidth={activeKitPart === 'cymbal' ? '5' : '3'}
              />
              <circle cx="310" cy="75" r="5" fill="#fef08a" />
              <text x="310" y="79" textAnchor="middle" fill="#fef9c3" fontSize="11" fontWeight="bold">Clash Cymbal [C]</text>
            </g>

            {/* Glockenspiel / Bells (Far Right) */}
            <g
              onClick={() => handleTriggerPercussion('glockenspiel')}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <rect
                x="455"
                y="145"
                width="95"
                height="65"
                rx="8"
                fill={activeKitPart === 'glockenspiel' ? '#34d399' : '#064e3b'}
                stroke={activeKitPart === 'glockenspiel' ? '#ecfdf5' : '#059669'}
                strokeWidth={activeKitPart === 'glockenspiel' ? '4' : '3'}
              />
              {/* Glockenspiel metallic bars */}
              {[15, 30, 45, 60, 75].map((bx, i) => (
                <rect key={i} x={455 + bx - 5} y={150} width="6" height={55 - i * 4} fill="#a7f3d0" rx="1" />
              ))}
              <text x="502" y="200" textAnchor="middle" fill="#d1fae5" fontSize="10" fontWeight="bold">Glockenspiel [G]</text>
            </g>
          </svg>

          {/* Hit Flash Badge */}
          {activeKitPart && (
            <div className="absolute top-4 right-4 bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded-full text-xs animate-bounce">
              Sounding: {activeKitPart.toUpperCase()}
            </div>
          )}
        </div>

        {/* Trigger Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6">
          {percussionInstruments.map((inst) => (
            <button
              key={inst.id}
              onClick={() => handleTriggerPercussion(inst.id as any)}
              className={`p-3 rounded-xl border text-left transition-all ${
                activePad === inst.id
                  ? 'border-amber-400 bg-amber-500/20 shadow-lg scale-105'
                  : 'border-slate-800 bg-slate-950 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs font-bold text-amber-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                  [{inst.hotkey}]
                </span>
                <Sparkles className="h-3 w-3 text-slate-500" />
              </div>
              <h4 className="font-serif font-bold text-xs text-slate-100">{inst.name}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{inst.role}</p>
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 2: INTERACTIVE SIDE DRUM RUDIMENT TRAINER */}
      <div className="mb-10 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs uppercase font-semibold text-amber-400 tracking-wider">
              Military & Brass Band Cadence Technique
            </span>
            <h2 className="font-serif text-2xl font-bold text-slate-100">
              Side Drum Essential Rudiments
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select a rudiment below and click "Start Trainer" to see the sticking animation play in real time with audio clicks.
            </p>
          </div>

          <button
            onClick={toggleRudimentPractice}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all shadow-md ${
              isPracticingRudiment
                ? 'bg-rose-500 text-white hover:bg-rose-600'
                : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
            }`}
          >
            {isPracticingRudiment ? (
              <>
                <Square className="h-4 w-4 fill-white" />
                <span>Stop Practice</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-slate-950" />
                <span>Start Rudiment Trainer</span>
              </>
            )}
          </button>
        </div>

        {/* Rudiment Selector Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {rudiments.map((rud, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedRudiment(idx);
                setActiveRudimentStep(0);
                if (isPracticingRudiment) setIsPracticingRudiment(false);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedRudiment === idx
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {rud.name}
            </button>
          ))}
        </div>

        {/* Active Rudiment Display */}
        {(() => {
          const rud = rudiments[selectedRudiment];
          return (
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <span className="font-serif text-lg font-bold text-slate-100">{rud.name}</span>
                <span className="text-xs text-slate-400 font-mono">Sticking: {rud.sticking}</span>
              </div>
              <p className="text-xs text-slate-300">{rud.desc}</p>

              {/* Animated Sticking Steps */}
              <div className="flex items-center gap-2 overflow-x-auto py-2">
                {rud.notes.map((step, sIdx) => {
                  const isCurrent = isPracticingRudiment && activeRudimentStep === sIdx;
                  return (
                    <div
                      key={sIdx}
                      className={`flex-1 min-w-[50px] p-3 rounded-xl border text-center transition-all ${
                        isCurrent
                          ? 'border-amber-400 bg-amber-500/20 text-amber-200 scale-110 shadow-lg'
                          : 'border-slate-800 bg-slate-900 text-slate-400'
                      }`}
                    >
                      <span className="font-mono text-base font-bold block">{step}</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Beat {sIdx + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>

      {/* SECTION 3: BRITISH MARCH TEMPO SIMULATOR */}
      <div className="mb-10 rounded-2xl border border-amber-500/30 bg-slate-900/90 p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
              Rhythm & March Tempo Trainer
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-100">
              The Whit Friday 2/4 Street March Beat
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              British brass bands march at a precise tempo (typically 120 or 128 Beats Per Minute). Beat 1 is anchored by the deep bass drum, and beat 2 is locked in by the side drum rim and snare snap.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Visual Beat Indicator */}
            <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl">
              <div className="text-center">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Beat 1</span>
                <span className={`inline-block h-6 w-6 rounded-full mt-1 transition-all ${
                  isPlayingMarch && currentBeat === 1 ? 'bg-rose-500 shadow-lg shadow-rose-500/50 scale-110' : 'bg-slate-800'
                }`} />
              </div>
              <span className="text-slate-600 font-mono">—</span>
              <div className="text-center">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Beat 2</span>
                <span className={`inline-block h-6 w-6 rounded-full mt-1 transition-all ${
                  isPlayingMarch && currentBeat === 2 ? 'bg-amber-400 shadow-lg shadow-amber-400/50 scale-110' : 'bg-slate-800'
                }`} />
              </div>
            </div>

            {/* Play/Stop Button */}
            <button
              onClick={toggleMarchEngine}
              className={`flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold transition-all shadow-md whitespace-nowrap ${
                isPlayingMarch
                  ? 'bg-rose-500 text-white hover:bg-rose-600'
                  : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
              }`}
            >
              {isPlayingMarch ? (
                <>
                  <Square className="h-4 w-4 fill-white" />
                  <span>Stop March Pulse</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-slate-950" />
                  <span>Start March Pulse (120 BPM)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 4: NOTE VALUES & RHYTHMIC NOTATION */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-100 mb-2">
          Rhythm & Note Duration Guide
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mb-6">
          Understanding note values allows you to count and play cornet and brass band parts with rock-solid rhythm:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rhythmValues.map((rv, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-800 bg-slate-950 p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-serif text-lg font-bold text-slate-200">{rv.name}</span>
                  <span className="font-mono text-xs font-bold text-amber-400">{rv.beats}</span>
                </div>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  {rv.britishTradition}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500">Brass Band Role</span>
                <span className="text-amber-300 font-medium">Standard Notation</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 5: DEDICATED PERCUSSION NOTATION ACADEMY */}
      <div className="mt-12">
        <PercussionNotationAcademy />
      </div>
    </div>
  );
};

