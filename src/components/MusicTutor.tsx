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
  B♭ CORNET / TRUMPET
  Standard three-valve fingerings.

  0 = open
  1 = first valve
  2 = second valve
  3 = third valve
*/

const BbCornetFingerings: Record<string, string> = {
  C4: '1+3',
  'C#4': '2+3',
  Db4: '1+2+3',

  D4: '1+3',
  'D#4': '2',
  Eb4: '2',

  E4: '1+2',
  'E#4': '1',
  Fb4: '2+3',

  F4: '1',
  'F#4': '2',
  Gb4: '2',

  G4: '0',
  'G#4': '2+3',
  Ab4: '3',

  A4: '1+2',
  'A#4': '1',
  Bb4: '1',

  B4: '2',
  'B#4': '0',
  Cb5: '2',

  C5: '0',
  'C#5': '2+3',
  Db5: '1+2+3',

  D5: '1+3',
  'D#5': '2',
  Eb5: '2',

  E5: '1+2',
  'E#5': '1',
  Fb5: '2+3',

  F5: '1',
  'F#5': '2',
  Gb5: '2',

  G5: '0',
  'G#5': '2+3',
  Ab5: '3',
};

const TrombonePositions: Record<string, string> = {
  C4: '6th',
  D4: '4th',
  E4: '2nd',
  F4: '1st',
  G4: '4th',
  A4: '2nd',
  B4: '7th',
  C5: '6th',
  D5: '4th',
  E5: '2nd',
  F5: '1st',
  G5: '4th',
};

const instrumentClefs: Record<Instrument, string> = {
  'Bb Cornet': 'treble',
  'Bb Trumpet': 'treble',
  'Eb Horn': 'treble',
  Euphonium: 'treble',
  Trombone: 'bass',
};

const instrumentDescriptions: Record<Instrument, string> = {
  'Bb Cornet': 'B♭ brass-band notation',
  'Bb Trumpet': 'B♭ trumpet notation',
  'Eb Horn': 'E♭ brass-band notation',
  Euphonium: 'Brass-band treble notation',
  Trombone: 'Concert-pitch bass clef',
};

const getAccidentalSymbol = (
  accidental: AccidentalType
): string => {
  if (accidental === 'sharp') return '♯';
  if (accidental === 'flat') return '♭';
  return '';
};

const getNoteKey = (
  note: NoteData,
  accidental: AccidentalType
): string => {
  if (accidental === 'sharp') {
    return `${note.name}#${note.octave}`;
  }

  if (accidental === 'flat') {
    return `${note.name}b${note.octave}`;
  }

  return `${note.name}${note.octave}`;
};

