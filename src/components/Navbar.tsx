'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
}

const NAV_LEFT  = ['Craftsmanship', 'Collection', 'Journal'];
const NAV_RIGHT: string[] = [];

export default function Navbar({ cartCount, onCartClick }: NavbarProps) {
  const [scrolled, setScrolled]         = useState(false);
  const [logoError, setLogoError]       = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [logoHovered, setLogoHovered]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const linkCls =
    'relative text-[10px] uppercase tracking-[0.3em] font-sans text-white/60 hover:text-white transition-colors duration-300 pb-0.5 group';

  const underline = (
    <span className="absolute bottom-0 left-0 w-0 group-hover:w-full h-px bg-gold transition-all duration-300 ease-out" />
  );

  return (
    <>
      {/* ─── MASTHEAD (Hero-top state) ─────────────────────── */}
      <AnimatePresence>
        {!scrolled && (
          <motion.header
            key="masthead"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16 pointer-events-auto"
            style={{ height: '88px' }}
          >
            {/* ── Left nav links ── */}
            <nav className="hidden md:flex items-center gap-10">
              {NAV_LEFT.map((item) => (
                <button key={item} onClick={() => go(item.toLowerCase())} className={linkCls} data-cursor="button">
                  {item}{underline}
                </button>
              ))}
            </nav>

            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 cursor-pointer"
              onClick={() => go('hero')}
              onMouseEnter={() => setLogoHovered(true)}
              onMouseLeave={() => setLogoHovered(false)}
              data-cursor="view"
            >
              {/* Strong Dark Silhouette Shroud to isolate from white shirt */}
              <div className="absolute w-44 h-44 bg-black/95 rounded-full blur-3xl pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[-2]" />

              {/* Golden Ambient Backlight Glow behind the logo */}
              <div className="absolute w-28 h-28 bg-gold/25 rounded-full blur-2xl pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[-1] animate-pulse" />

              {/* Logo image with glint — big, no text */}
              <div className="relative w-32 h-32 overflow-hidden drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)] transition-transform duration-500 hover:scale-105">
                {!logoError ? (
                  <>
                    <Image
                      src="/assets/logo/logo.png"
                      alt="Ink & Cotton Club"
                      fill
                      className="object-contain filter sepia saturate-[2.8] hue-rotate-[15deg] brightness-[1.3] contrast-[1.2]"
                      onError={() => setLogoError(true)}
                      unoptimized
                    />
                    {/* Continuous looping Glint sweep */}
                    <motion.div
                      initial={{ left: '-100%' }}
                      animate={{ left: '220%' }}
                      transition={{
                        duration: 1.6,
                        ease: 'easeInOut',
                        repeat: Infinity,
                        repeatDelay: 3.4, // Sweeps every 5 seconds
                      }}
                      className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12 pointer-events-none"
                    />
                  </>
                ) : (
                  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-gold animate-pulse">
                    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
                    <path d="M42 35C42 35 34 39 34 50C34 61 42 65 42 65M58 35C58 35 50 39 50 50C50 61 58 65 58 65M50 30L50 70" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
              </div>

              {/* Gold dust particles on hover */}
              <AnimatePresence>
                {logoHovered && [0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-gold pointer-events-none"
                    style={{ left: '50%', top: '30%' }}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0], x: (i - 1) * 18, y: -28 - i * 8 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* ── Right nav links + CTA ── */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_RIGHT.map((item) => (
                <button key={item} onClick={() => go(item.toLowerCase())} className={linkCls} data-cursor="button">
                  {item}{underline}
                </button>
              ))}
              <button
                onClick={() => go('collection')}
                className="px-5 py-2 text-[9px] uppercase tracking-[0.25em] border border-gold/50 text-gold hover:bg-gold hover:text-black font-semibold transition-all duration-300 rounded-sm"
                data-cursor="button"
              >
                Order Now
              </button>
              <button onClick={onCartClick} className="relative text-white/70 hover:text-gold transition-colors duration-300">
                <ShoppingBag size={16} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gold text-black text-[8px] font-bold rounded-full flex items-center justify-center">
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>

            {/* Mobile trigger */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white/70 hover:text-gold transition-colors duration-300 ml-auto">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </motion.header>
        )}
      </AnimatePresence>

      {/* ─── SLIM BAR (Scrolled state) ─────────────────────── */}
      <AnimatePresence>
        {scrolled && (
          <motion.header
            key="slimbar"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="fixed top-0 left-0 right-0 z-50 h-14 bg-black/70 backdrop-blur-md border-b border-white/[0.06] flex items-center justify-between px-8 md:px-16 pointer-events-auto shadow-lg"
          >
            {/* Logo + name (slim) */}
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => go('hero')}
              onMouseEnter={() => setLogoHovered(true)}
              onMouseLeave={() => setLogoHovered(false)}
            >
              <div className="relative w-11 h-11 overflow-hidden drop-shadow-[0_0_6px_rgba(212,175,55,0.3)] transition-transform duration-300 group-hover:scale-105">
                {!logoError ? (
                  <>
                    <Image src="/assets/logo/logobg.png" alt="Ink & Cotton Club" fill className="object-contain filter sepia saturate-[2] hue-rotate-[5deg]" onError={() => setLogoError(true)} unoptimized />
                    <AnimatePresence>
                      {logoHovered && (
                        <motion.div initial={{ left: '-100%' }} animate={{ left: '200%' }} exit={{ opacity: 0 }}
                          transition={{ duration: 0.7, ease: 'easeInOut' }}
                          className="absolute top-0 bottom-0 w-4 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 pointer-events-none" />
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-gold">
                    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
                    <path d="M42 35C42 35 34 39 34 50C34 61 42 65 42 65M58 35C58 35 50 39 50 50C50 61 58 65 58 65M50 30L50 70" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-serif tracking-[0.2em] text-[11px] uppercase text-white group-hover:text-gold transition-colors duration-300">INK &amp; COTTON CLUB</span>
                <span className="font-sans tracking-[0.3em] text-[6px] font-bold uppercase text-gold/70 mt-0.5">TAILORED ESSENTIALS</span>
              </div>
            </div>

            {/* Center nav */}
            <nav className="hidden md:flex items-center gap-10">
              {[...NAV_LEFT, ...NAV_RIGHT].map((item) => (
                <button key={item} onClick={() => go(item.toLowerCase())} className={linkCls} data-cursor="button">
                  {item}{underline}
                </button>
              ))}
            </nav>

            {/* Right CTA */}
            <div className="flex items-center gap-4">
              <button onClick={() => go('collection')} className="hidden sm:block px-4 py-1.5 text-[9px] uppercase tracking-[0.25em] border border-gold/40 text-gold hover:bg-gold hover:text-black font-semibold transition-all duration-300 rounded-sm">
                Order Now
              </button>
              <button onClick={onCartClick} className="relative text-white/70 hover:text-gold transition-colors duration-300">
                <ShoppingBag size={15} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gold text-black text-[8px] font-bold rounded-full flex items-center justify-center">
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white/70 hover:text-gold transition-colors duration-300">
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* ─── Mobile Menu Panel ─────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-4 right-4 bg-[#080808]/95 backdrop-blur-xl border border-white/10 rounded-2xl z-40 p-8 flex flex-col items-center gap-5 shadow-2xl md:hidden"
          >
            {[...NAV_LEFT, ...NAV_RIGHT].map((item) => (
              <button key={item} onClick={() => go(item.toLowerCase())}
                className="text-[11px] uppercase tracking-[0.25em] font-sans text-white/70 hover:text-gold py-2 w-full text-center border-b border-white/[0.04] transition-colors duration-300">
                {item}
              </button>
            ))}
            <button onClick={() => go('collection')}
              className="w-full py-3 text-center text-[10px] uppercase tracking-[0.25em] bg-gold text-black font-semibold rounded-sm hover:bg-white transition-colors duration-300">
              Order Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
