import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiPlus, FiZap, FiAward, FiChevronDown, FiTrendingUp } from 'react-icons/fi';
import GlassCard from '../ui/GlassCard';
import GlowButton from '../ui/GlowButton';
import GlowInput from '../ui/GlowInput';
import { arcadeApi } from '../../api/arcadeApi';
import useAuthStore from '../../store/authStore';
import CreateArcadeGameModal from './CreateArcadeGameModal';

const MEDALS = ['🥇', '🥈', '🥉'];

function GameCard({ game, currentUser, onSubmitScore, isSubmitting }) {
  const [expanded, setExpanded] = useState(false);
  const [scoreInput, setScoreInput] = useState('');
  const [celebrate, setCelebrate] = useState(false);

  const topScore = game.highScores?.[0];
  const myBest = game.highScores?.find((h) => h.user._id === currentUser?._id);

  const handleSubmit = async () => {
    if (!scoreInput || Number(scoreInput) <= 0) {
      toast.error('Valid score dalein');
      return;
    }
    const result = await onSubmitScore(game._id, Number(scoreInput));
    setScoreInput('');
    if (result?.isNewRecord) {
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 2200);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-xl border border-upnext-border bg-white/5"
    >
      {/* New record celebration overlay */}
      <AnimatePresence>
        {celebrate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 bg-black/85 backdrop-blur-sm"
          >
            <motion.span
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 12 }}
              className="text-3xl"
            >
              🏆
            </motion.span>
            <motion.p
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="font-display text-sm font-bold text-upnext-gold"
            >
              NEW HIGH SCORE!
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-black/40 text-xl">
            {game.imageUrl ? <img src={game.imageUrl} className="h-full w-full object-cover" alt="" /> : '🕹️'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{game.name}</p>
            {topScore ? (
              <p className="mt-0.5 flex items-center gap-1 text-xs text-upnext-gold">
                <FiAward className="h-3 w-3" /> {topScore.score.toLocaleString()} by {topScore.user.displayName}
              </p>
            ) : (
              <p className="mt-0.5 text-xs text-upnext-muted">Koi high score nahi abhi tak</p>
            )}
            {myBest && (
              <p className="mt-0.5 flex items-center gap-1 text-xs text-upnext-primary">
                <FiTrendingUp className="h-3 w-3" /> Your best: {myBest.score.toLocaleString()}
              </p>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <GlowInput
            type="number"
            placeholder="Apna score dalein"
            value={scoreInput}
            onChange={(e) => setScoreInput(e.target.value)}
            className="!py-2 !text-sm"
          />
          <button
            data-cursor-hover
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-1 rounded-xl bg-upnext-primary px-3 py-2 text-xs font-medium text-black transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <FiZap className="h-3.5 w-3.5" /> Submit
          </button>
        </div>

        {game.highScores?.length > 0 && (
          <button
            onClick={() => setExpanded((e) => !e)}
            data-cursor-hover
            className="mt-3 flex w-full items-center justify-center gap-1 text-xs text-upnext-muted hover:text-upnext-text"
          >
            {expanded ? 'Hide' : 'View'} leaderboard
            <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <FiChevronDown className="h-3.5 w-3.5" />
            </motion.span>
          </button>
        )}
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-upnext-border"
          >
            <div className="max-h-56 space-y-1.5 overflow-y-auto p-3">
              {game.highScores.slice(0, 10).map((h, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-lg bg-black/20 px-3 py-1.5 text-xs">
                  <span className="flex items-center gap-2">
                    <span className="w-5 text-center">{MEDALS[idx] || idx + 1}</span>
                    {h.user.displayName}
                  </span>
                  <span className="font-semibold">{h.score.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ArcadeSection({ businessId, canManage }) {
  const currentUser = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [showChampions, setShowChampions] = useState(false);

  const { data: games, isLoading } = useQuery({
    queryKey: ['arcadeGames', businessId],
    queryFn: () => arcadeApi.listByBusiness(businessId).then((r) => r.data.data),
  });

  const { data: champions } = useQuery({
    queryKey: ['arcadeChampions', businessId],
    queryFn: () => arcadeApi.getChampions(businessId).then((r) => r.data.data),
    enabled: showChampions,
  });

  const scoreMutation = useMutation({
    mutationFn: ({ gameId, score }) => arcadeApi.submitScore(gameId, score),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['arcadeGames', businessId] });
      queryClient.invalidateQueries({ queryKey: ['arcadeChampions', businessId] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Score submit nahi hua'),
  });

  const handleSubmitScore = async (gameId, score) => {
    try {
      const res = await scoreMutation.mutateAsync({ gameId, score });
      toast.success(res.data.data.isNewRecord ? 'Naya record ban gaya! 🔥' : 'Score submit ho gaya');
      return res.data.data;
    } catch {
      return null;
    }
  };

  return (
    <GlassCard>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-semibold">Arcade Floor</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowChampions((s) => !s)}
            data-cursor-hover
            className="flex items-center gap-1.5 text-sm text-upnext-gold hover:opacity-80"
          >
            <FiAward className="h-4 w-4" /> Champions
          </button>
          {canManage && (
            <button onClick={() => setShowCreate(true)} data-cursor-hover className="flex items-center gap-1.5 text-sm text-upnext-primary hover:text-upnext-primary-dark">
              <FiPlus className="h-4 w-4" /> Add Machine
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showChampions && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mb-5 overflow-hidden rounded-xl border border-upnext-gold/30 bg-upnext-gold/5"
          >
            <div className="space-y-1.5 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-upnext-gold">
                Overall Arcade Champions
              </p>
              {champions?.length ? (
                champions.slice(0, 5).map((c, idx) => (
                  <div key={c.user._id} className="flex items-center justify-between rounded-lg bg-black/20 px-3 py-2 text-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-5 text-center">{MEDALS[idx] || idx + 1}</span>
                      {c.user.displayName}
                      <span className="text-xs text-upnext-muted">({c.gamesPlayed} games)</span>
                    </span>
                    <span className="font-semibold text-upnext-gold">{c.totalScore.toLocaleString()}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-upnext-muted">Abhi koi champion nahi.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <p className="text-sm text-upnext-muted">Loading arcade floor...</p>
      ) : games?.length === 0 ? (
        <p className="text-sm text-upnext-muted">Abhi koi machine add nahi hui.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {games?.map((game) => (
            <GameCard
              key={game._id}
              game={game}
              currentUser={currentUser}
              onSubmitScore={handleSubmitScore}
              isSubmitting={scoreMutation.isPending}
            />
          ))}
        </div>
      )}

      <CreateArcadeGameModal open={showCreate} onClose={() => setShowCreate(false)} businessId={businessId} />
    </GlassCard>
  );
}