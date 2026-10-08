import React, { useState } from 'react';
import { 
  Sparkles, 
  Volume2, 
  ArrowRight, 
  HelpCircle, 
  Layers, 
  Compass, 
  CheckCircle2, 
  Zap, 
  SlidersHorizontal 
} from 'lucide-react';
import { 
  ACCIDENTAL_THEORY_ITEMS, 
  ORDER_OF_ACCIDENTALS, 
  ENHARMONIC_EQUIVALENTS, 
  TRANSPOSITION_ACCIDENTALS_MATRIX 
} from '../data/scalesData';
import { brassAudio } from '../audio/brassAudio';

export const SharpsFlatsMasterclass: React.FC = () => {
  const [selectedAccidental, setSelectedAccidental] = useState(ACCIDENTAL_THEORY_ITEMS[0]);
  const [selectedEnharmonic, setSelectedEnharmonic] = useState(ENHARMONIC_EQUIVALENTS[0]);
  const [interactiveRootNote, setInteractiveRootNote] = useState<string>('F');
  const [activeAccidentalMod, setActiveAccidentalMod] = useState<'flat' | 'natural' | 'sharp'>('natural');
  const [selectedInstrument, setSelectedInstrument] = useState<'bb-cornet' | 'eb-horn' | 'trombone' | 'euphonium' | 'bass' | 'glockenspiel'>('bb-cornet');

  // Interactive note audition
  const getNotePitch = (baseNote: string, mod: 'flat' | 'natural' | 'sharp', inst: string) => {
    // Base frequencies in Bb treble clef (written)
    const baseFreqs: Record<string, number> = {
      'C': 233.08,
      'D': 261.63,
      'E': 293.66,
      'F': 311.13,
      'G': 349.23,
      'A': 392.00,
      'B': 440.00
    };

    let semitoneShift = 0;
    if (mod === 'sharp') semitoneShift = 1;
    if (mod === 'flat') semitoneShift = -1;

    let base = baseFreqs[baseNote] || 233.08;
    
    // Transposition adjustment for instrument timbre/concert frequency
    if (inst === 'eb-horn') base = base * Math.pow(2, 5 / 12); // Eb sounds major 6th lower (transposed higher in written clef)
    if (inst === 'bass') base = base * 0.5; // Bass 1 octave down
    if (inst === 'glockenspiel') base = base * 4; // Glockenspiel 2 octaves up

    const freq = base * Math.pow(2, semitoneShift / 12);

    let valveDescription = '';
    let slideDescription = '';
    let concertSoundName = '';

    if (baseNote === 'F') {
      if (mod === 'natural') { 
        valveDescription = '1st Valve'; 
        slideDescription = '3rd Position (Bell rim)';
        concertSoundName = inst === 'eb-horn' ? 'Ab3' : inst === 'bb-cornet' ? 'Eb4' : 'Eb4';
      }
      if (mod === 'sharp') { 
        valveDescription = '2nd Valve'; 
        slideDescription = '5th Position (or 2nd pos on 6th partial)';
        concertSoundName = inst === 'eb-horn' ? 'A3' : inst === 'bb-cornet' ? 'E4' : 'E4';
      }
      if (mod === 'flat') { 
        valveDescription = '1st + 2nd Valve (Sounds E natural)'; 
        slideDescription = '4th Position';
        concertSoundName = inst === 'eb-horn' ? 'G3' : inst === 'bb-cornet' ? 'D4' : 'D4';
      }
    } else if (baseNote === 'B') {
      if (mod === 'natural') { 
        valveDescription = '2nd Valve'; 
        slideDescription = '2nd Position';
        concertSoundName = inst === 'eb-horn' ? 'D4' : inst === 'bb-cornet' ? 'A4' : 'A4';
      }
      if (mod === 'flat') { 
        valveDescription = '1st Valve'; 
        slideDescription = '1st Position';
        concertSoundName = inst === 'eb-horn' ? 'Db4' : inst === 'bb-cornet' ? 'Ab4' : 'Ab4';
      }
      if (mod === 'sharp') { 
        valveDescription = 'Open (Sounds C natural)'; 
        slideDescription = '1st Position';
        concertSoundName = inst === 'eb-horn' ? 'Eb4' : inst === 'bb-cornet' ? 'Bb4' : 'Bb4';
      }
    } else if (baseNote === 'C') {
      if (mod === 'natural') { 
        valveDescription = 'Open'; 
        slideDescription = '1st Position';
        concertSoundName = inst === 'eb-horn' ? 'Eb4' : inst === 'bb-cornet' ? 'Bb3' : 'Bb3';
      }
      if (mod === 'sharp') { 
        valveDescription = '1 + 2 + 3 (Trigger slide kicked out!)'; 
        slideDescription = '5th Position';
        concertSoundName = inst === 'eb-horn' ? 'E4' : inst === 'bb-cornet' ? 'B3' : 'B3';
      }
      if (mod === 'flat') { 
        valveDescription = '2nd Valve (Sounds B natural)'; 
        slideDescription = '2nd Position';
        concertSoundName = inst === 'eb-horn' ? 'D4' : inst === 'bb-cornet' ? 'A3' : 'A3';
      }
    } else if (baseNote === 'G') {
      if (mod === 'natural') { 
        valveDescription = 'Open'; 
        slideDescription = '1st Position';
        concertSoundName = inst === 'eb-horn' ? 'Bb3' : inst === 'bb-cornet' ? 'F4' : 'F4';
      }
      if (mod === 'sharp') { 
        valveDescription = '2 + 3 Valves'; 
        slideDescription = '3rd Position';
        concertSoundName = inst === 'eb-horn' ? 'B3' : inst === 'bb-cornet' ? 'F#4' : 'F#4';
      }
      if (mod === 'flat') { 
        valveDescription = '2nd Valve (Sounds F#)'; 
        slideDescription = '5th Position';
        concertSoundName = inst === 'eb-horn' ? 'A3' : inst === 'bb-cornet' ? 'E4' : 'E4';
      }
    } else {
      valveDescription = mod === 'sharp' ? 'Raises fingering 1 semitone' : mod === 'flat' ? 'Lowers fingering 1 semitone' : 'Standard open/valve harmonics';
      slideDescription = mod === 'sharp' ? 'Pull slide in 1 position' : mod === 'flat' ? 'Push slide out 1 position' : 'Standard position';
      concertSoundName = 'Transposed pitch';
    }

    return {
      freq,
      valveDescription,
      slideDescription,
      concertSoundName,
      fullName: `${baseNote}${mod === 'sharp' ? '♯' : mod === 'flat' ? '♭' : '♮'}`
    };
  };

  const currentPitchInfo = getNotePitch(interactiveRootNote, activeAccidentalMod, selectedInstrument);

  const playPitch = () => {
    let timbre: 'cornet' | 'horn' | 'euphonium' | 'bass' | 'trombone' | 'glockenspiel' = 'cornet';
    if (selectedInstrument === 'eb-horn') timbre = 'horn';
    if (selectedInstrument === 'euphonium') timbre = 'euphonium';
    if (selectedInstrument === 'trombone') timbre = 'trombone';
    if (selectedInstrument === 'bass') timbre = 'bass';
    if (selectedInstrument === 'glockenspiel') timbre = 'glockenspiel';
    brassAudio.playBrassTone(currentPitchInfo.freq, 0.8, timbre);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
          <Sparkles className="h-4 w-4" />
          <span>Music Theory & Practical Acoustics</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
          Sharps & Flats Masterclass for All Brass Instruments
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-3xl">
          Understand exactly how accidentals modify the physics of your horn. Learn why adding a sharp pulls the trombone slide inward or switches to a shorter valve loop, why flats lengthen the tubing, and how key signatures transpose across B♭, E♭, and Concert instruments.
        </p>
      </div>

      {/* SECTION 1: INTERACTIVE ACCIDENTAL MECHANICS LAB */}
      <div className="mb-10 rounded-3xl border border-amber-500/30 bg-slate-900/90 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
          <div>
            <div className="text-xs uppercase font-semibold text-amber-400 mb-1">
              Live Acoustic Modifier Lab
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-100">
              Audition How Accidentals Alter Brass Fingerings
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select a note below and apply a Flat (♭), Natural (♮), or Sharp (♯) to hear the acoustic shift and see the exact valve/slide adjustment.
            </p>
          </div>

          <button
            onClick={playPitch}
            className="flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-300 transition-colors shadow-lg active:scale-95"
          >
            <Volume2 className="h-4 w-4" />
            <span>Hear {currentPitchInfo.fullName}</span>
          </button>
        </div>

        {/* Note & Modifier Selector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div>
              <span className="text-xs uppercase font-semibold text-slate-400 block mb-2">
                1. Select Root Note:
              </span>
              <div className="flex flex-wrap gap-2">
                {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map(note => (
                  <button
                    key={note}
                    onClick={() => setInteractiveRootNote(note)}
                    className={`h-11 w-11 rounded-xl font-serif text-lg font-bold transition-all ${
                      interactiveRootNote === note
                        ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-400/50'
                        : 'border border-slate-800 bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {note}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs uppercase font-semibold text-slate-400 block mb-2">
                2. Apply Accidental:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setActiveAccidentalMod('flat')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    activeAccidentalMod === 'flat'
                      ? 'border-sky-400 bg-sky-500/20 text-sky-200 ring-2 ring-sky-400/40'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="font-serif text-2xl font-bold">♭ Flat</span>
                  <span className="text-[10px] mt-0.5 opacity-80">-1 Semitone (Lowers)</span>
                </button>

                <button
                  onClick={() => setActiveAccidentalMod('natural')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    activeAccidentalMod === 'natural'
                      ? 'border-amber-400 bg-amber-500/20 text-amber-200 ring-2 ring-amber-400/40'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="font-serif text-2xl font-bold">♮ Natural</span>
                  <span className="text-[10px] mt-0.5 opacity-80">Unmodified White Key</span>
                </button>

                <button
                  onClick={() => setActiveAccidentalMod('sharp')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    activeAccidentalMod === 'sharp'
                      ? 'border-rose-400 bg-rose-500/20 text-rose-200 ring-2 ring-rose-400/40'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="font-serif text-2xl font-bold">♯ Sharp</span>
                  <span className="text-[10px] mt-0.5 opacity-80">+1 Semitone (Raises)</span>
                </button>
              </div>
            </div>

            <div>
              <span className="text-xs uppercase font-semibold text-slate-400 block mb-2">
                3. Choose Instrument Perspective:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'bb-cornet', label: 'Bb Cornet / Flugel' },
                  { id: 'eb-horn', label: 'Eb Tenor Horn' },
                  { id: 'trombone', label: 'Tenor Trombone' },
                  { id: 'euphonium', label: 'Bb Euphonium' },
                  { id: 'bass', label: 'BBb Tuba Bass' },
                  { id: 'glockenspiel', label: 'Glockenspiel' }
                ].map(inst => (
                  <button
                    key={inst.id}
                    onClick={() => setSelectedInstrument(inst.id as any)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                      selectedInstrument === inst.id
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'border border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    {inst.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Readout Card */}
          <div className="lg:col-span-5 rounded-2xl border border-amber-500/20 bg-slate-950 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs uppercase font-semibold text-slate-400">
                Acoustic Pitch Result
              </span>
              <span className="font-mono text-sm text-slate-400">
                {currentPitchInfo.freq.toFixed(1)} Hz
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-4xl sm:text-5xl font-bold text-amber-400">
                  {currentPitchInfo.fullName}
                </span>
                <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Sounds: {currentPitchInfo.concertSoundName}
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-1.5">
                {activeAccidentalMod === 'sharp' && 'Shortens tube length by 1 semitone — raises acoustic frequency'}
                {activeAccidentalMod === 'flat' && 'Lengthens tube length by 1 semitone — lowers acoustic frequency'}
                {activeAccidentalMod === 'natural' && 'Natural unlengthened acoustic harmonic resonance'}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <span className="text-slate-500 font-semibold w-24 shrink-0">Valved Brass:</span>
                <span className="font-bold text-amber-300">{currentPitchInfo.valveDescription}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-slate-500 font-semibold w-24 shrink-0">Trombone:</span>
                <span className="font-bold text-sky-300">{currentPitchInfo.slideDescription}</span>
              </div>
              <div className="flex items-start gap-2 pt-1 border-t border-slate-800/80 text-[11px] text-slate-400">
                <span className="text-slate-500 font-semibold w-24 shrink-0">Instrument:</span>
                <span>
                  {selectedInstrument === 'bb-cornet' && 'B♭ Cornet (reads treble, sounds 1 whole tone lower)'}
                  {selectedInstrument === 'eb-horn' && 'E♭ Tenor Horn (reads treble, sounds major 6th lower)'}
                  {selectedInstrument === 'trombone' && 'Tenor Trombone (slide positions 1–7 with overtone partials)'}
                  {selectedInstrument === 'euphonium' && 'B♭ Euphonium (reads treble, sounds octave + major second lower)'}
                  {selectedInstrument === 'bass' && 'BBb Tuba / Eb Bass (reads treble in British tradition)'}
                  {selectedInstrument === 'glockenspiel' && 'Glockenspiel (sounds 2 octaves above written notation)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: THE 5 ACCIDENTALS ROADMAP */}
      <div className="mb-10 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-100 mb-2">
          The Five Musical Accidentals & Their Mechanical Impact on Brass
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mb-6">
          Every accidental changes the length of vibrating air inside brass tubing:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {ACCIDENTAL_THEORY_ITEMS.map(item => (
            <div
              key={item.name}
              className="rounded-2xl border border-slate-800 bg-slate-950 p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-serif text-3xl font-bold text-amber-400">
                    {item.symbol}
                  </span>
                  <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[11px] text-slate-300 font-bold">
                    {item.semitoneShift > 0 ? `+${item.semitoneShift}` : item.semitoneShift} st
                  </span>
                </div>
                <h4 className="font-serif text-base font-bold text-slate-200">
                  {item.name}
                </h4>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  {item.effect}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-300 space-y-1">
                <div>• <strong>Valves:</strong> {item.valveImpact}</div>
                <div>• <strong>Trombone:</strong> {item.tromboneImpact}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: ORDER OF SHARPS & ORDER OF FLATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Order of Sharps */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="rounded bg-rose-500/20 px-2.5 py-1 text-xs font-bold text-rose-300 font-mono">
              ♯ SHARPS
            </span>
            <h4 className="font-serif text-lg font-bold text-slate-100">
              The Order of Sharps
            </h4>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Sharps always appear in exact order on musical staves:
          </p>

          <div className="flex items-center justify-between gap-1 mb-4 p-3 rounded-xl bg-slate-950 border border-slate-800">
            {ORDER_OF_ACCIDENTALS.sharps.sequence.map((s, idx) => (
              <div key={s} className="flex flex-col items-center">
                <span className="font-serif text-lg font-bold text-rose-400">{s}</span>
                <span className="text-[10px] text-slate-500">#{idx + 1}</span>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-amber-400/10 border border-amber-400/30 p-3 text-xs text-amber-200 mb-3">
            <strong>Mnemonic:</strong> "{ORDER_OF_ACCIDENTALS.sharps.mnemonic}"
          </div>
          <p className="text-xs text-slate-400">
            <strong>Brass Band Rule:</strong> {ORDER_OF_ACCIDENTALS.sharps.rule}
          </p>
        </div>

        {/* Order of Flats */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="rounded bg-sky-500/20 px-2.5 py-1 text-xs font-bold text-sky-300 font-mono">
              ♭ FLATS
            </span>
            <h4 className="font-serif text-lg font-bold text-slate-100">
              The Order of Flats
            </h4>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Flats always appear in reverse order of sharps:
          </p>

          <div className="flex items-center justify-between gap-1 mb-4 p-3 rounded-xl bg-slate-950 border border-slate-800">
            {ORDER_OF_ACCIDENTALS.flats.sequence.map((f, idx) => (
              <div key={f} className="flex flex-col items-center">
                <span className="font-serif text-lg font-bold text-sky-400">{f}</span>
                <span className="text-[10px] text-slate-500">#{idx + 1}</span>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-sky-400/10 border border-sky-400/30 p-3 text-xs text-sky-200 mb-3">
            <strong>Mnemonic:</strong> "{ORDER_OF_ACCIDENTALS.flats.mnemonic}"
          </div>
          <p className="text-xs text-slate-400">
            <strong>Brass Band Rule:</strong> {ORDER_OF_ACCIDENTALS.flats.rule}
          </p>
        </div>
      </div>

      {/* SECTION 4: ENHARMONIC EQUIVALENTS EXPLORER */}
      <div className="mb-10 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-100 mb-2">
          Enharmonic Equivalents: Same Brass Sound, Different Spelling
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mb-6">
          In 12-tone equal temperament, two differently named notes vibrate at the exact identical acoustic frequency and use identical valve combinations:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {ENHARMONIC_EQUIVALENTS.map(enh => (
            <div
              key={enh.sharp}
              className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-base font-bold text-amber-300">
                  {enh.sharp}
                </span>
                <span className="text-xs text-slate-500 font-bold">=</span>
                <span className="font-serif text-base font-bold text-sky-300">
                  {enh.flat}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono">{enh.freqHz.toFixed(1)} Hz</span>
                <button
                  onClick={() => brassAudio.playBrassTone(enh.freqHz, 0.6, 'cornet')}
                  className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 hover:bg-amber-400 hover:text-slate-950"
                >
                  Test Audio
                </button>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight pt-1 border-t border-slate-800/80">
                {enh.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 5: TRANSPOSITION ACCIDENTALS MATRIX */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-100 mb-2">
          Transposition Key Signatures Matrix (Concert vs B♭ vs E♭)
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mb-4">
          How key signatures shift across the band when accompanying hymns or concert pieces:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase">
                <th className="py-2.5 px-3">Concert Pitch (Piano / Organ)</th>
                <th className="py-2.5 px-3 text-amber-300">B♭ Brass (Cornet / Trombone / Euph)</th>
                <th className="py-2.5 px-3 text-sky-300">E♭ Brass (Tenor Horn / EE♭ Bass)</th>
                <th className="py-2.5 px-3">Transposition Rule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {TRANSPOSITION_ACCIDENTALS_MATRIX.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 text-slate-200 font-semibold">{row.concertKey}</td>
                  <td className="py-2.5 px-3 text-amber-300 font-bold">{row.bbBrassKey}</td>
                  <td className="py-2.5 px-3 text-sky-300 font-bold">{row.ebBrassKey}</td>
                  <td className="py-2.5 px-3 text-slate-400 font-sans text-[11px]">{row.shiftRule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
