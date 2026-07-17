import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FiImage } from 'react-icons/fi';
import Modal from '../ui/Modal';
import GlowInput from '../ui/GlowInput';
import GlowButton from '../ui/GlowButton';
import { portfolioApi } from '../../api/portfolioApi';

const CATEGORIES = ['portrait', 'wedding', 'product', 'event', 'fashion', 'nature', 'street', 'other'];

export default function AddPortfolioItemModal({ open, onClose, businessId }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm({ defaultValues: { category: 'portrait' } });
  const [imageFile, setImageFile] = useState(null);

  const addMutation = useMutation({
    mutationFn: (formData) => portfolioApi.add(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio', businessId] });
      toast.success('Added to portfolio');
      reset();
      setImageFile(null);
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Upload failed'),
  });

  const onSubmit = (data) => {
    if (!imageFile) {
      toast.error('Image chunein');
      return;
    }
    const formData = new FormData();
    formData.append('businessId', businessId);
    formData.append('title', data.title || '');
    formData.append('category', data.category);
    formData.append('image', imageFile);
    addMutation.mutate(formData);
  };

  return (
    <Modal open={open} onClose={onClose} title="Add to Portfolio">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <GlowInput placeholder="Title (optional)" {...register('title')} />
        <select
          {...register('category')}
          className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-sm capitalize outline-none focus:border-upnext-primary"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-upnext-border p-4 text-sm text-upnext-muted hover:border-upnext-primary" data-cursor-hover>
          <FiImage className="h-4 w-4 shrink-0" />
          {imageFile ? imageFile.name : 'Photo chunein'}
          <input type="file" accept="image/*" hidden onChange={(e) => setImageFile(e.target.files[0])} />
        </label>

        <GlowButton type="submit" isLoading={addMutation.isPending} className="w-full">
          Add to Portfolio
        </GlowButton>
      </form>
    </Modal>
  );
}