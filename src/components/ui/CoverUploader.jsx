import { useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FiCamera } from 'react-icons/fi';
import { userApi } from '../../api/userApi';
import useAuthStore from '../../store/authStore';

export default function CoverUploader() {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const user = useAuthStore((s) => s.user);
  const fetchCurrentUser = useAuthStore((s) => s.fetchCurrentUser);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: (formData) => userApi.uploadCover(formData),
    onSuccess: async () => {
      await fetchCurrentUser();
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Cover updated');
      setPreview(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Upload failed');
      setPreview(null);
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append('cover', file);
    uploadMutation.mutate(formData);
  };

  return (
    <div className="group relative h-40 w-full overflow-hidden rounded-2xl bg-upnext-surface-2 sm:h-56">
      {(preview || user?.coverUrl) && (
        <img src={preview || user.coverUrl} className="h-full w-full object-cover" alt="" />
      )}
      <button
        data-cursor-hover
        onClick={() => inputRef.current?.click()}
        disabled={uploadMutation.isPending}
        className="absolute bottom-3 right-3 flex items-center gap-2 rounded-xl bg-black/60 px-3 py-2 text-xs font-medium text-white opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100"
      >
        <FiCamera className="h-4 w-4" /> Change Cover
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
    </div>
  );
}