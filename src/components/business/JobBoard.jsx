import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiPlus, FiMapPin, FiBriefcase, FiDollarSign, FiChevronDown, FiCheck, FiX } from 'react-icons/fi';
import GlassCard from '../ui/GlassCard';
import GlowButton from '../ui/GlowButton';
import { jobApi } from '../../api/jobApi';
import useAuthStore from '../../store/authStore';
import PostJobModal from './PostJobModal';
import ApplyJobModal from './ApplyJobModal';

const APP_STATUS_STYLES = {
  pending: 'bg-amber-500/20 text-amber-400',
  reviewed: 'bg-blue-500/20 text-blue-400',
  shortlisted: 'bg-green-500/20 text-green-400',
  rejected: 'bg-red-500/20 text-red-400',
  hired: 'bg-upnext-primary/20 text-upnext-primary',
};

function JobCard({ job, businessId, canManage, currentUser, idx }) {
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(false);
  const [showApply, setShowApply] = useState(false);

  const hasApplied = job.applications?.some((a) => a.user === currentUser?._id || a.user?._id === currentUser?._id);

  const statusMutation = useMutation({
    mutationFn: ({ userId, status }) => jobApi.updateApplicationStatus(job._id, userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs', businessId] });
      toast.success('Status updated');
    },
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-xl border border-upnext-border bg-white/5 p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-medium">{job.title}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-upnext-muted">
            <span className="flex items-center gap-1 capitalize"><FiBriefcase /> {job.role} · {job.employmentType.replace('_', '-')}</span>
            <span className="flex items-center gap-1 capitalize"><FiMapPin /> {job.locationType}</span>
            {job.salaryMin && (
              <span className="flex items-center gap-1"><FiDollarSign /> {job.salaryMin.toLocaleString()}{job.salaryMax ? ` - ${job.salaryMax.toLocaleString()}` : '+'}</span>
            )}
          </div>
          {job.skills?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {job.skills.map((s) => (
                <span key={s} className="rounded-md bg-upnext-primary/10 px-2 py-0.5 text-[10px] text-upnext-primary">{s}</span>
              ))}
            </div>
          )}
        </div>

        <button onClick={() => setExpanded((e) => !e)} data-cursor-hover className="shrink-0 text-upnext-muted">
          <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <FiChevronDown />
          </motion.span>
        </button>
      </div>

      {!canManage && (
        <div className="mt-3">
          {hasApplied ? (
            <span className="text-xs text-upnext-primary">✓ Applied</span>
          ) : (
            <GlowButton onClick={() => setShowApply(true)} className="!px-4 !py-1.5 !text-xs">
              Apply Now
            </GlowButton>
          )}
        </div>
      )}

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-3 border-t border-upnext-border pt-3">
              <p className="whitespace-pre-line text-sm text-upnext-muted">{job.description}</p>

              {canManage && (
                <div>
                  <p className="mb-2 text-xs font-medium text-upnext-muted">{job.applications?.length ?? 0} Applications</p>
                  <div className="space-y-2">
                    {job.applications?.map((app, i) => (
                      <div key={i} className="rounded-lg bg-black/20 p-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{app.user?.displayName || 'Applicant'}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${APP_STATUS_STYLES[app.status]}`}>
                            {app.status}
                          </span>
                        </div>
                        {app.coverNote && <p className="mt-1 text-xs text-upnext-muted">{app.coverNote}</p>}
                        <div className="mt-2 flex gap-1.5">
                          {['reviewed', 'shortlisted', 'hired', 'rejected'].map((st) => (
                            <button
                              key={st}
                              onClick={() => statusMutation.mutate({ userId: app.user?._id || app.user, status: st })}
                              data-cursor-hover
                              className="rounded-md border border-upnext-border px-2 py-0.5 text-[10px] capitalize hover:bg-white/5"
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    {job.applications?.length === 0 && <p className="text-xs text-upnext-muted">Abhi koi application nahi.</p>}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ApplyJobModal open={showApply} onClose={() => setShowApply(false)} jobId={job._id} businessId={businessId} />
    </motion.div>
  );
}

export default function JobBoard({ businessId, canManage }) {
  const currentUser = useAuthStore((s) => s.user);
  const [showPost, setShowPost] = useState(false);

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs', businessId],
    queryFn: () => jobApi.listByBusiness(businessId).then((r) => r.data.data),
  });

  return (
    <GlassCard>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-semibold">Open Roles</h2>
        {canManage && (
          <button onClick={() => setShowPost(true)} data-cursor-hover className="flex items-center gap-1.5 text-sm text-upnext-primary hover:text-upnext-primary-dark">
            <FiPlus className="h-4 w-4" /> Post Job
          </button>
        )}
      </div>

      {isLoading ? (
        <p className="text-sm text-upnext-muted">Loading jobs...</p>
      ) : jobs?.length === 0 ? (
        <p className="text-sm text-upnext-muted">Abhi koi open role nahi.</p>
      ) : (
        <div className="space-y-3">
          {jobs?.map((job, idx) => (
            <JobCard key={job._id} job={job} businessId={businessId} canManage={canManage} currentUser={currentUser} idx={idx} />
          ))}
        </div>
      )}

      <PostJobModal open={showPost} onClose={() => setShowPost(false)} businessId={businessId} />
    </GlassCard>
  );
}