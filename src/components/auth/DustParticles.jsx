import { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function DustParticles({ visible }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 6 + Math.random() * 6,
        size: 1 + Math.random() * 2,
      })),
    []
  );

  if (!visible) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: '110%', opacity: 0 }}
          animate={{ y: '-10%', opacity: [0, 0.6, 0.6, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
          className="absolute rounded-full bg-amber-200/60"
          style={{ left: `${p.left}%`, width: p.size, height: p.size }}
        />
      ))}
    </div>
  );
}