import React, { useEffect, useRef, useState } from "react";
import {
  Renderer,
  Stave,
  StaveNote,
  Voice,
  Formatter,
} from "vexflow";

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
   AUDIO
========================================================= */

function playTone(
  frequency: number,
  duration = 0.8
) {
  const AudioContextClass =
    window.AudioContext ||
    (window as typeof window & {
      webkitAudioContext?: typeof AudioContext;
    }).webkitAudioContext;

  if (!AudioContextClass) return;

  const audioContext = new AudioContextClass();

  const oscillator =
    audioContext.createOscillator();

  const gain =
    audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = frequency;

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
    audioContext.currentTime + duration
  );

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start();

  oscillator.stop(
    audioContext.currentTime + duration
  );

  oscillator.onended = () => {
    audioContext.close();
  };
}

/* =========================================================
   METRONOME
========================================================= */

function playMetronomeClick() {
  const AudioContextClass =
    window.AudioContext ||
    (window as typeof window & {
      webkitAudioContext?: typeof AudioContext;
    }).webkitAudioContext;

  if (!AudioContextClass) return;

  const audioContext = new AudioContextClass();

  const oscillator =
    audioContext.createOscillator();

  const gain =
    audioContext.createGain();

  oscillator.type = "square";
  oscillator.frequency.value = 1000;

  gain.gain.setValueAtTime(
    0.25,
    audioContext.currentTime
  );

  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + 0.06
  );

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start();

  oscillator.stop(
    audioContext.currentTime + 0.06
  );

  oscillator.onended = () => {
    audioContext.close();
  };
}

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
  const containerRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    /*
      Clear the previous VexFlow SVG.
      This prevents multiple staffs being stacked
      when the student changes notes.
    */
    containerRef.current.innerHTML = "";

    const width = Math.max(
      760,
      containerRef.current.clientWidth || 760
    );

    const height = 300;

    const renderer = new Renderer(
      containerRef.current,
      Renderer.Backends.SVG
    );

    renderer.resize(width, height);

    const context = renderer.getContext();

    /*
      Create the actual musical staff.
    */
    const stave = new Stave(
      80,
      80,
      width - 140
    );

    /*
      Add the correct clef.

      TREBLE:
      C4 = ledger line below the staff.

      BASS:
      C4 = ledger line above the staff.

      VexFlow handles this positioning automatically.
    */
    stave.addClef(clef);

    /*
      Add the selected time signature.
    */
    stave.addTimeSignature(timeSignature);

    stave.setContext(context).draw();

    /*
      IMPORTANT:

      selectedNote.vexKey contains real VexFlow
      pitch notation such as:

      c/4
      d/4
      e/4
      f/4
      g/4
      a/4
      b/4
      c/5

      VexFlow therefore calculates the actual
      vertical position of the note on the staff.
    */
    const note = new StaveNote({
      keys: [selectedNote.vexKey],
      duration: "q",
      clef: clef,
    });

    /*
      Create a voice containing the quarter note.
    */
    const voice = new Voice({
      numBeats: 1,
      beatValue: 4,
    });

    voice.addTickables([note]);

    /*
      Format the note so it appears properly
      inside the staff.
    */
    new Formatter()
      .joinVoices([voice])
      .format([voice], 400);

    /*
      Draw the actual note.
    */
    voice.draw(context, stave);
  }, [
    selectedNote.vexKey,
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
  const [instrumentIndex, setInstrumentIndex] =
    useState(0);

  const [selectedNoteIndex, setSelectedNoteIndex] =
    useState(0);

  const [timeSignature, setTimeSignature] =
    useState("4/4");

  const [bpm, setBpm] = useState(90);

  const [metronomeRunning, setMetronomeRunning] =
    useState(false);

  const [activeLesson, setActiveLesson] =
    useState("notes");

  const selectedInstrument =
    instruments[instrumentIndex];

  const selectedNote =
    notes[selectedNoteIndex];

  const currentFingering =
    selectedInstrument.name === "Euphonium"
      ? selectedNote.euphoniumFingering
      : selectedInstrument.name === "Trombone"
      ? "See trombone slide position"
      : selectedNote.cornetFingering;

  /*
    Metronome effect.
  */
  useEffect(() => {
    if (!metronomeRunning) return;

    const interval =
      window.setInterval(() => {
        playMetronomeClick();
      }, (60 / bpm) * 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [metronomeRunning, bpm]);

  const increaseTempo = () => {
    setBpm((old) =>
      Math.min(240, old + 5)
    );
  };

  const decreaseTempo = () => {
    setBpm((old) =>
      Math.max(30, old - 5)
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #111827, #1f2937)",
        color: "#ffffff",
        padding: 24,
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            marginBottom: 28,
          }}
        >
          <h1
            style={{
              fontSize: 36,
              fontWeight: 800,
              marginBottom: 8,
            }}
          >
            🎼 Btech Music Academy
          </h1>

          <p
            style={{
              color: "#d1d5db",
              fontSize: 18,
            }}
          >
            Learn Music. See It. Hear It. Play It.
          </p>

          <p
            style={{
              color: "#9ca3af",
              marginTop: 8,
            }}
          >
            A practical music tutor for brass-band
            students learning notes, rhythm, clefs,
            fingerings and notation.
          </p>
        </div>

        {/* =================================================
            INSTRUMENT SELECTOR
        ================================================= */}

        <div
          style={{
            background: "#1f2937",
            borderRadius: 18,
            padding: 20,
            marginBottom: 24,
            border: "1px solid #374151",
          }}
        >
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              marginBottom: 14,
            }}
          >
            🎺 Choose Your Instrument
          </h2>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            {instruments.map(
              (instrument, index) => (
                <button
                  key={instrument.name}
                  onClick={() =>
                    setInstrumentIndex(index)
                  }
                  style={{
                    padding:
                      "10px 16px",
                    borderRadius: 10,
                    border:
                      index ===
                      instrumentIndex
                        ? "2px solid #fbbf24"
                        : "1px solid #4b5563",
                    background:
                      index ===
                      instrumentIndex
                        ? "#92400e"
                        : "#111827",
                    color: "#ffffff",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  {instrument.name}
                </button>
              )
            )}
          </div>

          <div
            style={{
              marginTop: 16,
              padding: 14,
              background: "#111827",
              borderRadius: 12,
            }}
          >
            <strong>
              {selectedInstrument.name}
            </strong>

            <div
              style={{
                color: "#d1d5db",
                marginTop: 6,
              }}
            >
              Clef:{" "}
              {selectedInstrument.clef ===
              "treble"
                ? "Treble Clef"
                : "Bass Clef"}
            </div>

            <div
              style={{
                color: "#d1d5db",
                marginTop: 4,
              }}
            >
              Transposition:{" "}
              {selectedInstrument.transposition}
            </div>

            <p
              style={{
                color: "#9ca3af",
                marginTop: 8,
              }}
            >
              {selectedInstrument.description}
            </p>
          </div>
        </div>

        {/* =================================================
            LESSON NAVIGATION
        ================================================= */}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 24,
          }}
        >
          {[
            ["notes", "🎵 Notes"],
            ["clefs", "𝄞 Clefs"],
            ["time", "4/4 Time"],
            ["rhythm", "🥁 Rhythm"],
            ["tempo", "⏱ Tempo"],
            ["practice", "🎺 Practice"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() =>
                setActiveLesson(id)
              }
              style={{
                padding:
                  "10px 16px",
                borderRadius: 10,
                border:
                  activeLesson === id
                    ? "2px solid #fbbf24"
                    : "1px solid #4b5563",
                background:
                  activeLesson === id
                    ? "#92400e"
                    : "#111827",
                color: "#ffffff",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* =================================================
            NOTES LESSON
        ================================================= */}

        {activeLesson === "notes" && (
          <div>
            <div
              style={{
                background: "#1f2937",
                padding: 22,
                borderRadius: 18,
                marginBottom: 20,
              }}
            >
              <h2
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  marginBottom: 10,
                }}
              >
                🎵 Learn the Notes
              </h2>

              <p
                style={{
                  color: "#d1d5db",
                  lineHeight: 1.6,
                }}
              >
                Select a note below. The tutor will
                show the real note on a musical staff,
                the note name and the fingering for
                your selected instrument.
              </p>
            </div>

            {/* NOTE BUTTONS */}

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                marginBottom: 20,
              }}
            >
              {notes.map(
                (note, index) => (
                  <button
                    key={note.name}
                    onClick={() =>
                      setSelectedNoteIndex(
                        index
                      )
                    }
                    style={{
                      minWidth: 75,
                      padding: "12px 18px",
                      borderRadius: 12,
                      border:
                        index ===
                        selectedNoteIndex
                          ? "3px solid #fbbf24"
                          : "1px solid #4b5563",
                      background:
                        index ===
                        selectedNoteIndex
                          ? "#92400e"
                          : "#1f2937",
                      color: "#ffffff",
                      cursor: "pointer",
                      fontSize: 18,
                      fontWeight: 700,
                    }}
                  >
                    {note.name}
                  </button>
                )
              )}
            </div>

            {/* REAL STAFF */}

            <MusicStaff
              selectedNote={selectedNote}
              clef={selectedInstrument.clef}
              timeSignature={
                timeSignature
              }
            />

            {/* NOTE INFORMATION */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(220px,1fr))",
                gap: 16,
                marginTop: 20,
              }}
            >
              <div
                style={{
                  background: "#1f2937",
                  padding: 20,
                  borderRadius: 16,
                }}
              >
                <div
                  style={{
                    color: "#9ca3af",
                    fontSize: 14,
                  }}
                >
                  NOTE
                </div>

                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                    marginTop: 5,
                  }}
                >
                  {selectedNote.name}
                </div>
              </div>

              <div
                style={{
                  background: "#1f2937",
                  padding: 20,
                  borderRadius: 16,
                }}
              >
                <div
                  style={{
                    color: "#9ca3af",
                    fontSize: 14,
                  }}
                >
                  FINGERING
                </div>

                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    marginTop: 5,
                  }}
                >
                  {currentFingering}
                </div>
              </div>

              <div
                style={{
                  background: "#1f2937",
                  padding: 20,
                  borderRadius: 16,
                }}
              >
                <div
                  style={{
                    color: "#9ca3af",
                    fontSize: 14,
                  }}
                >
                  WRITTEN CLEF
                </div>

                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    marginTop: 5,
                  }}
                >
                  {selectedInstrument.clef ===
                  "treble"
                    ? "Treble"
                    : "Bass"}
                </div>
              </div>
            </div>

            {/* PLAY */}

            <button
              onClick={() =>
                playTone(
                  selectedNote.frequency
                )
              }
              style={{
                marginTop: 20,
                width: "100%",
                padding: 16,
                borderRadius: 14,
                border: "none",
                background: "#f59e0b",
                color: "#111827",
                cursor: "pointer",
                fontWeight: 800,
                fontSize: 18,
              }}
            >
              🔊 Play {selectedNote.name}
            </button>
          </div>
        )}

        {/* =================================================
            CLEFS LESSON
        ================================================= */}

        {activeLesson === "clefs" && (
          <div
            style={{
              background: "#1f2937",
              padding: 24,
              borderRadius: 18,
            }}
          >
            <h2
              style={{
                fontSize: 28,
                fontWeight: 800,
                marginBottom: 18,
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
              A clef tells the musician how the
              notes on the staff should be
              interpreted. Different instruments use
              different clefs because their comfortable
              pitch ranges are different.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(260px,1fr))",
                gap: 18,
                marginTop: 22,
              }}
            >
              <div
                style={{
                  background: "#111827",
                  padding: 20,
                  borderRadius: 14,
                }}
              >
                <div
                  style={{
                    fontSize: 70,
                    lineHeight: 1,
                  }}
                >
                  𝄞
                </div>

                <h3
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    marginTop: 10,
                  }}
                >
                  Treble Clef
                </h3>

                <p
                  style={{
                    color: "#9ca3af",
                    marginTop: 8,
                  }}
                >
                  Commonly used for B♭ cornet,
                  trumpet and E♭ horn in brass-band
                  notation.
                </p>
              </div>

              <div
                style={{
                  background: "#111827",
                  padding: 20,
                  borderRadius: 14,
                }}
              >
                <div
                  style={{
                    fontSize: 70,
                    lineHeight: 1,
                  }}
                >
                  𝄢
                </div>

                <h3
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    marginTop: 10,
                  }}
                >
                  Bass Clef
                </h3>

                <p
                  style={{
                    color: "#9ca3af",
                    marginTop: 8,
                  }}
                >
                  Commonly used for trombone and
                  other low instruments when written
                  at concert pitch.
                </p>
              </div>
            </div>

            <div
              style={{
                marginTop: 22,
                padding: 18,
                background: "#111827",
                borderRadius: 14,
              }}
            >
              <strong>
                Important:
              </strong>

              <p
                style={{
                  color: "#d1d5db",
                  marginTop: 8,
                  lineHeight: 1.6,
                }}
              >
                The same sounding pitch can appear
                in a different position when a
                different clef is used. The clef
                changes how the staff is read.
              </p>
            </div>
          </div>
        )}

        {/* =================================================
            TIME SIGNATURE LESSON
        ================================================= */}

        {activeLesson === "time" && (
          <div
            style={{
              background: "#1f2937",
              padding: 24,
              borderRadius: 18,
            }}
          >
            <h2
              style={{
                fontSize: 28,
                fontWeight: 800,
                marginBottom: 18,
              }}
            >
              🕐 Time Signatures
            </h2>

            <p
              style={{
                color: "#d1d5db",
                lineHeight: 1.7,
              }}
            >
              The top number tells you how many
              beats are in each measure. The bottom
              number tells you which note value
              represents one beat.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                marginTop: 20,
              }}
            >
              {timeSignatures.map(
                (signature) => (
                  <button
                    key={signature.value}
                    onClick={() =>
                      setTimeSignature(
                        signature.value
                      )
                    }
                    style={{
                      padding:
                        "12px 20px",
                      borderRadius: 12,
                      border:
                        timeSignature ===
                        signature.value
                          ? "3px solid #fbbf24"
                          : "1px solid #4b5563",
                      background:
                        timeSignature ===
                        signature.value
                          ? "#92400e"
                          : "#111827",
                      color: "#ffffff",
                      cursor: "pointer",
                      fontWeight: 800,
                      fontSize: 18,
                    }}
                  >
                    {signature.value}
                  </button>
                )
              )}
            </div>

            {timeSignatures
              .filter(
                (item) =>
                  item.value ===
                  timeSignature
              )
              .map((item) => (
                <div
                  key={item.value}
                  style={{
                    marginTop: 24,
                    background: "#111827",
                    padding: 22,
                    borderRadius: 16,
                  }}
                >
                  <div
                    style={{
                      fontSize: 48,
                      fontWeight: 900,
                    }}
                  >
                    {item.value}
                  </div>

                  <p
                    style={{
                      color: "#d1d5db",
                      marginTop: 10,
                      lineHeight: 1.6,
                    }}
                  >
                    {item.description}
                  </p>

                  <div
                    style={{
                      marginTop: 14,
                      fontSize: 22,
                      fontWeight: 700,
                    }}
                  >
                    Count:
                  </div>

                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 26,
                      color: "#fbbf24",
                    }}
                  >
                    {item.counting}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* =================================================
            RHYTHM LESSON
        ================================================= */}

        {activeLesson === "rhythm" && (
          <div
            style={{
              background: "#1f2937",
              padding: 24,
              borderRadius: 18,
            }}
          >
            <h2
              style={{
                fontSize: 28,
                fontWeight: 800,
                marginBottom: 18,
              }}
            >
              🥁 Rhythm
            </h2>

            <p
              style={{
                color: "#d1d5db",
                lineHeight: 1.7,
              }}
            >
              Rhythm tells you how long each note
              or rest lasts. Learning rhythm is just
              as important as learning note names.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(180px,1fr))",
                gap: 14,
                marginTop: 22,
              }}
            >
              {[
                ["𝅝", "Whole Note", "4 beats"],
                ["𝅗𝅥", "Half Note", "2 beats"],
                ["♩", "Quarter Note", "1 beat"],
                ["♪", "Eighth Note", "½ beat"],
                ["𝄽", "Quarter Rest", "1 beat"],
              ].map(
                ([symbol, name, duration]) => (
                  <div
                    key={name}
                    style={{
                      background: "#111827",
                      padding: 20,
                      borderRadius: 14,
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 52,
                      }}
                    >
                      {symbol}
                    </div>

                    <strong>
                      {name}
                    </strong>

                    <div
                      style={{
                        color: "#9ca3af",
                        marginTop: 5,
                      }}
                    >
                      {duration}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* =================================================
            TEMPO LESSON
        ================================================= */}

        {activeLesson === "tempo" && (
          <div
            style={{
              background: "#1f2937",
              padding: 24,
              borderRadius: 18,
            }}
          >
            <h2
              style={{
                fontSize: 28,
                fontWeight: 800,
                marginBottom: 18,
              }}
            >
              ⏱ Tempo & Metronome
            </h2>

            <p
              style={{
                color: "#d1d5db",
                lineHeight: 1.7,
              }}
            >
              Tempo tells you how fast the music
              should be performed. BPM means beats
              per minute.
            </p>

            {/* BPM DISPLAY */}

            <div
              style={{
                marginTop: 22,
                background: "#111827",
                padding: 24,
                borderRadius: 16,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  color: "#9ca3af",
                }}
              >
                CURRENT TEMPO
              </div>

              <div
                style={{
                  fontSize: 56,
                  fontWeight: 900,
                  marginTop: 5,
                }}
              >
                {bpm}
              </div>

              <div
                style={{
                  color: "#fbbf24",
                  fontSize: 18,
                }}
              >
                BPM
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 10,
                  marginTop: 18,
                }}
              >
                <button
                  onClick={decreaseTempo}
                  style={{
                    padding:
                      "10px 20px",
                    borderRadius: 10,
                    border:
                      "1px solid #4b5563",
                    background:
                      "#1f2937",
                    color: "#ffffff",
                    cursor: "pointer",
                    fontSize: 20,
                  }}
                >
                  −
                </button>

                <button
                  onClick={increaseTempo}
                  style={{
                    padding:
                      "10px 20px",
                    borderRadius: 10,
                    border:
                      "1px solid #4b5563",
                    background:
                      "#1f2937",
                    color: "#ffffff",
                    cursor: "pointer",
                    fontSize: 20,
                  }}
                >
                  +
                </button>
              </div>

              <button
                onClick={() =>
                  setMetronomeRunning(
                    (old) => !old
                  )
                }
                style={{
                  marginTop: 18,
                  width: "100%",
                  padding: 15,
                  borderRadius: 12,
                  border: "none",
                  background:
                    metronomeRunning
                      ? "#dc2626"
                      : "#f59e0b",
                  color: "#111827",
                  cursor: "pointer",
                  fontWeight: 800,
                  fontSize: 18,
                }}
              >
                {metronomeRunning
                  ? "⏹ Stop Metronome"
                  : "▶ Start Metronome"}
              </button>
            </div>

            {/* TEMPO WORDS */}

            <div
              style={{
                marginTop: 20,
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(130px,1fr))",
                gap: 10,
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
                      padding: 14,
                      borderRadius: 12,
                      border:
                        "1px solid #4b5563",
                      background:
                        "#111827",
                      color: "#ffffff",
                      cursor: "pointer",
                    }}
                  >
                    <strong>
                      {tempo.name}
                    </strong>

                    <div
                      style={{
                        color: "#9ca3af",
                        marginTop: 4,
                      }}
                    >
                      {tempo.bpm} BPM
                    </div>
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* =================================================
            PRACTICE
        ================================================= */}

        {activeLesson === "practice" && (
          <div
            style={{
              background: "#1f2937",
              padding: 24,
              borderRadius: 18,
            }}
          >
            <h2
              style={{
                fontSize: 28,
                fontWeight: 800,
                marginBottom: 10,
              }}
            >
              🎺 Practice
            </h2>

            <p
              style={{
                color: "#d1d5db",
                lineHeight: 1.7,
              }}
            >
              Practice the selected note slowly.
              Look at the staff, identify the note,
              use the correct fingering and then play
              it on your instrument.
            </p>

            <div
              style={{
                marginTop: 20,
              }}
            >
              <MusicStaff
                selectedNote={selectedNote}
                clef={
                  selectedInstrument.clef
                }
                timeSignature={
                  timeSignature
                }
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(220px,1fr))",
                gap: 14,
                marginTop: 20,
              }}
            >
              <div
                style={{
                  background: "#111827",
                  padding: 18,
                  borderRadius: 14,
                }}
              >
                <div
                  style={{
                    color: "#9ca3af",
                  }}
                >
                  INSTRUMENT
                </div>

                <strong
                  style={{
                    display: "block",
                    marginTop: 5,
                    fontSize: 20,
                  }}
                >
                  {selectedInstrument.name}
                </strong>
              </div>

              <div
                style={{
                  background: "#111827",
                  padding: 18,
                  borderRadius: 14,
                }}
              >
                <div
                  style={{
                    color: "#9ca3af",
                  }}
                >
                  NOTE
                </div>

                <strong
                  style={{
                    display: "block",
                    marginTop: 5,
                    fontSize: 20,
                  }}
                >
                  {selectedNote.name}
                </strong>
              </div>

              <div
                style={{
                  background: "#111827",
                  padding: 18,
                  borderRadius: 14,
                }}
              >
                <div
                  style={{
                    color: "#9ca3af",
                  }}
                >
                  FINGERING
                </div>

                <strong
                  style={{
                    display: "block",
                    marginTop: 5,
                    fontSize: 20,
                  }}
                >
                  {currentFingering}
                </strong>
              </div>
            </div>

            <button
              onClick={() =>
                playTone(
                  selectedNote.frequency
                )
              }
              style={{
                marginTop: 20,
                width: "100%",
                padding: 16,
                borderRadius: 14,
                border: "none",
                background: "#f59e0b",
                color: "#111827",
                cursor: "pointer",
                fontWeight: 800,
                fontSize: 18,
              }}
            >
              🔊 Hear the Note
            </button>
          </div>
        )}

        {/* =================================================
            FOOTER
        ================================================= */}

        <div
          style={{
            marginTop: 40,
            padding: 20,
            textAlign: "center",
            color: "#9ca3af",
            borderTop:
              "1px solid #374151",
          }}
        >
          <p>
            Btech Music Academy — Learn Music.
            See It. Hear It. Play It.
          </p>

          <p
            style={{
              marginTop: 6,
              fontSize: 13,
            }}
          >
            Built to make learning brass-band music
            easier and more interactive.
          </p>
        </div>
      </div>
    </div>
  );
}
