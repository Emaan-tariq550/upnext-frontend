import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiEye, FiHeart, FiSend, FiZap } from 'react-icons/fi';
import GlassCard from '../components/ui/GlassCard';
import Skeleton from '../components/ui/Skeleton';
import { newsApi } from '../api/newsApi';
import useAuthStore from '../store/authStore';

export default function ArticleDetailPage() {
  const { articleId } = useParams();
  const currentUser = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', articleId],
    queryFn: () => newsApi.getById(articleId).then((r) => r.data.data),
  });

  const { data: comments } = useQuery({
    queryKey: ['articleComments', articleId],
    queryFn: () => newsApi.getComments(articleId).then((r) => r.data.data),
  });

  const likeMutation = useMutation({
    mutationFn: () => newsApi.toggleLike(articleId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['article', articleId] }),
  });

  const commentMutation = useMutation({
    mutationFn: () => newsApi.addComment(articleId, comment),
    onSuccess: () => {
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['articleComments', articleId] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Comment failed'),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-56" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard>
          {article.isBreaking && (
            <span className="mb-3 inline-flex items-center gap-1 rounded-full bg-red-500/20 px-2.5 py-1 text-xs font-bold text-red-400">
              <FiZap className="h-3 w-3" /> BREAKING NEWS
            </span>
          )}

          {article.coverImageUrl && (
            <img src={article.coverImageUrl} className="mb-4 h-64 w-full rounded-xl object-cover" alt="" />
          )}

          <div className="flex items-center gap-2 text-xs text-upnext-muted">
            <span className="capitalize">{article.category}</span>
            <span>·</span>
            <span>{article.business?.name}</span>
            <span>·</span>
            <span>{new Date(article.publishedAt).toLocaleString()}</span>
          </div>

          <h1 className="mt-3 font-display text-2xl font-bold">{article.headline}</h1>
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-upnext-text">{article.body}</p>

          <div className="mt-6 flex items-center gap-4 border-t border-upnext-border pt-4 text-sm text-upnext-muted">
            <span className="flex items-center gap-1.5"><FiEye /> {article.views}</span>
            <button
              onClick={() => likeMutation.mutate()}
              data-cursor-hover
              className={`flex items-center gap-1.5 transition-colors ${article.isLiked ? 'text-red-500' : 'hover:text-red-400'}`}
            >
              <FiHeart className={article.isLiked ? 'fill-red-500' : ''} /> {article.likesCount}
            </button>
          </div>
        </GlassCard>
      </motion.div>

      <GlassCard>
        <h2 className="mb-4 font-semibold">Comments</h2>
        <div className="mb-4 flex items-center gap-3">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && comment.trim() && commentMutation.mutate()}
            placeholder="Add a comment..."
            className="flex-1 rounded-xl border border-upnext-border bg-black/40 px-4 py-2.5 text-sm outline-none focus:border-upnext-primary"
          />
          <button
            onClick={() => comment.trim() && commentMutation.mutate()}
            data-cursor-hover
            className="rounded-xl bg-upnext-primary p-2.5 text-black hover:bg-upnext-primary-dark"
          >
            <FiSend />
          </button>
        </div>

        <div className="space-y-3">
          {comments?.map((c) => (
            <div key={c._id} className="flex items-start gap-2 rounded-xl bg-white/5 p-3">
              <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full bg-upnext-primary/20">
                {c.user.avatarUrl && <img src={c.user.avatarUrl} className="h-full w-full object-cover" alt="" />}
              </div>
              <div>
                <p className="text-xs font-medium">{c.user.displayName}</p>
                <p className="text-sm text-upnext-muted">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}