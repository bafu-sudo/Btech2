import React, { useEffect, useRef, useState } from "react";
import {
  Renderer,
  Stave,
  StaveNote,
  Voice,
  Formatter,
} from "vexflow";

/* =========================================================
   TYPES
========================================================= */

type Instrument = {
  name: string;
  clef: "treble" | "bass";
  transposition: string;
  description: string;
};

type NoteData = {
  name: string;
  vexKey: string;
  frequency: number;
  cornetFingering: string;
  euphoniumFingering: string;
};

/* =========================================================
   INSTRUMENTS
========================================================= */

const instruments: Instrument[] = [
  {
    name: "B♭ Cornet",
    clef: "treble",
    transposition: "B♭",
    description:
      "A British brass-band instrument normally written in treble clef as a B♭ transposing instrument.",
  },
  {
    name: "B♭ Trumpet",
    clef: "treble",
    transposition: "B♭",
    description:
      "A B♭ transposing brass instrument normally written in treble clef.",
  },
  {
    name: "E♭ Horn",
    clef: "treble",
    transposition: "E♭",
    description:
      "An E♭ brass-band horn normally written in treble clef.",
  },
  {
    name: "Euphonium",
    clef: "treble",
    transposition: "B♭",
    description:
      "A British brass-band euphonium normally written in treble clef as a B♭ transposing instrument.",
  },
  {
    name: "Trombone",
    clef: "bass",
    transposition: "Concert",
    description:
      "A low brass instrument commonly written in bass clef.",
  },
];

/* =========================================================
   NOTE DATA
========================================================= */

const notes: NoteData[] = [
  {
    name: "C4",
    vexKey: "c/4",
    frequency: 261.63,
    cornetFingering: "0",
    euphoniumFingering: "1 + 3",
  },
  {
    name: "D4",
    vexKey: "d/4",
    frequency: 293.66,
    cornetFingering: "1 + 3",
    euphoniumFingering: "1 + 2",
  },
  {
    name: "E4",
    vexKey: "e/4",
    frequency: 329.63,
    cornetFingering: "1 + 2",
    euphoniumFingering: "2",
  },
  {
    name: "F4",
    vexKey: "f/4",
    frequency: 349.23,
    cornetFingering: "1",
    euphoniumFingering: "0",
  },
  {
    name: "G4",
    vexKey: "g/4",
    frequency: 392.0,
    cornetFingering: "0",
    euphoniumFingering: "1 + 2",
  },
  {
    name: "A4",
    vexKey: "a/4",
    frequency: 440,
    cornetFingering: "1 + 2",
    euphoniumFingering: "2",
  },
  {
    name: "B4",
    vexKey: "b/4",
    frequency: 493.88,
    cornetFingering: "2",
    euphoniumFingering: "1",
  },
  {
    name: "C5",
    vexKey: "c/5",
    frequency: 523.25,
    cornetFingering: "0",
    euphoniumFingering: "0",
  },
];

/* =========================================================
   TIME SIGNATURES
========================================================= */

