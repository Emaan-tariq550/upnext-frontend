import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiWifiOff } from 'react-icons/fi';
import { useSocket } from '../../hooks/useSocket';

export default function ConnectionBanner() {
  const socket = useSocket();
  const [disconnected, setDisconnected] = useState(false);

  useEffect(() => {
    if (!socket) return undefined;

    const handleDisconnect = () => setDisconnected(true);
    const handleReconnect = () => setDisconnected(false);

    socket.on('disconnect', handleDisconnect);
    socket.on('connect', handleReconnect);

    return () => {
      socket.off('disconnect', handleDisconnect);
      socket.off('connect', handleReconnect);
    };
  }, [socket]);

  return (
    <AnimatePresence>
      {disconnected && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed left-1/2 top-4 z-[300] flex -translate-x-1/2 items-center gap-2 rounded-full bg-red-500/90 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-sm"
        >
          <FiWifiOff /> Reconnecting...
        </motion.div>
      )}
    </AnimatePresence>
  );
}