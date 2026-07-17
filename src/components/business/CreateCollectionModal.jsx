import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import GlowInput from '../ui/GlowInput';
import GlowButton from '../ui/GlowButton';
import { collectionApi } from '../../api/collectionApi';
import { productApi } from '../../api/productApi';

export default function CreateCollectionModal({ open, onClose, businessId }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();
  const [selected, setSelected] = useState([]);

  const { data: products } = useQuery({
    queryKey: ['products', businessId],
    queryFn: () => productApi.listByBusiness(businessId).then((r) => r.data.data),
    enabled: open,
  });

  const createMutation = useMutation({
    mutationFn: (payload) => collectionApi.create({ ...payload, businessId, productIds: selected }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections', businessId] });
      toast.success('Collection created');
      reset();
      setSelected([]);
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const toggleProduct = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  return (
    <Modal open={open} onClose={onClose} title="Create Collection">
      <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
        <GlowInput placeholder="Collection name (e.g. Summer '26 Lookbook)" {...register('name', { required: true, maxLength: 80 })} />
        <textarea
          placeholder="Description"
          rows={2}
          className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-upnext-muted focus:border-upnext-primary"
          {...register('description')}
        />
        <GlowInput placeholder="Cover image URL (optional)" {...register('coverImageUrl')} />

        <div>
          <p className="mb-2 text-xs text-upnext-muted">Products shamil karein</p>
          <div className="max-h-40 space-y-1.5 overflow-y-auto">
            {products?.map((p) => (
              <label key={p._id} className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm" data-cursor-hover>
                <input
                  type="checkbox"
                  checked={selected.includes(p._id)}
                  onChange={() => toggleProduct(p._id)}
                  className="h-4 w-4 rounded border-upnext-border accent-upnext-primary"
                />
                {p.name}
              </label>
            ))}
            {products?.length === 0 && <p className="text-xs text-upnext-muted">Pehle kuch products add karein.</p>}
          </div>
        </div>

        <GlowButton type="submit" isLoading={createMutation.isPending} className="w-full">
          Create Collection
        </GlowButton>
      </form>
    </Modal>
  );
}