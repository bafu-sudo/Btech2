import { ScaleDefinition, AccidentalInfo } from '../types';

export const ALL_MAJOR_SCALES: ScaleDefinition[] = [
  {
    id: 'scale-c-major',
    title: 'C Major Scale (Natural Key)',
    category: 'major',
    rootNote: 'C',
    instrumentKey: 'Bb',
    instrumentName: 'All Brass (Treble Clef Basis)',
    writtenKey: 'C Major (0 Sharps / 0 Flats)',
    concertKey: 'Concert Bb Major (on Bb) / Concert Eb Major (on Eb)',
    keySignature: 'Natural (No accidentals in key signature)',
    accidentalsCount: '0 ♯ / 0 ♭',
    explanation: 'The natural scale and universal reference point in British brass band treble clef. Every note is natural.',
    notes: [
      { name: 'C4', octave: 4, concertName: 'Bb3', valves: [], valveLabel: 'Open', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 233.08 },
      { name: 'D4', octave: 4, concertName: 'C4', valves: [1, 3], valveLabel: '1 + 3', slidePosition: 6, slideLabel: '6th Pos', frequencyHz: 261.63 },
      { name: 'E4', octave: 4, concertName: 'D4', valves: [1, 2], valveLabel: '1 + 2', slidePosition: 4, slideLabel: '4th Pos', frequencyHz: 293.66 },
      { name: 'F4', octave: 4, concertName: 'Eb4', valves: [1], valveLabel: '1st', slidePosition: 3, slideLabel: '3rd Pos', frequencyHz: 311.13 },
      { name: 'G4', octave: 4, concertName: 'F4', valves: [], valveLabel: 'Open', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 349.23 },
      { name: 'A4', octave: 4, concertName: 'G4', valves: [1, 2], valveLabel: '1 + 2', slidePosition: 4, slideLabel: '4th Pos', frequencyHz: 392.00 },
      { name: 'B4', octave: 4, concertName: 'A4', valves: [2], valveLabel: '2nd', slidePosition: 2, slideLabel: '2nd Pos', frequencyHz: 440.00 },
      { name: 'C5', octave: 5, concertName: 'Bb4', valves: [], valveLabel: 'Open', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 466.16 }
    ]
  },
  {
    id: 'scale-g-major',
    title: 'G Major Scale (1 Sharp)',
    category: 'major',
    rootNote: 'G',
    instrumentKey: 'Bb',
    instrumentName: 'All Brass (Treble Clef Basis)',
    writtenKey: 'G Major (1 Sharp: F#)',
    concertKey: 'Concert F Major (on Bb) / Concert Bb Major (on Eb)',
    keySignature: '1 Sharp (F♯)',
    accidentalsCount: '1 ♯',
    explanation: 'Introduces the first sharp: F#. Notice how F# replaces natural F (1st valve becomes 2nd valve on high F#, or slide pulls from 3rd pos to 2nd pos).',
    notes: [
      { name: 'G4', octave: 4, concertName: 'F4', valves: [], valveLabel: 'Open', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 349.23 },
      { name: 'A4', octave: 4, concertName: 'G4', valves: [1, 2], valveLabel: '1 + 2', slidePosition: 4, slideLabel: '4th Pos', frequencyHz: 392.00 },
      { name: 'B4', octave: 4, concertName: 'A4', valves: [2], valveLabel: '2nd', slidePosition: 2, slideLabel: '2nd Pos', frequencyHz: 440.00 },
      { name: 'C5', octave: 5, concertName: 'Bb4', valves: [], valveLabel: 'Open', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 466.16 },
      { name: 'D5', octave: 5, concertName: 'C5', valves: [1], valveLabel: '1st', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 523.25 },
      { name: 'E5', octave: 5, concertName: 'D5', valves: [], valveLabel: 'Open', slidePosition: 2, slideLabel: '2nd Pos', frequencyHz: 587.33 },
      { name: 'F#5', octave: 5, concertName: 'Eb5', valves: [2], valveLabel: '2nd', slidePosition: 3, slideLabel: '3rd Pos (Alt)', frequencyHz: 622.25 },
      { name: 'G5', octave: 5, concertName: 'F5', valves: [], valveLabel: 'Open', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 698.46 }
    ]
  },
  {
    id: 'scale-d-major',
    title: 'D Major Scale (2 Sharps)',
    category: 'major',
    rootNote: 'D',
    instrumentKey: 'Bb',
    instrumentName: 'All Brass (Treble Clef Basis)',
    writtenKey: 'D Major (2 Sharps: F#, C#)',
    concertKey: 'Concert C Major (on Bb) / Concert F Major (on Eb)',
    keySignature: '2 Sharps (F♯, C♯)',
    accidentalsCount: '2 ♯',
    explanation: 'Contains two sharps: F# and C#. When a brass band plays in Concert C, Bb cornets read this exact D Major scale!',
    notes: [
      { name: 'D4', octave: 4, concertName: 'C4', valves: [1, 3], valveLabel: '1 + 3', slidePosition: 6, slideLabel: '6th Pos', frequencyHz: 261.63 },
      { name: 'E4', octave: 4, concertName: 'D4', valves: [1, 2], valveLabel: '1 + 2', slidePosition: 4, slideLabel: '4th Pos', frequencyHz: 293.66 },
      { name: 'F#4', octave: 4, concertName: 'E4', valves: [2], valveLabel: '2nd', slidePosition: 5, slideLabel: '5th Pos', frequencyHz: 329.63 },
      { name: 'G4', octave: 4, concertName: 'F4', valves: [], valveLabel: 'Open', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 349.23 },
      { name: 'A4', octave: 4, concertName: 'G4', valves: [1, 2], valveLabel: '1 + 2', slidePosition: 4, slideLabel: '4th Pos', frequencyHz: 392.00 },
      { name: 'B4', octave: 4, concertName: 'A4', valves: [2], valveLabel: '2nd', slidePosition: 2, slideLabel: '2nd Pos', frequencyHz: 440.00 },
      { name: 'C#5', octave: 5, concertName: 'B4', valves: [1, 2], valveLabel: '1 + 2', slidePosition: 2, slideLabel: '2nd Pos', frequencyHz: 493.88 },
      { name: 'D5', octave: 5, concertName: 'C5', valves: [1], valveLabel: '1st', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 523.25 }
    ]
  },
  {
    id: 'scale-a-major',
    title: 'A Major Scale (3 Sharps)',
    category: 'major',
    rootNote: 'A',
    instrumentKey: 'Bb',
    instrumentName: 'All Brass (Treble Clef Basis)',
    writtenKey: 'A Major (3 Sharps: F#, C#, G#)',
    concertKey: 'Concert G Major (on Bb) / Concert C Major (on Eb)',
    keySignature: '3 Sharps (F♯, C♯, G♯)',
    accidentalsCount: '3 ♯',
    explanation: 'Contains F#, C#, and G#. When concert band plays in C, Eb Tenor Horns and Sopranos read this A Major scale!',
    notes: [
      { name: 'A3', octave: 3, concertName: 'G3', valves: [1, 2], valveLabel: '1 + 2', slidePosition: 4, slideLabel: '4th Pos', frequencyHz: 196.00 },
      { name: 'B3', octave: 3, concertName: 'A3', valves: [2], valveLabel: '2nd', slidePosition: 2, slideLabel: '2nd Pos', frequencyHz: 220.00 },
      { name: 'C#4', octave: 4, concertName: 'B3', valves: [1, 2, 3], valveLabel: '1 + 2 + 3', slidePosition: 5, slideLabel: '5th Pos', frequencyHz: 246.94 },
      { name: 'D4', octave: 4, concertName: 'C4', valves: [1, 3], valveLabel: '1 + 3', slidePosition: 6, slideLabel: '6th Pos', frequencyHz: 261.63 },
      { name: 'E4', octave: 4, concertName: 'D4', valves: [1, 2], valveLabel: '1 + 2', slidePosition: 4, slideLabel: '4th Pos', frequencyHz: 293.66 },
      { name: 'F#4', octave: 4, concertName: 'E4', valves: [2], valveLabel: '2nd', slidePosition: 5, slideLabel: '5th Pos', frequencyHz: 329.63 },
      { name: 'G#4', octave: 4, concertName: 'F#4', valves: [2, 3], valveLabel: '2 + 3', slidePosition: 3, slideLabel: '3rd Pos', frequencyHz: 369.99 },
      { name: 'A4', octave: 4, concertName: 'G4', valves: [1, 2], valveLabel: '1 + 2', slidePosition: 4, slideLabel: '4th Pos', frequencyHz: 392.00 }
    ]
  },
  {
    id: 'scale-e-major',
    title: 'E Major Scale (4 Sharps)',
    category: 'major',
    rootNote: 'E',
    instrumentKey: 'Bb',
    instrumentName: 'All Brass (Treble Clef Basis)',
    writtenKey: 'E Major (4 Sharps: F#, C#, G#, D#)',
    concertKey: 'Concert D Major (on Bb)',
    keySignature: '4 Sharps (F♯, C♯, G♯, D♯)',
    accidentalsCount: '4 ♯',
    explanation: 'Bright, sparkling brass key with F#, C#, G#, and D# (valves 2, 1+2+3, 2+3, 2).',
    notes: [
      { name: 'E4', octave: 4, concertName: 'D4', valves: [1, 2], valveLabel: '1 + 2', slidePosition: 4, slideLabel: '4th Pos', frequencyHz: 293.66 },
      { name: 'F#4', octave: 4, concertName: 'E4', valves: [2], valveLabel: '2nd', slidePosition: 5, slideLabel: '5th Pos', frequencyHz: 329.63 },
      { name: 'G#4', octave: 4, concertName: 'F#4', valves: [2, 3], valveLabel: '2 + 3', slidePosition: 3, slideLabel: '3rd Pos', frequencyHz: 369.99 },
      { name: 'A4', octave: 4, concertName: 'G4', valves: [1, 2], valveLabel: '1 + 2', slidePosition: 4, slideLabel: '4th Pos', frequencyHz: 392.00 },
      { name: 'B4', octave: 4, concertName: 'A4', valves: [2], valveLabel: '2nd', slidePosition: 2, slideLabel: '2nd Pos', frequencyHz: 440.00 },
      { name: 'C#5', octave: 5, concertName: 'B4', valves: [1, 2], valveLabel: '1 + 2', slidePosition: 2, slideLabel: '2nd Pos', frequencyHz: 493.88 },
      { name: 'D#5', octave: 5, concertName: 'C#5', valves: [2], valveLabel: '2nd', slidePosition: 3, slideLabel: '3rd Pos', frequencyHz: 554.37 },
      { name: 'E5', octave: 5, concertName: 'D5', valves: [], valveLabel: 'Open', slidePosition: 2, slideLabel: '2nd Pos', frequencyHz: 587.33 }
    ]
  },
  {
    id: 'scale-f-major',
    title: 'F Major Scale (1 Flat)',
    category: 'major',
    rootNote: 'F',
    instrumentKey: 'Bb',
    instrumentName: 'All Brass (Treble Clef Basis)',
    writtenKey: 'F Major (1 Flat: Bb)',
    concertKey: 'Concert Eb Major (on Bb) / Concert Ab Major (on Eb)',
    keySignature: '1 Flat (B♭)',
    accidentalsCount: '1 ♭',
    explanation: 'The essential band scale introducing B♭ (1st valve / 1st position). Most traditional brass band marches are written in F or B♭.',
    notes: [
      { name: 'F4', octave: 4, concertName: 'Eb4', valves: [1], valveLabel: '1st', slidePosition: 3, slideLabel: '3rd Pos', frequencyHz: 311.13 },
      { name: 'G4', octave: 4, concertName: 'F4', valves: [], valveLabel: 'Open', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 349.23 },
      { name: 'A4', octave: 4, concertName: 'G4', valves: [1, 2], valveLabel: '1 + 2', slidePosition: 4, slideLabel: '4th Pos', frequencyHz: 392.00 },
      { name: 'Bb4', octave: 4, concertName: 'Ab4', valves: [1], valveLabel: '1st', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 415.30 },
      { name: 'C5', octave: 5, concertName: 'Bb4', valves: [], valveLabel: 'Open', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 466.16 },
      { name: 'D5', octave: 5, concertName: 'C5', valves: [1], valveLabel: '1st', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 523.25 },
      { name: 'E5', octave: 5, concertName: 'D5', valves: [], valveLabel: 'Open', slidePosition: 2, slideLabel: '2nd Pos', frequencyHz: 587.33 },
      { name: 'F5', octave: 5, concertName: 'Eb5', valves: [1], valveLabel: '1st', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 622.25 }
    ]
  },
  {
    id: 'scale-bb-major',
    title: 'Bb Major Scale (2 Flats)',
    category: 'major',
    rootNote: 'Bb',
    instrumentKey: 'Bb',
    instrumentName: 'All Brass (Treble Clef Basis)',
    writtenKey: 'Bb Major (2 Flats: Bb, Eb)',
    concertKey: 'Concert Ab Major (on Bb) / Concert Db Major (on Eb)',
    keySignature: '2 Flats (B♭, E♭)',
    accidentalsCount: '2 ♭',
    explanation: 'Features Bb and Eb (valves 1st and 2nd for high Eb). Warm and noble brass band sonority.',
    notes: [
      { name: 'Bb3', octave: 3, concertName: 'Ab3', valves: [1], valveLabel: '1st', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 207.65 },
      { name: 'C4', octave: 4, concertName: 'Bb3', valves: [], valveLabel: 'Open', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 233.08 },
      { name: 'D4', octave: 4, concertName: 'C4', valves: [1, 3], valveLabel: '1 + 3', slidePosition: 6, slideLabel: '6th Pos', frequencyHz: 261.63 },
      { name: 'Eb4', octave: 4, concertName: 'Db4', valves: [2], valveLabel: '2nd', slidePosition: 3, slideLabel: '3rd Pos', frequencyHz: 277.18 },
      { name: 'F4', octave: 4, concertName: 'Eb4', valves: [1], valveLabel: '1st', slidePosition: 3, slideLabel: '3rd Pos', frequencyHz: 311.13 },
      { name: 'G4', octave: 4, concertName: 'F4', valves: [], valveLabel: 'Open', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 349.23 },
      { name: 'A4', octave: 4, concertName: 'G4', valves: [1, 2], valveLabel: '1 + 2', slidePosition: 4, slideLabel: '4th Pos', frequencyHz: 392.00 },
      { name: 'Bb4', octave: 4, concertName: 'Ab4', valves: [1], valveLabel: '1st', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 415.30 }
    ]
  },
  {
    id: 'scale-eb-major',
    title: 'Eb Major Scale (3 Flats)',
    category: 'major',
    rootNote: 'Eb',
    instrumentKey: 'Bb',
    instrumentName: 'All Brass (Treble Clef Basis)',
    writtenKey: 'Eb Major (3 Flats: Bb, Eb, Ab)',
    concertKey: 'Concert Db Major (on Bb) / Concert Gb Major (on Eb)',
    keySignature: '3 Flats (B♭, E♭, A♭)',
    accidentalsCount: '3 ♭',
    explanation: 'Contains Bb, Eb, and Ab (Ab is valves 2+3 or 3rd position on trombone). Standard key for Salvation Army hymn books.',
    notes: [
      { name: 'Eb4', octave: 4, concertName: 'Db4', valves: [2], valveLabel: '2nd', slidePosition: 3, slideLabel: '3rd Pos', frequencyHz: 277.18 },
      { name: 'F4', octave: 4, concertName: 'Eb4', valves: [1], valveLabel: '1st', slidePosition: 3, slideLabel: '3rd Pos', frequencyHz: 311.13 },
      { name: 'G4', octave: 4, concertName: 'F4', valves: [], valveLabel: 'Open', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 349.23 },
      { name: 'Ab4', octave: 4, concertName: 'Gb4', valves: [2, 3], valveLabel: '2 + 3', slidePosition: 3, slideLabel: '3rd Pos', frequencyHz: 369.99 },
      { name: 'Bb4', octave: 4, concertName: 'Ab4', valves: [1], valveLabel: '1st', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 415.30 },
      { name: 'C5', octave: 5, concertName: 'Bb4', valves: [], valveLabel: 'Open', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 466.16 },
      { name: 'D5', octave: 5, concertName: 'C5', valves: [1], valveLabel: '1st', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 523.25 },
      { name: 'Eb5', octave: 5, concertName: 'Db5', valves: [2], valveLabel: '2nd', slidePosition: 3, slideLabel: '3rd Pos', frequencyHz: 554.37 }
    ]
  },
  {
    id: 'scale-ab-major',
    title: 'Ab Major Scale (4 Flats)',
    category: 'major',
    rootNote: 'Ab',
    instrumentKey: 'Bb',
    instrumentName: 'All Brass (Treble Clef Basis)',
    writtenKey: 'Ab Major (4 Flats: Bb, Eb, Ab, Db)',
    concertKey: 'Concert Gb Major (on Bb)',
    keySignature: '4 Flats (B♭, E♭, A♭, D♭)',
    accidentalsCount: '4 ♭',
    explanation: 'Deep and expressive flat key containing Bb, Eb, Ab, and Db. Low Db uses valves 1+2+3 (same as C#).',
    notes: [
      { name: 'Ab4', octave: 4, concertName: 'Gb4', valves: [2, 3], valveLabel: '2 + 3', slidePosition: 3, slideLabel: '3rd Pos', frequencyHz: 369.99 },
      { name: 'Bb4', octave: 4, concertName: 'Ab4', valves: [1], valveLabel: '1st', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 415.30 },
      { name: 'C5', octave: 5, concertName: 'Bb4', valves: [], valveLabel: 'Open', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 466.16 },
      { name: 'Db5', octave: 5, concertName: 'Cb5', valves: [1, 2], valveLabel: '1 + 2', slidePosition: 2, slideLabel: '2nd Pos', frequencyHz: 493.88 },
      { name: 'Eb5', octave: 5, concertName: 'Db5', valves: [2], valveLabel: '2nd', slidePosition: 3, slideLabel: '3rd Pos', frequencyHz: 554.37 },
      { name: 'F5', octave: 5, concertName: 'Eb5', valves: [1], valveLabel: '1st', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 622.25 },
      { name: 'G5', octave: 5, concertName: 'F5', valves: [], valveLabel: 'Open', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 698.46 },
      { name: 'Ab5', octave: 5, concertName: 'Gb5', valves: [2, 3], valveLabel: '2 + 3', slidePosition: 3, slideLabel: '3rd Pos', frequencyHz: 739.99 }
    ]
  },
  {
    id: 'scale-db-major',
    title: 'Db Major Scale (5 Flats)',
    category: 'major',
    rootNote: 'Db',
    instrumentKey: 'Bb',
    instrumentName: 'All Brass (Treble Clef Basis)',
    writtenKey: 'Db Major (5 Flats: Bb, Eb, Ab, Db, Gb)',
    concertKey: 'Concert B Major (on Bb) / Concert E Major (on Eb)',
    keySignature: '5 Flats (B♭, E♭, A♭, D♭, G♭)',
    accidentalsCount: '5 ♭',
    explanation: 'A rich and dark flat key. Notice low Db uses valves 1+2+3 (often requiring a 3rd valve trigger kick for accurate intonation on cornets and euphoniums).',
    notes: [
      { name: 'Db4', octave: 4, concertName: 'B3', valves: [1, 2, 3], valveLabel: '1 + 2 + 3', slidePosition: 5, slideLabel: '5th Pos', frequencyHz: 246.94 },
      { name: 'Eb4', octave: 4, concertName: 'Db4', valves: [2], valveLabel: '2nd', slidePosition: 3, slideLabel: '3rd Pos', frequencyHz: 277.18 },
      { name: 'F4', octave: 4, concertName: 'Eb4', valves: [1], valveLabel: '1st', slidePosition: 3, slideLabel: '3rd Pos', frequencyHz: 311.13 },
      { name: 'Gb4', octave: 4, concertName: 'E4', valves: [2], valveLabel: '2nd', slidePosition: 5, slideLabel: '5th Pos', frequencyHz: 329.63 },
      { name: 'Ab4', octave: 4, concertName: 'Gb4', valves: [2, 3], valveLabel: '2 + 3', slidePosition: 3, slideLabel: '3rd Pos', frequencyHz: 369.99 },
      { name: 'Bb4', octave: 4, concertName: 'Ab4', valves: [1], valveLabel: '1st', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 415.30 },
      { name: 'C5', octave: 5, concertName: 'Bb4', valves: [], valveLabel: 'Open', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 466.16 },
      { name: 'Db5', octave: 5, concertName: 'B4', valves: [1, 2], valveLabel: '1 + 2', slidePosition: 2, slideLabel: '2nd Pos', frequencyHz: 493.88 }
    ]
  },
  {
    id: 'scale-b-major',
    title: 'B Major Scale (5 Sharps)',
    category: 'major',
    rootNote: 'B',
    instrumentKey: 'Bb',
    instrumentName: 'All Brass (Treble Clef Basis)',
    writtenKey: 'B Major (5 Sharps: F#, C#, G#, D#, A#)',
    concertKey: 'Concert A Major (on Bb) / Concert D Major (on Eb)',
    keySignature: '5 Sharps (F♯, C♯, G♯, D♯, A♯)',
    accidentalsCount: '5 ♯',
    explanation: 'A brilliant, ringing concert key. High technical challenge testing 5th-partial valve accuracy and swift finger coordination.',
    notes: [
      { name: 'B3', octave: 3, concertName: 'A3', valves: [2], valveLabel: '2nd', slidePosition: 2, slideLabel: '2nd Pos', frequencyHz: 220.00 },
      { name: 'C#4', octave: 4, concertName: 'B3', valves: [1, 2, 3], valveLabel: '1 + 2 + 3', slidePosition: 5, slideLabel: '5th Pos', frequencyHz: 246.94 },
      { name: 'D#4', octave: 4, concertName: 'C#4', valves: [2], valveLabel: '2nd', slidePosition: 3, slideLabel: '3rd Pos', frequencyHz: 277.18 },
      { name: 'E4', octave: 4, concertName: 'D4', valves: [1, 2], valveLabel: '1 + 2', slidePosition: 4, slideLabel: '4th Pos', frequencyHz: 293.66 },
      { name: 'F#4', octave: 4, concertName: 'E4', valves: [2], valveLabel: '2nd', slidePosition: 5, slideLabel: '5th Pos', frequencyHz: 329.63 },
      { name: 'G#4', octave: 4, concertName: 'F#4', valves: [2, 3], valveLabel: '2 + 3', slidePosition: 3, slideLabel: '3rd Pos', frequencyHz: 369.99 },
      { name: 'A#4', octave: 4, concertName: 'G#4', valves: [1], valveLabel: '1st', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 415.30 },
      { name: 'B4', octave: 4, concertName: 'A4', valves: [2], valveLabel: '2nd', slidePosition: 2, slideLabel: '2nd Pos', frequencyHz: 440.00 }
    ]
  },
  {
    id: 'scale-f-sharp-major',
    title: 'F# Major / Gb Major (6 Sharps / 6 Flats)',
    category: 'major',
    rootNote: 'F#',
    instrumentKey: 'Bb',
    instrumentName: 'All Brass (Treble Clef Basis)',
    writtenKey: 'F# Major (6 Sharps: F#, C#, G#, D#, A#, E#)',
    concertKey: 'Concert E Major (on Bb) / Concert A Major (on Eb)',
    keySignature: '6 Sharps (or 6 Flats enharmonically)',
    accidentalsCount: '6 ♯ / 6 ♭',
    explanation: 'The apex of the circle of fifths. Note the presence of E# (played as F natural: 1st valve / 1st position). Demonstrates complete mastery of brass instrument harmonics.',
    notes: [
      { name: 'F#4', octave: 4, concertName: 'E4', valves: [2], valveLabel: '2nd', slidePosition: 5, slideLabel: '5th Pos', frequencyHz: 329.63 },
      { name: 'G#4', octave: 4, concertName: 'F#4', valves: [2, 3], valveLabel: '2 + 3', slidePosition: 3, slideLabel: '3rd Pos', frequencyHz: 369.99 },
      { name: 'A#4', octave: 4, concertName: 'G#4', valves: [1], valveLabel: '1st', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 415.30 },
      { name: 'B4', octave: 4, concertName: 'A4', valves: [2], valveLabel: '2nd', slidePosition: 2, slideLabel: '2nd Pos', frequencyHz: 440.00 },
      { name: 'C#5', octave: 5, concertName: 'B4', valves: [1, 2], valveLabel: '1 + 2', slidePosition: 2, slideLabel: '2nd Pos', frequencyHz: 493.88 },
      { name: 'D#5', octave: 5, concertName: 'C#5', valves: [2], valveLabel: '2nd', slidePosition: 3, slideLabel: '3rd Pos', frequencyHz: 554.37 },
      { name: 'E#5', octave: 5, concertName: 'D#5', valves: [1], valveLabel: '1st (Sounds F♮)', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 622.25 },
      { name: 'F#5', octave: 5, concertName: 'E5', valves: [2], valveLabel: '2nd', slidePosition: 3, slideLabel: '3rd Pos (Alt)', frequencyHz: 659.25 }
    ]
  }
];

