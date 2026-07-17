import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiPlus, FiHeart, FiExternalLink, FiGithub, FiCode } from 'react-icons/fi';
import GlassCard from '../ui/GlassCard';
import { projectShowcaseApi } from '../../api/projectShowcaseApi';
import AddProjectModal from './AddProjectModal';

export default function ProjectShowcaseSection({ businessId, canManage }) {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects', businessId],
    queryFn: () => projectShowcaseApi.listByBusiness(businessId).then((r) => r.data.data),
  });

  const likeMutation = useMutation({
    mutationFn: (id) => projectShowcaseApi.toggleLike(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects', businessId] }),
  });

  return (
    <GlassCard>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">Project Showcase</h2>
        {canManage && (
          <button onClick={() => setShowAdd(true)} data-cursor-hover className="flex items-center gap-1.5 text-sm text-upnext-primary hover:text-upnext-primary-dark">
            <FiPlus className="h-4 w-4" /> Add Project
          </button>
        )}
      </div>

      {isLoading ? (
        <p className="text-sm text-upnext-muted">Loading projects...</p>
      ) : projects?.length === 0 ? (
        <p className="text-sm text-upnext-muted">Abhi koi project showcase nahi hai.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {projects?.map((p, idx) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden rounded-xl border border-upnext-border bg-white/5"
            >
              <div className="flex h-32 items-center justify-center bg-black/40">
                {p.coverImageUrl ? (
                  <img src={p.coverImageUrl} className="h-full w-full object-cover" alt={p.title} />
                ) : (
                  <FiCode className="h-8 w-8 text-upnext-muted" />
                )}
              </div>
              <div className="p-3">
                <p className="font-medium">{p.title}</p>
                <p className="mt-1 line-clamp-2 text-xs text-upnext-muted">{p.description}</p>
                {p.techStack?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {p.techStack.map((t) => (
                      <span key={t} className="rounded-md bg-upnext-primary/10 px-2 py-0.5 text-[10px] text-upnext-primary">{t}</span>
                    ))}
                  </div>
                )}
                <div className="mt-3 flex items-center justify-between text-xs text-upnext-muted">
                  <div className="flex gap-3">
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noreferrer" data-cursor-hover className="flex items-center gap-1 hover:text-upnext-primary">
                        <FiExternalLink /> Live
                      </a>
                    )}
                    {p.repoUrl && (
                      <a href={p.repoUrl} target="_blank" rel="noreferrer" data-cursor-hover className="flex items-center gap-1 hover:text-upnext-primary">
                        <FiGithub /> Code
                      </a>
                    )}
                  </div>
                  <button onClick={() => likeMutation.mutate(p._id)} data-cursor-hover className="flex items-center gap-1 hover:text-red-400">
                    <FiHeart className={p.likes?.length ? 'fill-red-500 text-red-500' : ''} /> {p.likes?.length ?? 0}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AddProjectModal open={showAdd} onClose={() => setShowAdd(false)} businessId={businessId} />
    </GlassCard>
  );
}