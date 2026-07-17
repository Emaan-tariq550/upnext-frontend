import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import GlassCard from '../components/ui/GlassCard';
import GlowInput from '../components/ui/GlowInput';
import GlowButton from '../components/ui/GlowButton';
import { userApi } from '../api/userApi';
import { authApi } from '../api/authApi';
import useAuthStore from '../store/authStore';

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const { register: registerProfile, handleSubmit: handleProfileSubmit } = useForm({
    defaultValues: { displayName: user?.displayName, bio: user?.bio },
  });
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPasswordForm } = useForm();

  const profileMutation = useMutation({
    mutationFn: (payload) => userApi.updateProfile(payload),
    onSuccess: () => toast.success('Profile updated'),
    onError: (err) => toast.error(err.response?.data?.message || 'Update failed'),
  });

  const passwordMutation = useMutation({
    mutationFn: (payload) => authApi.changePassword(payload),
    onSuccess: () => {
      toast.success('Password changed. Please log in again.');
      resetPasswordForm();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Change failed'),
  });

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-display text-2xl font-bold">Settings</h1>

      <GlassCard>
        <h2 className="mb-4 font-semibold">Profile</h2>
        <form onSubmit={handleProfileSubmit((d) => profileMutation.mutate(d))} className="space-y-4">
          <GlowInput placeholder="Display name" {...registerProfile('displayName')} />
          <textarea
            placeholder="Bio"
            rows={3}
            className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-upnext-muted focus:border-upnext-primary"
            {...registerProfile('bio')}
          />
          <GlowButton type="submit" isLoading={profileMutation.isPending}>
            Save Changes
          </GlowButton>
        </form>
      </GlassCard>

      <GlassCard>
        <h2 className="mb-4 font-semibold">Change Password</h2>
        <form onSubmit={handlePasswordSubmit((d) => passwordMutation.mutate(d))} className="space-y-4">
          <GlowInput type="password" placeholder="Current password" {...registerPassword('currentPassword', { required: true })} />
          <GlowInput type="password" placeholder="New password" {...registerPassword('newPassword', { required: true, minLength: 8 })} />
          <GlowButton type="submit" isLoading={passwordMutation.isPending}>
            Update Password
          </GlowButton>
        </form>
      </GlassCard>
    </div>
  );
}