export const CHROMATIC_AND_MINOR_SCALES: ScaleDefinition[] = [
  {
    id: 'scale-chromatic',
    title: 'Two-Octave Chromatic Scale',
    category: 'chromatic',
    rootNote: 'C',
    instrumentKey: 'Bb',
    instrumentName: 'All Brass (Arban Foundation)',
    writtenKey: 'Chromatic (Every Half Step)',
    concertKey: 'Concert Bb Chromatic',
    keySignature: 'All 12 Semitones',
    accidentalsCount: 'Sharps & Flats',
    explanation: 'The supreme foundation of all brass technique from Arban’s Grand Method. Connects every valve combination and slide position continuously across two octaves.',
    notes: [
      { name: 'C4', octave: 4, concertName: 'Bb3', valves: [], valveLabel: 'Open', slidePosition: 1, slideLabel: '1st', frequencyHz: 233.08 },
      { name: 'C#4', octave: 4, concertName: 'B3', valves: [1, 2, 3], valveLabel: '1+2+3', slidePosition: 5, slideLabel: '5th', frequencyHz: 246.94 },
      { name: 'D4', octave: 4, concertName: 'C4', valves: [1, 3], valveLabel: '1+3', slidePosition: 6, slideLabel: '6th', frequencyHz: 261.63 },
      { name: 'Eb4', octave: 4, concertName: 'Db4', valves: [2, 3], valveLabel: '2+3', slidePosition: 3, slideLabel: '3rd', frequencyHz: 277.18 },
      { name: 'E4', octave: 4, concertName: 'D4', valves: [1, 2], valveLabel: '1+2', slidePosition: 4, slideLabel: '4th', frequencyHz: 293.66 },
      { name: 'F4', octave: 4, concertName: 'Eb4', valves: [1], valveLabel: '1st', slidePosition: 3, slideLabel: '3rd', frequencyHz: 311.13 },
      { name: 'F#4', octave: 4, concertName: 'E4', valves: [2], valveLabel: '2nd', slidePosition: 5, slideLabel: '5th', frequencyHz: 329.63 },
      { name: 'G4', octave: 4, concertName: 'F4', valves: [], valveLabel: 'Open', slidePosition: 1, slideLabel: '1st', frequencyHz: 349.23 },
      { name: 'Ab4', octave: 4, concertName: 'Gb4', valves: [2, 3], valveLabel: '2+3', slidePosition: 3, slideLabel: '3rd', frequencyHz: 369.99 },
      { name: 'A4', octave: 4, concertName: 'G4', valves: [1, 2], valveLabel: '1+2', slidePosition: 4, slideLabel: '4th', frequencyHz: 392.00 },
      { name: 'Bb4', octave: 4, concertName: 'Ab4', valves: [1], valveLabel: '1st', slidePosition: 1, slideLabel: '1st', frequencyHz: 415.30 },
      { name: 'B4', octave: 4, concertName: 'A4', valves: [2], valveLabel: '2nd', slidePosition: 2, slideLabel: '2nd', frequencyHz: 440.00 },
      { name: 'C5', octave: 5, concertName: 'Bb4', valves: [], valveLabel: 'Open', slidePosition: 1, slideLabel: '1st', frequencyHz: 466.16 }
    ]
  },
  {
    id: 'scale-a-harmonic-minor',
    title: 'A Harmonic Minor Scale',
    category: 'minor',
    rootNote: 'A',
    instrumentKey: 'Bb',
    instrumentName: 'All Brass',
    writtenKey: 'A Minor (Raised 7th: G#)',
    concertKey: 'Concert G Minor',
    keySignature: 'Relative of C Major, with raised G♯',
    accidentalsCount: '1 Raised ♯',
    explanation: 'The relative minor of C Major. In harmonic minor, the 7th scale degree (G) is raised to G# creating an exotic augmented 2nd interval between F and G#.',
    notes: [
      { name: 'A4', octave: 4, concertName: 'G4', valves: [1, 2], valveLabel: '1 + 2', slidePosition: 4, slideLabel: '4th Pos', frequencyHz: 392.00 },
      { name: 'B4', octave: 4, concertName: 'A4', valves: [2], valveLabel: '2nd', slidePosition: 2, slideLabel: '2nd Pos', frequencyHz: 440.00 },
      { name: 'C5', octave: 5, concertName: 'Bb4', valves: [], valveLabel: 'Open', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 466.16 },
      { name: 'D5', octave: 5, concertName: 'C5', valves: [1], valveLabel: '1st', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 523.25 },
      { name: 'E5', octave: 5, concertName: 'D5', valves: [], valveLabel: 'Open', slidePosition: 2, slideLabel: '2nd Pos', frequencyHz: 587.33 },
      { name: 'F5', octave: 5, concertName: 'Eb5', valves: [1], valveLabel: '1st', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 622.25 },
      { name: 'G#5', octave: 5, concertName: 'F#5', valves: [2, 3], valveLabel: '2 + 3', slidePosition: 3, slideLabel: '3rd Pos', frequencyHz: 739.99 },
      { name: 'A5', octave: 5, concertName: 'G5', valves: [1, 2], valveLabel: '1 + 2', slidePosition: 2, slideLabel: '2nd Pos', frequencyHz: 783.99 }
    ]
  },
  {
    id: 'scale-d-harmonic-minor',
    title: 'D Harmonic Minor Scale',
    category: 'minor',
    rootNote: 'D',
    instrumentKey: 'Bb',
    instrumentName: 'All Brass',
    writtenKey: 'D Minor (1 Flat: Bb, Raised 7th: C#)',
    concertKey: 'Concert C Minor',
    keySignature: '1 Flat (B♭) with raised C♯ leading note',
    accidentalsCount: '1 ♭, 1 ♯',
    explanation: 'Relative minor of F Major. Contains Bb and raised leading tone C# (valves 1+2 on high C#, or 1+2+3 on low C#). Very frequent in dramatic brass contest pieces.',
    notes: [
      { name: 'D4', octave: 4, concertName: 'C4', valves: [1, 3], valveLabel: '1 + 3', slidePosition: 6, slideLabel: '6th Pos', frequencyHz: 261.63 },
      { name: 'E4', octave: 4, concertName: 'D4', valves: [1, 2], valveLabel: '1 + 2', slidePosition: 4, slideLabel: '4th Pos', frequencyHz: 293.66 },
      { name: 'F4', octave: 4, concertName: 'Eb4', valves: [1], valveLabel: '1st', slidePosition: 3, slideLabel: '3rd Pos', frequencyHz: 311.13 },
      { name: 'G4', octave: 4, concertName: 'F4', valves: [], valveLabel: 'Open', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 349.23 },
      { name: 'A4', octave: 4, concertName: 'G4', valves: [1, 2], valveLabel: '1 + 2', slidePosition: 4, slideLabel: '4th Pos', frequencyHz: 392.00 },
      { name: 'Bb4', octave: 4, concertName: 'Ab4', valves: [1], valveLabel: '1st', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 415.30 },
      { name: 'C#5', octave: 5, concertName: 'B4', valves: [1, 2], valveLabel: '1 + 2', slidePosition: 2, slideLabel: '2nd Pos', frequencyHz: 493.88 },
      { name: 'D5', octave: 5, concertName: 'C5', valves: [1], valveLabel: '1st', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 523.25 }
    ]
  },
  {
    id: 'scale-g-harmonic-minor',
    title: 'G Harmonic Minor Scale',
    category: 'minor',
    rootNote: 'G',
    instrumentKey: 'Bb',
    instrumentName: 'All Brass',
    writtenKey: 'G Minor (2 Flats: Bb, Eb, Raised 7th: F#)',
    concertKey: 'Concert F Minor',
    keySignature: '2 Flats (B♭, E♭) with raised F♯ leading note',
    accidentalsCount: '2 ♭, 1 ♯',
    explanation: 'Relative minor of Bb Major. A quintessential British brass band minor key with rich somber sonority.',
    notes: [
      { name: 'G4', octave: 4, concertName: 'F4', valves: [], valveLabel: 'Open', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 349.23 },
      { name: 'A4', octave: 4, concertName: 'G4', valves: [1, 2], valveLabel: '1 + 2', slidePosition: 4, slideLabel: '4th Pos', frequencyHz: 392.00 },
      { name: 'Bb4', octave: 4, concertName: 'Ab4', valves: [1], valveLabel: '1st', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 415.30 },
      { name: 'C5', octave: 5, concertName: 'Bb4', valves: [], valveLabel: 'Open', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 466.16 },
      { name: 'D5', octave: 5, concertName: 'C5', valves: [1], valveLabel: '1st', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 523.25 },
      { name: 'Eb5', octave: 5, concertName: 'Db5', valves: [2], valveLabel: '2nd', slidePosition: 3, slideLabel: '3rd Pos', frequencyHz: 554.37 },
      { name: 'F#5', octave: 5, concertName: 'Eb5', valves: [2], valveLabel: '2nd', slidePosition: 3, slideLabel: '3rd Pos (Alt)', frequencyHz: 622.25 },
      { name: 'G5', octave: 5, concertName: 'F5', valves: [], valveLabel: 'Open', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 698.46 }
    ]
  },
  {
    id: 'scale-e-natural-minor',
    title: 'E Natural Minor Scale (Aeolian)',
    category: 'minor',
    rootNote: 'E',
    instrumentKey: 'Bb',
    instrumentName: 'All Brass',
    writtenKey: 'E Minor (1 Sharp: F#)',
    concertKey: 'Concert D Minor',
    keySignature: '1 Sharp (F♯)',
    accidentalsCount: '1 ♯',
    explanation: 'The natural relative minor of G Major. Follows the pure Aeolian mode without accidental alterations.',
    notes: [
      { name: 'E4', octave: 4, concertName: 'D4', valves: [1, 2], valveLabel: '1 + 2', slidePosition: 4, slideLabel: '4th Pos', frequencyHz: 293.66 },
      { name: 'F#4', octave: 4, concertName: 'E4', valves: [2], valveLabel: '2nd', slidePosition: 5, slideLabel: '5th Pos', frequencyHz: 329.63 },
      { name: 'G4', octave: 4, concertName: 'F4', valves: [], valveLabel: 'Open', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 349.23 },
      { name: 'A4', octave: 4, concertName: 'G4', valves: [1, 2], valveLabel: '1 + 2', slidePosition: 4, slideLabel: '4th Pos', frequencyHz: 392.00 },
      { name: 'B4', octave: 4, concertName: 'A4', valves: [2], valveLabel: '2nd', slidePosition: 2, slideLabel: '2nd Pos', frequencyHz: 440.00 },
      { name: 'C5', octave: 5, concertName: 'Bb4', valves: [], valveLabel: 'Open', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 466.16 },
      { name: 'D5', octave: 5, concertName: 'C5', valves: [1], valveLabel: '1st', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 523.25 },
      { name: 'E5', octave: 5, concertName: 'D5', valves: [], valveLabel: 'Open', slidePosition: 2, slideLabel: '2nd Pos', frequencyHz: 587.33 }
    ]
  },
  {
    id: 'scale-c-melodic-minor',
    title: 'C Melodic Minor Scale',
    category: 'minor',
    rootNote: 'C',
    instrumentKey: 'Bb',
    instrumentName: 'All Brass',
    writtenKey: 'C Melodic Minor (Ascending & Descending)',
    concertKey: 'Concert Bb Melodic Minor',
    keySignature: 'Raises 6th and 7th (A♮, B♮) ascending, reverts to natural minor descending',
    accidentalsCount: 'Variable accidentals',
    explanation: 'Essential brass masterclass scale! Ascending raises degrees 6 & 7 (A natural, B natural). Descending reverts to standard natural minor (Bb, Ab). Demonstrates rapid embouchure adaptation.',
    notes: [
      { name: 'C4', octave: 4, concertName: 'Bb3', valves: [], valveLabel: 'Open', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 233.08 },
      { name: 'D4', octave: 4, concertName: 'C4', valves: [1, 3], valveLabel: '1 + 3', slidePosition: 6, slideLabel: '6th Pos', frequencyHz: 261.63 },
      { name: 'Eb4', octave: 4, concertName: 'Db4', valves: [2], valveLabel: '2nd', slidePosition: 3, slideLabel: '3rd Pos', frequencyHz: 277.18 },
      { name: 'F4', octave: 4, concertName: 'Eb4', valves: [1], valveLabel: '1st', slidePosition: 3, slideLabel: '3rd Pos', frequencyHz: 311.13 },
      { name: 'G4', octave: 4, concertName: 'F4', valves: [], valveLabel: 'Open', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 349.23 },
      { name: 'A4', octave: 4, concertName: 'G4', valves: [1, 2], valveLabel: '1 + 2', slidePosition: 4, slideLabel: '4th Pos', frequencyHz: 392.00 },
      { name: 'B4', octave: 4, concertName: 'A4', valves: [2], valveLabel: '2nd', slidePosition: 2, slideLabel: '2nd Pos', frequencyHz: 440.00 },
      { name: 'C5', octave: 5, concertName: 'Bb4', valves: [], valveLabel: 'Open', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 466.16 }
    ]
  },
  {
    id: 'scale-c-major-pentatonic',
    title: 'C Major Pentatonic Scale',
    category: 'blues-pentatonic',
    rootNote: 'C',
    instrumentKey: 'Bb',
    instrumentName: 'All Brass',
    writtenKey: 'C Major Pentatonic (1, 2, 3, 5, 6)',
    concertKey: 'Concert Bb Major Pentatonic',
    keySignature: '5 notes: C, D, E, G, A, C',
    accidentalsCount: '0 ♯/♭',
    explanation: 'The melodic backbone of hundreds of Scottish, Welsh, and Salvation Army brass folk tunes and hymns (including Amazing Grace).',
    notes: [
      { name: 'C4', octave: 4, concertName: 'Bb3', valves: [], valveLabel: 'Open', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 233.08 },
      { name: 'D4', octave: 4, concertName: 'C4', valves: [1, 3], valveLabel: '1 + 3', slidePosition: 6, slideLabel: '6th Pos', frequencyHz: 261.63 },
      { name: 'E4', octave: 4, concertName: 'D4', valves: [1, 2], valveLabel: '1 + 2', slidePosition: 4, slideLabel: '4th Pos', frequencyHz: 293.66 },
      { name: 'G4', octave: 4, concertName: 'F4', valves: [], valveLabel: 'Open', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 349.23 },
      { name: 'A4', octave: 4, concertName: 'G4', valves: [1, 2], valveLabel: '1 + 2', slidePosition: 4, slideLabel: '4th Pos', frequencyHz: 392.00 },
      { name: 'C5', octave: 5, concertName: 'Bb4', valves: [], valveLabel: 'Open', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 466.16 }
    ]
  },
  {
    id: 'scale-a-minor-pentatonic',
    title: 'A Minor Pentatonic Scale',
    category: 'blues-pentatonic',
    rootNote: 'A',
    instrumentKey: 'Bb',
    instrumentName: 'All Brass',
    writtenKey: 'A Minor Pentatonic (1, b3, 4, 5, b7)',
    concertKey: 'Concert G Minor Pentatonic',
    keySignature: '5 notes: A, C, D, E, G, A',
    accidentalsCount: '0 ♯/♭',
    explanation: 'The universally celebrated minor pentatonic. Highly expressive in brass cadenzas and lyrical cornet solos.',
    notes: [
      { name: 'A4', octave: 4, concertName: 'G4', valves: [1, 2], valveLabel: '1 + 2', slidePosition: 4, slideLabel: '4th Pos', frequencyHz: 392.00 },
      { name: 'C5', octave: 5, concertName: 'Bb4', valves: [], valveLabel: 'Open', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 466.16 },
      { name: 'D5', octave: 5, concertName: 'C5', valves: [1], valveLabel: '1st', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 523.25 },
      { name: 'E5', octave: 5, concertName: 'D5', valves: [], valveLabel: 'Open', slidePosition: 2, slideLabel: '2nd Pos', frequencyHz: 587.33 },
      { name: 'G5', octave: 5, concertName: 'F5', valves: [], valveLabel: 'Open', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 698.46 },
      { name: 'A5', octave: 5, concertName: 'G5', valves: [1, 2], valveLabel: '1 + 2', slidePosition: 2, slideLabel: '2nd Pos', frequencyHz: 783.99 }
    ]
  },
  {
    id: 'scale-c-whole-tone',
    title: 'C Whole Tone Scale (Symmetrical)',
    category: 'chromatic',
    rootNote: 'C',
    instrumentKey: 'Bb',
    instrumentName: 'All Brass',
    writtenKey: 'Whole Tone (All Whole Steps)',
    concertKey: 'Concert Bb Whole Tone',
    keySignature: 'C, D, E, F#, G#, A#, C',
    accidentalsCount: '3 ♯',
    explanation: 'Constructed entirely of whole tone intervals (2 semitones each). Widely used in 20th-century British brass test pieces by Eric Ball and Philip Wilby for mysterious atmospheric textures.',
    notes: [
      { name: 'C4', octave: 4, concertName: 'Bb3', valves: [], valveLabel: 'Open', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 233.08 },
      { name: 'D4', octave: 4, concertName: 'C4', valves: [1, 3], valveLabel: '1 + 3', slidePosition: 6, slideLabel: '6th Pos', frequencyHz: 261.63 },
      { name: 'E4', octave: 4, concertName: 'D4', valves: [1, 2], valveLabel: '1 + 2', slidePosition: 4, slideLabel: '4th Pos', frequencyHz: 293.66 },
      { name: 'F#4', octave: 4, concertName: 'E4', valves: [2], valveLabel: '2nd', slidePosition: 5, slideLabel: '5th Pos', frequencyHz: 329.63 },
      { name: 'G#4', octave: 4, concertName: 'F#4', valves: [2, 3], valveLabel: '2 + 3', slidePosition: 3, slideLabel: '3rd Pos', frequencyHz: 369.99 },
      { name: 'A#4', octave: 4, concertName: 'G#4', valves: [1], valveLabel: '1st', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 415.30 },
      { name: 'C5', octave: 5, concertName: 'Bb4', valves: [], valveLabel: 'Open', slidePosition: 1, slideLabel: '1st Pos', frequencyHz: 466.16 }
    ]
  },
  {
    id: 'scale-c-blues',
    title: 'C Blues Scale',
    category: 'blues-pentatonic',
    rootNote: 'C',
    instrumentKey: 'Bb',
    instrumentName: 'All Brass',
    writtenKey: 'C Blues (Flatted 3rd, 5th, 7th)',
    concertKey: 'Concert Bb Blues',
    keySignature: 'C, Eb, F, F#, G, Bb, C',
    accidentalsCount: 'Blue Notes',
    explanation: 'Features the famous "blue notes" (Eb, F#, Bb). Essential for Salvation Army gospel swing arrangements and jazz-influenced brass contest solos.',
    notes: [
      { name: 'C4', octave: 4, concertName: 'Bb3', valves: [], valveLabel: 'Open', slidePosition: 1, slideLabel: '1st', frequencyHz: 233.08 },
      { name: 'Eb4', octave: 4, concertName: 'Db4', valves: [2, 3], valveLabel: '2 + 3', slidePosition: 3, slideLabel: '3rd', frequencyHz: 277.18 },
      { name: 'F4', octave: 4, concertName: 'Eb4', valves: [1], valveLabel: '1st', slidePosition: 3, slideLabel: '3rd', frequencyHz: 311.13 },
      { name: 'F#4', octave: 4, concertName: 'E4', valves: [2], valveLabel: '2nd (Blue note)', slidePosition: 5, slideLabel: '5th', frequencyHz: 329.63 },
      { name: 'G4', octave: 4, concertName: 'F4', valves: [], valveLabel: 'Open', slidePosition: 1, slideLabel: '1st', frequencyHz: 349.23 },
      { name: 'Bb4', octave: 4, concertName: 'Ab4', valves: [1], valveLabel: '1st', slidePosition: 1, slideLabel: '1st', frequencyHz: 415.30 },
      { name: 'C5', octave: 5, concertName: 'Bb4', valves: [], valveLabel: 'Open', slidePosition: 1, slideLabel: '1st', frequencyHz: 466.16 }
    ]
  }
];

