import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FiImage, FiX, FiHeart } from 'react-icons/fi';
import { postApi } from '../../api/postApi';
import GlassCard from '../ui/GlassCard';
import GlowButton from '../ui/GlowButton';

export default function BusinessPostsSection({ businessId, canPost }) {
  const queryClient = useQueryClient();
  const [caption, setCaption] = useState('');
  const [files, setFiles] = useState([]);

  const { data: posts, isLoading } = useQuery({
    queryKey: ['businessPosts', businessId],
    queryFn: () => postApi.getBusinessPosts(businessId).then((r) => r.data.data),
  });

  const createMutation = useMutation({
    mutationFn: (formData) => postApi.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessPosts', businessId] });
      toast.success('Post published');
      setCaption('');
      setFiles([]);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Post failed'),
  });

  const likeMutation = useMutation({
    mutationFn: (postId) => postApi.toggleLike(postId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['businessPosts', businessId] }),
  });

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files).slice(0, 6);
    setFiles(selected);
  };

  const handleSubmit = () => {
    if (files.length === 0) {
      toast.error('Kam se kam ek media file chuniye');
      return;
    }
    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('businessId', businessId);
    files.forEach((f) => formData.append('media', f));
    createMutation.mutate(formData);
  };

  return (
    <GlassCard>
      <h2 className="mb-4 font-semibold">Posts</h2>

      {canPost && (
        <div className="mb-6 space-y-3 rounded-xl border border-upnext-border p-4">
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Business ki taraf se kuch share karein..."
            rows={2}
            className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-upnext-muted focus:border-upnext-primary"
          />

          {files.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-1 rounded-lg bg-white/5 px-2 py-1 text-xs">
                  {f.name}
                  <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))}>
                    <FiX className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-upnext-primary" data-cursor-hover>
              <FiImage /> Media chunein
              <input type="file" accept="image/*,video/*" multiple hidden onChange={handleFileChange} />
            </label>
            <GlowButton onClick={handleSubmit} isLoading={createMutation.isPending}>
              Post
            </GlowButton>
          </div>
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-upnext-muted">Loading posts...</p>
      ) : posts?.length === 0 ? (
        <p className="text-sm text-upnext-muted">Abhi tak koi post nahi hai.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {posts?.map((post) => (
            <div key={post._id} className="group relative aspect-square overflow-hidden rounded-xl bg-black/40">
              {post.media?.[0]?.type === 'video' ? (
                <video src={post.media[0].url} className="h-full w-full object-cover" muted />
              ) : (
                <img src={post.media?.[0]?.url} className="h-full w-full object-cover" alt="" />
              )}
              <div className="absolute inset-0 flex items-end justify-between bg-black/40 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => likeMutation.mutate(post._id)}
                  className="flex items-center gap-1 text-xs text-white"
                  data-cursor-hover
                >
                  <FiHeart className={post.isLiked ? 'fill-red-500 text-red-500' : ''} /> {post.likesCount}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}