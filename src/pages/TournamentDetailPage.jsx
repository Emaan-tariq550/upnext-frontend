import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiCalendar, FiUsers, FiAward, FiPlay, FiCheckCircle } from 'react-icons/fi';
import GlassCard from '../components/ui/GlassCard';
import Skeleton from '../components/ui/Skeleton';
import GlowButton from '../components/ui/GlowButton';
import { tournamentApi } from '../api/tournamentApi';
import useAuthStore from '../store/authStore';

export default function TournamentDetailPage() {
  const { tournamentId } = useParams();
  const currentUser = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const { data: tournament, isLoading } = useQuery({
    queryKey: ['tournament', tournamentId],
    queryFn: () => tournamentApi.getById(tournamentId).then((r) => r.data.data),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['tournament', tournamentId] });

  const joinMutation = useMutation({
    mutationFn: () => tournamentApi.join(tournamentId),
    onSuccess: () => {
      invalidate();
      toast.success('Registered! Good luck.');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Join failed'),
  });

  const leaveMutation = useMutation({
    mutationFn: () => tournamentApi.leave(tournamentId),
    onSuccess: () => {
      invalidate();
      toast.success('Left the tournament');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const startMutation = useMutation({
    mutationFn: () => tournamentApi.start(tournamentId),
    onSuccess: () => {
      invalidate();
      toast.success('Tournament started');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const completeMutation = useMutation({
    mutationFn: () => tournamentApi.complete(tournamentId),
    onSuccess: () => {
      invalidate();
      toast.success('Tournament completed, ranks finalized');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const scoreMutation = useMutation({
    mutationFn: ({ userId, score }) => tournamentApi.submitScore(tournamentId, userId, score),
    onSuccess: () => invalidate(),
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-56" />
      </div>
    );
  }

  const isHost = tournament?.host?._id === currentUser?._id;
  const isJoined = tournament?.participants?.some((p) => p.user._id === currentUser?._id);
  const sortedParticipants = [...(tournament?.participants || [])].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard>
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-upnext-primary/20 px-3 py-1 text-xs font-medium capitalize text-upnext-primary">
              {tournament.status}
            </span>
            <span className="text-xs text-upnext-muted">{tournament.format?.replace(/_/g, ' ')}</span>
          </div>

          <h1 className="mt-4 font-display text-2xl font-bold">{tournament.title}</h1>
          <p className="text-sm text-upnext-primary">{tournament.game}</p>
          <p className="mt-2 text-sm text-upnext-muted">{tournament.description}</p>

          <div className="mt-6 flex flex-wrap gap-6 text-sm text-upnext-muted">
            <span className="flex items-center gap-2">
              <FiCalendar /> {new Date(tournament.startTime).toLocaleString()}
            </span>
            <span className="flex items-center gap-2">
              <FiUsers /> {tournament.participants?.length ?? 0}/{tournament.maxParticipants}
            </span>
            <span className="flex items-center gap-2">
              <FiAward /> {tournament.prizePool?.fame} fame / {tournament.prizePool?.xp} xp
            </span>
          </div>

          {/* Guest actions */}
          {!isHost && tournament.status === 'upcoming' && (
            <div className="mt-6">
              {isJoined ? (
                <GlowButton onClick={() => leaveMutation.mutate()} isLoading={leaveMutation.isPending} variant="outline">
                  Leave Tournament
                </GlowButton>
              ) : (
                <GlowButton onClick={() => joinMutation.mutate()} isLoading={joinMutation.isPending}>
                  Join Tournament
                </GlowButton>
              )}
            </div>
          )}

          {/* Host controls */}
          {isHost && (
            <div className="mt-6 flex gap-3">
              {tournament.status === 'upcoming' && (
                <GlowButton onClick={() => startMutation.mutate()} isLoading={startMutation.isPending}>
                  <FiPlay className="mr-1.5 inline h-4 w-4" /> Start Tournament
                </GlowButton>
              )}
              {tournament.status === 'ongoing' && (
                <GlowButton onClick={() => completeMutation.mutate()} isLoading={completeMutation.isPending}>
                  <FiCheckCircle className="mr-1.5 inline h-4 w-4" /> Complete & Finalize Ranks
                </GlowButton>
              )}
            </div>
          )}
        </GlassCard>
      </motion.div>

      <GlassCard>
        <h2 className="mb-4 font-semibold">Leaderboard</h2>
        <div className="space-y-2">
          {sortedParticipants.length === 0 && <p className="text-sm text-upnext-muted">Abhi koi participant nahi.</p>}
          {sortedParticipants.map((p, idx) => (
            <div key={p.user._id} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="w-6 text-center font-display font-bold text-upnext-gold">
                  {p.rank || idx + 1}
                </span>
                <div className="h-8 w-8 overflow-hidden rounded-full bg-upnext-primary/20">
                  {p.user.avatarUrl && <img src={p.user.avatarUrl} className="h-full w-full object-cover" alt="" />}
                </div>
                <span className="text-sm">{p.user.displayName}</span>
              </div>

              {isHost && tournament.status === 'ongoing' ? (
                <input
                  type="number"
                  defaultValue={p.score}
                  onBlur={(e) => scoreMutation.mutate({ userId: p.user._id, score: Number(e.target.value) })}
                  className="w-20 rounded-lg border border-upnext-border bg-black/40 px-2 py-1 text-right text-sm outline-none focus:border-upnext-primary"
                />
              ) : (
                <span className="text-sm font-medium">{p.score} pts</span>
              )}
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}