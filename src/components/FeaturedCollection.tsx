'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowRight, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';

const FEATURED = [
  {
    id: 'white',
    name: 'The Ivory Signature',
    price: 195,
    colorName: 'Ivory White',
    tagline: 'Absolute Purity.',
    rating: 4.9,
    reviews: 128,
    badge: 'Best Seller',
    image: '/assets/shirt_white.png',
    accent: '#d4af37',
    bg: 'from-[#1a1410] to-[#0a0a08]',
  },
  {
    id: 'black',
    name: 'The Onyx Statement',
    price: 220,
    colorName: 'Jet Black',
    tagline: 'Quiet Authority.',
    rating: 4.8,
    reviews: 94,
    badge: 'New Arrival',
    image: '/assets/shirt_black.png',
    accent: '#c0c0c0',
    bg: 'from-[#111] to-[#060606]',
  },
  {
    id: 'blue',
    name: 'The Royal Ceremony',
    price: 210,
    colorName: 'Royal Blue',
    tagline: 'Born for the Occasion.',
    rating: 5.0,
    reviews: 67,
    badge: 'Limited',
    image: '/assets/shirt_blue.png',
    accent: '#4a7fc1',
    bg: 'from-[#070c14] to-[#040404]',
  },
];

export default function FeaturedCollection() {
  const router = useRouter();
  const { addToCart, setCartOpen } = useAppContext();

  const handleQuickAdd = (p: typeof FEATURED[0]) => {
    addToCart({
      id: `${p.id}-40`,
      name: p.name,
      price: p.price,
      size: '40',
      colorName: p.colorName,
      image: p.id,
    });
    setCartOpen(true);
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center py-16 px-6 md:px-16 bg-[#050505] border-t border-white/5 overflow-hidden">
      {/* Background soft lighting grid element */}
      <div className="absolute inset-0 opacity-[0.01] bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full flex flex-col justify-between">
        {/* Header - Compacted margin for single-viewport fit */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10 w-full">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-6 h-px bg-gold" />
              <span className="text-[10px] uppercase tracking-[0.5em] text-gold font-sans">Curated Choices</span>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl font-light uppercase leading-none tracking-tight">
              Featured<br />
              <span className="text-stroke-gold italic font-normal">Collection</span>
            </h2>
          </div>
          <button
            onClick={() => router.push('/collection')}
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-ivory/40 hover:text-gold transition-colors duration-300 font-sans group py-1 border-b border-transparent hover:border-gold/30"
          >
            Explore Full Line
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>

        {/* Grid - Heights optimized with flex/height constraints to guarantee fit on one screen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-stretch">
          {FEATURED.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.8, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="group relative rounded-xl overflow-hidden border border-white/5 hover:border-white/10 hover:shadow-2xl hover:shadow-black transition-all duration-500 cursor-pointer flex flex-col bg-[#060606]"
              onClick={() => router.push('/collection')}
            >
              {/* Image area - Fixed height relative to screen height to avoid spilling over 100vh */}
              <div className={`relative h-[36vh] min-h-[220px] max-h-[380px] bg-gradient-to-b ${product.bg} overflow-hidden w-full flex items-center justify-center`}>
                {/* Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span
                    className="px-2.5 py-1 text-[8px] uppercase tracking-[0.3em] font-sans border rounded-full bg-black/40 backdrop-blur-sm"
                    style={{ borderColor: product.accent + '50', color: product.accent }}
                  >
                    {product.badge}
                  </span>
                </div>

                {/* Image */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain p-6 mix-blend-luminosity opacity-85 transition-transform duration-700 group-hover:scale-105"
                />

                {/* Gradient fade to card info */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-transparent to-transparent opacity-80" />

                {/* Quick Add overlay */}
                <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 translate-y-2 group-hover:translate-y-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleQuickAdd(product); }}
                    className="w-full py-3 flex items-center justify-center gap-2 text-[9px] uppercase tracking-[0.25em] font-sans font-bold rounded-lg transition-colors shadow-lg"
                    style={{ backgroundColor: product.accent, color: '#050505' }}
                  >
                    <ShoppingBag size={11} /> Quick Add (Size 40)
                  </button>
                </div>
              </div>

              {/* Card Footer Info */}
              <div className="p-5 flex-grow flex flex-col justify-between border-t border-white/[0.02]">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[8px] uppercase tracking-[0.4em] text-ivory/30 font-sans">{product.colorName}</span>
                    <span className="font-serif text-lg text-gold font-light">${product.price}</span>
                  </div>
                  <h3 className="font-serif text-lg font-light text-ivory leading-tight group-hover:text-gold transition-colors duration-300">{product.name}</h3>
                  <p className="font-serif italic text-xs font-light mt-0.5 text-ivory/55">
                    {product.tagline}
                  </p>
                </div>

                {/* Reviews / Stars */}
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/[0.03]">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={9} className={i < Math.floor(product.rating) ? 'text-gold fill-gold' : 'text-white/15'} />
                    ))}
                  </div>
                  <span className="text-[9px] text-ivory/35 font-sans">{product.rating} ({product.reviews} reviews)</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
