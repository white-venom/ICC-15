'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, notFound } from 'next/navigation';
import { ArrowLeft, ShoppingBag, Check, Star, Ruler } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

const PRODUCTS = {
  white: {
    id: 'white',
    name: 'The Ivory Signature',
    price: 195,
    colorName: 'Ivory White',
    tagline: 'Absolute Purity. Absolute Power.',
    badge: 'Best Seller',
    rating: 4.9,
    reviews: 128,
    description: 'Woven from 100% long-staple Giza cotton with a semi-spread collar, double-button mitred cuffs, and champagne-hued shell buttons. The white canvas of refinement — for boardrooms, ceremonies, and every moment demanding authority.',
    features: ['Giza Cotton', 'Pearl Buttons', 'Double Cuffs', 'French Seams', 'Semi-spread Collar', 'Fused Interlining'],
    image: '/assets/shirt_white.png',
    images: [
      '/assets/shirt_white.png',
      '/assets/shirt_white_collar.png',
      '/assets/shirt_white_cuff.png'
    ],
    accent: '#d4af37',
    gradient: 'from-[#171310] via-[#0b0a08] to-[#040404]',
    sizes: ['38', '39', '40', '41', '42', '43', '44'],
    material: '100% Giza Long-Staple Cotton',
    origin: 'Milan, Italy',
    washCare: 'Dry clean only. Steam press.',
  },
  black: {
    id: 'black',
    name: 'The Onyx Statement',
    price: 220,
    colorName: 'Jet Black',
    tagline: 'Quiet Authority. Loud Presence.',
    badge: 'New Arrival',
    rating: 4.8,
    reviews: 94,
    description: 'Constructed from high-twist double-ply yarns with an organic calendering process for a sophisticated matte-sheen texture. Black redefined — structured, sleek, and commanding.',
    features: ['Double Ply', 'Matte Sheen', 'Tapered Waist', 'Executive Cut', 'French Placket', 'Mitered Cuffs'],
    image: '/assets/shirt_black.png',
    images: [
      '/assets/shirt_black.png',
      '/assets/shirt_black_collar.png',
      '/assets/shirt_black_cuff.png'
    ],
    accent: '#c0c0c0',
    gradient: 'from-[#111111] via-[#090909] to-[#040404]',
    sizes: ['38', '39', '40', '41', '42', '43', '44'],
    material: '200s Double-Ply Egyptian Cotton',
    origin: 'Naples, Italy',
    washCare: 'Dry clean only. Cold iron inside-out.',
  },
  blue: {
    id: 'blue',
    name: 'The Royal Ceremony',
    price: 210,
    colorName: 'Royal Blue',
    tagline: 'Born For The Occasion.',
    badge: 'Limited Edition',
    rating: 5.0,
    reviews: 67,
    description: 'Woven with a micro-twill pattern. Deep royal blue yarns mercerized twice for maximum color depth and silk-like hand feel. Reserved for occasions that demand excellence.',
    features: ['Micro-Twill', 'Double Mercerized', 'Bespoke Fit', 'Iridescent Sheen', 'Mother-of-Pearl Buttons', 'Double Side Seams'],
    image: '/assets/shirt_blue.png',
    images: [
      '/assets/shirt_blue.png',
      '/assets/shirt_blue_collar.png',
      '/assets/shirt_blue_cuff.png'
    ],
    accent: '#4a7fc1',
    gradient: 'from-[#070b12] via-[#04060b] to-[#040404]',
    sizes: ['38', '39', '40', '41', '42', '43', '44'],
    material: '120s Mercerized Micro-Twill Cotton',
    origin: 'Como, Italy',
    washCare: 'Dry clean only. Low-heat steam only.',
  },
};