export const ACCIDENTAL_THEORY_ITEMS: AccidentalInfo[] = [
  {
    symbol: '♯',
    name: 'Sharp',
    semitoneShift: 1,
    effect: 'Raises the pitch by 1 semitone (half-step).',
    valveImpact: 'Requires shortening the acoustic tube: uses a shorter valve combination (e.g. from 1st valve down to 2nd valve, or from 1+2 down to 2nd).',
    tromboneImpact: 'Pull the outer slide in 1 position towards 1st position (e.g. from 6th position in to 5th position).',
    example: 'F natural (1st valve) → F sharp (2nd valve).'
  },
  {
    symbol: '♭',
    name: 'Flat',
    semitoneShift: -1,
    effect: 'Lowers the pitch by 1 semitone (half-step).',
    valveImpact: 'Requires lengthening the acoustic tube: adds 1 extra semitone of valve tubing (e.g. from open to 2nd valve, or from 2nd valve to 1st valve).',
    tromboneImpact: 'Push the outer slide out 1 position towards 7th position (e.g. from 1st position out to 2nd position).',
    example: 'B natural (2nd valve) → B flat (1st valve).'
  },
  {
    symbol: '♮',
    name: 'Natural',
    semitoneShift: 0,
    effect: 'Cancels a previous sharp or flat accidental, returning the note to its natural white-key pitch.',
    valveImpact: 'Returns valve fingering to the natural harmonic without accidental adjustment.',
    tromboneImpact: 'Returns slide to natural unsharpened/unflattened landmark position.',
    example: 'Cancels B flat back to B natural (2nd valve).'
  },
  {
    symbol: '𝄪',
    name: 'Double Sharp',
    semitoneShift: 2,
    effect: 'Raises the pitch by 2 semitones (1 whole tone).',
    valveImpact: 'Uses the fingering 2 semitones higher (e.g. F𝄪 sounds identical to G natural: open valves!).',
    tromboneImpact: 'Pull slide in 2 positions.',
    example: 'C𝄪 (sounds like D natural, 1+3 or 1st).'
  },
  {
    symbol: '𝄫',
    name: 'Double Flat',
    semitoneShift: -2,
    effect: 'Lowers the pitch by 2 semitones (1 whole tone).',
    valveImpact: 'Uses the fingering 2 semitones lower (e.g. B𝄫 sounds identical to A natural: 1+2 valves).',
    tromboneImpact: 'Push slide out 2 positions.',
    example: 'B𝄫 (sounds like A natural, 1+2).'
  }
];

