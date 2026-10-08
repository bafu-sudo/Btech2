import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Award,
  BookOpen,
  Volume2,
  Play,
  Square,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Users,
  ChevronRight,
  Flame,
  Clock,
  Layers,
  Music,
  ArrowRight,
  Activity
} from 'lucide-react';
import { brassAudio } from '../audio/brassAudio';
import conductorHeroImg from '../assets/images/bandmaster_isb_conducting_1791391777489.jpg';

interface ConductorPattern {
  name: string;
  meter: string;
  description: string;
  beats: { beat: number; direction: string; desc: string; x: number; y: number }[];
  defaultBpm: number;
}

const CONDUCTING_PATTERNS: ConductorPattern[] = [
  {
    name: '2/4 March Pattern',
    meter: '2/4',
    description: 'The foundation of British brass band street marches & gallops. Crisp ictus at the bottom of the plane with an energetic rebound.',
    defaultBpm: 120,
    beats: [
      { beat: 1, direction: 'Down', desc: 'Downbeat with clear ictus point at bottom center', x: 50, y: 82 },
      { beat: 2, direction: 'Up', desc: 'Rebound straight up ready for next preparatory breath', x: 50, y: 18 }
    ]
  },
  {
    name: '3/4 Waltz / Minuet Pattern',
    meter: '3/4',
    description: 'Used in slow airs, waltzes, and 3-beat hymn tunes. Beat 1 down, Beat 2 out to the right, Beat 3 up to the top.',
    defaultBpm: 96,
    beats: [
      { beat: 1, direction: 'Down', desc: 'Downbeat drop to center floor', x: 50, y: 82 },
      { beat: 2, direction: 'Out (Right)', desc: 'Travel outward horizontally to the right plane', x: 82, y: 55 },
      { beat: 3, direction: 'Up', desc: 'Inward and up rebound to apex', x: 50, y: 18 }
    ]
  },
  {
    name: '4/4 Common Time Pattern',
    meter: '4/4',
    description: 'The classic brass band pattern: 1 is Down, 2 crosses to the Left (inward), 3 swings wide to the Right, 4 lifts straight Up.',
    defaultBpm: 104,
    beats: [
      { beat: 1, direction: 'Down', desc: '1: Downbeat to bottom center (strongest impulse)', x: 50, y: 82 },
      { beat: 2, direction: 'Left (Inside)', desc: '2: Crosses inside towards the left', x: 25, y: 56 },
      { beat: 3, direction: 'Right (Outside)', desc: '3: Sweeps across out to the wide right', x: 78, y: 56 },
      { beat: 4, direction: 'Up', desc: '4: Upbeat rising to the apex preparatory point', x: 50, y: 18 }
    ]
  },
  {
    name: '6/8 Compound Duple (Slow & Fast)',
    meter: '6/8',
    description: 'In fast marches (e.g., Slaidburn), conduct in 2. In slow expressive movements, conduct the full 6 beats: 1-2-3 down & left, 4-5 right, 6 up.',
    defaultBpm: 84,
    beats: [
      { beat: 1, direction: 'Down', desc: '1: Strong downbeat', x: 50, y: 82 },
      { beat: 2, direction: 'Small Left', desc: '2: Rebound slightly left', x: 38, y: 70 },
      { beat: 3, direction: 'Far Left', desc: '3: Swing out to far left', x: 22, y: 56 },
      { beat: 4, direction: 'Cross Right', desc: '4: Secondary accent sweeping across right', x: 65, y: 58 },
      { beat: 5, direction: 'Far Right', desc: '5: Far right extension', x: 82, y: 50 },
      { beat: 6, direction: 'Up Lift', desc: '6: Inward and lifting to top apex', x: 50, y: 18 }
    ]
  }
];

