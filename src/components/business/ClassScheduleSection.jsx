import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiPlus, FiClock, FiMapPin, FiVideo, FiUsers, FiZap } from 'react-icons/fi';
import GlassCard from '../ui/GlassCard';
import GlowButton from '../ui/GlowButton';
import { fitnessApi } from '../../api/fitnessApi';
import CreateClassModal from './CreateClassModal';
import useAuthStore from '../../store/authStore';

const CATEGORY_ICONS = { yoga: '🧘', cardio: '🏃', strength: '🏋️', hiit: '⚡', dance: '💃', pilates: '🤸', boxing: '🥊', other: '💪' };

function groupByDay(classes) {
  return classes.reduce((acc, c) => {
    const day = new Date(c.startTime).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    acc[day] = acc[day] || [];
    acc[day].push(c);
    return acc;
  }, {});
}

export default function ClassScheduleSection({ businessId, canManage }) {
  const currentUser = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);

  const { data: classes, isLoading } = useQuery({
    queryKey: ['fitnessClasses', businessId],
    queryFn: () => fitnessApi.listByBusiness(businessId).then((r) => r.data.data),
  });

  const grouped = useMemo(() => groupByDay(classes || []), [classes]);

  const bookMutation = useMutation({
    mutationFn: (classId) => fitnessApi.book(classId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fitnessClasses', businessId] });
      toast.success('Booked! See you there 💪');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Booking failed'),
  });

  const cancelMutation = useMutation({
    mutationFn: (classId) => fitnessApi.cancelBooking(classId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fitnessClasses', businessId] });
      toast.success('Booking cancelled');
    },
  });

  return (
    <GlassCard>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-semibold">Class Schedule</h2>
        {canManage && (
          <button onClick={() => setShowCreate(true)} data-cursor-hover className="flex items-center gap-1.5 text-sm text-upnext-primary hover:text-upnext-primary-dark">
            <FiPlus className="h-4 w-4" /> Schedule Class
          </button>
        )}
      </div>

      {isLoading ? (
        <p className="text-sm text-upnext-muted">Schedule load ho raha hai...</p>
      ) : Object.keys(grouped).length === 0 ? (
        <p className="text-sm text-upnext-muted">Abhi koi class schedule nahi hai.</p>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([day, dayClasses], groupIdx) => (
            <div key={day}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-upnext-muted">{day}</h3>
              <div className="space-y-3">
                {dayClasses.map((c, idx) => {
                  const isBooked = c.bookings?.some((b) => b.user._id === currentUser?._id || b.user === currentUser?._id);
                  const spotsLeft = c.capacity - (c.bookings?.length || 0);
                  const fillPct = Math.min(100, ((c.bookings?.length || 0) / c.capacity) * 100);

                  return (
                    <motion.div
                      key={c._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: (groupIdx * dayClasses.length + idx) * 0.03, ease: [0.16, 1, 0.3, 1] }}
                      className="rounded-xl border border-upnext-border bg-white/5 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{CATEGORY_ICONS[c.category] || '💪'}</span>
                          <div>
                            <p className="font-medium">{c.title}</p>
                            <p className="text-xs text-upnext-muted">{c.instructor?.displayName} · {c.difficulty.replace(/_/g, ' ')}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-upnext-muted">
                              <span className="flex items-center gap-1">
                                <FiClock /> {new Date(c.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {c.isOnline ? (
                                <span className="flex items-center gap-1 text-upnext-primary">
                                  <FiVideo /> Online
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <FiMapPin /> {c.location || 'In-person'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          {isBooked ? (
                            <>
                              {c.isOnline && c.roomId && new Date(c.startTime) <= new Date() && (
                                <Link
                                  to={`/call/${c.roomId}`}
                                  data-cursor-hover
                                  className="mb-2 flex items-center gap-1.5 rounded-lg bg-upnext-primary px-3 py-1.5 text-xs font-medium text-black"
                                >
                                  <FiZap className="h-3 w-3" /> Join Live
                                </Link>
                              )}
                              <button
                                onClick={() => cancelMutation.mutate(c._id)}
                                data-cursor-hover
                                className="rounded-lg border border-upnext-border px-3 py-1.5 text-xs hover:bg-white/5"
                              >
                                Booked ✓
                              </button>
                            </>
                          ) : (
                            <GlowButton
                              onClick={() => bookMutation.mutate(c._id)}
                              isLoading={bookMutation.isPending}
                              disabled={spotsLeft <= 0}
                              className="!px-4 !py-1.5 !text-xs"
                            >
                              {spotsLeft <= 0 ? 'Full' : 'Book Spot'}
                            </GlowButton>
                          )}
                        </div>
                      </div>

                      {/* Capacity bar */}
                      <div className="mt-3 flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/40">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${fillPct}%` }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className={`h-full rounded-full ${fillPct >= 90 ? 'bg-red-400' : 'bg-upnext-primary'}`}
                          />
                        </div>
                        <span className="flex items-center gap-1 text-xs text-upnext-muted">
                          <FiUsers className="h-3 w-3" /> {spotsLeft} left
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateClassModal open={showCreate} onClose={() => setShowCreate(false)} businessId={businessId} />
    </GlassCard>
  );
}