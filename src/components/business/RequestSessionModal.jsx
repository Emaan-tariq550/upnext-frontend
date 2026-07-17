import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import GlowInput from '../ui/GlowInput';
import GlowButton from '../ui/GlowButton';
import { studioSessionApi } from '../../api/studioSessionApi';

const SESSION_TYPES = ['recording', 'mixing', 'mastering', 'rehearsal', 'production', 'other'];

export default function RequestSessionModal({ open, onClose, businessId }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm({ defaultValues: { sessionType: 'recording' } });

  const requestMutation = useMutation({
    mutationFn: (payload) => studioSessionApi.request({ ...payload, businessId, price: Number(payload.price) || 0 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studioSessions', businessId] });
      toast.success('Session requested! Studio ka jawab ka intezar karein.');
      reset();
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Request failed'),
  });

  return (
    <Modal open={open} onClose={onClose} title="Request a Session">
      <form onSubmit={handleSubmit((d) => requestMutation.mutate(d))} className="space-y-4">
        <select
          {...register('sessionType')}
          className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-sm capitalize outline-none focus:border-upnext-primary"
        >
          {SESSION_TYPES.map((t) => (
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

        <textarea
          placeholder="Notes for the studio (optional)"
          rows={2}
          className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-upnext-muted focus:border-upnext-primary"
          {...register('notes')}
        />

        <GlowButton type="submit" isLoading={requestMutation.isPending} className="w-full">
          Request Session
        </GlowButton>
      </form>
    </Modal>
  );
}