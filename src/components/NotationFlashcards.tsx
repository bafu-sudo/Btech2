import React, { useState } from 'react';
import {
  Volume2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Info,
  CheckCircle2,
  Activity,
  Layers,
  Award
} from 'lucide-react';
import { brassAudio } from '../audio/brassAudio';

export interface ArticulationCardData {
  id: string;
  name: string;
  italianName: string;
  symbol: string;
  category: 'Standard' | 'Accent' | 'Phrasing' | 'Brass-Special';
  symbolPlacement: 'above-or-below-notehead' | 'across-notes' | 'above-staff';
  staffNotePosition: number; // 0 to 8 on staff (4 = Middle B line)
  stemDirection: 'up' | 'down';
  audioFreq: number;
  durationType: 'quarter' | 'eighth' | 'half' | 'dotted';
  brassDefinition: string;
  tongueTechnique: string;
  airflowInstruction: string;
  commonMistake: string;
  bandmasterInstruction: string;
  brassExamplePiece: string;
}

export interface DynamicCardData {
  id: string;
  symbol: string;
  italianName: string;
  englishMeaning: string;
  decibelRange: string;
  brassAirSpeed: string;
  embouchureAdjustment: string;
  sectionBalancingAdvice: string;
  bandmasterCue: string;
  audioGainMultiplier: number;
}

export interface ClefCardData {
  id: string;
  name: string;
  symbolGlyph: string;
  referenceLineName: string;
  referenceLineNumber: number; // 1 to 5 from bottom
  pitchAtReference: string;
  frequencyHz: number;
  brassBandUsage: string;
  mnemonicLines: string;
  mnemonicSpaces: string;
  howToArticulateInThisClef: string;
}

