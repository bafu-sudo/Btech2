import React, { useEffect, useRef, useState } from "react";
import {
  Renderer,
  Stave,
  StaveNote,
  Voice,
  Formatter,
  Accidental,
} from "vexflow";

/* =========================================================
   TYPES
========================================================= */

type Clef = "treble" | "bass";

type Instrument = {
  name: string;
  clef: Clef;
  transposition: string;
  description: string;
  fingeringType: "valves" | "slide" | "eb-horn";
};

type NoteData = {
  name: string;
  vexKey: string;
  concertFrequency: number;
  cornetFingering: string;
  euphoniumFingering: string;
  ebHornFingering: string;
  trombonePosition: string;
};

/* =========================================================
   INSTRUMENTS
========================================================= */

const instruments: Instrument[] = [
  {
    name: "B♭ Cornet",
    clef: "treble",
    transposition: "B♭ transposing",
    description:
      "A British brass-band B♭ instrument normally written in treble clef. Written C sounds as concert B♭.",
    fingeringType: "valves",
  },
  {
    name: "B♭ Trumpet",
    clef: "treble",
    transposition: "B♭ transposing",
    description:
      "A B♭ brass instrument normally written in treble clef. Written C sounds as concert B♭.",
    fingeringType: "valves",
  },
  {
    name: "E♭ Horn",
    clef: "treble",
    transposition: "E♭ transposing",
    description:
      "A British brass-band E♭ horn normally written in treble clef.",
    fingeringType: "eb-horn",
  },
  {
    name: "Euphonium",
    clef: "treble",
    transposition: "B♭ transposing",
    description:
      "A British brass-band euphonium is normally written in treble clef as a B♭ transposing instrument.",
    fingeringType: "valves",
  },
  {
    name: "Trombone",
    clef: "bass",
    transposition: "Concert pitch",
    description:
      "A trombone is commonly written in bass clef at concert pitch.",
    fingeringType: "slide",
  },
];

/* =========================================================
   NOTE DATA

   These are WRITTEN notes.

   For B♭ cornet/euphonium:
   C4 written = concert B♭3
   D4 written = concert C4
   etc.

   Frequencies below are CONCERT frequencies.
========================================================= */

const notes: NoteData[] = [
  {
    name: "C4",
    vexKey: "c/4",
    concertFrequency: 233.08,
    cornetFingering: "1 + 3",
    euphoniumFingering: "1 + 3",
    ebHornFingering: "1 + 3",
    trombonePosition: "6th",
  },
  {
    name: "D4",
    vexKey: "d/4",
    concertFrequency: 261.63,
    cornetFingering: "1 + 3",
    euphoniumFingering: "1 + 3",
    ebHornFingering: "2 + 3",
    trombonePosition: "4th",
  },
  {
    name: "E4",
    vexKey: "e/4",
    concertFrequency: 293.66,
    cornetFingering: "1 + 2",
    euphoniumFingering: "1 + 2",
    ebHornFingering: "1 + 2",
    trombonePosition: "2nd",
  },
  {
    name: "F4",
    vexKey: "f/4",
    concertFrequency: 311.13,
    cornetFingering: "1",
    euphoniumFingering: "1",
    ebHornFingering: "1",
    trombonePosition: "1st",
  },
  {
    name: "G4",
    vexKey: "g/4",
    concertFrequency: 349.23,
    cornetFingering: "0",
    euphoniumFingering: "0",
    ebHornFingering: "0",
    trombonePosition: "4th",
  },
  {
    name: "A4",
    vexKey: "a/4",
    concertFrequency: 392.0,
    cornetFingering: "1 + 2",
    euphoniumFingering: "1 + 2",
    ebHornFingering: "1 + 2",
    trombonePosition: "2nd",
  },
  {
    name: "B4",
    vexKey: "b/4",
    concertFrequency: 440.0,
    cornetFingering: "2",
    euphoniumFingering: "2",
    ebHornFingering: "2",
    trombonePosition: "1st",
  },
  {
    name: "C5",
    vexKey: "c/5",
    concertFrequency: 466.16,
    cornetFingering: "0",
    euphoniumFingering: "0",
    ebHornFingering: "0",
    trombonePosition: "4th",
  },
];

