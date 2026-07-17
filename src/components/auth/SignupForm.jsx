// SignupForm.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import GlowInput from '../ui/GlowInput';
import GlowButton from '../ui/GlowButton';
import useAuthStore from '../../store/authStore';

export default function SignupForm() {
  const navigate = useNavigate();
  const registerUser = useAuthStore((s) => s.register);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await registerUser(data);
      toast.success('Your legend begins. Check your email.');
      navigate('/verify-email', { state: { email: result.email } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <GlowInput placeholder="Username" error={errors.username?.message} {...register('username', { required: 'Required', minLength: 3 })} />
      <GlowInput placeholder="Display name" error={errors.displayName?.message} {...register('displayName', { required: 'Required' })} />
      <GlowInput type="email" placeholder="Email" error={errors.email?.message} {...register('email', { required: 'Required' })} />
      <GlowInput type="password" placeholder="Password" error={errors.password?.message} {...register('password', { required: 'Required', minLength: 8 })} />
      <GlowButton type="submit" isLoading={isLoading} className="w-full">
        Begin
      </GlowButton>
    </form>
  );
}