import { motion } from 'framer-motion';
import { FiCalendar } from 'react-icons/fi';
import { EVENT_TYPES_SHOWCASE } from '../../content/landingContent';

export default function EventsSection() {
  return (
    <section className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-4xl font-bold md:text-5xl"
        >
          Events That Matter
        </motion.h2>

        <div className="mt-16 flex gap-6 overflow-x-auto pb-4">
          {EVENT_TYPES_SHOWCASE.map((event, i) => (
            <motion.div
              key={event.name}
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              data-cursor-hover
              className="min-w-[260px] rounded-2xl border border-upnext-border bg-upnext-surface/70 p-6 backdrop-blur-md"
            >
              <FiCalendar className="mb-4 h-7 w-7 text-upnext-gold" />
              <h3 className="text-lg font-semibold">{event.name}</h3>
              <p className="mt-2 text-sm text-upnext-muted">{event.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}