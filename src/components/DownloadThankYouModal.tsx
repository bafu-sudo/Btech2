import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  Heart,
  Instagram,
  CheckCircle2,
  ExternalLink,
  Smartphone,
  Music,
  Share2,
  X,
  Volume2
} from 'lucide-react';
import exactFounderPhoto from '../assets/images/nokuvimba_bafu_exact_1791291814595.jpg';
import { brassAudio } from '../audio/brassAudio';
import { analyticsService } from '../services/analyticsService';

interface DownloadThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
  downloadedItemName?: string;
  onOpenGroupChat?: () => void;
}

export const DownloadThankYouModal: React.FC<DownloadThankYouModalProps> = ({
  isOpen,
  onClose,
  downloadedItemName = 'Btech2.apk',
  onOpenGroupChat
}) => {
  const [particles, setParticles] = useState<Array<{ id: number; symbol: string; left: number; delay: number; size: number }>>([]);

  useEffect(() => {
    if (isOpen) {
      // Play celebratory brass triad fanfare (C4 - E4 - G4 - C5)
      try {
        const notes = [261.63, 329.63, 392.0, 523.25];
        notes.forEach((freq, i) => {
          setTimeout(() => {
            brassAudio.playBrassTone(freq, 0.45, 'cornet');
          }, i * 140);
        });
      } catch {
        // audio might be muted or locked
      }

      // Generate joyful floating particles
      const symbols = ['🎺', '✨', '🎵', '🎷', '🎶', '⭐', '👏', '🎼'];
      const newParticles = Array.from({ length: 18 }, (_, i) => ({
        id: i,
        symbol: symbols[i % symbols.length],
        left: Math.floor(Math.random() * 90) + 5,
        delay: Math.random() * 2,
        size: Math.floor(Math.random() * 12) + 16
      }));
      setParticles(newParticles);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInstagramClick = () => {
    analyticsService.recordInstagramClick();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      
      {/* FLOATING CELEBRATION PARTICLES */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute animate-floatUp opacity-70"
            style={{
              left: `${p.left}%`,
              bottom: '-20px',
              animationDelay: `${p.delay}s`,
              fontSize: `${p.size}px`
            }}
          >
            {p.symbol}
          </div>
        ))}
      </div>

      <div className="relative w-full max-w-2xl rounded-3xl border border-amber-500/50 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 shadow-2xl shadow-amber-500/20 overflow-hidden my-auto transform transition-all animate-scaleUp">
        
        {/* GOLD ACCENT BAR */}
        <div className="h-2 w-full bg-gradient-to-r from-amber-400 via-rose-500 to-yellow-300" />

        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          title="Close Thank You Message"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
          
          {/* CELEBRATION HEADER WITH FOUNDER PORTRAIT */}
          <div className="text-center space-y-3">
            
            {/* FOUNDER PORTRAIT WITH ANIMATED GLOW */}
            <div className="relative mx-auto inline-block">
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-rose-500 to-amber-300 shadow-xl shadow-amber-500/30">
                <img
                  src={exactFounderPhoto}
                  alt="Nokuvimba Bafu - Founder of btech"
                  className="h-full w-full rounded-full object-cover object-top"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-slate-950 shadow-md ring-2 ring-slate-900">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-300">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Download Successfully Initiated!</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
              Thank You for Downloading Btech2!
            </h2>

            <p className="text-xs sm:text-sm font-medium text-amber-300">
              A Personal Note of Gratitude from Founder <strong className="text-amber-200">Nokuvimba Bafu</strong>
            </p>
          </div>

          {/* FOUNDER'S LETTER / THANK YOU ANIMATION CARD */}
          <div className="relative rounded-2xl border border-amber-500/30 bg-slate-950/70 p-5 sm:p-6 shadow-inner space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            
            <p className="font-serif italic text-amber-200 text-sm sm:text-base border-l-2 border-amber-400 pl-3">
              "I struggled to teach myself brass music, so I want to make it easier for the next person."
            </p>

            <p>
              Dear Fellow Musician & Learner,
            </p>

            <p>
              Thank you genuinely from the bottom of my heart for downloading <strong className="text-amber-300 font-semibold">{downloadedItemName}</strong>! 
              I am an 18-year-old student and cornet player from Zimbabwe. When I first held a brass instrument, 
              there were so many obstacles: confusing transposition between treble and concert pitch, deciphering fingering charts, 
              and finding authentic brass band scores.
            </p>

            <p>
              I built <strong className="text-slate-100 font-semibold">btech & Btech2</strong> so that anyone — whether you are playing in a church band, 
              a school brass group, or teaching yourself at home — has immediate access to 
              fingering mechanics, slide simulators, 16 music theory modules, and conductors' guidelines.
            </p>

            <p>
              Your download represents another brass musician stepping forward to learn and perform. 
              Practise with patience, keep steady airflow, and never let difficult notation discourage you!
            </p>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs text-slate-400">
              <div>
                <span className="font-bold text-slate-200 block">Nokuvimba Bafu</span>
                <span className="text-[11px] text-amber-400">Founder of btech · Cornetist · Zimbabwe</span>
              </div>
              <span className="text-xl">🎺</span>
            </div>

          </div>

          {/* WHAT YOU CAN DO NEXT */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Smartphone className="h-4 w-4 text-amber-400" />
              <span>Next Steps with Btech2</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
              <div className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                <span className="font-bold text-amber-400">1.</span>
                <span>Open APK on your Android device for full offline practice and synthesizer playback.</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                <span className="font-bold text-amber-400">2.</span>
                <span>Join our Live Band Room Chat to discuss fingerings and share scores with real students.</span>
              </div>
            </div>
          </div>

          {/* COMMUNITY ACTION BUTTONS */}
          <div className="space-y-2.5 pt-1">
            {/* INSTAGRAM BUTTON */}
            <a
              href="https://www.instagram.com/_btech_2/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleInstagramClick}
              className="flex items-center justify-center gap-2.5 w-full rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-pink-500/20 transition-all hover:brightness-110 hover:scale-[1.01]"
            >
              <Instagram className="h-4 w-4" />
              <span>Connect with Nokuvimba on Instagram</span>
              <span className="rounded bg-black/25 px-2 py-0.5 font-mono text-xs text-pink-100">@_btech_2</span>
              <ExternalLink className="h-3.5 w-3.5 ml-1" />
            </a>

            <div className="flex items-center gap-2">
              {onOpenGroupChat && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenGroupChat();
                  }}
                  className="flex-1 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>💬 Join Live Band Chat</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
              >
                Continue Learning
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
