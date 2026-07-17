import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiMessageCircle, FiSend } from 'react-icons/fi';
import { postApi } from '../../api/postApi';
import GlassCard from '../ui/GlassCard';

export default function PostCard({ post }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: () => postApi.toggleLike(post._id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['feed'] }),
  });

  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ['comments', post._id],
    queryFn: () => postApi.getComments(post._id).then((r) => r.data.data),
    enabled: showComments,
  });

  const addCommentMutation = useMutation({
    mutationFn: (content) => postApi.addComment(post._id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', post._id] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      setCommentText('');
    },
  });

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    addCommentMutation.mutate(commentText.trim());
  };

  return (
    <GlassCard hover={false} className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 overflow-hidden rounded-full bg-upnext-primary/20">
          {post.author.avatarUrl && <img src={post.author.avatarUrl} className="h-full w-full object-cover" alt="" />}
        </div>
        <div>
          <p className="text-sm font-medium">{post.author.displayName}</p>
          <p className="text-xs text-upnext-muted">{new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {post.caption && <p className="text-sm">{post.caption}</p>}

      {post.media?.length > 0 && (
        <div className={`grid gap-1 overflow-hidden rounded-xl ${post.media.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {post.media.map((m, i) => (
            <img key={i} src={m.url} className="aspect-square w-full object-cover" alt="" />
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 border-t border-upnext-border pt-3 text-sm text-upnext-muted">
        <motion.button whileTap={{ scale: 0.9 }} data-cursor-hover onClick={() => likeMutation.mutate()} className="flex items-center gap-1.5">
          <FiHeart className={post.isLiked ? 'fill-red-500 text-red-500' : ''} /> {post.likesCount}
        </motion.button>
        <button data-cursor-hover onClick={() => setShowComments(!showComments)} className="flex items-center gap-1.5">
          <FiMessageCircle /> {post.commentsCount}
        </button>
      </div>

      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-upnext-border pt-3"
          >
            <div className="mb-3 flex items-center gap-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                placeholder="Write a comment..."
                className="flex-1 rounded-lg border border-upnext-border bg-black/40 px-3 py-2 text-sm outline-none focus:border-upnext-primary"
              />
              <button data-cursor-hover onClick={handleAddComment} className="rounded-lg bg-upnext-primary p-2 text-black">
                <FiSend className="h-4 w-4" />
              </button>
            </div>

            {commentsLoading ? (
              <p className="text-xs text-upnext-muted">Loading comments...</p>
            ) : comments?.length ? (
              <div className="space-y-2">
                {comments.map((c) => (
                  <div key={c._id} className="flex items-start gap-2 text-sm">
                    <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full bg-upnext-primary/20">
                      {c.user.avatarUrl && <img src={c.user.avatarUrl} className="h-full w-full object-cover" alt="" />}
                    </div>
                    <p>
                      <span className="font-medium">{c.user.displayName}</span>{' '}
                      <span className="text-upnext-muted">{c.content}</span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-upnext-muted">No comments yet. Be the first!</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}