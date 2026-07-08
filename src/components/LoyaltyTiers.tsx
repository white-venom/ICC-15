'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ShieldCheck, Sparkles, Trophy, Award, Gift, Zap, HelpCircle } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import Image from 'next/image';

interface CardData {
  tier: 'silver' | 'gold';
  title: string;
  subtitle: string;
  thresholdVal: number;
  benefits: string[];
  cardNo: string;
  themeCls: string;
  badgeCls: string;
}

// ── LOCALIZATION MAP ──────────────────────────────────────────────────────────
const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    sectionEyebrow: 'Privilege Tiering',
    sectionTitle: 'The Loyalty Registry',
    sectionDesc: 'Elevate your presence. Reach curated shopping milestones to unlock our lifetime Silver and Gold Club status, each tier featuring tailored privileges.',
    silverPrivileges: 'Silver Privileges',
    goldPrivileges: 'Gold Privileges',
    silverBenefit1: '5% Lifetime Reward Credits on all purchases',
    silverBenefit2: 'Early Access (24h) to micro-capsule collection releases',
    goldBenefit1: '10% Lifetime Reward Credits on all purchases',
    goldBenefit2: 'Dedicated Personal Atelier Assistant via direct line',
    goldBenefit3: 'Private Trunk Show Invitations & local event access',
    goldBenefit4: 'Complimentary Lifetime Tailoring & alterations care',
    goldBenefit5: 'Free worldwide express courier delivery & returns',
    silverSubtitle: 'PRESTIGE CLUB',
    goldSubtitle: 'ELITE CLUB',
    memberStatus: 'MEMBER STATUS',
    valuedMember: 'VALUED MEMBER',
    tierUnlock: 'TIER UNLOCK',
    membershipRegistry: 'MEMBERSHIP REGISTRY',
  },
  ar: {
    sectionEyebrow: 'تصنيف الامتيازات',
    sectionTitle: 'سجل الولاء',
    sectionDesc: 'ارتقِ بحضورك. حقّق إنجازات التسوّق المختارة لتفتح عضوية نادي الفضة والذهب مدى الحياة، مع امتيازات مخصّصة لكل مستوى.',
    silverPrivileges: 'امتيازات الفضة',
    goldPrivileges: 'امتيازات الذهب',
    silverBenefit1: '٥٪ رصيد مكافآت مدى الحياة على جميع المشتريات',
    silverBenefit2: 'وصول مبكر (٢٤ ساعة) إلى إصدارات المجموعات الحصرية',
    goldBenefit1: '١٠٪ رصيد مكافآت مدى الحياة على جميع المشتريات',
    goldBenefit2: 'مساعد أتيليه شخصي مخصّص عبر خط مباشر',
    goldBenefit3: 'دعوات لعروض خاصة وفعاليات محلية حصرية',
    goldBenefit4: 'خدمة خياطة وتعديلات مجانية مدى الحياة',
    goldBenefit5: 'توصيل سريع مجاني حول العالم وإرجاع مجاني',
    silverSubtitle: 'نادي البريستيج',
    goldSubtitle: 'النادي النخبوي',
    memberStatus: 'حالة العضوية',
    valuedMember: 'عضو مميّز',
    tierUnlock: 'فتح المستوى',
    membershipRegistry: 'سجل العضوية',
  },
};

