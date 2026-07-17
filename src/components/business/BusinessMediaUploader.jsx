import { useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FiCamera } from 'react-icons/fi';
import axiosClient from '../../api/axiosClient';

export default function BusinessMediaUploader({ businessId, type, currentUrl, shape = 'square' }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: (formData) => axiosClient.post(`/uploads/business/${businessId}/${type}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', businessId] });
      toast.success(`${type === 'logo' ? 'Logo' : 'Cover'} updated`);
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
    formData.append(type, file);
    uploadMutation.mutate(formData);
  };

  const isCover = type === 'cover';

  return (
    <div className={`group relative overflow-hidden bg-upnext-surface-2 ${isCover ? 'h-40 w-full rounded-2xl sm:h-56' : 'h-20 w-20 rounded-xl'}`}>
      {(preview || currentUrl) && <img src={preview || currentUrl} className="h-full w-full object-cover" alt="" />}
      <button
        data-cursor-hover
        onClick={() => inputRef.current?.click()}
        disabled={uploadMutation.isPending}
        className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-lg bg-black/60 px-2 py-1.5 text-xs text-white opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100"
      >
        <FiCamera className="h-3.5 w-3.5" />
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
    </div>
  );
}