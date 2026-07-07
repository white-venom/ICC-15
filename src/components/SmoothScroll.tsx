'use client';

import Lenis from 'lenis';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import React from 'react';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef   = useRef<number>(0);
  const pathname = usePathname();

  // ── Init Lenis once ─────────────────────────────────
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    } as ConstructorParameters<typeof Lenis>[0]);

    lenisRef.current = lenis;
    if (typeof window !== 'undefined') {
      (window as any).lenis = lenis;
    }

    // Animation frame loop
    function raf(time: number) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
    rafRef.current = requestAnimationFrame(raf);

    // Watch body height changes to resize Lenis automatically (fixes Next.js dynamic heights)
    const resizeObserver = new ResizeObserver(() => {
      lenis.resize();
    });
    
    if (document.body) {
      resizeObserver.observe(document.body);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      lenis.destroy();
      lenisRef.current = null;
      if (typeof window !== 'undefined') {
        delete (window as any).lenis;
      }
    };
  }, []);

  // ── Route Change Handling: Reset scroll position and recalculate height ──
  useEffect(() => {
    if (lenisRef.current) {
      // Instantly scroll to the top
      lenisRef.current.scrollTo(0, { immediate: true });
      
      // Give DOM time to update, then recalculate scroll dimensions
      const timer1 = setTimeout(() => {
        lenisRef.current?.resize();
      }, 50);
      const timer2 = setTimeout(() => {
        lenisRef.current?.resize();
      }, 250);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return <>{children}</>;
}
