'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { type LucideIcon, Star, ArrowRight, Flame, Sparkles, Crown, LayoutGrid } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { TRANSLATIONS } from '@/utils/translations';

const PRODUCTS = [
  {
    id: 'white',
    nameKey: 'The Ivory Signature',
    price: 195,
    colorNameKey: 'Ivory White',
    taglineKey: 'Absolute Purity. Absolute Power.',
    badgeKey: 'bestSellerBadge',
    section: 'bestseller',
    rating: 4.9,
    reviews: 128,
    image: '/assets/shirt_white.png',
    accent: '#d4af37',
    gradient: 'from-[#171310] via-[#0b0a08] to-[#040404]',
  },
  {
    id: 'black',
    nameKey: 'The Onyx Statement',
    price: 220,
    colorNameKey: 'Jet Black',
    taglineKey: 'Quiet Authority. Loud Presence.',
    badgeKey: 'newArrivalBadge',
    section: 'newarrival',
    rating: 4.8,
    reviews: 94,
    image: '/assets/shirt_black.png',
    accent: '#c0c0c0',
    gradient: 'from-[#111111] via-[#090909] to-[#040404]',
  },
  {
    id: 'blue',
    nameKey: 'The Royal Ceremony',
    price: 210,
    colorNameKey: 'Royal Blue',
    taglineKey: 'Born For The Occasion.',
    badgeKey: 'limitedBadge',
    section: 'limited',
    rating: 5.0,
    reviews: 67,
    image: '/assets/shirt_blue.png',
    accent: '#4a7fc1',
    gradient: 'from-[#070b12] via-[#04060b] to-[#040404]',
  },
];