const getFingering = (
  note: NoteData,
  accidental: AccidentalType,
  instrument: Instrument
): string => {
  const noteKey = getNoteKey(note, accidental);

  if (instrument === 'Trombone') {
    return (
      TrombonePositions[noteKey] ||
      'See trombone position chart'
    );
  }

  if (
    instrument === 'Bb Cornet' ||
    instrument === 'Bb Trumpet'
  ) {
    return (
      BbCornetFingerings[noteKey] ||
      'See fingering chart'
    );
  }

  /*
    E♭ horn and euphonium have different practical
    fingering systems depending on the exact instrument
    and notation system.

    For now we show the B♭ brass fingering as a useful
    starting point for the treble-clef tutor.
  */

  return (
    BbCornetFingerings[noteKey] ||
    'See fingering chart'
  );
};

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
    Written pitch → sounding pitch.

    B♭ instruments:
    written C sounds concert B♭.
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
    written C sounds concert E♭ below.
  */

  if (instrument === 'Eb Horn') {
    midi -= 9;
  }

  return (
    440 *
    Math.pow(2, (midi - 69) / 12)
  );
};

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

  const accidentalSymbol =
    getAccidentalSymbol(accidental);

  const displayName =
    `${selectedNote.name}${accidentalSymbol}${selectedNote.octave}`;

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
    Render the actual musical staff.
  */

  const renderStaff = () => {
    if (!staffRef.current) return;

    staffRef.current.innerHTML = '';

    const width = 700;
    const height = 300;

    const renderer =
      new Renderer(
        staffRef.current,
        Renderer.Backends.SVG
      );

    renderer.resize(
      width,
      height
    );

    const context =
      renderer.getContext();

    /*
      MAIN STAFF
    */

    const stave =
      new Stave(
        60,
        50,
        580
      );

    stave.addClef(clef);
    stave.addTimeSignature('4/4');

    stave
      .setContext(context)
      .draw();

    /*
      ACTUAL NOTE
    */

    const staveNote =
      new StaveNote({
        keys: [
          selectedNote.vexKey,
        ],
        duration: 'q',
        clef,
      });

    /*
      VexFlow accidental.

      # = sharp
      b = flat
      n = natural
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

    if (accidental === 'natural') {
      staveNote.addModifier(
        new Accidental('n'),
        0
      );
    }

    /*
      Complete the measure with rests.
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
      .joinVoices([voice])
      .format(
        [voice],
        450
      );

    voice.draw(
      context,
      stave
    );

    /*
      INFORMATION AREA
    */

    const infoStave =
      new Stave(
        60,
        175,
        580
      );

    infoStave
      .setContext(context)
      .draw();

    context.setFont(
      'Arial',
      17,
      'bold'
    );

    context.fillText(
      `Note: ${displayName}`,
      90,
      220
    );

    context.setFont(
      'Arial',
      14,
      'normal'
    );

    context.fillText(
      `Fingering: ${fingering}`,
      260,
      220
    );

    context.fillText(
      `${instrument}`,
      450,
      220
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
    PLAY NOTE
  */

  const playNote = () => {
    if (!audioContextRef.current) {
      audioContextRef.current =
        new AudioContext();
    }

    const audioContext =
      audioContextRef.current;

    if (
      audioContext.state === 'suspended'
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

  const nextNote = () => {
    setSelectedIndex(
      (previous) =>
        (previous + 1) %
        NOTES.length
    );

    setAccidental('natural');
  };

  const previousNote = () => {
    setSelectedIndex(
      (previous) =>
        (previous - 1 + NOTES.length) %
        NOTES.length
    );

    setAccidental('natural');
  };

  const resetNote = () => {
    setAccidental('natural');
  };

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
          Learn to identify notes on the
          staff, change accidentals and
          instantly see the fingering.
        </p>

      </div>

      {/* MAIN PANEL */}

      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-2xl sm:p-6">

        {/* INSTRUMENT */}

        <div className="mb-6">

          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Instrument
          </label>

          <select
            value={instrument}
            onChange={(event) =>
              setInstrument(
                event.target.value as Instrument
              )
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-200 outline-none focus:border-amber-400 sm:w-auto"
          >

            <option>
              Bb Cornet
            </option>

            <option>
              Bb Trumpet
            </option>

            <option>
              Eb Horn
            </option>

            <option>
              Euphonium
            </option>

            <option>
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
            className="mx-auto min-w-[700px]"
          />

        </div>

        {/* NOTE INFORMATION */}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          {/* NOTE */}

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-center">

            <p className="text-xs uppercase tracking-wider text-slate-500">
              Selected Note
            </p>

            <div className="mt-2 text-4xl font-bold text-amber-300">
              {displayName}
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Written notation
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

          {/* SOUND */}

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-center">

            <p className="text-xs uppercase tracking-wider text-slate-500">
              Sound
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

        <div className="mt-6">

          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
            Change Accidental
          </p>

          <div className="grid grid-cols-3 gap-3">

            {/* FLAT */}

            <button
              onClick={() =>
                setAccidental('flat')
              }
              className={`rounded-xl border px-4 py-4 text-center transition ${
                accidental === 'flat'
                  ? 'border-amber-400 bg-amber-400/10 text-amber-300'
                  : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500'
              }`}
            >

              <div className="text-3xl font-serif">
                ♭
              </div>

              <div className="mt-1 text-xs font-semibold">
                Flat
              </div>

            </button>

            {/* NATURAL */}

            <button
              onClick={() =>
                setAccidental('natural')
              }
              className={`rounded-xl border px-4 py-4 text-center transition ${
                accidental === 'natural'
                  ? 'border-amber-400 bg-amber-400/10 text-amber-300'
                  : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500'
              }`}
            >

              <div className="text-3xl font-serif">
                ♮
              </div>

              <div className="mt-1 text-xs font-semibold">
                Natural
              </div>

            </button>

            {/* SHARP */}

            <button
              onClick={() =>
                setAccidental('sharp')
              }
              className={`rounded-xl border px-4 py-4 text-center transition ${
                accidental === 'sharp'
                  ? 'border-amber-400 bg-amber-400/10 text-amber-300'
                  : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500'
              }`}
            >

              <div className="text-3xl font-serif">
                ♯
              </div>

              <div className="mt-1 text-xs font-semibold">
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

        {/* LESSON GUIDE */}

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/60 p-5">

          <h3 className="font-serif text-lg font-bold text-slate-100">
            How to use this lesson
          </h3>

          <div className="mt-3 grid gap-3 text-sm text-slate-400 sm:grid-cols-2">

            <p>
              <span className="font-semibold text-amber-300">
                1.
              </span>{' '}
              Select your instrument.
            </p>

            <p>
              <span className="font-semibold text-amber-300">
                2.
              </span>{' '}
              Move through the notes.
            </p>

            <p>
              <span className="font-semibold text-amber-300">
                3.
              </span>{' '}
              Choose flat, natural or sharp.
            </p>

            <p>
              <span className="font-semibold text-amber-300">
                4.
              </span>{' '}
              Look at the actual accidental
              on the staff.
            </p>

            <p>
              <span className="font-semibold text-amber-300">
                5.
              </span>{' '}
              Learn the fingering.
            </p>

            <p>
              <span className="font-semibold text-amber-300">
                6.
              </span>{' '}
              Play the note and listen.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default MusicTutor;
