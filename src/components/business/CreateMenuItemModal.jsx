import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import GlowInput from '../ui/GlowInput';
import GlowButton from '../ui/GlowButton';
import { menuApi } from '../../api/menuApi';

export default function CreateMenuItemModal({ open, onClose, businessId }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  const createMutation = useMutation({
    mutationFn: (payload) => menuApi.create({ ...payload, businessId, price: Number(payload.price) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu', businessId] });
      toast.success('Menu item added');
      reset();
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to add item'),
  });

  return (
    <Modal open={open} onClose={onClose} title="Add Menu Item">
      <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
        <GlowInput placeholder="Item name" {...register('name', { required: true, maxLength: 60 })} />
        <GlowInput placeholder="Category (e.g. Beverages, Mains)" {...register('category')} />
        <textarea
          placeholder="Description"
          rows={2}
          className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-upnext-muted focus:border-upnext-primary"
          {...register('description')}
        />
        <GlowInput type="number" placeholder="Price (Rs.)" {...register('price', { required: true, min: 0 })} />
        <GlowInput placeholder="Image URL (optional)" {...register('imageUrl')} />
        <GlowButton type="submit" isLoading={createMutation.isPending} className="w-full">
          Add to Menu
        </GlowButton>
      </form>
    </Modal>
  );
}