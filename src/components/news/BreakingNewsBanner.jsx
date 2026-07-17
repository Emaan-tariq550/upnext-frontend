import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiZap, FiX } from 'react-icons/fi';
import { useSocket } from '../../hooks/useSocket';

export default function BreakingNewsBanner() {
  const socket = useSocket();
  const [breaking, setBreaking] = useState(null);

  useEffect(() => {
    if (!socket) return undefined;

    const handleBreaking = (article) => {
      setBreaking(article);
    };

    socket.on('news:breaking', handleBreaking);
    return () => socket.off('news:breaking', handleBreaking);
  }, [socket]);

  return (
    <AnimatePresence>
      {breaking && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed left-0 right-0 top-0 z-[60] flex items-center gap-3 bg-red-600 px-4 py-2.5 text-sm text-white shadow-lg"
        >
          <motion.span
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="flex shrink-0 items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold"
          >
            <FiZap className="h-3 w-3" /> BREAKING
          </motion.span>

          <Link to={`/news/${breaking._id}`} onClick={() => setBreaking(null)} data-cursor-hover className="flex-1 truncate font-medium hover:underline">
            {breaking.business?.name}: {breaking.headline}
          </Link>

          <button onClick={() => setBreaking(null)} data-cursor-hover className="shrink-0 rounded-full p-1 hover:bg-white/10">
            <FiX className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}