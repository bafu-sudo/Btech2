import React, { useEffect, useRef, useState } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Music2,
  Settings2,
} from 'lucide-react';

type Instrument =
 type Instrument =
  | 'Bb Cornet'
  | 'Bb Trumpet'
  | 'Bb Flugelhorn'
  | 'Eb Horn'
  | 'Euphonium'
  | 'Trombone'
  | 'Bass';

type TuningStatus = 'flat' | 'sharp' | 'in-tune' | 'none';

const NOTE_NAMES = [
  'C',
  'C♯',
  'D',
  'D♯',
  'E',
  'F',
  'F♯',
  'G',
  'G♯',
  'A',
  'A♯',
  'B',
];

const INSTRUMENT_OFFSETS: Record<Instrument, number> = {
  'Bb Cornet': -2,
  'Bb Trumpet': -2,
  'Bb Flugelhorn': -2,
  'Eb Horn': -9,
  Euphonium: 0,
  Trombone: 0,
  Bass: 0,
};

function frequencyToNote(frequency: number) {
  const midi = 69 + 12 * Math.log2(frequency / 440);
  const roundedMidi = Math.round(midi);

  const noteIndex = ((roundedMidi % 12) + 12) % 12;
  const octave = Math.floor(roundedMidi / 12) - 1;

  const targetFrequency = 440 * Math.pow(2, (roundedMidi - 69) / 12);

  const cents = 1200 * Math.log2(frequency / targetFrequency);

  return {
    name: NOTE_NAMES[noteIndex],
    octave,
    frequency: targetFrequency,
    cents,
    midi: roundedMidi,
  };
}

function autoCorrelate(
  buffer: Float32Array,
  sampleRate: number
): number {
  let size = buffer.length;

  let rms = 0;

  for (let i = 0; i < size; i++) {
    rms += buffer[i] * buffer[i];
  }

  rms = Math.sqrt(rms / size);

  if (rms < 0.01) {
    return -1;
  }

  let r1 = 0;
  let r2 = size - 1;
  const threshold = 0.2;

  for (let i = 0; i < size / 2; i++) {
    if (Math.abs(buffer[i]) < threshold) {
      r1 = i;
      break;
    }
  }

  for (let i = 1; i < size / 2; i++) {
    if (Math.abs(buffer[size - i]) < threshold) {
      r2 = size - i;
      break;
    }
  }

  const trimmed = buffer.slice(r1, r2);
  size = trimmed.length;

  const correlations = new Float32Array(size);

  for (let lag = 0; lag < size; lag++) {
    let sum = 0;

    for (let i = 0; i < size - lag; i++) {
      sum += trimmed[i] * trimmed[i + lag];
    }

    correlations[lag] = sum;
  }

  let d = 0;

  while (
    d + 1 < correlations.length &&
    correlations[d] > correlations[d + 1]
  ) {
    d++;
  }

  let maxValue = -Infinity;
  let maxIndex = -1;

  for (let i = d; i < correlations.length; i++) {
    if (correlations[i] > maxValue) {
      maxValue = correlations[i];
      maxIndex = i;
    }
  }

  if (maxIndex <= 0) {
    return -1;
  }

  return sampleRate / maxIndex;
}

