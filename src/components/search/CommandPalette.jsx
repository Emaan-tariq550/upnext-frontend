import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiSearch, FiUser, FiBriefcase, FiCalendar, FiAward } from 'react-icons/fi';
import { searchApi } from '../../api/gameApi';

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ['global-search', query],
    queryFn: () => searchApi.search(query, 5).then((r) => r.data.data),
    enabled: query.trim().length > 0,
  });

  const handleKeyDown = useCallback((e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setOpen((prev) => !prev);
    }
    if (e.key === 'Escape') setOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const goTo = (path) => {
    navigate(path);
    setOpen(false);
    setQuery('');
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/70 p-4 pt-24 backdrop-blur-sm sm:pt-32"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            onClick={(e) => e.stopPropagation()}
            className="w-[calc(100%-2rem)] max-w-xl rounded-2xl border border-upnext-border bg-upnext-surface shadow-2xl sm:w-full"
          >
            <div className="flex items-center gap-3 border-b border-upnext-border px-4 py-3">
              <FiSearch className="text-upnext-muted" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search players, businesses, events..."
                className="flex-1 bg-transparent outline-none placeholder:text-upnext-muted"
              />
              <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-upnext-muted">ESC</kbd>
            </div>

            <div className="max-h-96 overflow-y-auto p-2">
              {data?.users?.length > 0 && (
                <ResultGroup icon={FiUser} label="Players">
                  {data.users.map((u) => (
                    <ResultItem key={u._id} label={u.displayName} sub={`@${u.username}`} onClick={() => goTo(`/profile/${u._id}`)} />
                  ))}
                </ResultGroup>
              )}
              {data?.businesses?.length > 0 && (
                <ResultGroup icon={FiBriefcase} label="Businesses">
                  {data.businesses.map((b) => (
                    <ResultItem key={b._id} label={b.name} sub={b.type} onClick={() => goTo(`/businesses/${b._id}`)} />
                  ))}
                </ResultGroup>
              )}
              {data?.events?.length > 0 && (
                <ResultGroup icon={FiCalendar} label="Events">
                  {data.events.map((e) => (
                    <ResultItem key={e._id} label={e.title} sub={e.type} onClick={() => goTo(`/events/${e._id}`)} />
                  ))}
                </ResultGroup>
              )}
              {data?.achievements?.length > 0 && (
                <ResultGroup icon={FiAward} label="Achievements">
                  {data.achievements.map((a) => (
                    <ResultItem key={a._id} label={a.name} sub={a.category} onClick={() => goTo('/achievements')} />
                  ))}
                </ResultGroup>
              )}
              {query && !data?.users?.length && !data?.businesses?.length && !data?.events?.length && (
                <p className="p-6 text-center text-sm text-upnext-muted">No results found</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ResultGroup({ icon: Icon, label, children }) {
  return (
    <div className="mb-2">
      <p className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-upnext-muted">
        <Icon className="h-3.5 w-3.5" /> {label}
      </p>
      {children}
    </div>
  );
}

function ResultItem({ label, sub, onClick }) {
  return (
    <button
      data-cursor-hover
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-white/5"
    >
      <span>{label}</span>
      <span className="text-xs text-upnext-muted">{sub}</span>
    </button>
  );
}