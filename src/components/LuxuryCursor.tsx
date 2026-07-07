'use client';
 
import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, type Variants } from 'framer-motion';
import { usePathname } from 'next/navigation';
 
export default function LuxuryCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hoveredType, setHoveredType] = useState<'default' | 'button' | 'link' | 'interactive-3d' | 'view'>('default');
  const [cursorText, setCursorText] = useState('');
  
  const cursorRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  
  // Custom spring physics for organic lag and follow effect
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  
  const springConfig = { damping: 30, stiffness: 250, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);
 
  useEffect(() => {
    // Disable custom cursor on /admin page
    if (pathname === '/admin') {
      document.documentElement.classList.remove('custom-cursor-active');
      setEnabled(false);
      return;
    }

    // Only enable custom cursor on fine-pointer devices (laptops/desktops with mouse)
    const hasMouse = window.matchMedia('(pointer: fine)').matches;
    if (!hasMouse) return;

    // Add CSS cursor-hide class to HTML element
    document.documentElement.classList.add('custom-cursor-active');
    
    // Wrap in requestAnimationFrame to avoid synchronous setState inside render context warning
    const rafId = requestAnimationFrame(() => {
      setEnabled(true);
    });
 
    const moveCursor = (e: MouseEvent) => {
      // Offset cursor by half of its default width (12px / 2 = 6px)
      mouseX.set(e.clientX - 6);
      mouseY.set(e.clientY - 6);
    };
 
    window.addEventListener('mousemove', moveCursor);
 
    // Event listeners to detect hovering over buttons, links, etc.
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const closestLink = target.closest('a');
      const closestButton = target.closest('button');
      const closestInteractive3d = target.closest('[data-cursor="interactive-3d"]');
      const closestView = target.closest('[data-cursor="view"]');
      
      if (closestInteractive3d) {
        setHoveredType('interactive-3d');
        setCursorText('DRAG');
      } else if (closestView) {
        setHoveredType('view');
        setCursorText('VIEW');
      } else if (closestButton) {
        setHoveredType('button');
      } else if (closestLink) {
        setHoveredType('link');
      } else {
        setHoveredType('default');
        setCursorText('');
      }
    };
 
    window.addEventListener('mouseover', handleMouseOver);
 
    return () => {
      cancelAnimationFrame(rafId);
      document.documentElement.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY, pathname]);
 
  if (!enabled || pathname === '/admin') return null;
 
  // Variants for cursor size, borders, backgrounds
  const variants: Variants = {
    default: {
      width: 12,
      height: 12,
      backgroundColor: '#d4af37', // Soft Gold
      border: 'none',
      borderRadius: '50%',
    },
    button: {
      width: 48,
      height: 48,
      backgroundColor: 'transparent',
      border: '1px solid #d4af37',
      borderRadius: '50%',
      x: -18,
      y: -18,
    },
    link: {
      width: 32,
      height: 32,
      backgroundColor: 'rgba(214, 175, 55, 0.1)',
      border: '1px solid #d4af37',
      borderRadius: '50%',
      x: -10,
      y: -10,
    },
    'interactive-3d': {
      width: 64,
      height: 64,
      backgroundColor: '#faf8f5',
      border: '1px solid #d4af37',
      borderRadius: '50%',
      x: -26,
      y: -26,
    },
    view: {
      width: 64,
      height: 64,
      backgroundColor: '#2b1e17',
      border: '1px solid #d4af37',
      borderRadius: '50%',
      x: -26,
      y: -26,
    }
  };
 
  return (
    <>
      {/* Outer follow element */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-9999 flex items-center justify-center font-sans font-medium text-[9px] tracking-[0.15em] text-matte-black select-none mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
        }}
        animate={hoveredType}
        variants={variants}
        transition={{ type: 'spring', damping: 25, stiffness: 200, mass: 0.2 }}
      >
        {cursorText && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={hoveredType === 'interactive-3d' ? 'text-matte-black' : 'text-ivory'}
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>
    </>
  );
}
