import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiPlus, FiCalendar, FiUsers, FiChevronDown, FiCheck, FiX, FiDollarSign } from 'react-icons/fi';
import GlassCard from '../ui/GlassCard';
import GlowInput from '../ui/GlowInput';
import GlowButton from '../ui/GlowButton';
import { eventRequestApi } from '../../api/eventRequestApi';
import useAuthStore from '../../store/authStore';
import RequestEventModal from './RequestEventModal';

const STAGES = ['pending', 'quoted', 'accepted', 'confirmed'];
const STATUS_STYLES = {
  pending: 'bg-amber-500/20 text-amber-400',
  quoted: 'bg-blue-500/20 text-blue-400',
  accepted: 'bg-green-500/20 text-green-400',
  declined: 'bg-red-500/20 text-red-400',
  confirmed: 'bg-upnext-primary/20 text-upnext-primary',
  completed: 'bg-upnext-border text-upnext-muted',
  cancelled: 'bg-red-500/20 text-red-400',
};

function StageTimeline({ status }) {
  const isTerminalBad = ['declined', 'cancelled'].includes(status);
  const currentIdx = STAGES.indexOf(status);

  return (
    <div className="flex items-center gap-1.5">
      {STAGES.map((stage, idx) => (
        <div key={stage} className="flex items-center gap-1.5">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className={`h-2 w-2 rounded-full ${
              isTerminalBad ? 'bg-red-500/40' : idx <= currentIdx ? 'bg-upnext-primary' : 'bg-white/10'
            }`}
          />
          {idx < STAGES.length - 1 && (
            <div className={`h-0.5 w-4 ${isTerminalBad ? 'bg-red-500/20' : idx < currentIdx ? 'bg-upnext-primary' : 'bg-white/10'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function RequestCard({ request, isOwnerView, currentUser, idx }) {
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(false);
  const [quotePrice, setQuotePrice] = useState('');
  const [quoteNotes, setQuoteNotes] = useState('');

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['eventRequests'] });

  const quoteMutation = useMutation({
    mutationFn: () => eventRequestApi.sendQuote(request._id, { price: Number(quotePrice), notes: quoteNotes }),
    onSuccess: () => {
      invalidate();
      toast.success('Quote sent');
      setQuotePrice('');
      setQuoteNotes('');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const respondMutation = useMutation({
    mutationFn: (response) => eventRequestApi.respondToQuote(request._id, response),
    onSuccess: () => {
      invalidate();
      toast.success('Response recorded');
    },
  });

  const confirmMutation = useMutation({
    mutationFn: () => eventRequestApi.confirm(request._id),
    onSuccess: () => {
      invalidate();
      toast.success('Event confirmed and created! 🎉');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const isMine = request.client._id === currentUser?._id;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-xl border border-upnext-border bg-white/5 p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[request.status]}`}>
              {request.status}
            </span>
            <span className="text-xs capitalize text-upnext-muted">{request.eventType.replace(/_/g, ' ')}</span>
          </div>
          <p className="mt-1.5 font-medium">{request.title}</p>
          {isOwnerView && <p className="text-xs text-upnext-muted">by {request.client.displayName}</p>}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-upnext-muted">
            <span className="flex items-center gap-1"><FiCalendar /> {new Date(request.preferredDate).toLocaleDateString()}</span>
            <span className="flex items-center gap-1"><FiUsers /> {request.guestCount} guests</span>
            {request.budget > 0 && <span className="flex items-center gap-1"><FiDollarSign /> Budget: Rs. {request.budget}</span>}
          </div>
        </div>

        <button onClick={() => setExpanded((e) => !e)} data-cursor-hover className="shrink-0 text-upnext-muted">
          <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <FiChevronDown />
          </motion.span>
        </button>
      </div>

      <div className="mt-3">
        <StageTimeline status={request.status} />
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-3 border-t border-upnext-border pt-4">
              {request.description && <p className="text-sm text-upnext-muted">{request.description}</p>}
              {request.location && <p className="text-xs text-upnext-muted">📍 {request.location}</p>}

              {request.quote?.price != null && (
                <div className="rounded-lg bg-upnext-primary/10 p-3">
                  <p className="text-sm font-semibold text-upnext-primary">Quote: Rs. {request.quote.price}</p>
                  {request.quote.notes && <p className="mt-1 text-xs text-upnext-muted">{request.quote.notes}</p>}
                </div>
              )}

              {/* Owner: send quote */}
              {isOwnerView && request.status === 'pending' && (
                <div className="space-y-2 rounded-lg border border-upnext-border p-3">
                  <p className="text-xs font-medium text-upnext-muted">Send a quote</p>
                  <div className="grid grid-cols-2 gap-2">
                    <GlowInput type="number" placeholder="Price (Rs.)" value={quotePrice} onChange={(e) => setQuotePrice(e.target.value)} className="!py-2 !text-sm" />
                  </div>
                  <textarea
                    placeholder="Notes (what's included, terms, etc.)"
                    rows={2}
                    value={quoteNotes}
                    onChange={(e) => setQuoteNotes(e.target.value)}
                    className="w-full rounded-lg border border-upnext-border bg-black/40 px-3 py-2 text-xs outline-none placeholder:text-upnext-muted focus:border-upnext-primary"
                  />
                  <GlowButton onClick={() => quoteMutation.mutate()} isLoading={quoteMutation.isPending} className="w-full !py-2 !text-sm">
                    Send Quote
                  </GlowButton>
                </div>
              )}

              {/* Client: accept/decline quote */}
              {isMine && request.status === 'quoted' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => respondMutation.mutate('accept')}
                    data-cursor-hover
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-green-500/20 py-2 text-sm text-green-400 hover:bg-green-500/30"
                  >
                    <FiCheck /> Accept Quote
                  </button>
                  <button
                    onClick={() => respondMutation.mutate('decline')}
                    data-cursor-hover
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-500/20 py-2 text-sm text-red-400 hover:bg-red-500/30"
                  >
                    <FiX /> Decline
                  </button>
                </div>
              )}

              {/* Owner: confirm and create event */}
              {isOwnerView && request.status === 'accepted' && (
                <GlowButton onClick={() => confirmMutation.mutate()} isLoading={confirmMutation.isPending} className="w-full">
                  Confirm & Create Event
                </GlowButton>
              )}

              {request.status === 'confirmed' && request.linkedEvent && (
                <p className="text-xs text-upnext-primary">✓ Event created — check the Events page.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function EventRequestsSection({ businessId, canManage }) {
  const currentUser = useAuthStore((s) => s.user);
  const [showRequest, setShowRequest] = useState(false);

  const { data: requests, isLoading } = useQuery({
    queryKey: ['eventRequests', businessId],
    queryFn: () => eventRequestApi.listByBusiness(businessId).then((r) => r.data.data),
  });

  return (
    <GlassCard>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-semibold">Event Requests</h2>
        <button onClick={() => setShowRequest(true)} data-cursor-hover className="flex items-center gap-1.5 text-sm text-upnext-primary hover:text-upnext-primary-dark">
          <FiPlus className="h-4 w-4" /> Plan an Event
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-upnext-muted">Loading requests...</p>
      ) : requests?.length === 0 ? (
        <p className="text-sm text-upnext-muted">Abhi koi request nahi hai.</p>
      ) : (
        <div className="space-y-3">
          {requests?.map((r, idx) => (
            <RequestCard key={r._id} request={r} isOwnerView={canManage} currentUser={currentUser} idx={idx} />
          ))}
        </div>
      )}

      <RequestEventModal open={showRequest} onClose={() => setShowRequest(false)} businessId={businessId} />
    </GlassCard>
  );
}