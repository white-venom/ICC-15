'use client';

import React from 'react';
import { Star, Quote, Sparkles } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { motion } from 'framer-motion';

const REVIEWS = [
  {
    id: 1,
    name: 'Julian Vance',
    title: 'Creative Director, Paris',
    avatar: 'JV',
    shirt: 'Ivory Signature',
    text: 'The collar holds its structure perfectly under a tux. The fabric is cool, breathable, and refined. Truly unmatched quality.',
    accentColor: '#d4af37',
  },
  {
    id: 2,
    name: 'Arthur Kensley',
    title: 'CEO, London',
    avatar: 'AK',
    shirt: 'Onyx Statement',
    text: 'An executive statement. The jet black color has a deep, matte quality I have never found elsewhere. Perfect fit.',
    accentColor: '#a0a0a0',
  },
  {
    id: 3,
    name: 'Marcus Lhoste',
    title: 'Fashion Consultant, Milan',
    avatar: 'ML',
    shirt: 'Royal Ceremony',
    text: 'The fabric catches the light as you move. I wore it to the gala and received endless compliments. Stunning craft.',
    accentColor: '#4a7fc1',
  },
];

export default function ReviewSection() {
  const { setBookingOpen } = useAppContext();

  return (
    <div className="bg-[#050505] border-t border-white/5">
      {/* Testimonials & Stats Section: Strictly constrained to exactly one viewport screen height */}
      <section id="reviews" className="relative min-h-screen w-full flex flex-col justify-center py-12 px-6 md:px-16 overflow-hidden">
        {/* Soft Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] blur-[120px] bg-gold/5 pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col justify-between h-full">
          
          {/* Section Header */}
          <div className="text-center mb-8">
            <p className="text-[9px] uppercase tracking-[0.4em] text-gold font-sans mb-2">Club Legacy</p>
            <h2 className="font-serif text-3xl md:text-4xl font-light uppercase tracking-tight text-ivory">
              Member Journals
            </h2>
          </div>

          {/* STATS BAR: Unique Pill Badge Design, Centered and scaled up */}
          <div className="max-w-2xl mx-auto w-full mb-12">
            <div className="flex items-center justify-between border border-gold/20 bg-gold/[0.02] backdrop-blur-md rounded-full px-8 py-3.5 text-center shadow-lg shadow-black/50">
              {[
                { value: '4.9★', label: 'Average Rating' },
                { value: '300+', label: 'Happy Clients' },
                { value: '100%', label: 'Made to Order' },
              ].map((stat, idx) => (
                <React.Fragment key={stat.label}>
                  {idx > 0 && <div className="w-px h-4 bg-gold/20" />}
                  <div className="flex items-center gap-2.5">
                    <span className="font-serif text-base md:text-lg font-light text-gold leading-none">{stat.value}</span>
                    <span className="text-[8.5px] md:text-[9.5px] uppercase tracking-[0.15em] text-ivory/60 font-sans">{stat.label}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Side-by-Side Reviews Grid: Optimized heights for single-screen alignment */}
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
                <Quote size={20} className="absolute top-4 right-4 opacity-5" style={{ color: review.accentColor }} />

                <div>
                  {/* Stars Row */}
                  <div className="flex gap-0.5 mb-3.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} className="fill-gold text-gold" />
                    ))}
                  </div>

                  {/* Testimonial Excerpt (Slightly larger text) */}
                  <p className="font-serif text-sm md:text-base font-light text-ivory/80 leading-relaxed italic line-clamp-4">
                    {review.text}
                  </p>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3 border-t border-white/5 pt-3.5 mt-auto">
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
                  <span className="ml-auto text-[8.5px] uppercase tracking-wider text-gold/60 font-sans">
                    {review.shirt.split(' ')[0]}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Elegant Atelier Invitation Section (Slightly scaled up content) */}
      <section className="relative py-24 px-6 md:px-16 bg-[#040404] border-t border-white/5 overflow-hidden">
        <div className="max-w-3xl mx-auto text-center relative z-10 flex flex-col items-center">
          <Sparkles size={18} className="text-gold/80 mb-4 animate-pulse-slow" />
          <p className="text-[10px] uppercase tracking-[0.35em] text-gold font-sans mb-3.5">Private Appointment</p>
          <h2 className="font-serif text-3xl md:text-4xl font-light uppercase tracking-wide text-ivory mb-5 leading-tight">
            Atelier Consultation
          </h2>
          <p className="text-xs md:text-sm font-light text-ivory/50 max-w-xl leading-relaxed mb-8">
            Consult with our specialists. Elevate your wardrobe with bespoke sizing, custom thread weaves, and personal fittings.
          </p>
          <button
            onClick={() => setBookingOpen(true)}
            className="px-10 py-3.5 bg-white/5 border border-white/10 text-[11px] uppercase tracking-[0.25em] font-sans font-bold rounded-full hover:border-gold hover:text-gold transition-all duration-300 cursor-pointer shadow-lg hover:shadow-gold/5"
            data-cursor="button"
          >
            Request invitation
          </button>
        </div>
      </section>
    </div>
  );
}
