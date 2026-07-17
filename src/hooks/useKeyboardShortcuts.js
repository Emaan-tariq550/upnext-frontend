import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SHORTCUTS = {
  g_h: '/home',
  g_p: '/profile',
  g_f: '/friends',
  g_b: '/businesses',
  g_e: '/events',
  g_m: '/messages',
  g_n: '/notifications',
  g_l: '/leaderboards',
  g_t: '/trending',
  g_s: '/settings',
};

export function useKeyboardShortcuts() {
  const navigate = useNavigate();

  useEffect(() => {
    let pendingG = false;
    let timeoutId = null;

    const handleKeyDown = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key === 'g') {
        pendingG = true;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => (pendingG = false), 800);
        return;
      }

      if (pendingG) {
        const path = SHORTCUTS[`g_${e.key}`];
        if (path) {
          navigate(path);
          pendingG = false;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeoutId);
    };
  }, [navigate]);
}