export const ARTICULATION_FLASHCARDS: ArticulationCardData[] = [
  {
    id: 'staccato',
    name: 'Staccato',
    italianName: 'Staccato (Detached)',
    symbol: '•',
    category: 'Standard',
    symbolPlacement: 'above-or-below-notehead',
    staffNotePosition: 4, // B4 line
    stemDirection: 'down',
    audioFreq: 349.23, // F4
    durationType: 'quarter',
    brassDefinition: 'Short, clean and separated. Leaves audible daylight (silence) between notes. Does not mean loud or forced!',
    tongueTechnique: 'Use a crisp "Tee" or "Too" tip-of-the-tongue stroke at the gumline behind the upper teeth. Let the air release instantly without stopping the sound with your tongue ("Tut" is strictly forbidden).',
    airflowInstruction: 'A quick, energetic puff of pressurized air supported from the diaphragm. Release the air; do NOT strangle the throat or pinch the embouchure.',
    commonMistake: 'Stopping the note by putting the tongue back against the mouthpiece or teeth ("Toot-Tut"), which produces a choked, ugly thump instead of a ringing brass tone.',
    bandmasterInstruction: '"Band, give each quarter note half its value of pure tone, followed by half a beat of silence for acoustic ring!"',
    brassExamplePiece: 'The whistling cornet triplets in standard street marches like "Slaidburn" or "Punchinello".'
  },
  {
    id: 'tenuto',
    name: 'Tenuto',
    italianName: 'Tenuto (Held / Sustained)',
    symbol: '—',
    category: 'Standard',
    symbolPlacement: 'above-or-below-notehead',
    staffNotePosition: 5, // C5 space
    stemDirection: 'down',
    audioFreq: 392.00, // G4
    durationType: 'quarter',
    brassDefinition: 'Hold the note for its full intended duration with broad, warm, unyielding tone. Lean gently into the note without explosive attack.',
    tongueTechnique: 'Gentle, broad "Doo" or "Dah" syllable. The tongue acts as an effortless water gate opening rather than a sword stroke.',
    airflowInstruction: 'Full, sustained column of warm air like breathing fog onto cold glass. Zero drop in air speed until the very microsecond of the next beat.',
    commonMistake: 'Decaying or losing pitch center before the barline arrives. Brass players frequently let tenuto notes die off prematurely.',
    bandmasterInstruction: '"Stretch this note completely across the barline—let the euphonium and flugelhorn warm the room with unbroken tone!"',
    brassExamplePiece: 'The cantabile chorale melodies in "Aurelia" and "Crimond" hymn tunes.'
  },
  {
    id: 'accent',
    name: 'Accent (Dynamic Accent)',
    italianName: 'Accento',
    symbol: '>',
    category: 'Accent',
    symbolPlacement: 'above-or-below-notehead',
    staffNotePosition: 3, // A4 space
    stemDirection: 'up',
    audioFreq: 440.00, // A4
    durationType: 'quarter',
    brassDefinition: 'Sudden, forceful emphasis on the front attack of the note, followed by immediate settle into the prevailing section dynamic.',
    tongueTechnique: 'Firm "TAH!" syllable with immediate explosive air burst backed by firm abdominal engagement.',
    airflowInstruction: 'High initial air speed (peak blast) settling smoothly into normal airflow. Think of striking a bell: loud chime at first, then resonating ring.',
    commonMistake: 'Overblowing so hard that the lips spread apart, cracking the partial or going sharp in pitch.',
    bandmasterInstruction: '"Give me a front-loaded punch on beat 1, then pull back immediately so the solo cornet melody cuts through!"',
    brassExamplePiece: 'Tutti brass fanfares and cadence chords in Kenneth Alford marches like "Colonel Bogey".'
  },
  {
    id: 'marcato',
    name: 'Marcato ("Rooftop Accent")',
    italianName: 'Marcato (Marked / Emphatic)',
    symbol: '^',
    category: 'Accent',
    symbolPlacement: 'above-or-below-notehead',
    staffNotePosition: 6, // D5 line
    stemDirection: 'down',
    audioFreq: 466.16, // Bb4
    durationType: 'quarter',
    brassDefinition: 'Sharply accented AND detached. Combine the force of an accent (>) with the separation of a staccato (•). Often nicknamed the "arrowhead" or "rooftop".',
    tongueTechnique: 'Punchy "TOH!" syllable with decisive abdominal snap. Shorter and much more vertical than a standard accent.',
    airflowInstruction: 'Heavy, high-velocity jet of air with a clean cut-off created by halting airflow from the core, not by clamping the throat.',
    commonMistake: 'Turning it into a harsh splat or forgetting the detachment, dragging it into a muddy heavy tenuto.',
    bandmasterInstruction: '"Rooftops must ring! Cut them off crisply with space between them—think heavy marching boots hitting cobblestone!"',
    brassExamplePiece: 'The thunderous bass section unison runs in "The Cossack" or "Knight Templar".'
  },
  {
    id: 'legato',
    name: 'Legato / Slur',
    italianName: 'Legato (Bound Together)',
    symbol: '⌒',
    category: 'Phrasing',
    symbolPlacement: 'across-notes',
    staffNotePosition: 4, // B4
    stemDirection: 'down',
    audioFreq: 329.63, // E4
    durationType: 'quarter',
    brassDefinition: 'Smooth, seamless connection between pitches without re-articulating with the tongue. The air column remains 100% continuous.',
    tongueTechnique: 'Tongue ONLY the first note of the slur ("Too"). On subsequent pitches inside the arc, DO NOT tongue! Move valves cleanly or slide briskly while maintaining lip buzz.',
    airflowInstruction: 'Unbroken, pressurized river of air. When moving to a higher pitch under a slur, compress air faster from the abdominal wall and raise the tongue arch ("Ah" -> "Ee").',
    commonMistake: 'Sneaking in "ghost tongues" or allowing the sound to drop out between valve strokes (known as "stepping" or "bumping").',
    bandmasterInstruction: '"Imagine playing through a long garden hose without ever shutting off the tap. One breath, one continuous song!"',
    brassExamplePiece: 'The lyrical euphonium cadenza in "The Holy City" or flugelhorn melody in "Flowerdale".'
  },
  {
    id: 'staccatissimo',
    name: 'Staccatissimo (Wedge)',
    italianName: 'Staccatissimo (Extremely Short)',
    symbol: '▾',
    category: 'Standard',
    symbolPlacement: 'above-or-below-notehead',
    staffNotePosition: 4,
    stemDirection: 'down',
    audioFreq: 523.25, // C5
    durationType: 'eighth',
    brassDefinition: 'Extremely short, needle-sharp separation. Played as brief as acoustically possible, leaving maximum air gap.',
    tongueTechnique: 'Ultra-light, razor-sharp "Tip" or "Tic" stroke. Fast release like tapping a red-hot iron.',
    airflowInstruction: 'Miniature sonic spark. Minimum volume of air, maximum speed through the aperture.',
    commonMistake: 'Cracking or chipping the note due to over-eagerness.',
    bandmasterInstruction: '"Like drops of rain hitting a brass bell—pinpoint precision, no fat on the note!"',
    brassExamplePiece: 'Fast bravura cornet test pieces such as "Journey into Freedom" or "Blitz".'
  },
  {
    id: 'fermata',
    name: 'Fermata (Pause / Hold)',
    italianName: 'Fermata (Bird\'s Eye)',
    symbol: '𝄐',
    category: 'Phrasing',
    symbolPlacement: 'above-staff',
    staffNotePosition: 7, // High E5
    stemDirection: 'down',
    audioFreq: 261.63, // C4
    durationType: 'half',
    brassDefinition: 'Hold the note or rest beyond its strict metric value until the conductor provides a clear preparatory breath or cut-off.',
    tongueTechnique: 'Attack cleanly according to the marked dynamic, then maintain rock-solid intonation and vibrato as indicated.',
    airflowInstruction: 'Deep, steady diaphragmatic air reserve. Keep tone round and full until the exact instant the baton closes.',
    commonMistake: 'Looking down at the music sheet and cutting off on your own! Always keep your eyes glued to the bandmaster.',
    bandmasterInstruction: '"Eyes in the boat! Watch my left hand for the swell, and do not drop pitch before my cut-off circle!"',
    brassExamplePiece: 'The monumental final cadence chord in hymn tunes like "Deep Harmony" and "Rimington".'
  },
  {
    id: 'breath-mark',
    name: 'Breath Mark',
    italianName: 'Comma Musicale (Breath Mark)',
    symbol: '’',
    category: 'Phrasing',
    symbolPlacement: 'above-staff',
    staffNotePosition: 8, // Above staff
    stemDirection: 'up',
    audioFreq: 293.66, // D4
    durationType: 'quarter',
    brassDefinition: 'Designates the exact musical comma where the brass player steals a quick, silent inhalation without disrupting melodic pulse.',
    tongueTechnique: 'No tongue directly on the comma; the preceding note terminates cleanly to allow 0.2 seconds for diaphragmatic inhalation.',
    airflowInstruction: 'Silent, deep "Oh" breath through the corners of the mouth without breaking the mouthpiece seal against the lips.',
    commonMistake: 'Gasping audibly through the nose, or stealing time from the NEXT downbeat instead of trimming the preceding note.',
    bandmasterInstruction: '"Steal time from the tail of the note before, NEVER from the arrival beat! Enter precisely on time!"',
    brassExamplePiece: 'Hymn tune verse phrasing across standard 4-bar Salvation Army and British hymn verses.'
  }
];

