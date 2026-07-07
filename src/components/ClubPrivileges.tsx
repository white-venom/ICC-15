'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ShieldAlert, Award } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { TRANSLATIONS } from '@/utils/translations';

export default function ClubPrivileges() {
  const { country } = useAppContext();
  const isArabic = country === 'DUBAI';
  const t = isArabic ? TRANSLATIONS.ar : TRANSLATIONS.en;

  const PRIVILEGES = [
    {
      icon: FileText,
      title: t.priv1Title,
      description: t.priv1Desc,
    },
    {
      icon: ShieldAlert,
      title: t.priv2Title,
      description: t.priv2Desc,
    },
    {
      icon: Award,
      title: t.priv3Title,
      description: t.priv3Desc,
    },
  ];

  return (
    <section dir={isArabic ? 'rtl' : 'ltr'} className="relative py-24 px-6 md:px-16 bg-[#050505] overflow-hidden z-10 font-sans border-b border-white/5">
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-gold/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-[10px] uppercase tracking-[0.45em] text-gold font-semibold mb-3">
            {t.privEyebrow}
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-light uppercase tracking-wide text-white mb-4">
            {t.privTitle}
          </h2>
          <p className="text-xs md:text-sm font-light text-ivory/50 max-w-lg leading-relaxed">
            {t.privDesc}
          </p>
        </div>

        {/* Privilege Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRIVILEGES.map((priv, idx) => {
            const Icon = priv.icon;
            return (
              <motion.div
                key={priv.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className={`group relative p-8 rounded-3xl bg-white/[0.01] border border-white/5 backdrop-blur-md transition-all duration-500 hover:border-gold/20 flex flex-col gap-6 shadow-2xl hover:shadow-black ${isArabic ? 'text-right' : 'text-left'}`}
              >
                {/* Gold icon badge */}
                <div className={`w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center border border-gold/20 group-hover:border-gold/50 group-hover:bg-gold/15 transition-all duration-500 ${isArabic ? 'mr-0 ml-auto' : ''}`}>
                  <Icon size={20} className="text-gold" />
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="font-serif text-xl font-light uppercase tracking-wide text-white group-hover:text-gold transition-colors duration-300">
                    {priv.title}
                  </h3>
                  <p className="text-xs md:text-sm font-light text-ivory/55 leading-relaxed">
                    {priv.description}
                  </p>
                </div>

                {/* Bottom line decorator */}
                <div className="absolute bottom-0 left-8 right-8 h-px bg-white/5 group-hover:bg-gold/30 transition-all duration-500" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
