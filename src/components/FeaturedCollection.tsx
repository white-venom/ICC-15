'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowRight, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { TRANSLATIONS } from '@/utils/translations';

const FEATURED = [
  {
    id: 'white',
    nameKey: 'The Ivory Signature',
    price: 195,
    colorNameKey: 'Ivory White',
    taglineKey: 'Absolute Purity.',
    rating: 4.9,
    reviews: 128,
    badgeKey: 'bestSellerBadge',
    image: '/assets/shirt_white.png',
    accent: '#d4af37',
    bg: 'from-[#1a1410] to-[#0a0a08]',
  },
  {
    id: 'black',
    nameKey: 'The Onyx Statement',
    price: 220,
    colorNameKey: 'Jet Black',
    taglineKey: 'Quiet Authority.',
    rating: 4.8,
    reviews: 94,
    badgeKey: 'newArrivalBadge',
    image: '/assets/shirt_black.png',
    accent: '#c0c0c0',
    bg: 'from-[#111] to-[#060606]',
  },
  {
    id: 'blue',
    nameKey: 'The Royal Ceremony',
    price: 210,
    colorNameKey: 'Royal Blue',
    taglineKey: 'Born for the Occasion.',
    rating: 5.0,
    reviews: 67,
    badgeKey: 'limitedBadge',
    image: '/assets/shirt_blue.png',
    accent: '#4a7fc1',
    bg: 'from-[#070c14] to-[#040404]',
  },
];

