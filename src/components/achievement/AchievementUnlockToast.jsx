import { AnimatePresence, motion } from 'framer-motion';
import { FiAward } from 'react-icons/fi';
import useCelebrationStore from '../../store/celebrationStore';
import CelebrationOverlay from '../experience/CelebrationOverlay';

export default function AchievementUnlockToast() {
  const activeCelebration = useCelebrationStore((s) => s.activeCelebration);
  const isAchievement = activeCelebration?.type === 'achievement';

  return (
    <>
      <CelebrationOverlay trigger={isAchievement} />
      <AnimatePresence>
        {isAchievement && (
          <motion.div
            key={activeCelebration.id}
            initial={{ opacity: 0, y: -60, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="fixed left-1/2 top-8 z-[201] -translate-x-1/2"
          >
            <div className="flex items-center gap-4 rounded-2xl border border-upnext-gold/40 bg-upnext-surface/90 px-6 py-4 shadow-2xl backdrop-blur-xl">
              <motion.div
                animate={{ rotate: [0, -15, 15, -15, 0] }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-upnext-gold/20"
              >
                <FiAward className="h-6 w-6 text-upnext-gold" />
              </motion.div>
              <div>
                <p className="text-xs text-upnext-muted">Achievement Unlocked</p>
                <p className="font-display font-bold text-upnext-gold">{activeCelebration.title}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}