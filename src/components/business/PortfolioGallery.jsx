import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { FiPlus, FiHeart, FiX } from 'react-icons/fi';
import GlassCard from '../ui/GlassCard';
import { portfolioApi } from '../../api/portfolioApi';
import AddPortfolioItemModal from './AddPortfolioItemModal';

const CATEGORIES = ['all', 'portrait', 'wedding', 'product', 'event', 'fashion', 'nature', 'street', 'other'];

export default function PortfolioGallery({ businessId, canManage }) {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [category, setCategory] = useState('all');
  const [lightbox, setLightbox] = useState(null);

  const { data: items, isLoading } = useQuery({
    queryKey: ['portfolio', businessId, category],
    queryFn: () => portfolioApi.listByBusiness(businessId, category === 'all' ? undefined : category).then((r) => r.data.data),
  });

  const likeMutation = useMutation({
    mutationFn: (itemId) => portfolioApi.toggleLike(itemId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['portfolio', businessId] }),
  });

  return (
    <>
      <GlassCard>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Portfolio</h2>
          {canManage && (
            <button onClick={() => setShowAdd(true)} data-cursor-hover className="flex items-center gap-1.5 text-sm text-upnext-primary hover:text-upnext-primary-dark">
              <FiPlus className="h-4 w-4" /> Add Photo
            </button>
          )}
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
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
          <p className="text-sm text-upnext-muted">Loading portfolio...</p>
        ) : items?.length === 0 ? (
          <p className="text-sm text-upnext-muted">Is category mein koi photo nahi.</p>
        ) : (
          <div className="columns-2 gap-3 sm:columns-3 [&>*]:mb-3">
            {items?.map((item, idx) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.03, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setLightbox(item)}
                data-cursor-hover
                className="group relative break-inside-avoid cursor-pointer overflow-hidden rounded-xl"
              >
                <img src={item.imageUrl} className="w-full object-cover transition-transform duration-300 group-hover:scale-105" alt={item.title} />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="flex items-center gap-1 text-xs text-white">
                    <FiHeart className={item.likes?.length ? 'fill-red-500 text-red-500' : ''} /> {item.likes?.length ?? 0}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <AddPortfolioItemModal open={showAdd} onClose={() => setShowAdd(false)} businessId={businessId} />
      </GlassCard>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          >
            <motion.button
              onClick={() => setLightbox(null)}
              data-cursor-hover
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            >
              <FiX className="h-5 w-5" />
            </motion.button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-3xl"
            >
              <img src={lightbox.imageUrl} className="max-h-[85vh] rounded-xl object-contain" alt={lightbox.title} />
              <div className="mt-3 flex items-center justify-between text-white">
                <div>
                  {lightbox.title && <p className="font-medium">{lightbox.title}</p>}
                  <p className="text-xs capitalize text-white/60">{lightbox.category}</p>
                </div>
                <button
                  onClick={() => likeMutation.mutate(lightbox._id)}
                  data-cursor-hover
                  className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20"
                >
                  <FiHeart className={lightbox.likes?.length ? 'fill-red-500 text-red-500' : ''} /> {lightbox.likes?.length ?? 0}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}