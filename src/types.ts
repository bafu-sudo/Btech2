export type BrassInstrumentKey = 'Bb' | 'Eb' | 'C' | 'F';

export interface BrassInstrumentInfo {
  id: string;
  name: string;
  clef: 'treble' | 'bass';
  fundamentalKey: BrassInstrumentKey;
  description: string;
  section: string;
  range: string;
  standardValves: number;
  brassBandRole: string;
  exampleSolo: string;
}

export interface NoteDefinition {
  writtenNote: string;
  concertPitch: string;
  valves: number[]; // e.g. [1, 2] or [] for open
  partial: number;
  frequencyHz: number;
  description?: string;
  slidePosition?: number;
  slideLabel?: string;
}

export interface ScaleDefinition {
  id: string;
  title: string;
  category?: 'major' | 'minor' | 'chromatic' | 'blues-pentatonic' | 'studies';
  rootNote?: string;
  instrumentKey: BrassInstrumentKey;
  instrumentName: string;
  writtenKey: string;
  concertKey: string;
  keySignature?: string;
  accidentalsCount?: string;
  explanation: string;
  notes: {
    name: string;
    octave: number;
    concertName: string;
    valves: number[];
    valveLabel: string;
    slidePosition?: number;
    slideLabel?: string;
    frequencyHz: number;
  }[];
}

export interface QuizQuestion {
  id: number;
  category: 'transposition' | 'fingerings' | 'brass-tradition' | 'ear-training' | 'sharps-flats';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  playNoteFreq?: number;
}

export interface MelodyNote {
  writtenBb: string;
  writtenEb: string;
  concert: string;
  durationBeats: number;
  durationName: string; // e.g. 'Quarter', 'Half', 'Dotted Quarter', 'Eighth', 'Whole'
  valvesBb: number[];
  valvesEb: number[];
  slidePosTrombone: number;
  freqConcert: number;
  freqBb: number;
  freqEb: number;
  isRest?: boolean;
  lyricSnippet?: string;
}

export interface ScorePiece {
  id: string;
  title: string;
  subtitle: string;
  composer: string;
  origin: string; // e.g. 'Salvation Army Tune Book #24 / William Booth Era'
  timeSignature: string;
  keySignatureConcert: string;
  keySignatureBb: string;
  keySignatureEb: string;
  tempoBpm: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Salvation Army Hymn' | 'British Band March' | 'Cornet Solo & Air' | 'Folk & Traditional' | 'Zimbabwe Brass Medley';
  historicalNote: string;
  lyricsOrVerse?: string;
  melodyNotes: MelodyNote[];
  abcNotation?: string;
  // Licensing & Attribution
  license?: 'Public Domain' | 'Creative Commons (CC BY 4.0)' | 'Original Btech2 Educational Arrangement' | 'Traditional Non-Copyright';
  sourceUrl?: string;
  attribution?: string;
  redistributionPermitted?: boolean;
  offlineDownloadPermitted?: boolean;
  hasAudioSample?: boolean;
  hasDownloadablePdf?: boolean;
  availableParts?: string[];
}

export interface AccidentalInfo {
  symbol: string;
  name: string;
  semitoneShift: number;
  effect: string;
  valveImpact: string;
  tromboneImpact: string;
  example: string;
}

