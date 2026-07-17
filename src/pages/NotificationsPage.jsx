import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiBell, FiCheckCircle } from 'react-icons/fi';
import GlassCard from '../components/ui/GlassCard';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { notificationApi } from '../api/notificationApi';
import useNotificationStore from '../store/notificationStore';

const TYPE_ICONS = {
  follow: '👤', friend_request: '🤝', friend_accept: '✅', message: '💬',
  achievement: '🏆', fame_milestone: '🔥', event_invite: '📅', trending: '📈', system: '⚙️',
};

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const setNotifications = useNotificationStore((s) => s.setNotifications);

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.list({ limit: 50 }).then((r) => r.data),
  });

  useEffect(() => {
    if (data) setNotifications(data.data, data.meta?.unreadCount ?? 0);
  }, [data, setNotifications]);

  const markReadMutation = useMutation({
    mutationFn: (id) => notificationApi.markRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationApi.markAllRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Notifications</h1>
        {data?.data?.some((n) => !n.isRead) && (
          <button
            data-cursor-hover
            onClick={() => markAllReadMutation.mutate()}
            className="flex items-center gap-2 text-sm text-upnext-primary hover:underline"
          >
            <FiCheckCircle /> Mark all as read
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20" />)}</div>
      ) : data?.data?.length ? (
        <div className="space-y-3">
          {data.data.map((n, i) => (
            <motion.div
              key={n._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => !n.isRead && markReadMutation.mutate(n._id)}
              data-cursor-hover
            >
              <GlassCard
                hover={false}
                className={`flex cursor-pointer items-start gap-3 ${!n.isRead ? 'border-upnext-primary/40' : ''}`}
              >
                <span className="text-xl">{TYPE_ICONS[n.type] || '🔔'}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-upnext-muted">{n.body}</p>
                  <p className="mt-1 text-[11px] text-upnext-muted">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                {!n.isRead && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-upnext-primary" />}
              </GlassCard>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState icon={FiBell} title="You're all caught up" subtitle="New notifications will appear here." />
      )}
    </div>
  );
}