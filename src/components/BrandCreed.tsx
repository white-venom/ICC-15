'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { TRANSLATIONS } from '@/utils/translations';

export default function BrandCreed() {
  const { country } = useAppContext();
  const isArabic = country === 'DUBAI';
  const t = isArabic ? TRANSLATIONS.ar : TRANSLATIONS.en;

  return (
    <section dir={isArabic ? 'rtl' : 'ltr'} className="relative py-24 px-6 md:px-16 bg-[#030303] border-t border-b border-white/5 overflow-hidden z-10 font-sans">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[350px] h-[350px] blur-[150px] bg-gold/5 rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        
        {/* Left Column: Narrative (7 cols on large screens) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-gold" />
            <span className="text-[10px] uppercase tracking-[0.45em] text-gold font-semibold">
              {t.creedEyebrow}
            </span>
          </div>

          <h2 className="font-serif text-3xl md:text-5xl font-light uppercase tracking-wide text-white leading-tight">
            {t.creedTitleLine1}<br />
            <span className="text-gold/80 italic font-normal">{t.creedTitleLine2}</span>
          </h2>

          <div className="h-px bg-white/10 w-24 my-1" />

          <p className="font-serif text-lg md:text-xl font-light italic leading-relaxed text-ivory/80">
            {t.creedNarrative1}
          </p>

          <p className="text-xs md:text-sm font-light text-ivory/55 leading-relaxed max-w-xl">
            {t.creedNarrative2}
          </p>

          <div className="grid grid-cols-2 gap-6 mt-4">
            <div className={`flex flex-col gap-1 border-gold/30 ${isArabic ? 'border-r pr-4' : 'border-l pl-4'}`}>
              <span className="font-serif text-2xl font-light text-gold">{t.creedItem1Num}</span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-white/40">{t.creedItem1Title}</span>
              <span className="text-xs font-light text-ivory/60 mt-1">{t.creedItem1Desc}</span>
            </div>
            <div className={`flex flex-col gap-1 border-gold/30 ${isArabic ? 'border-r pr-4' : 'border-l pl-4'}`}>
              <span className="font-serif text-2xl font-light text-gold">{t.creedItem2Num}</span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-white/40">{t.creedItem2Title}</span>
              <span className="text-xs font-light text-ivory/60 mt-1">{t.creedItem2Desc}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Showcase (5 cols on large screens) */}
        <div className="lg:col-span-5 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-matte-black border border-white/10 group shadow-2xl"
          >
            <img
              src="/assets/creed_heritage.png"
              alt="Ink & Cotton Club heritage textiles"
              className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
            />
            {/* Ambient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-75" />

            {/* Inset golden border accent */}
            <div className="absolute inset-4 border border-gold/20 group-hover:border-gold/45 rounded-2xl pointer-events-none transition-all duration-500" />
            
            <div className={`absolute bottom-8 left-8 right-8 ${isArabic ? 'text-right' : 'text-left'}`}>
              <span className="text-[8px] uppercase tracking-[0.35em] text-gold font-sans block mb-1">
                {isArabic ? 'داخل الأتيليه' : 'In The Atelier'}
              </span>
              <h3 className="font-serif text-xl font-light uppercase text-white tracking-wide">
                {isArabic ? 'أنوال إيطالية' : 'Italian Looms'}
              </h3>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
