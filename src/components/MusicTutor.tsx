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
  Beam,
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
  fingering: string;
  sharpFingering: string;
  flatFingering: string;
};

const NOTES: NoteData[] = [
  {
    name: 'C',
    octave: 4,
    vexKey: 'c/4',
    fingering: '1+3',
    sharpFingering: '2+3',
    flatFingering: '1+3',
  },
  {
    name: 'D',
    octave: 4,
    vexKey: 'd/4',
    fingering: '1+3',
    sharpFingering: '1+2',
    flatFingering: '1+2',
  },
  {
    name: 'E',
    octave: 4,
    vexKey: 'e/4',
    fingering: '1+2',
    sharpFingering: '2',
    flatFingering: '1+2+3',
  },
  {
    name: 'F',
    octave: 4,
    vexKey: 'f/4',
    fingering: '1',
    sharpFingering: '2',
    flatFingering: '1+2',
  },
  {
    name: 'G',
    octave: 4,
    vexKey: 'g/4',
    fingering: '0',
    sharpFingering: '2',
    flatFingering: '2+3',
  },
  {
    name: 'A',
    octave: 4,
    vexKey: 'a/4',
    fingering: '1+2',
    sharpFingering: '2',
    flatFingering: '2+3',
  },
  {
    name: 'B',
    octave: 4,
    vexKey: 'b/4',
    fingering: '2',
    sharpFingering: '1',
    flatFingering: '1+2',
  },
  {
    name: 'C',
    octave: 5,
    vexKey: 'c/5',
    fingering: '0',
    sharpFingering: '2+3',
    flatFingering: '1+3',
  },
  {
    name: 'D',
    octave: 5,
    vexKey: 'd/5',
    fingering: '1+3',
    sharpFingering: '1+2',
    flatFingering: '1+2',
  },
  {
    name: 'E',
    octave: 5,
    vexKey: 'e/5',
    fingering: '1+2',
    sharpFingering: '2',
    flatFingering: '1+2+3',
  },
  {
    name: 'F',
    octave: 5,
    vexKey: 'f/5',
    fingering: '1',
    sharpFingering: '2',
    flatFingering: '1+2',
  },
  {
    name: 'G',
    octave: 5,
    vexKey: 'g/5',
    fingering: '0',
    sharpFingering: '2',
    flatFingering: '2+3',
  },
];

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

