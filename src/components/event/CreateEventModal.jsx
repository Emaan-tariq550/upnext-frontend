import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import GlowInput from '../ui/GlowInput';
import GlowButton from '../ui/GlowButton';
import { eventApi } from '../../api/eventApi';

const EVENT_TYPES = ['concert', 'competition', 'meetup', 'party', 'fashion_show', 'gaming_tournament', 'community_event'];

export default function CreateEventModal({ open, onClose }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const createMutation = useMutation({
    mutationFn: (payload) =>
      eventApi.create({
        ...payload,
        startTime: new Date(payload.startTime).toISOString(),
        endTime: new Date(payload.endTime).toISOString(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event created!');
      reset();
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create event'),
  });

  return (
    <Modal open={open} onClose={onClose} title="Host an Event">
      <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
        {/* Title Input */}
        <GlowInput placeholder="Event title" error={errors.title?.message} {...register('title', { required: 'Required', maxLength: 80 })} />

        {/* Event Type Select Menu */}
        <select
          className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-upnext-text outline-none focus:border-upnext-primary"
          {...register('type', { required: 'Required' })}
        >
          <option value="">Select event type</option>
          {EVENT_TYPES.map((t) => (
            <option key={t} value={t}>{t.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</option>
          ))}
        </select>

        {/* Date & Time Range Grid */}
        <div className="grid grid-cols-2 gap-3">
          <GlowInput type="datetime-local" error={errors.startTime?.message} {...register('startTime', { required: 'Required' })} />
          <GlowInput type="datetime-local" error={errors.endTime?.message} {...register('endTime', { required: 'Required' })} />
        </div>

        {/* Physical Location Input */}
        <GlowInput placeholder="Location (optional)" {...register('location')} />

        {/* 🚀 Added: Live Meeting Stream Variant Selector */}
        <select
          className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-upnext-text outline-none focus:border-upnext-primary"
          {...register('meetingType')}
          defaultValue="none"
        >
          <option value="none">No live call</option>
          <option value="voice">Voice Call</option>
          <option value="video">Video Call</option>
          <option value="community">Community Call</option>
        </select>

        {/* Rich Metadata Description Context Area */}
        <textarea
          placeholder="Description (optional)"
          rows={3}
          className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-upnext-text outline-none placeholder:text-upnext-muted focus:border-upnext-primary"
          {...register('description')}
        />

        {/* Action Trigger */}
        <GlowButton type="submit" isLoading={createMutation.isPending} className="w-full">
          Create Event
        </GlowButton>
      </form>
    </Modal>
  );
}