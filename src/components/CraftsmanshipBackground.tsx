'use client';

import React, { useEffect, useRef } from 'react';

export default function CraftsmanshipBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Load the actual logo PNG
    const logoImg = new Image();
    logoImg.src = '/assets/logo/logo.png';
    let logoReady = false;
    logoImg.onload = () => { logoReady = true; };

    // Center logo — stationary, large, prominent
    const centerLogo = {
      size: 480,
      opacity: 0.22,
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw center logo only — stationary, no rotation, no orbitals
      if (logoReady) {
        const half = centerLogo.size / 2;
        ctx.save();
        ctx.globalAlpha = centerLogo.opacity;
        ctx.drawImage(logoImg, width / 2 - half, height / 2 - half, centerLogo.size, centerLogo.size);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[1] bg-[#050505]"
    />
  );
}
