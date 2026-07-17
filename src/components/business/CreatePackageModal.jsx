import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import GlowInput from '../ui/GlowInput';
import GlowButton from '../ui/GlowButton';
import { servicePackageApi } from '../../api/servicePackageApi';

const CATEGORIES = ['web_design', 'branding', 'social_media', 'seo', 'advertising', 'full_service', 'other'];

export default function CreatePackageModal({ open, onClose, businessId }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm({ defaultValues: { category: 'web_design', priceType: 'one_time', turnaroundDays: 7 } });

  const createMutation = useMutation({
    mutationFn: (payload) =>
      servicePackageApi.create({
        ...payload,
        businessId,
        price: Number(payload.price),
        turnaroundDays: Number(payload.turnaroundDays),
        deliverables: payload.deliverables ? payload.deliverables.split(',').map((s) => s.trim()).filter(Boolean) : [],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicePackages', businessId] });
      toast.success('Package added');
      reset();
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  return (
    <Modal open={open} onClose={onClose} title="Add Service Package">
      <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
        <GlowInput placeholder="Package name (e.g. Starter Website)" {...register('name', { required: true, maxLength: 100 })} />
        <textarea
          placeholder="Description"
          rows={2}
          className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-upnext-muted focus:border-upnext-primary"
          {...register('description')}
        />
        <select {...register('category')} className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-sm capitalize outline-none focus:border-upnext-primary">
          {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
        </select>

        <div className="grid grid-cols-3 gap-3">
          <GlowInput type="number" placeholder="Price (Rs.)" {...register('price', { required: true, min: 0 })} />
          <select {...register('priceType')} className="w-full rounded-xl border border-upnext-border bg-black/40 px-3 py-3 text-xs outline-none focus:border-upnext-primary">
            <option value="one_time">One-time</option>
            <option value="monthly">Monthly</option>
          </select>
          <GlowInput type="number" placeholder="Days" {...register('turnaroundDays')} />
        </div>

        <GlowInput placeholder="Deliverables (comma separated)" {...register('deliverables')} />

        <GlowButton type="submit" isLoading={createMutation.isPending} className="w-full">
          Add Package
        </GlowButton>
      </form>
    </Modal>
  );
}