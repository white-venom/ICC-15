'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Check } from 'lucide-react';

interface ShirtProduct {
  id: string;
  name: string;
  price: number;
  colorName: string;
  story: string;
  atmosphere: string;
  fitInfo: string;
  careInfo: string;
  testimonial: string;
  image: string;
  accentColor: string;
  bgGradient: string;
  tagline: string;
}

interface SignatureCollectionProps {
  onSectionChange: (section: string) => void;
  onFocusAreaChange: (area: 'all' | 'collar' | 'sleeve' | 'button') => void;
  onBuy: (product: ShirtProduct, size: string) => void;
}

const PRODUCTS: ShirtProduct[] = [
  {
    id: 'white',
    name: 'The Ivory Signature',
    price: 195,
    colorName: 'Ivory White',
    tagline: 'Absolute Purity. Absolute Power.',
    story: 'Woven from 100% long-staple Giza cotton, it features a semi-spread collar, double-button mitred cuffs, and champagne-hued shell buttons. The definitive dress shirt.',
    atmosphere: 'Ivory ambient lighting reflecting absolute purity and status.',
    fitInfo: 'Tailored fit. Slim cut across the torso without tightening the chest. Designed to follow the natural lines of the shoulder.',
    careInfo: 'Dry clean recommended. Hand wash cold using silk-detergent, iron damp on medium-high heat.',
    testimonial: '"The collar holds its structure perfectly under a tux. Truly unmatched quality." — Julian V., Creative Director',
    image: '/assets/shirt_white.png',
    accentColor: 'rgba(255,255,240,0.6)',
    bgGradient: 'from-[#1a1a18] to-[#0d0d0d]',
  },
  {
    id: 'black',
    name: 'The Onyx Statement',
    price: 220,
    colorName: 'Jet Black',
    tagline: 'Quiet Authority. Loud Presence.',
    story: 'Constructed using high-twist double-ply black yarns. The fabric undergoes an organic calendering process, providing a sophisticated matte-sheen texture that absorbs light beautifully.',
    atmosphere: 'Dramatic spotlights creating high-contrast specular reflections.',
    fitInfo: 'Classic tailored fit. Relaxed armholes with a tapered waist for a sharp, commanding posture.',
    careInfo: 'Dry clean only to maintain the signature matte-sheen coating. Steam iron inside out.',
    testimonial: '"An executive statement. The jet black color has a deep reflection I have never found elsewhere." — Arthur K., CEO',
    image: '/assets/shirt_black.png',
    accentColor: 'rgba(180,180,180,0.5)',
    bgGradient: 'from-[#111111] to-[#080808]',
  },
  {
    id: 'blue',
    name: 'The Royal Ceremony',
    price: 210,
    colorName: 'Royal Blue',
    tagline: 'Born for the Occasion.',
    story: 'Woven with a micro-twill pattern that bounces light dynamically. The deep royal blue yarns are mercerized twice for maximum color depth and a luxurious, silk-like hand feel.',
    atmosphere: 'Royal blue ambient wash for formal receptions and events.',
    fitInfo: 'Bespoke fit. Slimmer sleeves and high armholes. Fits like a tailored glove for commanding presence.',
    careInfo: 'Machine wash delicate, cold. Line dry in shade. Warm iron if necessary.',
    testimonial: '"The fabric catches the light as you move. It is almost iridescent. Stunning." — Marcus L., Fashion Consultant',
    image: '/assets/shirt_blue.png',
    accentColor: 'rgba(80,120,220,0.6)',
    bgGradient: 'from-[#0a0f1a] to-[#080808]',
  },
];

const SIZES = ['38', '39', '40', '41', '42', '43'];

