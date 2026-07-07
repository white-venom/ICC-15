'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ArrowRight, Loader2 } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { TRANSLATIONS } from '@/utils/translations';

interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  colorName: string;
  quantity: number;
  image: string;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  isLoading?: boolean;
}

export default function Cart({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onCheckout,
  isLoading,
}: CartProps) {
  const { formatPrice, country } = useAppContext();
  const isArabic = country === 'DUBAI';
  const t = isArabic ? TRANSLATIONS.ar : TRANSLATIONS.en;
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-matte-black"
          />

          {/* Cart Panel Drawer */}
          <motion.div
            initial={{ x: isArabic ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isArabic ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            dir={isArabic ? 'rtl' : 'ltr'}
            className={`fixed ${isArabic ? 'left-0' : 'right-0'} top-0 bottom-0 w-full sm:w-[450px] z-50 glass border-r border-white/5 flex flex-col shadow-2xl`}
          >
            {/* Cart Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex flex-col">
                <h3 className="font-serif text-xl tracking-[0.2em] text-ivory uppercase">
                  {t.cartTitle}
                </h3>
                <span className="text-[9px] uppercase tracking-[0.2em] text-gold mt-1">
                  {t.cartSubtitle}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-ivory/60 hover:text-gold hover:scale-110 transition-all duration-300"
                data-cursor="button"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
                  <p className="font-serif text-sm italic text-ivory/40">
                    {t.cartEmpty}
                  </p>
                  <button
                    onClick={onClose}
                    className="text-[10px] uppercase tracking-[0.2em] text-gold border-b border-gold/30 hover:border-gold hover:pb-1 transition-all duration-300"
                  >
                    {t.cartReturn}
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex gap-5 pb-6 border-b border-white/5 items-start"
                  >
                    {/* Item Swatch */}
                    <div
                      className={`w-16 h-20 rounded-lg flex items-center justify-center border border-white/10 ${
                        item.colorName === 'Jet Black'
                          ? 'bg-[#080808]'
                          : item.colorName === 'Royal Blue'
                          ? 'bg-[#0f1a30]'
                          : 'bg-[#faf8f5]'
                      }`}
                    >
                      <span
                        className={`text-[8px] uppercase tracking-[0.1em] font-semibold ${
                          item.colorName === 'Ivory White' ? 'text-matte-black' : 'text-ivory'
                        }`}
                      >
                        {isArabic ? (item.colorName === 'Jet Black' ? 'أسود' : item.colorName === 'Royal Blue' ? 'أزرق' : 'أبيض') : item.colorName.split(' ')[0]}
                      </span>
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col gap-1">
                      <h4 className="font-serif text-sm tracking-wider text-ivory">
                        {isArabic ? (item.name.includes('White') || item.name.includes('Ivory') ? 'العضوية العاجية' : item.name.includes('Onyx') || item.name.includes('Black') ? 'بيان أونيكس' : 'المراسم الملكية') : item.name}
                      </h4>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-ivory/50 uppercase tracking-widest">
                        <span>{t.cartColor}: {isArabic ? (item.colorName === 'Jet Black' ? 'أسود حالك' : item.colorName === 'Royal Blue' ? 'أزرق ملكي' : 'أبيض عاجي') : item.colorName}</span>
                        <span>{t.cartSize}: {item.size}</span>
                        <span>{t.cartQty}: {item.quantity}</span>
                      </div>
                      <span className="font-serif text-xs text-gold mt-1">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>

                    {/* Delete Item */}
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-white/30 hover:text-red-400 p-2 transition-colors duration-300"
                      aria-label="Remove item"
                      data-cursor="button"
                    >
                      <Trash2 size={15} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {items.length > 0 && (
              <div className="p-8 border-t border-white/5 bg-matte-black/40 flex flex-col gap-6">
                <div className="flex items-center justify-between font-serif">
                  <span className="text-sm tracking-wider text-ivory/60">{t.cartSubtotal}</span>
                  <span className="text-lg tracking-widest text-gold font-light">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                
                <p className="text-[10px] text-ivory/40 uppercase tracking-wider leading-relaxed">
                  {t.cartNotice}
                </p>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={onCheckout}
                    disabled={isLoading}
                    className="w-full py-4 bg-gold text-matte-black font-semibold text-xs uppercase tracking-[0.25em] rounded-full flex items-center justify-center gap-2 hover:bg-ivory hover:text-matte-black transition-colors duration-350 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="animate-spin" size={14} />
                        Connecting...
                      </span>
                    ) : (
                      <>
                        {t.cartCheckout}
                        <ArrowRight size={14} className={isArabic ? 'rotate-180' : ''} />
                      </>
                    )}
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full py-3 border border-white/10 text-ivory hover:border-gold hover:text-gold text-xs uppercase tracking-[0.2em] rounded-full transition-colors duration-300"
                  >
                    {t.cartContinue}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
