import { useNavigate } from 'react-router-dom';
import { FiPhone, FiVideo } from 'react-icons/fi';
import { useSocket } from '../../hooks/useSocket';
import useAuthStore from '../../store/authStore';

export default function ChatCallButtons({ conversationId, otherUserId }) {
  const navigate = useNavigate();
  const socket = useSocket();
  const currentUser = useAuthStore((s) => s.user);

  const startCall = (callType) => {
    if (!socket || !otherUserId) return;

    socket.emit('call:ring', {
      conversationId,
      targetUserId: otherUserId,
      callType,
      callerName: currentUser?.displayName,
    });

    navigate(`/call/${conversationId}?video=${callType === 'video'}`);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        data-cursor-hover
        onClick={() => startCall('voice')}
        className="rounded-lg p-2 text-upnext-muted hover:bg-white/10 hover:text-upnext-text"
        title="Voice call"
      >
        <FiPhone className="h-4 w-4" />
      </button>
      <button
        data-cursor-hover
        onClick={() => startCall('video')}
        className="rounded-lg p-2 text-upnext-muted hover:bg-white/10 hover:text-upnext-text"
        title="Video call"
      >
        <FiVideo className="h-4 w-4" />
      </button>
    </div>
  );
}