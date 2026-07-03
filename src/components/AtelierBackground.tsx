'use client';

import React, { useEffect, useRef } from 'react';

interface Thread {
  points: { x: number; y: number; baseX: number; baseY: number }[];
  color: string;
  width: number;
  speed: number;
  offset: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  fadeSpeed: number;
}

export default function AtelierBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Generate threads (sine-wave bezier curves representing premium cotton threads)
    const threads: Thread[] = [];
    const threadCount = 6;
    for (let i = 0; i < threadCount; i++) {
      const points = [];
      const segmentCount = 8;
      const baseY = (height / (threadCount + 1)) * (i + 1);
      
      for (let j = 0; j <= segmentCount; j++) {
        const baseX = (width / segmentCount) * j;
        points.push({
          x: baseX,
          y: baseY,
          baseX,
          baseY,
        });
      }

      threads.push({
        points,
        color: i % 2 === 0 ? 'rgba(212, 175, 55, 0.08)' : 'rgba(250, 248, 245, 0.04)',
        width: Math.random() * 0.8 + 0.4,
        speed: Math.random() * 0.002 + 0.001,
        offset: Math.random() * Math.PI * 2,
      });
    }

    // Generate soft glowing micro-particles (cotton dust/fibers)
    const particles: Particle[] = [];
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5,
        speedY: -(Math.random() * 0.2 + 0.05),
        speedX: (Math.random() - 0.5) * 0.1,
        opacity: Math.random() * 0.4 + 0.1,
        fadeSpeed: Math.random() * 0.005 + 0.002,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    let time = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 1;

      // Draw and animate threads
      threads.forEach((thread, tIdx) => {
        ctx.beginPath();
        ctx.strokeStyle = thread.color;
        ctx.lineWidth = thread.width;

        // Animate the points organically using sine waves
        thread.points.forEach((pt, pIdx) => {
          const wave = Math.sin(time * thread.speed + pIdx * 0.5 + thread.offset) * 15;
          pt.y = pt.baseY + wave;

          // React to mouse coordinates (threads bend away/toward cursor)
          const dx = mouseRef.current.x - pt.x;
          const dy = mouseRef.current.y - pt.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const limit = 200;

          if (dist < limit) {
            const force = (limit - dist) / limit;
            pt.y += (dy / dist) * force * 35;
            pt.x += (dx / dist) * force * 15;
          } else {
            // Restore base position
            pt.x += (pt.baseX - pt.x) * 0.05;
          }
        });

        // Draw bezier curve through points
        ctx.moveTo(thread.points[0].x, thread.points[0].y);
        for (let i = 0; i < thread.points.length - 1; i++) {
          const xc = (thread.points[i].x + thread.points[i + 1].x) / 2;
          const yc = (thread.points[i].y + thread.points[i + 1].y) / 2;
          ctx.quadraticCurveTo(thread.points[i].x, thread.points[i].y, xc, yc);
        }
        ctx.stroke();
      });

      // Draw and animate floating cotton particles
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;

        // Wrap around screens
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0 || p.x > width) {
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${p.opacity})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#d4af37';
        ctx.fill();
        ctx.shadowBlur = 0; // reset shadow
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[0]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
