import { useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FiCamera } from 'react-icons/fi';
import { userApi } from '../../api/userApi';
import useAuthStore from '../../store/authStore';

export default function AvatarUploader() {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const user = useAuthStore((s) => s.user);
  const fetchCurrentUser = useAuthStore((s) => s.fetchCurrentUser);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: (formData) => userApi.uploadAvatar(formData),
    onSuccess: async () => {
      await fetchCurrentUser();
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Avatar updated');
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
    formData.append('avatar', file);
    uploadMutation.mutate(formData);
  };

  return (
    <div className="relative h-24 w-24">
      <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-upnext-primary/40 bg-upnext-primary/20">
        {(preview || user?.avatarUrl) && (
          <img src={preview || user.avatarUrl} className="h-full w-full object-cover" alt="" />
        )}
      </div>

      <button
        data-cursor-hover
        onClick={() => inputRef.current?.click()}
        disabled={uploadMutation.isPending}
        className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-upnext-primary text-black shadow-lg hover:bg-upnext-primary-dark disabled:opacity-60"
      >
        <FiCamera className="h-4 w-4" />
      </button>

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
    </div>
  );
}