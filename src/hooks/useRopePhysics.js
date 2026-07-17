import { useRef, useCallback } from 'react';
import gsap from 'gsap';

export function useRopePhysics({ onPulled }) {
  const ropeRef = useRef(null);
  const isDraggingRef = useRef(false);
  const pulledRef = useRef(false);
  const startYRef = useRef(0);

  const swingIdle = useCallback(() => {
    if (!ropeRef.current || pulledRef.current) return;
    gsap.to(ropeRef.current.rotation, {
      z: 0.07, // radians, ~4deg — Three.js rotation is in radians not degrees
      duration: 2.2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  }, []);

  const handlePointerDown = useCallback((e) => {
    if (pulledRef.current || !ropeRef.current) return;
    isDraggingRef.current = true;
    startYRef.current = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    gsap.killTweensOf(ropeRef.current.rotation);
    gsap.killTweensOf(ropeRef.current.scale);
    e.target?.setPointerCapture?.(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!isDraggingRef.current || !ropeRef.current || pulledRef.current) return;

    const currentY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    const delta = Math.max(0, currentY - startYRef.current);
    const clamped = Math.min(delta, 140);

    gsap.set(ropeRef.current.scale, { y: 1 + clamped / 200 });

    if (clamped > 110) {
      isDraggingRef.current = false;
      pulledRef.current = true;

      gsap.to(ropeRef.current.scale, {
        y: 1.3,
        duration: 0.15,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to(ropeRef.current.scale, {
            y: 1,
            duration: 0.4,
            ease: 'elastic.out(1, 0.3)',
          });
          onPulled?.();
        },
      });
    }
  }, [onPulled]);

  const handlePointerUp = useCallback(() => {
    if (!ropeRef.current || pulledRef.current) return;
    isDraggingRef.current = false;
    gsap.to(ropeRef.current.scale, {
      y: 1,
      duration: 0.6,
      ease: 'elastic.out(1, 0.4)',
    });
  }, []);

  return { ropeRef, swingIdle, handlePointerDown, handlePointerMove, handlePointerUp };
}