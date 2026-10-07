import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Mic, MicOff, RotateCcw, Volume2 } from 'lucide-react';

type Instrument =
  | 'Bb Cornet'
  | 'Bb Trumpet'
  | 'Bb Flugelhorn'
  | 'Eb Horn'
  | 'Euphonium'
  | 'Trombone'
  | 'Eb Bass'
  | 'Bb Bass';

type TuningStatus = 'flat' | 'in-tune' | 'sharp' | 'no-signal';

const INSTRUMENT_OFFSETS: Record<Instrument, number> = {
  'Bb Cornet': -2,
  'Bb Trumpet': -2,
  'Bb Flugelhorn': -2,
  'Eb Horn': -9,
  Euphonium: 0,
  Trombone: 0,
  'Eb Bass': -9,
  'Bb Bass': 0,
};

const STANDARD_FREQUENCIES: Record<string, number> = {
  C: 261.63,
  'C#': 277.18,
  D: 293.66,
  'D#': 311.13,
  E: 329.63,
  F: 349.23,
  'F#': 369.99,
  G: 392.0,
  'G#': 415.3,
  A: 440.0,
  'A#': 466.16,
  B: 493.88,
};

const NOTE_NAMES = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];

function frequencyToNote(frequency: number) {
  if (!frequency || frequency <= 0) return null;

  const midi = Math.round(69 + 12 * Math.log2(frequency / 440));
  const noteIndex = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  const note = NOTE_NAMES[noteIndex];

  const exactFrequency = 440 * Math.pow(2, (midi - 69) / 12);
  const cents = 1200 * Math.log2(frequency / exactFrequency);

  return {
    note,
    octave,
    frequency: exactFrequency,
    cents,
  };
}

function getStatus(cents: number): TuningStatus {
  if (Math.abs(cents) <= 5) return 'in-tune';
  if (cents < 0) return 'flat';
  return 'sharp';
}

function autoCorrelate(
  buffer: Float32Array,
  sampleRate: number,
): number | null {
  let size = buffer.length;

  // Remove DC offset and find signal strength.
  let sum = 0;

  for (let i = 0; i < size; i++) {
    sum += buffer[i];
  }

  const mean = sum / size;

  let rms = 0;

  for (let i = 0; i < size; i++) {
    const value = buffer[i] - mean;
    rms += value * value;
  }

  rms = Math.sqrt(rms / size);

  // Ignore very quiet microphone signals.
  if (rms < 0.008) {
    return null;
  }

  const normalized = new Float32Array(size);

  for (let i = 0; i < size; i++) {
    normalized[i] = buffer[i] - mean;
  }

  // Frequency range:
  // 25 Hz allows low bass notes.
  // 1500 Hz covers normal brass playing ranges.
  const minFrequency = 25;
  const maxFrequency = 1500;

  const minLag = Math.floor(sampleRate / maxFrequency);
  const maxLag = Math.min(
    Math.floor(sampleRate / minFrequency),
    size - 1,
  );

  let bestLag = -1;
  let bestCorrelation = 0;

  for (let lag = minLag; lag <= maxLag; lag++) {
    let correlation = 0;
    let energy1 = 0;
    let energy2 = 0;

    const limit = size - lag;

    for (let i = 0; i < limit; i++) {
      const a = normalized[i];
      const b = normalized[i + lag];

      correlation += a * b;
      energy1 += a * a;
      energy2 += b * b;
    }

    if (energy1 === 0 || energy2 === 0) continue;

    correlation /= Math.sqrt(energy1 * energy2);

    if (correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestLag = lag;
    }
  }

  if (bestLag === -1 || bestCorrelation < 0.55) {
    return null;
  }

  // Parabolic interpolation makes the frequency estimate more accurate.
  if (bestLag > minLag && bestLag < maxLag) {
    const correlationAt = (lag: number) => {
      let correlation = 0;
      let energy1 = 0;
      let energy2 = 0;

      const limit = size - lag;

      for (let i = 0; i < limit; i++) {
        const a = normalized[i];
        const b = normalized[i + lag];

        correlation += a * b;
        energy1 += a * a;
        energy2 += b * b;
      }

      if (energy1 === 0 || energy2 === 0) return 0;

      return correlation / Math.sqrt(energy1 * energy2);
    };

    const y1 = correlationAt(bestLag - 1);
    const y2 = correlationAt(bestLag);
    const y3 = correlationAt(bestLag + 1);

    const denominator = y1 - 2 * y2 + y3;

    if (Math.abs(denominator) > 0.000001) {
      const adjustment = 0.5 * ((y1 - y3) / denominator);
      bestLag += adjustment;
    }
  }

  const frequency = sampleRate / bestLag;

  if (frequency < minFrequency || frequency > maxFrequency) {
    return null;
  }

  return frequency;
}