export const BandmasterAcademy: React.FC = () => {
  const [activeCourseModule, setActiveCourseModule] = useState<'leadership' | 'theory' | 'conducting' | 'rehearsal' | 'score' | 'instruments' | 'percussionReading' | 'scoreAnalysis' | 'simulation'>('conducting');
  
  // Conducting Animator State
  const [selectedPatternIndex, setSelectedPatternIndex] = useState<number>(2); // 4/4 default
  const [currentConductorBeat, setCurrentConductorBeat] = useState<number>(1);
  const [isConductingActive, setIsConductingActive] = useState<boolean>(false);
  const [tempoSpeed, setTempoSpeed] = useState<'slow' | 'medium' | 'fast'>('medium');
  const [userBpm, setUserBpm] = useState<number>(104);
  const [playMetronomeClick, setPlayMetronomeClick] = useState<boolean>(true);

  // Rehearsal Scenario Quiz State
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(0);
  const [scenarioAnswer, setScenarioAnswer] = useState<number | null>(null);
  const [showScenarioFeedback, setShowScenarioFeedback] = useState<boolean>(false);

  const currentPattern = CONDUCTING_PATTERNS[selectedPatternIndex];

  // Conducting timer animation loop
  useEffect(() => {
    let intervalId: number | null = null;
    if (isConductingActive) {
      const beatIntervalMs = (60 / userBpm) * 1000;
      intervalId = window.setInterval(() => {
        setCurrentConductorBeat((prevBeat) => {
          const next = prevBeat >= currentPattern.beats.length ? 1 : prevBeat + 1;
          if (playMetronomeClick) {
            // Audio accent on beat 1, softer on others
            if (next === 1) {
              brassAudio.playPercussion('bassdrum');
            } else {
              brassAudio.playPercussion('snare');
            }
          }
          return next;
        });
      }, beatIntervalMs);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isConductingActive, userBpm, currentPattern, playMetronomeClick]);

  const handleSpeedSelect = (speed: 'slow' | 'medium' | 'fast') => {
    setTempoSpeed(speed);
    if (speed === 'slow') setUserBpm(Math.round(currentPattern.defaultBpm * 0.75));
    if (speed === 'medium') setUserBpm(currentPattern.defaultBpm);
    if (speed === 'fast') setUserBpm(Math.round(currentPattern.defaultBpm * 1.35));
  };

  const rehearsalScenarios = [
    {
      title: 'Scenario 1: Overpowering Solo Cornets',
      issue: 'During the cantabile choral section of the hymn tune "Crimond", the front-row cornets are playing so loudly that the tenor horn countermelody and flugelhorn are completely lost.',
      question: 'What is the most effective and respectful way for the bandmaster to balance the ensemble?',
      options: [
        { text: 'Shout at the front row to stop blowing so hard immediately.', correct: false, reason: 'Harsh criticism demoralises players and causes tense tone production.' },
        { text: 'Stop the band calmly, ask the horns and flugel to play their beautiful inner harmony alone so everyone hears it, then bring the cornets back at piano (p) to accompany them.', correct: true, reason: 'Perfect! Giving the inner voices the spotlight allows the cornet section to immediately understand their role as accompaniment.' },
        { text: 'Tell the percussion to play louder to cover the imbalance.', correct: false, reason: 'Adds unnecessary noise without solving ensemble balance.' }
      ]
    },
    {
      title: 'Scenario 2: Rushing the Dotted Quaver-Semiquaver in 2/4 March',
      issue: 'In the bass solo of the march, the BBb and Eb basses are shortening the dotted quaver and turning the semiquaver into a triplet, causing the whole band to rush the tempo.',
      question: 'How should the bandmaster cure this rhythmic inaccuracy?',
      options: [
        { text: 'Have the basses speak or sing the rhythm with the syllable "DUM... pa-DUM", subdividing the 16th note in their mind, before playing with warm detached articulation.', correct: true, reason: 'Rhythmic accuracy starts in the mind and voice. Subdividing 16th notes cures rushing.' },
        { text: 'Wave the baton faster so the band stays ahead of the basses.', correct: false, reason: 'A conductor must never follow a rushing band; this creates chaos.' },
        { text: 'Omit the bass solo from the performance.', correct: false, reason: 'Does not teach or develop the section.' }
      ]
    },
    {
      title: 'Scenario 3: Split High Notes Due to Tension',
      issue: 'The young soprano cornetist is splitting the high A in the penultimate bar because of visible neck tension and overblowing before the concert.',
      question: 'What warm, professional advice should the bandmaster provide?',
      options: [
        { text: 'Remind them of deep diaphragmatic breathing, relaxed shoulders, fast warm air without pressing the mouthpiece hard into the lips, and give them confidence.', correct: true, reason: 'High brass register requires air speed and relaxed support, never brute muscular mouthpiece force.' },
        { text: 'Tell them everyone is watching them and they cannot afford to make a mistake.', correct: false, reason: 'Creates extreme performance anxiety and tightens the embouchure.' },
        { text: 'Ask another player to play it instead without speaking to them.', correct: false, reason: 'Damages student confidence and trust in the bandmaster.' }
      ]
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Hero Banner with Bandmaster & Salvation Army Heritage */}
      <div className="relative mb-10 overflow-hidden rounded-3xl border border-amber-500/30 bg-slate-900 shadow-2xl">
        <div className="relative grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="p-8 sm:p-10 lg:col-span-7 z-10">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
              <Compass className="h-4 w-4" />
              <span>Btech2 Bandmaster Academy</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-100 leading-tight">
              The Bandmaster & Conducting Academy
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Step onto the podium. Master baton technique, animated conducting patterns, full band score reading, rehearsal psychology, and the inspiring leadership tradition of British and Salvation Army brass bandmasters.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveCourseModule('conducting')}
                className="flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-xs sm:text-sm font-bold text-slate-950 transition-all hover:bg-amber-300 shadow-lg"
              >
                <Compass className="h-4 w-4" />
                <span>Interactive Baton Patterns</span>
              </button>
              <button
                onClick={() => setActiveCourseModule('rehearsal')}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3 text-xs sm:text-sm font-medium text-slate-200 transition-all hover:border-amber-400 hover:text-amber-300"
              >
                <Users className="h-4 w-4" />
                <span>Rehearsal Technique & Scenarios</span>
              </button>
            </div>
          </div>

          <div className="relative h-64 lg:h-full lg:col-span-5 min-h-[300px] overflow-hidden">
            <img
              src={conductorHeroImg}
              alt="Brass Bandmaster Conducting with Baton"
              className="h-full w-full object-cover object-center brightness-90 contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent lg:bg-gradient-to-r lg:from-slate-900 lg:via-transparent" />
            <div className="absolute bottom-3 right-4 rounded-lg bg-slate-950/80 px-3 py-1.5 text-[11px] font-medium text-amber-300 backdrop-blur-md border border-amber-500/20">
              International Staff Band Heritage
            </div>
          </div>
        </div>
      </div>

      {/* Academy Navigation Tabs */}
      <div className="mb-8 flex overflow-x-auto pb-2 border-b border-slate-800 gap-2">
        {[
          { id: 'conducting', label: '1. Animated Baton Patterns', icon: Compass },
          { id: 'leadership', label: '2. Bandmaster Leadership & Ethics', icon: Award },
          { id: 'theory', label: '3. Essential Music Knowledge', icon: BookOpen },
          { id: 'rehearsal', label: '4. Rehearsal Masterclass', icon: Users },
          { id: 'score', label: '5. Reading Full Band Scores', icon: Layers },
          { id: 'scoreAnalysis', label: '6. Bandmaster Score Analysis Checklist', icon: CheckCircle2 },
          { id: 'percussionReading', label: '7. How to Read & Conduct Percussion', icon: Activity },
          { id: 'instruments', label: '8. Teaching Every Brass Instrument', icon: Music },
          { id: 'simulation', label: '9. Bandmaster Scenario Simulator', icon: Sparkles }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCourseModule === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCourseModule(tab.id as any)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* MODULE 1: INTERACTIVE CONDUCTING PATTERNS & ANIMATOR */}
      {activeCourseModule === 'conducting' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Animated Baton Stage */}
            <div className="lg:col-span-7 rounded-2xl border border-amber-500/30 bg-slate-900/90 p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs uppercase font-semibold text-amber-400 tracking-wider">
                    Interactive Conducting Canvas
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-100">
                    {currentPattern.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
                    Beat {currentConductorBeat} of {currentPattern.beats.length}
                  </span>
                </div>
              </div>

              {/* Visual Conducting SVG Plane */}
              <div className="relative aspect-[4/3] w-full rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden p-4">
                {/* Visual Grid Lines representing Conducting Plane */}
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  {/* Subtle horizontal ictus baseline */}
                  <line x1="10" y1="82" x2="90" y2="82" stroke="#334155" strokeWidth="0.8" strokeDasharray="2,2" />
                  <text x="12" y="80" fill="#64748b" fontSize="3" fontFamily="sans-serif">Ictus Baseline (Bottom Plane)</text>
                  <text x="12" y="20" fill="#64748b" fontSize="3" fontFamily="sans-serif">Preparatory Apex (Top)</text>

                  {/* Pattern Pathway */}
                  {currentPattern.beats.map((pt, idx) => {
                    const nextPt = currentPattern.beats[(idx + 1) % currentPattern.beats.length];
                    return (
                      <g key={idx}>
                        <line
                          x1={pt.x}
                          y1={pt.y}
                          x2={nextPt.x}
                          y2={nextPt.y}
                          stroke={currentConductorBeat === pt.beat ? '#fbbf24' : '#475569'}
                          strokeWidth={currentConductorBeat === pt.beat ? '2.5' : '1.2'}
                          strokeDasharray={currentConductorBeat === pt.beat ? 'none' : '2,2'}
                        />
                        {/* Waypoint circle */}
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={currentConductorBeat === pt.beat ? 4 : 2.5}
                          fill={currentConductorBeat === pt.beat ? '#f59e0b' : '#334155'}
                          stroke={currentConductorBeat === pt.beat ? '#fef08a' : '#64748b'}
                          strokeWidth="1"
                        />
                        <text
                          x={pt.x + (pt.x > 50 ? 3 : -7)}
                          y={pt.y + 1.5}
                          fill={currentConductorBeat === pt.beat ? '#fbbf24' : '#94a3b8'}
                          fontSize="4.5"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                        >
                          {pt.beat}
                        </text>
                      </g>
                    );
                  })}

                  {/* Animated Baton Tip */}
                  {(() => {
                    const activePoint = currentPattern.beats.find(b => b.beat === currentConductorBeat) || currentPattern.beats[0];
                    return (
                      <g className="transition-all duration-300 ease-out">
                        {/* Glowing halo */}
                        <circle cx={activePoint.x} cy={activePoint.y} r="7" fill="#fbbf24" fillOpacity="0.25" />
                        <circle cx={activePoint.x} cy={activePoint.y} r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.2" />
                        {/* Baton rod representing conductor's white baton */}
                        <line
                          x1="50"
                          y1="96"
                          x2={activePoint.x}
                          y2={activePoint.y}
                          stroke="#ffffff"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          opacity="0.85"
                        />
                      </g>
                    );
                  })()}
                </svg>

                {/* Status Indicator Overlay */}
                <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5 backdrop-blur-sm text-xs">
                  <span className="text-slate-400">Current Motion: </span>
                  <span className="font-bold text-amber-300">
                    {currentPattern.beats.find(b => b.beat === currentConductorBeat)?.desc}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsConductingActive(!isConductingActive)}
                    className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all shadow-md ${
                      isConductingActive
                        ? 'bg-rose-500 text-white hover:bg-rose-600'
                        : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                    }`}
                  >
                    {isConductingActive ? (
                      <>
                        <Square className="h-4 w-4 fill-white" />
                        <span>Stop Conducting</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 fill-slate-950" />
                        <span>Start Animation</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setPlayMetronomeClick(!playMetronomeClick)}
                    className={`rounded-xl px-3 py-2.5 border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      playMetronomeClick
                        ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                        : 'border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                    <span>Drum Cadence Metronome</span>
                  </button>
                </div>

                {/* Speed Toggles */}
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 p-1 rounded-xl text-xs">
                  <span className="px-2 text-slate-500 font-medium">Tempo:</span>
                  {(['slow', 'medium', 'fast'] as const).map((spd) => (
                    <button
                      key={spd}
                      onClick={() => handleSpeedSelect(spd)}
                      className={`px-3 py-1 rounded-lg font-bold capitalize transition-all ${
                        tempoSpeed === spd
                          ? 'bg-amber-400 text-slate-950'
                          : 'text-slate-400 hover:text-slate-100'
                      }`}
                    >
                      {spd} ({spd === 'slow' ? Math.round(currentPattern.defaultBpm * 0.75) : spd === 'medium' ? currentPattern.defaultBpm : Math.round(currentPattern.defaultBpm * 1.35)} BPM)
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Pattern Selection & Teaching Details */}
            <div className="lg:col-span-5 space-y-4">
              <h4 className="font-serif text-lg font-bold text-slate-200">
                Select Time Signature Pattern
              </h4>
              <div className="space-y-3">
                {CONDUCTING_PATTERNS.map((pattern, idx) => (
                  <button
                    key={pattern.meter}
                    onClick={() => {
                      setSelectedPatternIndex(idx);
                      setCurrentConductorBeat(1);
                      setUserBpm(pattern.defaultBpm);
                      setTempoSpeed('medium');
                    }}
                    className={`w-full text-left rounded-xl p-4 border transition-all ${
                      selectedPatternIndex === idx
                        ? 'border-amber-400 bg-amber-500/10 text-slate-100 shadow-md'
                        : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-serif font-bold text-base text-amber-300">
                        {pattern.meter} — {pattern.name}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {pattern.beats.length} Beats
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {pattern.description}
                    </p>
                  </button>
                ))}
              </div>

              {/* Masterclass Conducting Rules */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 mt-4">
                <h5 className="font-serif text-sm font-bold text-amber-400 uppercase tracking-wider mb-3">
                  Essential Baton Technique
                </h5>
                <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>The Ictus:</strong> The precise point in space where the beat clicks. It must be clear and never spongy so the band plays together.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>The Preparatory Beat:</strong> Give one clear beat in the tempo and mood before the entrance. Breathing with your musicians gives them the exact cue.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Cut-offs & Fermatas:</strong> A cut-off is a clean circular gesture bringing the baton to a gentle or firm halt. Never allow a note to fizzle out unconducted.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Left Hand Function:</strong> Your right hand controls the pulse and time. Your left hand controls dynamics, cueing sections, and musical expression.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 2: BANDMASTER LEADERSHIP & ETHICS */}
      {activeCourseModule === 'leadership' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Level 1 — Introduction to Being a Bandmaster
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
              Leadership, Discipline & Respect for Musicians
            </h2>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              In the Salvation Army and British brass band tradition, the bandmaster is not merely a timekeeper. You are a spiritual and musical guide, mentor, and servant leader who brings out the best in every player.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
                <Award className="h-5 w-5" />
                <h3>Musical Leadership</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Be the most prepared person in the rehearsal hall. Study the full score before you step onto the podium. Know the melodies, countermelodies, key changes, and challenging runs so you can direct with total confidence.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
                <Users className="h-5 w-5" />
                <h3>Respect & Encouragement</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Never humiliate or embarrass a player who splits a note. Praise in public, correct in private, and diagnose mechanical or air issues calmly: "Let us try that with more warm air support" rather than "You played out of tune."
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
                <Clock className="h-5 w-5" />
                <h3>Rehearsal Discipline</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Start exactly on time. End on time. When your baton is raised, silence must fall immediately. Insist on prompt attendance and proper instrument maintenance (oiled valves, greased slides).
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
                <Sparkles className="h-5 w-5" />
                <h3>Teaching Youth & Beginners</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                With youth brass bands (like the Salvation Army Young People's Band), keep rehearsals engaging with short focused segments. Celebrate small victories like their first clean 8-bar phrase or B-flat scale.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
                <Flame className="h-5 w-5" />
                <h3>Building Confidence</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Confidence is infectious. Stand tall with relaxed shoulders, warm eye contact, and expressive facial feedback. If the bandmaster looks anxious, the whole band plays with tense sound.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
                <Compass className="h-5 w-5" />
                <h3>Ministry & Purpose</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                In church and community bands, remind your musicians of the higher purpose: lifting souls, comforting the sorrowful, praising God, and enriching the community through magnificent brass sound.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 3: ESSENTIAL MUSIC KNOWLEDGE REQUIRED BY A BANDMASTER */}
      {activeCourseModule === 'theory' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Music Knowledge Curriculum
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
              What Every Bandmaster Must Master
            </h2>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              A brass band conductor must instantly translate between Treble Clef transposed parts and Concert Pitch, spot incorrect accidentals, understand dynamic balances, and hear harmonic triads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-4">
              <h3 className="font-serif text-lg font-bold text-amber-300 flex items-center gap-2">
                <Layers className="h-5 w-5" />
                <span>The Transposition Mastery</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                In the British brass band system, all instruments except the Bass Trombone read in Treble Clef. As bandmaster, you must know what note is actually sounding:
              </p>
              <ul className="space-y-2 text-xs font-mono text-slate-300">
                <li className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-amber-400 font-bold">Bb Instruments</span> (Cornet, Flugel, Baritone, Euphonium, Tenor Trombone, BBb Bass):
                  <span className="block text-slate-400 font-sans mt-0.5">Written C sounds Bb (one major whole tone lower, or tone + octave).</span>
                </li>
                <li className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-amber-400 font-bold">Eb Instruments</span> (Soprano Cornet, Tenor Horn, Eb Bass):
                  <span className="block text-slate-400 font-sans mt-0.5">Written C sounds Eb (major 6th lower for Horn, octave + major 6th for Bass).</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-4">
              <h3 className="font-serif text-lg font-bold text-amber-300 flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                <span>Dynamic Scale & Hierarchies</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Dynamics in a 25-piece brass band are acoustic balances:
              </p>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-900 border border-slate-800 p-2 rounded-lg">
                  <span className="font-bold text-amber-400 block text-base font-serif">pp / p</span>
                  <span className="text-[10px] text-slate-400">Warm, cushioned, supported by air column</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-2 rounded-lg">
                  <span className="font-bold text-amber-400 block text-base font-serif">mf / f</span>
                  <span className="text-[10px] text-slate-400">Singing cantabile tone without over-blowing</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-2 rounded-lg">
                  <span className="font-bold text-amber-400 block text-base font-serif">ff / fff</span>
                  <span className="text-[10px] text-slate-400">Broad, noble, heroic, never brittle or harsh</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 4: REHEARSAL TECHNIQUE */}
      {activeCourseModule === 'rehearsal' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Conducting an Actual Band Rehearsal
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
              Structure of a Successful 2-Hour Rehearsal
            </h2>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              How the world's finest bandmasters divide their rehearsal time for maximum musical growth, pure tone, and joyful music-making.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
            <div className="rounded-xl border border-amber-500/30 bg-slate-950 p-4 space-y-2">
              <span className="text-xs font-mono font-bold text-amber-400">00:00 – 00:15 (15 Min)</span>
              <h4 className="font-serif text-base font-bold text-slate-200">1. Warm-Up & Tuning</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Breathing exercises together. Concert Bb long tones. Remington lip slurs. Choral hymn tune playing for warm intonation.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <span className="text-xs font-mono font-bold text-amber-400">00:15 – 00:50 (35 Min)</span>
              <h4 className="font-serif text-base font-bold text-slate-200">2. Technical Work & Major Work</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tackle the most demanding piece while brains and lips are fresh. Sectional problem solving on fast semiquaver runs and complex time meters.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <span className="text-xs font-mono font-bold text-amber-400">00:55 – 01:30 (35 Min)</span>
              <h4 className="font-serif text-base font-bold text-slate-200">3. Cantabile Solos & Marches</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Work on solo features (Cornet / Euphonium / Horn). Polish the street march and festival hymn arrangements. Balance accompaniment beneath solo line.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <span className="text-xs font-mono font-bold text-amber-400">01:30 – 01:45 (15 Min)</span>
              <h4 className="font-serif text-base font-bold text-slate-200">4. Run-Through & Positive Close</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Run through one piece without stopping from start to finish so musicians leave with a feeling of accomplishment and joy.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 5: HOW TO READ A FULL BAND SCORE */}
      {activeCourseModule === 'score' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              The Conductor's Full Score
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
              Top to Bottom Layout of a British Brass Band Score
            </h2>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Standard British brass band scores follow a strict traditional order of staves from highest pitch to lowest bass, with percussion at the bottom:
            </p>
          </div>

          <div className="space-y-2 pt-2">
            {[
              { num: 1, inst: 'Soprano Cornet in Eb', role: 'Highest voice, octave flurries above the melody', key: 'Eb (Treble Clef)' },
              { num: 2, inst: 'Solo Cornet in Bb (4 players)', role: 'Principal melody carriers & lead cadenzas', key: 'Bb (Treble Clef)' },
              { num: 3, inst: 'Repiano Cornet in Bb', role: 'Bridge between solo & back row, unison with flugel', key: 'Bb (Treble Clef)' },
              { num: 4, inst: '2nd Cornet in Bb (2 players)', role: 'Harmony 3rds and 6ths below the solo line', key: 'Bb (Treble Clef)' },
              { num: 5, inst: '3rd Cornet in Bb (2 players)', role: 'Low register cornet harmonic support', key: 'Bb (Treble Clef)' },
              { num: 6, inst: 'Flugelhorn in Bb', role: 'Warm vocal middle voice, connecting to horns', key: 'Bb (Treble Clef)' },
              { num: 7, inst: 'Solo Tenor Horn in Eb', role: 'Middle brass color and lyrical solos', key: 'Eb (Treble Clef)' },
              { num: 8, inst: '1st & 2nd Tenor Horns in Eb', role: 'Off-beat rhythmic chop & harmonic chords', key: 'Eb (Treble Clef)' },
              { num: 9, inst: '1st & 2nd Baritone in Bb', role: 'Tenor voice agility, doubling euphonium/tenor lines', key: 'Bb (Treble Clef)' },
              { num: 10, inst: '1st & 2nd Tenor Trombone in Bb', role: 'Cylindrical punch, crisp fanfares & chorales', key: 'Bb (Treble Clef)' },
              { num: 11, inst: 'Bass Trombone', role: 'Only non-transposing brass: Real concert pitch bass clef', key: 'Concert Pitch (Bass Clef)' },
              { num: 12, inst: 'Euphonium in Bb (2 players)', role: 'Countermelodies, rich cello-like tenor core', key: 'Bb (Treble Clef)' },
              { num: 13, inst: 'Eb Bass / Tuba (2 players)', role: 'Harmonic foundation & walking basslines', key: 'Eb (Treble Clef)' },
              { num: 14, inst: 'BBb Bass / Tuba (2 players)', role: 'Sub-bass floor of the band', key: 'Bb (Treble Clef)' },
              { num: 15, inst: 'Percussion (Snare, Bass Drum, Cymbals, Timpani, Glockenspiel)', role: 'Rhythmic propulsion, pulse & dramatic color', key: 'Percussion / Concert' }
            ].map((stave) => (
              <div
                key={stave.num}
                className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3 hover:border-slate-700 transition-colors gap-2"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 border border-slate-800 font-mono text-xs font-bold text-amber-400">
                    {stave.num}
                  </span>
                  <div>
                    <span className="font-serif font-bold text-sm text-slate-100">{stave.inst}</span>
                    <span className="text-xs text-slate-400 block">{stave.role}</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-medium text-amber-300 sm:text-right bg-slate-900/60 px-2 py-1 rounded border border-slate-800">
                  {stave.key}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 6: BANDMASTER SCORE ANALYSIS CHECKLIST */}
      {activeCourseModule === 'scoreAnalysis' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Podium Score Inspection Method
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
              Bandmaster 12-Point Score Analysis Checklist
            </h2>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Before raising your baton in front of your band, study the conductor score using this professional 12-point inspection routine:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {[
              { num: 1, title: 'Instrumentation & Clefs', desc: 'Scan staves from top to bottom. Confirm if Bass Trombone is in concert Bass Clef and note mute indications.' },
              { num: 2, title: 'Key Signatures & Transpositions', desc: 'Check starting key. Compare concert pitch against Bb (+2 sharps or -2 flats) and Eb (+3 sharps or -3 flats).' },
              { num: 3, title: 'Time Signature & Pulse', desc: 'Determine whether to conduct in 2, 3, 4, or subdivided 6. Spot any metric modulations or alla breve shifts.' },
              { num: 4, title: 'Tempo & Expressive Directives', desc: 'Establish the exact BPM in your inner ear. Mark accelerandos, ritenutos, and fermata holds.' },
              { num: 5, title: 'Melodic Line & Countermelodies', desc: 'Track where the melody moves: does it pass from Solo Cornet to Euphonium or Flugelhorn?' },
              { num: 6, title: 'Harmonic Architecture', desc: 'Identify tonic and dominant chords. Mark climax cadences (V-I) and unexpected minor key modulations.' },
              { num: 7, title: 'Dynamic Architecture & Balance', desc: 'Differentiate between soloist mf and accompaniment p. Ensure horns do not cover flugelhorn cantabiles.' },
              { num: 8, title: 'Articulations & Phrasing', desc: 'Ensure section uniform articulation: are cornets playing staccato while baritones play tenuto?' },
              { num: 9, title: 'Sectional Entrances & Cues', desc: 'Highlight crucial section entries after long rests (e.g., Soprano Cornet high entry, muted trombone fanfares).' },
              { num: 10, title: 'Percussion Cues & Balance', desc: 'Check snare roll transitions, bass drum downbeats in marches, and glockenspiel doubles.' },
              { num: 11, title: 'Anticipate Technical Pitfalls', desc: 'Isolate rapid semiquaver runs, tricky accidentals, or treacherous intonation intervals.' },
              { num: 12, title: 'Rehearsal Plan & Strategy', desc: 'Decide which difficult rehearsal letter to rehearse first rather than simply playing from bar 1 to the end.' }
            ].map(item => (
              <div key={item.num} className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
                    {item.num}
                  </span>
                  <h4 className="font-serif font-bold text-slate-100 text-sm">{item.title}</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 7: HOW TO READ & CONDUCT PERCUSSION */}
      {activeCourseModule === 'percussionReading' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Ensemble Coordination
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
              Bandmaster: How to Read & Coordinate Percussion
            </h2>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Percussion is the acoustic engine of the brass band. A bandmaster must clearly read percussion parts at the bottom of the score, maintain acoustic balance, and coordinate clean brass entrances with percussion accents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-950 space-y-3">
              <h4 className="font-serif font-bold text-amber-300 text-base">March Tempo & Bass Drum Lockdown</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                In street marches (such as <em>Slaidburn</em> or <em>The Contest</em>), the concert bass drum anchors Beat 1. If the band rushes, do not speed up the baton; hold eye contact with the bass drummer to anchor the downbeat at exactly 120 BPM.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-800 bg-slate-950 space-y-3">
              <h4 className="font-serif font-bold text-amber-300 text-base">Snare Rolls & Brass Crescendos</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                When a sustained side drum roll leads into a tutti fanfare, indicate the crescendo with your left hand raised upward. Ensure the snare drum cutoff aligns exactly with the final brass staccato chord.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-800 bg-slate-950 space-y-3">
              <h4 className="font-serif font-bold text-amber-300 text-base">Clash Cymbals: Timing the Crash</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Clash cymbals require physical preparation: the player must lift both plates prior to the beat. Give an early, decisive preparatory gesture so the clash speaks cleanly on the exact impact point.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-800 bg-slate-950 space-y-3">
              <h4 className="font-serif font-bold text-amber-300 text-base">Tuned Percussion Balance (Glockenspiel & Timpani)</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Glockenspiel cuts through dense brass textures. Ensure the player uses softer brass or rubber mallets during delicate hymn tune phrases so high bells do not overpower the solo cornet.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 8: TEACHING EVERY BRASS INSTRUMENT */}
      {activeCourseModule === 'instruments' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Pedagogy for Bandmasters
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
              How to Diagnose & Teach Every Instrument in Your Band
            </h2>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              A champion bandmaster understands the mechanical nuances and common flaws of each instrument:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {[
              {
                name: 'Bb Cornet & Trumpet',
                issue: 'Pinched high notes, excessive mouthpiece pressure, fast tired lips.',
                cure: 'Instruct them to keep teeth open, use arched tongue ("ee" for high, "ah" for low), and push air from the abdomen rather than jamming the mouthpiece against teeth.'
              },
              {
                name: 'Eb Tenor Horn',
                issue: 'Muddy, breathy tone and rushing off-beats.',
                cure: 'Have them blow warm air into the deep funnel mouthpiece. In marches, articulate off-beats with a crisp "tah" rather than a weak "dah".'
              },
              {
                name: 'Euphonium',
                issue: 'Heavy, sluggish valve action on fast runs.',
                cure: 'Ensure 4th valve compensating system is cleaned. Have the player hold fingers curved directly over valve caps, never flat-fingered.'
              },
              {
                name: 'Trombone',
                issue: 'Smearing between notes without deliberate slide precision.',
                cure: 'Remind them: the slide must move lightning-fast between positions, while the lip articulates at the exact instant the slide arrives.'
              },
              {
                name: 'Eb & BBb Bass (Tubas)',
                issue: 'Running out of breath within 2 bars, lagging behind the beat.',
                cure: 'Breathe on the "and" before the beat. Take huge relaxed breaths like a deep yawn. Never hold back air—let huge volume of relaxed air resonate the bell.'
              },
              {
                name: 'Side Drum & Timpani',
                issue: 'Playing through the head rather than drawing sound out.',
                cure: 'Hold sticks with relaxed fulcrum. Think of pulling the sound out of the drum head with a quick wrist rebound rather than driving into the skin.'
              }
            ].map((item, idx) => (
              <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-3">
                <h4 className="font-serif font-bold text-amber-300 text-base">{item.name}</h4>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-rose-400 font-semibold block">Common Flaw:</span>
                  <p className="text-xs text-slate-300 mt-0.5">{item.issue}</p>
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold block">Bandmaster Cure:</span>
                  <p className="text-xs text-slate-300 mt-0.5">{item.cure}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 7: REHEARSAL SCENARIO SIMULATOR */}
      {activeCourseModule === 'simulation' && (
        <div className="rounded-2xl border border-amber-500/30 bg-slate-900/90 p-6 sm:p-8 space-y-6">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Interactive Bandmaster Decisions
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
              Podium Scenario Simulator
            </h2>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Test your musical instincts in realistic rehearsal dilemmas. How would you solve these challenges on the podium?
            </p>
          </div>

          {/* Scenario Tabs */}
          <div className="flex flex-wrap gap-2 pt-2">
            {rehearsalScenarios.map((sc, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedScenarioIndex(idx);
                  setScenarioAnswer(null);
                  setShowScenarioFeedback(false);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedScenarioIndex === idx
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {sc.title}
              </button>
            ))}
          </div>

          {/* Active Scenario Card */}
          {(() => {
            const sc = rehearsalScenarios[selectedScenarioIndex];
            return (
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-5">
                <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
                    Rehearsal Problem:
                  </span>
                  <p className="text-sm text-slate-200 leading-relaxed font-medium">
                    {sc.issue}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-serif text-base font-bold text-slate-100">
                    {sc.question}
                  </h4>

                  <div className="space-y-2">
                    {sc.options.map((opt, oIdx) => {
                      const isSelected = scenarioAnswer === oIdx;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => {
                            setScenarioAnswer(oIdx);
                            setShowScenarioFeedback(true);
                          }}
                          className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                            isSelected
                              ? opt.correct
                                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-200'
                                : 'border-rose-500 bg-rose-500/10 text-rose-200'
                              : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="font-bold text-amber-400 mt-0.5">
                              {String.fromCharCode(65 + oIdx)}.
                            </span>
                            <span>{opt.text}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {showScenarioFeedback && scenarioAnswer !== null && (
                  <div className={`p-4 rounded-xl border ${
                    sc.options[scenarioAnswer].correct
                      ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-200'
                      : 'border-rose-500/50 bg-rose-950/40 text-rose-200'
                  }`}>
                    <div className="flex items-center gap-2 font-bold text-sm mb-1">
                      {sc.options[scenarioAnswer].correct ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                          <span>Correct Bandmaster Instinct!</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-5 w-5 text-rose-400" />
                          <span>Not the recommended approach:</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs leading-relaxed text-slate-300">
                      {sc.options[scenarioAnswer].reason}
                    </p>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
