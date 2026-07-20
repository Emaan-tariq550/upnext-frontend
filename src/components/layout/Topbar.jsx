import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLogOut, FiChevronDown } from 'react-icons/fi';
import useAuthStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function Topbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-3 z-30 mx-3 flex items-center justify-between rounded-2xl border border-upnext-border bg-upnext-surface/60 px-4 py-3 backdrop-blur-xl sm:mx-4 sm:top-4 sm:px-6 md:ml-72">
      <div>
        <p className="text-xs text-upnext-muted">Level {user?.level ?? 1}</p>
        <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-upnext-border sm:w-32">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((user?.xp ?? 0) % 100)}%` }}
            className="h-full bg-gradient-to-r from-upnext-primary to-upnext-gold"
          />
        </div>
      </div>

      <div className="relative">
        <button
          data-cursor-hover
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 rounded-xl px-2 py-2 hover:bg-white/5 sm:px-3"
        >
          <span className="max-w-[100px] truncate text-sm sm:max-w-none">{user?.displayName}</span>
          <FiChevronDown className={`shrink-0 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-upnext-border bg-upnext-surface p-2 shadow-xl"
            >
              <button
                onClick={handleLogout}
                data-cursor-hover
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
              >
                <FiLogOut /> Log out
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}