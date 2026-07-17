import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiUsers, FiUserPlus, FiCheck, FiX } from 'react-icons/fi';
import GlassCard from '../components/ui/GlassCard';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { friendApi, followApi } from '../api/socialApi';
import useAuthStore from '../store/authStore';

const TABS = ['friends', 'followers', 'following', 'pending'];

export default function FriendsPage() {
  const [tab, setTab] = useState('friends');
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  {/* 1. Added Pending Count Query at the top */}
  const { data: pendingCount = 0 } = useQuery({
    queryKey: ['friends', 'pending-count'],
    queryFn: () => friendApi.getPending().then((r) => r.data.data.length),
    enabled: !!user?._id,
  });

  {/* Active Tab Query Dataset */}
  const { data, isLoading } = useQuery({
    queryKey: ['friends', tab, user?._id],
    queryFn: () => {
      if (tab === 'friends') return friendApi.getList(user._id).then((r) => r.data.data);
      if (tab === 'followers') return followApi.getFollowers(user._id).then((r) => r.data.data);
      if (tab === 'following') return followApi.getFollowing(user._id).then((r) => r.data.data);
      return friendApi.getPending().then((r) => r.data.data);
    },
    enabled: !!user?._id,
  });

  const respondMutation = useMutation({
    mutationFn: ({ requestId, action }) => friendApi.respond(requestId, action),
    onSuccess: () => {
      // Invalidate both current active list and the separate global pending badge counter
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      toast.success('Response recorded');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Action failed'),
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-2 rounded-xl border border-upnext-border bg-upnext-surface/50 p-1.5">
        {TABS.map((t) => (
          <button
            key={t}
            data-cursor-hover
            onClick={() => setTab(t)}
            className={`relative flex-1 rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${
              tab === t ? 'text-black' : 'text-upnext-muted hover:text-upnext-text'
            }`}
          >
            {tab === t && (
              <motion.div layoutId="friend-tab" className="absolute inset-0 rounded-lg bg-upnext-primary" />
            )}
            <span className="relative z-10">{t}</span>

            {/* 2. Appended Conditional Tab Counter Badge */}
            {t === 'pending' && pendingCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-upnext-gold text-[9px] font-bold text-black z-20 animate-pulse">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24" />)}
        </div>
      ) : data?.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((item) => (
            <GlassCard key={item._id || item.requester?._id} className="flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-upnext-primary/20">
                {(item.avatarUrl || item.requester?.avatarUrl) && (
                  <img src={item.avatarUrl || item.requester?.avatarUrl} className="h-full w-full object-cover" alt="" />
                )}
                {item.isOnline && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-upnext-surface bg-green-500" />
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">{item.displayName || item.requester?.displayName}</p>
                <p className="truncate text-xs text-upnext-muted">@{item.username || item.requester?.username}</p>
              </div>

              {tab === 'pending' && (
                <div className="flex gap-1">
                  <button
                    data-cursor-hover
                    onClick={() => respondMutation.mutate({ requestId: item._id, action: 'accept' })}
                    disabled={respondMutation.isPending}
                    className="rounded-lg bg-green-500/20 p-2 text-green-400 hover:bg-green-500/30 transition-colors disabled:opacity-5
                    0"
                  >
                    <FiCheck />
                  </button>
                  <button
                    data-cursor-hover
                    onClick={() => respondMutation.mutate({ requestId: item._id, action: 'reject' })}
                    disabled={respondMutation.isPending}
                    className="rounded-lg bg-red-500/20 p-2 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
                  >
                    <FiX />
                  </button>
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={tab === 'pending' ? FiUserPlus : FiUsers}
          title={`No ${tab} yet`}
          subtitle="Connections will show up here once you make them."
        />
      )}
    </div>
  );
}