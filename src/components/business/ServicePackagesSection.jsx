import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiPlus, FiCheck, FiClock } from 'react-icons/fi';
import GlassCard from '../ui/GlassCard';
import { servicePackageApi } from '../../api/servicePackageApi';
import CreatePackageModal from './CreatePackageModal';

export default function ServicePackagesSection({ businessId, canManage }) {
  const [showCreate, setShowCreate] = useState(false);

  const { data: packages, isLoading } = useQuery({
    queryKey: ['servicePackages', businessId],
    queryFn: () => servicePackageApi.listByBusiness(businessId).then((r) => r.data.data),
  });

  return (
    <GlassCard>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">Service Packages</h2>
        {canManage && (
          <button onClick={() => setShowCreate(true)} data-cursor-hover className="flex items-center gap-1.5 text-sm text-upnext-primary hover:text-upnext-primary-dark">
            <FiPlus className="h-4 w-4" /> Add Package
          </button>
        )}
      </div>

      {isLoading ? (
        <p className="text-sm text-upnext-muted">Loading packages...</p>
      ) : packages?.length === 0 ? (
        <p className="text-sm text-upnext-muted">Abhi koi package add nahi hui.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {packages?.map((pkg, idx) => (
            <motion.div
              key={pkg._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col rounded-xl border border-upnext-border bg-white/5 p-4 transition-colors hover:border-upnext-primary/50"
            >
              <p className="text-xs capitalize text-upnext-muted">{pkg.category.replace(/_/g, ' ')}</p>
              <p className="mt-1 font-display font-semibold">{pkg.name}</p>
              <p className="mt-2 text-2xl font-bold text-upnext-primary">
                Rs. {pkg.price.toLocaleString()}
                <span className="text-xs font-normal text-upnext-muted">{pkg.priceType === 'monthly' ? '/mo' : ''}</span>
              </p>
              {pkg.description && <p className="mt-2 text-xs text-upnext-muted">{pkg.description}</p>}

              {pkg.deliverables?.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {pkg.deliverables.map((d) => (
                    <div key={d} className="flex items-center gap-1.5 text-xs">
                      <FiCheck className="h-3 w-3 shrink-0 text-upnext-primary" /> {d}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-auto flex items-center gap-1 pt-3 text-xs text-upnext-muted">
                <FiClock className="h-3 w-3" /> {pkg.turnaroundDays} day turnaround
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <CreatePackageModal open={showCreate} onClose={() => setShowCreate(false)} businessId={businessId} />
    </GlassCard>
  );
}