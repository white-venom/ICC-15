'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

interface StoryChaptersProps {
  onSectionChange: (section: string) => void;
  onFocusAreaChange: (area: 'all' | 'collar' | 'sleeve' | 'button') => void;
}

const CRAFT_STEPS = [
  {
    id: 'collar' as const,
    label: 'The Collar Roll',
    metric: '45°',
    unit: 'Fold Angle',
    desc: 'Structured interlinings inside the collar ensure it maintains a rigid roll under any formal wear. Engineered to hold form for 200+ wears without losing shape.',
    detail: 'Semi-spread collar  ·  Fused interlining  ·  Hand-stitched roll line',
  },
  {
    id: 'sleeve' as const,
    label: 'The Sleeve Stitch',
    metric: '120×',
    unit: 'Stitches / Inch',
    desc: 'Dual side-seam stitching locks the sleeve cuff without restricting wrist motion. Each seam runs parallel to 0.1mm tolerance for perfect symmetry.',
    detail: 'Double needle seam  ·  Mitered cuff  ·  French placket',
  },
  {
    id: 'button' as const,
    label: 'Signature Buttons',
    metric: '4-Hole',
    unit: 'Cross-lock Stitch',
    desc: 'Champagne shell buttons anchored with a cross-stitch thread neck for maximum pull strength. Each button survives 2,000+ duty cycles tested to industry-leading standards.',
    detail: 'Corozo shell  ·  Cross-stitched  ·  Gold thread neck',
  },
];