const getFingering = (
  note: NoteData,
  accidental: AccidentalType,
  instrument: Instrument
): string => {
  if (instrument === 'Trombone') {
    const trombone: Record<string, string> = {
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

    return trombone[`${note.name}${note.octave}`] || 'See position chart';
  }

  if (accidental === 'sharp') {
    return note.sharpFingering;
  }

  if (accidental === 'flat') {
    return note.flatFingering;
  }

  return note.fingering;
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

  let midi = 12 * (note.octave + 1) + semitones[note.name];

  if (accidental === 'sharp') {
    midi += 1;
  }

  if (accidental === 'flat') {
    midi -= 1;
  }

  // B♭ instruments sound a whole step lower than written.
  if (
    instrument === 'Bb Cornet' ||
    instrument === 'Bb Trumpet' ||
    instrument === 'Euphonium'
  ) {
    midi -= 2;
  }

  // E♭ horn sounds a major sixth lower than written.
  if (instrument === 'Eb Horn') {
    midi -= 9;
  }

  return 440 * Math.pow(2, (midi - 69) / 12);
};

export const MusicTutor: React.FC = () => {
  const staffRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const [selectedIndex, setSelectedIndex] = useState(3);
  const [accidental, setAccidental] =
    useState<AccidentalType>('natural');

  const [instrument, setInstrument] =
    useState<Instrument>('Bb Cornet');

  const selectedNote = NOTES[selectedIndex];

  const clef = instrumentClefs[instrument];

  const displayName =
    selectedNote.name +
    (accidental === 'sharp'
      ? '♯'
      : accidental === 'flat'
        ? '♭'
        : '') +
    selectedNote.octave;

  const fingering = getFingering(
    selectedNote,
    accidental,
    instrument
  );

  const frequency = getFrequency(
    selectedNote,
    accidental,
    instrument
  );

  const renderStaff = () => {
    if (!staffRef.current) return;

    staffRef.current.innerHTML = '';

    const width = 700;
    const height = 300;

    const renderer = new Renderer(
      staffRef.current,
      Renderer.Backends.SVG
    );

    renderer.resize(width, height);

    const context = renderer.getContext();

    const stave = new Stave(60, 70, 580);

    stave.addClef(clef);
    stave.addTimeSignature('4/4');

    stave.setContext(context).draw();

    const staveNote = new StaveNote({
      keys: [selectedNote.vexKey],
      duration: 'q',
      clef,
    });

    if (accidental === 'sharp') {
      staveNote.addModifier(new Accidental('#'), 0);
    }

    if (accidental === 'flat') {
      staveNote.addModifier(new Accidental('b'), 0);
    }

    if (accidental === 'natural') {
      staveNote.addModifier(new Accidental('n'), 0);
    }

    const voice = new Voice({
      numBeats: 4,
      beatValue: 4,
    });

    voice.setMode(Voice.Mode.SOFT);

    voice.addTickables([
      staveNote,
      new StaveNote({
        keys: [clef === 'bass' ? 'd/4' : 'c/4'],
        duration: 'qr',
        clef,
      }),
      new StaveNote({
        keys: [clef === 'bass' ? 'd/4' : 'c/4'],
        duration: 'qr',
        clef,
      }),
      new StaveNote({
        keys: [clef === 'bass' ? 'd/4' : 'c/4'],
        duration: 'qr',
        clef,
      }),
    ]);

    new Formatter()
      .joinVoices([voice])
      .format([voice], 450);

    voice.draw(context, stave);

    // Add a second visual staff line underneath
    const infoStave = new Stave(60, 190, 580);

    infoStave.setContext(context).draw();

    context.setFont('Arial', 16, 'bold');

    context.fillText(
      `${selectedNote.name}${
        accidental === 'sharp'
          ? '♯'
          : accidental === 'flat'
            ? '♭'
            : ''
      }${selectedNote.octave}`,
      90,
      235
    );

    context.setFont('Arial', 13, 'normal');

    context.fillText(
      `Fingering: ${fingering}`,
      180,
      235
    );

    context.fillText(
      `Instrument: ${instrument}`,
      360,
      235
    );
  };

  useEffect(() => {
    renderStaff();
  }, [
    selectedIndex,
    accidental,
    instrument,
  ]);

  const playNote = () => {
    if (!audioContextRef.current) {
      audioContextRef.current =
        new AudioContext();
    }

    const audioContext =
      audioContextRef.current;

    const oscillator =
      audioContext.createOscillator();

    const gain =
      audioContext.createGain();

    oscillator.type = 'triangle';

    oscillator.frequency.value =
      frequency;

    gain.gain.setValueAtTime(
      0.0001,
      audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      0.35,
      audioContext.currentTime + 0.03
    );

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      audioContext.currentTime + 1.3
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();

    oscillator.stop(
      audioContext.currentTime + 1.3
    );
  };

  const nextNote = () => {
    setSelectedIndex(
      (previous) =>
        (previous + 1) % NOTES.length
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
          Change the note, add sharps or flats,
          and instantly see the notation and
          fingering.
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
            <option>Bb Cornet</option>
            <option>Bb Trumpet</option>
            <option>Eb Horn</option>
            <option>Euphonium</option>
            <option>Trombone</option>
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

          {/* FREQUENCY */}
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

        {/* ACCIDENTAL CONTROLS */}
        <div className="mt-6">

          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
            Change Accidental
          </p>

          <div className="grid grid-cols-3 gap-3">

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

        {/* NOTE NAVIGATION */}
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

        {/* EXPLANATION */}
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
              Choose a note.
            </p>

            <p>
              <span className="font-semibold text-amber-300">
                3.
              </span>{' '}
              Change it to sharp, flat or natural.
            </p>

            <p>
              <span className="font-semibold text-amber-300">
                4.
              </span>{' '}
              Look at the actual symbol on the staff.
            </p>

            <p>
              <span className="font-semibold text-amber-300">
                5.
              </span>{' '}
              Check the fingering.
            </p>

            <p>
              <span className="font-semibold text-amber-300">
                6.
              </span>{' '}
              Press Play Note and listen.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default MusicTutor;
