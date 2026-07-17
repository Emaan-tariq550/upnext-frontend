import { Component } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiX, FiAlertTriangle } from 'react-icons/fi';

class ModalContentBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <FiAlertTriangle className="h-8 w-8 text-red-400" />
          <p className="text-sm text-red-400">Something broke in this form:</p>
          <p className="text-xs text-upnext-muted">{this.state.errorMessage}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function Modal({ open, onClose, title, children }) {
  const modalContent = (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-upnext-border bg-upnext-surface p-5 shadow-2xl sm:rounded-2xl sm:p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 id="modal-title" className="font-display text-xl font-bold">
                {title}
              </h2>
              <button data-cursor-hover onClick={onClose} className="rounded-lg p-1.5 hover:bg-white/10">
                <FiX />
              </button>
            </div>
            <ModalContentBoundary>{children}</ModalContentBoundary>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // NAYA: Portal se document.body mein render karo, taake SmoothScrollProvider
  // ke transform wrapper se bahar niklkar backdrop poori screen cover kare
  return createPortal(modalContent, document.body);
}