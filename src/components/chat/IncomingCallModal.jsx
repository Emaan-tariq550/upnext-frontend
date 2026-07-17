import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiPhone, FiPhoneOff, FiVideo } from 'react-icons/fi';
import useCallStore from '../../store/callStore';
import { useSocket } from '../../hooks/useSocket';

export default function IncomingCallModal() {
  const incomingCall = useCallStore((s) => s.incomingCall);
  const clearIncomingCall = useCallStore((s) => s.clearIncomingCall);
  const socket = useSocket();
  const navigate = useNavigate();

  if (!incomingCall) return null;

  const handleAccept = () => {
    navigate(`/call/${incomingCall.conversationId}?video=${incomingCall.callType === 'video'}`);
    clearIncomingCall();
  };

  const handleDecline = () => {
    socket?.emit('call:decline', { targetUserId: incomingCall.callerId, conversationId: incomingCall.conversationId });
    clearIncomingCall();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -60 }}
        className="fixed left-1/2 top-6 z-[300] -translate-x-1/2"
      >
        <div className="flex items-center gap-4 rounded-2xl border border-upnext-primary/40 bg-upnext-surface/95 px-6 py-4 shadow-2xl backdrop-blur-xl">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="h-12 w-12 overflow-hidden rounded-full bg-upnext-primary/20"
          >
            {incomingCall.callerAvatar && <img src={incomingCall.callerAvatar} className="h-full w-full object-cover" alt="" />}
          </motion.div>
          <div>
            <p className="text-sm font-semibold">{incomingCall.callerName}</p>
            <p className="text-xs text-upnext-muted">Incoming {incomingCall.callType} call...</p>
          </div>
          <div className="flex gap-2">
            <button
              data-cursor-hover
              onClick={handleAccept}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600"
            >
              {incomingCall.callType === 'video' ? <FiVideo /> : <FiPhone />}
            </button>
            <button
              data-cursor-hover
              onClick={handleDecline}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
            >
              <FiPhoneOff />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}