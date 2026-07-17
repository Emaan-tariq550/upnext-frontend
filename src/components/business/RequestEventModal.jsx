import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import GlowInput from '../ui/GlowInput';
import GlowButton from '../ui/GlowButton';
import { eventRequestApi } from '../../api/eventRequestApi';

const EVENT_TYPES = ['wedding', 'birthday', 'corporate', 'concert', 'conference', 'private_party', 'other'];

export default function RequestEventModal({ open, onClose, businessId }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm({ defaultValues: { eventType: 'birthday', guestCount: 50 } });

  const createMutation = useMutation({
    mutationFn: (payload) =>
      eventRequestApi.create({
        ...payload,
        businessId,
        guestCount: Number(payload.guestCount),
        budget: Number(payload.budget) || 0,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventRequests', businessId] });
      toast.success('Request bhej diya gaya! Company ke jawab ka intezar karein.');
      reset();
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Request failed'),
  });

  return (
    <Modal open={open} onClose={onClose} title="Plan Your Event">
      <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
        <GlowInput placeholder="Event title (e.g. Sara's Birthday Bash)" {...register('title', { required: true, maxLength: 100 })} />

        <select
          {...register('eventType')}
          className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-sm capitalize outline-none focus:border-upnext-primary"
        >
          {EVENT_TYPES.map((t) => (
            <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
          ))}
        </select>

        <textarea
          placeholder="Describe your vision..."
          rows={3}
          className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-upnext-muted focus:border-upnext-primary"
          {...register('description')}
        />

        <div>
          <label className="mb-1.5 block text-xs text-upnext-muted">Preferred date</label>
          <input
            type="datetime-local"
            {...register('preferredDate', { required: true })}
            style={{ colorScheme: 'dark' }}
            className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-sm outline-none focus:border-upnext-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <GlowInput type="number" placeholder="Guest count" {...register('guestCount', { required: true, min: 1 })} />
          <GlowInput type="number" placeholder="Your budget (optional)" {...register('budget')} />
        </div>

        <GlowInput placeholder="Location (optional)" {...register('location')} />

        <GlowButton type="submit" isLoading={createMutation.isPending} className="w-full">
          Submit Request
        </GlowButton>
      </form>
    </Modal>
  );
}