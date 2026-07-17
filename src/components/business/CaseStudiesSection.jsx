import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiPlus, FiHeart, FiTrendingUp } from 'react-icons/fi';
import GlassCard from '../ui/GlassCard';
import { caseStudyApi } from '../../api/caseStudyApi';
import AddCaseStudyModal from './AddCaseStudyModal';

export default function CaseStudiesSection({ businessId, canManage }) {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);

  const { data: caseStudies, isLoading } = useQuery({
    queryKey: ['caseStudies', businessId],
    queryFn: () => caseStudyApi.listByBusiness(businessId).then((r) => r.data.data),
  });

  const likeMutation = useMutation({
    mutationFn: (id) => caseStudyApi.toggleLike(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['caseStudies', businessId] }),
  });

  return (
    <GlassCard>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">Case Studies</h2>
        {canManage && (
          <button onClick={() => setShowAdd(true)} data-cursor-hover className="flex items-center gap-1.5 text-sm text-upnext-primary hover:text-upnext-primary-dark">
            <FiPlus className="h-4 w-4" /> Add Case Study
          </button>
        )}
      </div>

      {isLoading ? (
        <p className="text-sm text-upnext-muted">Loading case studies...</p>
      ) : caseStudies?.length === 0 ? (
        <p className="text-sm text-upnext-muted">Abhi koi case study nahi hai.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {caseStudies?.map((cs, idx) => (
            <motion.div
              key={cs._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden rounded-xl border border-upnext-border bg-white/5"
            >
              <div className="flex h-32 items-center justify-center bg-black/40">
                {cs.coverImageUrl ? (
                  <img src={cs.coverImageUrl} className="h-full w-full object-cover" alt={cs.title} />
                ) : (
                  <FiTrendingUp className="h-8 w-8 text-upnext-muted" />
                )}
              </div>
              <div className="p-3">
                <p className="text-xs text-upnext-muted">{cs.clientName}</p>
                <p className="font-medium">{cs.title}</p>
                {cs.summary && <p className="mt-1 line-clamp-2 text-xs text-upnext-muted">{cs.summary}</p>}
                {cs.resultMetric && (
                  <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-400">
                    <FiTrendingUp className="h-3 w-3" /> {cs.resultMetric}
                  </span>
                )}
                <button
                  onClick={() => likeMutation.mutate(cs._id)}
                  data-cursor-hover
                  className="mt-3 flex items-center gap-1 text-xs text-upnext-muted hover:text-red-400"
                >
                  <FiHeart className={cs.likes?.length ? 'fill-red-500 text-red-500' : ''} /> {cs.likes?.length ?? 0}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AddCaseStudyModal open={showAdd} onClose={() => setShowAdd(false)} businessId={businessId} />
    </GlassCard>
  );
}