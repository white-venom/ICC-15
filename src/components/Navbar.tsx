'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Menu, X, ChevronDown, User, Heart, Truck, LogOut, Settings, CheckCircle2, Circle, Edit3, Lock, Trophy } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { TRANSLATIONS } from '@/utils/translations';
import { useSession, signOut } from 'next-auth/react';
import PRODUCTS from '@/utils/products.json';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
}

const NAV_LEFT  = ['Home', 'Collection', 'Craftsmanship', 'Journal'];
const NAV_RIGHT: string[] = [];

export default function Navbar({ cartCount, onCartClick }: NavbarProps) {
  const router = useRouter();
  const [scrolled, setScrolled]         = useState(false);
  const [logoError, setLogoError]       = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [logoHovered, setLogoHovered]   = useState(false);
  const [countryOpen, setCountryOpen]   = useState(false);
  const { country, setCountry, addToCart, formatPrice } = useAppContext();
  const { data: session }               = useSession();
  
  // Profile dropdown and modal states
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeModal, setActiveModal] = useState<'profile' | 'history' | 'benefits' | null>(null);
  const [profileData, setProfileData]   = useState<any>(null);
  const [editName, setEditName]         = useState('');
  const [updating, setUpdating]         = useState(false);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);

  useEffect(() => {
    if (session) {
      fetchProfileData();
    } else {
      setProfileData(null);
      setWishlistItems([]);
    }
  }, [session]);

  const fetchProfileData = async () => {
    try {
      const res = await fetch('/api/user/profile');
      if (res.ok) {
        const data = await res.json();
        setProfileData(data);
        setEditName(data.name || '');
        
        // Map saved product IDs to full product objects
        const saved = PRODUCTS.filter(p => 
          data.savedItems.some((item: any) => item.productId === p.id)
        );
        setWishlistItems(saved);
      }
    } catch (e) {
      console.error("Error fetching profile details:", e);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      // Create a simple endpoint or handle updating name in registration api (we can make a quick PATCH /api/user/profile)
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName })
      });
      if (res.ok) {
        fetchProfileData();
        alert('Profile updated successfully.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  const removeSavedItem = async (productId: string) => {
    try {
      const res = await fetch(`/api/saved-items?productId=${productId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setWishlistItems(wishlistItems.filter(p => p.id !== productId));
        if (profileData) {
          setProfileData({
            ...profileData,
            savedItems: profileData.savedItems.filter((i: any) => i.productId !== productId)
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const buySavedItem = (productId: string) => {
    const product = PRODUCTS.find(p => p.id === productId);
    if (product) {
      addToCart({
        id: `${product.id}-40`,
        name: product.name,
        price: product.price,
        size: "40",
        colorName: product.colorName,
        image: product.image
      });
      setShowDropdown(false);
      setActiveModal(null);
      router.push('/checkout');
    }
  };

  const isArabic = country === 'DUBAI';
  const t = isArabic ? TRANSLATIONS.ar : TRANSLATIONS.en;

  const getTranslatedItem = (item: string) => {
    switch (item.toLowerCase()) {
      case 'home': return t.navHome;
      case 'collection': return t.navCollection;
      case 'craftsmanship': return t.navCraftsmanship;
      case 'journal': return t.navJournal;
      default: return item;
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (path: string) => {
    setMobileOpen(false);
    if (path.toLowerCase() === 'home' || path.toLowerCase() === 'hero') {
      router.push('/');
    } else {
      router.push(`/${path.toLowerCase()}`);
    }
  };

  const linkCls =
    'relative text-xs uppercase tracking-[0.3em] font-sans text-white/60 hover:text-white transition-colors duration-300 pb-0.5 group';

  const underline = (
    <span className="absolute bottom-0 left-0 w-0 group-hover:w-full h-px bg-gold transition-all duration-300 ease-out" />
  );

  return (
    <>
      {/* ─── SINGLE NAVBAR ─────────────────────── */}
      <header
        dir={isArabic ? 'rtl' : 'ltr'}
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16 pointer-events-auto transition-all duration-300 border-b ${
          scrolled 
            ? 'h-14 bg-black/70 backdrop-blur-md border-white/[0.06] shadow-lg' 
            : 'h-24 bg-transparent border-transparent'
        }`}
      >
        {/* Logo + name (slim) */}
        <div
          className={`flex items-center gap-4 cursor-pointer group ${isArabic ? 'flex-row-reverse' : ''}`}
          onClick={() => go('hero')}
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
        >
          <div className="relative w-16 h-16 overflow-hidden drop-shadow-[0_0_6px_rgba(255,255,255,0.3)] transition-transform duration-300 group-hover:scale-105">
            {!logoError ? (
              <>
                <Image src="/assets/logo/logobg.png" alt="Ink & Cotton Club" fill className="object-contain brightness-0 invert" onError={() => setLogoError(true)} unoptimized />
                <AnimatePresence>
                  {logoHovered && (
                    <motion.div initial={{ left: '-100%' }} animate={{ left: '200%' }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, ease: 'easeInOut' }}
                      className="absolute top-0 bottom-0 w-4 bg-gradient-to-r from-transparent via-white/80 to-transparent -skew-x-12 pointer-events-none z-20" />
                  )}
                </AnimatePresence>
              </>
            ) : (
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-white relative z-10">
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
                <path d="M42 35C42 35 34 39 34 50C34 61 42 65 42 65M58 35C58 35 50 39 50 50C50 61 58 65 58 65M50 30L50 70" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
          </div>
          <div className="flex flex-col items-center leading-none">
            <span className="font-serif tracking-[0.2em] text-sm uppercase text-white group-hover:text-gold transition-colors duration-300">{t.navTitle}</span>
            <span className="font-sans tracking-[0.3em] text-[8px] font-bold uppercase text-gold/70 mt-1">{t.navSubtitle}</span>
          </div>
        </div>

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-10">
          {[...NAV_LEFT, ...NAV_RIGHT].map((item) => (
            <button key={item} onClick={() => go(item.toLowerCase())} className={linkCls} data-cursor="button">
              {getTranslatedItem(item)}{underline}
            </button>
          ))}
        </nav>

        {/* Right CTA */}
        <div className={`flex items-center gap-6 ${isArabic ? 'flex-row-reverse' : ''}`}>
          {/* Country Selector */}
          <div className="relative hidden sm:block">
            <button 
              onClick={() => setCountryOpen(!countryOpen)} 
              className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-white/70 hover:text-white transition-colors duration-300"
            >
              {country} <ChevronDown size={12} className={`transition-transform duration-300 ${countryOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {countryOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: 10 }}
                  className={`absolute top-full mt-6 w-28 bg-[#080808] border border-white/10 rounded-sm flex flex-col overflow-hidden shadow-2xl ${isArabic ? 'left-0' : 'right-0'}`}
                >
                  {['DUBAI', 'INDIA', 'UK', 'US'].map((c) => (
                    <button 
                      key={c}
                      onClick={() => { setCountry(c); setCountryOpen(false); }}
                      className={`text-[10px] uppercase tracking-widest px-4 py-3 hover:bg-white/5 transition-colors duration-200 ${isArabic ? 'text-right' : 'text-left'} ${country === c ? 'text-gold' : 'text-white/70'}`}
                    >
                      {c}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button onClick={() => go('collection')} className="hidden sm:block px-5 py-2 text-[11px] uppercase tracking-[0.25em] border border-gold/40 text-gold hover:bg-gold hover:text-black font-semibold transition-all duration-300 rounded-sm">
            {t.navOrderNow}
          </button>
          <button onClick={onCartClick} className="relative text-white/70 hover:text-gold transition-colors duration-300">
            <ShoppingBag size={18} />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gold text-black text-[8px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          {/* Profile / Auth Button with dropdown trigger */}
          <div className="relative">
            <button 
              onClick={() => {
                if (session) {
                  setShowDropdown(!showDropdown);
                } else {
                  router.push('/login');
                }
              }} 
              className={`relative transition-colors duration-300 ${showDropdown ? 'text-gold' : 'text-white/70 hover:text-gold'}`}
            >
              <User size={18} />
            </button>

            {/* SMALL BOX: Floating Profile Card */}
            <AnimatePresence>
              {showDropdown && profileData && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className={`absolute top-full mt-4 w-80 bg-[#0c0c0c]/98 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl z-50 flex flex-col gap-4 ${isArabic ? 'left-0' : 'right-0'}`}
                >
                  {/* Card holder info */}
                  <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse text-right' : 'text-left'}`}>
                    <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-serif text-sm font-semibold">
                      {profileData.name ? profileData.name[0].toUpperCase() : 'M'}
                    </div>
                    <div>
                      <p className="font-serif text-sm text-white uppercase tracking-wider">{profileData.name || 'Member'}</p>
                      <p className="text-[8px] text-gold tracking-widest uppercase font-bold">
                        {profileData.tier && profileData.tier !== 'None' ? `${profileData.tier} Tier` : 'Pending Activation'}
                      </p>
                    </div>
                  </div>

                  {/* MINI CARD */}
                  {profileData.tier && profileData.tier !== 'None' ? (
                    <div className="relative aspect-[1.586/1] w-full rounded-2xl p-5 overflow-hidden border border-white/10 flex flex-col justify-between shadow-lg">
                      {profileData.tier === 'Gold' ? (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#3b2b16]/70 via-[#18130b] to-[#070503]" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#282d36]/70 via-[#13151b] to-[#050608]" />
                      )}
                      <div className="relative flex justify-between">
                        <span className="text-[8px] tracking-[0.25em] font-sans text-white/80 font-bold">ICC CLUB MEMBER</span>
                        <span className="text-[8px] tracking-[0.25em] font-sans text-gold uppercase font-bold">{profileData.tier}</span>
                      </div>
                      <div className="relative text-left">
                        <span className="text-[8px] text-white/40 tracking-widest uppercase block mb-0.5">Member ID</span>
                        <span className="font-mono text-sm tracking-wider text-white">ICC-{profileData.id.slice(-6).toUpperCase()}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative aspect-[1.586/1] w-full rounded-2xl p-5 overflow-hidden border border-gold/15 flex flex-col items-center justify-center text-center bg-gradient-to-br from-[#1c160c]/40 via-[#0e0b06]/80 to-[#070503]/90 shadow-inner">
                      <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold mb-2.5">
                        <Lock size={16} />
                      </div>
                      <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-gold mb-1">Membership Card Locked</p>
                      <p className="text-[9px] text-white/60 max-w-[210px] leading-relaxed">Your digital member card will be activated once assigned by the administrator.</p>
                    </div>
                  )}

                  {/* QUICK ACTIVE ORDER */}
                  {(() => {
                    const displayOrders = profileData.orders && profileData.orders.length > 0 
                      ? profileData.orders 
                      : [{ trackingNumber: "ICC-849204", status: "Shipped" }];
                    const activeOrder = displayOrders[0];
                    return (
                      <div className="bg-[#141414] border border-white/10 rounded-2xl p-4 text-left shadow-sm flex flex-col gap-2.5">
                        <div className="flex justify-between items-center text-[9px] uppercase tracking-widest text-white/50">
                          <span>Active Order</span>
                          <span className={`px-2.5 py-0.5 text-[8px] font-bold rounded-full border ${
                            activeOrder.status === 'Delivered' 
                              ? 'border-green-500/20 bg-green-500/5 text-green-400' 
                              : 'border-gold/25 bg-gold/5 text-gold'
                          }`}>
                            {activeOrder.status}
                          </span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[7px] text-white/35 uppercase tracking-widest">Order ID</span>
                          <p className="font-mono text-[9px] text-white/90 tracking-widest truncate">{activeOrder.trackingNumber}</p>
                        </div>
                        <a
                          href={`https://wa.me/919917128864?text=Hello,%20I'd%20like%20to%20track%20my%20order%20${activeOrder.trackingNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 bg-gold hover:bg-white text-black text-[9px] font-bold uppercase tracking-widest rounded-xl flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer shadow-md"
                        >
                          <Truck size={11} /> Track Order
                        </a>
                      </div>
                    );
                  })()}

                  {/* QUICK LINKS */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        setActiveModal('history');
                      }}
                      className="py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[9px] uppercase tracking-widest font-bold flex items-center justify-center gap-1.5 transition-all border border-white/10 cursor-pointer"
                    >
                      <ShoppingBag size={11} className="text-gold" /> History
                    </button>
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        setActiveModal('benefits');
                      }}
                      className="py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[9px] uppercase tracking-widest font-bold flex items-center justify-center gap-1.5 transition-all border border-white/10 cursor-pointer"
                    >
                      <Trophy size={11} className="text-gold" /> Benefits
                    </button>
                  </div>

                  {/* SETTINGS / LOG OUT */}
                  <div className="grid grid-cols-2 gap-2.5 mt-0.5">
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        setActiveModal('profile');
                      }}
                      className="py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[9px] uppercase tracking-widest font-bold flex items-center justify-center gap-1.5 transition-all border border-white/10 cursor-pointer"
                    >
                      <Settings size={11} /> Profile
                    </button>
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        signOut({ callbackUrl: '/' });
                      }}
                      className="py-2.5 bg-red-950/15 hover:bg-red-950/35 text-red-400 border border-red-500/20 rounded-xl text-[9px] uppercase tracking-widest font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <LogOut size={11} /> Log Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white/70 hover:text-gold transition-colors duration-300">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* ─── Mobile Menu Panel ─────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-4 right-4 bg-[#080808]/95 backdrop-blur-xl border border-white/10 rounded-2xl z-40 p-8 flex flex-col items-center gap-5 shadow-2xl md:hidden"
          >
            {[...NAV_LEFT, ...NAV_RIGHT].map((item) => (
              <button key={item} onClick={() => go(item.toLowerCase())}
                className="text-[11px] uppercase tracking-[0.25em] font-sans text-white/70 hover:text-gold py-2 w-full text-center border-b border-white/[0.04] transition-colors duration-300">
                {getTranslatedItem(item)}
              </button>
            ))}
            <button onClick={() => go('collection')}
              className="w-full py-3 text-center text-[10px] uppercase tracking-[0.25em] bg-gold text-black font-semibold rounded-sm hover:bg-white transition-colors duration-300">
              {t.navOrderNow}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {/* BIG BOX: Center Profile Details & Edit Modal */}
      <AnimatePresence>
        {activeModal && profileData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0c0c0c] border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-3xl max-h-[85vh] overflow-y-auto relative text-left shadow-2xl space-y-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              {/* MODAL 1: PROFILE SETTINGS */}
              {activeModal === 'profile' && (
                <>
                  <div className="border-b border-white/5 pb-4">
                    <h3 className="font-serif text-2xl uppercase tracking-wider text-white">Atelier Member Profile</h3>
                    <p className="text-[10px] text-gold tracking-widest uppercase mt-1">ICC-{profileData.id.slice(-6).toUpperCase()} • {profileData.tier && profileData.tier !== 'None' ? `${profileData.tier} Tier` : 'Pending Activation'}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Edit Details */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] uppercase tracking-widest text-white/50 font-bold border-b border-white/5 pb-2">Personal Settings</h4>
                      <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] uppercase tracking-widest text-ivory/40">Full Name</label>
                          <input
                            type="text"
                            required
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full bg-[#1b1b1b] border border-white/5 focus:border-gold/50 rounded-xl px-4 py-3 text-ivory focus:outline-none transition-colors text-xs"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] uppercase tracking-widest text-ivory/40 font-semibold">Email Address</label>
                          <input
                            type="email"
                            disabled
                            value={profileData.email}
                            className="w-full bg-[#161616] border border-white/5 opacity-50 rounded-xl px-4 py-3 text-ivory/60 text-xs focus:outline-none"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={updating}
                          className="w-full py-3 bg-gold text-[#050505] font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-white transition-colors flex justify-center items-center gap-2 cursor-pointer"
                        >
                          {updating ? 'Updating...' : 'Save Changes'}
                        </button>
                      </form>
                    </div>

                    {/* Right Column: Wishlist / Saved Items */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] uppercase tracking-widest text-white/50 font-bold border-b border-white/5 pb-2">Saved Wishlist</h4>
                      
                      {wishlistItems.length === 0 ? (
                        <p className="text-xs text-ivory/30 italic">No saved items found. Browse our gallery to add pieces to your wishlist.</p>
                      ) : (
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                          {wishlistItems.map((product) => (
                            <div key={product.id} className="flex justify-between items-center bg-white/[0.02] border border-white/5 rounded-xl p-3">
                              <div className="flex items-center gap-3">
                                <img src={product.image} alt={product.name} className="w-12 h-12 object-contain mix-blend-luminosity animate-pulse-slow" />
                                <div>
                                  <p className="text-xs font-serif text-white font-semibold">{product.name}</p>
                                  <p className="text-[9px] text-gold">{formatPrice(product.price)}</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => buySavedItem(product.id)}
                                  className="px-3 py-1.5 bg-gold text-[#050505] text-[8px] uppercase tracking-widest font-bold rounded-lg hover:bg-white transition-colors cursor-pointer"
                                >
                                  Buy
                                </button>
                                <button
                                  onClick={() => removeSavedItem(product.id)}
                                  className="p-1.5 hover:text-red-400 text-white/40 transition-colors cursor-pointer"
                                >
                                  <Heart size={14} fill="red" className="text-red-500" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* MODAL 2: ORDER HISTORY */}
              {activeModal === 'history' && (
                <>
                  <div className="border-b border-white/5 pb-4">
                    <h3 className="font-serif text-2xl uppercase tracking-wider text-white">Atelier Order History</h3>
                    <p className="text-[10px] text-gold tracking-widest uppercase mt-1">Track status and review past purchases</p>
                  </div>

                  {/* ACTIVE ORDER TRACKING PROGRESS BAR (Visual Steps) */}
                  {(() => {
                    const activeOrders = profileData.orders && profileData.orders.length > 0 
                      ? profileData.orders 
                      : [
                          {
                            id: "mock-active",
                            trackingNumber: "ICC-849204",
                            totalPrice: 220,
                            status: "Shipped",
                            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                            items: JSON.stringify([
                              {
                                id: "black-40",
                                name: "The Onyx Statement",
                                quantity: 1,
                                price: 220,
                                colorName: "Jet Black"
                              }
                            ])
                          }
                        ];
                    const active = activeOrders.find((o: any) => o.status === 'Processing' || o.status === 'Shipped');
                    
                    if (!active) return null;
                    
                    return (
                      <div className="bg-[#141414] border border-white/10 rounded-2xl p-5 space-y-5">
                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                          <div>
                            <span className="text-[8px] uppercase tracking-widest text-ivory/40">Current Order Tracking</span>
                            <h4 className="font-mono text-xs text-gold tracking-widest mt-0.5">{active.trackingNumber}</h4>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-[8px] uppercase tracking-widest font-semibold">
                            Status: {active.status}
                          </span>
                        </div>

                        {/* Progress Steps */}
                        <div className="grid grid-cols-3 relative py-2">
                          <div className="absolute top-5 left-[16.6%] right-[16.6%] h-0.5 bg-white/10" />
                          
                          <div className="flex flex-col items-center text-center relative z-10">
                            <CheckCircle2 className="w-6 h-6 text-gold bg-[#0c0c0c] rounded-full p-0.5" />
                            <span className="text-[8px] uppercase tracking-widest mt-1.5 font-bold text-white">Processing</span>
                          </div>

                          <div className="flex flex-col items-center text-center relative z-10">
                            {active.status === 'Shipped' || active.status === 'Delivered' ? (
                              <CheckCircle2 className="w-6 h-6 text-gold bg-[#0c0c0c] rounded-full p-0.5" />
                            ) : (
                              <Circle className="w-6 h-6 text-ivory/20 bg-[#0c0c0c] rounded-full p-1" />
                            )}
                            <span className={`text-[8px] uppercase tracking-widest mt-1.5 ${active.status !== 'Processing' ? 'text-white font-bold' : 'text-ivory/30'}`}>Shipped</span>
                          </div>

                          <div className="flex flex-col items-center text-center relative z-10">
                            {active.status === 'Delivered' ? (
                              <CheckCircle2 className="w-6 h-6 text-gold bg-[#0c0c0c] rounded-full p-0.5" />
                            ) : (
                              <Circle className="w-6 h-6 text-ivory/20 bg-[#0c0c0c] rounded-full p-1" />
                            )}
                            <span className={`text-[8px] uppercase tracking-widest mt-1.5 ${active.status === 'Delivered' ? 'text-white font-bold' : 'text-ivory/30'}`}>Delivered</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2 text-[9px] text-ivory/40">
                          <span>Order Placed: {new Date(active.createdAt).toLocaleDateString()}</span>
                          <a
                            href={`https://wa.me/919917128864?text=Hello,%20I'd%20like%20to%20track%20my%20order%20${active.trackingNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gold hover:underline uppercase tracking-widest font-semibold"
                          >
                            Track via WhatsApp →
                          </a>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="space-y-3 pt-2">
                    <h4 className="text-[10px] uppercase tracking-widest text-white/50 font-bold border-b border-white/5 pb-2">Order History</h4>
                    
                    {(() => {
                      const displayOrders = profileData.orders && profileData.orders.length > 0 
                        ? profileData.orders 
                        : [
                            {
                              id: "mock-past",
                              trackingNumber: "ICC-849204",
                              totalPrice: 220,
                              status: "Shipped",
                              createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                              items: JSON.stringify([
                                {
                                  id: "black-40",
                                  name: "The Onyx Statement",
                                  quantity: 1,
                                  price: 220,
                                  colorName: "Jet Black"
                                }
                              ])
                            }
                          ];

                      return (
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                          {displayOrders.map((order: any) => {
                            const orderItems = JSON.parse(order.items || '[]');
                            return (
                              <div key={order.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/[0.01] border border-white/5 rounded-xl p-4 gap-2 hover:border-white/10 transition-colors">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-[10px] text-white tracking-widest">{order.trackingNumber}</span>
                                    <span className="text-[9px] text-ivory/40">|</span>
                                    <span className="text-[9px] text-ivory/40">{new Date(order.createdAt).toLocaleDateString()}</span>
                                  </div>
                                  <div className="mt-1 space-y-0.5">
                                    {orderItems.map((item: any, idx: number) => (
                                      <p key={idx} className="text-[10px] text-ivory/60">
                                        {item.quantity}x {item.name} ({item.colorName})
                                      </p>
                                    ))}
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="font-serif text-xs text-gold">{formatPrice(order.totalPrice)}</span>
                                  <span className={`text-[8px] uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${order.status === 'Delivered' ? 'border-green-500/20 bg-green-500/5 text-green-400' : 'border-gold/20 bg-gold/5 text-gold'}`}>
                                    {order.status}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                </>
              )}

              {/* MODAL 3: CARD BENEFITS */}
              {activeModal === 'benefits' && (
                <>
                  <div className="border-b border-white/5 pb-4">
                    <h3 className="font-serif text-2xl uppercase tracking-wider text-white">Membership Privileges</h3>
                    <p className="text-[10px] text-gold tracking-widest uppercase mt-1">Unlock tailored club access and reward tiers</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Left: Card View */}
                    <div className="flex flex-col items-center gap-4">
                      {profileData.tier && profileData.tier !== 'None' ? (
                        <div className="relative aspect-[1.586/1] w-full max-w-[340px] rounded-2xl p-5 overflow-hidden border border-white/10 flex flex-col justify-between shadow-xl">
                          {profileData.tier === 'Gold' ? (
                            <div className="absolute inset-0 bg-gradient-to-br from-[#3b2b16]/70 via-[#18130b] to-[#070503]" />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-[#282d36]/70 via-[#13151b] to-[#050608]" />
                          )}
                          <div className="relative flex justify-between">
                            <span className="text-[8px] tracking-[0.25em] font-sans text-white/80 font-bold">ICC CLUB MEMBER</span>
                            <span className="text-[8px] tracking-[0.25em] font-sans text-gold uppercase font-bold">{profileData.tier}</span>
                          </div>
                          <div className="relative text-left">
                            <span className="text-[8px] text-white/40 tracking-widest uppercase block mb-0.5">Member ID</span>
                            <span className="font-mono text-sm tracking-wider text-white">ICC-{profileData.id.slice(-6).toUpperCase()}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="relative aspect-[1.586/1] w-full max-w-[340px] rounded-2xl p-5 overflow-hidden border border-gold/15 flex flex-col items-center justify-center text-center bg-gradient-to-br from-[#1c160c]/40 via-[#0e0b06]/80 to-[#070503]/90 shadow-inner">
                          <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold mb-2.5">
                            <Lock size={16} />
                          </div>
                          <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-gold mb-1">Membership Card Locked</p>
                          <p className="text-[9px] text-white/60 max-w-[210px] leading-relaxed">Your digital member card will be activated once assigned by the administrator.</p>
                        </div>
                      )}
                      <p className="text-[10px] text-ivory/50 uppercase tracking-wider text-center">
                        Current Level: <span className="text-gold font-bold">{profileData.tier || 'None'}</span>
                      </p>
                    </div>

                    {/* Right: Benefits details */}
                    <div className="space-y-4">
                      <h4 className="text-[11px] uppercase tracking-widest text-white/50 font-bold border-b border-white/5 pb-2">
                        {profileData.tier === 'Gold' ? 'Gold Tier Benefits' : profileData.tier === 'Silver' ? 'Silver Tier Benefits' : 'How to Unlock Membership'}
                      </h4>

                      {profileData.tier === 'Gold' ? (
                        <ul className="space-y-3 font-sans text-xs text-ivory/80">
                          <li className="flex gap-2.5 items-start">
                            <span className="text-gold mt-0.5">✔</span>
                            <span><strong>10% Lifetime Reward Credits</strong> on all purchases.</span>
                          </li>
                          <li className="flex gap-2.5 items-start">
                            <span className="text-gold mt-0.5">✔</span>
                            <span><strong>Dedicated Personal Atelier Assistant</strong> via direct WhatsApp line.</span>
                          </li>
                          <li className="flex gap-2.5 items-start">
                            <span className="text-gold mt-0.5">✔</span>
                            <span><strong>Private Trunk Shows:</strong> Exclusive invitations to local events and previews.</span>
                          </li>
                          <li className="flex gap-2.5 items-start">
                            <span className="text-gold mt-0.5">✔</span>
                            <span><strong>Complimentary Alterations:</strong> Lifetime tailoring and custom-fit care.</span>
                          </li>
                          <li className="flex gap-2.5 items-start">
                            <span className="text-gold mt-0.5">✔</span>
                            <span><strong>Express Delivery:</strong> Free worldwide priority shipping and returns.</span>
                          </li>
                        </ul>
                      ) : profileData.tier === 'Silver' ? (
                        <ul className="space-y-3 font-sans text-xs text-ivory/80">
                          <li className="flex gap-2.5 items-start">
                            <span className="text-gold mt-0.5">✔</span>
                            <span><strong>5% Lifetime Reward Credits</strong> on all purchases.</span>
                          </li>
                          <li className="flex gap-2.5 items-start">
                            <span className="text-gold mt-0.5">✔</span>
                            <span><strong>24-Hour Early Access</strong> to micro-capsule collection releases.</span>
                          </li>
                          <li className="flex gap-2.5 items-start">
                            <span className="text-gold mt-0.5">✔</span>
                            <span>Upgrade to <strong>Gold</strong> by reaching a spend milestone of ₹30,000 / $300.</span>
                          </li>
                        </ul>
                      ) : (
                        <div className="space-y-3 text-xs text-ivory/70 leading-relaxed">
                          <p>
                            Your membership status is currently in the queue. Memberships are unlocked automatically as you complete shop purchases:
                          </p>
                          <div className="p-3.5 bg-[#141414] border border-white/5 rounded-xl flex flex-col gap-2 shadow-sm">
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="text-white font-bold uppercase tracking-wider">Silver Membership</span>
                              <span className="text-gold font-mono font-bold">₹10,000 spend</span>
                            </div>
                            <p className="text-[9px] text-ivory/50">Unlocks 5% lifetime cashbacks and 24h early access to new releases.</p>
                          </div>
                          <div className="p-3.5 bg-[#141414] border border-white/5 rounded-xl flex flex-col gap-2 shadow-sm">
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="text-white font-bold uppercase tracking-wider">Gold Membership</span>
                              <span className="text-gold font-mono font-bold">₹30,000 spend</span>
                            </div>
                            <p className="text-[9px] text-ivory/50">Unlocks 10% lifetime credits, personal assistant, and free custom tailoring.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
