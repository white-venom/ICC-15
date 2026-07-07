'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

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
  section: string;
  rating: number;
  reviews: number;
  accent: string;
  gradient: string;
}

interface SignatureCollectionProps {
  products: ShirtProduct[];
  onSectionChange: (section: string) => void;
  onFocusAreaChange: (area: 'all' | 'collar' | 'sleeve' | 'button') => void;
  onBuy: (product: ShirtProduct, size: string) => void;
}

const SIZES = ['38', '39', '40', '41', '42', '43'];

export default function SignatureCollection({ products, onSectionChange, onFocusAreaChange, onBuy }: SignatureCollectionProps) {
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [activeTabs, setActiveTabs] = useState<Record<string, 'story' | 'fit' | 'care'>>({});
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [inventoryMap, setInventoryMap] = useState<Record<string, number>>({});

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

  useEffect(() => {
    fetch('/api/inventory')
      .then((res) => res.json())
      .then((data) => {
        const map: Record<string, number> = {};
        data.forEach((inv: any) => {
          const key = `${inv.productId}-${inv.size}-${inv.colorName}`;
          map[key] = inv.stock;
        });
        setInventoryMap(map);
      })
      .catch((err) => console.error('Failed to fetch inventory:', err));
  }, []);

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
      {products.map((prod, idx) => {
        const ref = prod.id === 'white' ? whiteRef : prod.id === 'black' ? blackRef : blueRef;
        const currentSize = selectedSizes[prod.id] || '40';
        const currentTab = activeTabs[prod.id] || 'story';
        const isEven = idx % 2 === 0;

        const selectedSizeStockKey = `${prod.id}-${currentSize}-${prod.colorName}`;
        const isSelectedSizeOutOfStock = inventoryMap[selectedSizeStockKey] !== undefined && inventoryMap[selectedSizeStockKey] <= 0;

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
              viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full md:w-1/2 aspect-square md:aspect-auto md:min-h-screen bg-matte-black relative flex items-center justify-center p-8 md:p-16"
            >
              {/* Radial gradient background wash */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none transition-all duration-700"
                style={{
                  background: `radial-gradient(circle at center, ${prod.accentColor} 0%, transparent 65%)`
                }}
              />
              <div className={`absolute inset-0 bg-gradient-to-b ${prod.bgGradient} opacity-30`} />

              {/* Shirt Product Showcase Image */}
              <img
                src={prod.image}
                alt={prod.name}
                className="h-[80%] max-h-[500px] object-contain mix-blend-luminosity opacity-90 select-none relative z-10 transition-transform duration-700 hover:scale-105"
              />
            </motion.div>

            {/* ── Details Panel ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="w-full md:w-1/2 min-h-screen bg-[#080808] flex items-center p-8 md:p-24 relative"
            >
              <div className="w-full space-y-8 text-left">
                {/* Header info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] uppercase tracking-[0.45em] text-gold font-sans font-semibold">
                      {prod.section}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="text-[9px] uppercase tracking-[0.3em] text-ivory/40 font-sans">
                      {prod.colorName}
                    </span>
                  </div>
                  <h3 className="font-serif text-3xl md:text-5xl uppercase tracking-wide leading-tight text-white">
                    {prod.name}
                  </h3>
                  <p className="font-serif italic text-gold/75 text-lg font-light">
                    {prod.tagline}
                  </p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-3 text-[10px] text-ivory/55">
                  <span className="text-gold font-bold">★ {prod.rating}</span>
                  <span className="text-ivory/20">|</span>
                  <span>{prod.reviews} custom orders</span>
                </div>

                {/* Spec sheets tab controls */}
                <div className="space-y-4">
                  <div className="flex border-b border-white/5 pb-2 gap-6 relative z-20 pointer-events-auto">
                    {(['story', 'fit', 'care'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTabs((prev) => ({ ...prev, [prod.id]: tab }))}
                        className={`text-[9px] uppercase tracking-widest font-sans transition-colors duration-300 pb-1 relative ${
                          currentTab === tab ? 'text-gold' : 'text-ivory/45 hover:text-ivory'
                        }`}
                        data-cursor="button"
                      >
                        {tab}
                        {currentTab === tab && (
                          <motion.div
                            layoutId={`active-tab-${prod.id}`}
                            className="absolute bottom-0 left-0 right-0 h-[1px] bg-gold"
                            transition={{ duration: 0.3 }}
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
                          Atmosphere: {prod.atmosphere}
                        </p>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Purchase Options */}
                <div className="flex flex-col gap-4 border-t border-white/5 pt-6 relative z-20">
                  {/* Size Selector */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-ivory/40">Select Collar Size</span>
                    <div className="flex gap-2 flex-wrap">
                      {SIZES.map((size) => {
                        const stockKey = `${prod.id}-${size}-${prod.colorName}`;
                        const isOutOfStock = inventoryMap[stockKey] !== undefined && inventoryMap[stockKey] <= 0;
                        return (
                          <button
                            key={size}
                            disabled={isOutOfStock}
                            onClick={() => setSelectedSizes((prev) => ({ ...prev, [prod.id]: size }))}
                            className={`w-10 h-10 rounded-lg text-xs font-semibold tracking-wider transition-all duration-300 border flex items-center justify-center pointer-events-auto ${
                              isOutOfStock
                                ? 'border-white/5 text-ivory/20 line-through cursor-not-allowed'
                                : currentSize === size
                                  ? 'bg-gold border-gold text-[#080808] font-bold shadow-[0_0_12px_rgba(212,175,55,0.2)]'
                                  : 'border-white/10 text-ivory/60 hover:border-white/30'
                            }`}
                            title={isOutOfStock ? "Sold Out" : ""}
                            data-cursor={isOutOfStock ? "disabled" : "button"}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Add to Cart button */}
                  <button
                    onClick={() => handleBuyClick(prod)}
                    disabled={buyingId === prod.id || isSelectedSizeOutOfStock}
                    className={`w-full md:w-auto px-10 py-4 font-semibold text-xs uppercase tracking-[0.25em] rounded-full transition-all duration-300 flex items-center justify-center gap-2 pointer-events-auto select-none mt-2 ${
                      isSelectedSizeOutOfStock
                        ? 'bg-white/5 border border-white/10 text-ivory/30 cursor-not-allowed'
                        : 'bg-gold text-[#080808] hover:bg-white hover:text-black shadow-[0_4px_16px_rgba(212,175,55,0.1)]'
                    }`}
                    data-cursor={isSelectedSizeOutOfStock ? "disabled" : "button"}
                  >
                    {isSelectedSizeOutOfStock ? (
                      <>Sold Out</>
                    ) : buyingId === prod.id ? (
                      <>
                        <Sparkles size={13} className="animate-pulse" />
                        Added to Bag
                      </>
                    ) : (
                      <>
                        Add to Bag
                        <ArrowRight size={13} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </section>
        );
      })}
    </div>
  );
}
