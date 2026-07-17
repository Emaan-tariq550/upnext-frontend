// ForgotPasswordPage.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthCard from '../../components/ui/AuthCard';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { authApi } from '../../api/authApi';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      await authApi.forgotPassword(formData);
      toast.success('If an account exists, a reset code has been sent');
      navigate('/reset-password', { state: { email: formData.email } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard title="Forgot password" subtitle="We'll send you a reset code">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register('email', { required: 'Email is required' })}
        />
        <Button type="submit" isLoading={isLoading} className="w-full">
          Send Reset Code
        </Button>
      </form>
    </AuthCard>
  );
}