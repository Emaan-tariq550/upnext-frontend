import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';
import { FAQS } from '../../content/landingContent';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="mx-auto max-w-3xl px-6 py-32">
      <h2 className="mb-12 text-center font-display text-4xl font-bold">Questions</h2>
      <div className="space-y-3">
        {FAQS.map((item, i) => (
          <div key={item.q} className="overflow-hidden rounded-xl border border-upnext-border bg-upnext-surface/50">
            <button
              data-cursor-hover
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between px-6 py-4 text-left font-medium"
            >
              {item.q}
              <motion.div animate={{ rotate: openIndex === i ? 180 : 0 }}>
                <FiChevronDown />
              </motion.div>
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6"
                >
                  <p className="pb-4 text-sm text-upnext-muted">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}