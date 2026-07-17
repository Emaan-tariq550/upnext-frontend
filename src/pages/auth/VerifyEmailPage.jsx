import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthCard from '../../components/ui/AuthCard';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import useAuthStore from '../../store/authStore';
import { authApi } from '../../api/authApi';

export default function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const verifyEmail = useAuthStore((s) => s.verifyEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: location.state?.email || '' } });

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      await verifyEmail(formData);
      toast.success('Email verified! You can now log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async (email) => {
    if (!email) return toast.error('Enter your email first');
    setIsResending(true);
    try {
      await authApi.resendOtp({ email, purpose: 'email_verification' });
      toast.success('New code sent');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not resend code');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthCard title="Verify your email" subtitle="Enter the 6-digit code we sent you">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register('email', { required: 'Email is required' })}
        />
        <Input
          label="Verification Code"
          placeholder="123456"
          maxLength={6}
          error={errors.code?.message}
          {...register('code', { required: 'Code is required', minLength: 6, maxLength: 6 })}
        />

        <Button type="submit" isLoading={isLoading} className="w-full">
          Verify Email
        </Button>
      </form>

      <button
        type="button"
        disabled={isResending}
        onClick={handleSubmit((data) => handleResend(data.email))}
        className="mt-4 w-full text-center text-sm text-upnext-primary hover:underline disabled:opacity-50"
      >
        {isResending ? 'Sending...' : "Didn't get a code? Resend"}
      </button>
    </AuthCard>
  );
}