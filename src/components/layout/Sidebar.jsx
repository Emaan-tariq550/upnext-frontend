import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiHome, FiUser, FiUsers, FiBriefcase, FiCalendar, FiBell,
  FiMessageSquare, FiAward, FiTrendingUp, FiClock, FiSettings, FiSearch,
} from 'react-icons/fi';
import useAuthStore from '../../store/authStore';
import useNotificationStore from '../../store/notificationStore';

const NAV_ITEMS = [
  { to: '/home', icon: FiHome, label: 'Home' },
  { to: '/search', icon: FiSearch, label: 'Search' },
  { to: '/friends', icon: FiUsers, label: 'Friends' },
  { to: '/businesses', icon: FiBriefcase, label: 'Businesses' },
  { to: '/events', icon: FiCalendar, label: 'Events' },
  { to: '/messages', icon: FiMessageSquare, label: 'Messages' },
  { to: '/notifications', icon: FiBell, label: 'Notifications', badge: true },
  { to: '/achievements', icon: FiAward, label: 'Achievements' },
  { to: '/leaderboards', icon: FiTrendingUp, label: 'Leaderboards' },
  { to: '/history', icon: FiClock, label: 'History' },
  { to: '/settings', icon: FiSettings, label: 'Settings' },
];

export default function Sidebar() {
  const user = useAuthStore((s) => s.user);
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed left-4 top-4 bottom-4 z-40 flex w-20 flex-col items-center gap-2 rounded-2xl border border-upnext-border bg-upnext-surface/70 py-6 backdrop-blur-xl lg:w-64 lg:items-stretch lg:px-4"
    >
      {/* Profile NavLink — Added accessible aria-label */}
      <NavLink 
        to="/profile" 
        data-cursor-hover 
        aria-label="View Profile"
        className="mb-6 flex items-center gap-3 px-2"
      >
        <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-upnext-primary/50 bg-upnext-primary/20">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.displayName} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-display text-upnext-primary">
              {user?.displayName?.[0]?.toUpperCase()}
            </div>
          )}
        </div>
        <div className="hidden lg:block">
          <p className="text-sm font-semibold">{user?.displayName}</p>
          <p className="text-xs text-upnext-muted">{user?.fameScore ?? 0} fame</p>
        </div>
      </NavLink>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            data-cursor-hover
            aria-label={item.label} // <-- Snippet instruction applied here
            className={({ isActive }) =>
              `relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                isActive ? 'bg-upnext-primary/15 text-upnext-primary' : 'text-upnext-muted hover:bg-white/5 hover:text-upnext-text'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-upnext-primary/10"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className="relative z-10 h-5 w-5 shrink-0" />
                <span className="relative z-10 hidden text-sm font-medium lg:inline">{item.label}</span>
                {item.badge && unreadCount > 0 && (
                  <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-upnext-gold text-[10px] font-bold text-black lg:right-3">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </motion.aside>
  );
}