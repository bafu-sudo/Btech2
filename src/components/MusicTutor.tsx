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

/*
|--------------------------------------------------------------------------
| NOTES
|--------------------------------------------------------------------------
| These are WRITTEN notes for the tutor.
|
| The B♭ cornet is taught using treble-clef brass-band notation.
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| B♭ CORNET / B♭ TRUMPET FINGERINGS
|--------------------------------------------------------------------------
|
| 0     = open
| 1     = first valve
| 2     = second valve
| 3     = third valve
|
| These are standard basic 3-valve fingerings.
|
| Enharmonic spellings such as D# and Eb can have the same fingering.
|--------------------------------------------------------------------------
*/

const BB_FINGERINGS: Record<string, string> = {
  // OCTAVE 4
  C4: '1+3',
  'C#4': '2+3',
  Db4: '1+2+3',

  D4: '1+3',
  'D#4': '2',
  Eb4: '2',

  E4: '1+2',
  'Fb4': '1+2+3',

  F4: '1',
  'E#4': '1',

  'F#4': '2',
  Gb4: '2',

  G4: '0',
  'G#4': '2+3',
  Ab4: '3',

  A4: '1+2',
  'A#4': '1',
  Bb4: '1',

  B4: '2',
  Cb5: '2',

  'B#4': '0',

  // OCTAVE 5
  C5: '0',
  'B#4': '0',

  'C#5': '2+3',
  Db5: '1+2+3',

  D5: '1+3',
  'D#5': '2',
  Eb5: '2',

  E5: '1+2',
  Fb5: '1+2+3',

  F5: '1',
  'E#5': '1',

  'F#5': '2',
  Gb5: '2',

  G5: '0',
  'G#5': '2+3',
  Ab5: '3',
};

/*
|--------------------------------------------------------------------------
| TROMBONE POSITIONS
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| INSTRUMENT INFORMATION
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| ACCIDENTAL SYMBOL
|--------------------------------------------------------------------------
*/

const getAccidentalSymbol = (
  accidental: AccidentalType
): string => {
  switch (accidental) {
    case 'sharp':
      return '♯';

    case 'flat':
      return '♭';

    default:
      return '';
  }
};

/*
|--------------------------------------------------------------------------
| VEXFLOW NOTE KEY
|--------------------------------------------------------------------------
|
| VexFlow needs the written pitch position.
| The accidental is added separately with Accidental().
|--------------------------------------------------------------------------
*/

const getVexKey = (
  note: NoteData
): string => {
  return note.vexKey;
};

/*
|--------------------------------------------------------------------------
| DISPLAY NAME
|--------------------------------------------------------------------------
*/

const getDisplayName = (
  note: NoteData,
  accidental: AccidentalType
): string => {
  return `${note.name}${getAccidentalSymbol(
    accidental
  )}${note.octave}`;
};

/*
|--------------------------------------------------------------------------
| FINGERING
|--------------------------------------------------------------------------
*/

const getFingering = (
  note: NoteData,
  accidental: AccidentalType,
  instrument: Instrument
): string => {
  const baseName = note.name;
  const octave = note.octave;

  let key = `${baseName}${octave}`;

  if (accidental === 'sharp') {
    key = `${baseName}#${octave}`;
  }

  if (accidental === 'flat') {
    key = `${baseName}b${octave}`;
  }

  /*
    Trombone is position based.
  */

  if (instrument === 'Trombone') {
    return (
      TROMBONE_POSITIONS[key] ||
      'See position chart'
    );
  }

  /*
    B♭ cornet and trumpet.
  */

  if (
    instrument === 'Bb Cornet' ||
    instrument === 'Bb Trumpet'
  ) {
    return (
      BB_FINGERINGS[key] ||
      'See fingering chart'
    );
  }

  /*
    We deliberately don't claim that E♭ horn and
    euphonium use identical fingering systems.

    This can be expanded later with their own
    verified databases.
  */

  return 'Fingering chart coming soon';
};

/*
|--------------------------------------------------------------------------
| MIDI / FREQUENCY
|--------------------------------------------------------------------------
*/

