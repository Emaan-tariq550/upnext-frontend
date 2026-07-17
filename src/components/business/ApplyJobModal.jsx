import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import GlowInput from '../ui/GlowInput';
import GlowButton from '../ui/GlowButton';
import { jobApi } from '../../api/jobApi';

export default function ApplyJobModal({ open, onClose, jobId, businessId }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  const applyMutation = useMutation({
    mutationFn: (payload) => jobApi.apply(jobId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs', businessId] });
      toast.success('Application submitted! 🎉');
      reset();
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Application failed'),
  });

  return (
    <Modal open={open} onClose={onClose} title="Apply for this Role">
      <form onSubmit={handleSubmit((d) => applyMutation.mutate(d))} className="space-y-4">
        <textarea
          placeholder="Cover note — why are you a good fit?"
          rows={4}
          className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-upnext-muted focus:border-upnext-primary"
          {...register('coverNote')}
        />
        <GlowInput placeholder="Resume URL (Google Drive, LinkedIn, etc.)" {...register('resumeUrl')} />
        <GlowButton type="submit" isLoading={applyMutation.isPending} className="w-full">
          Submit Application
        </GlowButton>
      </form>
    </Modal>
  );
}