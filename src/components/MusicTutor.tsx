import React, { useEffect, useRef, useState } from 'react';
import {
  Music2,
  Volume2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Sliders,
  BookOpen,
  Info,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Search
} from 'lucide-react';
import {
  Renderer,
  Stave,
  StaveNote,
  Voice,
  Formatter,
  Accidental,
} from 'vexflow';
import { brassAudio } from '../audio/brassAudio';

export type AccidentalType = 'natural' | 'sharp' | 'flat';

export type Instrument =
  | 'Eb Horn'
  | 'Trombone'
  | 'Euphonium'
  | 'Eb Bass'
  | 'BBb Bass'
  | 'Eb Soprano Cornet'
  | 'Bb Cornet'
  | 'Bb Trumpet';

export interface NoteData {
  name: string;
  octave: number;
  vexKey: string;
  clefKey?: string;
}

export interface DetailedFingeringInfo {
  primary: string;
  alternate?: string;
  valves: number[]; // e.g. [1, 2], [1, 3], [4], [2, 4], []
  altValves?: number[];
  slidePosition?: number;
  slideLabel?: string;
  altSlidePosition?: number;
  altSlideLabel?: string;
  soundingConcertPitch: string;
  harmonicPartial: number;
  intonationNote?: string;
  techniqueAdvice?: string;
}

/* =========================================================
   WRITTEN NOTES (Treble Clef Stave Range)
   ========================================================= */

const NOTES: NoteData[] = [
  // Low Register (Foundational for Basses, Euphonium, Trombone, Horn)
  { name: 'F', octave: 3, vexKey: 'f/3' },
  { name: 'G', octave: 3, vexKey: 'g/3' },
  { name: 'A', octave: 3, vexKey: 'a/3' },
  { name: 'B', octave: 3, vexKey: 'b/3' },

  // Middle & Singing Register
  { name: 'C', octave: 4, vexKey: 'c/4' },
  { name: 'D', octave: 4, vexKey: 'd/4' },
  { name: 'E', octave: 4, vexKey: 'e/4' },
  { name: 'F', octave: 4, vexKey: 'f/4' },
  { name: 'G', octave: 4, vexKey: 'g/4' },
  { name: 'A', octave: 4, vexKey: 'a/4' },
  { name: 'B', octave: 4, vexKey: 'b/4' },

  // High Register
  { name: 'C', octave: 5, vexKey: 'c/5' },
  { name: 'D', octave: 5, vexKey: 'd/5' },
  { name: 'E', octave: 5, vexKey: 'e/5' },
  { name: 'F', octave: 5, vexKey: 'f/5' },
  { name: 'G', octave: 5, vexKey: 'g/5' },
  { name: 'A', octave: 5, vexKey: 'a/5' },
  { name: 'B', octave: 5, vexKey: 'b/5' },
  { name: 'C', octave: 6, vexKey: 'c/6' },
];

export interface InstrumentOption {
  id: Instrument;
  label: string;
  icon: string;
  subtitle: string;
  badge: string;
}

export const INSTRUMENT_OPTIONS: InstrumentOption[] = [
  { id: 'Eb Horn', label: 'E♭ Horn', icon: '📯', subtitle: 'Tenor Horn in E♭', badge: 'Treble Clef' },
  { id: 'Trombone', label: 'Trombone', icon: '📏', subtitle: '7 Slide Positions', badge: 'B♭ Treble Clef' },
  { id: 'Euphonium', label: 'Euphonium', icon: '🎺', subtitle: '3 & 4-Valve Compensating', badge: 'B♭ Treble Clef' },
  { id: 'Eb Bass', label: 'E♭ Bass', icon: '🐘', subtitle: 'EE♭ Tuba (4-Valve)', badge: 'E♭ Treble Clef' },
  { id: 'BBb Bass', label: 'BB♭ Bass', icon: '🌋', subtitle: 'BB♭ Tuba (Sub-Bass)', badge: 'B♭ Treble Clef' },
  { id: 'Eb Soprano Cornet', label: 'Soprano Cornet', icon: '👑', subtitle: 'High E♭ Register', badge: 'E♭ Treble Clef' },
  { id: 'Bb Cornet', label: 'B♭ Cornet', icon: '🎺', subtitle: 'Standard Band Voice', badge: 'B♭ Treble Clef' },
];

/* =========================================================
   NATURAL NOTE SEMITONES FROM C
   ========================================================= */

const NATURAL_SEMITONES: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

/* =========================================================
   INSTRUMENT METADATA
   ========================================================= */

const instrumentClefs: Record<Instrument, string> = {
  'Eb Horn': 'treble',
  'Trombone': 'treble',
  'Euphonium': 'treble',
  'Eb Bass': 'treble',
  'BBb Bass': 'treble',
  'Eb Soprano Cornet': 'treble',
  'Bb Cornet': 'treble',
  'Bb Trumpet': 'treble',
};

const instrumentDescriptions: Record<Instrument, string> = {
  'Eb Horn': 'E♭ Tenor Horn (reads Treble Clef, sounds Major 6th lower)',
  'Trombone': 'Tenor Trombone (British Brass Band Treble Clef in B♭, 7 slide positions)',
  'Euphonium': 'B♭ Euphonium & Baritone (Treble Clef, 3-valve & 4-valve compensating)',
  'Eb Bass': 'E♭ Bass / EE♭ Tuba (Treble Clef, sounds Octave + Major 6th lower)',
  'BBb Bass': 'BB♭ Bass / BB♭ Tuba (Treble Clef, colossal sub-bass down 2 octaves + M2)',
  'Eb Soprano Cornet': 'E♭ Soprano Cornet (Treble Clef, high register sounds Minor 3rd higher)',
  'Bb Cornet': 'B♭ Cornet & Flugelhorn (Treble Clef standard, sounds Major 2nd lower)',
  'Bb Trumpet': 'B♭ Trumpet / Cornet (Treble Clef standard)',
};

const instrumentTimbreMap: Record<Instrument, 'cornet' | 'horn' | 'euphonium' | 'bass' | 'trombone'> = {
  'Eb Horn': 'horn',
  'Trombone': 'trombone',
  'Euphonium': 'euphonium',
  'Eb Bass': 'bass',
  'BBb Bass': 'bass',
  'Eb Soprano Cornet': 'cornet',
  'Bb Cornet': 'cornet',
  'Bb Trumpet': 'cornet',
};

/* =========================================================
   ACCIDENTAL DISPLAY HELPERS
   ========================================================= */

const getAccidentalSymbol = (accidental: AccidentalType): string => {
  if (accidental === 'sharp') return '♯';
  if (accidental === 'flat') return '♭';
  return '♮';
};

const getPitchClass = (note: NoteData, accidental: AccidentalType): number => {
  let pitch = NATURAL_SEMITONES[note.name];
  if (accidental === 'sharp') pitch += 1;
  if (accidental === 'flat') pitch -= 1;
  return ((pitch % 12) + 12) % 12;
};

const getDisplayName = (note: NoteData, accidental: AccidentalType): string => {
  const symbol = accidental === 'natural' ? '' : getAccidentalSymbol(accidental);
  return `${note.name}${symbol}${note.octave}`;
};

/* =========================================================
   ACCURATE FINGERING DATABASE (ACCORDING TO INSTRUMENT)
   ========================================================= */

