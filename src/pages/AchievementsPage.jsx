import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiLock, FiAward } from 'react-icons/fi';
import GlassCard from '../components/ui/GlassCard';
import Skeleton from '../components/ui/Skeleton';
import { achievementApi } from '../api/gameApi';

const TIER_STYLES = {
  common: 'border-neutral-500/40 text-neutral-300',
  rare: 'border-blue-400/40 text-blue-300',
  epic: 'border-purple-400/40 text-purple-300',
  legendary: 'border-upnext-gold/50 text-upnext-gold',
  hidden: 'border-pink-400/40 text-pink-300',
};

export default function AchievementsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['achievements', 'me'],
    queryFn: () => achievementApi.getMine().then((r) => r.data.data),
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold">Achievements</h1>
        <p className="text-sm text-upnext-muted">
          {data?.unlocked?.length ?? 0} unlocked of {(data?.unlocked?.length ?? 0) + (data?.locked?.length ?? 0)}
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <Skeleton key={i} className="h-32" />)}
        </div>
      ) : (
        <>
          <section>
            <h2 className="mb-4 text-sm font-medium text-upnext-muted">Unlocked</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {data?.unlocked?.map((a, i) => (
                <motion.div
                  key={a._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4, scale: 1.03 }}
                  data-cursor-hover
                >
                  <GlassCard hover={false} className={`relative overflow-hidden border-2 text-center ${TIER_STYLES[a.tier]}`}>
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{ background: 'radial-gradient(circle at center, currentColor, transparent 70%)' }}
                    />
                    <FiAward className="relative mx-auto mb-2 h-8 w-8" />
                    <p className="relative text-sm font-semibold text-upnext-text">{a.name}</p>
                    <p className="relative mt-1 text-xs text-upnext-muted">{a.description}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-sm font-medium text-upnext-muted">Locked</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {data?.locked?.map((a) => (
                <GlassCard key={a._id} hover={false} className="relative text-center opacity-50 grayscale">
                  <FiLock className="mx-auto mb-2 h-8 w-8 text-upnext-muted" />
                  <p className="text-sm font-semibold">{a.name}</p>
                  <p className="mt-1 text-xs text-upnext-muted">{a.description}</p>
                </GlassCard>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}