export default function SignatureCollection({ onSectionChange, onFocusAreaChange, onBuy }: SignatureCollectionProps) {
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({ white: '40', black: '40', blue: '40' });
  const [activeTabs, setActiveTabs] = useState<Record<string, 'story' | 'fit' | 'care'>>({ white: 'story', black: 'story', blue: 'story' });
  const [buyingId, setBuyingId] = useState<string | null>(null);

  const whiteRef = useRef(null);
  const blackRef = useRef(null);
  const blueRef = useRef(null);

  const whiteInView = useInView(whiteRef, { amount: 0.4 });
  const blackInView = useInView(blackRef, { amount: 0.4 });
  const blueInView = useInView(blueRef, { amount: 0.4 });

  useEffect(() => {
    if (whiteInView) onSectionChange('collection-white');
    else if (blackInView) onSectionChange('collection-black');
    else if (blueInView) onSectionChange('collection-blue');
  }, [whiteInView, blackInView, blueInView, onSectionChange]);

  const handleBuyClick = (product: ShirtProduct) => {
    const size = selectedSizes[product.id] || '40';
    setBuyingId(product.id);
    onBuy(product, size);
    setTimeout(() => setBuyingId(null), 1500);
  };

  return (
    <div id="collection" className="relative z-10 w-full">

      {/* Collection header */}
      <div className="w-full px-10 md:px-24 pt-24 pb-16 flex items-end justify-between border-b border-white/5">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-px bg-gold" />
            <span className="text-[9px] uppercase tracking-[0.45em] text-gold font-sans">Signature Collection</span>
          </div>
          <h2
            className="font-serif text-[7vw] md:text-[4vw] leading-none uppercase font-light text-ivory"
            style={{ letterSpacing: '-0.02em' }}
          >
            Three Statements.<br />One Standard.
          </h2>
        </div>
        <span className="hidden md:block text-[9px] uppercase tracking-[0.3em] text-ivory/25 font-sans text-right max-w-[180px] leading-relaxed">
          Each shirt is made to order within 14 working days
        </span>
      </div>

      {/* Products */}
      {PRODUCTS.map((prod, idx) => {
        const ref = prod.id === 'white' ? whiteRef : prod.id === 'black' ? blackRef : blueRef;
        const currentSize = selectedSizes[prod.id];
        const currentTab = activeTabs[prod.id];
        const isEven = idx % 2 === 0;

        return (
          <section
            key={prod.id}
            ref={ref}
            className={`min-h-screen w-full flex flex-col md:flex-row ${isEven ? '' : 'md:flex-row-reverse'} border-b border-white/5 overflow-hidden`}
          >
            {/* ── Image Panel ── */}
            <motion.div
              initial={{ opacity: 0, scale: 1.05 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className={`relative w-full md:w-1/2 min-h-[50vh] md:min-h-screen overflow-hidden bg-gradient-to-b ${prod.bgGradient}`}
            >
              {/* Product image */}
              <img
                src={prod.image}
                alt={prod.name}
                className="absolute inset-0 w-full h-full object-cover object-center opacity-90 mix-blend-luminosity"
              />

              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-70`} />
              {isEven
                ? <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#080808]/60" />
                : <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#080808]/60" />
              }

              {/* Index number */}
              <div className="absolute top-8 left-8 font-serif text-[8rem] leading-none font-bold text-white/[0.04] select-none pointer-events-none">
                0{idx + 1}
              </div>

              {/* Color chip + name at bottom */}
              <div className="absolute bottom-8 left-8 flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full border border-white/20"
                  style={{ backgroundColor: prod.accentColor }}
                />
                <span className="text-[9px] uppercase tracking-[0.4em] text-ivory/40 font-sans">
                  {prod.colorName}
                </span>
              </div>
            </motion.div>

            {/* ── Details Panel ── */}
            <motion.div
              initial={{ opacity: 0, x: isEven ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full md:w-1/2 flex flex-col justify-center px-10 md:px-16 py-16 md:py-24 gap-8"
            >
              {/* Product header */}
              <div className="flex flex-col gap-3">
                <span className="text-[9px] uppercase tracking-[0.45em] text-gold font-sans">
                  Signature 0{idx + 1}
                </span>
                <h3
                  className="font-serif text-4xl md:text-5xl font-light text-ivory uppercase leading-none"
                  style={{ letterSpacing: '-0.01em' }}
                >
                  {prod.name}
                </h3>
                <p className="font-serif italic text-gold/60 text-base font-light mt-1">
                  {prod.tagline}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="font-serif text-3xl text-gold font-light">${prod.price}</span>
                <div className="h-4 w-px bg-white/10" />
                <span className="text-[9px] uppercase tracking-[0.3em] text-ivory/30">
                  Free worldwide shipping
                </span>
              </div>

              {/* Tabs */}
              <div className="flex flex-col gap-4 border-t border-white/5 pt-6">
                <div className="flex gap-6">
                  {(['story', 'fit', 'care'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTabs((prev) => ({ ...prev, [prod.id]: tab }))}
                      className={`text-[10px] uppercase tracking-[0.25em] pb-2 relative transition-colors duration-300 pointer-events-auto ${
                        currentTab === tab ? 'text-gold' : 'text-ivory/35 hover:text-ivory/60'
                      }`}
                      data-cursor="button"
                    >
                      {tab}
                      {currentTab === tab && (
                        <motion.div
                          layoutId={`tab-indicator-${prod.id}`}
                          className="absolute bottom-0 left-0 right-0 h-px bg-gold"
                        />
                      )}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="min-h-[90px]"
                  >
                    <p className="text-sm font-light text-ivory/55 leading-relaxed">
                      {currentTab === 'story' && prod.story}
                      {currentTab === 'fit' && prod.fitInfo}
                      {currentTab === 'care' && prod.careInfo}
                    </p>
                    {currentTab === 'story' && (
                      <p className="text-[10px] italic text-gold/60 mt-4 leading-relaxed">
                        {prod.testimonial}
                      </p>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Size selection */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-ivory/40">Select Size (Neck cm)</span>
                  <button className="text-[9px] uppercase tracking-[0.3em] text-gold hover:text-ivory transition-colors pointer-events-auto" data-cursor="button">
                    Fit Guide
                  </button>
                </div>
                <div className="flex gap-2">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSizes((prev) => ({ ...prev, [prod.id]: size }))}
                      className={`w-10 h-10 text-xs font-sans border flex items-center justify-center transition-all duration-300 pointer-events-auto ${
                        currentSize === size
                          ? 'border-gold bg-gold/10 text-gold'
                          : 'border-white/10 hover:border-white/30 text-ivory/60'
                      }`}
                      style={{ borderRadius: '2px' }}
                      data-cursor="button"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => handleBuyClick(prod)}
                  disabled={buyingId !== null}
                  className={`flex-1 py-4 text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all duration-500 pointer-events-auto font-sans ${
                    buyingId === prod.id
                      ? 'bg-white/5 border border-gold/30 text-gold'
                      : 'bg-gold hover:bg-ivory text-matte-black font-semibold'
                  }`}
                  style={{ borderRadius: '2px' }}
                  data-cursor="button"
                >
                  {buyingId === prod.id ? (
                    <><Sparkles size={13} className="animate-spin-slow" />Preparing...</>
                  ) : (
                    <>Buy Now <ArrowRight size={13} /></>
                  )}
                </button>

                <button
                  onClick={() => onBuy(prod, currentSize)}
                  className="px-6 py-4 border border-white/10 hover:border-gold hover:text-gold text-[11px] uppercase tracking-[0.25em] text-ivory/60 transition-all duration-300 pointer-events-auto"
                  style={{ borderRadius: '2px' }}
                  data-cursor="button"
                >
                  Collect
                </button>
              </div>
            </motion.div>
          </section>
        );
      })}
    </div>
  );
}
