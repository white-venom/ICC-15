'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, notFound } from 'next/navigation';
import { ArrowLeft, Star, Ruler } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

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

interface ProductDetail {
  id: string;
  name: string;
  price: number;
  colorName: string;
  tagline: string;
  badge?: string;
  rating: number;
  reviews: number;
  description: string;
  features: string[];
  image: string;
  images: string[];
  accent: string;
  gradient: string;
  sizes: string[];
  material: string;
  origin: string;
  washCare: string;
  testimonial: string;
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const { addToCart, setCartOpen, formatPrice } = useAppContext();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('40');
  const [added, setAdded] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [activeImage, setActiveImage] = useState('');
  const [inventoryMap, setInventoryMap] = useState<Record<string, number>>({});

  useEffect(() => {
    let active = true;
    
    // Fetch products
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (active) {
          const match = data.find((p: ProductDetail) => p.id === id);
          if (match) {
            setProduct(match);
            setActiveImage(match.image);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load product detail:', err);
        if (active) setLoading(false);
      });

    // Fetch inventory
    fetch('/api/inventory')
      .then((res) => res.json())
      .then((data) => {
        if (active) {
          const map: Record<string, number> = {};
          data.forEach((inv: any) => {
            const key = `${inv.productId}-${inv.size}-${inv.colorName}`;
            map[key] = inv.stock;
          });
          setInventoryMap(map);
        }
      })
      .catch((err) => console.error('Failed to load inventory mapping:', err));

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-ivory flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/10 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

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
  };

  const currentStockKey = `${product.id}-${selectedSize}-${product.colorName}`;
  const isSelectedSizeOutOfStock = inventoryMap[currentStockKey] !== undefined && inventoryMap[currentStockKey] <= 0;

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
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-3 w-full md:w-20 shrink-0">
              {product.images?.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(img)}
                  className={`relative aspect-[3/4] w-16 md:w-full rounded-xl overflow-hidden bg-white/[0.02] border transition-all duration-300 ${
                    activeImage === img ? 'border-gold shadow-[0_0_8px_rgba(212,175,55,0.15)]' : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} View ${index + 1}`}
                    className="w-full h-full object-contain p-2 mix-blend-luminosity opacity-80"
                  />
                </button>
              ))}
            </div>

            {/* Large Active Image Screen */}
            <div
              className="relative aspect-[3/4] flex-1 rounded-3xl overflow-hidden flex items-center justify-center border border-white/5"
              style={{ background: `radial-gradient(circle at center, ${product.accent}12 0%, transparent 70%)` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-b ${product.gradient} opacity-20`} />
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={activeImage}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="w-full h-full object-contain p-10 mix-blend-luminosity opacity-90 relative z-10"
                />
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ─ RIGHT: PRODUCT SPECIFICATIONS info ─ */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="flex flex-col gap-8 relative z-10"
          >
            {/* Tag / Title block */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="text-[9px] uppercase tracking-[0.45em] text-gold font-sans font-semibold">
                  {product.badge || 'Signature Collection'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: product.accent }} />
                <span className="text-[9px] uppercase tracking-[0.3em] text-ivory/40 font-sans">
                  {product.colorName}
                </span>
              </div>

              <h1 className="font-serif text-4xl md:text-5xl uppercase tracking-wide leading-none text-white">
                {product.name}
              </h1>

              <p className="font-serif italic text-gold/70 text-lg md:text-xl font-light">
                {product.tagline}
              </p>
            </div>

            {/* Pricing & Reviews */}
            <div className="flex items-center gap-6 border-b border-white/5 pb-6">
              <span className="font-serif text-3xl text-white font-light">
                {formatPrice(product.price)}
              </span>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={11} className={i < Math.floor(product.rating) ? 'text-gold fill-gold' : 'text-white/15'} />
                  ))}
                </div>
                <span className="text-[10px] text-ivory/40 font-sans">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm font-light text-ivory/60 leading-relaxed font-sans -mt-2">
              {product.description}
            </p>

            {/* Key details list */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs py-4 border-t border-b border-white/5 font-sans">
              <div>
                <span className="text-ivory/30 uppercase tracking-widest text-[9px] block mb-0.5">Material Composition</span>
                <span className="text-ivory/80 font-light">{product.material}</span>
              </div>
              <div>
                <span className="text-ivory/30 uppercase tracking-widest text-[9px] block mb-0.5">Atelier Origin</span>
                <span className="text-ivory/80 font-light">{product.origin}</span>
              </div>
              <div className="col-span-2">
                <span className="text-ivory/30 uppercase tracking-widest text-[9px] block mb-0.5">Care Instructions</span>
                <span className="text-ivory/80 font-light">{product.washCare}</span>
              </div>
            </div>

            {/* Size Selector Widget */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-[9px] uppercase tracking-[0.2em] text-ivory/40 font-sans">Collar size (cm)</span>
                <button
                  onClick={() => setShowSizeChart(!showSizeChart)}
                  className="text-[9px] uppercase tracking-[0.2em] text-gold hover:text-white transition-colors duration-300 font-sans flex items-center gap-1.5"
                >
                  <Ruler size={11} /> Size Chart
                </button>
              </div>

              <div className="flex gap-2 flex-wrap">
                {product.sizes?.map((size) => {
                  const stockKey = `${product.id}-${size}-${product.colorName}`;
                  const isOutOfStock = inventoryMap[stockKey] !== undefined && inventoryMap[stockKey] <= 0;
                  return (
                    <button
                      key={size}
                      disabled={isOutOfStock}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-xl text-xs font-semibold tracking-wider transition-all duration-300 border flex items-center justify-center ${
                        isOutOfStock
                          ? 'border-white/5 text-ivory/20 line-through cursor-not-allowed'
                          : selectedSize === size
                            ? 'bg-gold border-gold text-matte-black font-bold shadow-[0_0_12px_rgba(212,175,55,0.2)]'
                            : 'border-white/10 text-ivory/60 hover:border-white/30'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>

              {/* Expansion Drawer Size Chart */}
              <AnimatePresence>
                {showSizeChart && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden bg-white/[0.01] border border-white/5 rounded-2xl"
                  >
                    <div className="p-5 space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                        <Ruler size={12} className="text-gold" />
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
                                  {row.collar}&quot;
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
                whileHover={isSelectedSizeOutOfStock ? {} : { scale: 1.01 }}
                whileTap={isSelectedSizeOutOfStock ? {} : { scale: 0.99 }}
                disabled={isSelectedSizeOutOfStock}
                onClick={handleAddToCart}
                className="flex-1 py-4 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.3em] font-sans font-semibold rounded-2xl border transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: isSelectedSizeOutOfStock ? 'transparent' : added ? '#0f2010' : 'transparent',
                  color: isSelectedSizeOutOfStock ? 'rgba(250,248,245,0.2)' : added ? '#4ade80' : product.accent,
                  borderColor: isSelectedSizeOutOfStock ? 'rgba(255,255,255,0.05)' : added ? '#4ade8040' : product.accent + '55',
                }}
              >
                {isSelectedSizeOutOfStock ? 'Sold Out' : added ? 'Added to Bag' : 'Add to Bag'}
              </motion.button>

              {/* Buy Now */}
              <motion.button
                whileHover={isSelectedSizeOutOfStock ? {} : { scale: 1.01 }}
                whileTap={isSelectedSizeOutOfStock ? {} : { scale: 0.99 }}
                disabled={isSelectedSizeOutOfStock}
                onClick={handleBuyNow}
                className="flex-1 py-4 text-[10px] uppercase tracking-[0.3em] font-sans font-bold rounded-2xl text-matte-black transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: isSelectedSizeOutOfStock ? 'rgba(255,255,255,0.05)' : product.accent, color: isSelectedSizeOutOfStock ? 'rgba(250,248,245,0.2)' : undefined }}
              >
                {isSelectedSizeOutOfStock ? 'Sold Out' : 'Order Express'}
              </motion.button>
            </div>

            {/* Editorial Testimonial Quote */}
            <div className="mt-4 p-6 bg-white/[0.01] border border-white/5 rounded-2xl italic font-serif text-sm text-ivory/60 leading-relaxed">
              {product.testimonial}
            </div>

          </motion.div>

        </div>
      </div>
    </div>
  );
}
