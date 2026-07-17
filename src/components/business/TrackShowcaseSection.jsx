import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiPlus, FiPlay, FiPause, FiHeart, FiMusic } from 'react-icons/fi';
import GlassCard from '../ui/GlassCard';
import { trackApi } from '../../api/trackApi';
import UploadTrackModal from './UploadTrackModal';

function TrackCard({ track, isPlaying, onPlayToggle, idx }) {
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: () => trackApi.toggleLike(track._id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tracks'] }),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-3 rounded-xl border border-upnext-border bg-white/5 p-3"
    >
      <button
        onClick={() => onPlayToggle(track)}
        data-cursor-hover
        className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-black/40"
      >
        {track.coverImageUrl ? (
          <img src={track.coverImageUrl} className="h-full w-full object-cover" alt="" />
        ) : (
          <FiMusic className="text-upnext-muted" />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">
          {isPlaying ? <FiPause className="text-white" /> : <FiPlay className="text-white" />}
        </div>
      </button>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{track.title}</p>
        <p className="truncate text-xs text-upnext-muted">
          {track.artistName || 'Unknown Artist'} · {track.genre}
        </p>

        {isPlaying && (
          <div className="mt-1.5 flex items-end gap-0.5">
            {[...Array(16)].map((_, i) => (
              <motion.span
                key={i}
                animate={{ height: [4, 12, 4] }}
                transition={{ repeat: Infinity, duration: 0.6 + (i % 4) * 0.15, delay: i * 0.05 }}
                className="w-0.5 rounded-full bg-upnext-primary"
                style={{ height: 4 }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-3 text-xs text-upnext-muted">
        <span>{track.playsCount ?? 0} plays</span>
        <button
          onClick={() => likeMutation.mutate()}
          data-cursor-hover
          className="flex items-center gap-1 hover:text-red-400"
        >
          <FiHeart className={track.likes?.length ? 'text-red-500' : ''} /> {track.likes?.length ?? 0}
        </button>
      </div>
    </motion.div>
  );
}

export default function TrackShowcaseSection({ businessId, canManage }) {
  const [showUpload, setShowUpload] = useState(false);
  const [nowPlaying, setNowPlaying] = useState(null);
  const audioRef = useRef(null);

  const { data: tracks, isLoading } = useQuery({
    queryKey: ['tracks', businessId],
    queryFn: () => trackApi.listByBusiness(businessId).then((r) => r.data.data),
  });

  const handlePlayToggle = (track) => {
    if (nowPlaying?._id === track._id) {
      audioRef.current?.pause();
      setNowPlaying(null);
      return;
    }

    trackApi.play(track._id).catch(() => {});
    setNowPlaying(track);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.src = track.audioUrl;
        audioRef.current.play();
      }
    }, 0);
  };

  return (
    <GlassCard>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-semibold">Track Showcase</h2>
        {canManage && (
          <button onClick={() => setShowUpload(true)} data-cursor-hover className="flex items-center gap-1.5 text-sm text-upnext-primary hover:text-upnext-primary-dark">
            <FiPlus className="h-4 w-4" /> Upload Track
          </button>
        )}
      </div>

      {isLoading ? (
        <p className="text-sm text-upnext-muted">Loading tracks...</p>
      ) : tracks?.length === 0 ? (
        <p className="text-sm text-upnext-muted">Abhi koi track upload nahi hui.</p>
      ) : (
        <div className="space-y-2">
          {tracks?.map((track, idx) => (
            <TrackCard
              key={track._id}
              track={track}
              idx={idx}
              isPlaying={nowPlaying?._id === track._id}
              onPlayToggle={handlePlayToggle}
            />
          ))}
        </div>
      )}

      <audio ref={audioRef} onEnded={() => setNowPlaying(null)} />

      <UploadTrackModal open={showUpload} onClose={() => setShowUpload(false)} businessId={businessId} />
    </GlassCard>
  );
}