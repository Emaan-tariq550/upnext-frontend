import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FiImage, FiX } from 'react-icons/fi';
import Modal from '../ui/Modal';
import GlowInput from '../ui/GlowInput';
import GlowButton from '../ui/GlowButton';
import { productApi } from '../../api/productApi';

export default function AddProductModal({ open, onClose, businessId }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();
  const [images, setImages] = useState([]);

  const createMutation = useMutation({
    mutationFn: (formData) => productApi.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', businessId] });
      toast.success('Product added to catalog');
      reset();
      setImages([]);
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to add product'),
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('businessId', businessId);
    formData.append('name', data.name);
    formData.append('description', data.description || '');
    formData.append('price', data.price);
    formData.append('category', data.category || 'General');
    formData.append('sizes', data.sizes || '');
    formData.append('colors', data.colors || '');
    images.forEach((img) => formData.append('images', img));
    createMutation.mutate(formData);
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Product">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <GlowInput placeholder="Product name" {...register('name', { required: true, maxLength: 100 })} />
        <textarea
          placeholder="Description"
          rows={2}
          className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-upnext-muted focus:border-upnext-primary"
          {...register('description')}
        />
        <div className="grid grid-cols-2 gap-3">
          <GlowInput type="number" placeholder="Price (Rs.)" {...register('price', { required: true, min: 0 })} />
          <GlowInput placeholder="Category (e.g. Outerwear)" {...register('category')} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <GlowInput placeholder="Sizes (S, M, L, XL)" {...register('sizes')} />
          <GlowInput placeholder="Colors (Black, White)" {...register('colors')} />
        </div>

        <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-upnext-border p-4 text-sm text-upnext-muted hover:border-upnext-primary" data-cursor-hover>
          <FiImage className="h-4 w-4 shrink-0" />
          {images.length > 0 ? `${images.length} image(s) selected` : 'Product photos chunein (up to 5)'}
          <input type="file" accept="image/*" multiple hidden onChange={(e) => setImages(Array.from(e.target.files).slice(0, 5))} />
        </label>

        {images.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {images.map((img, i) => (
              <div key={i} className="flex items-center gap-1 rounded-lg bg-white/5 px-2 py-1 text-xs">
                {img.name}
                <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))}>
                  <FiX className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <GlowButton type="submit" isLoading={createMutation.isPending} className="w-full">
          Add to Catalog
        </GlowButton>
      </form>
    </Modal>
  );
}