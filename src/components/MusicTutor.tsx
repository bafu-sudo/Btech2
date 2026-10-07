import React, { useEffect, useState } from "react";

type Instrument = {
  name: string;
  clef: string;
  transposition: string;
  description: string;
};

const instruments: Instrument[] = [
  {
    name: "B♭ Cornet",
    clef: "Treble",
    transposition: "B♭",
    description:
      "A brass-band instrument normally written in treble clef as a B♭ transposing instrument.",
  },
  {
    name: "B♭ Trumpet",
    clef: "Treble",
    transposition: "B♭",
    description:
      "A B♭ transposing brass instrument normally written in treble clef.",
  },
  {
    name: "E♭ Horn",
    clef: "Treble",
    transposition: "E♭",
    description:
      "An E♭ brass-band horn normally written in treble clef.",
  },
  {
    name: "Euphonium",
    clef: "Bass",
    transposition: "Concert / B♭ depending on notation",
    description:
      "A low brass instrument commonly written in bass clef in concert-pitch notation.",
  },
  {
    name: "Trombone",
    clef: "Bass",
    transposition: "Concert",
    description:
      "A low brass instrument commonly written in bass clef at concert pitch.",
  },
];

const notes = [
  { name: "C", y: 150 },
  { name: "D", y: 137 },
  { name: "E", y: 124 },
  { name: "F", y: 111 },
  { name: "G", y: 98 },
  { name: "A", y: 85 },
  { name: "B", y: 72 },
  { name: "C5", y: 59 },
];

const fingering: Record<string, Record<string, string>> = {
  "B♭ Cornet": {
    C: "0",
    D: "1 + 3",
    E: "1 + 2",
    F: "1",
    G: "0",
    A: "1 + 2",
    B: "2",
    C5: "0",
  },

  "B♭ Trumpet": {
    C: "0",
    D: "1 + 3",
    E: "1 + 2",
    F: "1",
    G: "0",
    A: "1 + 2",
    B: "2",
    C5: "0",
  },

  "E♭ Horn": {
    G: "0",
    A: "1 + 2",
    B: "1",
    C: "0",
    D: "1 + 2",
    E: "1",
    F: "0",
  },

  Euphonium: {
    C: "1",
    D: "1 + 2",
    E: "2",
    F: "0",
    G: "1 + 2",
    A: "2",
    B: "1",
  },

  Trombone: {
    C: "6th position",
    D: "5th position",
    E: "4th position",
    F: "1st position",
    G: "4th position",
    A: "2nd position",
    B: "1st position",
  },
};

const timeSignatures = [
  {
    value: "2/4",
    title: "2/4",
    description:
      "Two quarter-note beats in every measure. A common simple duple meter.",
    counting: "1 2 | 1 2",
  },
  {
    value: "3/4",
    title: "3/4",
    description:
      "Three quarter-note beats in every measure. Often used for waltz-like music.",
    counting: "1 2 3 | 1 2 3",
  },
  {
    value: "4/4",
    title: "4/4",
    description:
      "Four quarter-note beats in every measure. One of the most common time signatures.",
    counting: "1 2 3 4 | 1 2 3 4",
  },
  {
    value: "5/4",
    title: "5/4",
    description:
      "Five quarter-note beats in each measure. The beats can be grouped in different ways.",
    counting: "1 2 3 4 5",
  },
  {
    value: "6/8",
    title: "6/8",
    description:
      "Six eighth notes in each measure, normally grouped into two main beats.",
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

function MusicStaff({
  selectedNote,
  timeSignature,
}: {
  selectedNote: string;
  timeSignature: string;
}) {
  const note = notes.find((n) => n.name === selectedNote) || notes[0];

  return (
    <div
      style={{
        background: "#ffffff",
        color: "#111827",
        borderRadius: 16,
        padding: 24,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          marginBottom: 15,
          fontWeight: 700,
          fontSize: 22,
        }}
      >
        <span style={{ fontSize: 50 }}>𝄞</span>

        <span>{timeSignature}</span>

        <span style={{ fontSize: 15 }}>♩ = 100</span>
      </div>

      <div
        style={{
          position: "relative",
          height: 220,
          minWidth: 600,
        }}
      >
        {[0, 1, 2, 3, 4].map((line) => (
          <div
            key={line}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 70 + line * 25,
              height: 2,
              background: "#111827",
            }}
          />
        ))}

        <div
          style={{
            position: "absolute",
            left: 25,
            top: 27,
            fontSize: 70,
          }}
        >
          𝄞
        </div>

        <div
          style={{
            position: "absolute",
            left: 100,
            top: 57,
            fontSize: 22,
            fontWeight: 700,
          }}
        >
          {timeSignature}
        </div>

        <div
          style={{
            position: "absolute",
            left: 190,
            top: note.y,
            transform: "translateY(-50%)",
            fontSize: 55,
            lineHeight: 1,
          }}
        >
          ♩
        </div>

        <div
          style={{
            position: "absolute",
            left: 270,
            top: 130,
            fontSize: 25,
          }}
        >
          {selectedNote}
        </div>

        <div
          style={{
            position: "absolute",
            left: 400,
            top: 70,
            height: 102,
            borderLeft: "2px solid #111827",
          }}
        />
      </div>
    </div>
  );
}