/* =========================================================
   TIME SIGNATURES
========================================================= */

const timeSignatures = [
  {
    value: "2/4",
    title: "Simple Duple",
    description:
      "Two quarter-note beats in each measure. Common in marches.",
    counting: "1 2 | 1 2",
  },
  {
    value: "3/4",
    title: "Simple Triple",
    description:
      "Three quarter-note beats in each measure. Common in waltzes.",
    counting: "1 2 3 | 1 2 3",
  },
  {
    value: "4/4",
    title: "Common Time",
    description:
      "Four quarter-note beats in each measure. One of the most common time signatures.",
    counting: "1 2 3 4 | 1 2 3 4",
  },
  {
    value: "5/4",
    title: "Five Beats",
    description:
      "Five quarter-note beats in each measure. It can be grouped 3+2 or 2+3.",
    counting: "1 2 3 1 2 | 1 2 3 1 2",
  },
  {
    value: "6/8",
    title: "Compound Duple",
    description:
      "Six eighth notes per measure, normally felt as two groups of three.",
    counting: "1-la-li 2-la-li",
  },
];

/* =========================================================
   TEMPO
========================================================= */

const tempoNames = [
  { name: "Largo", bpm: 50 },
  { name: "Adagio", bpm: 70 },
  { name: "Andante", bpm: 90 },
  { name: "Moderato", bpm: 110 },
  { name: "Allegro", bpm: 130 },
  { name: "Vivace", bpm: 150 },
  { name: "Presto", bpm: 180 },
];

/* =========================================================
   STAFF RENDERER
========================================================= */

function MusicStaff({
  selectedNote,
  clef,
  timeSignature,
}: {
  selectedNote: NoteData;
  clef: Clef;
  timeSignature: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    /*
      Completely remove the previous VexFlow SVG.
      This prevents old notes from remaining when
      the user selects another note.
    */
    container.innerHTML = "";

    const width = Math.max(
      800,
      container.clientWidth || 800
    );

    const height = 330;

    const renderer = new Renderer(
      container,
      Renderer.Backends.SVG
    );

    renderer.resize(width, height);

    const context = renderer.getContext();

    context.setFont(
      "Arial",
      16,
      "bold"
    );

    /*
      Create the staff.

      IMPORTANT:
      VexFlow pitch notation is:

      c/4 = middle C
      d/4 = D
      e/4 = E
      f/4 = F
      g/4 = G
      a/4 = A
      b/4 = B
      c/5 = high C

      In treble clef, c/4 is therefore
      below the staff with a ledger line.
    */

    const stave = new Stave(
      120,
      80,
      width - 180
    );

    stave
      .addClef(clef)
      .addTimeSignature(timeSignature);

    stave
      .setContext(context)
      .draw();

    /*
      Create ONE quarter note.

      We explicitly give VexFlow the selected
      pitch rather than trying to calculate
      the vertical position ourselves.
    */

    const note = new StaveNote({
      keys: [selectedNote.vexKey],
      duration: "q",
      clef,
    });

    /*
      Create a complete 4/4 voice.

      We use SOFT mode because this component
      is a learning display showing one note,
      not a complete measure of four notes.
    */

    const voice = new Voice({
      num_beats: 4,
      beat_value: 4,
    });

    voice.setMode(Voice.Mode.SOFT);

    voice.addTickables([note]);

    /*
      Format the note.

      This is the same basic VexFlow rendering
      pattern used by the official examples.
    */

    new Formatter()
      .joinVoices([voice])
      .format([voice], width - 300);

    /*
      Draw the note on the stave.
    */

    voice.draw(
      context,
      stave
    );

    /*
      Add educational labels BELOW the staff.
    */

    context.setFont(
      "Arial",
      22,
      "bold"
    );

    context.fillText(
      selectedNote.name,
      135,
      250
    );

    context.setFont(
      "Arial",
      15,
      "normal"
    );

    context.fillText(
      "Written note",
      135,
      275
    );

    /*
      Add a small explanation for C4
      so beginners can immediately see
      why it is below the treble staff.
    */

    if (
      selectedNote.name === "C4" &&
      clef === "treble"
    ) {
      context.setFont(
        "Arial",
        14,
        "normal"
      );

      context.fillText(
        "Middle C — ledger line below the treble staff",
        300,
        270
      );
    }
  }, [
    selectedNote,
    clef,
    timeSignature,
  ]);

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 18,
        padding: 18,
        overflowX: "auto",
        boxShadow:
          "0 10px 30px rgba(0,0,0,0.20)",
      }}
    >
      <div
        ref={containerRef}
        style={{
          minWidth: 800,
          width: "100%",
        }}
      />
    </div>
  );
}