export default function Tuner() {
  const [instrument, setInstrument] =
    useState<Instrument>('Bb Cornet');

  const [isListening, setIsListening] = useState(false);

  const [note, setNote] = useState('--');

  const [octave, setOctave] = useState('');

  const [frequency, setFrequency] = useState(0);

  const [cents, setCents] = useState(0);

  const [status, setStatus] =
    useState<TuningStatus>('none');

  const [error, setError] = useState('');

  const audioContextRef =
    useRef<AudioContext | null>(null);

  const analyserRef =
    useRef<AnalyserNode | null>(null);

  const streamRef =
    useRef<MediaStream | null>(null);

  const animationRef =
    useRef<number | null>(null);

  const bufferRef =
    useRef<Float32Array | null>(null);

  useEffect(() => {
    return () => {
      stopTuner();
    };
  }, []);

  const stopTuner = () => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => track.stop());

      streamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();

      audioContextRef.current = null;
    }

    analyserRef.current = null;

    setIsListening(false);
  };

  const detectPitch = () => {
    const analyser = analyserRef.current;
    const audioContext = audioContextRef.current;
    const buffer = bufferRef.current;

    if (!analyser || !audioContext || !buffer) {
      return;
    }

    analyser.getFloatTimeDomainData(buffer);

    const detectedFrequency = autoCorrelate(
      buffer,
      audioContext.sampleRate
    );

    if (
      detectedFrequency > 50 &&
      detectedFrequency < 1500
    ) {
      const result =
        frequencyToNote(detectedFrequency);

      setNote(result.name);
      setOctave(String(result.octave));
      setFrequency(detectedFrequency);
      setCents(result.cents);

      if (result.cents < -10) {
        setStatus('flat');
      } else if (result.cents > 10) {
        setStatus('sharp');
      } else {
        setStatus('in-tune');
      }
    }

    animationRef.current =
      requestAnimationFrame(detectPitch);
  };

  const startTuner = async () => {
    try {
      setError('');

      if (!navigator.mediaDevices?.getUserMedia) {
        setError(
          'Your browser does not support microphone access.'
        );
        return;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
          },
        });

      const AudioContextClass =
        window.AudioContext ||
        (
          window as typeof window & {
            webkitAudioContext?: typeof AudioContext;
          }
        ).webkitAudioContext;

      if (!AudioContextClass) {
        setError(
          'Your browser does not support the Web Audio API.'
        );

        stream
          .getTracks()
          .forEach((track) => track.stop());

        return;
      }

      const audioContext =
        new AudioContextClass();

      const analyser =
        audioContext.createAnalyser();

      analyser.fftSize = 4096;

      analyser.smoothingTimeConstant = 0.1;

      const source =
        audioContext.createMediaStreamSource(stream);

      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      streamRef.current = stream;

      bufferRef.current =
        new Float32Array(analyser.fftSize);

      setIsListening(true);

      detectPitch();
    } catch (err) {
      console.error(err);

      setError(
        'Microphone access was blocked. Please allow microphone permission and try again.'
      );

      setIsListening(false);
    }
  };

  const getStatusText = () => {
    if (status === 'flat') return 'FLAT';
    if (status === 'sharp') return 'SHARP';
    if (status === 'in-tune') return 'IN TUNE';

    return 'PLAY A NOTE';
  };

  const getNeedlePosition = () => {
    const limitedCents =
      Math.max(-50, Math.min(50, cents));

    return limitedCents * 2;
  };

  const getWrittenNote = () => {
    if (note === '--') {
      return '--';
    }

    const offset =
      INSTRUMENT_OFFSETS[instrument];

    if (offset === 0) {
      return `${note}${octave}`;
    }

    const midi =
      69 +
      12 *
        Math.log2(
          frequency / 440
        );

    const writtenMidi =
      Math.round(midi) - offset;

    const noteIndex =
      ((writtenMidi % 12) + 12) % 12;

    const writtenOctave =
      Math.floor(writtenMidi / 12) - 1;

    return `${NOTE_NAMES[noteIndex]}${writtenOctave}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8 text-center">

          <div className="mb-3 flex justify-center">
            <div className="rounded-2xl bg-amber-400/10 p-4">
              <Music2
                size={42}
                className="text-amber-400"
              />
            </div>
          </div>

          <h1 className="text-4xl font-bold">
            Btech Chromatic Tuner
          </h1>

          <p className="mt-2 text-slate-400">
            Tune your instrument using your microphone
          </p>
        </div>

        {/* Instrument selector */}
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">

          <div className="mb-3 flex items-center gap-2">
            <Settings2
              size={20}
              className="text-amber-400"
            />

            <span className="font-semibold">
              Instrument
            </span>
          </div>

          <select
            value={instrument}
            onChange={(e) =>
              setInstrument(
                e.target.value as Instrument
              )
            }
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-amber-400"
          >
            <option>Bb Cornet</option>
            <option>Bb Trumpet</option>
            <option>Eb Horn</option>
            <option>Euphonium</option>
            <option>Trombone</option>
          </select>
        </div>

        {/* Main tuner */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">

          {/* Note */}
          <div className="text-center">

            <p className="text-sm uppercase tracking-widest text-slate-400">
              Detected Note
            </p>

            <div className="mt-2 text-8xl font-black">
              {note}
              {octave}
            </div>

            <div className="mt-2 text-slate-400">
              Written for {instrument}:{' '}
              <span className="font-bold text-white">
                {getWrittenNote()}
              </span>
            </div>
          </div>

          {/* Tuning meter */}
          <div className="mx-auto mt-10 max-w-3xl">

            <div className="relative h-24">

              <div className="absolute left-0 right-0 top-10 h-2 rounded-full bg-slate-700" />

              <div className="absolute left-1/2 top-4 h-16 w-1 -translate-x-1/2 rounded-full bg-amber-400" />

              <div className="absolute left-0 top-7 text-sm text-slate-400">
                ♭ FLAT
              </div>

              <div className="absolute right-0 top-7 text-sm text-slate-400">
                SHARP ♯
              </div>

              <div
                className="absolute top-2 h-20 w-1 rounded-full bg-white transition-all duration-100"
                style={{
                  left: `calc(50% + ${getNeedlePosition()}%)`,
                  transform: 'translateX(-50%)',
                }}
              />

              <div className="absolute left-1/2 top-20 -translate-x-1/2 text-xs text-slate-500">
                0 cents
              </div>

            </div>

          </div>

          {/* Status */}
          <div className="mt-6 text-center">

            <div
              className={`text-3xl font-black ${
                status === 'in-tune'
                  ? 'text-emerald-400'
                  : status === 'flat'
                  ? 'text-sky-400'
                  : status === 'sharp'
                  ? 'text-red-400'
                  : 'text-slate-400'
              }`}
            >
              {getStatusText()}
            </div>

            <div className="mt-2 text-lg text-slate-400">
              {frequency > 0
                ? `${frequency.toFixed(1)} Hz`
                : 'Waiting for sound...'}
            </div>

            <div className="mt-1 text-sm text-slate-500">
              {frequency > 0
                ? `${cents >= 0 ? '+' : ''}${cents.toFixed(
                    1
                  )} cents`
                : ''}
            </div>
          </div>

          {/* Microphone */}
          <div className="mt-8 flex justify-center">

            {!isListening ? (
              <button
                type="button"
                onClick={startTuner}
                className="flex items-center gap-3 rounded-2xl bg-amber-400 px-7 py-4 font-bold text-slate-950 transition hover:bg-amber-300"
              >
                <Mic size={22} />
                Start Tuner
              </button>
            ) : (
              <button
                type="button"
                onClick={stopTuner}
                className="flex items-center gap-3 rounded-2xl bg-red-500 px-7 py-4 font-bold text-white transition hover:bg-red-400"
              >
                <MicOff size={22} />
                Stop Tuner
              </button>
            )}

          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-sm text-red-300">
              {error}
            </div>
          )}
        </div>

        {/* Information */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <Volume2
              className="mb-3 text-amber-400"
              size={25}
            />

            <h3 className="font-bold">
              Real-Time Detection
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Btech listens through your microphone
              and detects the pitch you play.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <Music2
              className="mb-3 text-amber-400"
              size={25}
            />

            <h3 className="font-bold">
              Instrument Aware
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Select your instrument to help
              understand written and sounding pitch.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">

            <div className="mb-3 text-2xl">
              🎯
            </div>

            <h3 className="font-bold">
              Tune Precisely
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              See frequency and cents so you can
              adjust your pitch accurately.
            </p>
          </div>

        </div>

        <p className="mt-8 text-center text-xs text-slate-600">
          Btech Music Technology • Chromatic Tuner
        </p>

      </div>
    </div>
  );
}
