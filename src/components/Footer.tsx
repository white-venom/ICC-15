'use client';

import React, { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="relative bg-matte-black text-ivory/80 pt-24 pb-12 px-6 md:px-12 border-t border-white/15 overflow-hidden z-10">
      {/* Background soft ambient light */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
        {/* Editorial Brand Section */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 overflow-hidden drop-shadow-[0_0_6px_rgba(212,175,55,0.4)]">
              {!logoError ? (
                <Image 
                  src="/assets/logo/logobg.png" 
                  alt="Ink & Cotton Club Logo" 
                  fill 
                  className="object-contain filter sepia saturate-[2] hue-rotate-[5deg]" 
                  onError={() => setLogoError(true)} 
                  unoptimized 
                />
              ) : (
                <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-gold">
                  <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
                  <path d="M42 35C42 35 34 39 34 50C34 61 42 65 42 65M58 35C58 35 50 39 50 50C50 61 58 65 58 65M50 30L50 70" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
            </div>
            <div className="flex flex-col items-start leading-none gap-1">
              <span className="font-serif tracking-[0.2em] text-sm md:text-base uppercase text-white font-medium">INK &amp; COTTON CLUB</span>
              <span className="font-sans tracking-[0.32em] text-[9px] font-bold uppercase text-gold mt-0.5">TAILORED ESSENTIALS</span>
            </div>
          </div>
          
          <p className="font-serif text-xs font-light italic leading-relaxed text-ivory/60 max-w-sm">
            &ldquo;Confidence is not loud. Elegance is not self-asserting. It is the silent presence defined by every thread.&rdquo;
          </p>
          <div className="flex gap-4 mt-2">
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
            Explore
          </h3>
          <ul className="flex flex-col gap-3 text-xs font-light">
            <li>
              <Link href="/craftsmanship" className="hover:text-gold hover:translate-x-1 inline-block transition-all duration-300 text-ivory/70 hover:text-ivory">
                The Craftsmanship
              </Link>
            </li>
            <li>
              <Link href="/collection" className="hover:text-gold hover:translate-x-1 inline-block transition-all duration-300 text-ivory/70 hover:text-ivory">
                Signature Collection
              </Link>
            </li>
            <li>
              <Link href="/journal" className="hover:text-gold hover:translate-x-1 inline-block transition-all duration-300 text-ivory/70 hover:text-ivory">
                The Journal
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Details & Atelier Address */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[11px] uppercase tracking-[0.2em] font-sans font-semibold text-gold">
            Contact
          </h3>
          <p className="text-xs font-light text-ivory/60 leading-relaxed">
            Atelier 109, Rue Saint-Honoré<br />
            75001 Paris, France
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
            Subscribe
          </h3>
          <p className="text-xs font-light text-ivory/50 leading-relaxed">
            Subscribe to receive private styling guides and exclusive release announcements.
          </p>
          {!subscribed ? (
            <form onSubmit={handleSubmit} className="relative mt-2 border-b border-white/10 focus-within:border-gold transition-colors duration-300">
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent py-2 pr-10 text-sm font-light focus:outline-none placeholder-white/30 text-ivory"
              />
              <button
                type="submit"
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-white/50 hover:text-gold hover:translate-x-1 transition-all duration-300"
                aria-label="Submit newsletter form"
                data-cursor="button"
              >
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            <p className="text-xs text-gold italic mt-2 animate-pulse-slow">
              Thank you. You are added to the list.
            </p>
          )}
        </div>
      </div>

      {/* Footer Bottom Rights */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] uppercase tracking-[0.15em] text-ivory/40">
        <div>
          &copy; {new Date().getFullYear()} Ink &amp; Cotton Club. All Rights Reserved.
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-gold transition-colors duration-300">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-gold transition-colors duration-300">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