/* =========================================================
   MAIN MUSIC TUTOR
========================================================= */

export default function MusicTutor() {
  const [selectedInstrument, setSelectedInstrument] =
    useState<Instrument>(instruments[0]);

  const [selectedNote, setSelectedNote] =
    useState<NoteData>(notes[0]);

  const [selectedTimeSignature, setSelectedTimeSignature] =
    useState("4/4");

  const [bpm, setBpm] = useState(90);

  const [isMetronomeRunning, setIsMetronomeRunning] =
    useState(false);

  const [audioContext, setAudioContext] =
    useState<AudioContext | null>(null);

  const metronomeRef =
    useRef<number | null>(null);

  /* =======================================================
     AUDIO CONTEXT
  ======================================================= */

  const getAudioContext = () => {
    const AudioContextClass =
      window.AudioContext ||
      (
        window as typeof window & {
          webkitAudioContext?: typeof AudioContext;
        }
      ).webkitAudioContext;

    if (!AudioContextClass) {
      return null;
    }

    const ctx =
      audioContext ||
      new AudioContextClass();

    if (!audioContext) {
      setAudioContext(ctx);
    }

    return ctx;
  };

  /* =======================================================
     PLAY NOTE
  ======================================================= */

  const playNote = () => {
    const ctx = getAudioContext();

    if (!ctx) return;

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    /*
      The stored frequency is the SOUNDING
      concert-pitch frequency.

      This is important for transposing instruments.
    */

    const oscillator =
      ctx.createOscillator();

    const gain =
      ctx.createGain();

    oscillator.type = "sine";

    oscillator.frequency.value =
      selectedNote.concertFrequency;

    gain.gain.setValueAtTime(
      0.0001,
      ctx.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      0.3,
      ctx.currentTime + 0.03
    );

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      ctx.currentTime + 0.9
    );

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start();

    oscillator.stop(
      ctx.currentTime + 0.9
    );
  };

  /* =======================================================
     METRONOME
  ======================================================= */

  const metronomeTick = () => {
    const ctx = getAudioContext();

    if (!ctx) return;

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const oscillator =
      ctx.createOscillator();

    const gain =
      ctx.createGain();

    oscillator.type = "square";

    oscillator.frequency.value = 1000;

    gain.gain.setValueAtTime(
      0.12,
      ctx.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      ctx.currentTime + 0.05
    );

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start();

    oscillator.stop(
      ctx.currentTime + 0.05
    );
  };

  useEffect(() => {
    if (!isMetronomeRunning) {
      if (
        metronomeRef.current !== null
      ) {
        window.clearInterval(
          metronomeRef.current
        );

        metronomeRef.current = null;
      }

      return;
    }

    const interval =
      (60 / bpm) * 1000;

    metronomeTick();

    metronomeRef.current =
      window.setInterval(
        metronomeTick,
        interval
      );

    return () => {
      if (
        metronomeRef.current !== null
      ) {
        window.clearInterval(
          metronomeRef.current
        );

        metronomeRef.current = null;
      }
    };
  }, [
    isMetronomeRunning,
    bpm,
  ]);

  /* =======================================================
     FINGERING
  ======================================================= */

  const getFingering = () => {
    switch (
      selectedInstrument.name
    ) {
      case "B♭ Cornet":
      case "B♭ Trumpet":
        return selectedNote.cornetFingering;

      case "Euphonium":
        return selectedNote.euphoniumFingering;

      case "E♭ Horn":
        return selectedNote.ebHornFingering;

      case "Trombone":
        return selectedNote.trombonePosition;

      default:
        return "—";
    }
  };

  /* =======================================================
     TRANSPOSITION INFORMATION
  ======================================================= */

  const getSoundingPitch = () => {
    if (
      selectedInstrument.transposition ===
      "B♭ transposing"
    ) {
      return `${selectedNote.name} written → sounds a whole step lower`;
    }

    if (
      selectedInstrument.transposition ===
      "E♭ transposing"
    ) {
      return `${selectedNote.name} written → sounds a major sixth lower`;
    }

    return `${selectedNote.name} sounds at concert pitch`;
  };

  /* =======================================================
     NEXT NOTE
  ======================================================= */

  const nextNote = () => {
    const index =
      notes.findIndex(
        (note) =>
          note.name ===
          selectedNote.name
      );

    const nextIndex =
      (index + 1) % notes.length;

    setSelectedNote(
      notes[nextIndex]
    );
  };

  /* =======================================================
     PREVIOUS NOTE
  ======================================================= */

  const previousNote = () => {
    const index =
      notes.findIndex(
        (note) =>
          note.name ===
          selectedNote.name
      );

    const previousIndex =
      (index - 1 + notes.length) %
      notes.length;

    setSelectedNote(
      notes[previousIndex]
    );
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #111827, #1f2937)",
        color: "#ffffff",
        padding: "30px 20px",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <header
          style={{
            marginBottom: 30,
          }}
        >
          <h1
            style={{
              fontSize: 38,
              fontWeight: 800,
              marginBottom: 8,
            }}
          >
            🎼 Music Tutor
          </h1>

          <p
            style={{
              color: "#d1d5db",
              fontSize: 17,
              lineHeight: 1.6,
            }}
          >
            Learn music notation, read the
            staff, understand rhythm, find
            fingerings and practise with
            sound and a metronome.
          </p>
        </header>

        {/* =================================================
            INSTRUMENT SELECTOR
        ================================================= */}

        <section
          style={{
            background: "#1f2937",
            padding: 24,
            borderRadius: 20,
            marginBottom: 24,
            border:
              "1px solid #374151",
          }}
        >
          <h2
            style={{
              fontSize: 24,
              fontWeight: 700,
              marginBottom: 15,
            }}
          >
            🎺 Select Your Instrument
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
            }}
          >
            {instruments.map(
              (instrument) => (
                <button
                  key={instrument.name}
                  onClick={() =>
                    setSelectedInstrument(
                      instrument
                    )
                  }
                  style={{
                    padding: 16,
                    borderRadius: 14,
                    border:
                      selectedInstrument.name ===
                      instrument.name
                        ? "2px solid #fbbf24"
                        : "1px solid #4b5563",
                    background:
                      selectedInstrument.name ===
                      instrument.name
                        ? "#92400e"
                        : "#111827",
                    color: "#ffffff",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <strong>
                    {instrument.name}
                  </strong>

                  <div
                    style={{
                      fontSize: 13,
                      color: "#d1d5db",
                      marginTop: 6,
                    }}
                  >
                    {instrument.clef ===
                    "treble"
                      ? "Treble clef"
                      : "Bass clef"}
                    {" • "}
                    {instrument.transposition}
                  </div>
                </button>
              )
            )}
          </div>

          <p
            style={{
              marginTop: 18,
              color: "#d1d5db",
              lineHeight: 1.7,
            }}
          >
            {selectedInstrument.description}
          </p>
        </section>

        {/* =================================================
            NOTE LESSON
        ================================================= */}

        <section
          style={{
            background: "#ffffff",
            color: "#111827",
            padding: 24,
            borderRadius: 20,
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              fontSize: 26,
              fontWeight: 800,
              marginBottom: 8,
            }}
          >
            🎵 Learn the Notes
          </h2>

          <p
            style={{
              color: "#4b5563",
              marginBottom: 20,
              lineHeight: 1.6,
            }}
          >
            Select a note to see its exact
            position on the staff and the
            fingering for your instrument.
          </p>

          {/* NOTE BUTTONS */}

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginBottom: 25,
            }}
          >
            {notes.map((note) => (
              <button
                key={note.name}
                onClick={() =>
                  setSelectedNote(note)
                }
                style={{
                  padding:
                    "10px 18px",
                  borderRadius: 10,
                  border:
                    selectedNote.name ===
                    note.name
                      ? "2px solid #d97706"
                      : "1px solid #d1d5db",
                  background:
                    selectedNote.name ===
                    note.name
                      ? "#fef3c7"
                      : "#f9fafb",
                  color: "#111827",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {note.name}
              </button>
            ))}
          </div>

          {/* REAL VEXFLOW STAFF */}

          <MusicStaff
            selectedNote={selectedNote}
            clef={
              selectedInstrument.clef
            }
            timeSignature={
              selectedTimeSignature
            }
          />

          {/* NOTE INFORMATION */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 15,
              marginTop: 20,
            }}
          >

            <div
              style={{
                background: "#f3f4f6",
                padding: 18,
                borderRadius: 14,
              }}
            >
              <strong>
                Written Note
              </strong>

              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  marginTop: 5,
                }}
              >
                {selectedNote.name}
              </div>
            </div>

            <div
              style={{
                background: "#f3f4f6",
                padding: 18,
                borderRadius: 14,
              }}
            >
              <strong>
                Fingering / Position
              </strong>

              <div
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  marginTop: 5,
                }}
              >
                {getFingering()}
              </div>
            </div>

            <div
              style={{
                background: "#f3f4f6",
                padding: 18,
                borderRadius: 14,
              }}
            >
              <strong>
                Sounding Frequency
              </strong>

              <div
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  marginTop: 5,
                }}
              >
                {selectedNote.concertFrequency.toFixed(
                  2
                )} Hz
              </div>
            </div>
          </div>

          {/* TRANSPOSITION */}

          <div
            style={{
              marginTop: 18,
              padding: 18,
              borderRadius: 14,
              background: "#eff6ff",
              border:
                "1px solid #bfdbfe",
              color: "#1e3a8a",
            }}
          >
            <strong>
              🎼 Written vs Sounding Pitch
            </strong>

            <p
              style={{
                marginTop: 8,
                lineHeight: 1.6,
              }}
            >
              {getSoundingPitch()}
            </p>
          </div>

          {/* PLAY / NAVIGATION */}

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginTop: 20,
            }}
          >
            <button
              onClick={previousNote}
              style={{
                padding:
                  "12px 22px",
                border: "none",
                borderRadius: 12,
                background: "#6b7280",
                color: "#ffffff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              ⬅ Previous
            </button>

            <button
              onClick={playNote}
              style={{
                padding:
                  "12px 22px",
                border: "none",
                borderRadius: 12,
                background: "#2563eb",
                color: "#ffffff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              🔊 Play Note
            </button>

            <button
              onClick={nextNote}
              style={{
                padding:
                  "12px 22px",
                border: "none",
                borderRadius: 12,
                background: "#059669",
                color: "#ffffff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Next Note ➡️
            </button>
          </div>
        </section>

        {/* =================================================
            CLEF LESSON
        ================================================= */}

        <section
          style={{
            background: "#1f2937",
            padding: 24,
            borderRadius: 20,
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              fontSize: 25,
              fontWeight: 800,
              marginBottom: 12,
            }}
          >
            🎼 Understanding Clefs
          </h2>

          <p
            style={{
              color: "#d1d5db",
              lineHeight: 1.7,
            }}
          >
            A clef tells you how the notes
            on the five-line staff should
            be named. The same sounding pitch
            can appear in a different position
            when a different clef is used.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 15,
              marginTop: 18,
            }}
          >
            <div
              style={{
                background: "#111827",
                padding: 18,
                borderRadius: 14,
              }}
            >
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                🎼 Treble Clef
              </h3>

              <p
                style={{
                  color: "#d1d5db",
                  marginTop: 8,
                  lineHeight: 1.6,
                }}
              >
                Common in brass-band music
                for cornet, trumpet, E♭ horn
                and euphonium.
              </p>
            </div>

            <div
              style={{
                background: "#111827",
                padding: 18,
                borderRadius: 14,
              }}
            >
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                𝄢 Bass Clef
              </h3>

              <p
                style={{
                  color: "#d1d5db",
                  marginTop: 8,
                  lineHeight: 1.6,
                }}
              >
                Commonly used for trombone
                and other low instruments.
              </p>
            </div>
          </div>
        </section>

        {/* =================================================
            TIME SIGNATURES
        ================================================= */}

        <section
          style={{
            background: "#ffffff",
            color: "#111827",
            padding: 24,
            borderRadius: 20,
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              fontSize: 25,
              fontWeight: 800,
              marginBottom: 12,
            }}
          >
            🥁 Time Signatures
          </h2>

          <p
            style={{
              color: "#4b5563",
              marginBottom: 18,
            }}
          >
            The top number tells you how
            many beats are grouped in the
            measure. The bottom number tells
            you which note value receives
            the beat.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            {timeSignatures.map(
              (signature) => (
                <button
                  key={signature.value}
                  onClick={() =>
                    setSelectedTimeSignature(
                      signature.value
                    )
                  }
                  style={{
                    padding:
                      "12px 20px",
                    borderRadius: 12,
                    border:
                      selectedTimeSignature ===
                      signature.value
                        ? "2px solid #2563eb"
                        : "1px solid #d1d5db",
                    background:
                      selectedTimeSignature ===
                      signature.value
                        ? "#dbeafe"
                        : "#f9fafb",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  {signature.value}
                </button>
              )
            )}
          </div>

          {(() => {
            const selected =
              timeSignatures.find(
                (item) =>
                  item.value ===
                  selectedTimeSignature
              );

            if (!selected) return null;

            return (
              <div
                style={{
                  marginTop: 20,
                  background: "#f3f4f6",
                  padding: 20,
                  borderRadius: 14,
                }}
              >
                <h3
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                  }}
                >
                  {selected.value} —{" "}
                  {selected.title}
                </h3>

                <p
                  style={{
                    marginTop: 8,
                    lineHeight: 1.6,
                  }}
                >
                  {selected.description}
                </p>

                <div
                  style={{
                    marginTop: 12,
                    fontFamily:
                      "monospace",
                    fontSize: 20,
                    fontWeight: 700,
                  }}
                >
                  Counting:{" "}
                  {selected.counting}
                </div>

                {selected.value ===
                  "6/8" && (
                  <p
                    style={{
                      marginTop: 12,
                      color: "#1d4ed8",
                      fontWeight: 700,
                    }}
                  >
                    💡 6/8 is normally felt
                    as TWO big beats, each
                    divided into three eighth
                    notes.
                  </p>
                )}
              </div>
            );
          })()}
        </section>

        {/* =================================================
            RHYTHM
        ================================================= */}

        <section
          style={{
            background: "#1f2937",
            padding: 24,
            borderRadius: 20,
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              fontSize: 25,
              fontWeight: 800,
              marginBottom: 12,
            }}
          >
            🥁 Rhythm Trainer
          </h2>

          <p
            style={{
              color: "#d1d5db",
              lineHeight: 1.7,
            }}
          >
            Learn the values of notes and
            rests. A rhythm tells you HOW
            LONG each sound or silence lasts.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(150px, 1fr))",
              gap: 12,
              marginTop: 20,
            }}
          >
            {[
              ["Quarter note", "1 beat"],
              ["Half note", "2 beats"],
              ["Whole note", "4 beats"],
              ["Eighth note", "½ beat"],
              ["Quarter rest", "1 beat silence"],
              ["Eighth rest", "½ beat silence"],
            ].map(
              ([rhythm, value]) => (
                <div
                  key={rhythm}
                  style={{
                    background: "#111827",
                    padding: 18,
                    borderRadius: 14,
                    textAlign: "center",
                    border:
                      "1px solid #374151",
                  }}
                >
                  <strong>
                    {rhythm}
                  </strong>

                  <div
                    style={{
                      color: "#fbbf24",
                      marginTop: 8,
                    }}
                  >
                    {value}
                  </div>
                </div>
              )
            )}
          </div>
        </section>

        {/* =================================================
            TEMPO
        ================================================= */}

        <section
          style={{
            background: "#ffffff",
            color: "#111827",
            padding: 24,
            borderRadius: 20,
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              fontSize: 25,
              fontWeight: 800,
              marginBottom: 12,
            }}
          >
            ⏱️ Tempo & Metronome
          </h2>

          <div
            style={{
              fontSize: 44,
              fontWeight: 900,
              textAlign: "center",
              margin: "20px 0",
            }}
          >
            {bpm} BPM
          </div>

          <input
            type="range"
            min="40"
            max="220"
            value={bpm}
            onChange={(event) =>
              setBpm(
                Number(
                  event.target.value
                )
              )
            }
            style={{
              width: "100%",
            }}
          />

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginTop: 20,
            }}
          >
            {tempoNames.map(
              (tempo) => (
                <button
                  key={tempo.name}
                  onClick={() =>
                    setBpm(tempo.bpm)
                  }
                  style={{
                    padding:
                      "10px 15px",
                    borderRadius: 10,
                    border:
                      "1px solid #d1d5db",
                    background:
                      "#f9fafb",
                    cursor: "pointer",
                  }}
                >
                  <strong>
                    {tempo.name}
                  </strong>

                  <br />

                  {tempo.bpm} BPM
                </button>
              )
            )}
          </div>

          <button
            onClick={() =>
              setIsMetronomeRunning(
                (running) =>
                  !running
              )
            }
            style={{
              width: "100%",
              marginTop: 22,
              padding: 15,
              border: "none",
              borderRadius: 14,
              background:
                isMetronomeRunning
                  ? "#dc2626"
                  : "#16a34a",
              color: "#ffffff",
              fontSize: 18,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            {isMetronomeRunning
              ? "⏹ Stop Metronome"
              : "▶ Start Metronome"}
          </button>
        </section>

        {/* =================================================
            PRACTICE MODE
        ================================================= */}

        <section
          style={{
            background:
              "linear-gradient(135deg, #92400e, #78350f)",
            padding: 28,
            borderRadius: 20,
            marginBottom: 30,
          }}
        >
          <h2
            style={{
              fontSize: 28,
              fontWeight: 900,
              marginBottom: 12,
            }}
          >
            🎺 Practice Mode
          </h2>

          <p
            style={{
              color: "#fef3c7",
              lineHeight: 1.7,
            }}
          >
            Follow this sequence when
            practising:
          </p>

          <ol
            style={{
              marginTop: 12,
              paddingLeft: 22,
              color: "#ffffff",
              lineHeight: 2,
            }}
          >
            <li>
              Select your instrument.
            </li>

            <li>
              Select a note.
            </li>

            <li>
              Identify its position on
              the staff.
            </li>

            <li>
              Say the note name.
            </li>

            <li>
              Check the fingering.
            </li>

            <li>
              Play the note.
            </li>

            <li>
              Practise with the metronome.
            </li>

            <li>
              Move to the next note.
            </li>
          </ol>
        </section>

        {/* =================================================
            FOOTER
        ================================================= */}

        <footer
          style={{
            textAlign: "center",
            color: "#9ca3af",
            padding: 20,
          }}
        >
          <p>
            🎼 Btech2 Music Tutor
          </p>

          <p
            style={{
              fontSize: 13,
              marginTop: 5,
            }}
          >
            Learn • Read • Play • Improve
          </p>
        </footer>
      </div>
    </div>
  );
}
