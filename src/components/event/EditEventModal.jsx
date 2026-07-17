import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import GlowInput from '../ui/GlowInput';
import GlowButton from '../ui/GlowButton';
import { eventApi } from '../../api/eventApi';

export default function EditEventModal({ open, onClose, event }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      title: event?.title,
      description: event?.description,
      location: event?.location,
      meetingType: event?.meetingType || 'none',
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload) => eventApi.update(event._id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', event._id] });
      toast.success('Event updated');
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Update failed'),
  });

  return (
    <Modal open={open} onClose={onClose} title="Edit Event">
      <form onSubmit={handleSubmit((d) => updateMutation.mutate(d))} className="space-y-4">
        <GlowInput placeholder="Title" {...register('title', { required: true, maxLength: 80 })} />
        <GlowInput placeholder="Location" {...register('location')} />
        <textarea
          placeholder="Description"
          rows={3}
          className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-upnext-muted focus:border-upnext-primary"
          {...register('description')}
        />

        {/* Naya: Call type selector */}
        <div>
          <label className="mb-1.5 block text-xs text-upnext-muted">Call Type</label>
          <select
            {...register('meetingType')}
            className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-sm outline-none focus:border-upnext-primary"
          >
            <option value="none">No call</option>
            <option value="voice">Voice call</option>
            <option value="video">Video call</option>
            <option value="community">Community call</option>
          </select>
        </div>

        <GlowButton type="submit" isLoading={updateMutation.isPending} className="w-full">
          Save Changes
        </GlowButton>
      </form>
    </Modal>
  );
}