export const ORDER_OF_ACCIDENTALS = {
  sharps: {
    sequence: ['F♯', 'C♯', 'G♯', 'D♯', 'A♯', 'E♯', 'B♯'],
    mnemonic: 'Father Charles Goes Down And Ends Battle',
    rule: 'The key is one semitone above the last sharp in the key signature (e.g., if last sharp is C#, the key is D Major).'
  },
  flats: {
    sequence: ['B♭', 'E♭', 'A♭', 'D♭', 'G♭', 'C♭', 'F♭'],
    mnemonic: 'Battle Ends And Down Goes Charles’ Father',
    rule: 'The key is the penultimate (second to last) flat in the key signature (e.g., key signature Bb, Eb, Ab: key is Eb Major).'
  }
};

export const ENHARMONIC_EQUIVALENTS = [
  { sharp: 'C♯ (1+2+3 or 1+2)', flat: 'D♭ (1+2+3 or 1+2)', semitonesFromC: 1, freqHz: 246.94, description: 'Identical pitch on brass. On low C#/Db, player must kick out 3rd valve trigger to correct sharp intonation!' },
  { sharp: 'D♯ (2nd valve / 3rd)', flat: 'E♭ (2nd valve / 3rd)', semitonesFromC: 3, freqHz: 277.18, description: 'Both played with 2nd valve in lower octave, or 2nd valve on 5th partial.' },
  { sharp: 'F♯ (2nd valve)', flat: 'G♭ (2nd valve)', semitonesFromC: 6, freqHz: 329.63, description: 'Tritone away from fundamental. In 6-sharp or 6-flat key signatures.' },
  { sharp: 'G♯ (2+3 valves)', flat: 'A♭ (2+3 valves)', semitonesFromC: 8, freqHz: 369.99, description: 'Always uses 2nd + 3rd valves (lowering open G by 1 semitone).' },
  { sharp: 'A♯ (1st valve)', flat: 'B♭ (1st valve)', semitonesFromC: 10, freqHz: 415.30, description: 'Always uses 1st valve (lowering open C by 2 semitones).' },
  { sharp: 'E♯ (1st valve)', flat: 'F♮ (1st valve)', semitonesFromC: 5, freqHz: 311.13, description: 'White-key enharmonic: E sharp is physically F natural!' },
  { sharp: 'B♯ (Open)', flat: 'C♮ (Open)', semitonesFromC: 0, freqHz: 233.08, description: 'White-key enharmonic: B sharp is physically C natural!' },
  { sharp: 'B♮ (2nd valve)', flat: 'C♭ (2nd valve)', semitonesFromC: 11, freqHz: 440.00, description: 'White-key enharmonic: C flat is physically B natural!' }
];

