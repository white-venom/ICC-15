'use client';

import React, { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import { TRANSLATIONS } from '@/utils/translations';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const { country } = useAppContext();
  const pathname = usePathname();
  const isArabic = country === 'DUBAI';
  const t = isArabic ? TRANSLATIONS.ar : TRANSLATIONS.en;

  if (pathname === '/checkout' || pathname === '/order-status') {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer dir={isArabic ? 'rtl' : 'ltr'} className="relative bg-matte-black text-ivory/80 pt-12 pb-8 px-6 md:px-12 border-t border-white/15 overflow-hidden z-10">
      {/* Background soft ambient light */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-8 items-start">
        {/* Editorial Brand Section */}
        <div className="flex flex-col gap-6">
          <div className="relative w-40 h-40 mx-auto -mt-10 overflow-hidden drop-shadow-[0_0_6px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform duration-500">
            <Image 
              src="/assets/logo/logo.png" 
              alt="Ink & Cotton Club Logo" 
              fill 
              className="object-contain brightness-0 invert" 
              unoptimized 
            />
          </div>
          <p className="-mt-8 font-serif text-base font-light italic leading-relaxed text-ivory/60 max-w-sm text-center">
            {t.footerQuote}
          </p>
          <div className="flex gap-4 mt-2 justify-center">
            <a
              href="#"
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-gold hover:text-gold transition-colors duration-300"
              aria-label="Instagram"
              data-cursor="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            <a
              href="#"
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-gold hover:text-gold transition-colors duration-300"
              aria-label="Contact"
              data-cursor="button"
            >
              <Mail size={14} />
            </a>
          </div>
        </div>

        {/* Brand Navigation */}
        <div className="flex flex-col gap-4 md:pl-4">
          <h3 className="text-[11px] uppercase tracking-[0.2em] font-sans font-semibold text-gold">
            {t.footerExplore}
          </h3>
          <ul className="flex flex-col items-start gap-0">
            <li>
              <Link href="/" className="relative group overflow-hidden inline-block" data-cursor="button">
                <span className="relative z-10 text-[10px] uppercase tracking-widest text-ivory/70 group-hover:text-white transition-colors duration-300 font-sans">{t.navHome}</span>
                <span className="absolute bottom-0 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300 ease-out" />
              </Link>
            </li>
            <li>
              <Link href="/collection" className="relative group overflow-hidden inline-block" data-cursor="button">
                <span className="relative z-10 text-[10px] uppercase tracking-widest text-ivory/70 group-hover:text-white transition-colors duration-300 font-sans">{t.navCollection}</span>
                <span className="absolute bottom-0 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300 ease-out" />
              </Link>
            </li>
            <li>
              <Link href="/craftsmanship" className="relative group overflow-hidden inline-block" data-cursor="button">
                <span className="relative z-10 text-[10px] uppercase tracking-widest text-ivory/70 group-hover:text-white transition-colors duration-300 font-sans">{t.navCraftsmanship}</span>
                <span className="absolute bottom-0 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300 ease-out" />
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Details & Atelier Address */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[11px] uppercase tracking-[0.2em] font-sans font-semibold text-gold">
            {t.footerContact}
          </h3>
          <p className="text-xs font-light text-ivory/60 leading-relaxed whitespace-pre-line">
            {t.footerAddress}
          </p>
          <div className="h-px bg-white/5 my-1" />
          <p className="text-[11px] font-light text-ivory/50 leading-relaxed">
            Phone: <a href="tel:+33140205050" className="hover:text-gold transition-colors font-medium text-ivory/75">+33 (0) 1 40 20 50 50</a><br />
            Email: <a href="mailto:atelier@inkandcotton.club" className="hover:text-gold transition-colors font-medium text-ivory/75">atelier@inkandcotton.club</a>
          </p>
        </div>

        {/* Newsletter Editorial */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[11px] uppercase tracking-[0.2em] font-sans font-semibold text-gold">
            {t.footerSubscribe}
          </h3>
          <p className="text-xs font-light text-ivory/50 leading-relaxed">
            {t.footerSubscribeDesc}
          </p>
          {!subscribed ? (
            <form onSubmit={handleSubmit} className="relative mt-2 border-b border-white/10 focus-within:border-gold transition-colors duration-300">
              <input
                type="email"
                placeholder={t.footerEmailPlaceholder}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent py-2 pr-10 text-sm font-light focus:outline-none placeholder-white/30 text-ivory"
              />
              <button
                type="submit"
                className={`absolute ${isArabic ? 'left-0' : 'right-0'} top-1/2 -translate-y-1/2 p-2 text-white/50 hover:text-gold transition-all duration-300 ${isArabic ? '-scale-x-100 hover:-translate-x-1' : 'hover:translate-x-1'}`}
                aria-label="Submit newsletter form"
                data-cursor="button"
              >
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            <p className="text-xs text-gold italic mt-2 animate-pulse-slow">
              {t.footerSuccessMsg}
            </p>
          )}
        </div>
      </div>

      {/* Footer Bottom Rights */}
      <div className={`max-w-7xl mx-auto pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-xs uppercase tracking-[0.15em] text-ivory/40 ${isArabic ? 'md:flex-row-reverse' : ''}`}>
        <div>
          {t.footerCopyright}
        </div>

        <div className="flex gap-6">
          <a href="#" className="hover:text-gold transition-colors duration-300">
            {t.footerPrivacy}
          </a>
          <a href="#" className="hover:text-gold transition-colors duration-300">
            {t.footerTerms}
          </a>
        </div>
      </div>
    </footer>
  );
}