export default function StoryChapters({ onSectionChange, onFocusAreaChange }: StoryChaptersProps) {
  const [craftStep, setCraftStep] = useState<'collar' | 'sleeve' | 'button'>('collar');

  const c1Ref = useRef(null);
  const c2Ref = useRef(null);
  const c3Ref = useRef(null);
  const c4Ref = useRef(null);

  const c1InView = useInView(c1Ref, { amount: 0.4 });
  const c2InView = useInView(c2Ref, { amount: 0.4 });
  const c3InView = useInView(c3Ref, { amount: 0.4 });
  const c4InView = useInView(c4Ref, { amount: 0.4 });

  useEffect(() => {
    if (c1InView) onSectionChange('cotton');
    else if (c2InView) onSectionChange('thread');
    else if (c3InView) onSectionChange('fabric');
    else if (c4InView) {
      onSectionChange('craftsmanship');
      onFocusAreaChange(craftStep);
    }
  }, [c1InView, c2InView, c3InView, c4InView, craftStep, onSectionChange, onFocusAreaChange]);

  const handleCraftStep = (step: 'collar' | 'sleeve' | 'button') => {
    setCraftStep(step);
    onFocusAreaChange(step);
  };

  const activeCraft = CRAFT_STEPS.find((s) => s.id === craftStep) ?? CRAFT_STEPS[0];

  return (
    <div className="relative z-10 w-full">

      {/* ── CHAPTER I: The Cotton ─────────────────────────── */}
      <section
        id="craftsmanship"
        ref={c1Ref}
        className="py-4 md:py-8 min-h-[45vh] w-full relative flex items-center overflow-hidden"
      >
        <span className="absolute right-10 top-1/2 -translate-y-1/2 font-serif text-[28vw] leading-none font-bold text-white/[0.015] select-none pointer-events-none">I</span>
        <div className="relative z-10 w-full px-6 py-3 flex flex-col items-center text-center gap-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-px bg-gold" />
              <span className="text-[9px] uppercase tracking-[0.45em] text-gold font-sans">Chapter I</span>
              <div className="w-6 h-px bg-gold" />
            </div>
            <h2 className="font-serif text-5xl md:text-7xl leading-none uppercase font-light text-white tracking-wide">
              The Cotton
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex flex-col items-center gap-6 max-w-2xl"
          >
            <p className="font-serif text-xl md:text-2xl italic text-gold font-light leading-snug">Hand-harvested in the fertile valleys of Egypt.</p>
            <p className="text-sm md:text-base font-light text-ivory/70 leading-relaxed font-sans max-w-xl">
              Every fiber begins its journey in the rich soil of Giza. We harvest exclusively long-staple organic cotton under golden sunlight — extraordinarily strong, yet unbelievably soft. A pure, pristine canvas upon which luxury is built.
            </p>
            <div className="flex flex-row flex-wrap justify-center items-center gap-10 md:gap-16 pt-6 border-t border-white/10 w-full">
              {[['Long-staple', 'Giza Cotton'], ['100%', 'Organic'], ['200s', 'Thread Count']].map(([val, label]) => (
                <div key={label} className="flex flex-col gap-1 items-center">
                  <span className="text-gold font-serif text-xl md:text-2xl font-light">{val}</span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-ivory/40 font-sans">{label}</span>
                </div>
              ))}
            </div>
            {/* Centered vertical stitch line */}
            <div className="flex flex-col items-center pt-6 w-full justify-center">
              <div className="w-[1.5px] h-28 bg-gradient-to-b from-gold/50 via-gold/10 to-transparent relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_6px_#d4af37] animate-scroll-stitch" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CHAPTER II: The Thread ───────────────────────── */}
      <section
        ref={c2Ref}
        className="py-4 md:py-8 min-h-[45vh] w-full relative flex items-center overflow-hidden"
      >
        <span className="absolute left-10 top-1/2 -translate-y-1/2 font-serif text-[28vw] leading-none font-bold text-white/[0.015] select-none pointer-events-none">II</span>
        <div className="relative z-10 w-full px-6 py-3 flex flex-col items-center text-center gap-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-px bg-gold" />
              <span className="text-[9px] uppercase tracking-[0.45em] text-gold font-sans">Chapter II</span>
              <div className="w-6 h-px bg-gold" />
            </div>
            <h2 className="font-serif text-5xl md:text-7xl leading-none uppercase font-light text-white tracking-wide">
              The Thread
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex flex-col items-center gap-6 max-w-2xl"
          >
            <p className="font-serif text-xl md:text-2xl italic text-gold font-light leading-snug">Spun with absolute geometrical precision.</p>
            <p className="text-sm md:text-base font-light text-ivory/70 leading-relaxed font-sans max-w-xl">
              Cotton strands are spun into double-ply threads, twisted exactly 120 times per inch. This high twist ratio shields the fabric from creasing while generating a natural, pearlescent reflection. Strength meets refinement in every strand.
            </p>
            <div className="flex flex-row flex-wrap justify-center items-center gap-10 md:gap-16 pt-6 border-t border-white/10 w-full">
              {[['120×', 'Twist / Inch'], ['2-Ply', 'Double Strand'], ['Pearlescent', 'Reflection']].map(([val, label]) => (
                <div key={label} className="flex flex-col gap-1 items-center">
                  <span className="text-gold font-serif text-xl md:text-2xl font-light">{val}</span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-ivory/40 font-sans">{label}</span>
                </div>
              ))}
            </div>
            {/* Centered vertical stitch line */}
            <div className="flex flex-col items-center pt-6 w-full justify-center">
              <div className="w-[1.5px] h-28 bg-gradient-to-b from-gold/50 via-gold/10 to-transparent relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_6px_#d4af37] animate-scroll-stitch" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CHAPTER III: The Fabric ──────────────────────── */}
      <section
        ref={c3Ref}
        className="py-4 md:py-8 min-h-[45vh] w-full relative flex items-center overflow-hidden"
      >
        <span className="absolute left-10 top-1/2 -translate-y-1/2 font-serif text-[28vw] leading-none font-bold text-white/[0.015] select-none pointer-events-none">III</span>
        <div className="relative z-10 w-full px-6 py-3 flex flex-col items-center text-center gap-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-px bg-gold" />
              <span className="text-[9px] uppercase tracking-[0.45em] text-gold font-sans">Chapter III</span>
              <div className="w-6 h-px bg-gold" />
            </div>
            <h2 className="font-serif text-5xl md:text-7xl leading-none uppercase font-light text-white tracking-wide">
              The Fabric
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex flex-col items-center gap-6 max-w-2xl"
          >
            <p className="font-serif text-xl md:text-2xl italic text-gold font-light leading-snug">Woven on ancestral Italian looms.</p>
            <p className="text-sm md:text-base font-light text-ivory/70 leading-relaxed font-sans max-w-xl">
              Woven in historic, family-owned looms in Milan, Italy. Boasting a thread count exceeding 200 threads per square inch, the finished weave breathes effortlessly like a second skin while holding sharp, majestic structure.
            </p>
            <div className="flex flex-row flex-wrap justify-center items-center gap-10 md:gap-16 pt-6 border-t border-white/10 w-full">
              {[['200+', 'Threads / in²'], ['Milan', 'Italian Loom'], ['Breathable', 'Structure']].map(([val, label]) => (
                <div key={label} className="flex flex-col gap-1 items-center">
                  <span className="text-gold font-serif text-xl md:text-2xl font-light">{val}</span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-ivory/40 font-sans">{label}</span>
                </div>
              ))}
            </div>
            {/* Centered vertical stitch line */}
            <div className="flex flex-col items-center pt-6 w-full justify-center">
              <div className="w-[1.5px] h-28 bg-gradient-to-b from-gold/50 via-gold/10 to-transparent relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_6px_#d4af37] animate-scroll-stitch" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CHAPTER IV: CRAFTSMANSHIP — Precision Layout ─── */}
      <section
        ref={c4Ref}
        className="py-8 md:py-12 min-h-[50vh] w-full relative flex items-center overflow-hidden"
      >
        {/* Subtle measurement grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(212,175,55,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.06) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Vignette over grid so it fades at edges */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,5,5,0.65)_85%)]" />

        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[35vw] leading-none font-bold text-white/[0.022] select-none pointer-events-none">IV</span>

        <div className="relative z-10 w-full px-10 md:px-24 py-12 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-14 flex flex-col items-center text-center"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-px bg-gold" />
              <span className="text-[9px] uppercase tracking-[0.45em] text-gold font-sans">Chapter IV</span>
              <div className="w-6 h-px bg-gold" />
            </div>
            <h2 className="font-serif text-5xl md:text-7xl leading-none uppercase font-light text-white mb-3 tracking-wide">
              Craftsmanship
            </h2>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50 max-w-sm">
              Select a detail to reveal precision engineering data
            </p>
          </motion.div>

          {/* Interactive panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

            {/* LEFT: Animated metric */}
            <div className="flex flex-col gap-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCraft.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col gap-3"
                >
                  {/* Giant metric - solid gold so it's always visible */}
                  <div
                    className="font-serif text-gold leading-none font-light"
                    style={{
                      fontSize: 'clamp(4rem, 13vw, 9rem)',
                      letterSpacing: '-0.04em',
                    }}
                  >
                    {activeCraft.metric}
                  </div>
                  <span className="text-[11px] uppercase tracking-[0.4em] text-white/50 font-sans">
                    {activeCraft.unit}
                  </span>
                </motion.div>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCraft.id + '_content'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="flex flex-col gap-5 max-w-md"
                >
                  <p className="text-sm font-light text-white leading-relaxed">
                    {activeCraft.desc}
                  </p>
                  <div className="flex flex-col gap-2 pt-4 border-t border-white/20">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-gold font-sans">Technical Detail</span>
                    <span className="text-[11px] text-white/80 font-sans leading-relaxed">
                      {activeCraft.detail}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* RIGHT: Vertical step selector */}
            <div className="flex flex-col gap-4">
              {CRAFT_STEPS.map((step, i) => {
                const isActive = craftStep === step.id;
                return (
                  <motion.button
                    key={step.id}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    onClick={() => handleCraftStep(step.id)}
                    className={`group w-full text-left transition-all duration-400 pointer-events-auto relative overflow-hidden border ${isActive
                      ? 'border-gold/60 bg-gold/8'
                      : 'border-white/10 hover:border-white/25 bg-white/[0.02] hover:bg-white/[0.04]'
                      }`}
                    style={{ borderRadius: '3px' }}
                    data-cursor="button"
                  >
                    {/* Active left bar */}
                    <div className={`absolute left-0 top-0 bottom-0 w-[4px] bg-gold transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`} />

                    <div className="pl-9 pr-8 py-7 flex items-center justify-between gap-4">
                      <div className="flex flex-col gap-2">
                        <span className={`text-[10px] uppercase tracking-[0.4em] font-sans transition-colors duration-300 ${isActive ? 'text-gold' : 'text-white/30'}`}>
                          0{i + 1}
                        </span>
                        <span className={`text-[15px] uppercase tracking-[0.2em] font-sans font-medium transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/55 group-hover:text-white/75'}`}>
                          {step.label}
                        </span>
                      </div>
                      <span className={`font-serif text-3xl font-light transition-colors duration-300 ${isActive ? 'text-gold' : 'text-white/20 group-hover:text-white/35'}`}>
                        {step.metric}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

      </section>

    </div>
  );
}
