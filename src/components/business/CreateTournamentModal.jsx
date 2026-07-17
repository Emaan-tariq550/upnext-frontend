import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import GlowInput from '../ui/GlowInput';
import GlowButton from '../ui/GlowButton';
import { tournamentApi } from '../../api/tournamentApi';

export default function CreateTournamentModal({ open, onClose, businessId }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { format: 'free_for_all', maxParticipants: 16 },
  });

  const createMutation = useMutation({
    mutationFn: (payload) => tournamentApi.create({ ...payload, businessId }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['businessTournaments', businessId] });
      toast.success('Tournament created');
      reset();
      onClose();
      navigate(`/tournaments/${res.data.data._id}`);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Creation failed'),
  });

  return (
    <Modal open={open} onClose={onClose} title="Create Tournament">
      <form
        onSubmit={handleSubmit((d) =>
          createMutation.mutate({ ...d, maxParticipants: Number(d.maxParticipants) })
        )}
        className="space-y-4"
      >
        <GlowInput placeholder="Tournament title" {...register('title', { required: true, maxLength: 80 })} />
        <GlowInput placeholder="Game (e.g. FIFA 26, Valorant)" {...register('game', { required: true })} />
        <textarea
          placeholder="Description"
          rows={3}
          className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-upnext-muted focus:border-upnext-primary"
          {...register('description')}
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs text-upnext-muted">Format</label>
            <select
              {...register('format')}
              className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-sm outline-none focus:border-upnext-primary"
            >
              <option value="free_for_all">Free for all</option>
              <option value="round_robin">Round robin</option>
              <option value="single_elimination">Single elimination</option>
            </select>
          </div>
          <GlowInput
            type="number"
            placeholder="Max participants"
            {...register('maxParticipants', { required: true, min: 2 })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs text-upnext-muted">Start time</label>
            <input
              type="datetime-local"
              {...register('startTime', { required: true })}
              style={{ colorScheme: 'dark' }}
              className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-sm outline-none focus:border-upnext-primary"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-upnext-muted">End time</label>
            <input
              type="datetime-local"
              {...register('endTime', { required: true })}
              style={{ colorScheme: 'dark' }}
              className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-sm outline-none focus:border-upnext-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <GlowInput type="number" placeholder="XP reward" {...register('prizePool.xp')} />
          <GlowInput type="number" placeholder="Fame reward" {...register('prizePool.fame')} />
        </div>

        <GlowButton type="submit" isLoading={createMutation.isPending} className="w-full">
          Create Tournament
        </GlowButton>
      </form>
    </Modal>
  );
}