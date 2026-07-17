// GlowButton.jsx
import { motion } from 'framer-motion';
import { FiLoader } from 'react-icons/fi';

export default function GlowButton({ children, isLoading, className = '', ...props }) {
  return (
    <motion.button
      data-cursor-hover
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      disabled={isLoading}
      className={`relative overflow-hidden rounded-xl bg-gradient-to-r from-upnext-primary to-upnext-primary-dark px-5 py-3 font-semibold text-black shadow-lg transition-shadow hover:shadow-upnext-primary/40 disabled:opacity-60 ${className}`}
      {...props}
    >
      <span className="flex items-center justify-center gap-2">
        {isLoading && <FiLoader className="animate-spin" />}
        {children}
      </span>
    </motion.button>
  );
}