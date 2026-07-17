import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import GlowInput from '../ui/GlowInput';
import GlowButton from '../ui/GlowButton';
import { businessApi } from '../../api/businessApi';

const BUSINESS_TYPES = [
  'cafe', 'restaurant', 'gaming_arena', 'arcade', 'fashion_brand', 'event_company',
  'photography_studio', 'news_channel', 'music_studio', 'fitness_club', 'tech_startup', 'digital_agency',
];

export default function CreateBusinessModal({ open, onClose }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const createMutation = useMutation({
    mutationFn: (payload) => businessApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      toast.success('Business created!');
      reset();
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create business'),
  });

  const onSubmit = (data) => createMutation.mutate(data);

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} title="Create a Business">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <GlowInput
          placeholder="Business name"
          error={errors.name?.message}
          {...register('name', { required: 'Required', minLength: 2, maxLength: 60 })}
        />

        <div className="w-full">
          <select
            className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-upnext-text outline-none focus:border-upnext-primary"
            {...register('type', { required: 'Required' })}
          >
            <option value="">Select business type</option>
            {BUSINESS_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </option>
            ))}
          </select>
          {errors.type && <p className="mt-1 text-xs text-red-400">{errors.type.message}</p>}
        </div>

        <textarea
          placeholder="Description (optional)"
          rows={3}
          className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-upnext-text outline-none placeholder:text-upnext-muted focus:border-upnext-primary"
          {...register('description', { maxLength: 500 })}
        />

        <GlowButton type="submit" isLoading={createMutation.isPending} className="w-full">
          Launch Business
        </GlowButton>
      </form>
    </Modal>
  );
}