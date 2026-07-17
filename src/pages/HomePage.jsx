import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiActivity } from 'react-icons/fi';
import GlassCard from '../components/ui/GlassCard';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { trendingApi, historyApi } from '../api/gameApi';
import useAuthStore from '../store/authStore';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import PostComposer from '../components/post/PostComposer';
import PostCard from '../components/post/PostCard';
import { postApi } from '../api/postApi';

export default function HomePage() {
  const user = useAuthStore((s) => s.user);

  const { data: trending, isLoading: trendingLoading } = useQuery({
    queryKey: ['trending', 'users'],
    queryFn: () => trendingApi.getUsers({ limit: 5 }).then((r) => r.data.data),
  });

  const { data: activity, isLoading: activityLoading } = useQuery({
    queryKey: ['activity', user?._id],
    queryFn: () => historyApi.getUserActivity(user._id, { limit: 10 }).then((r) => r.data.data),
    enabled: !!user?._id,
  });

  const { data: feed } = useQuery({
    queryKey: ['feed'],
    queryFn: () => postApi.getFeed({ limit: 10 }).then((r) => r.data),
  });

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard>
            <h2 className="font-display text-2xl font-bold">
              Welcome back, <span className="text-upnext-primary">{user?.displayName}</span>
            </h2>
            <div className="mt-6 grid grid-cols-3 gap-4">
              <StatBlock label="Fame" value={user?.fameScore ?? 0} />
              <StatBlock label="Followers" value={user?.followersCount ?? 0} />
              <StatBlock label="Level" value={user?.level ?? 1} />
            </div>
          </GlassCard>
        </motion.div>

        <PostComposer />
        <div className="space-y-4">
          {feed?.data?.map((post) => <PostCard key={post._id} post={post} />)}
        </div>

        <GlassCard>
          <div className="mb-4 flex items-center gap-2">
            <FiActivity className="text-upnext-primary" />
            <h3 className="font-semibold">Your Activity</h3>
          </div>

          {activityLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14" />)}
            </div>
          ) : activity?.length ? (
            <div className="space-y-3">
              {activity.map((item) => (
                <div key={item._id} className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
                  <div className="h-2 w-2 rounded-full bg-upnext-primary" />
                  <p className="text-sm text-upnext-muted">{formatActivityType(item.type)}</p>
                  <span className="ml-auto text-xs text-upnext-muted">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={FiActivity} title="No activity yet" subtitle="Start following, hosting, and achieving." />
          )}
        </GlassCard>
      </div>

      <div className="space-y-6">
        <GlassCard>
          <div className="mb-4 flex items-center gap-2">
            <FiTrendingUp className="text-upnext-gold" />
            <h3 className="font-semibold">Trending Now</h3>
          </div>

          {trendingLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12" />)}
            </div>
          ) : trending?.length ? (
            <div className="space-y-3">
              {trending.map((t, i) => (
                <div key={t.user._id} className="flex items-center gap-3">
                  <span className="font-display text-lg text-upnext-muted">#{i + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{t.user.displayName}</p>
                    <p className="text-xs text-upnext-muted">{t.trendingScore} fame gained</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={FiTrendingUp} title="Nothing trending yet" />
          )}
        </GlassCard>
      </div>
    </div>
  );
}

function StatBlock({ label, value }) {
  return (
    <div className="rounded-xl bg-white/5 p-4 text-center">
      <p className="font-display text-2xl font-bold text-upnext-primary">
        <AnimatedCounter value={value} />
      </p>
      <p className="text-xs text-upnext-muted">{label}</p>
    </div>
  );
}

function formatActivityType(type) {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}