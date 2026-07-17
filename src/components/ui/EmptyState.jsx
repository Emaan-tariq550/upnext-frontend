import { motion } from 'framer-motion';

export default function EmptyState({ icon: Icon, title, subtitle, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-upnext-border py-20 text-center"
    >
      {Icon && <Icon className="mb-4 h-10 w-10 text-upnext-muted" />}
      <h3 className="font-medium text-upnext-text">{title}</h3>
      {subtitle && <p className="mt-1 max-w-sm text-sm text-upnext-muted">{subtitle}</p>}
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}