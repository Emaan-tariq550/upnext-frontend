import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const TICKER_ITEMS = [
  '🔥 @novastar is trending',
  '🏆 Midnight Cafe hit 10K followers',
  '🎤 Global Beats Concert — 500 checked in',
  '📈 @luxe just crossed 50,000 fame',
  '🚀 TechForge Startup reached Legendary tier',
];

export default function TrendingTickerSection() {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    const totalWidth = track.scrollWidth / 2;

    const tween = gsap.to(track, {
      x: -totalWidth,
      duration: 25,
      ease: 'none',
      repeat: -1,
    });

    return () => tween.kill();
  }, []);

  return (
    <section className="relative overflow-hidden border-y border-upnext-border bg-upnext-surface/40 py-6">
      <div ref={trackRef} className="flex w-max gap-12 whitespace-nowrap">
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span key={i} className="text-sm font-medium text-upnext-muted">
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}