export const getDetailedFingering = (
  note: NoteData,
  accidental: AccidentalType,
  instrument: Instrument
): DetailedFingeringInfo => {
  const isSharp = accidental === 'sharp';
  const isFlat = accidental === 'flat';
  const noteKey = `${note.name}${note.octave}`;

  // Helper for Sounding Concert Pitch calculation
  const getConcertPitchName = (inst: Instrument): string => {
    const pitchNames = ['C', 'C♯/D♭', 'D', 'D♯/E♭', 'E', 'F', 'F♯/G♭', 'G', 'G♯/A♭', 'A', 'B♭', 'B'];
    const pClass = getPitchClass(note, accidental);
    let shift = 0;
    let oct = note.octave;

    switch (inst) {
      case 'Bb Cornet':
      case 'Bb Trumpet':
        shift = -2; // down M2
        if (pClass < 2) oct -= 1;
        break;
      case 'Eb Soprano Cornet':
        shift = 3; // up m3
        if (pClass >= 9) oct += 1;
        break;
      case 'Eb Horn':
        shift = -9; // down M6
        oct -= 1;
        if (pClass < 9) oct -= 1;
        break;
      case 'Euphonium':
      case 'Trombone':
        shift = -14; // down M9 (octave + 2 semitones)
        oct -= 1;
        if (pClass < 2) oct -= 1;
        break;
      case 'Eb Bass':
        shift = -21; // down Octave + M6
        oct -= 2;
        if (pClass < 9) oct -= 1;
        break;
      case 'BBb Bass':
        shift = -26; // down 2 Octaves + M2
        oct -= 2;
        if (pClass < 2) oct -= 1;
        break;
    }

    const concertClass = ((pClass + shift) % 12 + 12) % 12;
    return `${pitchNames[concertClass]}${oct}`;
  };

  const soundingPitch = getConcertPitchName(instrument);

  /* -----------------------------------------------------------
     TROMBONE (Slide Positions)
     ----------------------------------------------------------- */
  if (instrument === 'Trombone') {
    // Treble Clef in Bb (Brass Band standard)
    if (noteKey === 'F3') {
      if (isSharp) return { primary: '7th Position (Full stretch)', alternate: 'Trigger 2nd Pos (low B concert)', valves: [], slidePosition: 7, slideLabel: '7th Pos (Full arm reach)', altSlidePosition: 2, altSlideLabel: 'Trigger 2nd', soundingConcertPitch: soundingPitch, harmonicPartial: 2, intonationNote: 'Lowest normal note on straight tenor trombone. Full slide extension!' };
      if (isFlat) return { primary: 'Trigger 1st Pos', valves: [], slidePosition: 1, slideLabel: 'Trigger 1st', soundingConcertPitch: soundingPitch, harmonicPartial: 1 };
      return { primary: '6th Position', alternate: 'Trigger 1st Pos (F-attachment)', valves: [], slidePosition: 6, slideLabel: '6th Pos (Full reach)', altSlidePosition: 1, altSlideLabel: 'Trigger 1st', soundingConcertPitch: soundingPitch, harmonicPartial: 2, intonationNote: 'Use F-attachment trigger 1st pos to avoid full reach stretch!' };
    }
    if (noteKey === 'G3') {
      if (isSharp) return { primary: '5th Position', alternate: 'Trigger 2nd Pos', valves: [], slidePosition: 5, slideLabel: '5th Pos (~15" out)', altSlidePosition: 2, altSlideLabel: 'Trigger 2nd', soundingConcertPitch: soundingPitch, harmonicPartial: 2 };
      if (isFlat) return { primary: '7th Position', alternate: 'Trigger 2nd Pos', valves: [], slidePosition: 7, slideLabel: '7th Pos (Full reach)', soundingConcertPitch: soundingPitch, harmonicPartial: 2 };
      return { primary: '6th Position', alternate: 'Trigger 1st Pos (F-attachment)', valves: [], slidePosition: 6, slideLabel: '6th Pos (Past bell)', altSlidePosition: 1, altSlideLabel: 'Trigger 1st', soundingConcertPitch: soundingPitch, harmonicPartial: 2, intonationNote: 'Deep warm resonant lower register.' };
    }
    if (noteKey === 'A3') {
      if (isSharp) return { primary: '3rd Position', alternate: 'Trigger 4th Pos', valves: [], slidePosition: 3, slideLabel: '3rd Pos (Bell rim)', soundingConcertPitch: soundingPitch, harmonicPartial: 2 };
      if (isFlat) return { primary: '5th Position', valves: [], slidePosition: 5, slideLabel: '5th Pos', soundingConcertPitch: soundingPitch, harmonicPartial: 2 };
      return { primary: '4th Position', alternate: 'Trigger 3rd Pos', valves: [], slidePosition: 4, slideLabel: '4th Pos', altSlidePosition: 3, altSlideLabel: 'Trigger 3rd', soundingConcertPitch: soundingPitch, harmonicPartial: 2, intonationNote: '4th position is just past the bell flare.' };
    }
    if (noteKey === 'B3') {
      if (isSharp) return { primary: '1st Position (Closed)', valves: [], slidePosition: 1, slideLabel: '1st Pos', soundingConcertPitch: soundingPitch, harmonicPartial: 2 };
      if (isFlat) return { primary: '3rd Position', valves: [], slidePosition: 3, slideLabel: '3rd Pos (Bell rim)', soundingConcertPitch: soundingPitch, harmonicPartial: 2 };
      return { primary: '2nd Position', alternate: 'Trigger 5th Pos', valves: [], slidePosition: 2, slideLabel: '2nd Pos (~3.25" out)', soundingConcertPitch: soundingPitch, harmonicPartial: 2, intonationNote: 'Leading tone down to pedal register.' };
    }
    if (noteKey === 'C4') {
      if (isSharp) return { primary: '5th Position', alternate: 'Trigger 2nd Pos', valves: [], slidePosition: 5, slideLabel: '5th Pos (~15" out)', soundingConcertPitch: soundingPitch, harmonicPartial: 2, intonationNote: 'Slide slightly sharp' };
      if (isFlat) return { primary: '2nd Position', valves: [], slidePosition: 2, slideLabel: '2nd Pos (~3.25" out)', soundingConcertPitch: soundingPitch, harmonicPartial: 2 };
      return { primary: '1st Position (Closed)', valves: [], slidePosition: 1, slideLabel: '1st Pos (Closed bumper)', soundingConcertPitch: soundingPitch, harmonicPartial: 2, intonationNote: 'Fundamental 2nd partial' };
    }
    if (noteKey === 'D4') {
      if (isSharp) return { primary: '3rd Position', valves: [], slidePosition: 3, slideLabel: '3rd Pos (Bell rim)', soundingConcertPitch: soundingPitch, harmonicPartial: 2 };
      if (isFlat) return { primary: '5th Position', alternate: 'Trigger 2nd Pos', valves: [], slidePosition: 5, slideLabel: '5th Pos', soundingConcertPitch: soundingPitch, harmonicPartial: 2 };
      return { primary: '6th Position (Full reach)', alternate: 'Trigger 1st Pos (F-attachment)', valves: [], slidePosition: 6, slideLabel: '6th Pos (Full reach)', altSlidePosition: 1, altSlideLabel: 'Trigger 1st', soundingConcertPitch: soundingPitch, harmonicPartial: 2, intonationNote: 'Use F-attachment 1st pos to avoid full reach stretch!' };
    }
    if (noteKey === 'E4') {
      if (isSharp) return { primary: '1st Position', valves: [], slidePosition: 1, slideLabel: '1st Pos (Closed)', soundingConcertPitch: soundingPitch, harmonicPartial: 2 };
      if (isFlat) return { primary: '3rd Position', valves: [], slidePosition: 3, slideLabel: '3rd Pos (Bell rim)', soundingConcertPitch: soundingPitch, harmonicPartial: 2 };
      return { primary: '4th Position', valves: [], slidePosition: 4, slideLabel: '4th Pos (Past bell flare)', soundingConcertPitch: soundingPitch, harmonicPartial: 2 };
    }
    if (noteKey === 'F4') {
      if (isSharp) return { primary: '2nd Position', valves: [], slidePosition: 2, slideLabel: '2nd Pos (~3.25" out)', soundingConcertPitch: soundingPitch, harmonicPartial: 2 };
      if (isFlat) return { primary: '4th Position', valves: [], slidePosition: 4, slideLabel: '4th Pos', soundingConcertPitch: soundingPitch, harmonicPartial: 2 };
      return { primary: '1st Position (Closed)', alternate: '6th Position (3rd partial)', valves: [], slidePosition: 1, slideLabel: '1st Pos (Closed)', altSlidePosition: 6, altSlideLabel: '6th Pos', soundingConcertPitch: soundingPitch, harmonicPartial: 2 };
    }
    if (noteKey === 'G4') {
      if (isSharp) return { primary: '3rd Position', valves: [], slidePosition: 3, slideLabel: '3rd Pos (Bell rim)', soundingConcertPitch: soundingPitch, harmonicPartial: 3 };
      if (isFlat) return { primary: '2nd Position', valves: [], slidePosition: 2, slideLabel: '2nd Pos', soundingConcertPitch: soundingPitch, harmonicPartial: 2 };
      return { primary: '1st Position (Closed)', alternate: '4th Position (Alternate partial)', valves: [], slidePosition: 1, slideLabel: '1st Pos (Closed)', altSlidePosition: 4, altSlideLabel: '4th Pos', soundingConcertPitch: soundingPitch, harmonicPartial: 3, intonationNote: 'Use 4th position when moving from 5th/6th to avoid long slide travel!' };
    }
    if (noteKey === 'A4') {
      if (isSharp) return { primary: '1st Position', valves: [], slidePosition: 1, slideLabel: '1st Pos (Closed)', soundingConcertPitch: soundingPitch, harmonicPartial: 3 };
      if (isFlat) return { primary: '3rd Position', valves: [], slidePosition: 3, slideLabel: '3rd Pos (Bell rim)', soundingConcertPitch: soundingPitch, harmonicPartial: 3 };
      return { primary: '4th Position', alternate: '2nd Position (Sharp 7th P)', valves: [], slidePosition: 4, slideLabel: '4th Pos (Past bell)', altSlidePosition: 2, altSlideLabel: 'Sharp 2nd Pos', soundingConcertPitch: soundingPitch, harmonicPartial: 3 };
    }
    if (noteKey === 'B4') {
      if (isSharp) return { primary: '1st Position', valves: [], slidePosition: 1, slideLabel: '1st Pos', soundingConcertPitch: soundingPitch, harmonicPartial: 4 };
      if (isFlat) return { primary: '1st Position', valves: [], slidePosition: 1, slideLabel: '1st Pos (Closed)', soundingConcertPitch: soundingPitch, harmonicPartial: 3 };
      return { primary: '2nd Position', valves: [], slidePosition: 2, slideLabel: '2nd Pos (~3.25" out)', soundingConcertPitch: soundingPitch, harmonicPartial: 3, intonationNote: 'Pull in slightly for sweet major third tuning' };
    }
    if (noteKey === 'C5') {
      if (isSharp) return { primary: '2nd Position', alternate: '5th Position', valves: [], slidePosition: 2, slideLabel: '2nd Pos', altSlidePosition: 5, altSlideLabel: '5th Pos', soundingConcertPitch: soundingPitch, harmonicPartial: 4 };
      if (isFlat) return { primary: '2nd Position', valves: [], slidePosition: 2, slideLabel: '2nd Pos', soundingConcertPitch: soundingPitch, harmonicPartial: 3 };
      return { primary: '1st Position (Closed)', alternate: '5th Position (Sharp 5th partial)', valves: [], slidePosition: 1, slideLabel: '1st Pos (Closed)', altSlidePosition: 5, altSlideLabel: '5th Pos', soundingConcertPitch: soundingPitch, harmonicPartial: 4, intonationNote: 'Core resonant tenor register' };
    }
    if (noteKey === 'D5') {
      if (isSharp) return { primary: '2nd Position', valves: [], slidePosition: 2, slideLabel: '2nd Pos', soundingConcertPitch: soundingPitch, harmonicPartial: 4 };
      if (isFlat) return { primary: '2nd Position', valves: [], slidePosition: 2, slideLabel: '2nd Pos', soundingConcertPitch: soundingPitch, harmonicPartial: 4 };
      return { primary: '3rd Position (Bell rim)', alternate: '1st Position (6th partial)', valves: [], slidePosition: 3, slideLabel: '3rd Pos (Bell rim)', altSlidePosition: 1, altSlideLabel: 'High 1st Pos', soundingConcertPitch: soundingPitch, harmonicPartial: 4, intonationNote: 'Standard 3rd pos; 1st pos on 6th partial is a great alternate!' };
    }
    if (noteKey === 'E5') {
      if (isSharp) return { primary: '3rd Position', valves: [], slidePosition: 3, slideLabel: '3rd Pos', soundingConcertPitch: soundingPitch, harmonicPartial: 5 };
      if (isFlat) return { primary: '2nd Position', valves: [], slidePosition: 2, slideLabel: '2nd Pos', soundingConcertPitch: soundingPitch, harmonicPartial: 4 };
      return { primary: '1st Position (Closed)', alternate: '4th Position (In-tune alternate)', valves: [], slidePosition: 1, slideLabel: '1st Pos (Closed)', altSlidePosition: 4, altSlideLabel: '4th Pos', soundingConcertPitch: soundingPitch, harmonicPartial: 5, intonationNote: '5th partial in 1st pos is naturally flat! 4th position is often more in tune.' };
    }
    if (noteKey === 'F5') {
      if (isSharp) return { primary: '2nd Position', valves: [], slidePosition: 2, slideLabel: '2nd Pos', soundingConcertPitch: soundingPitch, harmonicPartial: 5 };
      if (isFlat) return { primary: '1st Position', valves: [], slidePosition: 1, slideLabel: '1st Pos', soundingConcertPitch: soundingPitch, harmonicPartial: 5 };
      return { primary: '3rd Position', alternate: '1st Position (High 6th partial)', valves: [], slidePosition: 3, slideLabel: '3rd Pos (High)', altSlidePosition: 1, altSlideLabel: 'High 1st Pos', soundingConcertPitch: soundingPitch, harmonicPartial: 5 };
    }
    if (noteKey === 'G5') {
      if (isSharp) return { primary: '3rd Position', valves: [], slidePosition: 3, slideLabel: '3rd Pos', soundingConcertPitch: soundingPitch, harmonicPartial: 6 };
      if (isFlat) return { primary: '2nd Position', valves: [], slidePosition: 2, slideLabel: '2nd Pos', soundingConcertPitch: soundingPitch, harmonicPartial: 5 };
      return { primary: '1st Position (Closed)', alternate: '4th Position', valves: [], slidePosition: 1, slideLabel: '1st Pos (Closed 6th P)', altSlidePosition: 4, altSlideLabel: '4th Pos', soundingConcertPitch: soundingPitch, harmonicPartial: 6, intonationNote: '6th partial is slightly sharp; let slide breathe out 1/2 inch.' };
    }
    if (noteKey === 'A5') {
      return { primary: '2nd Position', alternate: '4th Position', valves: [], slidePosition: 2, slideLabel: '2nd Pos', altSlidePosition: 4, altSlideLabel: '4th Pos', soundingConcertPitch: soundingPitch, harmonicPartial: 6 };
    }
    if (noteKey === 'B5') {
      return { primary: '2nd Position', valves: [], slidePosition: 2, slideLabel: '2nd Pos', soundingConcertPitch: soundingPitch, harmonicPartial: 7 };
    }
    if (noteKey === 'C6') {
      return { primary: '1st Position (Closed)', valves: [], slidePosition: 1, slideLabel: '1st Pos (8th Partial)', soundingConcertPitch: soundingPitch, harmonicPartial: 8, intonationNote: 'Octave peak of trombone range!' };
    }
  }

  /* -----------------------------------------------------------
     VALVED INSTRUMENTS (Eb Horn, Euphonium, Eb Bass, BBb Bass, Soprano Cornet, Bb Cornet)
     All read Treble Clef!
     4-valve compensating instruments (Euphonium, Eb Bass, BBb Bass)
     have dedicated 4th valve alternates.
     ----------------------------------------------------------- */
  const isFourValve = instrument === 'Euphonium' || instrument === 'Eb Bass' || instrument === 'BBb Bass';

  if (noteKey === 'F3') {
    if (isSharp) {
      if (isFourValve) {
        return {
          primary: '1 + 2 + 3',
          alternate: '2 + 4 (Compensating)',
          valves: [1, 2, 3],
          altValves: [2, 4],
          soundingConcertPitch: soundingPitch,
          harmonicPartial: 2,
          intonationNote: '1+2+3 is very sharp. 2+4 on 4-valve compensating Euphonium and Basses delivers dead-center intonation!',
          techniqueAdvice: 'Foundational lower note.'
        };
      }
      return {
        primary: '1 + 2 + 3',
        alternate: 'Kick 3rd slide out all the way',
        valves: [1, 2, 3],
        soundingConcertPitch: soundingPitch,
        harmonicPartial: 2,
        intonationNote: 'Lowest normal note on 3-valve brass. Push 3rd valve slide out fully!',
        techniqueAdvice: 'Firm embouchure corners, relaxed jaw.'
      };
    }
    if (isFlat) {
      return { primary: '4th valve', valves: [4], soundingConcertPitch: soundingPitch, harmonicPartial: 1 };
    }
    if (isFourValve) {
      return {
        primary: '4th Valve (or 1+4)',
        alternate: '1 + 4 (Compensating low F)',
        valves: [4],
        altValves: [1, 4],
        soundingConcertPitch: soundingPitch,
        harmonicPartial: 2,
        intonationNote: '4-valve instruments speak easily on low F.',
        techniqueAdvice: 'Large, steady breath volume.'
      };
    }
    return {
      primary: 'Pedal F (Loose)',
      valves: [],
      soundingConcertPitch: soundingPitch,
      harmonicPartial: 1,
      intonationNote: 'False tone / pedal register on 3-valve brass.'
    };
  }

  if (noteKey === 'G3') {
    if (isSharp) {
      return {
        primary: '2 + 3',
        valves: [2, 3],
        soundingConcertPitch: soundingPitch,
        harmonicPartial: 2,
        intonationNote: 'Low G♯ / A♭. Warm resonant response.'
      };
    }
    if (isFlat) {
      if (isFourValve) {
        return {
          primary: '1 + 2 + 3',
          alternate: '2 + 4 (Compensating)',
          valves: [1, 2, 3],
          altValves: [2, 4],
          soundingConcertPitch: soundingPitch,
          harmonicPartial: 2,
          intonationNote: 'Use 2+4 on 4-valve instruments.'
        };
      }
      return {
        primary: '1 + 2 + 3',
        valves: [1, 2, 3],
        soundingConcertPitch: soundingPitch,
        harmonicPartial: 2,
        intonationNote: 'Extend 3rd valve slide.'
      };
    }
    if (isFourValve) {
      return {
        primary: '1 + 3',
        alternate: '4th Valve alone (True Intonation!)',
        valves: [1, 3],
        altValves: [4],
        soundingConcertPitch: soundingPitch,
        harmonicPartial: 2,
        intonationNote: '1+3 is naturally 18 cents sharp. 4th valve alone fixes this completely on 4-valve Euphonium, E♭ Bass & BB♭ Bass!',
        techniqueAdvice: '4th valve replaces 1+3 across all 4-valve brass.'
      };
    }
    return {
      primary: '1 + 3',
      alternate: 'Extend 3rd slide ~1/2 inch',
      valves: [1, 3],
      soundingConcertPitch: soundingPitch,
      harmonicPartial: 2,
      intonationNote: 'Low G below middle C. Push 3rd valve slide out to prevent sharp pitch.',
      techniqueAdvice: 'Steady warm airflow.'
    };
  }

  if (noteKey === 'A3') {
    if (isSharp) {
      return {
        primary: '1st valve',
        valves: [1],
        soundingConcertPitch: soundingPitch,
        harmonicPartial: 2,
        intonationNote: 'Low A♯ / B♭ below middle C.'
      };
    }
    if (isFlat) {
      return {
        primary: '2 + 3',
        valves: [2, 3],
        soundingConcertPitch: soundingPitch,
        harmonicPartial: 2,
        intonationNote: 'Low A♭.'
      };
    }
    return {
      primary: '1 + 2',
      alternate: '3rd valve alone',
      valves: [1, 2],
      altValves: [3],
      soundingConcertPitch: soundingPitch,
      harmonicPartial: 2,
      intonationNote: 'Low A. 3rd valve alone is a useful alternate in rapid passages.',
      techniqueAdvice: 'Open oral cavity ("Ah").'
    };
  }

  if (noteKey === 'B3') {
    if (isSharp) {
      return {
        primary: 'Open (0)',
        valves: [],
        soundingConcertPitch: soundingPitch,
        harmonicPartial: 2,
        intonationNote: 'Enharmonically sounds Middle C (C4).'
      };
    }
    if (isFlat) {
      return {
        primary: '1st valve',
        valves: [1],
        soundingConcertPitch: soundingPitch,
        harmonicPartial: 2,
        intonationNote: 'Low B♭ below middle C.'
      };
    }
    return {
      primary: '2nd valve',
      valves: [2],
      soundingConcertPitch: soundingPitch,
      harmonicPartial: 2,
      intonationNote: 'Low B natural right below middle C.',
      techniqueAdvice: 'Clean tonguing response.'
    };
  }

  if (noteKey === 'C4') {
    if (isSharp) {
      if (isFourValve) {
        return {
          primary: '1 + 2 + 3',
          alternate: '2 + 4 (Compensating)',
          valves: [1, 2, 3],
          altValves: [2, 4],
          soundingConcertPitch: soundingPitch,
          harmonicPartial: 2,
          intonationNote: '1+2+3 is very sharp. Use 2+4 on 4-valve compensating horn for true pitch!',
          techniqueAdvice: '2+4 engages compensating loops for immediate clarity.'
        };
      }
      return {
        primary: '1 + 2 + 3',
        alternate: 'Extend 3rd valve trigger fully',
        valves: [1, 2, 3],
        soundingConcertPitch: soundingPitch,
        harmonicPartial: 2,
        intonationNote: 'Naturally 25–30 cents sharp! Kick 3rd slide trigger out or drop jaw.',
        techniqueAdvice: 'Warm, slow air column helps pitch center downward.'
      };
    }
    if (isFlat) {
      return { primary: '2nd valve', valves: [2], soundingConcertPitch: soundingPitch, harmonicPartial: 2, intonationNote: 'Physically sounds B3' };
    }
    return {
      primary: 'Open (0)',
      valves: [],
      soundingConcertPitch: soundingPitch,
      harmonicPartial: 2,
      intonationNote: 'Fundamental 2nd partial. Core baseline reference note.',
      techniqueAdvice: 'Clean open resonance; no valves depressed.'
    };
  }

  if (noteKey === 'D4') {
    if (isSharp) {
      return { primary: '2 + 3', valves: [2, 3], soundingConcertPitch: soundingPitch, harmonicPartial: 2, intonationNote: 'Bottom space D♯ / E♭; dark and warm.' };
    }
    if (isFlat) {
      if (isFourValve) {
        return { primary: '1 + 2 + 3', alternate: '2 + 4 (Compensating)', valves: [1, 2, 3], altValves: [2, 4], soundingConcertPitch: soundingPitch, harmonicPartial: 2, intonationNote: 'Use 2+4 for pure intonation.' };
      }
      return { primary: '1 + 2 + 3', valves: [1, 2, 3], soundingConcertPitch: soundingPitch, harmonicPartial: 2, intonationNote: 'Extend 3rd slide trigger out.' };
    }
    // D4 natural
    if (isFourValve) {
      return {
        primary: '1 + 3',
        alternate: '4th Valve alone (In-tune!)',
        valves: [1, 3],
        altValves: [4],
        soundingConcertPitch: soundingPitch,
        harmonicPartial: 2,
        intonationNote: '1+3 is 18 cents sharp. Press 4th valve alone for pristine pitch in slow melodies!',
        techniqueAdvice: '4th valve replaces 1+3 across all 4-valve brass instruments.'
      };
    }
    return {
      primary: '1 + 3',
      alternate: 'Extend 3rd slide trigger ~1/3 inch',
      valves: [1, 3],
      soundingConcertPitch: soundingPitch,
      harmonicPartial: 2,
      intonationNote: 'Inherently sharp. Use 3rd valve slide trigger on cornet/horn.',
      techniqueAdvice: 'Under first line of staff.'
    };
  }

  if (noteKey === 'E4') {
    if (isSharp) {
      return { primary: '1st valve', valves: [1], soundingConcertPitch: soundingPitch, harmonicPartial: 2, intonationNote: 'Enharmonically sounds F4' };
    }
    if (isFlat) {
      return { primary: '2 + 3', valves: [2, 3], soundingConcertPitch: soundingPitch, harmonicPartial: 2, intonationNote: '1st line space E♭; rich tone.' };
    }
    return {
      primary: '1 + 2',
      alternate: '3rd valve alone',
      valves: [1, 2],
      altValves: [3],
      soundingConcertPitch: soundingPitch,
      harmonicPartial: 2,
      intonationNote: '1st line of staff. 3rd valve alone is a useful alternate in fast chromatic runs.',
      techniqueAdvice: 'Stable harmonic core.'
    };
  }

  if (noteKey === 'F4') {
    if (isSharp) {
      return { primary: '2nd valve', valves: [2], soundingConcertPitch: soundingPitch, harmonicPartial: 2, intonationNote: '2nd line F♯; bright leading tone.' };
    }
    if (isFlat) {
      return { primary: '1 + 2', valves: [1, 2], soundingConcertPitch: soundingPitch, harmonicPartial: 2, intonationNote: 'Enharmonically sounds E4' };
    }
    return {
      primary: '1st valve',
      valves: [1],
      soundingConcertPitch: soundingPitch,
      harmonicPartial: 2,
      intonationNote: '1st space F on treble staff. Clean and centered.',
      techniqueAdvice: 'Fast tongue release.'
    };
  }

  if (noteKey === 'G4') {
    if (isSharp) {
      return { primary: '2 + 3', valves: [2, 3], soundingConcertPitch: soundingPitch, harmonicPartial: 3, intonationNote: '2nd space G♯ / A♭ on staff.' };
    }
    if (isFlat) {
      return { primary: '2nd valve', valves: [2], soundingConcertPitch: soundingPitch, harmonicPartial: 2, intonationNote: 'Enharmonically F♯4' };
    }
    return {
      primary: 'Open (0)',
      valves: [],
      soundingConcertPitch: soundingPitch,
      harmonicPartial: 3,
      intonationNote: '3rd harmonic fundamental open note. Completely stable and ringing.',
      techniqueAdvice: '2nd line G.'
    };
  }

  if (noteKey === 'A4') {
    if (isSharp) {
      return { primary: '1st valve', valves: [1], soundingConcertPitch: soundingPitch, harmonicPartial: 3, intonationNote: '3rd line A♯ / B♭ on staff.' };
    }
    if (isFlat) {
      return { primary: '2 + 3', valves: [2, 3], soundingConcertPitch: soundingPitch, harmonicPartial: 3, intonationNote: '2nd space A♭.' };
    }
    return {
      primary: '1 + 2',
      alternate: '3rd valve alone',
      valves: [1, 2],
      altValves: [3],
      soundingConcertPitch: soundingPitch,
      harmonicPartial: 3,
      intonationNote: '2nd space A. 3rd valve is useful for trills with B♭.',
      techniqueAdvice: 'Rhythmic off-beats on horn; melodic lines on cornet/euph.'
    };
  }

  if (noteKey === 'B4') {
    if (isSharp) {
      return { primary: 'Open (0)', valves: [], soundingConcertPitch: soundingPitch, harmonicPartial: 4, intonationNote: 'Enharmonically C5' };
    }
    if (isFlat) {
      return { primary: '1st valve', valves: [1], soundingConcertPitch: soundingPitch, harmonicPartial: 3, intonationNote: '3rd line B♭ on staff. Very common key note.' };
    }
    return {
      primary: '2nd valve',
      valves: [2],
      soundingConcertPitch: soundingPitch,
      harmonicPartial: 3,
      intonationNote: '3rd line B natural. Leading tone to C5.',
      techniqueAdvice: 'Smooth finger transition.'
    };
  }

  if (noteKey === 'C5') {
    if (isSharp) {
      return {
        primary: '1 + 2',
        alternate: '2 + 3 (flatter alternate)',
        valves: [1, 2],
        altValves: [2, 3],
        soundingConcertPitch: soundingPitch,
        harmonicPartial: 4,
        intonationNote: '1+2 on 4th partial is nicely in-tune. 2+3 can be used if slightly sharp.',
        techniqueAdvice: '4th line C♯ on treble staff.'
      };
    }
    if (isFlat) {
      return { primary: '2nd valve', valves: [2], soundingConcertPitch: soundingPitch, harmonicPartial: 3, intonationNote: 'Enharmonically B4' };
    }
    return {
      primary: 'Open (0)',
      valves: [],
      soundingConcertPitch: soundingPitch,
      harmonicPartial: 4,
      intonationNote: '4th partial open note. True center of singing cantabile range.',
      techniqueAdvice: '3rd space C on treble staff.'
    };
  }

  if (noteKey === 'D5') {
    if (isSharp) {
      return { primary: '2nd valve', valves: [2], soundingConcertPitch: soundingPitch, harmonicPartial: 4, intonationNote: '4th space D♯ / E♭ on staff.' };
    }
    if (isFlat) {
      return { primary: '1 + 2', alternate: '2 + 3', valves: [1, 2], altValves: [2, 3], soundingConcertPitch: soundingPitch, harmonicPartial: 4, intonationNote: '4th line D♭.' };
    }
    return {
      primary: '1st valve',
      alternate: '1 + 2 (6th partial)',
      valves: [1],
      altValves: [1, 2],
      soundingConcertPitch: soundingPitch,
      harmonicPartial: 4,
      intonationNote: '4th line D on staff. 1st valve is standard; 1+2 on 6th partial is a great alternate!',
      techniqueAdvice: 'Firm support.'
    };
  }

  if (noteKey === 'E5') {
    if (isSharp) {
      return { primary: '1st valve', valves: [1], soundingConcertPitch: soundingPitch, harmonicPartial: 5, intonationNote: 'Top line F' };
    }
    if (isFlat) {
      return { primary: '2nd valve', valves: [2], soundingConcertPitch: soundingPitch, harmonicPartial: 4, intonationNote: '4th space E♭ on staff. Clean and centered.' };
    }
    return {
      primary: 'Open (0)',
      alternate: '1 + 2 (Fixes 14 cents flat 5th partial)',
      valves: [],
      altValves: [1, 2],
      soundingConcertPitch: soundingPitch,
      harmonicPartial: 5,
      intonationNote: 'Open 5th partial is naturally 14 cents flat! Use 1+2 on 6th partial for in-tune chord harmony.',
      techniqueAdvice: 'Support with fast air velocity.'
    };
  }

  if (noteKey === 'F5') {
    if (isSharp) {
      return { primary: '2nd valve', valves: [2], soundingConcertPitch: soundingPitch, harmonicPartial: 5, intonationNote: 'Top line F♯.' };
    }
    if (isFlat) {
      return { primary: 'Open (0)', alternate: '1 + 2', valves: [], altValves: [1, 2], soundingConcertPitch: soundingPitch, harmonicPartial: 5, intonationNote: 'Enharmonically E5' };
    }
    return {
      primary: '1st valve',
      valves: [1],
      soundingConcertPitch: soundingPitch,
      harmonicPartial: 5,
      intonationNote: 'Top line F on staff. High singing register.',
      techniqueAdvice: 'Direct, focused airstream.'
    };
  }

  if (noteKey === 'G5') {
    if (isSharp) {
      return {
        primary: '2 + 3',
        alternate: '1st valve (high overtone)',
        valves: [2, 3],
        altValves: [1],
        soundingConcertPitch: soundingPitch,
        harmonicPartial: 6,
        intonationNote: 'High G♯ / A♭ above staff. 1st valve is an agile alternate.',
        techniqueAdvice: 'Arched tongue position ("Ee").'
      };
    }
    if (isFlat) {
      return { primary: '2nd valve', valves: [2], soundingConcertPitch: soundingPitch, harmonicPartial: 5, intonationNote: 'Top line F♯' };
    }
    return {
      primary: 'Open (0)',
      alternate: '1 + 2 (flatter alternate)',
      valves: [],
      altValves: [1, 2],
      soundingConcertPitch: soundingPitch,
      harmonicPartial: 6,
      intonationNote: '6th partial note right on top of staff. Slightly sharp (+2 cents). Relax throat.',
      techniqueAdvice: 'Rings brilliantly above the band.'
    };
  }

  if (noteKey === 'A5') {
    if (isSharp) {
      return { primary: '1st valve', valves: [1], soundingConcertPitch: soundingPitch, harmonicPartial: 7, intonationNote: 'High A♯ / B♭ above staff.' };
    }
    if (isFlat) {
      return { primary: '2 + 3', alternate: '1st valve', valves: [2, 3], altValves: [1], soundingConcertPitch: soundingPitch, harmonicPartial: 6, intonationNote: 'High A♭.' };
    }
    return {
      primary: '1 + 2',
      alternate: '1st valve (high partial)',
      valves: [1, 2],
      altValves: [1],
      soundingConcertPitch: soundingPitch,
      harmonicPartial: 6,
      intonationNote: '1st ledger line A. 1st valve is a common high partial alternate on cornet/horn.',
      techniqueAdvice: 'Speed of air over lip pressure.'
    };
  }

  if (noteKey === 'B5') {
    if (isFlat) {
      return { primary: '1st valve', valves: [1], soundingConcertPitch: soundingPitch, harmonicPartial: 7, intonationNote: 'High B♭ on 1st valve.' };
    }
    return {
      primary: '2nd valve',
      valves: [2],
      soundingConcertPitch: soundingPitch,
      harmonicPartial: 7,
      intonationNote: 'High B natural. 2nd valve.',
      techniqueAdvice: 'Firm embouchure corners.'
    };
  }

  if (noteKey === 'C6') {
    return {
      primary: 'Open (0)',
      valves: [],
      soundingConcertPitch: soundingPitch,
      harmonicPartial: 8,
      intonationNote: '8th partial octave High C! 2 ledger lines above staff.',
      techniqueAdvice: 'Peak of contest solo range; pin-point lip center and core diaphragm support.'
    };
  }

  return {
    primary: 'Open (0)',
    valves: [],
    soundingConcertPitch: soundingPitch,
    harmonicPartial: 2,
    intonationNote: 'Standard fingering'
  };
};

