'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
}

const NAV_LEFT  = ['Home', 'Collection', 'Craftsmanship', 'Journal'];
const NAV_RIGHT: string[] = [];

export default function Navbar({ cartCount, onCartClick }: NavbarProps) {
  const router = useRouter();
  const [scrolled, setScrolled]         = useState(false);
  const [logoError, setLogoError]       = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [logoHovered, setLogoHovered]   = useState(false);
  const [countryOpen, setCountryOpen]   = useState(false);
  const { country, setCountry }         = useAppContext();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (path: string) => {
    setMobileOpen(false);
    if (path.toLowerCase() === 'home' || path.toLowerCase() === 'hero') {
      router.push('/');
    } else {
      router.push(`/${path.toLowerCase()}`);
    }
  };

  const linkCls =
    'relative text-xs uppercase tracking-[0.3em] font-sans text-white/60 hover:text-white transition-colors duration-300 pb-0.5 group';

  const underline = (
    <span className="absolute bottom-0 left-0 w-0 group-hover:w-full h-px bg-gold transition-all duration-300 ease-out" />
  );

  return (
    <>
      {/* ─── SINGLE NAVBAR ─────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16 pointer-events-auto transition-all duration-300 border-b ${
          scrolled 
            ? 'h-14 bg-black/70 backdrop-blur-md border-white/[0.06] shadow-lg' 
            : 'h-24 bg-transparent border-transparent'
        }`}
      >
        {/* Logo + name (slim) */}
        <div
          className="flex items-center gap-4 cursor-pointer group"
          onClick={() => go('hero')}
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
        >
          <div className="relative w-16 h-16 overflow-hidden drop-shadow-[0_0_6px_rgba(255,255,255,0.3)] transition-transform duration-300 group-hover:scale-105">
            {!logoError ? (
              <>
                <Image src="/assets/logo/logobg.png" alt="Ink & Cotton Club" fill className="object-contain brightness-0 invert" onError={() => setLogoError(true)} unoptimized />
                <AnimatePresence>
                  {logoHovered && (
                    <motion.div initial={{ left: '-100%' }} animate={{ left: '200%' }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, ease: 'easeInOut' }}
                      className="absolute top-0 bottom-0 w-4 bg-gradient-to-r from-transparent via-white/80 to-transparent -skew-x-12 pointer-events-none z-20" />
                  )}
                </AnimatePresence>
              </>
            ) : (
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-white relative z-10">
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
                <path d="M42 35C42 35 34 39 34 50C34 61 42 65 42 65M58 35C58 35 50 39 50 50C50 61 58 65 58 65M50 30L50 70" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
          </div>
          <div className="flex flex-col items-center leading-none">
            <span className="font-serif tracking-[0.2em] text-sm uppercase text-white group-hover:text-gold transition-colors duration-300">INK &amp; COTTON CLUB</span>
            <span className="font-sans tracking-[0.3em] text-[8px] font-bold uppercase text-gold/70 mt-1">TAILORED ESSENTIALS</span>
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
        <div className="flex items-center gap-6">
          {/* Country Selector */}
          <div className="relative hidden sm:block">
            <button 
              onClick={() => setCountryOpen(!countryOpen)} 
              className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-white/70 hover:text-white transition-colors duration-300"
            >
              {country} <ChevronDown size={12} className={`transition-transform duration-300 ${countryOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {countryOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-0 mt-6 w-28 bg-[#080808] border border-white/10 rounded-sm flex flex-col overflow-hidden shadow-2xl"
                >
                  {['DUBAI', 'INDIA', 'UK', 'US'].map((c) => (
                    <button 
                      key={c}
                      onClick={() => { setCountry(c); setCountryOpen(false); }}
                      className={`text-[10px] uppercase tracking-widest text-left px-4 py-3 hover:bg-white/5 transition-colors duration-200 ${country === c ? 'text-gold' : 'text-white/70'}`}
                    >
                      {c}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button onClick={() => go('collection')} className="hidden sm:block px-5 py-2 text-[11px] uppercase tracking-[0.25em] border border-gold/40 text-gold hover:bg-gold hover:text-black font-semibold transition-all duration-300 rounded-sm">
            Order Now
          </button>
          <button onClick={onCartClick} className="relative text-white/70 hover:text-gold transition-colors duration-300">
            <ShoppingBag size={18} />
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
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

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
