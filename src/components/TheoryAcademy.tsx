import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Volume2,
  Play,
  Square,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Award,
  Layers,
  ChevronRight,
  Search,
  Music,
  ArrowRight,
  Activity,
  Sliders
} from 'lucide-react';
import { brassAudio } from '../audio/brassAudio';
import { NotationFlashcards } from './NotationFlashcards';

interface TheoryModule {
  id: string;
  number: number;
  title: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
}

const THEORY_MODULES: TheoryModule[] = [
  { id: 'basics', number: 1, title: 'Music Basics & The Staff', category: 'Fundamentals', level: 'Beginner', summary: 'Staff lines, clefs (Treble, Bass, Alto), ledger lines, note names, bar lines & measures.' },
  { id: 'rhythm', number: 2, title: 'Note Values & Rhythm Counting', category: 'Rhythm', level: 'Beginner', summary: 'Semibreve to semiquavers, dotted notes, ties, rests, and 1-e-&-a counting.' },
  { id: 'meter', number: 3, title: 'Time Signatures (Simple & Compound)', category: 'Rhythm', level: 'Beginner', summary: 'Numerator, denominator, 2/4, 3/4, 4/4, 6/8, 9/8, 12/8 and how conductors feel pulses.' },
  { id: 'scales', number: 4, title: 'Major, Minor & Blues Scales', category: 'Harmony', level: 'Intermediate', summary: 'Tonic, dominant, leading tone, whole/half steps, major and 3 forms of minor.' },
  { id: 'keys', number: 5, title: 'Key Signatures & Circle of 5ths', category: 'Harmony', level: 'Intermediate', summary: 'Order of sharps (FCGDAEB) & flats (BEADGCF), circle navigation and quizzes.' },
  { id: 'accidentals', number: 6, title: 'Accidentals (Sharps, Flats, Naturals)', category: 'Harmony', level: 'Beginner', summary: 'Pitch shifts, enharmonics, double sharps/flats, and valve impact.' },
  { id: 'intervals', number: 7, title: 'Intervals Academy', category: 'Ear Training', level: 'Intermediate', summary: 'Unison, 2nds, 3rds, 4ths, 5ths, octaves; major, minor, perfect, augmented, diminished.' },
  { id: 'triads', number: 8, title: 'Triads Academy (Major, Minor, Dim, Aug)', category: 'Harmony', level: 'Intermediate', summary: 'Stacked thirds, roots, 3rds and 5ths in all 12 keys with interactive audio synthesis.' },
  { id: 'chords', number: 9, title: 'Chords, 7ths & Roman Numerals', category: 'Harmony', level: 'Advanced', summary: 'Major 7ths, Dominant 7ths, chord progressions (Iâ€“IVâ€“Vâ€“I) and brass band voicing.' },
  { id: 'cadences', number: 10, title: 'Cadences & Harmonic Endings', category: 'Harmony', level: 'Advanced', summary: 'Authentic (V-I), Plagal (IV-I "Amen"), Half (to V), and Deceptive (V-vi) cadences.' },
  { id: 'articulation', number: 11, title: 'Articulation Academy', category: 'Performance', level: 'Beginner', summary: 'Staccato, tenuto, accent, marcato, slur, tie, and brass tongue technique.' },
  { id: 'dynamics', number: 12, title: 'Dynamics & Expressive Markings', category: 'Performance', level: 'Beginner', summary: 'pp to fff, crescendo, diminuendo, sforzando, and acoustic volume balance.' },
  { id: 'tempo', number: 13, title: 'Tempo Markings & Metronome BPM', category: 'Performance', level: 'Beginner', summary: 'Largo to Presto, accelerando, ritardando, and practice speed control.' },
  { id: 'glossary', number: 14, title: 'Musical Terms & Italian Glossary', category: 'Reference', level: 'Beginner', summary: 'Complete searchable dictionary of brass band and classical terms.' },
  { id: 'ornaments', number: 15, title: 'Ornaments & Embellishments', category: 'Advanced', level: 'Advanced', summary: 'Trills, grace notes, mordents, turns, appoggiaturas & acciaccaturas.' },
  { id: 'transposition', number: 16, title: 'Brass Band Transposition Masterclass', category: 'Brass Band', level: 'Intermediate', summary: 'Why Bb & Eb brass transpose, reading concert pitch, and octave displacement.' }
];

