import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthCard from '../../components/ui/AuthCard';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import useAuthStore from '../../store/authStore';

export default function RegisterPage() {
  const navigate = useNavigate();
  const registerUser = useAuthStore((s) => s.register);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const result = await registerUser(formData);
      toast.success('Registered! Check your email for the verification code.');
      navigate('/verify-email', { state: { email: result.email } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard title="Create your account" subtitle="Start building your legacy">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Username"
          placeholder="yourname"
          error={errors.username?.message}
          {...register('username', {
            required: 'Username is required',
            minLength: { value: 3, message: 'At least 3 characters' },
            pattern: { value: /^[a-z0-9_]+$/i, message: 'Only letters, numbers, underscores' },
          })}
        />
        <Input
          label="Display Name"
          placeholder="Your Name"
          error={errors.displayName?.message}
          {...register('displayName', { required: 'Display name is required' })}
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email', { required: 'Email is required' })}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'At least 8 characters' },
          })}
        />

        <Button type="submit" isLoading={isLoading} className="w-full">
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-upnext-muted">
        Already have an account?{' '}
        <Link to="/login" className="text-upnext-primary hover:underline">
          Log in
        </Link>
      </p>
    </AuthCard>
  );
}