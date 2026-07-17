import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiHeart, FiTag } from 'react-icons/fi';
import GlassCard from '../ui/GlassCard';
import { productApi } from '../../api/productApi';
import AddProductModal from './AddProductModal';

function ProductCard({ product, idx }) {
  const queryClient = useQueryClient();
  const [burst, setBurst] = useState(false);

  const wishlistMutation = useMutation({
    mutationFn: () => productApi.toggleWishlist(product._id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      if (res.data.data.isWishlisted) {
        setBurst(true);
        setTimeout(() => setBurst(false), 500);
      }
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className="group overflow-hidden rounded-xl border border-upnext-border bg-white/5"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-black/40">
        {product.images?.[0]?.url ? (
          <img src={product.images[0].url} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" alt={product.name} />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-upnext-muted">
            <FiTag className="h-6 w-6" />
          </div>
        )}

        {!product.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="text-xs font-medium text-white">Sold Out</span>
          </div>
        )}

        <button
          onClick={() => wishlistMutation.mutate()}
          data-cursor-hover
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm"
        >
          <FiHeart className={`h-4 w-4 transition-colors ${product.wishlistedBy?.length ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          <AnimatePresence>
            {burst && (
              <motion.span
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 rounded-full border-2 border-red-500"
              />
            )}
          </AnimatePresence>
        </button>
      </div>

      <div className="p-3">
        <p className="truncate text-sm font-medium">{product.name}</p>
        <p className="mt-0.5 text-sm font-semibold text-upnext-primary">Rs. {product.price}</p>
        {product.sizes?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {product.sizes.map((s) => (
              <span key={s} className="rounded-md border border-upnext-border px-1.5 py-0.5 text-[10px] text-upnext-muted">
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function ProductCatalog({ businessId, canManage }) {
  const [showAdd, setShowAdd] = useState(false);
  const [category, setCategory] = useState('all');

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', businessId],
    queryFn: () => productApi.listByBusiness(businessId).then((r) => r.data.data),
  });

  const categories = useMemo(() => {
    const set = new Set(products?.map((p) => p.category) || []);
    return ['all', ...set];
  }, [products]);

  const filtered = category === 'all' ? products : products?.filter((p) => p.category === category);

  return (
    <GlassCard>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">Catalog</h2>
        {canManage && (
          <button onClick={() => setShowAdd(true)} data-cursor-hover className="flex items-center gap-1.5 text-sm text-upnext-primary hover:text-upnext-primary-dark">
            <FiPlus className="h-4 w-4" /> Add Product
          </button>
        )}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            data-cursor-hover
            className={`rounded-full px-3 py-1 text-xs capitalize transition-colors ${
              category === c ? 'bg-upnext-primary text-black' : 'bg-white/5 text-upnext-muted hover:bg-white/10'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-sm text-upnext-muted">Loading catalog...</p>
      ) : filtered?.length === 0 ? (
        <p className="text-sm text-upnext-muted">Abhi koi product nahi hai.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {filtered?.map((p, idx) => (
            <ProductCard key={p._id} product={p} idx={idx} />
          ))}
        </div>
      )}

      <AddProductModal open={showAdd} onClose={() => setShowAdd(false)} businessId={businessId} />
    </GlassCard>
  );
}