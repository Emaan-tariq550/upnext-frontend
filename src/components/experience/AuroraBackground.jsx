import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function AuroraBackground() {
  const blob1 = useRef(null);
  const blob2 = useRef(null);
  const blob3 = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' } });
    tl.to(blob1.current, { x: 100, y: -50, scale: 1.2, duration: 8 }, 0);
    tl.to(blob2.current, { x: -80, y: 60, scale: 1.1, duration: 10 }, 0);
    tl.to(blob3.current, { x: 50, y: 80, scale: 1.3, duration: 9 }, 0);

    return () => tl.kill();
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        ref={blob1}
        className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-upnext-primary/25 blur-[120px]"
      />
      <div
        ref={blob2}
        className="absolute right-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-upnext-gold/15 blur-[120px]"
      />
      <div
        ref={blob3}
        className="absolute bottom-0 left-1/3 h-[450px] w-[450px] rounded-full bg-purple-600/20 blur-[130px]"
      />
    </div>
  );
}