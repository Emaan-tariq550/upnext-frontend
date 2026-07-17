import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import GlowInput from '../ui/GlowInput';
import GlowButton from '../ui/GlowButton';
import { photoBookingApi } from '../../api/photoBookingApi';

const SHOOT_TYPES = ['portrait', 'wedding', 'product', 'event', 'fashion', 'family', 'other'];

export default function RequestBookingModal({ open, onClose, businessId }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm({ defaultValues: { shootType: 'portrait' } });

  const requestMutation = useMutation({
    mutationFn: (payload) => photoBookingApi.request({ ...payload, businessId, price: Number(payload.price) || 0 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photoBookings', businessId] });
      toast.success('Booking requested! Studio ka jawab ka intezar karein.');
      reset();
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Request failed'),
  });

  return (
    <Modal open={open} onClose={onClose} title="Book a Photoshoot">
      <form onSubmit={handleSubmit((d) => requestMutation.mutate(d))} className="space-y-4">
        <select
          {...register('shootType')}
          className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-sm capitalize outline-none focus:border-upnext-primary"
        >
          {SHOOT_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs text-upnext-muted">Start time</label>
            <input
              type="datetime-local"
              {...register('startTime', { required: true })}
              style={{ colorScheme: 'dark' }}
              className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-sm outline-none focus:border-upnext-primary"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-upnext-muted">End time</label>
            <input
              type="datetime-local"
              {...register('endTime', { required: true })}
              style={{ colorScheme: 'dark' }}
              className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-sm outline-none focus:border-upnext-primary"
            />
          </div>
        </div>

        <GlowInput placeholder="Location (studio ya on-location address)" {...register('location')} />
        <textarea
          placeholder="Notes for the photographer (optional)"
          rows={2}
          className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-upnext-muted focus:border-upnext-primary"
          {...register('notes')}
        />

        <GlowButton type="submit" isLoading={requestMutation.isPending} className="w-full">
          Request Booking
        </GlowButton>
      </form>
    </Modal>
  );
}