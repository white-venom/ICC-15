'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ShieldCheck, Sparkles, Trophy, Award } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import Image from 'next/image';

// ── LOCALIZATION MAP ──────────────────────────────────────────────────────────
const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    sectionEyebrow: 'Privilege Tiering',
    sectionTitle: 'The Loyalty Registry',
    sectionDesc: 'Elevate your presence. Reach curated shopping milestones to unlock our lifetime Silver and Gold Club status, each tier featuring tailored privileges.',
    silverPrivileges: 'Silver Privileges',
    goldPrivileges: 'Gold Privileges',
    silverBenefit1: '5% Lifetime Reward Credits on all purchases',
    silverBenefit2: 'Early Access (24h) to Limited Edition releases',
    silverBenefit3: 'Free luxury box packaging on all orders',
    silverBenefit4: 'Priority home sizing & replacement concierge',
    goldBenefit1: '10% Lifetime Reward Credits on all purchases',
    goldBenefit2: 'Early Access (36h) to Limited Edition releases',
    goldBenefit3: 'VIP priority access to collection launch events',
    goldBenefit4: 'Private 1-on-1 virtual styling consultations',
    silverSubtitle: 'PRESTIGE CLUB',
    goldSubtitle: 'ELITE CLUB',
    silverMemberStatus: 'PRESTIGE MEMBER',
    goldMemberStatus: 'ELITE MEMBER',
    memberLabel: 'MEMBER STATUS',
    pinLabel: 'ACCESS PIN',
    tapToFlip: 'TAP TO REVEAL',
    tapToFlipBack: 'TAP TO RETURN',
  },
  ar: {
    sectionEyebrow: 'تصنيف الامتيازات',
    sectionTitle: 'سجل الولاء',
    sectionDesc: 'ارتقِ بحضورك. حقّق إنجازات التسوّق المختارة لتفتح عضوية نادي الفضة والذهب مدى الحياة، مع امتيازات مخصّصة لكل مستوى.',
    silverPrivileges: 'امتيازات الفضة',
    goldPrivileges: 'امتيازات الذهب',
    silverBenefit1: '٥٪ رصيد مكافآت مدى الحياة على جميع المشتريات',
    silverBenefit2: 'وصول مبكر (٢٤ ساعة) إلى إصدارات الإصدار المحدود',
    silverBenefit3: 'علب هدايا فاخرة مجانية مع جميع الطلبات',
    silverBenefit4: 'خدمة تحديد القياسات والاستبدال المنزلي ذات الأولوية',
    goldBenefit1: '١٠٪ رصيد مكافآت مدى الحياة على جميع المشتريات',
    goldBenefit2: 'وصول مبكر (٣٦ ساعة) إلى إصدارات الإصدار المحدود',
    goldBenefit3: 'وصول خاص وحصري لكبار الشخصيات إلى فعاليات إطلاق المجموعات',
    goldBenefit4: 'استشارات تنسيق ملابس افتراضية شخصية وخاصة',
    silverSubtitle: 'نادي البريستيج',
    goldSubtitle: 'النادي النخبوي',
    silverMemberStatus: 'عضو البريستيج',
    goldMemberStatus: 'عضو النخبة',
    memberLabel: 'حالة العضوية',
    pinLabel: 'رمز الوصول',
    tapToFlip: 'اضغط للكشف',
    tapToFlipBack: 'اضغط للعودة',
  },
};

