import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiSearch, FiUser, FiBriefcase, FiCalendar, FiAward } from 'react-icons/fi';
import GlowInput from '../components/ui/GlowInput';
import GlassCard from '../components/ui/GlassCard';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { searchApi } from '../api/gameApi';

export default function SearchPage() {
  const [query, setQuery] = useState('');

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['search-page', query],
    queryFn: () => searchApi.search(query, 12).then((r) => r.data.data),
    enabled: query.trim().length > 0,
  });

  const hasResults = data && (data.users?.length || data.businesses?.length || data.events?.length || data.achievements?.length);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Search</h1>

      <div className="relative max-w-xl">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-upnext-muted" />
        <GlowInput
          autoFocus
          placeholder="Search players, businesses, events, achievements..."
          className="pl-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {!query.trim() ? (
        <EmptyState icon={FiSearch} title="Search UPNEXT" subtitle="Find players, businesses, events, and achievements." />
      ) : isLoading || isFetching ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-20" />)}
        </div>
      ) : hasResults ? (
        <AnimatePresence mode="wait">
          <motion.div key={query} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            {data.users?.length > 0 && (
              <ResultSection title="Players" icon={FiUser}>
                {data.users.map((u) => (
                  <Link key={u._id} to={`/profile/${u._id}`} data-cursor-hover>
                    <GlassCard className="flex items-center gap-3">
                      <div className="h-11 w-11 overflow-hidden rounded-full bg-upnext-primary/20">
                        {u.avatarUrl && <img src={u.avatarUrl} className="h-full w-full object-cover" alt="" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{u.displayName}</p>
                        <p className="truncate text-xs text-upnext-muted">@{u.username} · {u.fameScore} fame</p>
                      </div>
                    </GlassCard>
                  </Link>
                ))}
              </ResultSection>
            )}

            {data.businesses?.length > 0 && (
              <ResultSection title="Businesses" icon={FiBriefcase}>
                {data.businesses.map((b) => (
                  <Link key={b._id} to={`/businesses/${b._id}`} data-cursor-hover>
                    <GlassCard className="flex items-center gap-3">
                      <div className="h-11 w-11 overflow-hidden rounded-xl bg-upnext-primary/20">
                        {b.logoUrl && <img src={b.logoUrl} className="h-full w-full object-cover" alt="" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{b.name}</p>
                        <p className="truncate text-xs capitalize text-upnext-muted">{b.type.replace(/_/g, ' ')}</p>
                      </div>
                    </GlassCard>
                  </Link>
                ))}
              </ResultSection>
            )}

            {data.events?.length > 0 && (
              <ResultSection title="Events" icon={FiCalendar}>
                {data.events.map((e) => (
                  <Link key={e._id} to={`/events/${e._id}`} data-cursor-hover>
                    <GlassCard>
                      <p className="text-sm font-medium">{e.title}</p>
                      <p className="mt-1 text-xs text-upnext-muted">{new Date(e.startTime).toLocaleDateString()}</p>
                    </GlassCard>
                  </Link>
                ))}
              </ResultSection>
            )}

            {data.achievements?.length > 0 && (
              <ResultSection title="Achievements" icon={FiAward}>
                {data.achievements.map((a) => (
                  <GlassCard key={a._id}>
                    <p className="text-sm font-medium">{a.name}</p>
                    <p className="mt-1 text-xs capitalize text-upnext-muted">{a.category} · {a.tier}</p>
                  </GlassCard>
                ))}
              </ResultSection>
            )}
          </motion.div>
        </AnimatePresence>
      ) : (
        <EmptyState icon={FiSearch} title="No results found" subtitle={`Nothing matched "${query}"`} />
      )}
    </div>
  );
}

function ResultSection({ title, icon: Icon, children }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <Icon className="text-upnext-primary" />
        <h2 className="text-sm font-medium text-upnext-muted">{title}</h2>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );
}