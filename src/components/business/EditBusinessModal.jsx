import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import GlowInput from '../ui/GlowInput';
import GlowButton from '../ui/GlowButton';
import { businessApi } from '../../api/businessApi';

export default function EditBusinessModal({ open, onClose, business }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm({
    defaultValues: { name: business?.name, description: business?.description },
  });

  const updateMutation = useMutation({
    mutationFn: (payload) => businessApi.update(business._id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', business._id] });
      toast.success('Business updated');
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Update failed'),
  });

  return (
    <Modal open={open} onClose={onClose} title="Edit Business">
      <form onSubmit={handleSubmit((d) => updateMutation.mutate(d))} className="space-y-4">
        <GlowInput placeholder="Business name" {...register('name', { required: true, maxLength: 60 })} />
        <textarea
          placeholder="Description"
          rows={3}
          className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-upnext-muted focus:border-upnext-primary"
          {...register('description', { maxLength: 500 })}
        />
        <GlowButton type="submit" isLoading={updateMutation.isPending} className="w-full">
          Save Changes
        </GlowButton>
      </form>
    </Modal>
  );
}