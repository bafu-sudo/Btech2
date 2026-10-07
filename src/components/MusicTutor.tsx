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

type NoteData = {
  name: string;
  vexKey: string;
  frequency: number;
  cornetFingering: string;
  euphoniumFingering: string;
};

const notes: NoteData[] = [
  {
    name: "C4",
    vexKey: "c/4",
    frequency: 261.63,
    cornetFingering: "0",
    euphoniumFingering: "1",
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
    euphoniumFingering: "1",
  },
];

const timeSignatures = [
  {
    value: "2/4",
    description:
      "Two quarter-note beats in each measure. This is simple duple meter.",
    counting: "1 2 | 1 2",
  },
  {
    value: "3/4",
    description:
      "Three quarter-note beats in each measure. This is commonly used for waltz-like music.",
    counting: "1 2 3 | 1 2 3",
  },
  {
    value: "4/4",
    description:
      "Four quarter-note beats in each measure. This is one of the most common meters.",
    counting: "1 2 3 4 | 1 2 3 4",
  },
  {
    value: "5/4",
    description:
      "Five quarter-note beats in each measure. The beats can be grouped in different ways.",
    counting: "1 2 3 4 5",
  },
  {
    value: "6/8",
    description:
      "Six eighth notes per measure, normally felt as two main beats, each divided into three.",
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

function playTone(frequency: number, duration = 0.7) {
  const AudioContextClass =
    window.AudioContext ||
    (
      window as typeof window & {
        webkitAudioContext?: typeof AudioContext;
      }
    ).webkitAudioContext;

  if (!AudioContextClass) return;

  const context = new AudioContextClass();

  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.frequency.value = frequency;
  oscillator.type = "sine";

  gain.gain.setValueAtTime(0.0001, context.currentTime);

  gain.gain.exponentialRampToValueAtTime(
    0.25,
    context.currentTime + 0.02
  );

  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    context.currentTime + duration
  );

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start();
  oscillator.stop(context.currentTime + duration);
}

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
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    const width = Math.max(
      700,
      containerRef.current.clientWidth || 700
    );

    const height = 280;

    const renderer = new Renderer(
      containerRef.current,
      Renderer.Backends.SVG
    );

    renderer.resize(width, height);

    const context = renderer.getContext();

    /*
      The staff starts at x=80.
      The note is positioned by VexFlow according to:
      - its pitch key
      - the selected clef
    */

    const stave = new Stave(
      80,
      70,
      width - 140
    );

    stave.addClef(clef);
    stave.addTimeSignature(timeSignature);

    stave.setContext(context).draw();

    const note = new StaveNote({
      keys: [selectedNote.vexKey],
      duration: "q",
      clef: clef,
    });

    const voice = new Voice({
      numBeats: 1,
      beatValue: 4,
    });

    voice.addTickables([note]);

    new Formatter()
      .joinVoices([voice])
      .format([voice], 300);

    voice.draw(context, stave);
  }, [selectedNote, clef, timeSignature]);

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 18,
        padding: 18,
        overflowX: "auto",
      }}
    >
      <div
        ref={containerRef}
        style={{
          minWidth: 700,
          width: "100%",
        }}
      />
    </div>
  );
}

