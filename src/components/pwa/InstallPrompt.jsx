import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiDownload, FiX } from 'react-icons/fi';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          className="fixed bottom-4 left-1/2 z-[150] w-full max-w-sm -translate-x-1/2 px-4"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-upnext-border bg-upnext-surface/95 p-4 shadow-2xl backdrop-blur-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-upnext-primary/20">
              <FiDownload className="text-upnext-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Install UPNEXT</p>
              <p className="text-xs text-upnext-muted">Get the full app experience</p>
            </div>
            <button data-cursor-hover onClick={handleInstall} className="rounded-lg bg-upnext-primary px-3 py-1.5 text-xs font-semibold text-black">
              Install
            </button>
            <button data-cursor-hover onClick={() => setVisible(false)} className="p-1 text-upnext-muted">
              <FiX />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}