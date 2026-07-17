import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import GlowInput from '../ui/GlowInput';
import GlowButton from '../ui/GlowButton';
import { newsApi } from '../../api/newsApi';

const CATEGORIES = ['general', 'sports', 'entertainment', 'tech', 'business', 'community', 'gaming'];

export default function PublishArticleModal({ open, onClose, businessId }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm({ defaultValues: { category: 'general', isBreaking: false } });

  const createMutation = useMutation({
    mutationFn: (payload) => newsApi.create({ ...payload, businessId, isBreaking: !!payload.isBreaking }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsArticles', businessId] });
      toast.success('Article published');
      reset();
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Publish failed'),
  });

  return (
    <Modal open={open} onClose={onClose} title="Publish Article">
      <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
        <GlowInput placeholder="Headline" {...register('headline', { required: true, maxLength: 120 })} />
        <textarea
          placeholder="Write the story..."
          rows={6}
          className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-upnext-muted focus:border-upnext-primary"
          {...register('body', { required: true, maxLength: 5000 })}
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
          <GlowInput placeholder="Cover image URL (optional)" {...register('coverImageUrl')} />
        </div>

        <label className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm">
          <input type="checkbox" {...register('isBreaking')} className="h-4 w-4 rounded border-upnext-border accent-red-500" />
          🔴 Mark as Breaking News (sab users ko turant notification jayegi)
        </label>

        <GlowButton type="submit" isLoading={createMutation.isPending} className="w-full">
          Publish
        </GlowButton>
      </form>
    </Modal>
  );
}