const timeSignatures = [
  {
    value: "2/4",
    description:
      "Two quarter-note beats in each measure. Common in marches.",
    counting: "1 2 | 1 2",
  },
  {
    value: "3/4",
    description:
      "Three quarter-note beats in each measure. Common in waltzes.",
    counting: "1 2 3 | 1 2 3",
  },
  {
    value: "4/4",
    description:
      "Four quarter-note beats in each measure. One of the most common time signatures.",
    counting: "1 2 3 4 | 1 2 3 4",
  },
  {
    value: "5/4",
    description:
      "Five quarter-note beats in each measure.",
    counting: "1 2 3 4 5",
  },
  {
    value: "6/8",
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
   MUSIC STAFF
========================================================= */

function MusicStaff({
  selectedNote,
  clef,
  timeSignature,
}: {
  selectedNote: NoteData;
  clef: "treble" | "bass";
  timeSignature: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    // Completely clear the previous SVG.
    container.innerHTML = "";

    const width = Math.max(
      760,
      container.clientWidth || 760
    );

    const height = 300;

    const renderer = new Renderer(
      container,
      Renderer.Backends.SVG
    );

    renderer.resize(width, height);

    const context = renderer.getContext();

    /*
      IMPORTANT:

      VexFlow uses key/octave notation.

      c/4 = middle C
      d/4 = D above middle C
      e/4 = E above middle C
      etc.

      In treble clef, C4 belongs BELOW the staff
      on its own ledger line.

      We deliberately create the note using the
      selectedNote.vexKey instead of calculating
      the staff position ourselves.
    */

    const stave = new Stave(
      80,
      70,
      width - 140
    );

    stave
      .addClef(clef)
      .addTimeSignature(timeSignature);

    stave.setContext(context).draw();

    const note = new StaveNote({
      keys: [selectedNote.vexKey],
      duration: "q",
      clef: clef,
    });

    /*
      Draw the note through a Voice so VexFlow
      calculates the correct vertical position,
      including ledger lines.
    */

    const voice = new Voice({
      numBeats: 1,
      beatValue: 4,
    });

    voice.setStrict(false);

    voice.addTickables([note]);

    new Formatter()
      .joinVoices([voice])
      .format([voice], width - 300);

    voice.draw(context, stave);

    /*
      Add a small label underneath the staff.
      This is only for the learning interface.
    */

    context.setFont("Arial", 18, "bold");

    context.fillText(
      selectedNote.name,
      90,
      245
    );
  }, [
    selectedNote.vexKey,
    selectedNote.name,
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
          "0 10px 30px rgba(0,0,0,0.25)",
      }}
    >
      <div
        ref={containerRef}
        style={{
          minWidth: 760,
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
     AUDIO
  ======================================================= */

  const playNote = (frequency: number) => {
    const AudioContextClass =
      window.AudioContext ||
      (
        window as typeof window & {
          webkitAudioContext?: typeof AudioContext;
        }
      ).webkitAudioContext;

    if (!AudioContextClass) return;

    const ctx =
      audioContext || new AudioContextClass();

    if (!audioContext) {
      setAudioContext(ctx);
    }

    const oscillator =
      ctx.createOscillator();

    const gain =
      ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value =
      frequency;

    gain.gain.setValueAtTime(
      0.0001,
      ctx.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      0.3,
      ctx.currentTime + 0.02
    );

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      ctx.currentTime + 0.8
    );

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start();

    oscillator.stop(
      ctx.currentTime + 0.8
    );
  };

  /* =======================================================
     METRONOME
  ======================================================= */

  const metronomeTick = () => {
    const AudioContextClass =
      window.AudioContext ||
      (
        window as typeof window & {
          webkitAudioContext?: typeof AudioContext;
        }
      ).webkitAudioContext;

    if (!AudioContextClass) return;

    const ctx =
      audioContext || new AudioContextClass();

    if (!audioContext) {
      setAudioContext(ctx);
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
      if (metronomeRef.current !== null) {
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
      if (metronomeRef.current !== null) {
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
    if (
      selectedInstrument.name ===
        "B♭ Cornet" ||
      selectedInstrument.name ===
        "B♭ Trumpet"
    ) {
      return selectedNote.cornetFingering;
    }

    if (
      selectedInstrument.name ===
      "Euphonium"
    ) {
      return selectedNote.euphoniumFingering;
    }

    if (
      selectedInstrument.name ===
      "Trombone"
    ) {
      return "Slide position depends on note";
    }

    if (
      selectedInstrument.name ===
      "E♭ Horn"
    ) {
      return "Use E♭ horn fingering chart";
    }

    return "—";
  };

  /* =======================================================
     NEXT NOTE
  ======================================================= */

  const nextNote = () => {
    const index =
      notes.findIndex(
        (note) =>
          note.name === selectedNote.name
      );

    const nextIndex =
      (index + 1) % notes.length;

    setSelectedNote(
      notes[nextIndex]
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
            }}
          >
            Learn music notation, notes,
            fingerings, rhythm, clefs,
            time signatures and tempo.
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
              lineHeight: 1.6,
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
            }}
          >
            Select a note and see exactly
            where it belongs on the staff.
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

          {/* STAFF */}

          <MusicStaff
            selectedNote={selectedNote}
            clef={selectedInstrument.clef}
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
                Note
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
                Fingering
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
                Frequency
              </strong>

              <div
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  marginTop: 5,
                }}
              >
                {selectedNote.frequency.toFixed(
                  2
                )} Hz
              </div>
            </div>
          </div>

          {/* PLAY */}

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginTop: 20,
            }}
          >
            <button
              onClick={() =>
                playNote(
                  selectedNote.frequency
                )
              }
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
              ➡️ Next Note
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
            🎼 Clefs
          </h2>

          <p
            style={{
              color: "#d1d5db",
              lineHeight: 1.7,
            }}
          >
            A clef tells you how the notes
            on the staff should be named.
            Different instruments use
            different clefs because their
            ranges are different.
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
                Treble Clef
              </h3>

              <p
                style={{
                  color: "#d1d5db",
                  marginTop: 8,
                }}
              >
                Commonly used for cornet,
                trumpet, E♭ horn and
                brass-band euphonium.
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
                Bass Clef
              </h3>

              <p
                style={{
                  color: "#d1d5db",
                  marginTop: 8,
                }}
              >
                Commonly used for trombone
                and other lower-pitched
                instruments.
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
            Choose a time signature to see
            how the beats are counted.
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
                  {selected.value}
                </h3>

                <p
                  style={{
                    marginTop: 8,
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
                  Counting:
                  {" "}
                  {selected.counting}
                </div>
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
            Practice counting quarter notes,
            eighth notes and rests. Start
            slowly and increase your tempo
            as you become comfortable.
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
              "Quarter note",
              "Half note",
              "Whole note",
              "Eighth notes",
              "Quarter rest",
              "Eighth rest",
            ].map((rhythm) => (
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
                {rhythm}
              </div>
            ))}
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
                Number(event.target.value)
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
                (running) => !running
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
            PRACTICE
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
            Your practice routine:
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
              Identify the note on the
              staff.
            </li>

            <li>
              Check the fingering.
            </li>

            <li>
              Play the note.
            </li>

            <li>
              Practice with the
              metronome.
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
