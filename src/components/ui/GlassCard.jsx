import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', hover = true, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -3 } : undefined}
      className={`rounded-2xl border border-upnext-border bg-upnext-surface/60 p-6 backdrop-blur-xl transition-shadow hover:shadow-lg hover:shadow-black/20 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}