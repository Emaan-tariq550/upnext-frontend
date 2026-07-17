import { useRef } from 'react';
import { motion } from 'framer-motion';
import { BUSINESS_TYPES_SHOWCASE } from '../../content/landingContent';

function TiltCard({ item }) {
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `perspective(600px) rotateX(${-y / 15}deg) rotateY(${x / 15}deg) scale(1.03)`;
  };

  const handleMouseLeave = () => {
    ref.current.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale(1)';
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor-hover
      className="rounded-2xl border border-upnext-border bg-gradient-to-br from-upnext-surface to-upnext-surface-2 p-6 transition-transform duration-200 ease-out"
    >
      <h3 className="text-lg font-semibold text-upnext-primary-glow">{item.name}</h3>
      <p className="mt-2 text-sm text-upnext-muted">{item.tagline}</p>
    </div>
  );
}

export default function BusinessesSection() {
  return (
    <section className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-4xl font-bold md:text-5xl"
        >
          Build Your Empire
        </motion.h2>
        <p className="mt-4 max-w-xl text-upnext-muted">
          Twelve business types, each with employees, revenue, reviews, and their own leaderboard.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BUSINESS_TYPES_SHOWCASE.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <TiltCard item={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}