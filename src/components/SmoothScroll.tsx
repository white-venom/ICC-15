'use client';

import { ReactLenis } from 'lenis/react';
import { useRef } from 'react';
import React from 'react';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<any>(null);

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        duration: 1.6,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