export const TheoryAcademy: React.FC = () => {
  const [activeModuleId, setActiveModuleId] = useState<string>('basics');
  const [activeLevelFilter, setActiveLevelFilter] = useState<string>('All');
  
  // Interactive Beat Counter (Part 2)
  const [isCountingActive, setIsCountingActive] = useState<boolean>(false);
  const [counterMeter, setCounterMeter] = useState<'4/4' | '3/4' | '2/4' | '6/8'>('4/4');
  const [counterSubdivision, setCounterSubdivision] = useState<'quarter' | 'eighth' | 'sixteenth'>('quarter');
  const [activeSubBeat, setActiveSubBeat] = useState<number>(1);
  const [counterBpm, setCounterBpm] = useState<number>(84);
  const counterTimerRef = useRef<number | null>(null);

  // Interactive Triad Builder (Part 8)
  const [triadRoot, setTriadRoot] = useState<string>('C');
  const [triadType, setTriadType] = useState<'major' | 'minor' | 'diminished' | 'augmented'>('major');

  // Interactive Interval Explorer (Part 7)
  const [selectedInterval, setSelectedInterval] = useState<number>(4); // Perfect 5th

  // Interactive Cadence Player (Part 10)
  const [activeCadenceType, setActiveCadenceType] = useState<'perfect' | 'plagal' | 'half' | 'deceptive'>('perfect');

  // Searchable Glossary State (Part 14)
  const [glossarySearch, setGlossarySearch] = useState<string>('');

  // Theory Quiz State
  const [quizQuestionIndex, setQuizQuestionIndex] = useState<number>(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [showQuizExplanation, setShowQuizExplanation] = useState<boolean>(false);

  // Beat Counter Timer
  useEffect(() => {
    if (!isCountingActive) {
      if (counterTimerRef.current) clearInterval(counterTimerRef.current);
      return;
    }

    const beatsPerMeasure = counterMeter === '2/4' ? 2 : counterMeter === '3/4' ? 3 : counterMeter === '6/8' ? 6 : 4;
    const subdivisionsPerBeat = counterSubdivision === 'quarter' ? 1 : counterSubdivision === 'eighth' ? 2 : 4;
    const totalSteps = beatsPerMeasure * subdivisionsPerBeat;
    const stepDurationMs = (60000 / counterBpm) / subdivisionsPerBeat;

    let currentStep = 1;

    counterTimerRef.current = window.setInterval(() => {
      setActiveSubBeat(currentStep);

      // Play audio pulse
      if (currentStep === 1) {
        brassAudio.playPercussion('bassdrum');
      } else if (currentStep % subdivisionsPerBeat === 1 || subdivisionsPerBeat === 1) {
        brassAudio.playPercussion('snare');
      } else {
        brassAudio.playPercussion('woodblock');
      }

      currentStep = currentStep >= totalSteps ? 1 : currentStep + 1;
    }, stepDurationMs);

    return () => {
      if (counterTimerRef.current) clearInterval(counterTimerRef.current);
    };
  }, [isCountingActive, counterMeter, counterSubdivision, counterBpm]);

  // Root note frequencies for Triads (Concert pitch in 4th octave)
  const rootFrequencies: Record<string, { root: number; name: string }> = {
    C: { root: 261.63, name: 'C' },
    D: { root: 293.66, name: 'D' },
    Eb: { root: 311.13, name: 'Eâ™­' },
    E: { root: 329.63, name: 'E' },
    F: { root: 349.23, name: 'F' },
    G: { root: 392.00, name: 'G' },
    Ab: { root: 415.30, name: 'Aâ™­' },
    A: { root: 440.00, name: 'A' },
    Bb: { root: 466.16, name: 'Bâ™­' }
  };

  const getTriadFrequencies = (rootName: string, type: 'major' | 'minor' | 'diminished' | 'augmented'): [number, number, number] => {
    const baseFreq = rootFrequencies[rootName]?.root || 261.63;
    // Semitone multiplier: 2^(semitones/12)
    const semitone = (st: number) => baseFreq * Math.pow(2, st / 12);

    if (type === 'major') {
      return [baseFreq, semitone(4), semitone(7)]; // Root, Major 3rd (4 st), Perfect 5th (7 st)
    } else if (type === 'minor') {
      return [baseFreq, semitone(3), semitone(7)]; // Root, Minor 3rd (3 st), Perfect 5th (7 st)
    } else if (type === 'diminished') {
      return [baseFreq, semitone(3), semitone(6)]; // Root, Minor 3rd (3 st), Diminished 5th (6 st)
    } else {
      return [baseFreq, semitone(4), semitone(8)]; // Root, Major 3rd (4 st), Augmented 5th (8 st)
    }
  };

  const handlePlayTriad = () => {
    const freqs = getTriadFrequencies(triadRoot, triadType);
    brassAudio.playTriad(freqs, 1.4, 'cornet');
  };

  const handlePlayArpeggiatedTriad = () => {
    const freqs = getTriadFrequencies(triadRoot, triadType);
    freqs.forEach((f, idx) => {
      setTimeout(() => {
        brassAudio.playBrassTone(f, 0.45, 'cornet');
      }, idx * 280);
    });
  };

  // Intervals data (Part 7)
  const intervalsList = [
    { name: 'Unison (P1)', semitones: 0, desc: 'Identical pitch. Pure resonance in section tuning.', ratio: '1:1' },
    { name: 'Minor 2nd (m2)', semitones: 1, desc: '1 semitone (half step). Sharp dissonance, tension.', ratio: '16:15' },
    { name: 'Major 2nd (M2)', semitones: 2, desc: '2 semitones (whole step). Stepwise melodic motion.', ratio: '9:8' },
    { name: 'Minor 3rd (m3)', semitones: 3, desc: '3 semitones. Sombre, contemplative minor quality.', ratio: '6:5' },
    { name: 'Major 3rd (M3)', semitones: 4, desc: '4 semitones. Bright, triumphant major triad core.', ratio: '5:4' },
    { name: 'Perfect 4th (P4)', semitones: 5, desc: '5 semitones. Bold brass fanfare and hymn opening.', ratio: '4:3' },
    { name: 'Tritone / Dim 5th', semitones: 6, desc: '6 semitones (diabolus in musica). Maximum tension.', ratio: '45:32' },
    { name: 'Perfect 5th (P5)', semitones: 7, desc: '7 semitones. The most consonant hollow interval.', ratio: '3:2' },
    { name: 'Minor 6th (m6)', semitones: 8, desc: '8 semitones. Warm, romantic longing.', ratio: '8:5' },
    { name: 'Major 6th (M6)', semitones: 9, desc: '9 semitones. Pastoral, lyrical sweetness.', ratio: '5:3' },
    { name: 'Minor 7th (m7)', semitones: 10, desc: '10 semitones. Dominant 7th pull toward tonic.', ratio: '16:9' },
    { name: 'Major 7th (M7)', semitones: 11, desc: '11 semitones. Piercing aspiration leading to octave.', ratio: '15:8' },
    { name: 'Perfect Octave (P8)', semitones: 12, desc: '12 semitones. Same pitch letter, doubled frequency.', ratio: '2:1' }
  ];

  const handlePlayInterval = (semitones: number) => {
    const baseFreq = 261.63; // Middle C
    const secondFreq = baseFreq * Math.pow(2, semitones / 12);
    // Play both together
    brassAudio.playBrassTone(baseFreq, 1.1, 'cornet');
    brassAudio.playBrassTone(secondFreq, 1.1, 'cornet');
  };

  // Cadences (Part 10)
  const cadences = [
    {
      id: 'perfect',
      name: 'Perfect Authentic Cadence (V â†’ I)',
      chords: 'G Major â†’ C Major',
      desc: 'The definitive musical full stop. Creates absolute resolution and finality in hymns & marches.',
      notes: [
        [392.00, 493.88, 587.33] as [number, number, number], // G-B-D (V)
        [261.63, 329.63, 392.00] as [number, number, number]  // C-E-G (I)
      ]
    },
    {
      id: 'plagal',
      name: 'Plagal Cadence (IV â†’ I "Amen")',
      chords: 'F Major â†’ C Major',
      desc: 'Known as the "Church Cadence" or "Amen Cadence". Warm, serene religious resolution.',
      notes: [
        [349.23, 440.00, 523.25] as [number, number, number], // F-A-C (IV)
        [261.63, 329.63, 392.00] as [number, number, number]  // C-E-G (I)
      ]
    },
    {
      id: 'half',
      name: 'Half Cadence (I â†’ V)',
      chords: 'C Major â†’ G Major',
      desc: 'Ends on the dominant chord (V). Acts like a musical question mark requiring continuation.',
      notes: [
        [261.63, 329.63, 392.00] as [number, number, number], // C-E-G (I)
        [392.00, 493.88, 587.33] as [number, number, number]  // G-B-D (V)
      ]
    },
    {
      id: 'deceptive',
      name: 'Deceptive / Interrupted Cadence (V â†’ vi)',
      chords: 'G Major â†’ A Minor',
      desc: 'Surprise twist! Instead of resolving to the tonic (I), it resolves to the minor submediant (vi).',
      notes: [
        [392.00, 493.88, 587.33] as [number, number, number], // G-B-D (V)
        [440.00, 523.25, 659.25] as [number, number, number]  // A-C-E (vi)
      ]
    }
  ];

  const handlePlayCadence = (cadenceId: 'perfect' | 'plagal' | 'half' | 'deceptive') => {
    const c = cadences.find(x => x.id === cadenceId);
    if (!c) return;
    brassAudio.playCadence(c.notes, 750);
  };

  // Glossary terms (Part 14)
  const glossaryTerms = [
    { term: 'Accelerando (accel.)', cat: 'Tempo', meaning: 'Gradually increase the tempo / play faster.' },
    { term: 'Adagio', cat: 'Tempo', meaning: 'Slow and stately tempo (typically 66â€“76 BPM).' },
    { term: 'Allegro', cat: 'Tempo', meaning: 'Lively, brisk and cheerful tempo (typically 120â€“156 BPM).' },
    { term: 'Andante', cat: 'Tempo', meaning: 'At a gentle walking pace (typically 76â€“108 BPM).' },
    { term: 'Cantabile', cat: 'Expression', meaning: 'In a singing, lyrical and expressive style.' },
    { term: 'Crescendo (cresc.)', cat: 'Dynamics', meaning: 'Gradually becoming louder (indicated by < wedge).' },
    { term: 'Diminuendo (dim.)', cat: 'Dynamics', meaning: 'Gradually becoming softer (indicated by > wedge).' },
    { term: 'Fermata (ð„)', cat: 'Notation', meaning: 'Pause / hold the note longer than its written value until conductor cut-off.' },
    { term: 'Forte (f)', cat: 'Dynamics', meaning: 'Loud volume, full resonant brass tone.' },
    { term: 'Legato', cat: 'Articulation', meaning: 'Smoothly connected notes without separation.' },
    { term: 'Marcato (^)', cat: 'Articulation', meaning: 'Strongly accented and detached ("hat" symbol above note).' },
    { term: 'Mezzo Forte (mf)', cat: 'Dynamics', meaning: 'Moderately loud (standard brass band conversational volume).' },
    { term: 'Mezzo Piano (mp)', cat: 'Dynamics', meaning: 'Moderately soft.' },
    { term: 'Pianissimo (pp)', cat: 'Dynamics', meaning: 'Very soft, warm supported air column.' },
    { term: 'Rallentando (rall.)', cat: 'Tempo', meaning: 'Gradually slowing down.' },
    { term: 'Sforzando (sfz)', cat: 'Dynamics', meaning: 'Sudden strong and forceful accent.' },
    { term: 'Staccato (â€¢)', cat: 'Articulation', meaning: 'Short and detached note (dot above/below notehead).' },
    { term: 'Tenuto (â€”)', cat: 'Articulation', meaning: 'Hold the note for its full duration, with gentle weight.' },
    { term: 'Tutti', cat: 'Brass Band', meaning: 'All players together (full band entrance after solo).' },
    { term: 'Vivace', cat: 'Tempo', meaning: 'Lively and fast, with spirited energy.' }
  ];

  const filteredGlossary = glossaryTerms.filter(t => {
    const q = glossarySearch.toLowerCase().trim();
    return !q || t.term.toLowerCase().includes(q) || t.meaning.toLowerCase().includes(q) || t.cat.toLowerCase().includes(q);
  });

  // Theory Quizzes (Part 49)
  const theoryQuestions = [
    {
      q: 'What interval exists between C and G?',
      options: ['Major 3rd', 'Perfect 4th', 'Perfect 5th', 'Major 6th'],
      correct: 2,
      exp: 'C to G spans 7 semitones (5 staff steps: C-D-E-F-G), which constitutes a Perfect 5th.'
    },
    {
      q: 'Which notes form a C Major Triad?',
      options: ['C â€“ Eâ™­ â€“ G', 'C â€“ E â€“ G', 'C â€“ E â€“ G#', 'C â€“ F â€“ G'],
      correct: 1,
      exp: 'A major triad consists of a Root (C), Major 3rd (E, 4 semitones), and Perfect 5th (G, 7 semitones).'
    },
    {
      q: 'What is the "Church" or "Amen" cadence called?',
      options: ['Perfect Authentic Cadence', 'Plagal Cadence (IV â†’ I)', 'Half Cadence', 'Deceptive Cadence'],
      correct: 1,
      exp: 'The Plagal Cadence (IV to I) is traditionally sung as "A-men" at the conclusion of hymns.'
    },
    {
      q: 'In 4/4 time, how many beats does a dotted half note (minim) receive?',
      options: ['2 beats', '3 beats', '4 beats', '1.5 beats'],
      correct: 1,
      exp: 'A half note is 2 beats. The dot adds half of its value (+1 beat), making a total of 3 beats.'
    },
    {
      q: 'What does a Staccato dot (â€¢) indicate on a brass note?',
      options: ['Play note as loud as possible', 'Short, separated and detached note', 'Hold note for double duration', 'Slide up to the next pitch'],
      correct: 1,
      exp: 'Staccato indicates that the note is played short and cleanly separated from the next note.'
    }
  ];

  const currentQ = theoryQuestions[quizQuestionIndex];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Hero Header */}
      <div className="relative mb-8 overflow-hidden rounded-3xl border border-amber-500/30 bg-slate-900 p-8 sm:p-10 shadow-2xl">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
            <BookOpen className="h-4 w-4" />
            <span>Complete Music Theory Academy Â· All 16 Master Modules</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-slate-100">
            Learn, Hear, Understand & Master Music Theory
          </h1>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            From your very first line and space on the staff to advanced 4-part cadences, circle of fifths, intervals, triads, and brass articulations. Integrated with interactive sound synthesis so you hear every concept in real time.
          </p>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="mb-8 flex overflow-x-auto pb-2 border-b border-slate-800 gap-2 scrollbar-none">
        {THEORY_MODULES.map((m) => {
          const isActive = activeModuleId === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setActiveModuleId(m.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <span className="font-mono text-xs text-amber-500">{m.number}.</span>
              <span>{m.title}</span>
            </button>
          );
        })}
      </div>

      {/* MODULE 1: MUSIC BASICS & THE STAFF */}
      {activeModuleId === 'basics' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8">
            <h2 className="font-serif text-2xl font-bold text-slate-100 mb-2">
              1. The Musical Staff, Clefs & Notes
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Music is written on a <strong>staff</strong> consisting of <strong>5 horizontal lines</strong> and <strong>4 spaces</strong>. Notes are named after the first seven letters of the alphabet: <strong>A, B, C, D, E, F, G</strong>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-3">
                <h3 className="font-serif text-lg font-bold text-amber-400">Treble Clef (G Clef)</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The standard clef for all British brass band instruments (except Bass Trombone). The swirl wraps around the 2nd line, fixing it as the note <strong>G</strong>.
                </p>
                <div className="p-3 bg-slate-900 rounded-lg text-xs space-y-1">
                  <div><strong>Lines (Bottom to Top):</strong> E â€“ G â€“ B â€“ D â€“ F <em>("Every Good Boy Deserves Football")</em></div>
                  <div><strong>Spaces (Bottom to Top):</strong> F â€“ A â€“ C â€“ E <em>(Spells "FACE")</em></div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-3">
                <h3 className="font-serif text-lg font-bold text-amber-400">Bass Clef (F Clef)</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Used by the Bass Trombone in brass band scores, and in piano left-hand or orchestral tubas. The two dots surround the 4th line, fixing it as <strong>F</strong>.
                </p>
                <div className="p-3 bg-slate-900 rounded-lg text-xs space-y-1">
                  <div><strong>Lines (Bottom to Top):</strong> G â€“ B â€“ D â€“ F â€“ A <em>("Good Boys Do Fine Always")</em></div>
                  <div><strong>Spaces (Bottom to Top):</strong> A â€“ C â€“ E â€“ G <em>("All Cows Eat Grass")</em></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 2: RHYTHM & ANIMATED BEAT COUNTER */}
      {activeModuleId === 'rhythm' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-amber-500/30 bg-slate-900/90 p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs uppercase font-semibold text-amber-400 tracking-wider">
                  Interactive Rhythm Trainer
                </span>
                <h2 className="font-serif text-2xl font-bold text-slate-100">
                  Animated Beat Counter & Counting Engine
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Listen to subdivisions in real time: Quarter notes (1, 2, 3, 4), Eighth notes (1 & 2 &), and Sixteenth notes (1 e & a).
                </p>
              </div>

              <button
                onClick={() => setIsCountingActive(!isCountingActive)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow ${
                  isCountingActive
                    ? 'bg-rose-500 text-white hover:bg-rose-600'
                    : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                }`}
              >
                {isCountingActive ? <Square className="h-4 w-4 fill-white" /> : <Play className="h-4 w-4 fill-slate-950" />}
                <span>{isCountingActive ? 'Stop Counter' : 'Start Beat Counter'}</span>
              </button>
            </div>

            {/* Controls Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950 border border-slate-800 p-4 rounded-xl mb-6 text-xs">
              <div>
                <span className="text-slate-400 block mb-1 font-semibold">Meter:</span>
                <div className="flex gap-1">
                  {(['4/4', '3/4', '2/4', '6/8'] as const).map(m => (
                    <button
                      key={m}
                      onClick={() => setCounterMeter(m)}
                      className={`px-2.5 py-1 rounded font-bold ${counterMeter === m ? 'bg-amber-400 text-slate-950' : 'bg-slate-900 text-slate-300'}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-1 font-semibold">Subdivision Level:</span>
                <div className="flex gap-1">
                  {[
                    { id: 'quarter', label: '1 2 3 4' },
                    { id: 'eighth', label: '1 & 2 &' },
                    { id: 'sixteenth', label: '1 e & a' }
                  ].map(s => (
                    <button
                      key={s.id}
                      onClick={() => setCounterSubdivision(s.id as any)}
                      className={`px-2 py-1 rounded font-bold ${counterSubdivision === s.id ? 'bg-amber-400 text-slate-950' : 'bg-slate-900 text-slate-300'}`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-1 font-semibold">Tempo: {counterBpm} BPM</span>
                <input
                  type="range"
                  min="60"
                  max="144"
                  value={counterBpm}
                  onChange={e => setCounterBpm(parseInt(e.target.value))}
                  className="w-full accent-amber-400"
                />
              </div>
            </div>

            {/* Visual Beat Display */}
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center gap-3 overflow-x-auto">
              {Array.from({ length: counterMeter === '2/4' ? 2 : counterMeter === '3/4' ? 3 : counterMeter === '6/8' ? 6 : 4 }).map((_, beatIdx) => {
                const beatNumber = beatIdx + 1;
                const subsPerBeat = counterSubdivision === 'quarter' ? 1 : counterSubdivision === 'eighth' ? 2 : 4;
                const isBeatActive = Math.ceil(activeSubBeat / subsPerBeat) === beatNumber && isCountingActive;

                return (
                  <div
                    key={beatIdx}
                    className={`flex flex-col items-center justify-center w-20 h-24 rounded-2xl border transition-all ${
                      isBeatActive
                        ? 'border-amber-400 bg-amber-500/20 shadow-lg scale-110 text-amber-300'
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    <span className="font-serif text-3xl font-bold">{beatNumber}</span>
                    <span className="text-[10px] uppercase font-mono mt-1">
                      {counterSubdivision === 'sixteenth' ? '1 e & a' : counterSubdivision === 'eighth' ? '1 &' : 'Downbeat'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODULE 7: INTERVALS ACADEMY */}
      {activeModuleId === 'intervals' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8">
            <h2 className="font-serif text-2xl font-bold text-slate-100 mb-2">
              7. Musical Intervals Academy
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              An <strong>interval</strong> is the distance in pitch between two notes. Click any interval below to listen to its brass harmony and understand its emotional character in brass band music:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {intervalsList.map((intv) => (
                <button
                  key={intv.semitones}
                  onClick={() => handlePlayInterval(intv.semitones)}
                  className="p-4 rounded-xl border border-slate-800 bg-slate-950 text-left hover:border-amber-400 hover:bg-slate-900 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-serif text-base font-bold text-slate-100 group-hover:text-amber-300">
                        {intv.name}
                      </span>
                      <span className="font-mono text-xs text-amber-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {intv.semitones} st
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">
                      {intv.desc}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Frequency Ratio: {intv.ratio}</span>
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <Volume2 className="h-3 w-3" />
                      <span>Hear</span>
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODULE 8: TRIADS ACADEMY */}
      {activeModuleId === 'triads' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-amber-500/30 bg-slate-900/90 p-6 sm:p-8 shadow-xl">
            <div className="max-w-3xl mb-6">
              <span className="text-xs uppercase font-semibold text-amber-400 tracking-wider">
                Harmony & Chords Masterclass
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
                8. Triads Academy (Major, Minor, Diminished, Augmented)
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                A <strong>triad</strong> is a three-note chord built from stacked thirds: <strong>Root + 3rd + 5th</strong>. It is the harmonic bedrock of every hymn tune, march fanfare, and brass band arrangement. Select any root note and triad quality below to hear it in four-part brass resonance and see its exact interval anatomy.
              </p>
            </div>

            {/* Triad Builder Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950 border border-slate-800 p-5 rounded-2xl mb-6">
              <div>
                <span className="text-xs uppercase font-semibold text-slate-400 block mb-2">
                  1. Select Root Note:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {Object.keys(rootFrequencies).map(r => (
                    <button
                      key={r}
                      onClick={() => setTriadRoot(r)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        triadRoot === r
                          ? 'bg-amber-400 text-slate-950 font-bold shadow'
                          : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                      }`}
                    >
                      {rootFrequencies[r].name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs uppercase font-semibold text-slate-400 block mb-2">
                  2. Select Triad Quality:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {(['major', 'minor', 'diminished', 'augmented'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setTriadType(t)}
                      className={`p-2.5 rounded-lg text-xs font-bold capitalize transition-all text-left flex items-center justify-between ${
                        triadType === t
                          ? 'bg-amber-400 text-slate-950 font-bold shadow'
                          : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                      }`}
                    >
                      <span>{t}</span>
                      <span className="font-mono text-[10px] opacity-80">
                        {t === 'major' ? 'R-M3-P5' : t === 'minor' ? 'R-m3-P5' : t === 'diminished' ? 'R-m3-d5' : 'R-M3-A5'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Triad Analysis Card & Audio Actions */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
              <div>
                <span className="text-xs font-mono text-amber-400 font-bold">
                  Active Chord Formulation & Stacking
                </span>
                <h3 className="font-serif text-3xl font-bold text-slate-100 capitalize mt-1">
                  {triadRoot} {triadType} Triad
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-2 font-mono">
                  <span className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                    Root: <strong className="text-amber-300">{triadRoot}</strong> (0 st)
                  </span>
                  <span>+</span>
                  <span className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                    3rd: <strong className="text-amber-300">
                      {triadType === 'major' || triadType === 'augmented' ? 'Major 3rd (+4 st)' : 'Minor 3rd (+3 st)'}
                    </strong>
                  </span>
                  <span>+</span>
                  <span className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                    5th: <strong className="text-amber-300">
                      {triadType === 'diminished' ? 'Dim 5th (+6 st)' : triadType === 'augmented' ? 'Aug 5th (+8 st)' : 'Perf 5th (+7 st)'}
                    </strong>
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handlePlayTriad}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-all shadow"
                >
                  <Play className="h-4 w-4 fill-slate-950" />
                  <span>Play Full Chord</span>
                </button>
                <button
                  onClick={handlePlayArpeggiatedTriad}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-semibold text-xs hover:text-white transition-all"
                >
                  <Volume2 className="h-4 w-4" />
                  <span>Arpeggiate (R â†’ 3 â†’ 5)</span>
                </button>
              </div>
            </div>

            {/* In-Depth Triad Pedagogical Guide: The 4 Qualities */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-amber-300 text-sm">Major Triad</span>
                  <span className="font-mono text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-400">4 + 3 semitones</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Formula: <strong>Root + Major 3rd + Perfect 5th</strong>. Triumphant, open, stable, and cheerful. The harmonic anchor of all brass band marches and hymn verses.
                </p>
                <div className="text-[11px] font-mono text-amber-400/90 pt-1 border-t border-slate-900">
                  Example: C â€“ E â€“ G
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-amber-300 text-sm">Minor Triad</span>
                  <span className="font-mono text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-400">3 + 4 semitones</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Formula: <strong>Root + Minor 3rd + Perfect 5th</strong>. Sombre, contemplative, dark, and expressive. Essential for funeral marches and slow contemplative airs.
                </p>
                <div className="text-[11px] font-mono text-amber-400/90 pt-1 border-t border-slate-900">
                  Example: C â€“ Eâ™­ â€“ G
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-amber-300 text-sm">Diminished Triad</span>
                  <span className="font-mono text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-400">3 + 3 semitones</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Formula: <strong>Root + Minor 3rd + Diminished 5th (Tritone)</strong>. High tension, unstable, suspenseful. Naturally built on the leading tone (viiÂ°).
                </p>
                <div className="text-[11px] font-mono text-amber-400/90 pt-1 border-t border-slate-900">
                  Example: B â€“ D â€“ F (in C major)
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-amber-300 text-sm">Augmented Triad</span>
                  <span className="font-mono text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-400">4 + 4 semitones</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Formula: <strong>Root + Major 3rd + Augmented 5th</strong>. Mysterious, dreamy, floating, and unresolved. Symmetrical chord spanning two major thirds.
                </p>
                <div className="text-[11px] font-mono text-amber-400/90 pt-1 border-t border-slate-900">
                  Example: C â€“ E â€“ G#
                </div>
              </div>
            </div>

            {/* Brass Band Section Intonation Rules for Triads */}
            <div className="mt-6 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-300 space-y-2">
              <span className="font-serif font-bold text-amber-300 text-sm block">
                ðŸŽº Bandmaster's Just-Intonation Rule for Brass Triads
              </span>
              <p className="leading-relaxed">
                In a pure acoustic brass band triad (e.g. Basses on Root C, Euphoniums on 5th G, Horns/Flugel on 3rd E):
                The <strong>Major 3rd must be tuned 14 cents FLAT</strong> compared to equal temperament piano tuning to eliminate beats and ring warmly in the church or concert hall! When you play the 3rd of a major triad, lower your embouchure slightly to let the full section lock into ringing resonance.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 10: CADENCES */}
      {activeModuleId === 'cadences' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8">
            <h2 className="font-serif text-2xl font-bold text-slate-100 mb-2">
              10. Musical Cadences (The Punctuation of Brass Music)
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Just like commas, question marks, and full stops in sentences, <strong>cadences</strong> create musical punctuation at the ends of phrases. Click below to hear how brass chords resolve:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cadences.map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-serif font-bold text-base text-amber-300">{c.name}</span>
                      <span className="font-mono text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{c.chords}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {c.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => handlePlayCadence(c.id as any)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-all mt-2"
                  >
                    <Play className="h-3.5 w-3.5 fill-slate-950" />
                    <span>Listen to {c.chords} Progression</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODULE 11: ARTICULATION ACADEMY (ENHANCED WITH GRAPHIC FLASHCARDS & NOTATION ON STAFF) */}
      {activeModuleId === 'articulation' && (
        <div className="space-y-8">
          {/* Complete Graphic Notation Flashcards System */}
          <NotationFlashcards />

          {/* Quick Sound Matrix for Rehearsals */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8">
            <h3 className="font-serif text-xl font-bold text-slate-100 mb-2">
              Brass Band Rapid Articulation Rehearsal Matrix
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Compare articulations on the concert pitch F (349.23 Hz) in sequence to hear the acoustic contrast between tongue release speed, note length, and dynamic attack:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                { type: 'staccato', sym: 'â€¢', title: 'Staccato', desc: 'Short, light, 50% length with acoustic daylight.' },
                { type: 'tenuto', sym: 'â€”', title: 'Tenuto', desc: '100% full duration, sustained warm core tone.' },
                { type: 'accent', sym: '>', title: 'Accent', desc: 'Explosive initial burst, rapid settle to dynamic.' },
                { type: 'marcato', sym: '^', title: 'Marcato', desc: 'Sharply accented AND detached rooftop attack.' },
                { type: 'legato', sym: 'âŒ’', title: 'Legato / Slur', desc: 'Seamless pitch change with zero tongue stroke.' }
              ].map((art) => (
                <div
                  key={art.type}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-serif text-base font-bold text-slate-100">{art.title}</span>
                      <span className="font-serif text-xl font-bold text-amber-400 bg-slate-900 h-8 w-8 flex items-center justify-center rounded-lg border border-slate-800">
                        {art.sym}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {art.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => brassAudio.playArticulation(349.23, art.type as any)}
                    className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-amber-300 hover:bg-slate-800 transition-all mt-2"
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                    <span>Hear {art.title}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODULE 12: DYNAMICS ACADEMY */}
      {activeModuleId === 'dynamics' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-amber-500/30 bg-slate-900/90 p-6 sm:p-8 shadow-xl">
            <span className="text-xs uppercase font-semibold text-amber-400 tracking-wider">
              Acoustic Physics & Expressive Markings
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100 mt-1 mb-2">
              12. Dynamics & Acoustic Power in Brass Music
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              Dynamics do not simply alter volume; they govern the entire harmonic timbre, lip buzz resistance, and section pyramid balance of a British brass band. Explore each dynamic below with interactive audio synthesis and technical brass tips:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { sym: 'pp', name: 'Pianissimo', meaning: 'Very Soft', freq: 349.23, vol: 0.15, tip: 'Warm, relaxed, whisper air column. Do NOT clamp the lips or tone will sound thin and strident.' },
                { sym: 'p', name: 'Piano', meaning: 'Soft', freq: 349.23, vol: 0.28, tip: 'Gentle conversational air. Perfect for accompaniments under a solo cornet or euphonium.' },
                { sym: 'mp', name: 'Mezzo Piano', meaning: 'Moderately Soft', freq: 349.23, vol: 0.45, tip: 'Warm, centered core resonance. The baseline for inner-band harmonized chorales.' },
                { sym: 'mf', name: 'Mezzo Forte', meaning: 'Moderately Loud', freq: 349.23, vol: 0.65, tip: 'Natural speaking voice of the instrument with effortless diaphragmatic support.' },
                { sym: 'f', name: 'Forte', meaning: 'Loud', freq: 349.23, vol: 0.85, tip: 'Fast pressurized air. Resonant bell flare without forcing into a distorted buzz.' },
                { sym: 'ff', name: 'Fortissimo', meaning: 'Very Loud', freq: 349.23, vol: 1.05, tip: 'Maximum acoustic power. Lower brass pyramid carries the foundation with soaring cornets.' },
                { sym: 'sfz', name: 'Sforzando', meaning: 'Sudden Force', freq: 349.23, vol: 1.15, tip: 'Explosive hammer attack on front of note, instantly dropping to underlying dynamic.' },
                { sym: '<', name: 'Crescendo', meaning: 'Gradually Louder', freq: 349.23, vol: 0.75, tip: 'Smoothly accelerate air speed over time; open teeth slightly to avoid going sharp.' },
                { sym: '>', name: 'Diminuendo', meaning: 'Gradually Softer', freq: 349.23, vol: 0.5, tip: 'Taper air volume while maintaining firm embouchure corners so pitch does not drop flat.' }
              ].map((dyn) => (
                <div
                  key={dyn.sym}
                  className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-serif text-3xl font-black text-amber-400 italic">{dyn.sym}</span>
                      <span className="text-xs font-mono bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold">
                        {dyn.name}
                      </span>
                    </div>
                    <div className="text-xs text-amber-300 font-semibold mb-1">"{dyn.meaning}"</div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {dyn.tip}
                    </p>
                  </div>

                  <button
                    onClick={() => brassAudio.playBrassTone(dyn.freq, 0.7, 'cornet')}
                    className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-amber-300 hover:bg-slate-800 transition-all mt-2"
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                    <span>Hear {dyn.sym} Dynamic Sample</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODULE 16: TRANSPOSITION & CLEFS MASTERCLASS */}
      {activeModuleId === 'transposition' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-amber-500/30 bg-slate-900/90 p-6 sm:p-8 shadow-xl">
            <span className="text-xs uppercase font-semibold text-amber-400 tracking-wider">
              Clefs, Pitch Centers & Transposition
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100 mt-1 mb-2">
              16. Clefs, Transposition & How They Shape Articulations
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              Learn why the British brass band system is the most unified educational method in world music: almost every player reads Treble Clef transposed, so fingering patterns and tongue articulation feelings are identical across instruments!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-serif text-4xl text-amber-400">ð„ž</span>
                  <h3 className="font-serif text-xl font-bold text-slate-100">Treble Clef (G Clef)</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Wraps around the 2nd line, fixing it as G4. In brass bands, Bb Cornets, Eb Soprano, Eb Tenor Horns, Bb Baritones, Euphoniums, Tenor Trombones, EEb Basses, and giant BBb Basses all read Treble Clef!
                </p>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1 font-mono">
                  <div><strong>Lines:</strong> E4 â€“ G4 â€“ B4 â€“ D5 â€“ F5</div>
                  <div><strong>Spaces:</strong> F4 â€“ A4 â€“ C5 â€“ E5 ("FACE")</div>
                </div>
                <button
                  onClick={() => brassAudio.playBrassTone(392.00, 0.8, 'cornet')}
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300"
                >
                  <Volume2 className="h-3.5 w-3.5 fill-slate-950" />
                  <span>Hear G4 Reference Pitch (392 Hz)</span>
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-serif text-4xl text-amber-400">ð„¢</span>
                  <h3 className="font-serif text-xl font-bold text-slate-100">Bass Clef (F Clef)</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Centers between the two dots on line 4, fixing it as F3. In brass bands, this is read exclusively by the <strong>Bass Trombone</strong> at concert pitch (non-transposing).
                </p>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1 font-mono">
                  <div><strong>Lines:</strong> G2 â€“ B2 â€“ D3 â€“ F3 â€“ A3</div>
                  <div><strong>Spaces:</strong> A2 â€“ C3 â€“ E3 â€“ G3</div>
                </div>
                <button
                  onClick={() => brassAudio.playBrassTone(174.61, 0.8, 'trombone')}
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 font-bold text-xs hover:bg-slate-800"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>Hear F3 Reference Pitch (174.6 Hz)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 14: SEARCHABLE GLOSSARY */}
      {activeModuleId === 'glossary' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-slate-100">
                  14. Searchable Musical Terms & Italian Glossary
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Over 20 standard musical markings, Italian directives, and brass band rehearsal terminology.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search terms (e.g. Allegro)..."
                  value={glossarySearch}
                  onChange={e => setGlossarySearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredGlossary.map((g, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-800 bg-slate-950">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif font-bold text-sm text-amber-300">{g.term}</span>
                    <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">{g.cat}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{g.meaning}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* GENERAL THEORY QUIZ SECTION (Part 49) */}
      <div className="mt-12 rounded-3xl border border-amber-500/30 bg-slate-900/90 p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div>
            <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
              Knowledge Check
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-100 mt-1">
              Music Theory Interactive Quiz
            </h3>
          </div>
          <span className="text-xs font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
            Question {quizQuestionIndex + 1} of {theoryQuestions.length}
          </span>
        </div>

        <div className="space-y-4">
          <h4 className="font-serif text-base sm:text-lg font-bold text-slate-100">
            {currentQ.q}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((opt, oIdx) => {
              const isSelected = quizSelectedOption === oIdx;
              const isCorrect = oIdx === currentQ.correct;

              return (
                <button
                  key={oIdx}
                  onClick={() => {
                    setQuizSelectedOption(oIdx);
                    setShowQuizExplanation(true);
                    brassAudio.playFeedback(isCorrect);
                  }}
                  className={`p-4 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all ${
                    isSelected
                      ? isCorrect
                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-200'
                        : 'border-rose-500 bg-rose-500/20 text-rose-200'
                      : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-amber-400">{String.fromCharCode(65 + oIdx)}.</span>
                    <span>{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {showQuizExplanation && (
            <div className={`p-4 rounded-xl border mt-4 ${
              quizSelectedOption === currentQ.correct
                ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-200'
                : 'border-rose-500/50 bg-rose-950/40 text-rose-200'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm mb-1">
                {quizSelectedOption === currentQ.correct ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <span>Brilliant! That is correct.</span>
                  </>
                ) : (
                  <>
                    <HelpCircle className="h-5 w-5 text-rose-400" />
                    <span>Explanation:</span>
                  </>
                )}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentQ.exp}
              </p>

              <button
                onClick={() => {
                  setQuizSelectedOption(null);
                  setShowQuizExplanation(false);
                  setQuizQuestionIndex((quizQuestionIndex + 1) % theoryQuestions.length);
                }}
                className="mt-3 px-4 py-2 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300"
              >
                Next Question â†’
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

