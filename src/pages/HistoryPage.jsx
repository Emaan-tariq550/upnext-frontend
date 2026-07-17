import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiAward, FiClock, FiRefreshCw } from 'react-icons/fi';
import GlassCard from '../components/ui/GlassCard';
import Skeleton from '../components/ui/Skeleton';
import { historyApi } from '../api/gameApi';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';

const CATEGORY_LABELS = {
  most_famous: 'Most Famous Player',
  richest_business: 'Richest Business',
  largest_event: 'Largest Event',
  biggest_achievement_unlock: 'Biggest Achievement',
};

export default function HistoryPage() {
  const queryClient = useQueryClient();

  // Mutation for Recalculation
  const recalcMutation = useMutation({
    mutationFn: () => axiosClient.post('/history/hall-of-fame/recalculate'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history', 'hall-of-fame'] });
      toast.success('Hall of Fame updated!');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update'),
  });

  // Queries
  const { data: hallOfFame, isLoading: hofLoading } = useQuery({
    queryKey: ['history', 'hall-of-fame'],
    queryFn: () => historyApi.getHallOfFame({ limit: 20 }).then((r) => r.data.data),
  });

  const { data: timeline, isLoading: timelineLoading } = useQuery({
    queryKey: ['history', 'timeline'],
    queryFn: () => historyApi.getTimeline({ limit: 30 }).then((r) => r.data.data),
  });

  return (
    <div className="space-y-10">
      <h1 className="font-display text-2xl font-bold">Server History</h1>

      {/* Hall of Fame Section */}
      <section>
        {/* Updated Heading Header with Refresh Button */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiAward className="text-upnext-gold" />
            <h2 className="font-semibold">Hall of Fame</h2>
          </div>
          <button
            data-cursor-hover
            onClick={() => recalcMutation.mutate()}
            disabled={recalcMutation.isPending}
            className="flex items-center gap-1.5 text-xs text-upnext-primary hover:underline disabled:opacity-50"
          >
            <FiRefreshCw className={recalcMutation.isPending ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        {hofLoading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {hallOfFame?.map((entry) => (
              <GlassCard key={entry._id} className="text-center">
                <p className="text-xs text-upnext-muted">{CATEGORY_LABELS[entry.category]}</p>
                <p className="mt-2 font-display font-bold text-upnext-gold">{entry.entitySnapshot.name}</p>
                <p className="mt-1 text-sm text-upnext-primary">{entry.value.toLocaleString()}</p>
                <p className="mt-2 text-[11px] text-upnext-muted">{new Date(entry.achievedAt).toLocaleDateString()}</p>
              </GlassCard>
            ))}
          </div>
        )}
      </section>

      {/* Server Timeline Section */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <FiClock className="text-upnext-primary" />
          <h2 className="font-semibold">Server Timeline</h2>
        </div>
        {timelineLoading ? (
          <div className="space-y-2">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-14" />)}</div>
        ) : (
          <div className="space-y-2">
            {timeline?.map((item, i) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
              >
                <GlassCard hover={false} className="flex items-center gap-3 py-3">
                  <div className="h-8 w-8 overflow-hidden rounded-full bg-upnext-primary/20">
                    {item.user?.avatarUrl && <img src={item.user.avatarUrl} className="h-full w-full object-cover" alt="" />}
                  </div>
                  <p className="text-sm text-upnext-muted">
                    <span className="font-medium text-upnext-text">{item.user?.displayName}</span>{' '}
                    {item.type.replace(/_/g, ' ')}
                  </p>
                  <span className="ml-auto text-xs text-upnext-muted">{new Date(item.createdAt).toLocaleDateString()}</span>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}