import { motion } from 'framer-motion';
import { FiAward } from 'react-icons/fi';
import { AWARDS } from '../../content/landingContent';

export default function AwardsSection() {
  return (
    <section className="relative py-32 px-6">
      <div className="mx-auto max-w-5xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-4xl font-bold md:text-5xl"
        >
          Hall of Fame
        </motion.h2>
        <p className="mx-auto mt-4 max-w-xl text-upnext-muted">
          Permanent server history. No record is ever deleted.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {AWARDS.map((award, i) => (
            <motion.div
              key={award.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative rounded-2xl border border-upnext-gold/30 bg-gradient-to-b from-upnext-gold/10 to-transparent p-8"
            >
              <FiAward className="mx-auto mb-4 h-10 w-10 text-upnext-gold" />
              <h3 className="text-lg font-semibold">{award.title}</h3>
              <p className="mt-2 text-sm text-upnext-muted">{award.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}