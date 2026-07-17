// ResetPasswordPage.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthCard from '../../components/ui/AuthCard';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { authApi } from '../../api/authApi';

export default function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: location.state?.email || '' },
  });

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      await authApi.resetPassword(formData);
      toast.success('Password reset. Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard title="Reset password" subtitle="Enter the code and your new password">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Email" type="email" error={errors.email?.message} {...register('email', { required: true })} />
        <Input label="Reset Code" maxLength={6} error={errors.code?.message} {...register('code', { required: true })} />
        <Input
          label="New Password"
          type="password"
          error={errors.newPassword?.message}
          {...register('newPassword', { required: true, minLength: 8 })}
        />
        <Button type="submit" isLoading={isLoading} className="w-full">
          Reset Password
        </Button>
      </form>
    </AuthCard>
  );
}