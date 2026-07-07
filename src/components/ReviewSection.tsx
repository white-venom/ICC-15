'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { TRANSLATIONS } from '@/utils/translations';

export default function ReviewSection() {
  const { country } = useAppContext();
  const isArabic = country === 'DUBAI';
  const t = isArabic ? TRANSLATIONS.ar : TRANSLATIONS.en;

  const REVIEWS = [
    {
      id: 1,
      name: isArabic ? 'جوليان فانس' : 'Julian Vance',
      title: isArabic ? 'مدير إبداعي، باريس' : 'Creative Director, Paris',
      avatar: 'JV',
      shirt: isArabic ? 'العاجية العاجية' : 'Ivory Signature',
      text: t.reviewsText1,
      accentColor: '#d4af37',
    },
    {
      id: 2,
      name: isArabic ? 'آرثر كينسلي' : 'Arthur Kensley',
      title: isArabic ? 'الرئيس التنفيذي، لندن' : 'CEO, London',
      avatar: 'AK',
      shirt: isArabic ? 'بيان أونيكس' : 'Onyx Statement',
      text: t.reviewsText2,
      accentColor: '#a0a0a0',
    },
    {
      id: 3,
      name: isArabic ? 'ماركوس لهوست' : 'Marcus Lhoste',
      title: isArabic ? 'مستشار أزياء، ميلان' : 'Fashion Consultant, Milan',
      avatar: 'ML',
      shirt: isArabic ? 'المراسم الملكية' : 'Royal Ceremony',
      text: t.reviewsText3,
      accentColor: '#4a7fc1',
    },
  ];

  const STATS = [
    { value: '4.9★', label: t.reviewsRatingLabel },
    { value: '300+', label: t.reviewsActiveLabel },
    { value: '100%', label: t.reviewsGlobalLabel },
  ];

  return (
    <div className="bg-[#050505] border-t border-white/5" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Testimonials & Stats Section: Strictly constrained to exactly one viewport screen height */}
      <section id="reviews" className="relative min-h-screen w-full flex flex-col justify-center py-12 px-6 md:px-16 overflow-hidden">
        {/* Soft Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] blur-[120px] bg-gold/5 pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col justify-between h-full">
          
          {/* Section Header */}
          <div className="text-center mb-8">
            <p className="text-[9px] uppercase tracking-[0.4em] text-gold font-sans mb-2">{t.reviewsEyebrow}</p>
            <h2 className="font-serif text-3xl md:text-4xl font-light uppercase tracking-tight text-ivory">
              {t.reviewsTitle}
            </h2>
          </div>

          {/* STATS BAR */}
          <div className="max-w-2xl mx-auto w-full mb-12">
            <div className={`flex items-center justify-between border border-gold/20 bg-gold/[0.02] backdrop-blur-md rounded-full px-8 py-3.5 text-center shadow-lg shadow-black/50 ${isArabic ? 'flex-row-reverse' : ''}`}>
              {STATS.map((stat, idx) => (
                <React.Fragment key={stat.label}>
                  {idx > 0 && <div className="w-px h-4 bg-gold/20" />}
                  <div className={`flex items-center gap-2.5 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <span className="font-serif text-base md:text-lg font-light text-gold leading-none">{stat.value}</span>
                    <span className="text-[8.5px] md:text-[9.5px] uppercase tracking-[0.15em] text-ivory/60 font-sans">{stat.label}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Side-by-Side Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch w-full">
            {REVIEWS.map((review, idx) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="relative p-6 rounded-xl border border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.02] transition-all duration-300 flex flex-col justify-between h-[30vh] min-h-[200px] max-h-[270px] shadow-md shadow-black"
              >
                {/* Quote Icon overlay */}
                <Quote size={20} className={`absolute top-4 ${isArabic ? 'left-4' : 'right-4'} opacity-5`} style={{ color: review.accentColor }} />

                <div className={isArabic ? 'text-right' : 'text-left'}>
                  {/* Stars Row */}
                  <div className={`flex gap-0.5 mb-3.5 ${isArabic ? 'justify-start' : ''}`}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} className="fill-gold text-gold" />
                    ))}
                  </div>

                  {/* Testimonial Excerpt */}
                  <p className="font-serif text-sm md:text-base font-light text-ivory/80 leading-relaxed italic line-clamp-4">
                    {review.text}
                  </p>
                </div>

                {/* Author Info */}
                <div className={`flex items-center gap-3 border-t border-white/5 pt-3.5 mt-auto ${isArabic ? 'flex-row-reverse text-right' : ''}`}>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-sans font-bold text-black shrink-0"
                    style={{ backgroundColor: review.accentColor }}
                  >
                    {review.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs md:text-sm font-sans font-medium text-ivory leading-none">{review.name}</h4>
                    <span className="text-[9px] md:text-[10px] uppercase tracking-[0.1em] text-ivory/40 font-sans block mt-1">
                      {review.title}
                    </span>
                  </div>
                  <span className={`${isArabic ? 'mr-auto' : 'ml-auto'} text-[8.5px] uppercase tracking-wider text-gold/60 font-sans`}>
                    {review.shirt.split(' ')[0]}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
