import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthCard from '../../components/ui/AuthCard';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import useAuthStore from '../../store/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      await login(formData.identifier, formData.password);
      toast.success('Welcome back!');
      navigate('/home');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard title="Welcome back" subtitle="Log in to continue your rise to fame">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email or Username"
          placeholder="you@example.com"
          error={errors.identifier?.message}
          {...register('identifier', { required: 'This field is required' })}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password', { required: 'Password is required' })}
        />

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm text-upnext-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" isLoading={isLoading} className="w-full">
          Log In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-upnext-muted">
        Don't have an account?{' '}
        <Link to="/register" className="text-upnext-primary hover:underline">
          Sign up
        </Link>
      </p>
    </AuthCard>
  );
}