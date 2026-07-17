import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TESTIMONIALS } from '../../content/landingContent';

export default function TestimonialsSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-32 px-6">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-16 font-display text-4xl font-bold md:text-5xl">What Players Say</h2>

        <div className="relative h-40">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <p className="text-xl italic text-upnext-text">"{TESTIMONIALS[index].quote}"</p>
              <p className="mt-4 text-sm text-upnext-primary">— {TESTIMONIALS[index].author}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              data-cursor-hover
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? 'w-6 bg-upnext-primary' : 'w-1.5 bg-upnext-border'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}