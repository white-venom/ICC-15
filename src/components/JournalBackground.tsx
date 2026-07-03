'use client';

import React, { useEffect, useRef } from 'react';

interface InkBlob {
  x: number;
  y: number;
  radius: number;
  baseRadius: number;
  vx: number;
  vy: number;
  color: string;
  growSpeed: number;
  offset: number;
}

export default function JournalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Dynamic fluid blobs representing dark ink & gold bleeding
    const blobs: InkBlob[] = [];
    const colors = [
      'rgba(212, 175, 55, 0.15)',  // Gold ink (more intense to survive blur)
      'rgba(235, 220, 185, 0.12)', // Champagne ink
      'rgba(50, 50, 50, 0.5)',     // Dark grey ink
      'rgba(30, 30, 30, 0.7)',     // Deep matte-black ink
    ];

    for (let i = 0; i < 8; i++) {
      const radius = Math.random() * 250 + 200;
      blobs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius,
        baseRadius: radius,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        color: colors[i % colors.length],
        growSpeed: Math.random() * 0.0015 + 0.0008,
        offset: Math.random() * Math.PI * 2,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let time = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 1;

      // Enable canvas blurring to simulate organic bleed/ink dispersion
      ctx.filter = 'blur(70px)';

      blobs.forEach((blob) => {
        // Move blobs slowly
        blob.x += blob.vx;
        blob.y += blob.vy;

        // Bounce off bounds
        if (blob.x < -150 || blob.x > width + 150) blob.vx *= -1;
        if (blob.y < -150 || blob.y > height + 150) blob.vy *= -1;

        // Slow breathing size variation
        blob.radius = blob.baseRadius + Math.sin(time * blob.growSpeed + blob.offset) * 60;

        ctx.beginPath();
        ctx.arc(blob.x, blob.y, Math.max(10, blob.radius), 0, Math.PI * 2);
        ctx.fillStyle = blob.color;
        ctx.fill();
      });

      ctx.filter = 'none'; // reset filter for optimization

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