export const DYNAMICS_FLASHCARDS: DynamicCardData[] = [
  {
    id: 'pianissimo',
    symbol: 'pp',
    italianName: 'Pianissimo',
    englishMeaning: 'Very Soft',
    decibelRange: '40 – 50 dB',
    brassAirSpeed: 'Warm, slow, but focused air column. Lips must remain supple with a microscopic aperture.',
    embouchureAdjustment: 'Corners firm, center relaxed. Never clamp or pinch the lips, or tone will die.',
    sectionBalancingAdvice: 'In British brass bands, a true pp should sound like a distant pipe organ whispering.',
    bandmasterCue: 'Hovering baton, palm pressed down toward floor, soft facial posture.',
    audioGainMultiplier: 0.18
  },
  {
    id: 'piano',
    symbol: 'p',
    italianName: 'Piano',
    englishMeaning: 'Soft',
    decibelRange: '50 – 60 dB',
    brassAirSpeed: 'Gentle, steady breeze. Full tone supported from the core.',
    embouchureAdjustment: 'Natural cushion, relaxed throat. Ample air reserve.',
    sectionBalancingAdvice: 'Accompaniment parts (2nd/3rd cornets, horns, baritones) play here under a soloist.',
    bandmasterCue: 'Compact gestures within a small chest-height box.',
    audioGainMultiplier: 0.32
  },
  {
    id: 'mezzo-piano',
    symbol: 'mp',
    italianName: 'Mezzo Piano',
    englishMeaning: 'Moderately Soft',
    decibelRange: '60 – 70 dB',
    brassAirSpeed: 'Warm conversational airflow. Rich acoustic resonance.',
    embouchureAdjustment: 'Balanced tension between corners and lip center.',
    sectionBalancingAdvice: 'Standard brass band inner-part background texture.',
    bandmasterCue: 'Medium small beat pattern, smooth rebound.',
    audioGainMultiplier: 0.48
  },
  {
    id: 'mezzo-forte',
    symbol: 'mf',
    italianName: 'Mezzo Forte',
    englishMeaning: 'Moderately Loud',
    decibelRange: '70 – 80 dB',
    brassAirSpeed: 'Confident, healthy air stream. The natural speaking voice of brass instruments.',
    embouchureAdjustment: 'Firm corners, open oral cavity ("Awh" vowel shape).',
    sectionBalancingAdvice: 'The baseline default dynamic of marches and lyrical ensemble sections.',
    bandmasterCue: 'Clear, balanced ictus with moderate rebound stroke.',
    audioGainMultiplier: 0.68
  },
  {
    id: 'forte',
    symbol: 'f',
    italianName: 'Forte',
    englishMeaning: 'Loud',
    decibelRange: '80 – 90 dB',
    brassAirSpeed: 'Fast, high-volume pressurized air stream with ringing brass harmonics.',
    embouchureAdjustment: 'Maximum abdominal support; embouchure corners locked firmly in place.',
    sectionBalancingAdvice: 'Full band resonance without edge or distortion. Melodic line prominent.',
    bandmasterCue: 'Expansive pattern, open arm sweep, confident posture.',
    audioGainMultiplier: 0.88
  },
  {
    id: 'fortissimo',
    symbol: 'ff',
    italianName: 'Fortissimo',
    englishMeaning: 'Very Loud',
    decibelRange: '90 – 105 dB',
    brassAirSpeed: 'Turbine-like, massive air velocity. Bell flare rings with full overtone spectrum.',
    embouchureAdjustment: 'Tightly anchored corners, wide teeth opening behind lips to avoid pinching.',
    sectionBalancingAdvice: 'Used for climactic march trios and hymn climaxes. Never force into harsh brass rasps.',
    bandmasterCue: 'Broad sweeping baton movements, upright commanding stance.',
    audioGainMultiplier: 1.05
  },
  {
    id: 'sforzando',
    symbol: 'sfz',
    italianName: 'Sforzando',
    englishMeaning: 'Sudden Heavy Force',
    decibelRange: 'Instant 95 dB burst -> drops to mf',
    brassAirSpeed: 'Explosive hammer-strike air attack that instantly recedes into background level.',
    embouchureAdjustment: 'Resilient embouchure that can withstand a sudden shockwave without cracking pitch.',
    sectionBalancingAdvice: 'Creates dramatic theatrical shocks in symphonic brass literature.',
    bandmasterCue: 'Sharp, whipping flick of the wrist followed by immediate dampening freeze.',
    audioGainMultiplier: 1.15
  },
  {
    id: 'crescendo',
    symbol: '<',
    italianName: 'Crescendo',
    englishMeaning: 'Gradually Becoming Louder',
    decibelRange: 'Smooth ramp from p to ff',
    brassAirSpeed: 'Air speed accelerating smoothly over time like an aircraft taking off.',
    embouchureAdjustment: 'Open teeth slightly as volume increases to keep pitch from going sharp.',
    sectionBalancingAdvice: 'Listen across the band: the bass section must lead the dynamic swell from the bottom up.',
    bandmasterCue: 'Left palm rising slowly with expanding baton arc.',
    audioGainMultiplier: 0.75
  },
  {
    id: 'diminuendo',
    symbol: '>',
    italianName: 'Diminuendo / Decrescendo',
    englishMeaning: 'Gradually Becoming Softer',
    decibelRange: 'Smooth taper from ff to pp',
    brassAirSpeed: 'Tapering air velocity while maintaining core support so pitch does not drop flat.',
    embouchureAdjustment: 'Firm up the corners slightly to preserve pitch center as air volume diminishes.',
    sectionBalancingAdvice: 'The hardest skill in brass playing: quietening down without falling flat or dropping notes.',
    bandmasterCue: 'Left palm pushing down toward floor, pattern shrinking inward.',
    audioGainMultiplier: 0.5
  }
];