export const TRANSPOSITION_ACCIDENTALS_MATRIX = [
  { concertKey: 'C Major (0 ♯/♭)', bbBrassKey: 'D Major (2 ♯: F#, C#)', ebBrassKey: 'A Major (3 ♯: F#, C#, G#)', shiftRule: '+2 sharps for Bb, +3 sharps for Eb' },
  { concertKey: 'F Major (1 ♭: Bb)', bbBrassKey: 'G Major (1 ♯: F#)', ebBrassKey: 'D Major (2 ♯: F#, C#)', shiftRule: '1 flat cancels; Bb gains 1 sharp, Eb gains 2' },
  { concertKey: 'Bb Major (2 ♭: Bb, Eb)', bbBrassKey: 'C Major (0 ♯/♭)', ebBrassKey: 'G Major (1 ♯: F#)', shiftRule: 'Bb plays in natural C; Eb plays with 1 sharp' },
  { concertKey: 'Eb Major (3 ♭)', bbBrassKey: 'F Major (1 ♭: Bb)', ebBrassKey: 'C Major (0 ♯/♭)', shiftRule: 'Eb instruments play in natural C! Bb plays in 1 flat' },
  { concertKey: 'Ab Major (4 ♭)', bbBrassKey: 'Bb Major (2 ♭)', ebBrassKey: 'F Major (1 ♭)', shiftRule: 'Standard Salvation Army vocal score key' },
  { concertKey: 'G Major (1 ♯: F#)', bbBrassKey: 'A Major (3 ♯)', ebBrassKey: 'E Major (4 ♯)', shiftRule: 'Adds 2 sharps for Bb (3 sharps total); 3 for Eb (4 sharps total)' },
  { concertKey: 'D Major (2 ♯)', bbBrassKey: 'E Major (4 ♯)', ebBrassKey: 'B Major (5 ♯)', shiftRule: 'High-energy brass fanfare key' }
];

export const ALL_KNOWN_BRASS_SCALES: ScaleDefinition[] = [
  ...ALL_MAJOR_SCALES,
  ...CHROMATIC_AND_MINOR_SCALES
];
