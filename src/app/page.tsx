'use client';

import React from 'react';
import { motion } from 'framer-motion';
import FeaturedCollection from '@/components/FeaturedCollection';
import ReviewSection from '@/components/ReviewSection';
import BrandCreed from '@/components/BrandCreed';
import ClubPrivileges from '@/components/ClubPrivileges';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <main className="relative text-ivory bg-[#050505]">

      {/* ── HERO ── full-viewport with contained video bg */}
      <div className="relative min-h-screen overflow-hidden">
        {/* Background Cinematic Video Loop — scoped to hero only */}
        <video
          autoPlay
          muted
          loop
          playsInline
          suppressHydrationWarning
          className="absolute inset-0 w-full h-full object-cover z-[0] pointer-events-none"
        >
          <source src="/assets/logo/video.mp4" type="video/mp4" />
        </video>

        {/* Tint + gradient overlays */}
        <div className="absolute inset-0 z-[1] pointer-events-none bg-black/30 bg-gradient-to-t from-[#050505] via-black/20 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-40 z-[1] pointer-events-none bg-gradient-to-b from-black/70 to-transparent" />

        {/* Scrolling Editorial Chapters Container */}
        <div className="relative w-full h-full z-[10] select-none">
          {/* HERO SECTION — Full Viewport Cinematic */}
          <section
            id="hero"
            className="relative min-h-screen w-full flex flex-col items-start justify-center overflow-hidden"
          >
            {/* Ghost / Watermark outline text — decorative backdrop */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
              <span
                className="font-serif uppercase text-[18vw] leading-none font-bold tracking-tighter"
                style={{
                  WebkitTextStroke: '1px rgba(212,175,55,0.08)',
                  color: 'transparent',
                  letterSpacing: '-0.02em',
                }}
              >
                ELEGANCE
              </span>
            </div>

            {/* Vertical editorial side-label */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-4 pointer-events-none z-20 hidden md:flex w-6">
              <div className="w-px h-16 bg-gold/40" />
              <span
                className="text-xs md:text-sm uppercase tracking-[0.45em] text-gold/60 font-sans leading-none flex items-center justify-center"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                Ink &amp; Cotton Club — Est. 2026
              </span>
              <div className="w-px h-16 bg-gold/40" />
            </div>

            {/* Main hero content */}
            <div className="relative z-20 px-10 md:px-32 w-full max-w-6xl mt-12 md:mt-0">

              {/* Eyebrow label */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex items-center gap-4 mb-8"
              >
                <div className="w-8 h-px bg-gold" />
                <span className="text-sm md:text-base uppercase tracking-[0.45em] text-gold font-sans">
                  Luxury Formal Shirts
                </span>
              </motion.div>

              {/* Main Headline — staggered words */}
              <div className="overflow-hidden mb-2">
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                >
                  <h1
                    className="font-serif text-[9vw] md:text-[5vw] leading-[0.88] uppercase font-light text-ivory tracking-tight"
                    style={{ letterSpacing: '-0.02em' }}
                  >
                    CRAFTED
                  </h1>
                </motion.div>
              </div>

              <div className="overflow-hidden mb-2">
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
                  className="flex items-baseline gap-6 flex-wrap"
                >
                  <h1
                    className="font-serif text-[9vw] md:text-[5vw] leading-[0.88] uppercase font-light tracking-tight"
                    style={{
                      letterSpacing: '-0.02em',
                      WebkitTextStroke: '1.5px rgba(212,175,55,0.7)',
                      color: 'transparent',
                    }}
                  >
                    TO BE
                  </h1>
                </motion.div>
              </div>

              <div className="overflow-hidden mb-10">
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
                >
                  <h1
                    className="font-serif text-[9vw] md:text-[5vw] leading-[0.88] uppercase font-light text-gold tracking-tight italic"
                    style={{ letterSpacing: '-0.02em' }}
                  >
                    REMEMBERED.
                  </h1>
                </motion.div>
              </div>

              {/* Gold divider + descriptor */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-px bg-gold/50" />
                  <p className="text-base md:text-lg font-sans font-light text-ivory/50 uppercase tracking-[0.3em] max-w-sm leading-relaxed">
                    Every thread chosen.<br />Every stitch intentional.
                  </p>
                </div>

              </motion.div>
            </div>
          </section>
        </div>
      </div>{/* end hero wrapper */}

      {/* ── FEATURED COLLECTION STRIP ────────────────── */}
      <FeaturedCollection />

      {/* ── BRAND CREED SECTION ───────────────────────── */}
      <BrandCreed />

      {/* ── CLUB PRIVILEGES SECTION ──────────────────── */}
      <ClubPrivileges />

      {/* ── REVIEWS SECTION ──────────────────────────── */}
      <ReviewSection />

    </main>
  );
}