const getFrequency = (
  note: NoteData,
  accidental: AccidentalType,
  instrument: Instrument
): number => {
  const semitones: Record<string, number> = {
    C: 0,
    D: 2,
    E: 4,
    F: 5,
    G: 7,
    A: 9,
    B: 11,
  };

  let midi =
    12 * (note.octave + 1) +
    semitones[note.name];

  if (accidental === 'sharp') {
    midi += 1;
  }

  if (accidental === 'flat') {
    midi -= 1;
  }

  /*
    Written B♭ instrument:
    written C → concert B♭.
  */

  if (
    instrument === 'Bb Cornet' ||
    instrument === 'Bb Trumpet' ||
    instrument === 'Euphonium'
  ) {
    midi -= 2;
  }

  /*
    E♭ horn:
    written C → concert E♭.
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

/*
|--------------------------------------------------------------------------
| MUSIC TUTOR
|--------------------------------------------------------------------------
*/

export const MusicTutor: React.FC = () => {
  const staffRef =
    useRef<HTMLDivElement>(null);

  const audioContextRef =
    useRef<AudioContext | null>(null);

  const [selectedIndex, setSelectedIndex] =
    useState(3);

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

  /*
  |--------------------------------------------------------------------------
  | RENDER STAFF
  |--------------------------------------------------------------------------
  */

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

    /*
      Main musical stave.
    */

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

    /*
      IMPORTANT:
      The pitch position remains the same.

      The accidental is rendered separately
      using VexFlow.
    */

    const staveNote =
      new StaveNote({
        keys: [
          getVexKey(
            selectedNote
          ),
        ],
        duration: 'q',
        clef,
      });

    /*
      Add the ACTUAL musical accidental.
    */

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

    /*
      Natural is useful when returning from
      an accidental context.
    */

    if (accidental === 'natural') {
      staveNote.addModifier(
        new Accidental('n'),
        0
      );
    }

    /*
      Three quarter rests complete the
      4/4 measure.
    */

    const rest1 =
      new StaveNote({
        keys: [
          clef === 'bass'
            ? 'd/4'
            : 'c/4',
        ],
        duration: 'qr',
        clef,
      });

    const rest2 =
      new StaveNote({
        keys: [
          clef === 'bass'
            ? 'd/4'
            : 'c/4',
        ],
        duration: 'qr',
        clef,
      });

    const rest3 =
      new StaveNote({
        keys: [
          clef === 'bass'
            ? 'd/4'
            : 'c/4',
        ],
        duration: 'qr',
        clef,
      });

    /*
      Voice.
    */

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

    /*
      INFORMATION STAVE.
    */

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
      270,
      225
    );

    context.fillText(
      instrument,
      500,
      225
    );
  };

  useEffect(() => {
    renderStaff();
  }, [
    selectedIndex,
    accidental,
    instrument,
  ]);

  /*
  |--------------------------------------------------------------------------
  | PLAY NOTE
  |--------------------------------------------------------------------------
  */

  const playNote = () => {
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
      audioContext.resume();
    }

    const oscillator =
      audioContext.createOscillator();

    const gain =
      audioContext.createGain();

    oscillator.type =
      'triangle';

    oscillator.frequency.value =
      frequency;

    gain.gain.setValueAtTime(
      0.0001,
      audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      0.3,
      audioContext.currentTime + 0.03
    );

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      audioContext.currentTime + 1.3
    );

    oscillator.connect(gain);

    gain.connect(
      audioContext.destination
    );

    oscillator.start();

    oscillator.stop(
      audioContext.currentTime + 1.3
    );
  };

  /*
  |--------------------------------------------------------------------------
  | NAVIGATION
  |--------------------------------------------------------------------------
  */

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

  const resetNote = () => {
    setAccidental(
      'natural'
    );
  };

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

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

          Read the note on the staff,
          change its accidental and
          instantly see the fingering.

        </p>

      </div>

      {/* MAIN CARD */}

      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-2xl sm:p-6">

        {/* INSTRUMENT */}

        <div className="mb-6">

          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">

            Instrument

          </label>

          <select
            value={instrument}
            onChange={event =>
              setInstrument(
                event.target.value as Instrument
              )
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-200 outline-none focus:border-amber-400 sm:w-auto"
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

        {/* NOTE DETAILS */}

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

              Staff position

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

        {/* ACCIDENTAL BUTTONS */}

        <div className="mt-7">

          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">

            Change the note

          </p>

          <div className="grid grid-cols-3 gap-3">

            {/* FLAT */}

            <button
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

        {/* NAVIGATION */}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">

          <button
            onClick={previousNote}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-amber-400 hover:text-amber-300"
          >

            <ChevronLeft className="h-4 w-4" />

            Previous

          </button>

          <button
            onClick={resetNote}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-amber-400 hover:text-amber-300"
          >

            <RotateCcw className="h-4 w-4" />

            Natural

          </button>

          <button
            onClick={playNote}
            className="flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-300"
          >

            <Volume2 className="h-4 w-4" />

            Play Note

          </button>

          <button
            onClick={nextNote}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-amber-400 hover:text-amber-300"
          >

            Next

            <ChevronRight className="h-4 w-4" />

          </button>

        </div>

        {/* TEACHING GUIDE */}

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/60 p-5">

          <h3 className="font-serif text-lg font-bold text-slate-100">

            Learn the connection

          </h3>

          <div className="mt-4 space-y-3 text-sm text-slate-400">

            <p>
              <span className="font-bold text-amber-300">
                1.
              </span>{' '}
              Look at where the note sits on
              the staff.
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
              Add a sharp, flat or natural.
            </p>

            <p>
              <span className="font-bold text-amber-300">
                4.
              </span>{' '}
              Look at the fingering Btech
              gives you.
            </p>

            <p>
              <span className="font-bold text-amber-300">
                5.
              </span>{' '}
              Press <strong className="text-slate-200">
                Play Note
              </strong>{' '}
              and connect what you see
              with what you hear.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default MusicTutor;
