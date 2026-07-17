// LoginForm.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import GlowInput from '../ui/GlowInput';
import GlowButton from '../ui/GlowButton';
import useAuthStore from '../../store/authStore';

export default function LoginForm() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login(data.identifier, data.password);
      toast.success('Welcome back to the fame.');
      navigate('/home');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <GlowInput
        placeholder="Email or username"
        error={errors.identifier?.message}
        {...register('identifier', { required: 'Required' })}
      />
      <GlowInput
        type="password"
        placeholder="Password"
        error={errors.password?.message}
        {...register('password', { required: 'Required' })}
      />
      <GlowButton type="submit" isLoading={isLoading} className="w-full">
        Enter
      </GlowButton>
    </form>
  );
}