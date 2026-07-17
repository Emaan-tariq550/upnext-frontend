import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FiMusic } from 'react-icons/fi';
import Modal from '../ui/Modal';
import GlowInput from '../ui/GlowInput';
import GlowButton from '../ui/GlowButton';
import { trackApi } from '../../api/trackApi';

export default function UploadTrackModal({ open, onClose, businessId }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();
  const [audioFile, setAudioFile] = useState(null);

  const uploadMutation = useMutation({
    mutationFn: (formData) => trackApi.upload(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracks', businessId] });
      toast.success('Track published 🎵');
      reset();
      setAudioFile(null);
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Upload failed'),
  });

  const onSubmit = (data) => {
    if (!audioFile) {
      toast.error('Audio file chunein');
      return;
    }
    const formData = new FormData();
    formData.append('businessId', businessId);
    formData.append('title', data.title);
    formData.append('artistName', data.artistName || '');
    formData.append('genre', data.genre || 'Other');
    if (data.coverImageUrl) formData.append('coverImageUrl', data.coverImageUrl);
    formData.append('audio', audioFile);
    uploadMutation.mutate(formData);
  };

  return (
    <Modal open={open} onClose={onClose} title="Upload Track">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <GlowInput placeholder="Track title" {...register('title', { required: true, maxLength: 100 })} />
        <GlowInput placeholder="Artist name (optional)" {...register('artistName')} />
        <GlowInput placeholder="Genre (e.g. Hip-Hop, Lo-fi)" {...register('genre')} />
        <GlowInput placeholder="Cover image URL (optional)" {...register('coverImageUrl')} />

        <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-upnext-border p-4 text-sm text-upnext-muted hover:border-upnext-primary" data-cursor-hover>
          <FiMusic className="h-4 w-4 shrink-0" />
          {audioFile ? audioFile.name : 'Audio file chunein (mp3, wav)'}
          <input type="file" accept="audio/*" hidden onChange={(e) => setAudioFile(e.target.files[0])} />
        </label>

        <GlowButton type="submit" isLoading={uploadMutation.isPending} className="w-full">
          Publish Track
        </GlowButton>
      </form>
    </Modal>
  );
}