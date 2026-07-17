import { useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiPhoneOff } from 'react-icons/fi';
import { useWebRTCRoom } from '../hooks/useWebRTCRoom';

function VideoTile({ stream, label, muted = false }) {
  const ref = useRef(null);

  useEffect(() => {
    const videoEl = ref.current;
    if (!videoEl || !stream) return undefined;

    videoEl.srcObject = stream;

    const playPromise = videoEl.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('[WebRTC] Video play() failed:', err.name, err.message);
        }
      });
    }

    return () => {
      videoEl.srcObject = null;
    };
  }, [stream]);

  return (
    <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-neutral-900">
      {stream ? (
        <video
          ref={ref}
          autoPlay
          playsInline
          muted={muted}
          className="h-full w-full object-cover"
        />
      ) : (
        <p className="text-xs text-upnext-muted">Waiting for video...</p>
      )}
      <span className="absolute bottom-2 left-2 rounded-lg bg-black/60 px-2 py-1 text-xs text-white">{label}</span>
    </div>
  );
}

export default function CallRoomPage() {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isVideoCall = searchParams.get('video') !== 'false';

  const {
    localStream,
    remoteStreams,
    participants,
    mediaError,
    toggleAudio,
    toggleVideo,
    isMuted,
    isVideoOff,
  } = useWebRTCRoom(roomId, { video: isVideoCall });

  if (mediaError) {
    return (
      <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-semibold text-red-400">Camera/Microphone access denied</p>
        <p className="max-w-sm text-sm text-upnext-muted">
          Click the lock icon in your browser's address bar, allow Camera and Microphone, then reload this page.
        </p>
        <button onClick={() => navigate(-1)} className="rounded-xl bg-upnext-primary px-5 py-2.5 font-medium text-black">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-100px)] flex-col gap-4 p-2">
      <div className="grid flex-1 grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3">
        {localStream && <VideoTile stream={localStream} label="You" muted />}
        {participants.map((p) => (
          <VideoTile key={p.socketId} stream={remoteStreams[p.socketId]} label={p.displayName || 'Participant'} />
        ))}
      </div>

      <div className="flex items-center justify-center gap-3 pb-2 sm:gap-4">
        <button
          data-cursor-hover
          onClick={toggleAudio}
          className={`rounded-full p-3 sm:p-4 ${
            isMuted ? 'bg-red-500 text-white' : 'bg-upnext-surface-2 hover:bg-white/10'
          }`}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <FiMicOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <FiMic className="h-4 w-4 sm:h-5 sm:w-5" />}
        </button>

        {isVideoCall && (
          <button
            data-cursor-hover
            onClick={toggleVideo}
            className={`rounded-full p-3 sm:p-4 ${
              isVideoOff ? 'bg-red-500 text-white' : 'bg-upnext-surface-2 hover:bg-white/10'
            }`}
            title={isVideoOff ? 'Turn camera on' : 'Turn camera off'}
          >
            {isVideoOff ? <FiVideoOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <FiVideo className="h-4 w-4 sm:h-5 sm:w-5" />}
          </button>
        )}

        <button
          data-cursor-hover
          onClick={() => navigate(-1)}
          className="rounded-full bg-red-500 p-3 text-white hover:bg-red-600 sm:p-4"
        >
          <FiPhoneOff className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>
    </div>
  );
}