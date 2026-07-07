'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Truck, CheckCircle2, ChevronRight } from 'lucide-react';

export default function OrderStatusPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#050505] text-ivory pt-28 pb-16 px-6 md:px-16 flex flex-col justify-center items-center">
      <div className="max-w-3xl w-full bg-[#121212] border border-white/5 rounded-3xl p-8 md:p-12 space-y-8 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-white/5 pb-6">
          <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
            <Truck size={22} />
          </div>
          <div>
            <h2 className="font-serif text-2xl uppercase tracking-wider text-white">Shiprocket Shipping Integration</h2>
            <p className="text-xs text-gold uppercase tracking-widest">Connect Shopify with Shiprocket for Global Fulfillment</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 text-sm leading-relaxed text-ivory/70">
          <p className="font-sans">
            Once you have set up your **Shopify Free Trial** and are redirecting checkouts to Shopify, you do not need custom code to connect your site to Shiprocket. They communicate with each other automatically!
          </p>

          <div className="space-y-4">
            <h3 className="font-serif text-base text-white uppercase border-b border-white/5 pb-2">How to Connect Shiprocket to Shopify Natively</h3>
            
            <div className="grid grid-cols-1 gap-4 font-sans text-xs">
              <div className="flex gap-3 bg-black/40 p-4 rounded-xl border border-white/5">
                <span className="w-6 h-6 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold shrink-0">1</span>
                <div>
                  <h4 className="font-bold text-white mb-1">Create a Shiprocket Account</h4>
                  <p className="text-ivory/50">Register at <a href="https://www.shiprocket.in" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">shiprocket.in</a>, verify KYC, and recharge your wallet for shipment credits.</p>
                </div>
              </div>

              <div className="flex gap-3 bg-black/40 p-4 rounded-xl border border-white/5">
                <span className="w-6 h-6 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold shrink-0">2</span>
                <div>
                  <h4 className="font-bold text-white mb-1">Install the Shiprocket App in Shopify</h4>
                  <p className="text-ivory/50">Go to your Shopify App Store, install the official **Shiprocket** app, and link it to your Shiprocket account credentials.</p>
                </div>
              </div>

              <div className="flex gap-3 bg-black/40 p-4 rounded-xl border border-white/5">
                <span className="w-6 h-6 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold shrink-0">3</span>
                <div>
                  <h4 className="font-bold text-white mb-1">Configure Automatic Sync</h4>
                  <p className="text-ivory/50">Under Shiprocket Channel Settings, map your Shopify store. Once linked, any paid order placed via Razorpay on your Shopify checkout will automatically sync to Shiprocket for labeling, customs routing, and dispatch.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 bg-[#0d0d0d] p-5 rounded-2xl border border-gold/15">
            <h4 className="font-serif text-sm text-gold uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 size={16} /> Automated Tracking Updates
            </h4>
            <p className="text-xs text-ivory/60 font-sans leading-relaxed">
              When you generate an AWB shipping label in Shiprocket, the app automatically pushes the tracking number back to your Shopify admin, changing the order status to &quot;Fulfilled&quot;. 
            </p>
          </div>
        </div>

        {/* Footer controls */}
        <div className="flex gap-4 border-t border-white/5 pt-6">
          <button
            onClick={() => router.push('/checkout')}
            className="flex-1 py-4 bg-gold text-[#050505] font-bold text-xs uppercase tracking-widest rounded-full flex items-center justify-center gap-1.5 hover:bg-white hover:text-black transition-colors"
          >
            Go to Checkout Setup <ChevronRight size={14} />
          </button>
          <button
            onClick={() => router.push('/collection')}
            className="flex-1 py-4 border border-white/10 text-ivory font-bold text-xs uppercase tracking-widest rounded-full hover:border-gold hover:text-gold transition-colors"
          >
            Back to Shop
          </button>
        </div>

      </div>
    </div>
  );
}
