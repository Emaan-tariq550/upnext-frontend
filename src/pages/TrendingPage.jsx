import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiBriefcase, FiCalendar } from 'react-icons/fi';
import GlassCard from '../components/ui/GlassCard';
import Skeleton from '../components/ui/Skeleton';
import { trendingApi } from '../api/gameApi';

export default function TrendingPage() {
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['trending', 'users', 'full'],
    queryFn: () => trendingApi.getUsers({ limit: 20 }).then((r) => r.data.data),
  });

  const { data: businesses, isLoading: bizLoading } = useQuery({
    queryKey: ['trending', 'businesses', 'full'],
    queryFn: () => trendingApi.getBusinesses({ limit: 12 }).then((r) => r.data.data),
  });

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ['trending', 'events', 'full'],
    queryFn: () => trendingApi.getEvents({ limit: 12 }).then((r) => r.data.data),
  });

  return (
    <div className="space-y-10">
      <h1 className="font-display text-2xl font-bold">Trending</h1>

      <TrendingSection title="Trending Players" icon={FiTrendingUp} isLoading={usersLoading}>
        {users?.map((t, i) => (
          <GlassCard key={t.user._id} className="flex items-center gap-3">
            <span className="font-display text-lg text-upnext-muted">#{i + 1}</span>
            <div className="h-10 w-10 overflow-hidden rounded-full bg-upnext-primary/20">
              {t.user.avatarUrl && <img src={t.user.avatarUrl} className="h-full w-full object-cover" alt="" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium">{t.user.displayName}</p>
              <p className="text-xs text-upnext-primary">+{t.trendingScore} fame</p>
            </div>
          </GlassCard>
        ))}
      </TrendingSection>

      <TrendingSection title="Trending Businesses" icon={FiBriefcase} isLoading={bizLoading}>
        {businesses?.map((b) => (
          <GlassCard key={b._id} className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-xl bg-upnext-primary/20">
              {b.logoUrl && <img src={b.logoUrl} className="h-full w-full object-cover" alt="" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium">{b.name}</p>
              <p className="text-xs text-upnext-muted">{b.popularity} popularity</p>
            </div>
          </GlassCard>
        ))}
      </TrendingSection>

      <TrendingSection title="Upcoming Trending Events" icon={FiCalendar} isLoading={eventsLoading}>
        {events?.map((e) => (
          <GlassCard key={e._id}>
            <p className="text-sm font-medium">{e.title}</p>
            <p className="mt-1 text-xs text-upnext-muted">{new Date(e.startTime).toLocaleDateString()}</p>
          </GlassCard>
        ))}
      </TrendingSection>
    </div>
  );
}

function TrendingSection({ title, icon: Icon, isLoading, children }) {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <Icon className="text-upnext-gold" />
        <h2 className="font-semibold">{title}</h2>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16" />)}
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {children}
        </motion.div>
      )}
    </section>
  );
}