function playTone(frequency: number, duration = 0.7) {
  const AudioContext =
    window.AudioContext ||
    (window as typeof window & {
      webkitAudioContext?: typeof window.AudioContext;
    }).webkitAudioContext;

  if (!AudioContext) return;

  const context = new AudioContext();

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

const noteFrequencies: Record<string, number> = {
  C: 261.63,
  D: 293.66,
  E: 329.63,
  F: 349.23,
  G: 392.0,
  A: 440.0,
  B: 493.88,
  C5: 523.25,
};

export default function MusicTutor() {
  const [instrumentIndex, setInstrumentIndex] = useState(0);
  const [selectedNote, setSelectedNote] = useState("C");
  const [timeSignature, setTimeSignature] = useState("4/4");
  const [bpm, setBpm] = useState(100);
  const [metronomeRunning, setMetronomeRunning] = useState(false);
  const [activeLesson, setActiveLesson] = useState("Notes");

  const instrument = instruments[instrumentIndex];

  const currentFingering =
    fingering[instrument.name]?.[selectedNote] || "Not available";

  useEffect(() => {
    if (!metronomeRunning) return;

    const interval = 60000 / bpm;

    const timer = window.setInterval(() => {
      playTone(1000, 0.08);
    }, interval);

    return () => window.clearInterval(timer);
  }, [metronomeRunning, bpm]);

  const playSelectedNote = () => {
    playTone(noteFrequencies[selectedNote] || 261.63);
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
      <div style={{ maxWidth: 1400, margin: "auto" }}>
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
            An interactive music-learning environment designed for
            brass and band students.
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
            <h2 style={{ marginTop: 0 }}>Music Tutor</h2>

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
                    activeLesson === lesson ? "#020617" : "#ffffff",
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
                gridTemplateColumns: "1fr 1fr",
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
                    setInstrumentIndex(Number(event.target.value))
                  }
                  style={{
                    width: "100%",
                    padding: 13,
                    borderRadius: 10,
                    background: "#1e293b",
                    color: "#fff",
                    border: "1px solid #334155",
                  }}
                >
                  {instruments.map((item, index) => (
                    <option value={index} key={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div
                style={{
                  background: "#0f172a",
                  borderRadius: 20,
                  padding: 20,
                  border: "1px solid #1e293b",
                }}
              >
                <div style={{ color: "#94a3b8", fontSize: 13 }}>
                  CURRENT INSTRUMENT
                </div>

                <h2 style={{ margin: "8px 0" }}>
                  {instrument.name}
                </h2>

                <div style={{ color: "#67e8f9" }}>
                  {instrument.clef} clef · {instrument.transposition}
                </div>
              </div>
            </section>

            {activeLesson === "Notes" && (
              <>
                <MusicStaff
                  selectedNote={selectedNote}
                  timeSignature={timeSignature}
                />

                <section
                  style={{
                    marginTop: 20,
                    display: "grid",
                    gridTemplateColumns: "1fr 300px",
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
                          "repeat(auto-fit, minmax(70px, 1fr))",
                        gap: 10,
                      }}
                    >
                      {notes.map((note) => (
                        <button
                          key={note.name}
                          onClick={() => setSelectedNote(note.name)}
                          style={{
                            padding: 15,
                            borderRadius: 12,
                            border: 0,
                            cursor: "pointer",
                            fontWeight: 800,
                            background:
                              selectedNote === note.name
                                ? "#22d3ee"
                                : "#1e293b",
                            color:
                              selectedNote === note.name
                                ? "#020617"
                                : "#fff",
                          }}
                        >
                          {note.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#0f172a",
                      borderRadius: 20,
                      padding: 24,
                    }}
                  >
                    <h2>{selectedNote}</h2>

                    <p style={{ color: "#94a3b8" }}>
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
                      onClick={playSelectedNote}
                      style={{
                        marginTop: 20,
                        width: "100%",
                        padding: 14,
                        border: 0,
                        borderRadius: 12,
                        background: "#22d3ee",
                        color: "#020617",
                        fontWeight: 900,
                        cursor: "pointer",
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
                <h2>Understanding Clefs</h2>

                <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
                  A clef tells the musician how the notes on the
                  staff should be interpreted. Different instruments
                  use different clefs because they play in different
                  registers.
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
                  ].map(([symbol, name]) => (
                    <div
                      key={name}
                      style={{
                        background: "#1e293b",
                        padding: 30,
                        borderRadius: 15,
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontSize: 70 }}>{symbol}</div>
                      <strong>{name}</strong>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeLesson === "Time Signatures" && (
              <section>
                <div
                  style={{
                    background: "#0f172a",
                    borderRadius: 20,
                    padding: 30,
                  }}
                >
                  <h2>Time Signatures</h2>

                  <p style={{ color: "#cbd5e1" }}>
                    The top number tells you how many beats are in
                    each measure. The bottom number tells you which
                    note value receives the beat.
                  </p>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 10,
                      marginTop: 20,
                    }}
                  >
                    {timeSignatures.map((item) => (
                      <button
                        key={item.value}
                        onClick={() =>
                          setTimeSignature(item.value)
                        }
                        style={{
                          padding: "14px 22px",
                          borderRadius: 12,
                          border: 0,
                          background:
                            timeSignature === item.value
                              ? "#22d3ee"
                              : "#1e293b",
                          color:
                            timeSignature === item.value
                              ? "#020617"
                              : "#fff",
                          fontWeight: 900,
                          cursor: "pointer",
                        }}
                      >
                        {item.title}
                      </button>
                    ))}
                  </div>
                </div>

                {(() => {
                  const selected =
                    timeSignatures.find(
                      (item) => item.value === timeSignature
                    ) || timeSignatures[2];

                  return (
                    <div
                      style={{
                        marginTop: 20,
                        background: "#ffffff",
                        color: "#020617",
                        borderRadius: 20,
                        padding: 30,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 80,
                          fontWeight: 900,
                        }}
                      >
                        {selected.value}
                      </div>

                      <h3>{selected.title}</h3>

                      <p>{selected.description}</p>

                      <strong>
                        Counting: {selected.counting}
                      </strong>
                    </div>
                  );
                })()}
              </section>
            )}

            {activeLesson === "Tempo" && (
              <section
                style={{
                  background: "#0f172a",
                  borderRadius: 20,
                  padding: 30,
                  textAlign: "center",
                }}
              >
                <h2>Tempo & Metronome</h2>

                <div
                  style={{
                    fontSize: 80,
                    fontWeight: 900,
                    color: "#22d3ee",
                  }}
                >
                  {bpm}
                </div>

                <div style={{ color: "#94a3b8" }}>
                  BPM
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 10,
                    marginTop: 25,
                  }}
                >
                  <button
                    onClick={() =>
                      setBpm((value) => Math.max(30, value - 5))
                    }
                    style={{
                      padding: "12px 25px",
                      borderRadius: 10,
                      border: 0,
                      cursor: "pointer",
                    }}
                  >
                    −
                  </button>

                  <button
                    onClick={() =>
                      setMetronomeRunning(!metronomeRunning)
                    }
                    style={{
                      padding: "12px 30px",
                      borderRadius: 10,
                      border: 0,
                      cursor: "pointer",
                      background: metronomeRunning
                        ? "#ef4444"
                        : "#22d3ee",
                      fontWeight: 900,
                    }}
                  >
                    {metronomeRunning ? "STOP" : "START"}
                  </button>

                  <button
                    onClick={() =>
                      setBpm((value) => Math.min(240, value + 5))
                    }
                    style={{
                      padding: "12px 25px",
                      borderRadius: 10,
                      border: 0,
                      cursor: "pointer",
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
                  {tempoNames.map((tempo) => (
                    <button
                      key={tempo.name}
                      onClick={() => setBpm(tempo.bpm)}
                      style={{
                        padding: 15,
                        borderRadius: 12,
                        border: 0,
                        background: "#1e293b",
                        color: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      <strong>{tempo.name}</strong>
                      <br />
                      <small>{tempo.bpm} BPM</small>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {activeLesson === "Rhythm" && (
              <section
                style={{
                  background: "#ffffff",
                  color: "#020617",
                  borderRadius: 20,
                  padding: 30,
                }}
              >
                <h2>Rhythm Trainer</h2>

                <div
                  style={{
                    textAlign: "center",
                    fontSize: 70,
                    margin: "40px 0",
                  }}
                >
                  ♩ ♪♪ ♩ 𝅗𝅥
                </div>

                <p style={{ textAlign: "center" }}>
                  Learn to recognize note values and count the
                  rhythm.
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    style={{
                      padding: 15,
                      borderRadius: 10,
                      border: 0,
                      cursor: "pointer",
                    }}
                  >
                    1 2 3 4
                  </button>

                  <button
                    style={{
                      padding: 15,
                      borderRadius: 10,
                      border: 0,
                      cursor: "pointer",
                    }}
                  >
                    1 & 2 & 3 & 4 &
                  </button>

                  <button
                    style={{
                      padding: 15,
                      borderRadius: 10,
                      border: 0,
                      cursor: "pointer",
                    }}
                  >
                    1-la-li 2-la-li
                  </button>
                </div>
              </section>
            )}

            {activeLesson === "Practice" && (
              <section
                style={{
                  background: "#0f172a",
                  borderRadius: 20,
                  padding: 30,
                }}
              >
                <h2>Practice Session</h2>

                <p style={{ color: "#cbd5e1" }}>
                  Practice {selectedNote} on the{" "}
                  {instrument.name}.
                </p>

                <MusicStaff
                  selectedNote={selectedNote}
                  timeSignature={timeSignature}
                />

                <button
                  onClick={playSelectedNote}
                  style={{
                    marginTop: 20,
                    padding: "14px 25px",
                    borderRadius: 12,
                    border: 0,
                    background: "#22d3ee",
                    fontWeight: 900,
                    cursor: "pointer",
                  }}
                >
                  ▶ Start Practice
                </button>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