export const CLEF_FLASHCARDS: ClefCardData[] = [
  {
    id: 'treble',
    name: 'Treble Clef (G Clef)',
    symbolGlyph: '𝄞',
    referenceLineName: '2nd Line from Bottom is G4 (392 Hz)',
    referenceLineNumber: 2,
    pitchAtReference: 'G4',
    frequencyHz: 392.00,
    brassBandUsage: 'Used by ALMOST ALL British brass instruments: Bb Cornet, Eb Soprano, Eb Tenor Horn, Bb Baritone, Bb Euphonium, Bb Tenor Trombone, EEb Bass, and BBb Bass! Only Bass Trombone reads Bass Clef.',
    mnemonicLines: 'E – G – B – D – F ("Every Good Boy Deserves Football")',
    mnemonicSpaces: 'F – A – C – E (Spells "FACE")',
    howToArticulateInThisClef: 'Because British brass players learn Treble Clef regardless of instrument size, an Eb Tenor Horn player and a 20-pound BBb Bass player see identical fingerings and articulation markings! A staccato dot on 3rd-space C feels identical under the tongue whether on Cornet or giant BBb Bass.'
  },
  {
    id: 'bass',
    name: 'Bass Clef (F Clef)',
    symbolGlyph: '𝄢',
    referenceLineName: '4th Line from Bottom is F3 (174.6 Hz)',
    referenceLineNumber: 4,
    pitchAtReference: 'F3',
    frequencyHz: 174.61,
    brassBandUsage: 'In the British brass band contest and hymn book tradition, Bass Clef is strictly reserved for the BASS TROMBONE (concert pitch reader). Also used in orchestral brass scores for Tuba and Tenor Trombones.',
    mnemonicLines: 'G – B – D – F – A ("Good Boys Do Fine Always")',
    mnemonicSpaces: 'A – C – E – G ("All Cows Eat Grass")',
    howToArticulateInThisClef: 'Bass Clef low register requires a much wider, looser lip buzz and a broader tongue stroke ("DOH" or "THOH"). Articulations must be slightly longer because large low-frequency sound waves take longer to develop acoustic ring in the hall.'
  },
  {
    id: 'alto-tenor',
    name: 'C-Clefs (Alto & Tenor Clef)',
    symbolGlyph: '𝄡',
    referenceLineName: 'Center indent points to Middle C (C4 = 261.6 Hz)',
    referenceLineNumber: 3,
    pitchAtReference: 'C4',
    frequencyHz: 261.63,
    brassBandUsage: 'Used in orchestral trombone solos, German brass chorales, and classical arrangements. Alto clef centers C on line 3; Tenor clef centers C on line 4.',
    mnemonicLines: 'Alto Lines: F – A – C – E – G | Tenor Lines: D – F – A – C – E',
    mnemonicSpaces: 'Alto Spaces: G – B – D – F | Tenor Spaces: E – G – B – D',
    howToArticulateInThisClef: 'Advanced brass bandmasters studying original orchestral scores or Bach chorales transpose C-clef music seamlessly. Tonguing articulation requires laser focus on pitch center across the tenor register.'
  }
];

