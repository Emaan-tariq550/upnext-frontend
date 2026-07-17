import { motion } from 'framer-motion';

export default function AuthCard({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-upnext-bg px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-2xl border border-upnext-border bg-upnext-surface p-8 shadow-xl"
      >
        <h1 className="font-display text-2xl font-bold text-upnext-primary">UPNEXT</h1>
        <h2 className="mt-4 text-xl font-semibold">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-upnext-muted">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </motion.div>
    </div>
  );
}