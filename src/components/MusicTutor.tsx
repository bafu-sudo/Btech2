import React, { useEffect, useRef, useState } from 'react';
import {
  Music2,
  Volume2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import {
  Renderer,
  Stave,
  StaveNote,
  Voice,
  Formatter,
  Accidental,
} from 'vexflow';

type AccidentalType = 'natural' | 'sharp' | 'flat';

type Instrument =
  | 'Bb Cornet'
  | 'Bb Trumpet'
  | 'Eb Horn'
  | 'Euphonium'
  | 'Trombone';

type NoteData = {
  name: string;
  octave: number;
  vexKey: string;
};

/* =========================================================
   WRITTEN NOTES
   ========================================================= */

const NOTES: NoteData[] = [
  { name: 'C', octave: 4, vexKey: 'c/4' },
  { name: 'D', octave: 4, vexKey: 'd/4' },
  { name: 'E', octave: 4, vexKey: 'e/4' },
  { name: 'F', octave: 4, vexKey: 'f/4' },
  { name: 'G', octave: 4, vexKey: 'g/4' },
  { name: 'A', octave: 4, vexKey: 'a/4' },
  { name: 'B', octave: 4, vexKey: 'b/4' },

  { name: 'C', octave: 5, vexKey: 'c/5' },
  { name: 'D', octave: 5, vexKey: 'd/5' },
  { name: 'E', octave: 5, vexKey: 'e/5' },
  { name: 'F', octave: 5, vexKey: 'f/5' },
  { name: 'G', octave: 5, vexKey: 'g/5' },
];

/* =========================================================
   NATURAL NOTE SEMITONES
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
   B♭ CORNET / B♭ TRUMPET FINGERINGS
   =========================================================

   These are common standard 3-valve fingerings.

   0 = open
   1 = first valve
   2 = second valve
   3 = third valve

   C# / Db use the same pitch and therefore the same
   basic fingering.

   G# / Ab are also enharmonic equivalents.

   ========================================================= */

const BB_FINGERINGS: Record<number, string> = {
 0: 'Open',          // C
  1: '1+2+3',     // C# / Db
  2: '1+3',       // D
  3: '2',         // D# / Eb
  4: '1+2',       // E
  5: '1',         // F
  6: '2',         // F# / Gb
  7: '0',         // G
  8: '2+3',       // G# / Ab
  9: '1+2',       // A
  10: '1',        // A# / Bb
  11: '2',        // B
};

/* =========================================================
   TROMBONE POSITIONS
   ========================================================= */

const TROMBONE_POSITIONS: Record<string, string> = {
  C4: '6th position',
  D4: '4th position',
  E4: '2nd position',
  F4: '1st position',
  G4: '4th position',
  A4: '2nd position',
  B4: '7th position',

  C5: '6th position',
  D5: '4th position',
  E5: '2nd position',
  F5: '1st position',
  G5: '4th position',
};

/* =========================================================
   INSTRUMENT SETTINGS
   ========================================================= */

const instrumentClefs: Record<Instrument, string> = {
  'Bb Cornet': 'treble',
  'Bb Trumpet': 'treble',
  'Eb Horn': 'treble',
  Euphonium: 'treble',
  Trombone: 'bass',
};

const instrumentDescriptions: Record<Instrument, string> = {
  'Bb Cornet': 'B♭ brass-band treble notation',
  'Bb Trumpet': 'B♭ trumpet treble notation',
  'Eb Horn': 'E♭ brass-band treble notation',
  Euphonium: 'Brass-band treble notation',
  Trombone: 'Concert-pitch bass clef',
};

/* =========================================================
   ACCIDENTAL DISPLAY
   ========================================================= */

const getAccidentalSymbol = (
  accidental: AccidentalType
): string => {
  if (accidental === 'sharp') {
    return '♯';
  }

  if (accidental === 'flat') {
    return '♭';
  }

  return '♮';
};

/* =========================================================
   GET PITCH CLASS
   =========================================================

   This is the important part.

   The STAFF keeps the original letter.

   The pitch calculation separately understands whether
   the note is natural, sharp or flat.

   Example:

   F natural = pitch class 5
   F sharp   = pitch class 6
   F flat    = pitch class 4

   ========================================================= */

const getPitchClass = (
  note: NoteData,
  accidental: AccidentalType
): number => {
  let pitch =
    NATURAL_SEMITONES[note.name];

  if (accidental === 'sharp') {
    pitch += 1;
  }

  if (accidental === 'flat') {
    pitch -= 1;
  }

  return ((pitch % 12) + 12) % 12;
};

/* =========================================================
   GET DISPLAY NAME
   ========================================================= */

const getDisplayName = (
  note: NoteData,
  accidental: AccidentalType
): string => {
  return `${note.name}${getAccidentalSymbol(
    accidental
  )}${note.octave}`;
};

/* =========================================================
   GET FINGERING
   ========================================================= */

const getFingering = (
  note: NoteData,
  accidental: AccidentalType,
  instrument: Instrument
): string => {
  /* -----------------------------
     TROMBONE
     ----------------------------- */

  if (instrument === 'Trombone') {
    const noteKey =
      `${note.name}${note.octave}`;

    return (
      TROMBONE_POSITIONS[noteKey] ??
      'See trombone position chart'
    );
  }

  /* -----------------------------
     B♭ CORNET / TRUMPET
     ----------------------------- */

  if (
    instrument === 'Bb Cornet' ||
    instrument === 'Bb Trumpet'
  ) {
    const pitchClass =
      getPitchClass(
        note,
        accidental
      );

    return (
      BB_FINGERINGS[pitchClass] ??
      'See fingering chart'
    );
  }

  /* -----------------------------
     OTHER INSTRUMENTS
     ----------------------------- */

  return 'Fingering chart coming soon';
};

/* =========================================================
   GET SOUNDING FREQUENCY
   ========================================================= */

const getFrequency = (
  note: NoteData,
  accidental: AccidentalType,
  instrument: Instrument
): number => {
  const pitchClass =
    getPitchClass(
      note,
      accidental
    );

  /*
    Calculate MIDI using the written octave.
  */

  let midi =
    12 * (note.octave + 1) +
    pitchClass;

  /*
    B♭ instruments sound a whole step lower
    than written.
  */

  if (
    instrument === 'Bb Cornet' ||
    instrument === 'Bb Trumpet' ||
    instrument === 'Euphonium'
  ) {
    midi -= 2;
  }

  /*
    E♭ horn sounds a major sixth lower
    than written.
  */

  if (instrument === 'Eb Horn') {
    midi -= 9;
  }

  return (
    440 *
    Math.pow(
      2,
      (midi - 69) / 12
    )
  );
};

/* =========================================================
   MUSIC TUTOR
   ========================================================= */

export const MusicTutor: React.FC = () => {
  const staffRef =
    useRef<HTMLDivElement>(null);

  const audioContextRef =
    useRef<AudioContext | null>(null);

  const [selectedIndex, setSelectedIndex] =
    useState<number>(3);

  const [accidental, setAccidental] =
    useState<AccidentalType>('natural');

  const [instrument, setInstrument] =
    useState<Instrument>('Bb Cornet');

  const selectedNote =
    NOTES[selectedIndex];

  const clef =
    instrumentClefs[instrument];

  const displayName =
    getDisplayName(
      selectedNote,
      accidental
    );

  const fingering =
    getFingering(
      selectedNote,
      accidental,
      instrument
    );

  const frequency =
    getFrequency(
      selectedNote,
      accidental,
      instrument
    );

  /* =======================================================
     RENDER STAFF
     ======================================================= */

  const renderStaff = () => {
    if (!staffRef.current) {
      return;
    }

    staffRef.current.innerHTML = '';

    const renderer =
      new Renderer(
        staffRef.current,
        Renderer.Backends.SVG
      );

    renderer.resize(
      760,
      310
    );

    const context =
      renderer.getContext();

    /* =====================================================
       MAIN STAVE
       ===================================================== */

    const stave =
      new Stave(
        55,
        55,
        640
      );

    stave.addClef(clef);
    stave.addTimeSignature('4/4');

    stave
      .setContext(context)
      .draw();

    /* =====================================================
       MAIN NOTE
       ===================================================== */

    const staveNote =
      new StaveNote({
        keys: [
          selectedNote.vexKey,
        ],
        duration: 'q',
        clef,
      });

    /* =====================================================
       ACCIDENTAL
       ===================================================== */

    if (accidental === 'sharp') {
      staveNote.addModifier(
        new Accidental('#'),
        0
      );
    }

    if (accidental === 'flat') {
      staveNote.addModifier(
        new Accidental('b'),
        0
      );
    }

    if (accidental === 'natural') {
      staveNote.addModifier(
        new Accidental('n'),
        0
      );
    }

    /* =====================================================
       THREE QUARTER RESTS
       ===================================================== */

    const restKey =
      clef === 'bass'
        ? 'd/4'
        : 'c/4';

    const rest1 =
      new StaveNote({
        keys: [restKey],
        duration: 'qr',
        clef,
      });

    const rest2 =
      new StaveNote({
        keys: [restKey],
        duration: 'qr',
        clef,
      });

    const rest3 =
      new StaveNote({
        keys: [restKey],
        duration: 'qr',
        clef,
      });

    /* =====================================================
       VOICE
       ===================================================== */

    const voice =
      new Voice({
        numBeats: 4,
        beatValue: 4,
      });

    voice.setMode(
      Voice.Mode.SOFT
    );

    voice.addTickables([
      staveNote,
      rest1,
      rest2,
      rest3,
    ]);

    new Formatter()
      .joinVoices([
        voice,
      ])
      .format(
        [voice],
        500
      );

    voice.draw(
      context,
      stave
    );

    /* =====================================================
       INFORMATION AREA
       ===================================================== */

    const infoStave =
      new Stave(
        55,
        180,
        640
      );

    infoStave
      .setContext(context)
      .draw();

    context.setFont(
      'Arial',
      16,
      'bold'
    );

    context.fillText(
      `Note: ${displayName}`,
      85,
      225
    );

    context.setFont(
      'Arial',
      14,
      'normal'
    );

    context.fillText(
      `Fingering: ${fingering}`,
      280,
      225
    );

    context.fillText(
      instrument,
      515,
      225
    );
  };

  /* =======================================================
     UPDATE STAFF
     ======================================================= */

  useEffect(() => {
    renderStaff();
  }, [
    selectedIndex,
    accidental,
    instrument,
  ]);

  /* =======================================================
     PLAY NOTE
     ======================================================= */

  const playNote = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current =
        new AudioContext();
    }

    const audioContext =
      audioContextRef.current;

    if (
      audioContext.state ===
      'suspended'
    ) {
      await audioContext.resume();
    }

    const oscillator =
      audioContext.createOscillator();

    const gain =
      audioContext.createGain();

    oscillator.type =
      'triangle';

    oscillator.frequency.value =
      frequency;

    const now =
      audioContext.currentTime;

    gain.gain.setValueAtTime(
      0.0001,
      now
    );

    gain.gain.exponentialRampToValueAtTime(
      0.3,
      now + 0.03
    );

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + 1.3
    );

    oscillator.connect(gain);

    gain.connect(
      audioContext.destination
    );

    oscillator.start(now);

    oscillator.stop(
      now + 1.3
    );
  };

  /* =======================================================
     NEXT NOTE
     ======================================================= */

  const nextNote = () => {
    setSelectedIndex(
      previous =>
        (previous + 1) %
        NOTES.length
    );

    setAccidental(
      'natural'
    );
  };

  /* =======================================================
     PREVIOUS NOTE
     ======================================================= */

  const previousNote = () => {
    setSelectedIndex(
      previous =>
        (previous - 1 + NOTES.length) %
        NOTES.length
    );

    setAccidental(
      'natural'
    );
  };

  /* =======================================================
     RESET
     ======================================================= */

  const resetNote = () => {
    setAccidental(
      'natural'
    );
  };

  /* =======================================================
     UI
     ======================================================= */

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">

      {/* HEADER */}

      <div className="mb-8 text-center">

        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-300">

          <Music2 className="h-4 w-4" />

          Btech Music Tutor

        </div>

        <h1 className="mt-4 font-serif text-3xl font-bold text-slate-100 sm:text-4xl">

          Interactive Staff & Fingering Tutor

        </h1>

        <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-400">

          Learn the note on the staff,
          understand accidentals,
          discover the fingering and
          hear the pitch.

        </p>

      </div>

      {/* MAIN CARD */}

      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-2xl sm:p-6">

        {/* INSTRUMENT */}

        <div className="mb-6">

          <label
            htmlFor="music-tutor-instrument"
            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500"
          >
            Instrument
          </label>

          <select
            id="music-tutor-instrument"
            value={instrument}
            onChange={event =>
              setInstrument(
                event.target.value as Instrument
              )
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-200 outline-none transition focus:border-amber-400 sm:w-auto"
          >

            <option value="Bb Cornet">
              B♭ Cornet
            </option>

            <option value="Bb Trumpet">
              B♭ Trumpet
            </option>

            <option value="Eb Horn">
              E♭ Horn
            </option>

            <option value="Euphonium">
              Euphonium
            </option>

            <option value="Trombone">
              Trombone
            </option>

          </select>

          <p className="mt-2 text-xs text-slate-500">

            {instrumentDescriptions[instrument]}

          </p>

        </div>

        {/* STAFF */}

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-white p-3 sm:p-5">

          <div
            ref={staffRef}
            className="mx-auto min-w-[760px]"
          />

        </div>

        {/* INFORMATION CARDS */}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          {/* NOTE */}

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-center">

            <p className="text-xs uppercase tracking-wider text-slate-500">
              Written Note
            </p>

            <div className="mt-2 text-4xl font-bold text-amber-300">
              {displayName}
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Note on the staff
            </p>

          </div>

          {/* FINGERING */}

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 text-center">

            <p className="text-xs uppercase tracking-wider text-slate-500">
              Fingering
            </p>

            <div className="mt-2 text-3xl font-bold text-slate-100">
              {fingering}
            </div>

            <p className="mt-1 text-xs text-slate-500">
              {instrument}
            </p>

          </div>

          {/* FREQUENCY */}

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-center">

            <p className="text-xs uppercase tracking-wider text-slate-500">
              Sounding Frequency
            </p>

            <div className="mt-2 text-3xl font-bold text-slate-100">
              {frequency.toFixed(1)}
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Hz
            </p>

          </div>

        </div>

        {/* ACCIDENTALS */}

        <div className="mt-7">

          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
            Change the note
          </p>

          <div className="grid grid-cols-3 gap-3">

            {/* FLAT */}

            <button
              type="button"
              onClick={() =>
                setAccidental('flat')
              }
              className={`rounded-xl border px-4 py-4 transition ${
                accidental === 'flat'
                  ? 'border-amber-400 bg-amber-400/10 text-amber-300'
                  : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-amber-400/50'
              }`}
            >

              <div className="text-3xl font-serif">
                ♭
              </div>

              <div className="mt-1 text-xs font-bold">
                Flat
              </div>

            </button>

            {/* NATURAL */}

            <button
              type="button"
              onClick={() =>
                setAccidental('natural')
              }
              className={`rounded-xl border px-4 py-4 transition ${
                accidental === 'natural'
                  ? 'border-amber-400 bg-amber-400/10 text-amber-300'
                  : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-amber-400/50'
              }`}
            >

              <div className="text-3xl font-serif">
                ♮
              </div>

              <div className="mt-1 text-xs font-bold">
                Natural
              </div>

            </button>

            {/* SHARP */}

            <button
              type="button"
              onClick={() =>
                setAccidental('sharp')
              }
              className={`rounded-xl border px-4 py-4 transition ${
                accidental === 'sharp'
                  ? 'border-amber-400 bg-amber-400/10 text-amber-300'
                  : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-amber-400/50'
              }`}
            >

              <div className="text-3xl font-serif">
                ♯
              </div>

              <div className="mt-1 text-xs font-bold">
                Sharp
              </div>

            </button>

          </div>

        </div>

        {/* CONTROLS */}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">

          <button
            type="button"
            onClick={previousNote}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-amber-400 hover:text-amber-300"
          >

            <ChevronLeft className="h-4 w-4" />

            Previous

          </button>

          <button
            type="button"
            onClick={resetNote}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-amber-400 hover:text-amber-300"
          >

            <RotateCcw className="h-4 w-4" />

            Natural

          </button>

          <button
            type="button"
            onClick={playNote}
            className="flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-300"
          >

            <Volume2 className="h-4 w-4" />

            Play Note

          </button>

          <button
            type="button"
            onClick={nextNote}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-amber-400 hover:text-amber-300"
          >

            Next

            <ChevronRight className="h-4 w-4" />

          </button>

        </div>

        {/* LESSON GUIDE */}

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/60 p-5">

          <h3 className="font-serif text-lg font-bold text-slate-100">
            How to use the tutor
          </h3>

          <div className="mt-4 space-y-3 text-sm text-slate-400">

            <p>
              <span className="font-bold text-amber-300">
                1.
              </span>{' '}
              Look at the note on the staff.
            </p>

            <p>
              <span className="font-bold text-amber-300">
                2.
              </span>{' '}
              Identify the written note.
            </p>

            <p>
              <span className="font-bold text-amber-300">
                3.
              </span>{' '}
              Try the flat, natural and sharp
              controls.
            </p>

            <p>
              <span className="font-bold text-amber-300">
                4.
              </span>{' '}
              Look at the fingering displayed
              underneath.
            </p>

            <p>
              <span className="font-bold text-amber-300">
                5.
              </span>{' '}
              Press{' '}
              <strong className="text-slate-200">
                Play Note
              </strong>{' '}
              to hear the pitch.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default MusicTutor;

