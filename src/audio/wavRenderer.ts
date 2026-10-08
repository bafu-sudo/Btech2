/**
 * Client-side audio WAV synthesis renderer.
 * Converts score notes into an authentic PCM WAV Audio Blob
 * for real legal audio sample downloads.
 */

export function renderMelodyToWavBlob(
  notes: { freqHz: number; durationMs: number; isRest?: boolean }[],
  tempoMultiplier: number = 1.0,
  instrumentType: 'cornet' | 'horn' | 'euphonium' = 'cornet'
): Blob {
  const sampleRate = 44100;
  
  // Calculate total duration in samples
  let totalSamples = 0;
  const noteSamples = notes.map(n => {
    const durSec = Math.max(0.1, (n.durationMs / tempoMultiplier) / 1000);
    const count = Math.floor(durSec * sampleRate);
    totalSamples += count;
    return { ...n, count, durSec };
  });

  // 16-bit Mono PCM buffer
  const pcmData = new Int16Array(totalSamples);
  let sampleOffset = 0;

  for (const n of noteSamples) {
    if (n.isRest || n.freqHz <= 0) {
      sampleOffset += n.count;
      continue;
    }

    const freq = n.freqHz;
    const count = n.count;
    const durSec = n.durSec;

    for (let i = 0; i < count; i++) {
      const t = i / sampleRate;
      
      // Envelope: gentle brass swell and decay
      let env = 1.0;
      const attackTime = 0.04;
      const releaseTime = 0.08;
      if (t < attackTime) {
        env = t / attackTime;
      } else if (t > durSec - releaseTime) {
        env = Math.max(0, (durSec - t) / releaseTime);
      }

      // Harmonic synthesizer (warm brass harmonics: fundamental, 2nd, 3rd, 4th, 5th)
      const f1 = Math.sin(2 * Math.PI * freq * t);
      const f2 = Math.sin(2 * Math.PI * freq * 2 * t) * (instrumentType === 'horn' ? 0.35 : 0.55);
      const f3 = Math.sin(2 * Math.PI * freq * 3 * t) * (instrumentType === 'horn' ? 0.15 : 0.32);
      const f4 = Math.sin(2 * Math.PI * freq * 4 * t) * 0.18;
      const f5 = Math.sin(2 * Math.PI * freq * 5 * t) * 0.08;

      // Subtle vibrato (5.2 Hz)
      const vibrato = 1 + 0.012 * Math.sin(2 * Math.PI * 5.2 * t);
      
      const combined = (f1 + f2 + f3 + f4 + f5) * 0.32 * env * vibrato;
      // Clamp to 16-bit range
      const sample16 = Math.max(-32767, Math.min(32767, Math.floor(combined * 32767)));
      pcmData[sampleOffset + i] = sample16;
    }

    sampleOffset += count;
  }

  // Create WAV Container header
  const dataByteLength = pcmData.length * 2;
  const buffer = new ArrayBuffer(44 + dataByteLength);
  const view = new DataView(buffer);

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  // RIFF chunk length
  view.setUint32(4, 36 + dataByteLength, true);
  // RIFF type
  writeString(view, 8, 'WAVE');
  // format chunk identifier
  writeString(view, 12, 'fmt ');
  // format chunk length
  view.setUint32(16, 16, true);
  // sample format (1 is PCM)
  view.setUint16(20, 1, true);
  // channel count (1 = mono)
  view.setUint16(22, 1, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate (SampleRate * BitsPerSample * Channels / 8)
  view.setUint32(28, sampleRate * 2, true);
  // block align (Channels * BitsPerSample / 8)
  view.setUint16(32, 2, true);
  // bits per sample
  view.setUint16(34, 16, true);
  // data chunk identifier
  writeString(view, 36, 'data');
  // data chunk length
  view.setUint32(40, dataByteLength, true);

  // Write PCM audio samples into buffer
  for (let i = 0; i < pcmData.length; i++) {
    view.setInt16(44 + i * 2, pcmData[i], true);
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

