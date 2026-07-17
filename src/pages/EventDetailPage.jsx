import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react'; // Added hook
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiUsers, FiStar, FiEdit2 } from 'react-icons/fi';
import GlassCard from '../components/ui/GlassCard';
import Skeleton from '../components/ui/Skeleton';
import GlowButton from '../components/ui/GlowButton';
import EditEventModal from '../components/event/EditEventModal'; // Added modal import
import { eventApi } from '../api/eventApi';
import useAuthStore from '../store/authStore';

const STATUS_COLORS = {
  scheduled: 'bg-blue-500/20 text-blue-400',
  live: 'bg-green-500/20 text-green-400',
  completed: 'bg-upnext-border text-upnext-muted',
  cancelled: 'bg-red-500/20 text-red-400',
};

export default function EventDetailPage() {
  const { eventId } = useParams();
  const currentUser = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  // Added: Local dialog tracking state
  const [showEdit, setShowEdit] = useState(false);

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => eventApi.getById(eventId).then((r) => r.data.data),
  });

  const checkInMutation = useMutation({
    mutationFn: () => eventApi.checkIn(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      toast.success('Checked in! Fame earned.');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Check-in failed'),
  });

  const rateMutation = useMutation({
    mutationFn: (rating) => eventApi.rate(eventId, { rating }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      toast.success('Rating submitted');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Rating failed'),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-56" />
      </div>
    );
  }

  const isHost = event?.host?._id === currentUser?._id;
  const hasCheckedIn = event?.attendance?.some((a) => a.user._id === currentUser?._id);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard>
          {/* Header Metadata Section */}
          <div className="flex items-center justify-between">
            <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${STATUS_COLORS[event.status]}`}>
              {event.status}
            </span>
            <div className="flex items-center gap-4">
              <span className="text-xs capitalize text-upnext-muted">{event.type?.replace(/_/g, ' ')}</span>
            </div>
          </div>

          {/* Title Row with Host Actions */}
          <div className="mt-4 flex items-center justify-between gap-4">
            <h1 className="font-display text-2xl font-bold">{event.title}</h1>
            
            {/* Added: Host Permission Edit Utility */}
            {isHost && (
              <button 
                onClick={() => setShowEdit(true)} 
                data-cursor-hover 
                className="ml-auto flex items-center gap-1.5 text-sm text-upnext-primary hover:text-upnext-primary-dark transition-colors shrink-0"
              >
                <FiEdit2 className="h-4 w-4" /> Edit
              </button>
            )}
          </div>

          <p className="mt-2 text-sm text-upnext-muted">{event.description}</p>

          {/* Call Join Action Layer */}
          {event.meetingType && event.meetingType !== 'none' && event.roomId && (
            <Link
              to={`/call/${event.roomId}`}
              data-cursor-hover
              className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-upnext-primary py-2.5 text-sm font-medium text-black hover:bg-upnext-primary-dark transition-colors"
            >
              Join {event.meetingType} call
            </Link>
          )}

          {/* Core Event Metrics */}
          <div className="mt-6 flex flex-wrap gap-6 text-sm text-upnext-muted">
            <span className="flex items-center gap-2">
              <FiCalendar /> {new Date(event.startTime).toLocaleString()}
            </span>
            {event.location && (
              <span className="flex items-center gap-2">
                <FiMapPin /> {event.location}
              </span>
            )}
            <span className="flex items-center gap-2">
              <FiUsers /> {event.attendance?.length ?? 0} attending
              {event.capacity ? ` / ${event.capacity}` : ''}
            </span>
          </div>

          {/* Contextual Interaction Triggers */}
          {event.status === 'live' && !hasCheckedIn && (
            <GlowButton className="mt-6" onClick={() => checkInMutation.mutate()} isLoading={checkInMutation.isPending}>
              Check In
            </GlowButton>
          )}

          {hasCheckedIn && event.status === 'completed' && (
            <div className="mt-6 flex items-center gap-2">
              <span className="text-sm text-upnext-muted">Rate this event:</span>
              {[1, 2, 3, 4, 5].map((r) => (
                <button key={r} data-cursor-hover onClick={() => rateMutation.mutate(r)}>
                  <FiStar className="h-5 w-5 text-upnext-gold hover:fill-upnext-gold transition-all" />
                </button>
              ))}
            </div>
          )}
        </GlassCard>
      </motion.div>

      {/* Attendance Log Card */}
      <GlassCard>
        <h2 className="mb-4 font-semibold">Attendees</h2>
        <div className="flex flex-wrap gap-3">
          {event.attendance?.map((att) => (
            <div key={att.user._id} className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
              <div className="h-7 w-7 overflow-hidden rounded-full bg-upnext-primary/20">
                {att.user.avatarUrl && <img src={att.user.avatarUrl} className="h-full w-full object-cover" alt="" />}
              </div>
              <span className="text-sm">{att.user.displayName}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Added: Overlay Event Management Dialog Modals */}
      <EditEventModal open={showEdit} onClose={() => setShowEdit(false)} event={event} />
    </div>
  );
}