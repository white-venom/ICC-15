'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, ArrowRight, CheckCircle } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

export default function BookingModal() {
  const { bookingOpen, setBookingOpen } = useAppContext();
  
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingName && bookingEmail && bookingDate) {
      setBookingSubmitted(true);
      setTimeout(() => {
        setBookingOpen(false);
        setBookingSubmitted(false);
        setBookingName('');
        setBookingEmail('');
        setBookingDate('');
      }, 3000);
    }
  };

  return (
    <AnimatePresence>
      {bookingOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          {/* Modal Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={() => setBookingOpen(false)}
            className="absolute inset-0 bg-matte-black"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md p-8 md:p-10 rounded-3xl glass border border-white/10 z-10 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col gap-4 text-center items-center mb-8">
              <Scissors size={24} className="text-gold animate-pulse-slow" />
              <h3 className="font-serif text-xl md:text-2xl tracking-[0.15em] text-ivory uppercase">
                Private Styling
              </h3>
              <p className="text-xs text-ivory/50 uppercase tracking-widest max-w-xs">
                Consult with our Creative Director for bespoke sizing and selection.
              </p>
            </div>

            {!bookingSubmitted ? (
              <form onSubmit={handleBookingSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] uppercase tracking-widest text-gold">Name</label>
                  <input
                    type="text"
                    required
                    value={bookingName}
                    onChange={(e) => setBookingName(e.target.value)}
                    placeholder="e.g. Julian Vance"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors duration-300 text-ivory"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[9px] uppercase tracking-widest text-gold">Private Email</label>
                  <input
                    type="email"
                    required
                    value={bookingEmail}
                    onChange={(e) => setBookingEmail(e.target.value)}
                    placeholder="e.g. julian@company.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors duration-300 text-ivory"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[9px] uppercase tracking-widest text-gold">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors duration-300 text-ivory"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gold text-matte-black font-semibold text-xs uppercase tracking-[0.2em] rounded-full flex items-center justify-center gap-2 mt-4 hover:bg-ivory hover:text-matte-black transition-colors duration-300 cursor-pointer"
                  data-cursor="button"
                >
                  Request Invitation
                  <ArrowRight size={14} />
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center gap-4 py-8"
              >
                <CheckCircle size={48} className="text-gold" />
                <h4 className="font-serif text-lg text-ivory uppercase tracking-wider">
                  Invitation Sent
                </h4>
                <p className="text-xs text-ivory/50 leading-relaxed max-w-xs">
                  A private coordinator will review your request and contact you within 24 hours.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
