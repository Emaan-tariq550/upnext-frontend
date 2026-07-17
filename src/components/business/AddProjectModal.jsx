import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import GlowInput from '../ui/GlowInput';
import GlowButton from '../ui/GlowButton';
import { projectShowcaseApi } from '../../api/projectShowcaseApi';

export default function AddProjectModal({ open, onClose, businessId }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  const createMutation = useMutation({
    mutationFn: (payload) =>
      projectShowcaseApi.create({
        ...payload,
        businessId,
        techStack: payload.techStack ? payload.techStack.split(',').map((s) => s.trim()).filter(Boolean) : [],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', businessId] });
      toast.success('Project added to showcase');
      reset();
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  return (
    <Modal open={open} onClose={onClose} title="Add Project">
      <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
        <GlowInput placeholder="Project title" {...register('title', { required: true, maxLength: 100 })} />
        <textarea
          placeholder="What did you build?"
          rows={3}
          className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-upnext-muted focus:border-upnext-primary"
          {...register('description')}
        />
        <GlowInput placeholder="Tech stack (comma separated)" {...register('techStack')} />
        <GlowInput placeholder="Cover image URL (optional)" {...register('coverImageUrl')} />
        <div className="grid grid-cols-2 gap-3">
          <GlowInput placeholder="Live URL" {...register('liveUrl')} />
          <GlowInput placeholder="Repo URL" {...register('repoUrl')} />
        </div>
        <GlowButton type="submit" isLoading={createMutation.isPending} className="w-full">
          Add to Showcase
        </GlowButton>
      </form>
    </Modal>
  );
}