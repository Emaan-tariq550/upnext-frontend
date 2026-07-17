import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiPlus, FiCalendar, FiMapPin, FiUsers } from 'react-icons/fi';
import GlassCard from '../components/ui/GlassCard';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import CreateEventModal from '../components/event/CreateEventModal';
import { eventApi } from '../api/eventApi';

const STATUS_COLORS = {
  scheduled: 'bg-blue-500/20 text-blue-400',
  live: 'bg-green-500/20 text-green-400',
  completed: 'bg-upnext-border text-upnext-muted',
  cancelled: 'bg-red-500/20 text-red-400',
};

export default function EventsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => eventApi.list({ limit: 24, sort: 'startTime' }).then((r) => r.data.data),
  });

  const checkInMutation = useMutation({
    mutationFn: (eventId) => eventApi.checkIn(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Checked in! Fame earned.');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Check-in failed'),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Events</h1>
          <p className="text-sm text-upnext-muted">Host, attend, and rate live experiences.</p>
        </div>
        <button
          data-cursor-hover
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-xl bg-upnext-primary px-5 py-2.5 font-medium text-black hover:bg-upnext-primary-dark"
        >
          <FiPlus /> Host Event
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-48" />)}
        </div>
      ) : data?.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((event, i) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard className="flex h-full flex-col">
                <div className="flex items-start justify-between">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_COLORS[event.status]}`}>
                    {event.status}
                  </span>
                  <span className="text-xs capitalize text-upnext-muted">{event.type.replace(/_/g, ' ')}</span>
                </div>

                <Link to={`/events/${event._id}`} data-cursor-hover className="mt-3 flex-1">
                  <h3 className="font-semibold hover:text-upnext-primary">{event.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-upnext-muted">{event.description}</p>
                </Link>

                <div className="mt-4 space-y-2 text-xs text-upnext-muted">
                  <div className="flex items-center gap-1.5">
                    <FiCalendar className="h-3.5 w-3.5" />
                    {new Date(event.startTime).toLocaleString()}
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-1.5">
                      <FiMapPin className="h-3.5 w-3.5" /> {event.location}
                    </div>
                  )}
                </div>

                {event.status === 'live' && (
                  <button
                    data-cursor-hover
                    onClick={() => checkInMutation.mutate(event._id)}
                    disabled={checkInMutation.isPending}
                    className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-upnext-primary py-2.5 text-sm font-medium text-black hover:bg-upnext-primary-dark"
                  >
                    <FiUsers /> Check In
                  </button>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FiCalendar}
          title="No events yet"
          subtitle="Host a concert, tournament, or meetup to gain fame."
          action={
            <button onClick={() => setShowCreate(true)} className="rounded-xl bg-upnext-primary px-5 py-2.5 font-medium text-black">
              Host Your First Event
            </button>
          }
        />
      )}

      <CreateEventModal open={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}