export default function LoyaltyTiers() {
  const { country } = useAppContext();

  const isArabic = country === 'DUBAI';
  const t = isArabic ? TRANSLATIONS.ar : TRANSLATIONS.en;

  // Localized thresholds based on user's 10k & 30k spec
  const getThresholdDisplay = (tier: 'silver' | 'gold') => {
    const val = tier === 'silver' ? '10,000' : '30,000';
    switch (country) {
      case 'INDIA':
        return `₹${val}`;
      case 'UK':
        return `£${val}`;
      case 'DUBAI':
        return `${val} AED`;
      case 'US':
      default:
        return `$${val}`;
    }
  };

  const silverBenefits = [t.silverBenefit1, t.silverBenefit2];

  const goldBenefits = [
    t.goldBenefit1,
    t.goldBenefit2,
    t.goldBenefit3,
    t.goldBenefit4,
    t.goldBenefit5,
  ];

  return (
    <section id="loyalty" className="relative py-24 px-6 md:px-16 bg-[#050505] overflow-hidden z-10 font-sans border-b border-white/5" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Editorial Watermark background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none overflow-hidden opacity-[0.02] w-full text-center">
        <span className="font-serif uppercase text-[15vw] leading-none font-bold tracking-tighter text-white">
          {isArabic ? 'ولاء' : 'LOYALTY'}
        </span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-[10px] uppercase tracking-[0.45em] text-gold font-semibold mb-3">
            {t.sectionEyebrow}
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-light uppercase tracking-wide text-white mb-4">
            {t.sectionTitle}
          </h2>
          <p className="text-xs md:text-sm font-light text-ivory/50 max-w-xl leading-relaxed">
            {t.sectionDesc}
          </p>
        </div>

        {/* Cards & Benefits Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start justify-items-center">

          {/* SILVER TIER CARD & INFO */}
          <div className="flex flex-col gap-8 w-full max-w-md">
            {/* 3D Interactive Card Container */}
            <div className="flex justify-center">
              <TiltCard
                tier="silver"
                title="Silver Club Card"
                subtitle={t.silverSubtitle}
                threshold={getThresholdDisplay('silver')}
                cardNo="•••• •••• •••• 1000"
                glowColor="rgba(255, 255, 255, 0.15)"
                t={t}
              />
            </div>

            {/* Silver Benefits List */}
            <div className="w-full p-8 rounded-3xl bg-white/[0.01] border border-white/5 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-slate-500/10 flex items-center justify-center border border-slate-400/20">
                  <Award size={16} className="text-slate-300" />
                </div>
                <h3 className="font-serif text-lg text-white uppercase tracking-wider">{t.silverPrivileges}</h3>
              </div>
              <ul className="space-y-4">
                {silverBenefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <ShieldCheck size={16} className="text-slate-400 mt-0.5 shrink-0" />
                    <span className="text-xs md:text-sm font-light text-ivory/70 leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* GOLD TIER CARD & INFO */}
          <div className="flex flex-col gap-8 w-full max-w-md">
            {/* 3D Interactive Card Container */}
            <div className="flex justify-center">
              <TiltCard
                tier="gold"
                title="Gold Club Card"
                subtitle={t.goldSubtitle}
                threshold={getThresholdDisplay('gold')}
                cardNo="•••• •••• •••• 3000"
                glowColor="rgba(212, 175, 55, 0.25)"
                t={t}
              />
            </div>

            {/* Gold Benefits List */}
            <div className="w-full p-8 rounded-3xl bg-white/[0.01] border border-gold/5 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center border border-gold/20">
                  <Trophy size={16} className="text-gold" />
                </div>
                <h3 className="font-serif text-lg text-gold uppercase tracking-wider">{t.goldPrivileges}</h3>
              </div>
              <ul className="space-y-4">
                {goldBenefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Sparkles size={16} className="text-gold mt-0.5 shrink-0" />
                    <span className="text-xs md:text-sm font-light text-ivory/70 leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ── TILT CARD SUBCOMPONENT ────────────────────────────────────────────────────
interface TiltCardProps {
  tier: 'silver' | 'gold';
  title: string;
  subtitle: string;
  threshold: string;
  cardNo: string;
  glowColor: string;
  t: Record<string, string>;
}

function TiltCard({ tier, title, subtitle, threshold, cardNo, glowColor, t }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Motion values for tilt position
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Damping for smooth movement
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 300, damping: 30 });

  // Light reflection/shine tracking
  const shineX = useSpring(useTransform(x, [-0.5, 0.5], ['0%', '100%']), { stiffness: 300, damping: 30 });
  const shineY = useSpring(useTransform(y, [-0.5, 0.5], ['0%', '100%']), { stiffness: 300, damping: 30 });
  const opacityGlare = useTransform(x, [-0.5, 0.5], [0.1, 0.4]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    // Normalize values between -0.5 and 0.5
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (tier === 'silver') {
    return (
      <div className="perspective-[1000px] w-full max-w-[420px] aspect-[1.586/1] cursor-pointer">
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
          className="relative w-full h-full rounded-2xl p-6 md:p-8 flex flex-col justify-between overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.85)] border border-white/10 hover:border-white/35 select-none transition-all duration-300 bg-gradient-to-br from-[#242526] via-[#121314] to-[#1c1d1e] shadow-white/5"
        >
          {/* Fine Brushed Metal Texture */}
          <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 3px)' }} />

          {/* Abstract SVG luxury waves in background */}
          <div className="absolute inset-0 opacity-15 pointer-events-none select-none">
            <svg className="w-full h-full text-current" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M-20,100 C30,40 80,110 130,50 C180,-10 210,80 250,20"
                stroke="#ffffff"
                strokeWidth="0.5"
                strokeDasharray="1 1"
              />
              <path
                d="M-20,110 C40,50 90,120 140,60 C190,0 200,90 250,30"
                stroke="#ffffff"
                strokeWidth="0.2"
              />
            </svg>
          </div>

          {/* Dynamic Interactive Shine Overlay Effect */}
          <motion.div
            style={{
              background: `radial-gradient(circle 180px at ${shineX} ${shineY}, ${glowColor}, transparent)`,
            }}
            className="absolute inset-0 pointer-events-none z-10"
          />

          {/* Diagonal glare sweep line */}
          <motion.div
            style={{
              left: shineX,
              opacity: opacityGlare,
            }}
            className="absolute top-0 bottom-0 w-16 -skew-x-12 pointer-events-none z-10 blur-md bg-gradient-to-r from-transparent via-white/80 to-transparent"
          />

          {/* Top Header Row */}
          <div className="flex justify-between items-center z-20" style={{ transform: 'translateZ(35px)' }}>
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 overflow-hidden">
                <Image
                  src="/assets/logo/logobg.png"
                  alt="Ink & Cotton Club Logo"
                  fill
                  className="object-contain brightness-0 invert"
                  unoptimized
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-serif text-[11px] tracking-[0.2em] uppercase font-semibold text-white/90">
                  Ink &amp; Cotton Club
                </span>
                <span className="font-sans text-[7px] tracking-[0.25em] font-bold text-white/35 mt-0.5">
                  {t.membershipRegistry}
                </span>
              </div>
            </div>

            {/* Chip */}
            <div className="w-9 h-7 rounded-md border border-white/20 p-1 flex flex-col justify-between relative shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] bg-gradient-to-br from-slate-200 via-slate-400 to-slate-500">
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-0.5 p-1 opacity-20">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="border-[0.5px] border-black rounded-sm" />
                ))}
              </div>
              <div className="h-[2px] w-full bg-black/15 rounded-sm relative z-10" />
              <div className="h-[2px] w-3/4 bg-black/15 rounded-sm relative z-10" />
            </div>
          </div>

          {/* Center Card Number / Tier */}
          <div className="my-auto z-20 flex flex-col" style={{ transform: 'translateZ(50px)' }}>
            <div className="text-lg md:text-xl font-mono tracking-[0.3em] font-semibold text-white/90" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
              {cardNo}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[9px] uppercase font-bold tracking-[0.35em] px-2.5 py-1 rounded border bg-white/5 text-white/95 border-white/20">
                {subtitle}
              </span>
            </div>
          </div>

          {/* Bottom Metadata Row */}
          <div className="flex justify-between items-end z-20" style={{ transform: 'translateZ(35px)' }}>
            <div className="flex flex-col">
              <span className="text-[7px] tracking-[0.2em] uppercase text-white/35">{t.memberStatus}</span>
              <span className="text-[11px] tracking-widest text-white/95 font-light mt-0.5">{t.valuedMember}</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Holographic Security Foil */}
              <div className="relative w-7 h-7 rounded-full overflow-hidden border border-white/10 opacity-70">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#ff5b5b] via-[#e2ef26] via-[#24ef81] via-[#2df1ff] to-[#ff2df1] animate-spin-slow opacity-65 mix-blend-color-dodge" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[6px] font-sans font-bold tracking-tight text-white/80">ICC</span>
                </div>
              </div>

              <div className="text-right flex flex-col items-end">
                <span className="text-[7px] tracking-[0.2em] uppercase text-white/35">{t.tierUnlock}</span>
                <span className="text-[13px] tracking-widest font-serif font-medium mt-0.5 text-white" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                  {threshold}+
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Otherwise, render Gold as a Vertical Card
  return (
    <div className="perspective-[1000px] w-full max-w-[280px] aspect-[1/1.586] cursor-pointer">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full h-full rounded-2xl p-6 flex flex-col justify-between overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.85)] border border-gold/25 hover:border-gold/65 select-none transition-all duration-300 bg-gradient-to-b from-[#251b11] via-[#0c0907] to-[#1d140d] shadow-gold/5"
      >
        {/* Fine Brushed Metal Texture */}
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 3px)' }} />

        {/* Dynamic Curved Laser Traces */}
        <div className="absolute inset-0 opacity-[0.12] pointer-events-none select-none">
          <svg className="w-full h-full text-current" viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M-30,140 C20,90 30,150 70,95 C110,40 120,110 160,50"
              stroke="#d4af37"
              strokeWidth="0.25"
              strokeDasharray="1 1"
            />
            <path
              d="M-30,150 C30,100 40,160 80,105 C120,50 130,120 170,60"
              stroke="#d4af37"
              strokeWidth="0.1"
            />
          </svg>
        </div>

        {/* Large Centered Watermark Brand Logo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none z-0">
          <div className="relative w-32 h-32">
            <Image
              src="/assets/logo/logobg.png"
              alt="Brand Watermark Logo"
              fill
              className="object-contain brightness-0 invert"
              unoptimized
            />
          </div>
        </div>

        {/* Interactive Radial Glow Shine */}
        <motion.div
          style={{
            background: `radial-gradient(circle 150px at ${shineX} ${shineY}, ${glowColor}, transparent)`,
          }}
          className="absolute inset-0 pointer-events-none z-10"
        />

        {/* Light Glare Reflection Line */}
        <motion.div
          style={{
            left: shineX,
            opacity: opacityGlare,
          }}
          className="absolute top-0 bottom-0 w-16 -skew-x-12 pointer-events-none z-10 blur-sm bg-gradient-to-r from-transparent via-champagne/80 to-transparent"
        />

        {/* TOP ROW: Logo & Microchip */}
        <div className="flex justify-between items-start z-20" style={{ transform: 'translateZ(30px)' }}>
          <div className="flex flex-col gap-1.5">
            {/* Real Logo */}
            <div className="relative w-8 h-8 overflow-hidden">
              <Image
                src="/assets/logo/logobg.png"
                alt="Ink & Cotton Club Logo"
                fill
                className="object-contain brightness-0 invert"
                unoptimized
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-serif text-[10px] tracking-[0.15em] uppercase font-semibold text-gold">
                Ink &amp; Cotton
              </span>
              <span className="font-sans text-[5px] tracking-[0.2em] font-bold text-white/35 mt-0.5">
                EST. 2026
              </span>
            </div>
          </div>

          {/* Luxury Detailed Chip */}
          <div className="w-8 h-6 rounded border border-gold/40 p-1 flex flex-col justify-between relative shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] bg-gradient-to-br from-amber-300 via-gold to-amber-600">
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-0.5 p-0.5 opacity-20">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="border-[0.5px] border-black rounded-sm" />
              ))}
            </div>
            <div className="h-[1px] w-full bg-black/15 rounded-sm relative z-10" />
            <div className="h-[1px] w-2/3 bg-black/15 rounded-sm relative z-10" />
            <div className="h-[1px] w-full bg-black/15 rounded-sm relative z-10" />
          </div>
        </div>

        {/* MIDDLE ROW: Premium Centered Member Status Badge */}
        <div className="z-20 my-auto flex flex-col items-center justify-center text-center" style={{ transform: 'translateZ(45px)' }}>
          <span className="text-[9px] uppercase font-bold tracking-[0.35em] px-4 py-1 rounded-full border bg-gold/10 text-gold border-gold/25 shadow-[0_0_10px_rgba(212,175,55,0.15)]">
            {subtitle}
          </span>
        </div>

        {/* BOTTOM SECTION: Card Details, Hologram, Unlock Info */}
        <div className="flex flex-col gap-4 z-20" style={{ transform: 'translateZ(30px)' }}>
          {/* Card Number */}
          <div className="text-sm font-mono tracking-[0.25em] font-semibold text-center text-champagne" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
            {cardNo}
          </div>

          <div className="w-full h-px bg-white/5" />

          {/* Holder Name, Hologram, Spend Threshold */}
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-[5px] tracking-[0.15em] uppercase text-white/35">{t.memberStatus}</span>
              <span className="text-[9px] tracking-widest text-white/95 font-light mt-0.5">{t.valuedMember}</span>
            </div>

            {/* Holographic Security Circle Badge */}
            <div className="relative w-7 h-7 rounded-full overflow-hidden border border-white/10 opacity-70 hover:opacity-90 transition-opacity duration-300">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#ff5b5b] via-[#e2ef26] via-[#24ef81] via-[#2df1ff] to-[#ff2df1] animate-spin-slow opacity-65 mix-blend-color-dodge" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[6px] font-sans font-bold tracking-tight text-white/80">ICC</span>
              </div>
            </div>

            <div className="text-right flex flex-col items-end">
              <span className="text-[5px] tracking-[0.15em] uppercase text-white/35">{t.tierUnlock}</span>
              <span className="text-[11px] tracking-widest font-serif font-medium mt-0.5 text-gold" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                {threshold}+
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
