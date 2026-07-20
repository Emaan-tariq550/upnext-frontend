import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import AchievementUnlockToast from '../components/achievement/AchievementUnlockToast';
import ConnectionBanner from '../components/ui/ConnectionBanner';
import AmbientWeather from '../components/experience/AmbientWeather';
import IncomingCallModal from '../components/chat/IncomingCallModal';
import { useSocketEvents } from '../hooks/useSocketEvents';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import useAmbientStore from '../store/ambientStore';

export default function AppLayout() {
  useSocketEvents();
  useKeyboardShortcuts();
  const weather = useAmbientStore((s) => s.weather);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-upnext-bg">
      <AmbientWeather type={weather} />
      <AchievementUnlockToast />
      <ConnectionBanner />
      <IncomingCallModal />

      <div className="app-sidebar-desktop hidden md:block">
        <Sidebar />
      </div>

      <div className="relative z-10 w-full">
        <Topbar />
        <main className="mx-3 mt-6 w-auto pb-24 sm:mx-4 md:ml-72 md:pb-10">
          <Outlet />
        </main>
      </div>

      <div className="app-mobile-bottom-nav">
        <MobileBottomNav />
      </div>
    </div>
  );
}