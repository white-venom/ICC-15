'use client';

import React, { useState } from 'react';
import { Mail, ArrowRight, ExternalLink } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="relative bg-matte-black text-ivory/80 pt-24 pb-12 px-6 md:px-12 border-t border-white/5 overflow-hidden z-10">
      {/* Background soft ambient light */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
        {/* Editorial Brand Section */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <h2 className="font-serif text-2xl lg:text-3xl tracking-[0.25em] text-ivory font-light uppercase">
            INK &amp; COTTON CLUB
          </h2>
          <p className="font-serif text-sm lg:text-base font-light italic leading-relaxed text-ivory/60 max-w-sm">
            &ldquo;Confidence is not loud. Elegance is not self-asserting. It is the silent presence defined by every thread.&rdquo;
          </p>
          <div className="flex gap-4 mt-2">
            <a
              href="#"
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-gold hover:text-gold transition-colors duration-300"
              aria-label="Instagram"
              data-cursor="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
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
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-gold hover:text-gold transition-colors duration-300"
              aria-label="Contact"
              data-cursor="button"
            >
              <Mail size={16} />
            </a>
          </div>
        </div>

        {/* Brand Navigation */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[11px] uppercase tracking-[0.2em] font-sans font-semibold text-gold">
            The Journal
          </h3>
          <ul className="flex flex-col gap-3 text-sm font-light">
            {['The Cotton Fibers', 'Stitching Craft', 'Modern Gentleman', 'Private Styling'].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="hover:text-gold hover:translate-x-1 inline-block transition-all duration-300 text-ivory/70 hover:text-ivory"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter Editorial */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[11px] uppercase tracking-[0.2em] font-sans font-semibold text-gold">
            Newsletter
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
