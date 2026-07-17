import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import GlowInput from '../ui/GlowInput';
import GlowButton from '../ui/GlowButton';
import { fitnessApi } from '../../api/fitnessApi';

const CATEGORIES = ['yoga', 'cardio', 'strength', 'hiit', 'dance', 'pilates', 'boxing', 'other'];

export default function CreateClassModal({ open, onClose, businessId }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, watch, reset } = useForm({
    defaultValues: { category: 'yoga', difficulty: 'all_levels', capacity: 15, isOnline: false, meetingType: 'video' },
  });

  const isOnline = watch('isOnline');

  const createMutation = useMutation({
    mutationFn: (payload) =>
      fitnessApi.create({ ...payload, businessId, capacity: Number(payload.capacity), isOnline: !!payload.isOnline }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fitnessClasses', businessId] });
      toast.success('Class scheduled');
      reset();
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to schedule class'),
  });

  return (
    <Modal open={open} onClose={onClose} title="Schedule a Class">
      <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
        <GlowInput placeholder="Class title (e.g. Morning Yoga Flow)" {...register('title', { required: true, maxLength: 80 })} />
        <textarea
          placeholder="Description"
          rows={2}
          className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-upnext-muted focus:border-upnext-primary"
          {...register('description')}
        />

        <div className="grid grid-cols-2 gap-3">
          <select
            {...register('category')}
            className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-sm capitalize outline-none focus:border-upnext-primary"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            {...register('difficulty')}
            className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-sm capitalize outline-none focus:border-upnext-primary"
          >
            <option value="all_levels">All levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

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

        <GlowInput type="number" placeholder="Capacity" {...register('capacity', { required: true, min: 1 })} />

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('isOnline')} className="h-4 w-4 rounded border-upnext-border accent-upnext-primary" />
          Online class (live video)
        </label>

        {isOnline ? (
          <select
            {...register('meetingType')}
            className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-sm outline-none focus:border-upnext-primary"
          >
            <option value="video">Video call</option>
            <option value="voice">Voice call</option>
          </select>
        ) : (
          <GlowInput placeholder="Location (studio address)" {...register('location')} />
        )}

        <GlowButton type="submit" isLoading={createMutation.isPending} className="w-full">
          Schedule Class
        </GlowButton>
      </form>
    </Modal>
  );
}