import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiPlus, FiClock, FiCheck, FiX } from 'react-icons/fi';
import GlassCard from '../ui/GlassCard';
import { studioSessionApi } from '../../api/studioSessionApi';
import useAuthStore from '../../store/authStore';
import RequestSessionModal from './RequestSessionModal';

const STATUS_STYLES = {
  pending: 'bg-amber-500/20 text-amber-400',
  confirmed: 'bg-green-500/20 text-green-400',
  declined: 'bg-red-500/20 text-red-400',
  completed: 'bg-upnext-border text-upnext-muted',
};

export default function StudioSessionsSection({ businessId, canManage }) {
  const currentUser = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [showRequest, setShowRequest] = useState(false);

  const { data: sessions, isLoading } = useQuery({
    queryKey: ['studioSessions', businessId],
    queryFn: () => studioSessionApi.listByBusiness(businessId).then((r) => r.data.data),
  });

  const respondMutation = useMutation({
    mutationFn: ({ sessionId, response }) => studioSessionApi.respond(sessionId, response),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studioSessions', businessId] });
      toast.success('Response recorded');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const cancelMutation = useMutation({
    mutationFn: (sessionId) => studioSessionApi.cancel(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studioSessions', businessId] });
      toast.success('Session cancelled');
    },
  });

  return (
    <GlassCard>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-semibold">Studio Sessions</h2>
        <button onClick={() => setShowRequest(true)} data-cursor-hover className="flex items-center gap-1.5 text-sm text-upnext-primary hover:text-upnext-primary-dark">
          <FiPlus className="h-4 w-4" /> Request Session
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-upnext-muted">Loading sessions...</p>
      ) : sessions?.length === 0 ? (
        <p className="text-sm text-upnext-muted">Abhi koi session booked nahi.</p>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {sessions?.map((s, idx) => {
              const isMine = s.artist._id === currentUser?._id;
              return (
                <motion.div
                  key={s._id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.03, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center justify-between rounded-xl border border-upnext-border bg-white/5 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-upnext-primary/20">
                      {s.artist.avatarUrl && <img src={s.artist.avatarUrl} className="h-full w-full object-cover" alt="" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {s.artist.displayName} {isMine && <span className="text-xs text-upnext-muted">(You)</span>}
                      </p>
                      <p className="text-xs capitalize text-upnext-muted">{s.sessionType}</p>
                      <p className="flex items-center gap-1 text-xs text-upnext-muted">
                        <FiClock className="h-3 w-3" />
                        {new Date(s.startTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[s.status]}`}>
                      {s.status}
                    </span>

                    {canManage && s.status === 'pending' && (
                      <>
                        <button
                          onClick={() => respondMutation.mutate({ sessionId: s._id, response: 'confirm' })}
                          data-cursor-hover
                          className="rounded-full bg-green-500/20 p-1.5 text-green-400 hover:bg-green-500/30"
                        >
                          <FiCheck className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => respondMutation.mutate({ sessionId: s._id, response: 'decline' })}
                          data-cursor-hover
                          className="rounded-full bg-red-500/20 p-1.5 text-red-400 hover:bg-red-500/30"
                        >
                          <FiX className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}

                    {isMine && ['pending', 'confirmed'].includes(s.status) && (
                      <button
                        onClick={() => cancelMutation.mutate(s._id)}
                        data-cursor-hover
                        className="text-xs text-upnext-muted hover:text-red-400"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <RequestSessionModal open={showRequest} onClose={() => setShowRequest(false)} businessId={businessId} />
    </GlassCard>
  );
}