/* ── Compact card — same design across every section ───── */
function ProductCard({ product, idx }: { product: (typeof PRODUCTS)[0]; idx: number }) {
  const router = useRouter();
  const { formatPrice, country } = useAppContext();
  const isArabic = country === 'DUBAI';
  const t = isArabic ? TRANSLATIONS.ar : TRANSLATIONS.en;

  const getTranslatedProduct = () => {
    switch (product.id) {
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

  const details = getTranslatedProduct();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => router.push(`/collection/${product.id}`)}
      className="group cursor-pointer"
    >
      {/* Image Card */}
      <div className="relative overflow-hidden rounded-2xl aspect-[3/4]">
        <div
          className="absolute -inset-4 rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none z-0"
          style={{ background: `radial-gradient(circle, ${product.accent}, transparent 70%)` }}
        />
        <div className={`absolute inset-0 bg-gradient-to-b ${product.gradient}`} />

        {/* Badge */}
        <div className={`absolute top-5 ${isArabic ? 'right-5' : 'left-5'} z-10`}>
          <span
            className="px-3 py-1 text-[8px] uppercase tracking-[0.3em] font-sans border rounded-full bg-black/40 backdrop-blur-sm"
            style={{ borderColor: product.accent + '55', color: product.accent }}
          >
            {details.badge}
          </span>
        </div>

        {/* Index number watermark */}
        <div
          className={`absolute top-5 ${isArabic ? 'left-5' : 'right-5'} font-serif text-6xl font-bold leading-none select-none pointer-events-none z-10`}
          style={{ color: product.accent + '08', WebkitTextStroke: `1px ${product.accent}15` }}
        >
          0{idx + 1}
        </div>

        {/* Shirt Image */}
        <img
          src={product.image}
          alt={details.name}
          className="absolute inset-0 w-full h-full object-contain object-center p-8 transition-transform duration-700 group-hover:scale-105 mix-blend-luminosity opacity-90 z-10"
        />

        {/* Bottom info bar */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <div className={`flex items-end justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
            <div className={isArabic ? 'text-right' : 'text-left'}>
              <div className={`flex items-center gap-1.5 mb-1 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: product.accent }} />
                <span className="text-[9px] uppercase tracking-[0.3em] text-ivory/50 font-sans">{details.colorName}</span>
              </div>
              <div className={`flex items-center gap-1 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <Star size={9} className="text-gold fill-gold" />
                <span className="text-[9px] text-ivory/60 font-sans">{product.rating} ({product.reviews})</span>
              </div>
            </div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border opacity-0 group-hover:opacity-100 transition-all duration-500 ${isArabic ? 'rotate-180' : ''}`}
              style={{ borderColor: product.accent + '60', color: product.accent }}
            >
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* Caption */}
      <div className={`mt-4 px-1 ${isArabic ? 'text-right' : 'text-left'}`}>
        <h3 className="font-serif text-xl font-light text-white uppercase tracking-wide group-hover:text-gold transition-colors duration-300">
          {details.name}
        </h3>
        <div className={`flex items-center justify-between mt-1 ${isArabic ? 'flex-row-reverse' : ''}`}>
          <p className="font-serif italic text-sm text-ivory/40 font-light">{details.tagline}</p>
          <span className="font-serif text-lg font-light" style={{ color: product.accent }}>{formatPrice(product.price)}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Compact section heading ─────────────────────────────── */
function SectionHeading({
  icon: Icon,
  label,
  title,
  accent,
  isArabic,
}: {
  icon: LucideIcon;
  label: string;
  title: string;
  accent: string;
  isArabic: boolean;
}) {
  return (
    <div className={`flex items-center gap-4 mb-8 ${isArabic ? 'flex-row-reverse' : ''}`}>
      <Icon size={14} style={{ color: accent }} />
      <span className="text-[9px] uppercase tracking-[0.5em] font-sans" style={{ color: accent }}>
        {label}
      </span>
      <h2 className="font-serif text-xl font-light uppercase tracking-widest text-white">
        {title}
      </h2>
      <span className="flex-1 h-px" style={{ background: isArabic ? `linear-gradient(to left, ${accent}30, transparent)` : `linear-gradient(to right, ${accent}30, transparent)` }} />
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────── */
export default function CollectionPage() {
  const router = useRouter();
  const { country } = useAppContext();
  const isArabic = country === 'DUBAI';
  const t = isArabic ? TRANSLATIONS.ar : TRANSLATIONS.en;
  
  const [activeTab, setActiveTab] = useState<'all' | 'bestseller' | 'newarrival' | 'limited'>('all');

  const tabs = [
    { key: 'all',        label: t.filterAll,       icon: LayoutGrid, accent: '#888888' },
    { key: 'bestseller', label: t.filterBestSeller, icon: Flame,      accent: '#d4af37' },
    { key: 'newarrival', label: t.filterNewArrival, icon: Sparkles,   accent: '#c0c0c0' },
    { key: 'limited',    label: t.filterLimited,    icon: Crown,      accent: '#4a7fc1' },
  ] as const;

  const sections = [
    { key: 'bestseller', label: isArabic ? 'الأكثر عشقاً' : 'Most Loved',    title: t.filterBestSeller, icon: Flame,    accent: '#d4af37' },
    { key: 'newarrival', label: isArabic ? 'وصل حديثاً' : 'Just Landed',     title: t.filterNewArrival, icon: Sparkles, accent: '#c0c0c0' },
    { key: 'limited',    label: isArabic ? 'إصدار محدود' : 'Exclusive Drop', title: t.filterLimited,    icon: Crown,    accent: '#4a7fc1' },
  ] as const;

  return (
    <div className="min-h-screen bg-[#050505] text-ivory" dir={isArabic ? 'rtl' : 'ltr'}>

      {/* ── PAGE HEADER ───────────────────────────── */}
      <div className="pt-28 pb-12 px-6 md:px-16 border-b border-white/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          <p className={`text-[9px] uppercase tracking-[0.5em] text-gold font-sans mb-3 flex items-center gap-3 ${isArabic ? 'flex-row-reverse justify-start' : ''}`}>
            <span className="w-8 h-px bg-gold inline-block" /> {isArabic ? 'سجل التوقيعات ٢٠٢٦' : 'Signature Collection 2026'}
          </p>
          <h1 className={`font-serif text-4xl md:text-6xl font-light uppercase leading-tight tracking-wide text-white mb-4 ${isArabic ? 'text-right' : ''}`}>
            {isArabic ? 'المعرض الرقمي' : 'The Gallery'}
          </h1>
          <p className={`text-xs font-sans text-ivory/40 uppercase tracking-[0.25em] max-w-md leading-relaxed ${isArabic ? 'text-right' : ''}`}>
            {isArabic ? 'ثلاثة قمصان مميزة. كل قطعة تُصنع خصيصاً لك عند الطلب خلال ١٤ يوم عمل.' : 'Three signatures. Each made to order within 14 working days — crafted exclusively for you.'}
          </p>
        </motion.div>
      </div>

      {/* ── TAB NAV ───────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-[#050505]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className={`flex items-center gap-2 overflow-x-auto scrollbar-none py-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
            {tabs.map(({ key, label, icon: TabIcon, accent }) => {
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-[9px] uppercase tracking-[0.3em] font-sans whitespace-nowrap transition-all duration-300 ${
                    isActive
                      ? 'bg-gold text-[#050505] font-medium shadow-[0_0_16px_rgba(212,175,55,0.25)]'
                      : 'text-ivory/40 hover:text-ivory/70 border border-white/8 hover:border-white/20'
                  }`}
                >
                  <TabIcon size={10} style={isActive ? {} : { color: accent }} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── CONTENT ───────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-14 space-y-16">

        {/* Sectioned view — Best Sellers / New Arrivals / Limited */}
        {activeTab !== 'all' &&
          sections
            .filter((s) => s.key === activeTab)
            .map((sec) => {
              const items = PRODUCTS.filter((p) => p.section === sec.key);
              return (
                <section key={sec.key}>
                  <SectionHeading icon={sec.icon} label={sec.label} title={sec.title} accent={sec.accent} isArabic={isArabic} />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {items.map((product, idx) => (
                      <ProductCard key={product.id} product={product} idx={idx} />
                    ))}
                  </div>
                </section>
              );
            })}

        {/* All view — all sections stacked with headings */}
        {activeTab === 'all' && (
          <>
            {sections.map((sec) => {
              const items = PRODUCTS.filter((p) => p.section === sec.key);
              return (
                <section key={sec.key} className="border-b border-white/5 pb-14">
                  <SectionHeading icon={sec.icon} label={sec.label} title={sec.title} accent={sec.accent} isArabic={isArabic} />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {items.map((product, idx) => (
                      <ProductCard key={product.id} product={product} idx={idx} />
                    ))}
                  </div>
                </section>
              );
            })}

            {/* All products grid at the bottom */}
            <section>
              <SectionHeading icon={LayoutGrid} label={isArabic ? 'النطاق الكامل' : 'Complete Range'} title={isArabic ? 'كل القطع الفنية' : 'All Pieces'} accent="#888" isArabic={isArabic} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {PRODUCTS.map((product, idx) => (
                  <ProductCard key={product.id} product={product} idx={idx} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>

      {/* ── BOTTOM STRIP ──────────────────────────── */}
      <div className="border-t border-white/5 px-6 md:px-16 py-10">
        <div className={`max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 ${isArabic ? 'md:flex-row-reverse' : ''}`}>
          <p className="font-serif text-base md:text-lg font-light text-ivory/50 italic">
            {isArabic ? '"كل قميص يروي قصة. اجعل قصتك لا تُنسى."' : '"Every shirt tells a story. Make yours unforgettable."'}
          </p>
          <button
            onClick={() => router.push('/')}
            className={`text-[9px] uppercase tracking-[0.35em] text-gold hover:text-ivory transition-colors duration-300 font-sans flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}
          >
            {isArabic ? 'العودة للرئيسية' : 'Back to Home'} <ArrowRight size={10} className={isArabic ? 'rotate-180' : ''} />
          </button>
        </div>
      </div>
    </div>
  );
}
