import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiPlus, FiLayers } from 'react-icons/fi';
import GlassCard from '../ui/GlassCard';
import { collectionApi } from '../../api/collectionApi';
import CreateCollectionModal from './CreateCollectionModal';

export default function CollectionsSection({ businessId, canManage }) {
  const [showCreate, setShowCreate] = useState(false);

  const { data: collections, isLoading } = useQuery({
    queryKey: ['collections', businessId],
    queryFn: () => collectionApi.listByBusiness(businessId).then((r) => r.data.data),
  });

  return (
    <GlassCard>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">Collections</h2>
        {canManage && (
          <button onClick={() => setShowCreate(true)} data-cursor-hover className="flex items-center gap-1.5 text-sm text-upnext-primary hover:text-upnext-primary-dark">
            <FiPlus className="h-4 w-4" /> New Collection
          </button>
        )}
      </div>

      {isLoading ? (
        <p className="text-sm text-upnext-muted">Loading collections...</p>
      ) : collections?.length === 0 ? (
        <p className="text-sm text-upnext-muted">Abhi koi collection nahi hai.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {collections?.map((c, idx) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden rounded-xl border border-upnext-border bg-white/5"
            >
              <div className="relative h-36 bg-black/40">
                {c.coverImageUrl ? (
                  <img src={c.coverImageUrl} className="h-full w-full object-cover" alt={c.name} />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <FiLayers className="h-6 w-6 text-upnext-muted" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <p className="font-medium text-white">{c.name}</p>
                  <p className="text-xs text-white/70">{c.products?.length ?? 0} pieces</p>
                </div>
              </div>
              {c.description && <p className="p-3 text-xs text-upnext-muted">{c.description}</p>}
            </motion.div>
          ))}
        </div>
      )}

      <CreateCollectionModal open={showCreate} onClose={() => setShowCreate(false)} businessId={businessId} />
    </GlassCard>
  );
}