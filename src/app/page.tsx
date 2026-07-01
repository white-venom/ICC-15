'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Calendar, Clock, Scissors, CheckCircle, ArrowRight } from 'lucide-react';

import IntroLoader from '@/components/IntroLoader';
import Navbar from '@/components/Navbar';
import StoryChapters from '@/components/StoryChapters';
import SignatureCollection from '@/components/SignatureCollection';
import Cart from '@/components/Cart';
import Footer from '@/components/Footer';

interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  colorName: string;
  quantity: number;
  image: string;
}

export default function Home() {
  const [introCompleted, setIntroCompleted] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');
  const [focusArea, setFocusArea] = useState<'all' | 'collar' | 'sleeve' | 'button'>('all');
  
  // Cart state management
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [foldProgress, setFoldProgress] = useState(0);

  // Booking Styling state
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  // Prevent page scroll when the cinematic introduction is active
  useEffect(() => {
    if (!introCompleted) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [introCompleted]);

  // Handle buy fold animation and cart update
  const handleBuyShirt = (product: any, size: string) => {
    setActiveSection('buy');
    
    // 1. Trigger the 3D shirt folding animation (folds & shrinks the 3D model)
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.05;
      if (progress >= 1) {
        clearInterval(interval);
        setFoldProgress(1);

        // 2. Add item to cart and reset fold states after fold completes
        setTimeout(() => {
          const itemKey = `${product.id}-${size}`;
          setCartItems((prev) => {
            const existing = prev.find((item) => item.id === itemKey);
            if (existing) {
              return prev.map((item) =>
                item.id === itemKey ? { ...item, quantity: item.quantity + 1 } : item
              );
            }
            return [
              ...prev,
              {
                id: itemKey,
                name: product.name,
                price: product.price,
                size,
                colorName: product.colorName,
                quantity: 1,
                image: product.id,
              },
            ];
          });
          
          setFoldProgress(0);
          setActiveSection('collection-' + product.id); // restore collection color ambient
          setCartOpen(true); // open cart to show checkout update
        }, 300);
      } else {
        setFoldProgress(progress);
      }
    }, 40);
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    alert('Thank you. Connecting to our private secure check-out portal...');
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingName && bookingEmail && bookingDate) {
      setBookingSubmitted(true);
      setTimeout(() => {
        setBookingOpen(false);
        setBookingSubmitted(false);
        setBookingName('');
        setBookingEmail('');
        setBookingDate('');
      }, 3000);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="relative min-h-screen text-ivory">
          {/* Background Cinematic Video Loop */}
          <video
            autoPlay
            muted
            loop
            playsInline
            suppressHydrationWarning
            className="fixed inset-0 w-full h-full object-cover z-[0] pointer-events-none"
          >
            <source src="/assets/logo/video.mp4" type="video/mp4" />
          </video>

          {/* Light tint + bottom/side gradients to keep video bright while preserving text readability */}
          <div className="fixed inset-0 z-[1] pointer-events-none bg-black/15 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Cinematic top vignette to ensure Navbar logo and text readability over the video */}
          <div className="fixed top-0 left-0 right-0 h-32 z-[1] pointer-events-none bg-gradient-to-b from-black/75 to-transparent" />

          {/* Floating Translucent Navigation */}
          <Navbar
            cartCount={cartItems.reduce((sum, i) => sum + i.quantity, 0)}
            onCartClick={() => setCartOpen(true)}
          />

          {/* Scrolling Editorial Chapters Container */}
          <div className="relative w-full z-[10] select-none">
            {/* HERO SECTION — Full Viewport Cinematic */}
            <section
              id="hero"
              className="relative min-h-screen w-full flex flex-col items-start justify-end overflow-hidden pt-28"
            >
              {/* Ghost / Watermark outline text — decorative backdrop */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                <span
                  className="font-serif uppercase text-[18vw] leading-none font-bold tracking-tighter"
                  style={{
                    WebkitTextStroke: '1px rgba(212,175,55,0.08)',
                    color: 'transparent',
                    letterSpacing: '-0.02em',
                  }}
                >
                  ELEGANCE
                </span>
              </div>

              {/* Vertical editorial side-label */}
              <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 pointer-events-none z-20 hidden md:flex">
                <div className="w-px h-16 bg-gold/40" />
                <span
                  className="text-[9px] uppercase tracking-[0.45em] text-gold/60 font-sans"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  Ink &amp; Cotton Club — Est. 2026
                </span>
                <div className="w-px h-16 bg-gold/40" />
              </div>

              {/* Main hero content — bottom-left cinematic */}
              <div className="relative z-20 px-10 md:px-32 pb-20 md:pb-28 w-full max-w-6xl">

                {/* Eyebrow label */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="flex items-center gap-4 mb-8"
                >
                  <div className="w-8 h-px bg-gold" />
                  <span className="text-[10px] uppercase tracking-[0.45em] text-gold font-sans">
                    Luxury Formal Shirts
                  </span>
                </motion.div>

                {/* Main Headline — staggered words */}
                <div className="overflow-hidden mb-2">
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                  >
                    <h1
                      className="font-serif text-[13vw] md:text-[8vw] leading-[0.88] uppercase font-light text-ivory tracking-tight"
                      style={{ letterSpacing: '-0.02em' }}
                    >
                      CRAFTED
                    </h1>
                  </motion.div>
                </div>

                <div className="overflow-hidden mb-2">
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
                    className="flex items-baseline gap-6 flex-wrap"
                  >
                    <h1
                      className="font-serif text-[13vw] md:text-[8vw] leading-[0.88] uppercase font-light tracking-tight"
                      style={{
                        letterSpacing: '-0.02em',
                        WebkitTextStroke: '1.5px rgba(212,175,55,0.7)',
                        color: 'transparent',
                      }}
                    >
                      TO BE
                    </h1>
                  </motion.div>
                </div>

                <div className="overflow-hidden mb-10">
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
                  >
                    <h1
                      className="font-serif text-[13vw] md:text-[8vw] leading-[0.88] uppercase font-light text-gold tracking-tight italic"
                      style={{ letterSpacing: '-0.02em' }}
                    >
                      REMEMBERED.
                    </h1>
                  </motion.div>
                </div>

                {/* Gold divider + descriptor */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-px bg-gold/50" />
                    <p className="text-[11px] md:text-xs font-sans font-light text-ivory/50 uppercase tracking-[0.3em] max-w-xs leading-relaxed">
                      Every thread chosen.<br />Every stitch intentional.
                    </p>
                  </div>

                  {/* CTAs — editorial underline style */}
                  <div className="flex items-center gap-8 md:ml-auto">
                    <button
                      onClick={() => scrollToSection('collection')}
                      className="group relative text-[11px] uppercase tracking-[0.3em] font-sans text-ivory hover:text-gold transition-colors duration-300 cursor-pointer pb-1"
                      data-cursor="button"
                    >
                      Explore Collection
                      <span className="absolute bottom-0 left-0 w-0 group-hover:w-full h-px bg-gold transition-all duration-500 ease-out" />
                    </button>
                    <div className="w-px h-6 bg-white/20" />
                    <button
                      onClick={() => setBookingOpen(true)}
                      className="group relative text-[11px] uppercase tracking-[0.3em] font-sans text-gold hover:text-ivory transition-colors duration-300 cursor-pointer pb-1"
                      data-cursor="button"
                    >
                      Book Styling
                      <span className="absolute bottom-0 left-0 w-full h-px bg-gold/40 group-hover:bg-ivory/40 transition-colors duration-300" />
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* Scroll indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-8 right-8 md:right-16 flex flex-col items-center gap-2 z-20"
              >
                <span className="text-[8px] uppercase tracking-[0.4em] text-ivory/30 font-sans" style={{ writingMode: 'vertical-rl' }}>
                  Scroll
                </span>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  className="w-px h-10 bg-gradient-to-b from-gold/50 to-transparent"
                />
              </motion.div>
            </section>

            {/* STORY CHAPTERS */}
            <StoryChapters
              onSectionChange={setActiveSection}
              onFocusAreaChange={setFocusArea}
            />

            {/* SIGNATURE SHIRTS SHOWCASE */}
            <SignatureCollection
              onSectionChange={setActiveSection}
              onFocusAreaChange={setFocusArea}
              onBuy={handleBuyShirt}
            />

            {/* CREED / ABOUT SECTION */}
            <section
              id="about"
              className="min-h-screen w-full flex flex-col items-center justify-center text-center px-6 md:px-24 bg-[#050505] relative border-b border-white/5 py-32"
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
                <p className="text-xs uppercase tracking-[0.25em] text-ivory/40 mt-8 max-w-sm mx-auto leading-relaxed">
                  A union of high art, precision engineering, and sartorial legacy. We do not sell shirts, we sell presence.
                </p>
                <div className="mt-8">
                  <button
                    onClick={() => setBookingOpen(true)}
                    className="px-8 py-4 bg-white/5 border border-white/10 rounded-full text-xs uppercase tracking-widest hover:border-gold hover:text-gold transition-colors duration-300 cursor-pointer"
                    data-cursor="button"
                  >
                    Book Private Styling Session
                  </button>
                </div>
              </div>
            </section>

            {/* FOOTER */}
            <Footer />
          </div>

          {/* Cart Sidebar drawer */}
          <Cart
            isOpen={cartOpen}
            onClose={() => setCartOpen(false)}
            items={cartItems}
            onRemoveItem={handleRemoveCartItem}
            onCheckout={handleCheckout}
          />

          {/* Private Styling Modal */}
          <AnimatePresence>
            {bookingOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                {/* Modal Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setBookingOpen(false)}
                  className="absolute inset-0 bg-matte-black"
                />

                {/* Modal Content */}
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="relative w-full max-w-md p-8 md:p-10 rounded-3xl glass border border-white/10 z-10 shadow-2xl overflow-hidden"
                >
                  <div className="flex flex-col gap-4 text-center items-center mb-8">
                    <Scissors size={24} className="text-gold animate-pulse-slow" />
                    <h3 className="font-serif text-xl md:text-2xl tracking-[0.15em] text-ivory uppercase">
                      Private Styling
                    </h3>
                    <p className="text-xs text-ivory/50 uppercase tracking-widest max-w-xs">
                      Consult with our Creative Director for bespoke sizing and selection.
                    </p>
                  </div>

                  {!bookingSubmitted ? (
                    <form onSubmit={handleBookingSubmit} className="flex flex-col gap-5">
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] uppercase tracking-widest text-gold">Name</label>
                        <input
                          type="text"
                          required
                          value={bookingName}
                          onChange={(e) => setBookingName(e.target.value)}
                          placeholder="e.g. Julian Vance"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors duration-300 text-ivory"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] uppercase tracking-widest text-gold">Private Email</label>
                        <input
                          type="email"
                          required
                          value={bookingEmail}
                          onChange={(e) => setBookingEmail(e.target.value)}
                          placeholder="e.g. julian@company.com"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors duration-300 text-ivory"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] uppercase tracking-widest text-gold">Preferred Date</label>
                        <input
                          type="date"
                          required
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors duration-300 text-ivory"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-4 bg-gold text-matte-black font-semibold text-xs uppercase tracking-[0.2em] rounded-full flex items-center justify-center gap-2 mt-4 hover:bg-ivory hover:text-matte-black transition-colors duration-300 cursor-pointer"
                        data-cursor="button"
                      >
                        Request Invitation
                        <ArrowRight size={14} />
                      </button>
                    </form>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center text-center gap-4 py-8"
                    >
                      <CheckCircle size={48} className="text-gold" />
                      <h4 className="font-serif text-lg text-ivory uppercase tracking-wider">
                        Invitation Sent
                      </h4>
                      <p className="text-xs text-ivory/50 leading-relaxed max-w-xs">
                        A private coordinator will review your request and contact you within 24 hours.
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            )}
          </AnimatePresence>
    </main>
  );
}