// Size chart data: collar size → chest, waist, sleeve measurements (cm)
const SIZE_CHART = [
  { collar: '38', chest: '96–98', waist: '86–88', sleeve: '86' },
  { collar: '39', chest: '99–101', waist: '89–91', sleeve: '87' },
  { collar: '40', chest: '102–104', waist: '92–94', sleeve: '88' },
  { collar: '41', chest: '105–108', waist: '95–98', sleeve: '89' },
  { collar: '42', chest: '109–112', waist: '99–102', sleeve: '90' },
  { collar: '43', chest: '113–116', waist: '103–106', sleeve: '91' },
  { collar: '44', chest: '117–120', waist: '107–110', sleeve: '92' },
];

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const { addToCart, setCartOpen, formatPrice } = useAppContext();
  const product = PRODUCTS[id as keyof typeof PRODUCTS];

  const [selectedSize, setSelectedSize] = useState('40');
  const [added, setAdded] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [activeImage, setActiveImage] = useState(product?.image || '');

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    addToCart({
      id: `${product.id}-${selectedSize}`,
      name: product.name,
      price: product.price,
      size: selectedSize,
      colorName: product.colorName,
      image: product.id,
    });
    setAdded(true);
    setCartOpen(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Could route to checkout; for now opens cart
  };

  return (
    <div className="min-h-screen bg-[#050505] text-ivory">
      {/* ── BACK NAVIGATION ──────────────────────────────── */}
      <div className="pt-24 px-6 md:px-16">
        <button
          onClick={() => router.push('/collection')}
          className="flex items-center gap-2 text-[9px] uppercase tracking-[0.4em] text-ivory/40 hover:text-gold transition-colors duration-300 font-sans"
        >
          <ArrowLeft size={12} /> Back to Gallery
        </button>
      </div>

      {/* ── MAIN PRODUCT LAYOUT ──────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* ─ LEFT: IMAGES VIEW RACK ─ */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col-reverse md:flex-row gap-5 relative z-10"
          >
            {/* Thumbnails list */}
            <div className="flex md:flex-col gap-3 shrink-0">
              {product.images.map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`relative w-20 h-24 rounded-xl overflow-hidden bg-gradient-to-b ${product.gradient} border transition-all duration-300 ${
                    activeImage === imgUrl ? 'border-gold scale-105' : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.name} detail view ${index + 1}`}
                    className="w-full h-full object-contain p-2 mix-blend-luminosity"
                  />
                </button>
              ))}
            </div>

            {/* Main Image Viewport */}
            <div className="relative flex-grow w-full">
              {/* Ambient glow */}
              <div
                className="absolute -inset-8 rounded-full blur-[80px] opacity-25 pointer-events-none"
                style={{ background: `radial-gradient(circle, ${product.accent}44, transparent 70%)` }}
              />

              <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-b ${product.gradient} border border-white/5 aspect-[3/4] w-full`}>
                {/* Badge */}
                <div className="absolute top-6 left-6 z-10">
                  <span
                    className="px-3 py-1 text-[8px] uppercase tracking-[0.3em] font-sans border rounded-full"
                    style={{ borderColor: product.accent + '55', color: product.accent }}
                  >
                    {product.badge}
                  </span>
                </div>

                {/* Rating chip */}
                <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 z-10">
                  <Star size={10} className="text-gold fill-gold" />
                  <span className="text-[9px] font-sans text-ivory/70">{product.rating} ({product.reviews})</span>
                </div>

                {/* Main Shirt image */}
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    src={activeImage}
                    alt={product.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 w-full h-full object-contain object-center p-10 mix-blend-luminosity opacity-92"
                  />
                </AnimatePresence>

                {/* Color chip */}
                <div className="absolute bottom-6 left-6 flex items-center gap-2 z-10">
                  <span className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: product.accent }} />
                  <span className="text-[9px] uppercase tracking-[0.35em] text-ivory/40 font-sans">{product.colorName}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ─ RIGHT: DETAILS ─ */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-7 pt-2"
          >
            {/* Title block */}
            <div>
              <p className="text-[9px] uppercase tracking-[0.5em] text-gold font-sans mb-2">Ink &amp; Cotton Club</p>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light uppercase leading-tight text-white mb-2">
                {product.name}
              </h1>
              <p className="font-serif italic text-base font-light" style={{ color: product.accent + 'cc' }}>
                {product.tagline}
              </p>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={i < Math.floor(product.rating) ? 'text-gold fill-gold' : 'text-white/20'}
                  />
                ))}
              </div>
              <span className="text-xs text-ivory/40 font-sans">{product.rating} · {product.reviews} reviews</span>
            </div>

            {/* Description */}
            <p className="text-sm font-light text-ivory/60 leading-relaxed font-sans">{product.description}</p>

            {/* Features grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {product.features.map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-gold" />
                  <span className="text-[9px] uppercase tracking-[0.2em] text-ivory/50 font-sans">{f}</span>
                </div>
              ))}
            </div>

            {/* Material & Origin */}
            <div className="flex flex-wrap gap-6 text-[10px] font-sans uppercase tracking-[0.2em] text-ivory/35 border-t border-white/5 pt-5">
              <span><span className="text-ivory/20">Material</span> · {product.material}</span>
              <span><span className="text-ivory/20">Origin</span> · {product.origin}</span>
              <span><span className="text-ivory/20">Care</span> · {product.washCare}</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-3xl font-light text-gold">{formatPrice(product.price)}</span>
              <span className="text-[8px] uppercase tracking-[0.3em] text-ivory/30 font-sans">Free worldwide shipping · Made to order</span>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[9px] uppercase tracking-[0.35em] text-ivory/40 font-sans">
                  Select Collar Size (inches)
                </p>
                <button
                  onClick={() => setShowSizeChart(!showSizeChart)}
                  className="flex items-center gap-1 text-[8px] uppercase tracking-[0.3em] font-sans transition-colors duration-200"
                  style={{ color: product.accent }}
                >
                  <Ruler size={10} /> Size Guide
                </button>
              </div>

              <div className="flex gap-2 flex-wrap mb-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-11 h-11 text-[11px] font-sans uppercase tracking-wider border rounded-xl transition-all duration-200 ${
                      selectedSize === size
                        ? 'border-gold text-gold bg-gold/10'
                        : 'border-white/10 text-ivory/40 hover:border-white/25 hover:text-ivory/70'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {/* Size Chart - collapsible */}
              <AnimatePresence>
                {showSizeChart && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 rounded-xl border border-white/8 overflow-hidden">
                      <div className="px-4 py-2.5 bg-white/4 border-b border-white/8">
                        <p className="text-[8px] uppercase tracking-[0.4em] text-gold font-sans">Size Reference Chart (cm)</p>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-[10px] font-sans">
                          <thead>
                            <tr className="border-b border-white/5">
                              <th className="text-left px-4 py-2.5 text-ivory/30 uppercase tracking-[0.2em] font-light">Collar</th>
                              <th className="text-left px-4 py-2.5 text-ivory/30 uppercase tracking-[0.2em] font-light">Chest</th>
                              <th className="text-left px-4 py-2.5 text-ivory/30 uppercase tracking-[0.2em] font-light">Waist</th>
                              <th className="text-left px-4 py-2.5 text-ivory/30 uppercase tracking-[0.2em] font-light">Sleeve</th>
                            </tr>
                          </thead>
                          <tbody>
                            {SIZE_CHART.map((row) => (
                              <tr
                                key={row.collar}
                                className={`border-b border-white/5 transition-colors duration-150 ${
                                  selectedSize === row.collar ? 'bg-gold/8' : 'hover:bg-white/2'
                                }`}
                              >
                                <td className="px-4 py-2.5" style={{ color: selectedSize === row.collar ? product.accent : 'rgba(250,248,245,0.7)' }}>
                                  {row.collar}"
                                </td>
                                <td className="px-4 py-2.5 text-ivory/50">{row.chest}</td>
                                <td className="px-4 py-2.5 text-ivory/50">{row.waist}</td>
                                <td className="px-4 py-2.5 text-ivory/50">{row.sleeve}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              {/* Add to Cart */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleAddToCart}
                className="flex-1 py-4 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.3em] font-sans font-semibold rounded-2xl border transition-all duration-300"
                style={{
                  backgroundColor: added ? '#0f2010' : 'transparent',
                  color: added ? '#4ade80' : product.accent,
                  borderColor: added ? '#4ade8040' : product.accent + '55',
                }}
              >
                {added ? <><Check size={13} /> Added</> : <><ShoppingBag size={13} /> Add to Cart</>}
              </motion.button>

              {/* Buy Now */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleBuyNow}
                className="flex-1 py-4 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.3em] font-sans font-semibold rounded-2xl transition-all duration-300"
                style={{
                  backgroundColor: product.accent,
                  color: '#050505',
                }}
              >
                Buy Now — {formatPrice(product.price)}
              </motion.button>
            </div>

            {/* Delivery note */}
            <p className="text-[8px] uppercase tracking-[0.25em] text-ivory/25 font-sans text-center">
              Made to order in 14 working days · Free worldwide shipping · 30-day fit guarantee
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