export const NotationFlashcards: React.FC = () => {
  const [activeDeck, setActiveDeck] = useState<'articulations' | 'dynamics' | 'clefs'>('articulations');
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Filtered lists
  const currentArticulations = categoryFilter === 'All'
    ? ARTICULATION_FLASHCARDS
    : ARTICULATION_FLASHCARDS.filter(c => c.category === categoryFilter);

  const totalCards = activeDeck === 'articulations'
    ? currentArticulations.length
    : activeDeck === 'dynamics'
    ? DYNAMICS_FLASHCARDS.length
    : CLEF_FLASHCARDS.length;

  const currentArtCard = currentArticulations[Math.min(cardIndex, currentArticulations.length - 1)] || ARTICULATION_FLASHCARDS[0];
  const currentDynCard = DYNAMICS_FLASHCARDS[Math.min(cardIndex, DYNAMICS_FLASHCARDS.length - 1)] || DYNAMICS_FLASHCARDS[0];
  const currentClefCard = CLEF_FLASHCARDS[Math.min(cardIndex, CLEF_FLASHCARDS.length - 1)] || CLEF_FLASHCARDS[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCardIndex((prev) => (prev + 1) % totalCards);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCardIndex((prev) => (prev - 1 + totalCards) % totalCards);
  };

  const handlePlayCardSound = () => {
    setIsPlayingAudio(true);
    if (activeDeck === 'articulations') {
      const type = currentArtCard.id === 'staccatissimo'
        ? 'staccato'
        : (currentArtCard.id as any);
      brassAudio.playArticulation(currentArtCard.audioFreq, type);
    } else if (activeDeck === 'dynamics') {
      brassAudio.playBrassTone(349.23, 0.7, 'cornet');
    } else {
      brassAudio.playBrassTone(currentClefCard.frequencyHz, 0.8, 'horn');
    }
    setTimeout(() => setIsPlayingAudio(false), 800);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
              <Sparkles className="h-4 w-4" />
              <span>Interactive Graphic Flashcards & Staff Masterclass</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
              Articulations, Staff Notation, Clefs & Dynamics to the Absolute Core
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Examine high-definition 5-line musical staff graphics showing exactly where articulation symbols sit on notes, master how the tongue acts as a valve, explore every brass dynamic from <em>pp</em> to <em>sfz</em>, and learn why Clefs govern brass band transpositions.
            </p>
          </div>

          {/* Deck Switcher Buttons */}
          <div className="flex flex-wrap lg:flex-col gap-2 shrink-0">
            <button
              onClick={() => { setActiveDeck('articulations'); setCardIndex(0); setIsFlipped(false); }}
              className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeDeck === 'articulations'
                  ? 'bg-amber-400 text-slate-950 shadow-lg font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <span>🎼 1. Articulations on Staff</span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/20">{ARTICULATION_FLASHCARDS.length} Cards</span>
            </button>

            <button
              onClick={() => { setActiveDeck('dynamics'); setCardIndex(0); setIsFlipped(false); }}
              className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeDeck === 'dynamics'
                  ? 'bg-amber-400 text-slate-950 shadow-lg font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <span>🔊 2. Brass Dynamics (pp to sfz)</span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/20">{DYNAMICS_FLASHCARDS.length} Cards</span>
            </button>

            <button
              onClick={() => { setActiveDeck('clefs'); setCardIndex(0); setIsFlipped(false); }}
              className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeDeck === 'clefs'
                  ? 'bg-amber-400 text-slate-950 shadow-lg font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <span>𝄞 3. Clefs & Articulation Link</span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/20">{CLEF_FLASHCARDS.length} Cards</span>
            </button>
          </div>
        </div>

        {/* Category Filter for Articulations */}
        {activeDeck === 'articulations' && (
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-2">
              Filter Category:
            </span>
            {['All', 'Standard', 'Accent', 'Phrasing'].map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategoryFilter(cat); setCardIndex(0); setIsFlipped(false); }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  categoryFilter === cat
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Flashcard Display Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT / TOP: THE INTERACTIVE FLASHCARD (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">

          {/* Flashcard Wrapper with 3D Flip */}
          <div className="relative rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl p-6 sm:p-8 overflow-hidden min-h-[460px] flex flex-col justify-between">
            
            {/* Top Bar of the Card */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                  Card {cardIndex + 1} of {totalCards}
                </span>
                <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
                  {activeDeck === 'articulations' && currentArtCard.category}
                  {activeDeck === 'dynamics' && 'Acoustic Brass Dynamics'}
                  {activeDeck === 'clefs' && 'Pitch Reference & Transposition'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePlayCardSound}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-all shadow"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>{isPlayingAudio ? 'Playing...' : 'Hear Audio'}</span>
                </button>
                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-300 font-semibold text-xs hover:text-white hover:border-slate-600 transition-all"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{isFlipped ? 'Show Front' : 'Flip for Playing Secrets'}</span>
                </button>
              </div>
            </div>

            {/* CARD FRONT CONTENT */}
            {!isFlipped && (
              <div className="space-y-6 animate-fadeIn flex-1 flex flex-col justify-between">
                {activeDeck === 'articulations' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      {/* Left: Graphic Staff SVG representation */}
                      <div className="md:col-span-6 bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col items-center justify-center relative shadow-inner">
                        <span className="absolute top-2 left-3 text-[10px] font-mono uppercase tracking-wider text-slate-500">
                          Notation on 5-Line Staff
                        </span>

                        {/* Interactive Staff SVG with Note and Articulation */}
                        <svg viewBox="0 0 260 160" className="w-full max-w-[240px] h-36 my-2">
                          {/* 5 Staff Lines */}
                          {[40, 60, 80, 100, 120].map((y, idx) => (
                            <line
                              key={idx}
                              x1="20"
                              y1={y}
                              x2="240"
                              y2={y}
                              stroke="#64748b"
                              strokeWidth="2"
                            />
                          ))}

                          {/* Treble Clef Graphic at start */}
                          <text
                            x="28"
                            y="110"
                            fill="#f59e0b"
                            fontSize="56"
                            fontFamily="serif"
                            className="select-none font-bold"
                          >
                            𝄞
                          </text>

                          {/* Notehead (Quarter note on middle B line y=80 or custom) */}
                          <ellipse
                            cx="145"
                            cy="80"
                            rx="13"
                            ry="9"
                            fill="#f8fafc"
                            transform="rotate(-20 145 80)"
                          />

                          {/* Note Stem (Pointing Down from left of notehead) */}
                          <line
                            x1="133"
                            y1="82"
                            x2="133"
                            y2="132"
                            stroke="#f8fafc"
                            strokeWidth="3.2"
                          />

                          {/* ARTICULATION SYMBOL SVG GRAPHIC ON STAFF */}
                          {currentArtCard.id === 'staccato' && (
                            /* Dot placed clearly above notehead opposite stem */
                            <circle cx="145" cy="54" r="5" fill="#f59e0b" />
                          )}

                          {currentArtCard.id === 'tenuto' && (
                            /* Horizontal bar placed above notehead */
                            <line x1="131" y1="54" x2="159" y2="54" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                          )}

                          {currentArtCard.id === 'accent' && (
                            /* Wedge accent > above notehead */
                            <path
                              d="M 132 50 L 158 56 L 132 62"
                              fill="none"
                              stroke="#f59e0b"
                              strokeWidth="4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          )}

                          {currentArtCard.id === 'marcato' && (
                            /* Rooftop accent ^ above notehead */
                            <path
                              d="M 134 60 L 145 44 L 156 60"
                              fill="none"
                              stroke="#f59e0b"
                              strokeWidth="4.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          )}

                          {currentArtCard.id === 'legato' && (
                            /* Slur arc bridging notes */
                            <path
                              d="M 115 54 Q 145 32 175 54"
                              fill="none"
                              stroke="#f59e0b"
                              strokeWidth="3.5"
                              strokeLinecap="round"
                            />
                          )}

                          {currentArtCard.id === 'staccatissimo' && (
                            /* Triangular vertical wedge */
                            <polygon points="142,46 148,46 145,62" fill="#f59e0b" />
                          )}

                          {currentArtCard.id === 'fermata' && (
                            /* Fermata bird eye arc and dot */
                            <g>
                              <path d="M 130 52 Q 145 34 160 52" fill="none" stroke="#f59e0b" strokeWidth="3.5" />
                              <circle cx="145" cy="48" r="3" fill="#f59e0b" />
                            </g>
                          )}

                          {currentArtCard.id === 'breath-mark' && (
                            /* Breath mark comma above staff */
                            <text x="180" y="32" fill="#f59e0b" fontSize="32" fontWeight="bold">’</text>
                          )}
                        </svg>

                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] font-mono text-amber-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                            Placement: {currentArtCard.symbolPlacement}
                          </span>
                        </div>
                      </div>

                      {/* Right: Definition & Explanation */}
                      <div className="md:col-span-6 space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="font-serif text-3xl font-extrabold text-amber-400">
                            {currentArtCard.name}
                          </span>
                          <span className="font-serif text-3xl font-black text-slate-100 bg-slate-950 h-12 w-12 rounded-xl flex items-center justify-center border border-slate-800 shadow">
                            {currentArtCard.symbol}
                          </span>
                        </div>

                        <p className="font-serif italic text-xs text-amber-300">
                          {currentArtCard.italianName}
                        </p>

                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                          {currentArtCard.brassDefinition}
                        </p>

                        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1 text-xs">
                          <div className="text-slate-400 font-semibold flex items-center gap-1.5 text-[11px]">
                            <BookOpen className="h-3 w-3 text-amber-400" />
                            <span>Brass Literature Example:</span>
                          </div>
                          <div className="text-slate-300 italic">{currentArtCard.brassExamplePiece}</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {activeDeck === 'dynamics' && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-inner">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-2">
                        Dynamic Marking
                      </span>
                      <span className="font-serif text-6xl font-black text-amber-400 tracking-wider my-2 italic">
                        {currentDynCard.symbol}
                      </span>
                      <span className="font-serif text-xl font-bold text-slate-100 mt-1">
                        {currentDynCard.italianName}
                      </span>
                      <span className="text-xs text-slate-400 mt-0.5 font-medium">
                        "{currentDynCard.englishMeaning}"
                      </span>
                      <div className="mt-4 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-300 font-mono text-xs">
                        Acoustic Power: {currentDynCard.decibelRange}
                      </div>
                    </div>

                    <div className="md:col-span-7 space-y-4 text-xs sm:text-sm">
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="font-semibold text-amber-400 uppercase tracking-wider text-[11px] block">
                          Air Speed & Velocity in Brass
                        </span>
                        <p className="text-slate-300 leading-relaxed">
                          {currentDynCard.brassAirSpeed}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="font-semibold text-amber-400 uppercase tracking-wider text-[11px] block">
                          Embouchure Cushion & Aperture
                        </span>
                        <p className="text-slate-300 leading-relaxed">
                          {currentDynCard.embouchureAdjustment}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="font-semibold text-amber-400 uppercase tracking-wider text-[11px] block">
                          British Brass Band Section Balance
                        </span>
                        <p className="text-slate-300 leading-relaxed">
                          {currentDynCard.sectionBalancingAdvice}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeDeck === 'clefs' && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-inner">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-1">
                        Clef Notation
                      </span>
                      <span className="font-serif text-7xl font-black text-amber-400 select-none my-2">
                        {currentClefCard.symbolGlyph}
                      </span>
                      <span className="font-serif text-xl font-bold text-slate-100">
                        {currentClefCard.name}
                      </span>
                      <div className="mt-3 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-amber-300 font-mono text-xs">
                        {currentClefCard.referenceLineName}
                      </div>
                    </div>

                    <div className="md:col-span-7 space-y-3 text-xs sm:text-sm">
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                        <span className="font-semibold text-amber-400 uppercase tracking-wider text-[11px] block">
                          British Brass Band Tradition
                        </span>
                        <p className="text-slate-300 leading-relaxed text-xs">
                          {currentClefCard.brassBandUsage}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <strong className="text-amber-400">Lines Mnemonic:</strong>
                          <span className="text-slate-200">{currentClefCard.mnemonicLines}</span>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-900 pt-1.5">
                          <strong className="text-amber-400">Spaces Mnemonic:</strong>
                          <span className="text-slate-200">{currentClefCard.mnemonicSpaces}</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="font-semibold text-amber-400 uppercase tracking-wider text-[11px] block">
                          How Clefs Govern Articulations
                        </span>
                        <p className="text-slate-300 leading-relaxed text-xs">
                          {currentClefCard.howToArticulateInThisClef}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CARD BACK CONTENT (DETAILED PLAYING SECRETS) */}
            {isFlipped && (
              <div className="space-y-4 animate-fadeIn flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Deep Technical Mastery & Bandmaster's Rehearsal Rules</span>
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-slate-100 mb-4">
                    {activeDeck === 'articulations' && `${currentArtCard.name} — How to Play with Mastery`}
                    {activeDeck === 'dynamics' && `${currentDynCard.symbol} (${currentDynCard.italianName}) — Rehearsal Cue`}
                    {activeDeck === 'clefs' && `${currentClefCard.name} — Transposition Genius`}
                  </h3>

                  {activeDeck === 'articulations' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                        <span className="font-bold text-amber-400 block text-xs">
                          👅 1. Exact Tongue Syllable & Strike Location:
                        </span>
                        <p className="text-slate-300 leading-relaxed">
                          {currentArtCard.tongueTechnique}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                        <span className="font-bold text-amber-400 block text-xs">
                          💨 2. Diaphragm Airflow & Support:
                        </span>
                        <p className="text-slate-300 leading-relaxed">
                          {currentArtCard.airflowInstruction}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-1.5">
                        <span className="font-bold text-rose-400 block text-xs">
                          ⚠️ 3. Fatal Brass Mistake to Eliminate:
                        </span>
                        <p className="text-slate-300 leading-relaxed">
                          {currentArtCard.commonMistake}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-900/40 space-y-1.5">
                        <span className="font-bold text-amber-300 block text-xs">
                          🎺 4. Bandmaster's Podium Instruction:
                        </span>
                        <p className="text-slate-200 italic leading-relaxed">
                          {currentArtCard.bandmasterInstruction}
                        </p>
                      </div>
                    </div>
                  )}

                  {activeDeck === 'dynamics' && (
                    <div className="space-y-4 text-xs">
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <span className="font-bold text-amber-400 block text-sm">
                          Conductor Podium Cue & Hand Sign:
                        </span>
                        <p className="text-slate-200 text-sm italic leading-relaxed">
                          "{currentDynCard.bandmasterCue}"
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <span className="font-bold text-amber-400 block text-xs">
                          Harmonic Core Balance (Salvation Army / British Brass Band):
                        </span>
                        <p className="text-slate-300 leading-relaxed">
                          When executing <strong>{currentDynCard.symbol}</strong>, lower brass (Basses, Euphoniums) form the pyramid foundation, middle brass (Trombones, Horns, Baritones) provide rich velvet cushion, and Cornets sit effortlessly on top without strident edge.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeDeck === 'clefs' && (
                    <div className="space-y-3 text-xs">
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <span className="font-bold text-amber-400 block text-sm">
                          The Wonder of British Treble Clef Transposition:
                        </span>
                        <p className="text-slate-300 leading-relaxed">
                          Because the whole band reads Treble Clef (except bass trombone), a player who starts on Cornet can switch overnight to Euphonium, Baritone, Tenor Horn, or even a 30-pound BBb Bass without learning new fingerings! When they see 2nd-space A, their fingers press valves 1 and 2 automatically. Articulations like staccato, accents, and tenutos translate with complete physical consistency across the entire band.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={() => setIsFlipped(false)}
                    className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-all shadow"
                  >
                    ← Back to Visual Notation
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Card Navigation Controls */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-6">
              <button
                onClick={handlePrev}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-bold transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous Card</span>
              </button>

              {/* Dot Indicators */}
              <div className="hidden sm:flex items-center gap-1.5">
                {Array.from({ length: totalCards }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setCardIndex(idx); setIsFlipped(false); }}
                    className={`h-2 rounded-full transition-all ${
                      idx === cardIndex ? 'w-6 bg-amber-400' : 'w-2 bg-slate-800 hover:bg-slate-700'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 text-slate-950 hover:bg-amber-300 text-xs font-bold transition-all shadow"
              >
                <span>Next Card</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: COMPLETE QUICK REFERENCE PALETTE (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <span className="font-serif text-base font-bold text-slate-100">
                {activeDeck === 'articulations' && 'Articulations Quick Selector'}
                {activeDeck === 'dynamics' && 'Dynamics Hierarchy'}
                {activeDeck === 'clefs' && 'Clef Comparison'}
              </span>
              <span className="font-mono text-[10px] text-amber-400">
                Click to Jump
              </span>
            </div>

            <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
              {activeDeck === 'articulations' && currentArticulations.map((card, idx) => (
                <button
                  key={card.id}
                  onClick={() => { setCardIndex(idx); setIsFlipped(false); }}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                    idx === cardIndex
                      ? 'border-amber-400 bg-amber-500/10 text-amber-300 font-bold'
                      : 'border-slate-800/80 bg-slate-950 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-serif text-xl w-6 text-center text-amber-400">
                      {card.symbol}
                    </span>
                    <div>
                      <div className="text-xs font-semibold">{card.name}</div>
                      <div className="text-[10px] text-slate-500">{card.category}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">#{idx + 1}</span>
                </button>
              ))}

              {activeDeck === 'dynamics' && DYNAMICS_FLASHCARDS.map((dyn, idx) => (
                <button
                  key={dyn.id}
                  onClick={() => { setCardIndex(idx); setIsFlipped(false); }}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                    idx === cardIndex
                      ? 'border-amber-400 bg-amber-500/10 text-amber-300 font-bold'
                      : 'border-slate-800/80 bg-slate-950 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-lg font-bold w-10 text-center text-amber-400 italic">
                      {dyn.symbol}
                    </span>
                    <div>
                      <div className="text-xs font-semibold">{dyn.italianName}</div>
                      <div className="text-[10px] text-slate-500">{dyn.englishMeaning}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{dyn.decibelRange.split(' ')[0]}</span>
                </button>
              ))}

              {activeDeck === 'clefs' && CLEF_FLASHCARDS.map((clef, idx) => (
                <button
                  key={clef.id}
                  onClick={() => { setCardIndex(idx); setIsFlipped(false); }}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                    idx === cardIndex
                      ? 'border-amber-400 bg-amber-500/10 text-amber-300 font-bold'
                      : 'border-slate-800/80 bg-slate-950 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-2xl text-amber-400">
                      {clef.symbolGlyph}
                    </span>
                    <div>
                      <div className="text-xs font-semibold">{clef.name}</div>
                      <div className="text-[10px] text-slate-500">{clef.referenceLineName.split(' is ')[0]}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
