import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiZap, FiUsers, FiStar } from 'react-icons/fi';
import GlassCard from '../components/ui/GlassCard';
import Skeleton from '../components/ui/Skeleton';
import { leaderboardApi } from '../api/gameApi';

const TABS = [
  { key: 'fame', label: 'Fame', icon: FiZap, scope: 'global' }, // FiFlame → FiZap
  { key: 'followers', label: 'Followers', icon: FiUsers },
  { key: 'level', label: 'Level', icon: FiStar },
];

const FAME_SCOPES = ['daily', 'weekly', 'monthly', 'global'];

export default function LeaderboardsPage() {
  const [tab, setTab] = useState('fame');
  const [scope, setScope] = useState('global');

  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard', tab, scope],
    queryFn: () => {
      if (tab === 'fame') return leaderboardApi.getFame({ scope, limit: 50 }).then((r) => r.data.data);
      if (tab === 'followers') return leaderboardApi.getFollowers({ limit: 50 }).then((r) => r.data.data);
      return leaderboardApi.getLevel({ limit: 50 }).then((r) => r.data.data);
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Leaderboards</h1>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            data-cursor-hover
            onClick={() => setTab(t.key)}
            className={`relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.key ? 'text-black' : 'border border-upnext-border text-upnext-muted hover:text-upnext-text'
            }`}
          >
            {tab === t.key && (
              <motion.div layoutId="lb-tab" className="absolute inset-0 rounded-xl bg-upnext-primary" />
            )}
            <t.icon className="relative z-10 h-4 w-4" />
            <span className="relative z-10">{t.label}</span>
          </button>
        ))}
      </div>

      {tab === 'fame' && (
        <div className="flex gap-2">
          {FAME_SCOPES.map((s) => (
            <button
              key={s}
              data-cursor-hover
              onClick={() => setScope(s)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                scope === s ? 'bg-upnext-primary/20 text-upnext-primary' : 'text-upnext-muted hover:bg-white/5'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2">{[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : (
        <div className="space-y-2">
          {data?.map((user, i) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <GlassCard hover={false} className="flex items-center gap-4">
                <span
                  className={`font-display text-xl font-bold ${
                    i === 0 ? 'text-upnext-gold' : i === 1 ? 'text-neutral-300' : i === 2 ? 'text-amber-600' : 'text-upnext-muted'
                  }`}
                >
                  #{i + 1}
                </span>
                <div className="h-10 w-10 overflow-hidden rounded-full bg-upnext-primary/20">
                  {user.avatarUrl && <img src={user.avatarUrl} className="h-full w-full object-cover" alt="" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{user.displayName}</p>
                  <p className="text-xs text-upnext-muted">@{user.username}</p>
                </div>
                <span className="font-display font-bold text-upnext-primary">
                  {tab === 'fame' ? user.fameScore : tab === 'followers' ? user.followersCount : user.level}
                </span>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}