'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroLoaderProps {
  onComplete: () => void;
}

export default function IntroLoader({ onComplete }: IntroLoaderProps) {
  const [stage, setStage] = useState(0);
  const [logoError, setLogoError] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Array<{
      x: number; y: number; size: number;
      speedY: number; speedX: number; opacity: number;
    }> = [];

    const createParticle = () => ({
      x: Math.random() * width,
      y: height + 20,
      size: Math.random() * 2 + 0.5,
      speedY: -(Math.random() * 0.8 + 0.3),
      speedX: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.2,
    });

    for (let i = 0; i < 40; i++) {
      const p = createParticle();
      p.y = Math.random() * height;
      particles.push(p);
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, width, height);

      const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) * 0.5);
      gradient.addColorStop(0, 'rgba(43, 30, 23, 0.15)');
      gradient.addColorStop(1, 'rgba(5, 5, 5, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p, index) => {
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${p.opacity})`;
        ctx.fill();
        if (p.y < -20) particles[index] = createParticle();
      });

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    drawParticles();

    const timer1 = setTimeout(() => setStage(1), 1000);
    const timer2 = setTimeout(() => setStage(2), 4800);
    const timer3 = setTimeout(() => { setStage(3); onComplete(); }, 6000);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {stage < 3 && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] bg-matte-black flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Particle canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

          {/* Radial glow */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03)_0%,transparent_70%)]" />

          {/* Content wrapper */}
          <div className="relative flex flex-col items-center justify-center w-full max-w-lg px-6 text-center select-none z-10">

            {/* Shirt SVG stitching outline */}
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <svg
                viewBox="0 0 400 400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full opacity-90 drop-shadow-[0_0_15px_rgba(212,175,55,0.15)]"
              >
                {/* Shirt outline stitch path */}
                <motion.path
                  d="M 120,250 C 120,250 115,220 115,190 C 115,140 145,130 160,120 L 175,135 L 200,105 L 225,135 L 240,120 C 255,130 285,140 285,190 C 285,220 280,250 280,250 L 290,290 L 275,300 L 270,360 L 130,360 L 125,300 L 110,290 Z M 160,120 L 200,160 M 240,120 L 200,160 M 200,160 L 200,360"
                  stroke="#d4af37"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0.1 }}
                  animate={stage >= 1 ? { pathLength: 1, opacity: 0.35 } : {}}
                  transition={{ pathLength: { duration: 3.5, ease: 'easeInOut' }, opacity: { duration: 2 } }}
                />

                {/* Collar stitch detail */}
                <motion.path
                  d="M 178,137 L 200,113 L 222,137"
                  stroke="#d4af37"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0 }}
                  animate={stage >= 1 ? { pathLength: 1 } : {}}
                  transition={{ duration: 2, ease: 'linear', delay: 1.8 }}
                />

                {/* Glowing needle point */}
                {stage === 1 && (
                  <motion.circle
                    r="3"
                    fill="#faf8f5"
                    animate={{
                      cx: [120, 115, 115, 145, 160, 175, 200, 225, 240, 255, 285, 285, 280, 280],
                      cy: [250, 220, 190, 130, 120, 135, 105, 135, 120, 130, 140, 190, 220, 250],
                    }}
                    transition={{ duration: 3.5, ease: 'easeInOut' }}
                  />
                )}
              </svg>

              {/* Brand logo overlaid inside shirt silhouette */}
              {stage >= 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 2.5, ease: 'easeInOut', delay: 0.6 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  {!logoError ? (
                    <img
                      src="/assets/logo/logo.png"
                      alt="Ink & Cotton Club Logo"
                      className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                      onError={() => setLogoError(true)}
                    />
                  ) : (
                    <div className="w-32 h-32 text-gold">
                      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" />
                        <path d="M 42 35 C 42 35 34 39 34 50 C 34 61 42 65 42 65 M 58 35 C 58 35 50 39 50 50 C 50 61 58 65 58 65 M 50 30 L 50 70" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Stage text labels */}
            <div className="mt-8 h-14 overflow-hidden flex flex-col items-center">
              <AnimatePresence mode="wait">
                {stage === 0 && (
                  <motion.p
                    key="s0"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 0.5, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.8 }}
                    className="text-[10px] uppercase tracking-[0.3em] font-sans text-gold"
                  >
                    Luxurious ambience loading
                  </motion.p>
                )}

                {stage === 1 && (
                  <motion.p
                    key="s1"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 0.8, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.8 }}
                    className="text-[11px] uppercase tracking-[0.25em] font-serif font-light text-ivory italic"
                  >
                    Stitching the signature...
                  </motion.p>
                )}

                {stage === 2 && (
                  <motion.div
                    key="s2"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center gap-1"
                  >
                    <h2 className="text-xl md:text-2xl font-serif tracking-[0.35em] text-ivory font-light uppercase">
                      INK &amp; COTTON CLUB
                    </h2>
                    <span className="text-[8px] uppercase tracking-[0.4em] text-gold">
                      EST. 2026
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
