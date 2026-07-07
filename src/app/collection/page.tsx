'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { type LucideIcon, Star, ArrowRight, Flame, Sparkles, Crown, LayoutGrid, Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useAppContext } from '@/context/AppContext';
import { TRANSLATIONS } from '@/utils/translations';
import AtelierBackground from '@/components/AtelierBackground';
import SignatureCollection from '@/components/SignatureCollection';
import CanvasContainer from '@/components/CanvasContainer';

interface CollectionProduct {
  id: string;
  name: string;
  price: number;
  colorName: string;
  tagline: string;
  badge?: string;
  section: string;
  rating: number;
  reviews: number;
  image: string;
  accent: string;
  gradient: string;
  story: string;
  atmosphere: string;
  fitInfo: string;
  careInfo: string;
  testimonial: string;
  accentColor: string;
  bgGradient: string;
}

/* ── Compact card — same design across every section ───── */
function ProductCard({ 
  product, 
  idx, 
  isSaved, 
  onSaveToggle 
}: { 
  product: CollectionProduct; 
  idx: number; 
  isSaved: boolean; 
  onSaveToggle: (e: React.MouseEvent) => void; 
}) {
  const router = useRouter();
  const { formatPrice, country } = useAppContext();
  const isArabic = country === 'DUBAI';
  const t = isArabic ? TRANSLATIONS.ar : TRANSLATIONS.en;

  const getTranslatedProduct = () => {
    switch (product.id) {
      case 'white':
        return {
          name: isArabic ? 'العضوية العاجية' : product.name,
          colorName: isArabic ? 'أبيض عاجي' : product.colorName,
          tagline: isArabic ? 'طهارة مطلقة. قوة كاملة.' : product.tagline,
          badge: t.bestSellerBadge,
        };
      case 'black':
        return {
          name: isArabic ? 'بيان أونيكس' : product.name,
          colorName: isArabic ? 'أسود حالك' : product.colorName,
          tagline: isArabic ? 'هيبة هادئة. حضور بارز.' : product.tagline,
          badge: t.newArrivalBadge,
        };
      case 'blue':
        return {
          name: isArabic ? 'المراسم الملكية' : product.name,
          colorName: isArabic ? 'أزرق ملكي' : product.colorName,
          tagline: isArabic ? 'وُلِد من أجل المناسبات العظيمة.' : product.tagline,
          badge: t.limitedBadge,
        };
      default:
        return {
          name: product.name,
          colorName: product.colorName,
          tagline: product.tagline,
          badge: product.badge || t.newArrivalBadge,
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
 
        {/* Wishlist Heart Button */}
        <div className={`absolute top-5 ${isArabic ? 'left-5' : 'right-5'} z-10`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSaveToggle(e);
            }}
            className="p-2 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-ivory hover:text-red-400 hover:border-red-500/20 transition-all duration-300"
          >
            <Heart size={12} fill={isSaved ? "red" : "none"} className={isSaved ? "text-red-500" : ""} />
          </button>
        </div>

        {/* Index number watermark moved inside to avoid overlapping heart */}
        <div
          className={`absolute bottom-16 ${isArabic ? 'left-5' : 'right-5'} font-serif text-6xl font-bold leading-none select-none pointer-events-none z-10`}
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
  const { country, addToCart, setCartOpen } = useAppContext();
  const isArabic = country === 'DUBAI';
  const t = isArabic ? TRANSLATIONS.ar : TRANSLATIONS.en;
  
  const [products, setProducts] = useState<CollectionProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedItemIds, setSavedItemIds] = useState<string[]>([]);
  const { data: session } = useSession();
  
  const [activeTab, setActiveTab] = useState<'all' | 'bestseller' | 'newarrival' | 'limited'>('all');
  
  // 3D Studio Mode State
  const [isStudioMode, setIsStudioMode] = useState(false);
  const [studioSection, setStudioSection] = useState('collection-white');
  const [studioFocusArea, setStudioFocusArea] = useState<'all' | 'collar' | 'sleeve' | 'button'>('all');

  useEffect(() => {
    if (session) {
      fetch('/api/saved-items')
        .then((res) => res.json())
        .then((data) => {
          setSavedItemIds(data.map((item: any) => item.productId));
        })
        .catch((err) => console.error('Error fetching saved items:', err));
    } else {
      setSavedItemIds([]);
    }
  }, [session]);

  const toggleSave = async (productId: string) => {
    if (!session) {
      router.push('/login');
      return;
    }

    const isSaved = savedItemIds.includes(productId);
    if (isSaved) {
      try {
        const res = await fetch(`/api/saved-items?productId=${productId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setSavedItemIds(savedItemIds.filter((id) => id !== productId));
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        const res = await fetch('/api/saved-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        });
        if (res.ok) {
          setSavedItemIds([...savedItemIds, productId]);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    let active = true;
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (active) {
          setProducts(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch products:', err);
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleBuy = (product: CollectionProduct, size: string) => {
    addToCart({
      id: `${product.id}-${size}`,
      name: product.name,
      price: product.price,
      size: size,
      colorName: product.colorName,
      image: product.id,
    });
    setCartOpen(true);
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-ivory flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative w-10 h-10 border-2 border-gold/10 border-t-gold rounded-full animate-spin" />
          <span className="text-[10px] uppercase tracking-[0.45em] text-gold font-sans font-semibold animate-pulse-slow">
            {isArabic ? 'تحميل المعرض التفاعلي...' : 'Curating 3D Studio...'}
          </span>
        </motion.div>
      </div>
    );
  }

  // Render 3D Studio experience
  if (isStudioMode) {
    return (
      <div className="relative min-h-screen bg-[#050505] text-ivory" dir={isArabic ? 'rtl' : 'ltr'}>
        {/* Exit Floating Button */}
        <div className={`fixed top-24 ${isArabic ? 'right-6 md:right-16' : 'left-6 md:left-16'} z-50`}>
          <button
            onClick={() => setIsStudioMode(false)}
            className="px-6 py-3 bg-[#080808]/80 backdrop-blur-md border border-white/10 hover:border-gold hover:text-gold text-white/90 rounded-full text-[9px] uppercase tracking-[0.2em] font-sans transition-all duration-300 flex items-center gap-2 shadow-2xl"
          >
            <LayoutGrid size={11} /> {isArabic ? 'الخروج من الاستوديو' : 'Exit 3D Studio'}
          </button>
        </div>

        {/* 3D WebGL Canvas Layer */}
        <CanvasContainer activeSection={studioSection} focusArea={studioFocusArea} />

        {/* Scroll spec details overlay */}
        <SignatureCollection
          products={products}
          onSectionChange={setStudioSection}
          onFocusAreaChange={setStudioFocusArea}
          onBuy={handleBuy}
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#050505] text-ivory" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Dynamic line weave backdrop in 2D gallery */}
      <AtelierBackground />

      {/* ── PAGE HEADER ───────────────────────────── */}
      <div className="relative z-10 pt-28 pb-12 px-6 md:px-16 border-b border-white/5 bg-black/20 backdrop-blur-[2px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className={isArabic ? 'text-right' : 'text-left'}>
            <p className={`text-[9px] uppercase tracking-[0.5em] text-gold font-sans mb-3 flex items-center gap-3 ${isArabic ? 'flex-row-reverse justify-start' : ''}`}>
              <span className="w-8 h-px bg-gold inline-block" /> {isArabic ? 'سجل التوقيعات ٢٠٢٦' : 'Signature Collection 2026'}
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-light uppercase leading-tight tracking-wide text-white mb-4">
              {isArabic ? 'المعرض الرقمي' : 'The Gallery'}
            </h1>
            <p className="text-xs font-sans text-ivory/40 uppercase tracking-[0.25em] max-w-md leading-relaxed">
              {isArabic ? 'قمصان مميزة. كل قطعة تُصنع خصيصاً لك عند الطلب خلال ١٤ يوم عمل.' : 'Premium signatures. Each made to order within 14 working days — crafted exclusively for you.'}
            </p>
          </div>

          {/* View Mode Toggle */}
          <button
            onClick={() => setIsStudioMode(true)}
            className="px-6 py-3 border border-gold/30 text-gold hover:bg-gold hover:text-black font-semibold text-[9px] uppercase tracking-[0.2em] rounded-full transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <Sparkles size={11} /> {isArabic ? 'استوديو تفاعلي ثلاثي الأبعاد' : 'Interactive 3D Studio'}
          </button>
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
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 py-14 space-y-16">

        {/* Sectioned view — Best Sellers / New Arrivals / Limited */}
        {activeTab !== 'all' &&
          sections
            .filter((s) => s.key === activeTab)
            .map((sec) => {
              const items = products.filter((p) => p.section === sec.key);
              return (
                <section key={sec.key}>
                  <SectionHeading icon={sec.icon} label={sec.label} title={sec.title} accent={sec.accent} isArabic={isArabic} />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {items.map((product, idx) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        idx={idx}
                        isSaved={savedItemIds.includes(product.id)}
                        onSaveToggle={() => toggleSave(product.id)}
                      />
                    ))}
                  </div>
                </section>
              );
            })}

        {/* All view — all sections stacked with headings */}
        {activeTab === 'all' && (
          <>
            {sections.map((sec) => {
              const items = products.filter((p) => p.section === sec.key);
              return (
                <section key={sec.key} className="border-b border-white/5 pb-14">
                  <SectionHeading icon={sec.icon} label={sec.label} title={sec.title} accent={sec.accent} isArabic={isArabic} />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {items.map((product, idx) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        idx={idx}
                        isSaved={savedItemIds.includes(product.id)}
                        onSaveToggle={() => toggleSave(product.id)}
                      />
                    ))}
                  </div>
                </section>
              );
            })}

            {/* All products grid at the bottom */}
            <section>
              <SectionHeading icon={LayoutGrid} label={isArabic ? 'النطاق الكامل' : 'Complete Range'} title={isArabic ? 'كل القطع الفنية' : 'All Pieces'} accent="#888" isArabic={isArabic} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {products.map((product, idx) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    idx={idx}
                    isSaved={savedItemIds.includes(product.id)}
                    onSaveToggle={() => toggleSave(product.id)}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </div>

      {/* ── BOTTOM STRIP ──────────────────────────── */}
      <div className="relative z-10 border-t border-white/5 px-6 md:px-16 py-10 bg-black/10">
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
