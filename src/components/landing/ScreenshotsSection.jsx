import { motion } from 'framer-motion';

const SCREENSHOTS = [
  { label: 'Profile & Fame Timeline' },
  { label: 'Business Dashboard' },
  { label: 'Live Event Check-in' },
  { label: 'Global Leaderboards' },
];

export default function ScreenshotsSection() {
  return (
    <section className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-4xl font-bold md:text-5xl"
        >
          See It In Action
        </motion.h2>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          {SCREENSHOTS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              data-cursor-hover
              className="group relative aspect-video overflow-hidden rounded-2xl border border-upnext-border bg-upnext-surface"
            >
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-upnext-primary/10 to-upnext-gold/10">
                <span className="font-display text-upnext-muted">{s.label}</span>
              </div>
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}