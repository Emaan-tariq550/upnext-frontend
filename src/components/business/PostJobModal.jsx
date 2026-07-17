import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import GlowInput from '../ui/GlowInput';
import GlowButton from '../ui/GlowButton';
import { jobApi } from '../../api/jobApi';

const ROLES = ['engineering', 'design', 'product', 'marketing', 'sales', 'operations', 'internship', 'other'];

export default function PostJobModal({ open, onClose, businessId }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { role: 'engineering', employmentType: 'full_time', locationType: 'remote' },
  });

  const createMutation = useMutation({
    mutationFn: (payload) =>
      jobApi.create({
        ...payload,
        businessId,
        skills: payload.skills ? payload.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
        salaryMin: Number(payload.salaryMin) || null,
        salaryMax: Number(payload.salaryMax) || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs', businessId] });
      toast.success('Job posted');
      reset();
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to post job'),
  });

  return (
    <Modal open={open} onClose={onClose} title="Post a Job">
      <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
        <GlowInput placeholder="Job title" {...register('title', { required: true, maxLength: 100 })} />
        <textarea
          placeholder="Job description"
          rows={4}
          className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-upnext-muted focus:border-upnext-primary"
          {...register('description', { required: true })}
        />

        <div className="grid grid-cols-3 gap-3">
          <select {...register('role')} className="w-full rounded-xl border border-upnext-border bg-black/40 px-3 py-3 text-xs capitalize outline-none focus:border-upnext-primary">
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <select {...register('employmentType')} className="w-full rounded-xl border border-upnext-border bg-black/40 px-3 py-3 text-xs capitalize outline-none focus:border-upnext-primary">
            <option value="full_time">Full-time</option>
            <option value="part_time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
          <select {...register('locationType')} className="w-full rounded-xl border border-upnext-border bg-black/40 px-3 py-3 text-xs capitalize outline-none focus:border-upnext-primary">
            <option value="remote">Remote</option>
            <option value="onsite">Onsite</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        <GlowInput placeholder="Skills (comma separated: React, Node, MongoDB)" {...register('skills')} />

        <div className="grid grid-cols-2 gap-3">
          <GlowInput type="number" placeholder="Salary min (optional)" {...register('salaryMin')} />
          <GlowInput type="number" placeholder="Salary max (optional)" {...register('salaryMax')} />
        </div>

        <GlowButton type="submit" isLoading={createMutation.isPending} className="w-full">
          Post Job
        </GlowButton>
      </form>
    </Modal>
  );
}