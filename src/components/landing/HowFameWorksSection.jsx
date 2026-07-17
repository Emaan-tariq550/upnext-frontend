import { motion } from 'framer-motion';
import { FAME_STEPS } from '../../content/landingContent';

export default function HowFameWorksSection() {
  return (
    <section className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center font-display text-4xl font-bold md:text-5xl"
        >
          How Fame Works
        </motion.h2>

        <div className="relative mt-20 grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-upnext-primary/40 to-transparent md:block" />

          {FAME_STEPS.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative z-10 mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-upnext-primary/50 bg-upnext-surface font-display text-xl font-bold text-upnext-primary">
                {s.step}
              </div>
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-upnext-muted">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}