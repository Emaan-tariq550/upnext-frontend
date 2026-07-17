import { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FiImage, FiX } from 'react-icons/fi';
import { postApi } from '../../api/postApi';
import GlassCard from '../ui/GlassCard';
import GlowButton from '../ui/GlowButton';

export default function PostComposer() {
  const [caption, setCaption] = useState('');
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const inputRef = useRef(null);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (formData) => postApi.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      toast.success('Posted!');
      setCaption('');
      setFiles([]);
      setPreviews([]);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to post'),
  });

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files).slice(0, 6);
    setFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = () => {
    if (files.length === 0) return toast.error('Add at least one photo');

    const formData = new FormData();
    formData.append('caption', caption);
    files.forEach((f) => formData.append('media', f));
    createMutation.mutate(formData);
  };

  return (
    <GlassCard>
      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Share a moment..."
        rows={2}
        maxLength={500}
        className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-upnext-muted"
      />

      {previews.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {previews.map((src, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-lg">
              <img src={src} className="h-full w-full object-cover" alt="" />
              <button
                onClick={() => {
                  setFiles((prev) => prev.filter((_, idx) => idx !== i));
                  setPreviews((prev) => prev.filter((_, idx) => idx !== i));
                }}
                className="absolute right-1 top-1 rounded-full bg-black/70 p-1"
              >
                <FiX className="h-3 w-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <button data-cursor-hover onClick={() => inputRef.current?.click()} className="flex items-center gap-2 text-sm text-upnext-primary">
          <FiImage /> Add photos
        </button>
        <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={handleFileSelect} />
        <GlowButton onClick={handleSubmit} isLoading={createMutation.isPending}>
          Post
        </GlowButton>
      </div>
    </GlassCard>
  );
}