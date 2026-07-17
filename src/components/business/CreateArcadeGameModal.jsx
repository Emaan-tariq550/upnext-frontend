import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import GlowInput from '../ui/GlowInput';
import GlowButton from '../ui/GlowButton';
import { arcadeApi } from '../../api/arcadeApi';

export default function CreateArcadeGameModal({ open, onClose, businessId }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  const createMutation = useMutation({
    mutationFn: (payload) => arcadeApi.create({ ...payload, businessId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['arcadeGames', businessId] });
      toast.success('Game added to the floor 🕹️');
      reset();
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to add game'),
  });

  return (
    <Modal open={open} onClose={onClose} title="Add Arcade Machine">
      <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
        <GlowInput placeholder="Machine name (e.g. Street Fighter Cabinet 1)" {...register('name', { required: true, maxLength: 60 })} />
        <textarea
          placeholder="Description (optional)"
          rows={2}
          className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-upnext-muted focus:border-upnext-primary"
          {...register('description')}
        />
        <GlowInput placeholder="Image URL (optional)" {...register('imageUrl')} />
        <GlowButton type="submit" isLoading={createMutation.isPending} className="w-full">
          Add Machine
        </GlowButton>
      </form>
    </Modal>
  );
}