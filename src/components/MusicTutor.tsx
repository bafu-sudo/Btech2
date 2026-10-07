import React, { useEffect, useRef, useState } from "react";
import { Factory } from "vexflow";

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
      "A low-brass instrument commonly written in bass clef at concert pitch.",
  },
];

/* =========================================================
   NOTES
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

    /*
      Completely clear the previous VexFlow drawing.
    */
    container.innerHTML = "";

    /*
      Give the score plenty of room.
    */
    const width = 850;
    const height = 300;

    /*
      VexFlow 5 Factory renderer.
    */
    const factory = new Factory({
      renderer: {
        elementId: container,
        width,
        height,
      },
    });

    const score = factory.EasyScore();
    const system = factory.System();

    /*
      IMPORTANT:

      selectedNote.vexKey contains values such as:

        c/4
        d/4
        e/4
        f/4
        g/4
        a/4
        b/4
        c/5

      VexFlow interprets these as actual staff pitches.

      Therefore:

        c/4 = middle C
        d/4 = D
        e/4 = E
        f/4 = F
        g/4 = G
        a/4 = A
        b/4 = B
        c/5 = high C

      In treble clef, C4 is BELOW the five-line staff.
    */

    const musicNote = score.notes(
      `${selectedNote.vexKey}/q`,
      {
        stem: "up",
      }
    );

    const voice = score.voice(musicNote);

    system
      .addStave({
        voices: [voice],
      })
      .addClef(clef)
      .addTimeSignature(timeSignature);

    factory.draw();

    /*
      Cleanup.
    */
    return () => {
      container.innerHTML = "";
    };
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
        boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: "850px",
          minWidth: "850px",
          height: "300px",
        }}
      />
    </div>
  );
}

/* =========================================================
   AUDIO
========================================================= */

function playTone(frequency: number, duration = 0.8) {
  const AudioContextClass =
    window.AudioContext ||
    (
      window as typeof window & {
        webkitAudioContext?: typeof AudioContext;
      }
    ).webkitAudioContext;

  if (!AudioContextClass) return;

  const audioContext = new AudioContextClass();

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = frequency;

  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);

  gain.gain.exponentialRampToValueAtTime(
    0.25,
    audioContext.currentTime + 0.03
  );

  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    audioContext.currentTime + duration
  );

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration + 0.05);

  setTimeout(() => {
    audioContext.close();
  }, (duration + 0.2) * 1000);
}

/* =========================================================
   METRONOME
========================================================= */

function playMetronomeClick() {
  const AudioContextClass =
    window.AudioContext ||
    (
      window as typeof window & {
        webkitAudioContext?: typeof AudioContext;
      }
    ).webkitAudioContext;

  if (!AudioContextClass) return;

  const audioContext = new AudioContextClass();

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "square";
  oscillator.frequency.value = 1000;

  gain.gain.setValueAtTime(
    0.18,
    audioContext.currentTime
  );

  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + 0.06
  );

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.07);

  setTimeout(() => {
    audioContext.close();
  }, 150);
}

/* =========================================================
   FINGERING DISPLAY
========================================================= */