export default function MusicTutor() {
  const [instrumentIndex, setInstrumentIndex] = useState(0);
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(0);
  const [timeSignature, setTimeSignature] = useState("4/4");
  const [bpm, setBpm] = useState(100);
  const [metronomeRunning, setMetronomeRunning] =
    useState(false);
  const [activeLesson, setActiveLesson] =
    useState("Notes");

  const instrument = instruments[instrumentIndex];
  const selectedNote = notes[selectedNoteIndex];

  const currentFingering =
    instrument.name === "Euphonium"
      ? selectedNote.euphoniumFingering
      : selectedNote.cornetFingering;

  useEffect(() => {
    if (!metronomeRunning) return;

    const interval = 60000 / bpm;

    const timer = window.setInterval(() => {
      playTone(1000, 0.08);
    }, interval);

    return () => window.clearInterval(timer);
  }, [metronomeRunning, bpm]);

  const playSelectedNote = () => {
    playTone(selectedNote.frequency);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #020617 0%, #0f172a 50%, #172554 100%)",
        color: "#ffffff",
        padding: "30px 20px",
        fontFamily:
          "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "auto",
        }}
      >
        <header style={{ marginBottom: 30 }}>
          <div
            style={{
              color: "#22d3ee",
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Btech Music Academy
          </div>

          <h1
            style={{
              fontSize: "clamp(34px, 6vw, 70px)",
              lineHeight: 1,
              margin: "12px 0",
            }}
          >
            Learn Music.
            <br />
            See It. Hear It. Play It.
          </h1>

          <p
            style={{
              color: "#cbd5e1",
              maxWidth: 800,
              fontSize: 18,
              lineHeight: 1.6,
            }}
          >
            An interactive music-learning environment
            designed for brass and band students.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "250px 1fr",
            gap: 20,
          }}
        >
          <aside
            style={{
              background: "rgba(15, 23, 42, 0.9)",
              border: "1px solid #1e293b",
              borderRadius: 20,
              padding: 16,
              height: "fit-content",
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              Music Tutor
            </h2>

            {[
              "Notes",
              "Clefs",
              "Time Signatures",
              "Rhythm",
              "Tempo",
              "Practice",
            ].map((lesson) => (
              <button
                key={lesson}
                onClick={() => setActiveLesson(lesson)}
                style={{
                  width: "100%",
                  border: 0,
                  borderRadius: 12,
                  padding: "13px 14px",
                  marginBottom: 8,
                  textAlign: "left",
                  cursor: "pointer",
                  color:
                    activeLesson === lesson
                      ? "#020617"
                      : "#ffffff",
                  background:
                    activeLesson === lesson
                      ? "#22d3ee"
                      : "#1e293b",
                  fontWeight: 700,
                }}
              >
                {lesson}
              </button>
            ))}
          </aside>

          <main>
            <section
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: 20,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  background: "#0f172a",
                  borderRadius: 20,
                  padding: 20,
                  border: "1px solid #1e293b",
                }}
              >
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    color: "#94a3b8",
                  }}
                >
                  Instrument
                </label>

                <select
                  value={instrumentIndex}
                  onChange={(event) =>
                    setInstrumentIndex(
                      Number(event.target.value)
                    )
                  }
                  style={{
                    width: "100%",
                    padding: 13,
                    borderRadius: 10,
                    background: "#1e293b",
                    color: "#fff",
                    border:
                      "1px solid #334155",
                  }}
                >
                  {instruments.map(
                    (item, index) => (
                      <option
                        value={index}
                        key={item.name}
                      >
                        {item.name}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div
                style={{
                  background: "#0f172a",
                  borderRadius: 20,
                  padding: 20,
                  border:
                    "1px solid #1e293b",
                }}
              >
                <div
                  style={{
                    color: "#94a3b8",
                    fontSize: 13,
                  }}
                >
                  CURRENT INSTRUMENT
                </div>

                <h2 style={{ margin: "8px 0" }}>
                  {instrument.name}
                </h2>

                <div
                  style={{
                    color: "#67e8f9",
                  }}
                >
                  {instrument.clef ===
                  "treble"
                    ? "Treble"
                    : "Bass"}{" "}
                  clef ·{" "}
                  {instrument.transposition}
                </div>

                <p
                  style={{
                    color: "#94a3b8",
                    lineHeight: 1.5,
                  }}
                >
                  {instrument.description}
                </p>
              </div>
            </section>

            {activeLesson === "Notes" && (
              <>
                <MusicStaff
                  selectedNote={selectedNote}
                  clef={instrument.clef}
                  timeSignature={
                    timeSignature
                  }
                />

                <section
                  style={{
                    marginTop: 20,
                    display: "grid",
                    gridTemplateColumns:
                      "1fr 300px",
                    gap: 20,
                  }}
                >
                  <div
                    style={{
                      background: "#0f172a",
                      borderRadius: 20,
                      padding: 24,
                    }}
                  >
                    <h2>Select a Note</h2>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(80px, 1fr))",
                        gap: 10,
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
                              padding: 15,
                              borderRadius: 12,
                              border: 0,
                              cursor:
                                "pointer",
                              fontWeight: 800,
                              background:
                                selectedNoteIndex ===
                                index
                                  ? "#22d3ee"
                                  : "#1e293b",
                              color:
                                selectedNoteIndex ===
                                index
                                  ? "#020617"
                                  : "#fff",
                            }}
                          >
                            {note.name}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#0f172a",
                      borderRadius: 20,
                      padding: 24,
                    }}
                  >
                    <h2>
                      {selectedNote.name}
                    </h2>

                    <p
                      style={{
                        color: "#94a3b8",
                      }}
                    >
                      Fingering
                    </p>

                    <div
                      style={{
                        fontSize: 30,
                        fontWeight: 900,
                        color: "#22d3ee",
                      }}
                    >
                      {currentFingering}
                    </div>

                    <button
                      onClick={
                        playSelectedNote
                      }
                      style={{
                        marginTop: 20,
                        width: "100%",
                        padding: 14,
                        border: 0,
                        borderRadius: 12,
                        background:
                          "#22d3ee",
                        color: "#020617",
                        fontWeight: 900,
                        cursor:
                          "pointer",
                      }}
                    >
                      🔊 Play Note
                    </button>
                  </div>
                </section>
              </>
            )}

            {activeLesson === "Clefs" && (
              <section
                style={{
                  background: "#0f172a",
                  borderRadius: 20,
                  padding: 30,
                }}
              >
                <h2>
                  Understanding Clefs
                </h2>

                <p
                  style={{
                    color: "#cbd5e1",
                    lineHeight: 1.7,
                  }}
                >
                  A clef tells the musician
                  how notes on the staff should
                  be interpreted. The Music Tutor
                  automatically changes the
                  displayed clef when you change
                  instrument.
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: 15,
                    marginTop: 25,
                  }}
                >
                  {[
                    ["𝄞", "Treble Clef"],
                    ["𝄢", "Bass Clef"],
                    ["𝄡", "Alto Clef"],
                  ].map(
                    ([symbol, name]) => (
                      <div
                        key={name}
                        style={{
                          background:
                            "#1e293b",
                          padding: 30,
                          borderRadius: 15,
                          textAlign:
                            "center",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 70,
                          }}
                        >
                          {symbol}
                        </div>

                        <strong>
                          {name}
                        </strong>
                      </div>
                    )
                  )}
                </div>
              </section>
            )}

            {activeLesson ===
              "Time Signatures" && (
              <section>
                <div
                  style={{
                    background:
                      "#0f172a",
                    borderRadius: 20,
                    padding: 30,
                  }}
                >
                  <h2>
                    Time Signatures
                  </h2>

                  <p
                    style={{
                      color:
                        "#cbd5e1",
                    }}
                  >
                    The top number tells
                    you how many beats are
                    in each measure. The
                    bottom number tells you
                    which note value receives
                    the beat.
                  </p>

                  <div
                    style={{
                      display: "flex",
                      flexWrap:
                        "wrap",
                      gap: 10,
                      marginTop: 20,
                    }}
                  >
                    {timeSignatures.map(
                      (item) => (
                        <button
                          key={
                            item.value
                          }
                          onClick={() =>
                            setTimeSignature(
                              item.value
                            )
                          }
                          style={{
                            padding:
                              "14px 22px",
                            borderRadius:
                              12,
                            border: 0,
                            background:
                              timeSignature ===
                              item.value
                                ? "#22d3ee"
                                : "#1e293b",
                            color:
                              timeSignature ===
                              item.value
                                ? "#020617"
                                : "#fff",
                            fontWeight:
                              900,
                            cursor:
                              "pointer",
                          }}
                        >
                          {
                            item.value
                          }
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 20,
                    background:
                      "#ffffff",
                    color:
                      "#020617",
                    borderRadius: 20,
                    padding: 30,
                  }}
                >
                  {(() => {
                    const selected =
                      timeSignatures.find(
                        (item) =>
                          item.value ===
                          timeSignature
                      ) ||
                      timeSignatures[2];

                    return (
                      <>
                        <div
                          style={{
                            fontSize: 80,
                            fontWeight: 900,
                          }}
                        >
                          {
                            selected.value
                          }
                        </div>

                        <h3>
                          {
                            selected.value
                          }
                        </h3>

                        <p>
                          {
                            selected.description
                          }
                        </p>

                        <strong>
                          Counting:{" "}
                          {
                            selected.counting
                          }
                        </strong>
                      </>
                    );
                  })()}
                </div>
              </section>
            )}

            {activeLesson === "Tempo" && (
              <section
                style={{
                  background:
                    "#0f172a",
                  borderRadius: 20,
                  padding: 30,
                  textAlign:
                    "center",
                }}
              >
                <h2>
                  Tempo & Metronome
                </h2>

                <div
                  style={{
                    fontSize: 80,
                    fontWeight: 900,
                    color:
                      "#22d3ee",
                  }}
                >
                  {bpm}
                </div>

                <div
                  style={{
                    color:
                      "#94a3b8",
                  }}
                >
                  BPM
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "center",
                    gap: 10,
                    marginTop: 25,
                  }}
                >
                  <button
                    onClick={() =>
                      setBpm(
                        (value) =>
                          Math.max(
                            30,
                            value - 5
                          )
                      )
                    }
                    style={{
                      padding:
                        "12px 25px",
                      borderRadius:
                        10,
                      border: 0,
                      cursor:
                        "pointer",
                    }}
                  >
                    −
                  </button>

                  <button
                    onClick={() =>
                      setMetronomeRunning(
                        (value) =>
                          !value
                      )
                    }
                    style={{
                      padding:
                        "12px 30px",
                      borderRadius:
                        10,
                      border: 0,
                      cursor:
                        "pointer",
                      background:
                        metronomeRunning
                          ? "#ef4444"
                          : "#22d3ee",
                      fontWeight:
                        900,
                    }}
                  >
                    {metronomeRunning
                      ? "STOP"
                      : "START"}
                  </button>

                  <button
                    onClick={() =>
                      setBpm(
                        (value) =>
                          Math.min(
                            240,
                            value + 5
                          )
                      )
                    }
                    style={{
                      padding:
                        "12px 25px",
                      borderRadius:
                        10,
                      border: 0,
                      cursor:
                        "pointer",
                    }}
                  >
                    +
                  </button>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(120px, 1fr))",
                    gap: 10,
                    marginTop: 30,
                  }}
                >
                  {tempoNames.map(
                    (tempo) => (
                      <button
                        key={
                          tempo.name
                        }
                        onClick={() =>
                          setBpm(
                            tempo.bpm
                          )
                        }
                        style={{
                          padding: 15,
                          borderRadius:
                            12,
                          border: 0,
                          background:
                            "#1e293b",
                          color:
                            "#fff",
                          cursor:
                            "pointer",
                        }}
                      >
                        <strong>
                          {
                            tempo.name
                          }
                        </strong>
                        <br />
                        <small>
                          {
                            tempo.bpm
                          }{" "}
                          BPM
                        </small>
                      </button>
                    )
                  )}
                </div>
              </section>
            )}

            {activeLesson === "Rhythm" && (
              <section
                style={{
                  background:
                    "#ffffff",
                  color:
                    "#020617",
                  borderRadius: 20,
                  padding: 30,
                }}
              >
                <h2>
                  Rhythm Trainer
                </h2>

                <div
                  style={{
                    textAlign:
                      "center",
                    fontSize: 70,
                    margin:
                      "40px 0",
                  }}
                >
                  ♩ ♪ ♪ ♩ 𝅗𝅥
                </div>

                <p
                  style={{
                    textAlign:
                      "center",
                  }}
                >
                  Learn to recognize
                  note values and count
                  rhythm correctly.
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "center",
                    gap: 10,
                    flexWrap:
                      "wrap",
                  }}
                >
                  <button
                    style={{
                      padding: 15,
                      borderRadius:
                        10,
                      border: 0,
                      cursor:
                        "pointer",
                    }}
                  >
                    1 2 3 4
                  </button>

                  <button
                    style={{
                      padding: 15,
                      borderRadius:
                        10,
                      border: 0,
                      cursor:
                        "pointer",
                    }}
                  >
                    1 & 2 & 3 & 4 &
                  </button>

                  <button
                    style={{
                      padding: 15,
                      borderRadius:
                        10,
                      border: 0,
                      cursor:
                        "pointer",
                    }}
                  >
                    1-la-li 2-la-li
                  </button>
                </div>
              </section>
            )}

            {activeLesson ===
              "Practice" && (
              <section
                style={{
                  background:
                    "#0f172a",
                  borderRadius: 20,
                  padding: 30,
                }}
              >
                <h2>
                  Practice Session
                </h2>

                <p
                  style={{
                    color:
                      "#cbd5e1",
                  }}
                >
                  Practice{" "}
                  {selectedNote.name}{" "}
                  on the{" "}
                  {instrument.name}.
                </p>

                <MusicStaff
                  selectedNote={
                    selectedNote
                  }
                  clef={
                    instrument.clef
                  }
                  timeSignature={
                    timeSignature
                  }
                />

                <button
                  onClick={
                    playSelectedNote
                  }
                  style={{
                    marginTop: 20,
                    padding:
                      "14px 25px",
                    borderRadius:
                      12,
                    border: 0,
                    background:
                      "#22d3ee",
                    fontWeight:
                      900,
                    cursor:
                      "pointer",
                  }}
                >
                  ▶ Play Practice Note
                </button>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
