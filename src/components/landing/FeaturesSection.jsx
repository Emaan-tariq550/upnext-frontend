import { motion } from 'framer-motion';
import { FiActivity } from 'react-icons/fi';
import { FEATURES } from '../../content/landingContent';

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-4xl font-bold md:text-5xl"
        >
          Everything Fame Requires
        </motion.h2>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              data-cursor-hover
              className="group rounded-2xl border border-upnext-border bg-upnext-surface/60 p-6 backdrop-blur-md transition-colors hover:border-upnext-primary/50"
            >
              <FiActivity className="mb-4 h-8 w-8 text-upnext-primary transition-transform group-hover:scale-110" />
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-upnext-muted">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}