export default function LoyaltyTiers() {
  const { country } = useAppContext();
  const isArabic = country === 'DUBAI';
  const t = isArabic ? TRANSLATIONS.ar : TRANSLATIONS.en;

  const silverBenefits = [t.silverBenefit1, t.silverBenefit2, t.silverBenefit3, t.silverBenefit4];
  const goldBenefits = [t.goldBenefit1, t.goldBenefit2, t.goldBenefit3, t.goldBenefit4];

  return (
    <section id="loyalty" className="relative py-24 px-6 md:px-16 bg-[#050505] overflow-hidden z-10 font-sans border-b border-white/5" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none overflow-hidden opacity-[0.02] w-full text-center">
        <span className="font-serif uppercase text-[15vw] leading-none font-bold tracking-tighter text-white">
          {isArabic ? 'ولاء' : 'LOYALTY'}
        </span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-[10px] uppercase tracking-[0.45em] text-gold font-semibold mb-3">{t.sectionEyebrow}</span>
          <h2 className="font-serif text-3xl md:text-5xl font-light uppercase tracking-wide text-white mb-4">{t.sectionTitle}</h2>
          <p className="text-xs md:text-sm font-light text-ivory/50 max-w-xl leading-relaxed">{t.sectionDesc}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start justify-items-center">

          {/* SILVER */}
          <div className="flex flex-col gap-8 w-full max-w-md">
            <div className="flex justify-center">
              <FlipCard
                tier="silver"
                subtitle={t.silverSubtitle}
                cardNo="•••• •••• •••• 1000"
                glowColor="rgba(255, 255, 255, 0.15)"
                memberStatus={t.silverMemberStatus}
                memberLabel={t.memberLabel}
                pinLabel={t.pinLabel}
                samplePin="7"
                tapToFlip={t.tapToFlip}
                tapToFlipBack={t.tapToFlipBack}
              />
            </div>
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

          {/* GOLD */}
          <div className="flex flex-col gap-8 w-full max-w-md">
            <div className="flex justify-center">
              <FlipCard
                tier="gold"
                subtitle={t.goldSubtitle}
                cardNo="•••• •••• •••• 3000"
                glowColor="rgba(212, 175, 55, 0.25)"
                memberStatus={t.goldMemberStatus}
                memberLabel={t.memberLabel}
                pinLabel={t.pinLabel}
                samplePin="4"
                tapToFlip={t.tapToFlip}
                tapToFlipBack={t.tapToFlipBack}
              />
            </div>
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

// ── FLIP CARD ─────────────────────────────────────────────────────────────────
interface FlipCardProps {
  tier: 'silver' | 'gold';
  subtitle: string;
  cardNo: string;
  glowColor: string;
  memberStatus: string;
  memberLabel: string;
  pinLabel: string;
  samplePin: string;
  tapToFlip: string;
  tapToFlipBack: string;
}

function FlipCard({ tier, subtitle, cardNo, glowColor, memberStatus, memberLabel, pinLabel, samplePin, tapToFlip, tapToFlipBack }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isSilver = tier === 'silver';

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), { stiffness: 300, damping: 30 });
  const shineX = useSpring(useTransform(x, [-0.5, 0.5], ['0%', '100%']), { stiffness: 300, damping: 30 });
  const shineY = useSpring(useTransform(y, [-0.5, 0.5], ['0%', '100%']), { stiffness: 300, damping: 30 });
  const opacityGlare = useTransform(x, [-0.5, 0.5], [0.05, 0.35]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isFlipped || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) / rect.width);
    y.set((e.clientY - rect.top - rect.height / 2) / rect.height);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };
  const handleClick = () => { setIsFlipped(f => !f); x.set(0); y.set(0); };

  const accentText = isSilver ? 'text-white/90' : 'text-champagne';
  const borderCls = isSilver ? 'border-white/10 hover:border-white/35' : 'border-gold/25 hover:border-gold/65';
  const bgCls = isSilver ? 'bg-gradient-to-br from-[#242526] via-[#121314] to-[#1c1d1e]' : 'bg-gradient-to-br from-[#251b11] via-[#0c0907] to-[#1d140d]';
  const nameColor = isSilver ? 'text-white/90' : 'text-gold';
  const badgeCls = isSilver ? 'bg-white/5 text-white/95 border-white/20' : 'bg-gold/10 text-gold border-gold/25';
  const waveStroke = isSilver ? '#ffffff' : '#d4af37';
  const logoBadgeCls = isSilver ? 'border-white/15 bg-white/5' : 'border-gold/20 bg-gold/5';

  return (
    <div className="w-full max-w-[420px] aspect-[1.586/1] cursor-pointer" style={{ perspective: '1200px' }} onClick={handleClick}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
        style={{
          rotateX: isFlipped ? 0 : rotateX,
          transformStyle: 'preserve-3d',
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >

        {/* ── FRONT ── */}
        <div
          className={`absolute inset-0 rounded-2xl p-6 md:p-8 flex flex-col justify-between overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.85)] border select-none transition-colors duration-300 ${borderCls} ${bgCls}`}
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          {/* Texture */}
          <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 3px)' }} />

          {/* Wave art */}
          <div className="absolute inset-0 opacity-[0.12] pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 200 120" fill="none">
              <path d="M-20,100 C30,40 80,110 130,50 C180,-10 210,80 250,20" stroke={waveStroke} strokeWidth="0.5" strokeDasharray="1 1" />
              <path d="M-20,110 C40,50 90,120 140,60 C190,0 200,90 250,30" stroke={waveStroke} strokeWidth="0.2" />
            </svg>
          </div>

          {/* Shine */}
          <motion.div style={{ background: `radial-gradient(circle 180px at ${shineX} ${shineY}, ${glowColor}, transparent)` }} className="absolute inset-0 pointer-events-none z-10" />
          <motion.div style={{ left: shineX, opacity: opacityGlare }} className={`absolute top-0 bottom-0 w-12 -skew-x-12 pointer-events-none z-10 blur-md bg-gradient-to-r from-transparent ${isSilver ? 'via-white/70' : 'via-champagne/70'} to-transparent`} />

          {/* Top row */}
          <div className="flex justify-between items-center z-20 relative" style={{ transform: 'translateZ(35px)' }}>
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 overflow-hidden flex-shrink-0">
                <Image src="/assets/logo/logobg.png" alt="ICC Logo" fill className="object-contain brightness-0 invert" unoptimized />
              </div>
              <div className="flex flex-col items-center leading-none">
                <span className={`font-serif text-[11px] tracking-[0.2em] uppercase font-semibold ${nameColor}`}>Ink &amp; Cotton Club</span>
                <span className={`font-sans text-[7px] tracking-[0.25em] font-bold mt-0.5 text-center ${isSilver ? 'text-gold/60' : 'text-gold/50'}`}>Tailored Essentials</span>
              </div>
            </div>
          </div>

          {/* Middle */}
          <div className="my-auto z-20 relative flex flex-col" style={{ transform: 'translateZ(50px)' }}>
            <div className={`text-lg md:text-xl font-mono tracking-[0.3em] font-semibold ${accentText}`} style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>{cardNo}</div>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-[9px] uppercase font-bold tracking-[0.35em] px-2.5 py-1 rounded border ${badgeCls}`}>{subtitle}</span>
            </div>
          </div>

          {/* Thin luxury divider */}
          <div className={`w-full h-px my-2 ${isSilver ? 'bg-white/8' : 'bg-gold/10'} z-20 relative`} style={{ transform: 'translateZ(30px)' }} />

          {/* Bottom row */}
          <div className="flex justify-between items-end z-20 relative" style={{ transform: 'translateZ(35px)' }}>
            {/* Member Status */}
            <div className="flex flex-col">
              <span className="text-[7px] tracking-[0.2em] uppercase text-white/35">{memberLabel}</span>
              <span className={`text-[11px] tracking-widest font-light mt-0.5 ${accentText}`}>{memberStatus}</span>
            </div>

            {/* ACCESS PIN */}
            <div className="flex flex-col items-center">
              <span className="text-[7px] tracking-[0.2em] uppercase text-white/35">{pinLabel}</span>
              <div className="flex items-center gap-0.5 mt-0.5">
                <span className={`text-[14px] font-mono font-bold leading-none ${accentText}`}>{samplePin}</span>
                <span className="text-[11px] font-mono text-white/25 leading-none">••</span>
              </div>
            </div>

            {/* Valid Thru — Lifetime */}
            <div className="flex flex-col items-end">
              <span className="text-[7px] tracking-[0.2em] uppercase text-white/35">VALID THRU</span>
              <span className={`text-[11px] tracking-widest font-serif mt-0.5 ${isSilver ? 'text-white/80' : 'text-gold/80'}`}>
                LIFETIME &nbsp;&#x221E;
              </span>
            </div>
          </div>

          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[6px] tracking-[0.3em] uppercase text-white/15 pointer-events-none select-none whitespace-nowrap">{tapToFlip}</div>
        </div>

        {/* ── BACK ── */}
        <div
          className={`absolute inset-0 rounded-2xl overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.85)] border flex flex-col items-center justify-center select-none ${borderCls} ${bgCls}`}
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {/* Brushed metal texture */}
          <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 3px)' }} />

          {/* Subtle wave art */}
          <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 200 120" fill="none">
              <path d="M-20,60 C30,20 80,90 130,40 C180,-10 210,60 250,10" stroke={waveStroke} strokeWidth="0.5" strokeDasharray="1 1" />
              <path d="M-20,80 C40,30 90,100 140,50 C190,0 200,70 250,20" stroke={waveStroke} strokeWidth="0.2" />
            </svg>
          </div>

          {/* Magnetic stripe */}
          <div className="absolute top-7 left-0 right-0 h-9 bg-black/70" />

          {/* logo.png — full brand logo filling the card back */}
          <div className="absolute inset-0 z-10 flex items-center justify-center px-8 py-14">
            <div className="relative w-full h-full">
              <Image
                src="/assets/logo/logo.png"
                alt="Ink & Cotton Club — Tailored Essentials"
                fill
                className="object-contain"
                style={isSilver
                  ? { filter: 'brightness(0) invert(1)', opacity: 0.92 }
                  : { filter: 'sepia(1) saturate(4) hue-rotate(5deg) brightness(1.1)', opacity: 0.95 }
                }
                unoptimized
              />
            </div>
          </div>

          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[6px] tracking-[0.3em] uppercase text-white/15 pointer-events-none select-none whitespace-nowrap">{tapToFlipBack}</div>
        </div>

      </motion.div>
    </div>
  );
}
