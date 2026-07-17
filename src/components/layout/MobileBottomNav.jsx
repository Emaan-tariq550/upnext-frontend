import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiUsers, FiCalendar, FiMessageSquare, FiUser } from 'react-icons/fi';
import useNotificationStore from '../../store/notificationStore';

const MOBILE_NAV_ITEMS = [
  { to: '/home', icon: FiHome, label: 'Home' },
  { to: '/friends', icon: FiUsers, label: 'Friends' },
  { to: '/events', icon: FiCalendar, label: 'Events' },
  { to: '/messages', icon: FiMessageSquare, label: 'Chat' },
  { to: '/profile', icon: FiUser, label: 'Profile' },
];

export default function MobileBottomNav() {
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-upnext-border bg-upnext-surface/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
      aria-label="Primary mobile navigation"
    >
      {MOBILE_NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `relative flex flex-1 flex-col items-center gap-1 py-3 text-xs ${
              isActive ? 'text-upnext-primary' : 'text-upnext-muted'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-active"
                  className="absolute top-0 h-0.5 w-8 rounded-full bg-upnext-primary"
                />
              )}
              <div className="relative">
                <item.icon className="h-5 w-5" />
                {item.to === '/messages' && unreadCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-upnext-gold text-[9px] font-bold text-black">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <span>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}