export default function FeaturedCollection() {
  const router = useRouter();
  const { addToCart, setCartOpen, formatPrice, country } = useAppContext();
  const isArabic = country === 'DUBAI';
  const t = isArabic ? TRANSLATIONS.ar : TRANSLATIONS.en;

  const handleQuickAdd = (p: typeof FEATURED[0]) => {
    const colorName = isArabic ? (p.colorNameKey === 'Jet Black' ? 'أسود حالك' : p.colorNameKey === 'Royal Blue' ? 'أزرق ملكي' : 'أبيض عاجي') : p.colorNameKey;
    const name = isArabic ? (p.nameKey.includes('White') || p.nameKey.includes('Ivory') ? 'العضوية العاجية' : p.nameKey.includes('Onyx') ? 'بيان أونيكس' : 'المراسم الملكية') : p.nameKey;

    addToCart({
      id: `${p.id}-40`,
      name,
      price: p.price,
      size: '40',
      colorName,
      image: p.id,
    });
    setCartOpen(true);
  };

  const getTranslatedProduct = (p: typeof FEATURED[0]) => {
    switch (p.id) {
      case 'white':
        return {
          name: isArabic ? 'العضوية العاجية' : 'The Ivory Signature',
          colorName: isArabic ? 'أبيض عاجي' : 'Ivory White',
          tagline: isArabic ? 'طهارة مطلقة. قوة كاملة.' : 'Absolute Purity. Absolute Power.',
          badge: t.bestSellerBadge,
        };
      case 'black':
        return {
          name: isArabic ? 'بيان أونيكس' : 'The Onyx Statement',
          colorName: isArabic ? 'أسود حالك' : 'Jet Black',
          tagline: isArabic ? 'هيبة هادئة. حضور بارز.' : 'Quiet Authority. Loud Presence.',
          badge: t.newArrivalBadge,
        };
      case 'blue':
      default:
        return {
          name: isArabic ? 'المراسم الملكية' : 'The Royal Ceremony',
          colorName: isArabic ? 'أزرق ملكي' : 'Royal Blue',
          tagline: isArabic ? 'وُلِد من أجل المناسبات العظيمة.' : 'Born For The Occasion.',
          badge: t.limitedBadge,
        };
    }
  };

  return (
    <section dir={isArabic ? 'rtl' : 'ltr'} className="relative min-h-screen w-full flex flex-col justify-center py-16 px-6 md:px-16 bg-[#050505] border-t border-white/5 overflow-hidden">
      {/* Background soft lighting grid */}
      <div className="absolute inset-0 opacity-[0.01] bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full flex flex-col justify-between">
        {/* Header */}
        <div className={`flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10 w-full ${isArabic ? 'md:flex-row-reverse' : ''}`}>
          <div className={isArabic ? 'text-right' : 'text-left'}>
            <div className={`flex items-center gap-3 mb-2 ${isArabic ? 'justify-start' : ''}`}>
              {!isArabic && <div className="w-6 h-px bg-gold" />}
              <span className="text-[10px] uppercase tracking-[0.5em] text-gold font-sans">{t.featEyebrow}</span>
              {isArabic && <div className="w-6 h-px bg-gold" />}
            </div>
            <h2 className="font-serif text-3xl md:text-5xl font-light uppercase leading-none tracking-tight">
              {isArabic ? 'المجموعة' : 'Featured'}<br />
              <span className="text-stroke-gold italic font-normal">{isArabic ? 'المميزة' : 'Collection'}</span>
            </h2>
          </div>
          <button
            onClick={() => router.push('/collection')}
            className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-ivory/40 hover:text-gold transition-colors duration-300 font-sans group py-1 border-b border-transparent hover:border-gold/30 ${isArabic ? 'flex-row-reverse' : ''}`}
          >
            {isArabic ? 'استكشف المجموعة كاملة' : 'Explore Full Line'}
            <ArrowRight size={12} className={`transition-transform duration-300 ${isArabic ? 'group-hover:-translate-x-1 rotate-180' : 'group-hover:translate-x-1'}`} />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-stretch">
          {FEATURED.map((product, idx) => {
            const details = getTranslatedProduct(product);
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.8, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="group relative rounded-xl overflow-hidden border border-white/5 hover:border-white/10 hover:shadow-2xl hover:shadow-black transition-all duration-500 cursor-pointer flex flex-col bg-[#060606]"
                onClick={() => router.push('/collection')}
              >
                {/* Image area */}
                <div className={`relative h-[36vh] min-h-[220px] max-h-[380px] bg-gradient-to-b ${product.bg} overflow-hidden w-full flex items-center justify-center`}>
                  {/* Badge */}
                  <div className={`absolute top-4 ${isArabic ? 'right-4' : 'left-4'} z-10`}>
                    <span
                      className="px-2.5 py-1 text-[8px] uppercase tracking-[0.3em] font-sans border rounded-full bg-black/40 backdrop-blur-sm"
                      style={{ borderColor: product.accent + '50', color: product.accent }}
                    >
                      {details.badge}
                    </span>
                  </div>

                  {/* Image */}
                  <img
                    src={product.image}
                    alt={details.name}
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
                      <ShoppingBag size={11} /> {isArabic ? 'إضافة سريعة (مقاس ٤٠)' : 'Quick Add (Size 40)'}
                    </button>
                  </div>
                </div>

                {/* Card Footer Info */}
                <div className="p-5 flex-grow flex flex-col justify-between border-t border-white/[0.02]">
                  <div className={isArabic ? 'text-right' : 'text-left'}>
                    <div className={`flex items-center justify-between mb-1.5 ${isArabic ? 'flex-row-reverse' : ''}`}>
                      <span className="text-[8px] uppercase tracking-[0.4em] text-ivory/30 font-sans">{details.colorName}</span>
                      <span className="font-serif text-lg text-gold font-light">{formatPrice(product.price)}</span>
                    </div>
                    <h3 className="font-serif text-lg font-light text-ivory leading-tight group-hover:text-gold transition-colors duration-300">{details.name}</h3>
                    <p className="font-serif italic text-xs font-light mt-0.5 text-ivory/55">
                      {details.tagline}
                    </p>
                  </div>

                  {/* Reviews / Stars */}
                  <div className={`flex items-center gap-2 mt-4 pt-3 border-t border-white/[0.03] ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={9} className={i < Math.floor(product.rating) ? 'text-gold fill-gold' : 'text-white/15'} />
                      ))}
                    </div>
                    <span className="text-[9px] text-ivory/35 font-sans">{product.rating} ({product.reviews} {t.reviewCount})</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
