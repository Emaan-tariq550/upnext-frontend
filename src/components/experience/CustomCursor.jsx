import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });
  const ringPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // 1. Check for touch devices OR user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (window.matchMedia('(pointer: coarse)').matches || prefersReducedMotion) {
      return undefined;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;

    const handleMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      gsap.set(dot, { x: e.clientX, y: e.clientY });
    };

    const handleDown = () => gsap.to(ring, { scale: 0.7, duration: 0.2 });
    const handleUp = () => gsap.to(ring, { scale: 1, duration: 0.2 });

    let rafId;
    const animateRing = () => {
      ringPosRef.current.x += (posRef.current.x - ringPosRef.current.x) * 0.15;
      ringPosRef.current.y += (posRef.current.y - ringPosRef.current.y) * 0.15;
      gsap.set(ring, { x: ringPosRef.current.x, y: ringPosRef.current.y });
      rafId = requestAnimationFrame(animateRing);
    };
    animateRing();

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);

    // Dynamic hover bindings for interactive components
    const hoverElements = document.querySelectorAll('[data-cursor-hover]');
    
    const handleMouseEnter = () => gsap.to(ring, { scale: 1.8, duration: 0.3 });
    const handleMouseLeave = () => gsap.to(ring, { scale: 1, duration: 0.3 });

    hoverElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    // Cleanup listeners and animation loops cleanly
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
      cancelAnimationFrame(rafId);
      
      hoverElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block">
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-upnext-primary-glow"
      />
      <div
        ref={ringRef}
        className="fixed left-0 top-0 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-upnext-primary/60"
        style={{ boxShadow: '0 0 20px rgba(167,139,250,0.35)' }}
      />
    </div>
  );
}