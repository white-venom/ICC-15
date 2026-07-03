'use client';

import React from 'react';
import { useAppContext } from '@/context/AppContext';
import JournalBackground from '@/components/JournalBackground';

export default function JournalPage() {
  const { setBookingOpen } = useAppContext();

  return (
    <div className="relative min-h-screen bg-[#050505] text-ivory">
      {/* Fluid organic ink bleeding backdrop */}
      <JournalBackground />

      {/* Main Content */}
      <div className="relative z-10 pt-24 min-h-screen">
        <section
          id="about"
          className="min-h-[calc(100vh-6rem)] w-full flex flex-col items-center justify-center text-center px-6 md:px-24 bg-transparent relative border-b border-white/5 py-32"
        >
          <div className="max-w-4xl flex flex-col gap-6">
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold mb-2 block">
              Our Creed
            </span>
            <h2 className="font-serif text-4xl md:text-7xl tracking-wide text-ivory uppercase leading-tight font-light">
              Crafted For Gentlemen.<br />
              <span className="text-stroke-gold italic font-normal">Designed For Leaders.</span><br />
              Made To Last.
            </h2>
            <p className="text-xs uppercase tracking-[0.25em] text-ivory/45 mt-8 max-w-sm mx-auto leading-relaxed">
              A union of high art, precision engineering, and sartorial legacy. We do not sell shirts, we sell presence.
            </p>
            <div className="mt-8">
              <button
                onClick={() => setBookingOpen(true)}
                className="px-8 py-4 bg-white/5 border border-white/10 rounded-full text-xs uppercase tracking-widest hover:border-gold hover:text-gold transition-colors duration-300 cursor-pointer backdrop-blur-sm"
                data-cursor="button"
              >
                Book Private Styling Session
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
