import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useEffect, Suspense, lazy } from 'react';

import useAuthStore from './store/authStore';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicOnlyRoute from './routes/PublicOnlyRoute';
import ErrorBoundary from './components/ui/ErrorBoundary';
import SmoothScrollProvider from './components/experience/SmoothScrollProvider';
import CustomCursor from './components/experience/CustomCursor';
import CommandPalette from './components/search/CommandPalette';
import InstallPrompt from './components/pwa/InstallPrompt';
import AppLayout from './layouts/AppLayout';
import LoadingScreen from './components/ui/LoadingScreen';
import { SocketProvider } from './context/SocketContext';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const LampAuthExperience = lazy(() => import('./pages/auth/LampAuthExperience'));
const VerifyEmailPage = lazy(() => import('./pages/auth/VerifyEmailPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const HomePage = lazy(() => import('./pages/HomePage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const FriendsPage = lazy(() => import('./pages/FriendsPage'));
const BusinessesPage = lazy(() => import('./pages/BusinessesPage'));
const BusinessDetailPage = lazy(() => import('./pages/BusinessDetailPage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const EventDetailPage = lazy(() => import('./pages/EventDetailPage'));
const MessagesPage = lazy(() => import('./pages/MessagesPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'));
const LeaderboardsPage = lazy(() => import('./pages/LeaderboardsPage'));
const TrendingPage = lazy(() => import('./pages/TrendingPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const GlobalChatPage = lazy(() => import('./pages/GlobalChatPage'));
const CallRoomPage = lazy(() => import('./pages/CallRoomPage'));

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30000, refetchOnWindowFocus: false } },
});

export default function App() {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SmoothScrollProvider>
          <SocketProvider>
            <BrowserRouter>
              <CustomCursor />
              <CommandPalette />
              <InstallPrompt />
              <Toaster position="top-center" toastOptions={{ style: { background: '#14141c', color: '#f4f4f5' } }} />
              <Suspense fallback={<LoadingScreen message="Loading UPNEXT..." />}>
                <Routes>
                  <Route path="/" element={<LandingPage />} />

                  <Route element={<PublicOnlyRoute />}>
                    <Route path="/enter" element={<LampAuthExperience />} />
                  </Route>

                  <Route path="/verify-email" element={<VerifyEmailPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />

                  <Route element={<ProtectedRoute />}>
                    <Route element={<AppLayout />}>
                      <Route path="/home" element={<HomePage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/profile/:userId" element={<ProfilePage />} />
                      <Route path="/friends" element={<FriendsPage />} />
                      <Route path="/businesses" element={<BusinessesPage />} />
                      <Route path="/businesses/:businessId" element={<BusinessDetailPage />} />
                      <Route path="/events" element={<EventsPage />} />
                      <Route path="/events/:eventId" element={<EventDetailPage />} />
                      <Route path="/messages" element={<MessagesPage />} />
                      <Route path="/global-chat" element={<GlobalChatPage />} />
                      <Route path="/call/:roomId" element={<CallRoomPage />} />
                      <Route path="/notifications" element={<NotificationsPage />} />
                      <Route path="/achievements" element={<AchievementsPage />} />
                      <Route path="/leaderboards" element={<LeaderboardsPage />} />
                      <Route path="/trending" element={<TrendingPage />} />
                      <Route path="/history" element={<HistoryPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route path="/search" element={<SearchPage />} />
                    </Route>
                  </Route>

                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </SocketProvider>
        </SmoothScrollProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}