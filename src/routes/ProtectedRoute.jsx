import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import LoadingScreen from '../components/ui/LoadingScreen';

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) return <LoadingScreen message="Checking your session..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
}