export default function Tuner() {
  const [instrument, setInstrument] =
    useState<Instrument>('Bb Cornet');

  const [isListening, setIsListening] = useState(false);
  const [frequency, setFrequency] = useState<number | null>(null);
  const [detectedNote, setDetectedNote] = useState<string>('--');
  const [octave, setOctave] = useState<number | null>(null);
  const [cents, setCents] = useState(0);
  const [status, setStatus] =
    useState<TuningStatus>('no-signal');

  const [error, setError] = useState('');

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const bufferRef = useRef<Float32Array | null>(null);

  const selectedOffset = INSTRUMENT_OFFSETS[instrument];

  const writtenToConcertOffset = selectedOffset;

  const noteDisplay = useMemo(() => {
    if (detectedNote === '--') {
      return '--';
    }

    return `${detectedNote}${octave ?? ''}`;
  }, [detectedNote, octave]);

  const stopTuner = () => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
      microphoneRef.current = null;
    }

    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setIsListening(false);
    setFrequency(null);
    setDetectedNote('--');
    setOctave(null);
    setCents(0);
    setStatus('no-signal');
  };

  const startTuner = async () => {
    setError('');

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError(
          'Your browser does not support microphone access.',
        );
        return;
      }

      stopTuner();

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
          },
        });

      streamRef.current = stream;

      const AudioContextClass =
        window.AudioContext ||
        (
          window as typeof window & {
            webkitAudioContext?: typeof AudioContext;
          }
        ).webkitAudioContext;

      if (!AudioContextClass) {
        setError('Web Audio is not supported by this browser.');
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      const audioContext = new AudioContextClass();

      audioContextRef.current = audioContext;

      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      const analyser = audioContext.createAnalyser();

      analyser.fftSize = 16384;
      analyser.smoothingTimeConstant = 0.15;

      analyserRef.current = analyser;

      const microphone =
        audioContext.createMediaStreamSource(stream);

      microphoneRef.current = microphone;

      microphone.connect(analyser);

      bufferRef.current = new Float32Array(
        analyser.fftSize,
      );

      setIsListening(true);

      const detectPitch = () => {
        if (!analyserRef.current || !bufferRef.current) {
          return;
        }

        analyserRef.current.getFloatTimeDomainData(
          bufferRef.current as any,
        );

        const detectedFrequency = autoCorrelate(
          bufferRef.current,
          audioContext.sampleRate,
        );

        if (detectedFrequency !== null) {
          const detected = frequencyToNote(
            detectedFrequency,
          );

          if (detected) {
            const concertCents = detected.cents;

            setFrequency(detectedFrequency);
            setDetectedNote(detected.note);
            setOctave(detected.octave);
            setCents(concertCents);
            setStatus(getStatus(concertCents));
          }
        }

        animationFrameRef.current =
          requestAnimationFrame(detectPitch);
      };

      detectPitch();
    } catch (err) {
      console.error(err);

      setError(
        'Microphone access was blocked. Please allow microphone access and try again.',
      );

      stopTuner();
    }
  };

  useEffect(() => {
    return () => {
      stopTuner();
    };
  }, []);

  const reset = () => {
    setFrequency(null);
    setDetectedNote('--');
    setOctave(null);
    setCents(0);
    setStatus('no-signal');
  };

  const needlePosition = Math.max(
    -50,
    Math.min(50, cents),
  );

  const needlePercent =
    ((needlePosition + 50) / 100) * 100;

  const statusText =
    status === 'in-tune'
      ? 'IN TUNE'
      : status === 'flat'
        ? 'FLAT'
        : status === 'sharp'
          ? 'SHARP'
          : 'PLAY A NOTE';

  const statusColor =
    status === 'in-tune'
      ? 'text-green-400'
      : status === 'flat'
        ? 'text-blue-400'
        : status === 'sharp'
          ? 'text-red-400'
          : 'text-slate-400';

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 flex justify-center">
            <div className="rounded-full bg-amber-500/10 p-4">
              <Volume2 className="h-10 w-10 text-amber-400" />
            </div>
          </div>

          <h1 className="text-4xl font-bold">
            Brass Tuner
          </h1>

          <p className="mt-2 text-slate-400">
            Tune your brass instrument using your microphone
          </p>
        </div>

        {/* Main tuner */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl md:p-8">
          {/* Instrument */}
          <div className="mb-6">
            <label
              htmlFor="instrument"
              className="mb-2 block text-sm font-semibold text-slate-300"
            >
              Instrument
            </label>

            <select
              id="instrument"
              value={instrument}
              onChange={(event) =>
                setInstrument(
                  event.target.value as Instrument,
                )
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-amber-400"
            >
              <option value="Bb Cornet">
                B♭ Cornet
              </option>

              <option value="Bb Trumpet">
                B♭ Trumpet
              </option>

              <option value="Bb Flugelhorn">
                B♭ Flugelhorn
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

              <option value="Eb Bass">
                E♭ Bass
              </option>

              <option value="Bb Bass">
                B♭ Bass
              </option>
            </select>
          </div>

          {/* Written / sounding information */}
          <div className="mb-6 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Instrument
              </p>

              <p className="mt-1 text-lg font-semibold">
                {instrument}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Transposition
              </p>

              <p className="mt-1 text-lg font-semibold">
                {selectedOffset === -2
                  ? 'B♭'
                  : selectedOffset === -9
                    ? 'E♭'
                    : 'Concert pitch'}
              </p>
            </div>
          </div>

          {/* Note */}
          <div className="mb-8 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              Detected Note
            </p>

            <div className="mt-2 text-8xl font-black tracking-tight text-amber-400 md:text-9xl">
              {noteDisplay}
            </div>

            <div className="mt-3 text-xl text-slate-400">
              {frequency !== null
                ? `${frequency.toFixed(2)} Hz`
                : '-- Hz'}
            </div>
          </div>

          {/* Needle */}
          <div className="mb-8">
            <div className="relative h-36 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
              {/* Centre line */}
              <div className="absolute bottom-0 left-1/2 top-0 w-px bg-green-400/70" />

              {/* Scale */}
              <div className="absolute bottom-4 left-5 right-5 flex justify-between text-xs text-slate-500">
                <span>-50</span>
                <span>-25</span>
                <span>0</span>
                <span>+25</span>
                <span>+50</span>
              </div>

              {/* Needle */}
              {frequency !== null && (
                <div
                  className="absolute bottom-8 left-1/2 h-24 w-1 origin-bottom rounded-full bg-amber-400 transition-transform duration-100"
                  style={{
                    transform: `translateX(-50%) rotate(${(needlePosition / 50) * 45}deg)`,
                  }}
                />
              )}

              {/* Centre dot */}
              <div className="absolute bottom-5 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-green-400" />
            </div>

            <div className="mt-4 text-center">
              <div
                className={`text-2xl font-bold ${statusColor}`}
              >
                {statusText}
              </div>

              <div className="mt-1 text-sm text-slate-500">
                {frequency !== null
                  ? `${cents > 0 ? '+' : ''}${cents.toFixed(1)} cents`
                  : 'Waiting for microphone signal'}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-3 sm:flex-row">
            {!isListening ? (
              <button
                type="button"
                onClick={startTuner}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-4 font-bold text-slate-950 transition hover:bg-amber-400"
              >
                <Mic className="h-5 w-5" />
                Start Tuner
              </button>
            ) : (
              <button
                type="button"
                onClick={stopTuner}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-4 font-bold text-white transition hover:bg-red-400"
              >
                <MicOff className="h-5 w-5" />
                Stop Tuner
              </button>
            )}

            <button
              type="button"
              onClick={reset}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-4 font-semibold text-white transition hover:bg-slate-700"
            >
              <RotateCcw className="h-5 w-5" />
              Reset
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 rounded-xl border border-slate-800 bg-slate-950/60 p-5">
            <h2 className="mb-3 text-lg font-bold">
              How to use the tuner
            </h2>

            <ol className="space-y-2 text-sm leading-6 text-slate-400">
              <li>
                <span className="font-semibold text-white">
                  1.
                </span>{' '}
                Select your instrument above.
              </li>

              <li>
                <span className="font-semibold text-white">
                  2.
                </span>{' '}
                Click <b>Start Tuner</b> and allow microphone
                access.
              </li>

              <li>
                <span className="font-semibold text-white">
                  3.
                </span>{' '}
                Play one clear, steady note.
              </li>

              <li>
                <span className="font-semibold text-white">
                  4.
                </span>{' '}
                Move your tuning slide or adjust your playing
                until the needle reaches the centre.
              </li>

              <li>
                <span className="font-semibold text-white">
                  5.
                </span>{' '}
                Green means the note is close to in tune.
              </li>
            </ol>
          </div>
        </div>

        {/* Instrument information */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <h3 className="font-bold text-amber-400">
              B♭ Instruments
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Cornet, trumpet and flugelhorn are B♭ instruments
              and are shown separately in the tuner.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <h3 className="font-bold text-amber-400">
              E♭ Instruments
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              E♭ horn and E♭ bass are included for brass-band
              players.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <h3 className="font-bold text-amber-400">
              Bass Detection
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              The tuner can analyse frequencies down to about
              25 Hz to help with low brass instruments.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          Btech2 Brass Music Tutor
        </p>
      </div>
    </div>
  );
}
