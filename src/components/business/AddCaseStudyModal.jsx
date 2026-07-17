import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import GlowInput from '../ui/GlowInput';
import GlowButton from '../ui/GlowButton';
import { caseStudyApi } from '../../api/caseStudyApi';

export default function AddCaseStudyModal({ open, onClose, businessId }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  const createMutation = useMutation({
    mutationFn: (payload) => caseStudyApi.create({ ...payload, businessId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caseStudies', businessId] });
      toast.success('Case study added');
      reset();
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  return (
    <Modal open={open} onClose={onClose} title="Add Case Study">
      <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
        <GlowInput placeholder="Client name" {...register('clientName', { required: true, maxLength: 100 })} />
        <GlowInput placeholder="Project title" {...register('title', { required: true, maxLength: 100 })} />
        <textarea
          placeholder="Summary of the work"
          rows={3}
          className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-upnext-muted focus:border-upnext-primary"
          {...register('summary')}
        />
        <GlowInput placeholder="Result metric (e.g. +150% traffic in 3 months)" {...register('resultMetric')} />
        <GlowInput placeholder="Cover image URL (optional)" {...register('coverImageUrl')} />

        <GlowButton type="submit" isLoading={createMutation.isPending} className="w-full">
          Add Case Study
        </GlowButton>
      </form>
    </Modal>
  );
}