function FingeringDisplay({
  instrument,
  selectedNote,
}: {
  instrument: Instrument;
  selectedNote: NoteData;
}) {
  if (
    instrument.name !== "B♭ Cornet" &&
    instrument.name !== "Euphonium"
  ) {
    return (
      <div
        style={{
          background: "#111827",
          borderRadius: 16,
          padding: 20,
          marginTop: 20,
        }}
      >
        <h3
          style={{
            fontSize: 20,
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          🎺 Instrument Fingering
        </h3>

        <p style={{ color: "#d1d5db" }}>
          Fingering information for {instrument.name} will be
          added to this instrument's lesson system.
        </p>
      </div>
    );
  }

  const fingering =
    instrument.name === "B♭ Cornet"
      ? selectedNote.cornetFingering
      : selectedNote.euphoniumFingering;

  return (
    <div
      style={{
        background: "#111827",
        borderRadius: 16,
        padding: 20,
        marginTop: 20,
      }}
    >
      <h3
        style={{
          fontSize: 20,
          fontWeight: 700,
          marginBottom: 12,
        }}
      >
        🎺 Fingering
      </h3>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            fontSize: 42,
            fontWeight: 800,
            color: "#fbbf24",
          }}
        >
          {fingering}
        </div>

        <div style={{ color: "#d1d5db" }}>
          <div>
            <strong>0</strong> = open
          </div>
          <div>
            <strong>1</strong> = first valve
          </div>
          <div>
            <strong>2</strong> = second valve
          </div>
          <div>
            <strong>3</strong> = third valve
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function MusicTutor() {
  const [selectedInstrumentName, setSelectedInstrumentName] =
    useState("B♭ Cornet");

  const [selectedNoteName, setSelectedNoteName] =
    useState("C4");

  const [selectedTimeSignature, setSelectedTimeSignature] =
    useState("4/4");

  const [bpm, setBpm] = useState(90);

  const [isMetronomeRunning, setIsMetronomeRunning] =
    useState(false);

  const [activeSection, setActiveSection] =
    useState("notes");

  const selectedInstrument =
    instruments.find(
      (instrument) =>
        instrument.name === selectedInstrumentName
    ) || instruments[0];

  const selectedNote =
    notes.find(
      (note) => note.name === selectedNoteName
    ) || notes[0];

  /* =======================================================
     METRONOME LOOP
  ======================================================= */

  useEffect(() => {
    if (!isMetronomeRunning) return;

    const interval =
      60000 / bpm;

    const timer = window.setInterval(() => {
      playMetronomeClick();
    }, interval);

    return () => {
      window.clearInterval(timer);
    };
  }, [isMetronomeRunning, bpm]);

  /* =======================================================
     BPM CONTROLS
  ======================================================= */

  const increaseBpm = () => {
    setBpm((current) =>
      Math.min(current + 5, 240)
    );
  };

  const decreaseBpm = () => {
    setBpm((current) =>
      Math.max(current - 5, 30)
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
          "linear-gradient(135deg, #020617, #111827, #172554)",
        color: "#ffffff",
        padding: "30px 20px 60px",
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

        <div
          style={{
            marginBottom: 30,
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "#f59e0b",
              color: "#111827",
              padding: "6px 12px",
              borderRadius: 999,
              fontWeight: 800,
              fontSize: 13,
              marginBottom: 12,
            }}
          >
            BRASS MUSIC ACADEMY
          </div>

          <h1
            style={{
              fontSize: "clamp(32px, 6vw, 58px)",
              fontWeight: 900,
              lineHeight: 1,
              margin: 0,
            }}
          >
            🎼 Music Tutor
          </h1>

          <p
            style={{
              color: "#cbd5e1",
              fontSize: 18,
              maxWidth: 750,
              marginTop: 14,
            }}
          >
            Learn music notation, notes, clefs, rhythm,
            fingerings, time signatures and tempo through
            interactive brass lessons.
          </p>
        </div>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 25,
          }}
        >
          {[
            ["notes", "🎵 Notes"],
            ["clefs", "𝄞 Clefs"],
            ["rhythm", "🥁 Rhythm"],
            ["tempo", "⏱ Tempo"],
            ["practice", "🎺 Practice"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              style={{
                border: "none",
                borderRadius: 12,
                padding: "11px 17px",
                cursor: "pointer",
                fontWeight: 700,
                background:
                  activeSection === id
                    ? "#f59e0b"
                    : "#1e293b",
                color:
                  activeSection === id
                    ? "#111827"
                    : "#ffffff",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* =================================================
            INSTRUMENT SELECTOR
        ================================================= */}

        <div
          style={{
            background:
              "rgba(15,23,42,0.85)",
            border: "1px solid rgba(148,163,184,0.2)",
            borderRadius: 20,
            padding: 22,
            marginBottom: 25,
          }}
        >
          <h2
            style={{
              marginTop: 0,
              fontSize: 22,
            }}
          >
            🎺 Choose your instrument
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(190px,1fr))",
              gap: 10,
            }}
          >
            {instruments.map((instrument) => (
              <button
                key={instrument.name}
                onClick={() =>
                  setSelectedInstrumentName(
                    instrument.name
                  )
                }
                style={{
                  textAlign: "left",
                  border:
                    selectedInstrument.name ===
                    instrument.name
                      ? "2px solid #f59e0b"
                      : "1px solid #334155",
                  background:
                    selectedInstrument.name ===
                    instrument.name
                      ? "#422006"
                      : "#0f172a",
                  color: "#ffffff",
                  borderRadius: 14,
                  padding: 15,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    fontWeight: 800,
                    marginBottom: 5,
                  }}
                >
                  {instrument.name}
                </div>

                <div
                  style={{
                    fontSize: 13,
                    color: "#cbd5e1",
                  }}
                >
                  {instrument.clef === "treble"
                    ? "Treble clef"
                    : "Bass clef"}{" "}
                  • {instrument.transposition}
                </div>
              </button>
            ))}
          </div>

          <p
            style={{
              color: "#94a3b8",
              marginBottom: 0,
              marginTop: 15,
            }}
          >
            {selectedInstrument.description}
          </p>
        </div>

        {/* =================================================
            NOTES SECTION
        ================================================= */}

        {activeSection === "notes" && (
          <>
            <div
              style={{
                background:
                  "rgba(15,23,42,0.85)",
                borderRadius: 20,
                padding: 22,
                marginBottom: 25,
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  fontSize: 25,
                }}
              >
                🎵 Choose a note
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(90px,1fr))",
                  gap: 10,
                }}
              >
                {notes.map((note) => (
                  <button
                    key={note.name}
                    onClick={() =>
                      setSelectedNoteName(note.name)
                    }
                    style={{
                      padding: "16px 10px",
                      borderRadius: 14,
                      border:
                        selectedNote.name === note.name
                          ? "2px solid #f59e0b"
                          : "1px solid #475569",
                      background:
                        selectedNote.name === note.name
                          ? "#451a03"
                          : "#0f172a",
                      color: "#ffffff",
                      fontSize: 18,
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    {note.name}
                  </button>
                ))}
              </div>
            </div>

            {/* =================================================
                STAFF
            ================================================= */}

            <div
              style={{
                marginBottom: 25,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: 25,
                    }}
                  >
                    📖 Real Staff Notation
                  </h2>

                  <p
                    style={{
                      color: "#94a3b8",
                      marginTop: 5,
                    }}
                  >
                    {selectedInstrument.name} •{" "}
                    {selectedInstrument.clef ===
                    "treble"
                      ? "Treble clef"
                      : "Bass clef"}{" "}
                    • {selectedTimeSignature}
                  </p>
                </div>

                <button
                  onClick={() =>
                    playTone(
                      selectedNote.frequency
                    )
                  }
                  style={{
                    background: "#f59e0b",
                    color: "#111827",
                    border: "none",
                    borderRadius: 12,
                    padding: "13px 20px",
                    fontWeight: 900,
                    cursor: "pointer",
                    fontSize: 16,
                  }}
                >
                  🔊 Play {selectedNote.name}
                </button>
              </div>

              <MusicStaff
                selectedNote={selectedNote}
                clef={selectedInstrument.clef}
                timeSignature={selectedTimeSignature}
              />
            </div>

            {/* =================================================
                NOTE INFORMATION
            ================================================= */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(230px,1fr))",
                gap: 16,
                marginBottom: 25,
              }}
            >
              <div
                style={{
                  background: "#0f172a",
                  borderRadius: 18,
                  padding: 20,
                }}
              >
                <div
                  style={{
                    color: "#94a3b8",
                    fontSize: 13,
                    textTransform: "uppercase",
                  }}
                >
                  Written note
                </div>

                <div
                  style={{
                    fontSize: 36,
                    fontWeight: 900,
                    color: "#fbbf24",
                    marginTop: 5,
                  }}
                >
                  {selectedNote.name}
                </div>
              </div>

              <div
                style={{
                  background: "#0f172a",
                  borderRadius: 18,
                  padding: 20,
                }}
              >
                <div
                  style={{
                    color: "#94a3b8",
                    fontSize: 13,
                    textTransform: "uppercase",
                  }}
                >
                  Fingering
                </div>

                <div
                  style={{
                    fontSize: 36,
                    fontWeight: 900,
                    marginTop: 5,
                  }}
                >
                  {selectedInstrument.name ===
                  "B♭ Cornet"
                    ? selectedNote.cornetFingering
                    : selectedInstrument.name ===
                      "Euphonium"
                    ? selectedNote.euphoniumFingering
                    : "—"}
                </div>
              </div>

              <div
                style={{
                  background: "#0f172a",
                  borderRadius: 18,
                  padding: 20,
                }}
              >
                <div
                  style={{
                    color: "#94a3b8",
                    fontSize: 13,
                    textTransform: "uppercase",
                  }}
                >
                  Pitch frequency
                </div>

                <div
                  style={{
                    fontSize: 30,
                    fontWeight: 900,
                    marginTop: 5,
                  }}
                >
                  {selectedNote.frequency} Hz
                </div>
              </div>
            </div>

            <FingeringDisplay
              instrument={selectedInstrument}
              selectedNote={selectedNote}
            />
          </>
        )}

        {/* =================================================
            CLEF SECTION
        ================================================= */}

        {activeSection === "clefs" && (
          <div
            style={{
              background: "#0f172a",
              borderRadius: 20,
              padding: 25,
            }}
          >
            <h2
              style={{
                marginTop: 0,
                fontSize: 30,
              }}
            >
              𝄞 Understanding Clefs
            </h2>

            <p
              style={{
                color: "#cbd5e1",
                fontSize: 17,
                lineHeight: 1.7,
              }}
            >
              A clef tells you how the notes on the staff
              should be named. Different instruments use
              different clefs because their comfortable
              playing ranges are different.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(250px,1fr))",
                gap: 15,
                marginTop: 20,
              }}
            >
              <div
                style={{
                  background: "#172554",
                  padding: 20,
                  borderRadius: 16,
                }}
              >
                <div
                  style={{
                    fontSize: 50,
                    marginBottom: 10,
                  }}
                >
                  𝄞
                </div>

                <h3>Treble Clef</h3>

                <p
                  style={{
                    color: "#cbd5e1",
                  }}
                >
                  Commonly used for B♭ cornet, B♭ trumpet,
                  E♭ horn and British brass-band euphonium.
                </p>
              </div>

              <div
                style={{
                  background: "#1e293b",
                  padding: 20,
                  borderRadius: 16,
                }}
              >
                <div
                  style={{
                    fontSize: 50,
                    marginBottom: 10,
                  }}
                >
                  𝄢
                </div>

                <h3>Bass Clef</h3>

                <p
                  style={{
                    color: "#cbd5e1",
                  }}
                >
                  Commonly used for trombone, tuba and other
                  low-brass instruments.
                </p>
              </div>
            </div>

            <div
              style={{
                marginTop: 25,
                background: "#020617",
                borderRadius: 15,
                padding: 20,
              }}
            >
              <h3>Important idea</h3>

              <p
                style={{
                  color: "#cbd5e1",
                  lineHeight: 1.7,
                }}
              >
                The same sounding pitch can appear in a
                different position on the staff when a
                different clef is used. The clef changes how
                the lines and spaces are named.
              </p>
            </div>
          </div>
        )}

        {/* =================================================
            RHYTHM SECTION
        ================================================= */}

        {activeSection === "rhythm" && (
          <div
            style={{
              background: "#0f172a",
              borderRadius: 20,
              padding: 25,
            }}
          >
            <h2
              style={{
                marginTop: 0,
                fontSize: 30,
              }}
            >
              🥁 Time Signatures & Rhythm
            </h2>

            <p
              style={{
                color: "#cbd5e1",
                lineHeight: 1.7,
              }}
            >
              Select a time signature to learn how many beats
              are contained in each measure and how those beats
              are counted.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(160px,1fr))",
                gap: 12,
                marginTop: 20,
              }}
            >
              {timeSignatures.map((signature) => (
                <button
                  key={signature.value}
                  onClick={() =>
                    setSelectedTimeSignature(
                      signature.value
                    )
                  }
                  style={{
                    padding: 18,
                    borderRadius: 14,
                    border:
                      selectedTimeSignature ===
                      signature.value
                        ? "2px solid #f59e0b"
                        : "1px solid #475569",
                    background:
                      selectedTimeSignature ===
                      signature.value
                        ? "#451a03"
                        : "#172033",
                    color: "#ffffff",
                    cursor: "pointer",
                    fontSize: 22,
                    fontWeight: 900,
                  }}
                >
                  {signature.value}
                </button>
              ))}
            </div>

            {(() => {
              const signature =
                timeSignatures.find(
                  (item) =>
                    item.value ===
                    selectedTimeSignature
                ) || timeSignatures[0];

              return (
                <div
                  style={{
                    marginTop: 25,
                    background: "#020617",
                    borderRadius: 16,
                    padding: 22,
                  }}
                >
                  <h3
                    style={{
                      fontSize: 27,
                      marginTop: 0,
                      color: "#fbbf24",
                    }}
                  >
                    {signature.value}
                  </h3>

                  <p
                    style={{
                      color: "#cbd5e1",
                      fontSize: 17,
                    }}
                  >
                    {signature.description}
                  </p>

                  <div
                    style={{
                      background: "#111827",
                      padding: 18,
                      borderRadius: 12,
                      marginTop: 15,
                      fontSize: 22,
                      fontWeight: 800,
                    }}
                  >
                    Count:
                    <span
                      style={{
                        color: "#fbbf24",
                        marginLeft: 10,
                      }}
                    >
                      {signature.counting}
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* =================================================
            TEMPO SECTION
        ================================================= */}

        {activeSection === "tempo" && (
          <div
            style={{
              background: "#0f172a",
              borderRadius: 20,
              padding: 25,
            }}
          >
            <h2
              style={{
                marginTop: 0,
                fontSize: 30,
              }}
            >
              ⏱ Tempo & Metronome
            </h2>

            <div
              style={{
                textAlign: "center",
                padding: 25,
                background: "#020617",
                borderRadius: 18,
              }}
            >
              <div
                style={{
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  fontSize: 13,
                }}
              >
                Current tempo
              </div>

              <div
                style={{
                  fontSize: 70,
                  fontWeight: 900,
                  color: "#fbbf24",
                  lineHeight: 1.1,
                }}
              >
                {bpm}
              </div>

              <div
                style={{
                  color: "#cbd5e1",
                }}
              >
                BPM
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 10,
                  marginTop: 20,
                }}
              >
                <button
                  onClick={decreaseBpm}
                  style={{
                    padding: "12px 20px",
                    borderRadius: 10,
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 800,
                  }}
                >
                  − 5
                </button>

                <button
                  onClick={increaseBpm}
                  style={{
                    padding: "12px 20px",
                    borderRadius: 10,
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 800,
                  }}
                >
                  + 5
                </button>

                <button
                  onClick={() =>
                    setIsMetronomeRunning(
                      (running) => !running
                    )
                  }
                  style={{
                    padding: "12px 20px",
                    borderRadius: 10,
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 900,
                    background: isMetronomeRunning
                      ? "#dc2626"
                      : "#f59e0b",
                    color: "#111827",
                  }}
                >
                  {isMetronomeRunning
                    ? "⏹ Stop"
                    : "▶ Start"}
                </button>
              </div>
            </div>

            <h3
              style={{
                marginTop: 30,
              }}
            >
              Tempo markings
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(130px,1fr))",
                gap: 10,
              }}
            >
              {tempoNames.map((tempo) => (
                <button
                  key={tempo.name}
                  onClick={() => setBpm(tempo.bpm)}
                  style={{
                    padding: 15,
                    borderRadius: 12,
                    background: "#172033",
                    color: "#ffffff",
                    border: "1px solid #334155",
                    cursor: "pointer",
                  }}
                >
                  <strong>{tempo.name}</strong>
                  <br />
                  <span
                    style={{
                      color: "#94a3b8",
                    }}
                  >
                    {tempo.bpm} BPM
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* =================================================
            PRACTICE SECTION
        ================================================= */}

        {activeSection === "practice" && (
          <div
            style={{
              background: "#0f172a",
              borderRadius: 20,
              padding: 25,
            }}
          >
            <h2
              style={{
                marginTop: 0,
                fontSize: 30,
              }}
            >
              🎺 Practice Lesson
            </h2>

            <div
              style={{
                background: "#020617",
                borderRadius: 16,
                padding: 22,
              }}
            >
              <h3
                style={{
                  color: "#fbbf24",
                  fontSize: 25,
                }}
              >
                Step 1 — Identify the note
              </h3>

              <p
                style={{
                  color: "#cbd5e1",
                  lineHeight: 1.7,
                }}
              >
                Look at the staff and identify the note before
                looking at its name.
              </p>

              <h3
                style={{
                  color: "#fbbf24",
                  fontSize: 25,
                  marginTop: 25,
                }}
              >
                Step 2 — Find the fingering
              </h3>

              <p
                style={{
                  color: "#cbd5e1",
                  lineHeight: 1.7,
                }}
              >
                Once you know the note, identify the correct
                valve combination for your instrument.
              </p>

              <h3
                style={{
                  color: "#fbbf24",
                  fontSize: 25,
                  marginTop: 25,
                }}
              >
                Step 3 — Hear it
              </h3>

              <button
                onClick={() =>
                  playTone(selectedNote.frequency)
                }
                style={{
                  background: "#f59e0b",
                  color: "#111827",
                  border: "none",
                  borderRadius: 12,
                  padding: "13px 20px",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                🔊 Play {selectedNote.name}
              </button>

              <h3
                style={{
                  color: "#fbbf24",
                  fontSize: 25,
                  marginTop: 25,
                }}
              >
                Step 4 — Practise slowly
              </h3>

              <p
                style={{
                  color: "#cbd5e1",
                  lineHeight: 1.7,
                }}
              >
                Start with a comfortable tempo and gradually
                increase the BPM as your accuracy improves.
              </p>
            </div>
          </div>
        )}

        {/* =================================================
            FOOTER
        ================================================= */}

        <div
          style={{
            textAlign: "center",
            marginTop: 45,
            paddingTop: 25,
            borderTop:
              "1px solid rgba(148,163,184,0.15)",
            color: "#64748b",
          }}
        >
          <p>
            🎼 Btech2 Music Tutor • Learn • Play • Read •
            Improve
          </p>

          <p
            style={{
              fontSize: 13,
            }}
          >
            Built to make brass-band music easier to learn.
          </p>
        </div>
      </div>
    </div>
  );
}
