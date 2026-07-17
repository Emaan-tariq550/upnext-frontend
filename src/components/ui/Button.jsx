import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary: 'bg-upnext-primary hover:bg-upnext-primaryDark text-white',
  ghost: 'bg-transparent border border-upnext-border hover:bg-upnext-surface text-upnext-text',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
};

export default function Button({
  children,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </motion.button>
  );
}