/* =========================================================
   GET SOUNDING FREQUENCY
   ========================================================= */

const getFrequency = (
  note: NoteData,
  accidental: AccidentalType,
  instrument: Instrument
): number => {
  const pitchClass = getPitchClass(note, accidental);
  let midi = 12 * (note.octave + 1) + pitchClass;

  switch (instrument) {
    case 'Bb Cornet':
    case 'Bb Trumpet':
      midi -= 2; // down M2
      break;
    case 'Eb Soprano Cornet':
      midi += 3; // up m3
      break;
    case 'Eb Horn':
      midi -= 9; // down M6
      break;
    case 'Euphonium':
    case 'Trombone':
      midi -= 14; // down M9
      break;
    case 'Eb Bass':
      midi -= 21; // down Octave + M6
      break;
    case 'BBb Bass':
      midi -= 26; // down 2 Octaves + M2
      break;
  }

  return 440 * Math.pow(2, (midi - 69) / 12);
};

/* =========================================================
   MUSIC TUTOR COMPONENT
   ========================================================= */

export const MusicTutor: React.FC = () => {
  const staffRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<'stave' | 'chart'>('stave');
  const [selectedIndex, setSelectedIndex] = useState<number>(4); // C4 default
  const [accidental, setAccidental] = useState<AccidentalType>('natural');
  const [instrument, setInstrument] = useState<Instrument>('Eb Horn');
  const [chartSearch, setChartSearch] = useState<string>('');
  const [chartFilter, setChartFilter] = useState<'all' | 'natural' | 'sharp' | 'flat' | 'alternate'>('all');

  const selectedNote = NOTES[selectedIndex];
  const clef = instrumentClefs[instrument];
  const displayName = getDisplayName(selectedNote, accidental);
  const fingeringInfo = getDetailedFingering(selectedNote, accidental, instrument);
  const frequency = getFrequency(selectedNote, accidental, instrument);

  /* =======================================================
     RENDER STAFF VIA VEXFLOW
     ======================================================= */

  const renderStaff = () => {
    if (!staffRef.current) return;
    staffRef.current.innerHTML = '';

    const renderer = new Renderer(staffRef.current, Renderer.Backends.SVG);
    renderer.resize(760, 240);

    const context = renderer.getContext();

    // MAIN STAVE
    const stave = new Stave(55, 30, 640);
    stave.addClef(clef);
    stave.addTimeSignature('4/4');
    stave.setContext(context).draw();

    // MAIN NOTE
    const staveNote = new StaveNote({
      keys: [selectedNote.vexKey],
      duration: 'q',
      clef,
    });

    if (accidental === 'sharp') staveNote.addModifier(new Accidental('#'), 0);
    if (accidental === 'flat') staveNote.addModifier(new Accidental('b'), 0);
    if (accidental === 'natural') staveNote.addModifier(new Accidental('n'), 0);

    const rest1 = new StaveNote({ keys: ['b/4'], duration: 'qr', clef });
    const rest2 = new StaveNote({ keys: ['b/4'], duration: 'qr', clef });
    const rest3 = new StaveNote({ keys: ['b/4'], duration: 'qr', clef });

    const voice = new Voice({ numBeats: 4, beatValue: 4 });
    voice.setMode(Voice.Mode.SOFT);
    voice.addTickables([staveNote, rest1, rest2, rest3]);

    new Formatter().joinVoices([voice]).format([voice], 500);
    voice.draw(context, stave);
  };

  useEffect(() => {
    if (activeTab === 'stave') {
      renderStaff();
    }
  }, [selectedIndex, accidental, instrument, activeTab]);

  /* =======================================================
     PLAY NOTE VIA AUTHENTIC BRASS ENGINE
     ======================================================= */

  const playNote = () => {
    const timbre = instrumentTimbreMap[instrument];
    brassAudio.playBrassTone(frequency, 1.2, timbre);
  };

  const nextNote = () => {
    setSelectedIndex(prev => (prev + 1) % NOTES.length);
    setAccidental('natural');
  };

  const previousNote = () => {
    setSelectedIndex(prev => (prev - 1 + NOTES.length) % NOTES.length);
    setAccidental('natural');
  };

  const resetNote = () => {
    setAccidental('natural');
  };

  // Generate full chromatic chart for current instrument
  const allChartNotes = NOTES.flatMap(n => {
    const natur = getDetailedFingering(n, 'natural', instrument);
    const sharp = getDetailedFingering(n, 'sharp', instrument);
    const flat = getDetailedFingering(n, 'flat', instrument);
    return [
      { name: `${n.name}♮${n.octave}`, noteData: n, acc: 'natural' as AccidentalType, info: natur },
      { name: `${n.name}♯${n.octave}`, noteData: n, acc: 'sharp' as AccidentalType, info: sharp },
      { name: `${n.name}♭${n.octave}`, noteData: n, acc: 'flat' as AccidentalType, info: flat }
    ];
  }).filter((item, idx, self) => 
    self.findIndex(t => t.name === item.name) === idx &&
    (chartFilter === 'all' || 
      (chartFilter === 'natural' && item.acc === 'natural') ||
      (chartFilter === 'sharp' && item.acc === 'sharp') ||
      (chartFilter === 'flat' && item.acc === 'flat') ||
      (chartFilter === 'alternate' && !!item.info.alternate)
    ) &&
    (chartSearch === '' || 
      item.name.toLowerCase().includes(chartSearch.toLowerCase()) || 
      item.info.primary.toLowerCase().includes(chartSearch.toLowerCase()) ||
      (item.info.alternate && item.info.alternate.toLowerCase().includes(chartSearch.toLowerCase()))
    )
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 text-slate-100">

      {/* TOP HEADER */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Sparkles className="h-4 w-4" />
            <span>Interactive Music Stave & Authentic Brass Fingering Engine</span>
          </div>

          <h1 className="mt-1 font-serif text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Music Tutor & Fingering Chart
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Accurate fingerings, slide positions, and alternate combinations for Horns, Trombones, Euphoniums, E♭ Bass, BB♭ Bass & Soprano Cornet.
          </p>
        </div>

        {/* TAB SWITCHER */}
        <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('stave')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'stave'
                ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Music2 className="h-3.5 w-3.5" />
            <span>Interactive Stave</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('chart')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'chart'
                ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Complete Fingering Chart</span>
          </button>
        </div>
      </div>

      {/* QUICK 1-CLICK INSTRUMENT SELECTOR CHIPS */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Choose Instrument Chart
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Accurate fingerings & sounding concert pitches for each instrument
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {INSTRUMENT_OPTIONS.map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setInstrument(opt.id)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all text-center ${
                instrument === opt.id
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-lg ring-1 ring-amber-400 scale-[1.02]'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-amber-400/40 hover:bg-slate-900'
              }`}
            >
              <span className="text-xl mb-1">{opt.icon}</span>
              <span className="text-xs font-bold leading-tight">{opt.label}</span>
              <span className="text-[10px] text-slate-400 leading-tight mt-0.5">{opt.badge}</span>
            </button>
          ))}
        </div>
      </div>

      {/* INSTRUMENT METADATA BANNER */}
      <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <label
              htmlFor="music-tutor-instrument"
              className="block text-xs font-bold uppercase tracking-wider text-amber-400"
            >
              Active Instrument
            </label>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              {instrumentDescriptions[instrument]}
            </p>
          </div>

          <select
            id="music-tutor-instrument"
            value={instrument}
            onChange={event => setInstrument(event.target.value as Instrument)}
            className="rounded-xl border border-amber-500/30 bg-slate-950 px-4 py-2.5 text-sm font-bold text-amber-300 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400 sm:w-72"
          >
            <option value="Eb Horn">📯 E♭ Tenor Horn (Treble Clef)</option>
            <option value="Trombone">📏 Trombone (7 Slide Positions)</option>
            <option value="Euphonium">🎺 Euphonium (3 & 4-Valve Comp)</option>
            <option value="Eb Bass">🐘 E♭ Bass / EE♭ Tuba (4-Valve)</option>
            <option value="BBb Bass">🌋 BB♭ Bass / BB♭ Tuba (4-Valve)</option>
            <option value="Eb Soprano Cornet">👑 E♭ Soprano Cornet (High Reg)</option>
            <option value="Bb Cornet">🎺 B♭ Cornet & Flugelhorn (Standard)</option>
          </select>
        </div>
      </div>

      {/* TAB 1: INTERACTIVE STAVE TUTOR */}
      {activeTab === 'stave' && (
        <div className="space-y-6">

          {/* STAFF DISPLAY */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-white p-4 shadow-xl">
            <div ref={staffRef} className="mx-auto min-w-[760px]" />
          </div>

          {/* REAL-TIME FINGERING & INFORMATION CARDS */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

            {/* CARD 1: WRITTEN NOTE */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 text-center flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Written Note (Staff)
              </span>
              <div className="my-2 text-4xl font-extrabold text-amber-300 font-serif">
                {displayName}
              </div>
              <span className="text-xs text-slate-400">
                Reads Treble Clef in {instrument.includes('Eb') ? 'E♭' : 'B♭'}
              </span>
            </div>

            {/* CARD 2: ACCURATE FINGERING / SLIDE POSITION */}
            <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 p-5 text-center flex flex-col justify-between shadow-lg">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                {instrument === 'Trombone' ? 'Accurate Slide Position' : 'Accurate Valve Fingering'}
              </span>

              {/* Visual Valve Pistons OR Slide Landmark */}
              {instrument === 'Trombone' ? (
                <div className="my-3">
                  <div className="text-2xl font-black text-amber-300">
                    {fingeringInfo.primary}
                  </div>
                  {fingeringInfo.slideLabel && (
                    <div className="mt-1 text-xs text-slate-300 font-medium">
                      📍 {fingeringInfo.slideLabel}
                    </div>
                  )}
                  {/* Trombone 1-7 Position Graphic */}
                  <div className="mt-3 flex items-center justify-center gap-1.5">
                    {[1, 2, 3, 4, 5, 6, 7].map(pos => (
                      <span
                        key={pos}
                        className={`h-7 w-7 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                          fingeringInfo.slidePosition === pos
                            ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300 font-black scale-110'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {pos}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="my-3">
                  <div className="text-3xl font-black text-amber-300 tracking-tight">
                    {fingeringInfo.primary}
                  </div>

                  {/* Visual 3D Valve Pistons (1, 2, 3, and 4 if applicable) */}
                  <div className="mt-3 flex items-center justify-center gap-2">
                    {[1, 2, 3, ...(instrument === 'Euphonium' || instrument === 'Eb Bass' || instrument === 'BBb Bass' ? [4] : [])].map(v => {
                      const isPressed = fingeringInfo.valves.includes(v);
                      return (
                        <div key={v} className="flex flex-col items-center gap-1">
                          <span
                            className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black shadow-md transition-all ${
                              isPressed
                                ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 scale-105'
                                : 'border border-slate-700 bg-slate-900 text-slate-400'
                            }`}
                          >
                            {v}
                          </span>
                          <span className="text-[9px] text-slate-500 font-mono">
                            {isPressed ? 'DOWN' : 'UP'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Alternate Fingering Indicator for Sharps/Flats */}
              {fingeringInfo.alternate ? (
                <div className="mt-1 rounded-lg bg-amber-500/10 border border-amber-500/20 py-1 px-2 text-[11px] text-amber-300 font-medium">
                  <strong>Alternate:</strong> {fingeringInfo.alternate}
                </div>
              ) : (
                <span className="text-xs text-slate-400 font-medium">
                  Primary harmonic combination
                </span>
              )}
            </div>

            {/* CARD 3: SOUNDING PITCH & HARMONICS */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 text-center flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Acoustic Pitch & Harmonic
              </span>
              <div className="my-2">
                <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                  Concert {fingeringInfo.soundingConcertPitch}
                </div>
                <div className="text-sm text-slate-300 font-mono mt-0.5">
                  {frequency.toFixed(1)} Hz · Partial #{fingeringInfo.harmonicPartial}
                </div>
              </div>
              <span className="text-xs text-slate-400">
                Actual acoustic frequency sounding
              </span>
            </div>
          </div>

          {/* INTONATION & BANDMASTER ADVICE BANNER */}
          {fingeringInfo.intonationNote && (
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 flex items-start gap-3 text-xs">
              <Info className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300">Intonation & Technique Guide: </span>
                <span className="text-slate-300">{fingeringInfo.intonationNote}</span>
                {fingeringInfo.techniqueAdvice && (
                  <span className="text-slate-400 ml-1">({fingeringInfo.techniqueAdvice})</span>
                )}
              </div>
            </div>
          )}

          {/* ACCIDENTALS SELECTOR */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="mb-3 text-center text-xs font-bold uppercase tracking-wider text-slate-400">
              Apply Accidental (Hear pitch shift & see altered fingerings)
            </p>

            <div className="grid grid-cols-3 gap-3">
              {/* FLAT */}
              <button
                type="button"
                onClick={() => setAccidental('flat')}
                className={`rounded-xl border px-4 py-3.5 transition-all text-center ${
                  accidental === 'flat'
                    ? 'border-amber-400 bg-amber-400/20 text-amber-300 shadow-md ring-1 ring-amber-400'
                    : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-amber-400/50'
                }`}
              >
                <div className="text-2xl font-serif font-black">♭</div>
                <div className="mt-1 text-xs font-bold">Flat (Lowers 1 semitone)</div>
              </button>

              {/* NATURAL */}
              <button
                type="button"
                onClick={() => setAccidental('natural')}
                className={`rounded-xl border px-4 py-3.5 transition-all text-center ${
                  accidental === 'natural'
                    ? 'border-amber-400 bg-amber-400/20 text-amber-300 shadow-md ring-1 ring-amber-400'
                    : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-amber-400/50'
                }`}
              >
                <div className="text-2xl font-serif font-black">♮</div>
                <div className="mt-1 text-xs font-bold">Natural (Unmodified)</div>
              </button>

              {/* SHARP */}
              <button
                type="button"
                onClick={() => setAccidental('sharp')}
                className={`rounded-xl border px-4 py-3.5 transition-all text-center ${
                  accidental === 'sharp'
                    ? 'border-amber-400 bg-amber-400/20 text-amber-300 shadow-md ring-1 ring-amber-400'
                    : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-amber-400/50'
                }`}
              >
                <div className="text-2xl font-serif font-black">♯</div>
                <div className="mt-1 text-xs font-bold">Sharp (Raises 1 semitone)</div>
              </button>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={previousNote}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-amber-400 hover:text-amber-300"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous Note</span>
            </button>

            <button
              type="button"
              onClick={resetNote}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-amber-400 hover:text-amber-300"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset Accidental</span>
            </button>

            <button
              type="button"
              onClick={playNote}
              className="flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3 text-sm font-extrabold text-slate-950 shadow-lg transition hover:bg-amber-300 hover:scale-105"
            >
              <Volume2 className="h-4 w-4" />
              <span>Hear Authentic Tone</span>
            </button>

            <button
              type="button"
              onClick={nextNote}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-amber-400 hover:text-amber-300"
            >
              <span>Next Note</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: COMPLETE FINGERING & ALTERNATE CHART TABLE */}
      {activeTab === 'chart' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <span>{instrument} Complete Chromatic Fingering Chart</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Full list of accurate primary fingerings, alternate combinations for sharps & flats, and sounding concert pitches.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search note or fingering..."
                value={chartSearch}
                onChange={e => setChartSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 pl-9 pr-3 text-xs text-slate-200 outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* INSTRUMENT TECHNICAL SPECS & QUICK INSIGHT */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs">
            <div className="flex items-start gap-2.5">
              <span className="text-lg">🎼</span>
              <div>
                <span className="font-bold text-slate-200 block">Notation & Clef</span>
                <span className="text-slate-400">
                  {instrument === 'Trombone'
                    ? 'B♭ Treble Clef (Brass Band standard, sounds M9 lower)'
                    : instrument === 'Eb Horn'
                    ? 'E♭ Treble Clef (sounds Major 6th lower)'
                    : instrument === 'Eb Bass'
                    ? 'E♭ Treble Clef (sounds Octave + Major 6th lower)'
                    : instrument === 'BBb Bass'
                    ? 'B♭ Treble Clef (sounds 2 Octaves + Major 2nd lower)'
                    : instrument === 'Eb Soprano Cornet'
                    ? 'E♭ Treble Clef (sounds Minor 3rd higher)'
                    : 'B♭ Treble Clef (sounds Major 2nd / Major 9th lower)'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="text-lg">⚙️</span>
              <div>
                <span className="font-bold text-slate-200 block">Acoustic System</span>
                <span className="text-slate-400">
                  {instrument === 'Trombone'
                    ? '7 Chromatic Slide Positions + Optional F-attachment valve trigger'
                    : instrument === 'Euphonium' || instrument === 'Eb Bass' || instrument === 'BBb Bass'
                    ? '4-Valve Compensating System (eliminates sharpness of 1+3 and 1+2+3)'
                    : '3-Piston Valve System with 1st & 3rd valve slide triggers'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="text-lg">🎯</span>
              <div>
                <span className="font-bold text-slate-200 block">Harmonic Alternates</span>
                <span className="text-slate-400">
                  {instrument === 'Trombone'
                    ? 'Alternates between harmonic partials (e.g. 1st pos vs 6th pos for F4)'
                    : 'True alternates for chromatic passages, trills, and pitch-correction'}
                </span>
              </div>
            </div>
          </div>

          {/* FILTER BUTTONS */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setChartFilter('all')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                chartFilter === 'all'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              All Notes ({allChartNotes.length})
            </button>
            <button
              type="button"
              onClick={() => setChartFilter('natural')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                chartFilter === 'natural'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              Naturals (♮)
            </button>
            <button
              type="button"
              onClick={() => setChartFilter('sharp')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                chartFilter === 'sharp'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              Sharps (♯)
            </button>
            <button
              type="button"
              onClick={() => setChartFilter('flat')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                chartFilter === 'flat'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              Flats (♭)
            </button>
            <button
              type="button"
              onClick={() => setChartFilter('alternate')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                chartFilter === 'alternate'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              Alternates & 4th Valve
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 shadow-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400">
                  <th className="py-3 px-4 font-bold">Written Note</th>
                  <th className="py-3 px-4 font-bold text-amber-300">
                    {instrument === 'Trombone' ? 'Primary Slide Position' : 'Primary Valve Fingering'}
                  </th>
                  <th className="py-3 px-4 font-bold text-sky-300">
                    Alternate (Sharps/Flats)
                  </th>
                  <th className="py-3 px-4 font-bold text-emerald-400">Sounding Concert Pitch</th>
                  <th className="py-3 px-4 font-bold text-slate-400">Intonation & Advice</th>
                  <th className="py-3 px-4 text-right font-bold">Audio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {allChartNotes.map((item, idx) => {
                  const freq = getFrequency(item.noteData, item.acc, instrument);
                  return (
                    <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-2.5 px-4 font-serif font-extrabold text-white text-sm">
                        {item.name}
                      </td>
                      <td className="py-2.5 px-4 font-bold text-amber-300 text-sm">
                        {item.info.primary}
                        {item.info.slideLabel && (
                          <div className="text-[10px] text-slate-400 font-sans font-normal">
                            {item.info.slideLabel}
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-sky-300 text-xs font-sans">
                        {item.info.alternate ? (
                          <span className="rounded bg-sky-950/60 border border-sky-500/30 px-2 py-0.5 text-[11px] font-semibold text-sky-200">
                            {item.info.alternate}
                          </span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-emerald-400 font-bold">
                        Concert {item.info.soundingConcertPitch}
                      </td>
                      <td className="py-2.5 px-4 text-slate-400 text-xs font-sans max-w-xs">
                        {item.info.intonationNote || 'Standard harmonic position'}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            const timbre = instrumentTimbreMap[instrument];
                            brassAudio.playBrassTone(freq, 0.8, timbre);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 text-slate-200 hover:bg-amber-400 hover:text-slate-950 transition-colors shadow-sm font-sans text-xs font-bold"
                        >
                          <Volume2 className="h-3 w-3" />
                          <span>Hear</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EDUCATIONAL FOOTER NOTE */}
      <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/60 p-5 text-xs text-slate-400 space-y-2">
        <h3 className="font-serif text-sm font-bold text-slate-200 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-amber-400" />
          <span>The British Brass Band Unified Fingering Principle</span>
        </h3>
        <p className="leading-relaxed">
          Because all valved brass instruments in the British band (from the smallest E♭ Soprano Cornet down to the giant 30-pound BB♭ Bass) read Treble Clef, valve fingerings on the staff are identical across instruments! When an E♭ Tenor Horn or BB♭ Bass player sees written C4 (middle C), both play <strong>Open</strong>; when they see D4, both play <strong>1 + 3</strong> (or <strong>4th valve</strong> on a 4-valve instrument).
        </p>
      </div>

    </div>
  );
};

export default MusicTutor;
