import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Music2,
  Heart,
  Award,
  Globe,
  BookOpen,
  Camera,
  Upload,
  Instagram,
  ExternalLink,
} from 'lucide-react';

import exactFounderPhoto from '../assets/images/nokuvimba_bafu_exact_1791291814595.jpg';
import { analyticsService } from '../services/analyticsService';

export const AboutFounder: React.FC = () => {
  const [photoSrc, setPhotoSrc] = useState<string>(exactFounderPhoto);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('founder_nokuvimba_photo_raw');

    if (saved) {
      setPhotoSrc(saved);
    }
  }, []);

  const handleCustomUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const result = event.target?.result as string;

        if (result) {
          setPhotoSrc(result);

          try {
            localStorage.setItem(
              'founder_nokuvimba_photo_raw',
              result
            );
          } catch {
            // Ignore storage limit errors
          }
        }
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">

      {/* HEADER */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-300 mb-3">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>Founder's Vision & Heritage</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-100">
          The Story Behind btech
        </h1>

        <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          Born from a personal journey through music, brass-band life,
          self-learning, and a desire to make brass music easier for others
          to understand.
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-7 space-y-6">

          {/* BIOGRAPHY */}
          <div className="rounded-2xl border border-amber-500/20 bg-slate-900/90 p-6 sm:p-8 shadow-xl">

            <h2 className="font-serif text-2xl font-bold text-slate-100 mb-4">
              The Story of Nokuvimba Bafu
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed">

              <p>
                <strong className="text-amber-300 font-semibold">
                  Nokuvimba Bafu
                </strong>{' '}
                is an 18-year-old guy from Zimbabwe who has a genuine love for
                <strong className="text-slate-100 font-semibold">
                  {' '}music, brass, and technology
                </strong>.
                He wasn't born a musician, nor did he grow up knowing
                everything about music. His journey simply began with a young
                boy who found something he enjoyed and gradually developed a
                passion for it.
              </p>

              <p>
                Nokuvimba was born in{' '}
                <strong className="text-amber-300">Zimbabwe</strong>{' '}
                and later grew up in{' '}
                <strong className="text-amber-300">Kenya</strong>,
                where he lived for about{' '}
                <strong className="text-slate-100">10 years</strong>.
                His connection with music started at a young age in Zimbabwe
                through{' '}
                <strong className="text-amber-300 font-semibold">
                  The Salvation Army Mpopoma Corps in the Matebeleland Division
                </strong>.
              </p>

              <p>
                At around{' '}
                <strong className="text-slate-100">
                  six years old
                </strong>,
                Nokuvimba started playing the{' '}
                <strong className="text-amber-300 font-semibold">
                  drum set
                </strong>{' '}
                at{' '}
                <strong className="text-amber-300 font-semibold">
                  Mucheke Corps in the Masvingo Division
                </strong>.
                Music quickly became something he genuinely enjoyed. As he
                grew older, that love for music stayed with him.
              </p>

              <p>
                When his family moved to Kenya, Nokuvimba discovered brass
                music. A{' '}
                <strong className="text-amber-300 font-semibold">
                  Junior Band
                </strong>{' '}
                had started at{' '}
                <strong className="text-amber-300 font-semibold">
                  Nakuru Citadel in the Kenya East Territory
                </strong>,
                and this was where he was introduced to the{' '}
                <strong className="text-amber-300 font-semibold">
                  cornet
                </strong>.
              </p>

              <p>
                This is where his love for brass really began. Nokuvimba fell
                in love with the sound of the cornet and the experience of
                playing in a brass band. He enjoyed learning the instrument
                and being around other young musicians.
              </p>

              <p>
                However, his journey was interrupted when his parents were
                transferred to another place where there wasn't a Junior Band.
                Because of this, he stopped playing for a while. Even though
                he was no longer actively playing in a band, his love for the
                cornet and brass music never disappeared.
              </p>

              <p>
                Eventually, Nokuvimba found his way back to brass music.
                Today, he is an{' '}
                <strong className="text-amber-300 font-semibold">
                  active brass member of the BBB
                </strong>,
                continuing to practise, learn, and develop as a cornet player.
              </p>

              <p>
                Nokuvimba's journey with brass music hasn't always been easy.
                One of his biggest challenges was learning how to understand
                brass music on his own. He struggled with{' '}
                <strong className="text-slate-100 font-semibold">
                  reading notes, understanding fingerings, recognising
                  rhythms, and knowing what to play from written music
                </strong>.
              </p>

              <p>
                There were times when he wished there was something that could
                simply show him the note, explain the fingering, demonstrate
                the sound, and make the whole learning process easier.
              </p>

              <p>
                That experience eventually gave him an idea. If learning
                brass music was difficult for him, he realised that there were
                probably other beginners experiencing the same problem.
              </p>

              <p>
                That was the beginning of{' '}
                <strong className="text-amber-300">Btech</strong>.
              </p>

              <p>
                Nokuvimba started Btech with the goal of making brass music
                easier and more accessible to people who are just starting
                out. He wants to bring{' '}
                <strong className="text-slate-100 font-semibold">
                  music and technology together
                </strong>{' '}
                to help learners understand notes, fingerings, rhythms,
                notation, instruments, and playing techniques in a simple and
                practical way.
              </p>

              <p>
                Btech is much more than just a technology project to
                Nokuvimba. It comes directly from his own experience.
              </p>

              <p>
                His journey started with a six-year-old boy playing drums in
                Zimbabwe. Years later, that same love for music led him to
                discover the cornet in Kenya. After stepping away from brass
                for a while, he eventually returned to it and began thinking
                about how technology could help other people learn.
              </p>

              <p>
                Now, at{' '}
                <strong className="text-amber-300">
                  18 years old
                </strong>,
                Nokuvimba is taking something he once struggled with and
                turning it into something that can hopefully help the next
                person.
              </p>

              <p>
                He is still learning. He is still improving as a brass player.
                And that is part of what makes Btech so personal to him.
              </p>

              <p>
                <strong className="text-amber-200 font-serif italic">
                  Nokuvimba didn't build Btech because he knows everything
                  about music. He built it because he loves music, he loves
                  brass, he experienced the struggle of learning it, and he
                  wants to make that journey easier for the next person.
                </strong>
              </p>

              {/* FOUNDER QUOTE */}
              <div className="rounded-xl border border-amber-400/40 bg-amber-400/10 p-5 mt-6">

                <p className="font-serif text-base sm:text-lg font-bold text-amber-200 italic leading-snug">
                  "My goal is simple: I struggled to teach myself brass music,
                  so I want to make it easier for the next person."
                </p>

                <div className="mt-3 flex items-center justify-between text-xs text-amber-300/80">
                  <span className="font-semibold">
                    — Nokuvimba Bafu
                  </span>

                  <span>
                    Founder of btech
                  </span>
                </div>

              </div>

            </div>
          </div>

          {/* SALVATION ARMY HERITAGE */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">

            <div className="flex items-start gap-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
                <Heart className="h-5 w-5" />
              </div>

              <div>

                <h3 className="font-serif text-lg font-bold text-slate-100">
                  The Salvation Army Brass Tradition
                </h3>

                <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  The Salvation Army has played an important role in
                  Nokuvimba's musical journey. From his early experiences in
                  Zimbabwe to discovering the cornet through a Junior Band in
                  Kenya, the Salvation Army brass-band tradition became an
                  important part of his connection with music.
                </p>

                <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                  The Salvation Army brass tradition has a long history of
                  bringing people together through music, worship, community,
                  and service. For Nokuvimba, it was through this environment
                  that he first experienced playing music with others and
                  eventually discovered his love for brass.
                </p>

                <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                  His journey connects different parts of that tradition:
                  beginning with music in Zimbabwe, discovering the cornet in
                  Kenya, and continuing his brass journey today. Btech carries
                  that experience forward by making brass learning more
                  accessible to beginners.
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-5 flex flex-col items-center">

          <div className="w-full rounded-3xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-2xl">

            {/* PHOTO */}
            <div className="group relative w-full overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 shadow-xl">

              <img
                src={photoSrc}
                alt="Nokuvimba Bafu, founder of btech"
                referrerPolicy="no-referrer"
                onError={() => {
                  if (photoSrc !== '/nokuvimba_bafu.jpg') {
                    setPhotoSrc('/nokuvimba_bafu.jpg');
                  }
                }}
                className="w-full h-auto object-cover object-top max-h-[520px]"
              />

              {/* UPLOAD BUTTON */}
              <div className="absolute top-3 right-3">

                <button
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload original photo directly from your device"
                  className="flex items-center gap-1.5 rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1.5 text-[11px] font-medium text-slate-200 hover:bg-black/90 hover:text-amber-300 transition-colors border border-white/10"
                >
                  <Camera className="h-3.5 w-3.5" />
                  <span>Update Photo</span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCustomUpload}
                  className="hidden"
                />

              </div>

            </div>

            {/* CAPTION */}
            <div className="mt-4 text-center">

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-100">
                Nokuvimba Bafu
              </h3>

              <p className="text-xs sm:text-sm font-medium text-amber-400 mt-0.5">
                Founder of btech · Student & Cornet Player
              </p>

              <div className="mt-2 flex items-center justify-center gap-2 text-xs text-slate-400">
                <Globe className="h-3.5 w-3.5 text-slate-500" />
                <span>Zimbabwe</span>
                <span aria-hidden="true">·</span>
                <span>Age 18</span>
              </div>

            </div>

            {/* QUICK STATS */}
            <div className="mt-6 grid grid-cols-2 gap-3 text-xs">

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-center">

                <span className="text-[11px] text-slate-500 block">
                  Primary Instrument
                </span>

                <span className="font-bold text-amber-300 font-serif">
                  B♭ Cornet
                </span>

              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-center">

                <span className="text-[11px] text-slate-500 block">
                  Favorite Style
                </span>

                <span className="font-bold text-slate-200 font-serif">
                  Salvation Army Brass
                </span>

              </div>

            </div>

            {/* MISSION */}
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 text-xs text-slate-400 leading-relaxed text-center">

              "Technology and music together can dismantle barriers. No learner
              should ever have to give up on brass music because notation
              feels out of reach."

            </div>

            {/* OFFICIAL INSTAGRAM SOCIAL MEDIA CARD */}
            <div className="mt-4 rounded-xl border border-pink-500/30 bg-gradient-to-br from-purple-950/40 via-pink-950/30 to-amber-950/20 p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 text-white shadow-sm">
                  <Instagram className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-pink-300">
                  Official Social Media
                </span>
              </div>

              <p className="text-xs text-slate-300 mb-3">
                Follow updates, student progress videos, new brass scores, and tutorials on the official btech Instagram:
              </p>

              <a
                href="https://www.instagram.com/_btech_2/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => analyticsService.recordInstagramClick()}
                className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:brightness-110 hover:scale-[1.02]"
              >
                <Instagram className="h-4 w-4" />
                <span>Connect with us on Instagram</span>
                <span className="font-mono bg-black/25 px-1.5 py-0.5 rounded text-[11px] text-pink-100">@_btech_2</span>
                <ExternalLink className="h-3.5 w-3.5 ml-0.5" />
              </a>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
