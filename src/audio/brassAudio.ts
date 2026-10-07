/**
 * Web Audio API Brass Synthesizer
 * Models the warm, harmonic-rich timbre of British brass band instruments
 * (Cornet, Tenor Horn, Euphonium, Eb/Bb Bass) with formant filtering & lip-buzz envelope.
 */

class BrassAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Plays an authentic brass tone
   * @param freq Target fundamental frequency in Hz
   * @param duration Optional duration in seconds (if omitted, sustained until returned stop() is called)
   * @param instrumentType Instrument coloration (cornet = bright, horn = mellow, bass = deep, trombone = punchy)
   */
  public playBrassTone(
    freq: number,
    duration?: number,
    instrumentType: 'cornet' | 'horn' | 'euphonium' | 'bass' | 'trombone' | 'glockenspiel' = 'cornet'
  ): () => void {
    if (this.isMuted || freq <= 0) return () => {};
    this.initContext();
    if (!this.ctx) return () => {};

    const now = this.ctx.currentTime;

    if (instrumentType === 'glockenspiel') {
      const osc = this.ctx.createOscillator();
      const overtone = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      overtone.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      overtone.frequency.setValueAtTime(freq * 2.76, now);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + (duration || 0.7));

      osc.connect(gain);
      overtone.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      overtone.start(now);
      const stopTime = now + (duration || 0.7);
      osc.stop(stopTime);
      overtone.stop(stopTime);

      return () => {
        try {
          osc.stop();
          overtone.stop();
        } catch {}
      };
    }

    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const formantFilter = this.ctx.createBiquadFilter();
    const mainGain = this.ctx.createGain();

    // Subtle vibrato LFO for warmth
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(instrumentType === 'trombone' ? 4.8 : 5.4, now);
    lfoGain.gain.setValueAtTime(instrumentType === 'bass' ? 0.8 : instrumentType === 'trombone' ? 1.8 : 1.4, now);
    lfo.connect(osc.frequency);
    lfo.connect(subOsc.frequency);
    lfo.start(now);

    // Waveform choice: Sawtooth with rich brass harmonics
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq * 0.985, now);
    // Slight initial lip attack transient (centering the pitch in first 35ms)
    osc.frequency.exponentialRampToValueAtTime(freq, now + 0.035);

    // Sub-oscillator for body / warmth (octave lower or square warm fundamental)
    subOsc.type = instrumentType === 'trombone' ? 'sawtooth' : 'triangle';
    subOsc.frequency.setValueAtTime(freq, now);

    // Filter tuning according to instrument character
    filter.type = 'lowpass';
    const cutoff = instrumentType === 'bass' 
      ? Math.min(1800, freq * 7) 
      : instrumentType === 'trombone'
      ? Math.min(4200, freq * 9)
      : Math.min(3800, freq * 8);

    filter.frequency.setValueAtTime(cutoff * 0.4, now);
    // Brass attack envelope on filter: opening up brightly then settling
    filter.frequency.exponentialRampToValueAtTime(cutoff, now + 0.05);
    filter.frequency.exponentialRampToValueAtTime(cutoff * 0.75, now + 0.25);
    filter.Q.setValueAtTime(instrumentType === 'horn' ? 2.0 : instrumentType === 'trombone' ? 4.0 : 3.5, now);

    // Formant bell filter for brass bell resonance (~1200Hz - 2200Hz)
    formantFilter.type = 'peaking';
    formantFilter.frequency.setValueAtTime(instrumentType === 'bass' ? 700 : instrumentType === 'trombone' ? 1400 : 1600, now);
    formantFilter.Q.setValueAtTime(2.2, now);
    formantFilter.gain.setValueAtTime(instrumentType === 'trombone' ? 5.5 : 4.0, now);

    // Gain envelope
    mainGain.gain.setValueAtTime(0.0001, now);
    const peakVolume = instrumentType === 'bass' ? 0.35 : instrumentType === 'trombone' ? 0.32 : 0.25;
    mainGain.gain.exponentialRampToValueAtTime(peakVolume, now + 0.04); // brass chiff attack
    mainGain.gain.exponentialRampToValueAtTime(peakVolume * 0.75, now + 0.15); // sustain level

    // Connect node graph
    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(formantFilter);
    formantFilter.connect(mainGain);
    mainGain.connect(this.ctx.destination);

    osc.start(now);
    subOsc.start(now);

    let stopped = false;
    const stopSound = () => {
      if (stopped || !this.ctx) return;
      stopped = true;
      const stopNow = this.ctx.currentTime;
      try {
        mainGain.gain.cancelScheduledValues(stopNow);
        mainGain.gain.setValueAtTime(Math.max(0.0001, mainGain.gain.value), stopNow);
        mainGain.gain.exponentialRampToValueAtTime(0.0001, stopNow + 0.18);
        osc.stop(stopNow + 0.2);
        subOsc.stop(stopNow + 0.2);
        lfo.stop(stopNow + 0.2);
      } catch {
        // ignore if already stopped
      }
    };

    if (duration && duration > 0) {
      setTimeout(() => {
        stopSound();
      }, duration * 1000);
    }

    return stopSound;
  }

  /**
   * Plays a continuous smooth Trombone slide glissando between two pitches
   */
  public playTromboneGlissando(
    startFreq: number,
    endFreq: number,
    durationSeconds: number = 0.85
  ): () => void {
    if (this.isMuted) return () => {};
    this.initContext();
    if (!this.ctx) return () => {};

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const mainGain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(startFreq, now);
    // Smooth glissando continuous pitch slide
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + durationSeconds);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.max(2200, startFreq * 8), now);
    filter.frequency.exponentialRampToValueAtTime(Math.max(2200, endFreq * 8), now + durationSeconds);
    filter.Q.setValueAtTime(3.8, now);

    mainGain.gain.setValueAtTime(0.0001, now);
    mainGain.gain.exponentialRampToValueAtTime(0.32, now + 0.05);
    mainGain.gain.setValueAtTime(0.30, now + durationSeconds - 0.05);
    mainGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSeconds + 0.15);

    osc.connect(filter);
    filter.connect(mainGain);
    mainGain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + durationSeconds + 0.2);

    return () => {
      try {
        osc.stop();
      } catch {}
    };
  }

  /**
   * Plays a sequence of notes (e.g. scale) with synchronized callbacks
   */
  public playScaleSequence(
    frequencies: number[],
    noteDurationMs: number = 420,
    onNoteChange?: (index: number) => void,
    onComplete?: () => void,
    instrumentType: 'cornet' | 'horn' | 'euphonium' | 'bass' | 'trombone' | 'glockenspiel' = 'cornet'
  ): () => void {
    if (frequencies.length === 0) return () => {};

    let currentIndex = 0;
    let isCancelled = false;
    let timeoutId: number | null = null;
    let currentStop: (() => void) | null = null;

    const playNext = () => {
      if (isCancelled) return;
      if (currentIndex >= frequencies.length) {
        onComplete?.();
        return;
      }

      onNoteChange?.(currentIndex);
      const freq = frequencies[currentIndex];
      currentStop = this.playBrassTone(freq, noteDurationMs / 1000 * 0.9, instrumentType);

      currentIndex++;
      timeoutId = window.setTimeout(playNext, noteDurationMs);
    };

    playNext();

    return () => {
      isCancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
      if (currentStop) currentStop();
      onComplete?.();
    };
  }

  /**
   * Plays a musical melody sequence with variable note durations and tempo scaling
   */
  public playScoreMelody(
    notes: { freqHz: number; durationMs: number; isRest?: boolean }[],
    tempoMultiplier: number = 1.0,
    onNoteChange?: (index: number) => void,
    onComplete?: () => void,
    instrumentType: 'cornet' | 'horn' | 'euphonium' | 'bass' | 'trombone' | 'glockenspiel' = 'cornet'
  ): () => void {
    if (notes.length === 0) return () => {};

    let currentIndex = 0;
    let isCancelled = false;
    let timeoutId: number | null = null;
    let currentStop: (() => void) | null = null;

    const playNext = () => {
      if (isCancelled) return;
      if (currentIndex >= notes.length) {
        onComplete?.();
        return;
      }

      const note = notes[currentIndex];
      const duration = Math.max(100, note.durationMs / tempoMultiplier);

      onNoteChange?.(currentIndex);

      if (!note.isRest && note.freqHz > 0) {
        currentStop = this.playBrassTone(note.freqHz, (duration / 1000) * 0.92, instrumentType);
      }

      currentIndex++;
      timeoutId = window.setTimeout(playNext, duration);
    };

    playNext();

    return () => {
      isCancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
      if (currentStop) currentStop();
      onComplete?.();
    };
  }

  /**
   * Plays synthesized British Brass Band percussion and auxiliary instruments
   */
  public playPercussion(type: 'snare' | 'bassdrum' | 'cymbal' | 'timpani' | 'glockenspiel' | 'triangle' | 'tambourine' | 'cowbell' | 'woodblock' | 'claves') {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    if (type === 'bassdrum') {
      // Powerful punchy brass band concert bass drum
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(38, now + 0.35);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === 'snare') {
      // Crisp side drum / snare with snap & snare wire rattle
      const bufferSize = this.ctx.sampleRate * 0.2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.setValueAtTime(1200, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.35, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      // Add fundamental drumhead body tone
      const bodyOsc = this.ctx.createOscillator();
      const bodyGain = this.ctx.createGain();
      bodyOsc.frequency.setValueAtTime(180, now);
      bodyOsc.frequency.exponentialRampToValueAtTime(90, now + 0.1);
      bodyGain.gain.setValueAtTime(0.3, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      bodyOsc.connect(bodyGain);
      bodyGain.connect(this.ctx.destination);

      noise.start(now);
      bodyOsc.start(now);
      noise.stop(now + 0.2);
      bodyOsc.stop(now + 0.15);
    } else if (type === 'cymbal') {
      // Orchestral clash cymbals / crash
      const bufferSize = this.ctx.sampleRate * 0.8;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(6500, now);
      bandpass.Q.setValueAtTime(1.5, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      noise.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 0.8);
    } else if (type === 'timpani') {
      // Resonant kettle drum tuned in F (87.3Hz) or C (130.8Hz)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(105, now);
      osc.frequency.exponentialRampToValueAtTime(87.3, now + 0.08); // pitch settle
      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 1.2);
    } else if (type === 'glockenspiel') {
      // Crystal clear bright bell chime (C6 = 1046.5Hz)
      const osc = this.ctx.createOscillator();
      const overtone = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      overtone.type = 'sine';
      osc.frequency.setValueAtTime(1046.5, now);
      overtone.frequency.setValueAtTime(2790, now);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc.connect(gain);
      overtone.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      overtone.start(now);
      osc.stop(now + 0.7);
      overtone.stop(now + 0.7);
    } else if (type === 'triangle') {
      // Shimmering high triangle (4100Hz + overtone)
      const osc = this.ctx.createOscillator();
      const over = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      over.type = 'sine';
      osc.frequency.setValueAtTime(4200, now);
      over.frequency.setValueAtTime(6800, now);
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);
      osc.connect(gain);
      over.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      over.start(now);
      osc.stop(now + 1.1);
      over.stop(now + 1.1);
    } else if (type === 'tambourine') {
      // Jingling jingles + light head tap
      const bufferSize = this.ctx.sampleRate * 0.25;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(7500, now);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
      noise.stop(now + 0.25);
    } else if (type === 'cowbell') {
      // Double resonant fundamental cowbell
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc1.type = 'square';
      osc2.type = 'square';
      osc1.frequency.setValueAtTime(580, now);
      osc2.frequency.setValueAtTime(840, now);
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.Q.setValueAtTime(2.5, now);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.35);
      osc2.stop(now + 0.35);
    } else if (type === 'woodblock') {
      // Hollow high wood pitch (800Hz quick tap)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(950, now);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'claves') {
      // Piercing high wooden cylinder strike (2200Hz)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2200, now);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    }
  }

  /**
   * Plays a triad chord (3 simultaneous notes)
   */
  public playTriad(frequencies: [number, number, number], durationSec: number = 1.2, instrumentType: 'cornet' | 'horn' | 'euphonium' = 'cornet') {
    if (this.isMuted) return;
    frequencies.forEach(f => {
      this.playBrassTone(f, durationSec, instrumentType);
    });
  }

  /**
   * Plays a cadence progression (e.g. V -> I or IV -> I)
   */
  public playCadence(chords: [number, number, number][], chordDurationMs: number = 700) {
    if (this.isMuted || chords.length === 0) return;
    chords.forEach((chord, idx) => {
      setTimeout(() => {
        this.playTriad(chord, (chordDurationMs / 1000) * 0.95);
      }, idx * chordDurationMs);
    });
  }

  /**
   * Plays articulation demo (staccato, tenuto, accent, marcato)
   */
  public playArticulation(freq: number, type: 'staccato' | 'tenuto' | 'accent' | 'marcato' | 'legato') {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3200, now);

    let duration = 0.5;
    let peakVol = 0.28;

    if (type === 'staccato') {
      duration = 0.12;
      peakVol = 0.28;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(peakVol, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    } else if (type === 'tenuto') {
      duration = 0.85;
      peakVol = 0.25;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(peakVol, now + 0.03);
      gain.gain.setValueAtTime(peakVol, now + duration - 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    } else if (type === 'accent') {
      duration = 0.5;
      peakVol = 0.45;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(peakVol, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(peakVol * 0.4, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    } else if (type === 'marcato') {
      duration = 0.25;
      peakVol = 0.5;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(peakVol, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    } else {
      // Legato
      duration = 0.7;
      peakVol = 0.24;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(peakVol, now + 0.06);
      gain.gain.setValueAtTime(peakVol, now + duration - 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    }

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  /**
   * Short feedback sound for quiz
   */
  public playFeedback(correct: boolean) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    gain.connect(this.ctx.destination);
    osc.connect(gain);

    if (correct) {
      // Pleasant British brass triad fanfare
      osc.frequency.setValueAtTime(466.16, now); // Bb4
      osc.frequency.setValueAtTime(587.33, now + 0.08); // D5
      osc.frequency.setValueAtTime(698.46, now + 0.16); // F5
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.45);
    } else {
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(196, now + 0.12);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    }
  }
}

export const brassAudio = new BrassAudioEngine();
