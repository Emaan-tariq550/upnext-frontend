import { useEffect, useRef, useState, useCallback } from 'react';
import { useSocket } from './useSocket';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    {
      urls: 'turn:relay1.expressturn.com:3478',
      username: 'ef3IRIAJVVQXWXSIDT',
      credential: 'RgKGWvGGiZOaVQTF',
    },
  ],
};

export function useWebRTCRoom(roomId, { video = true } = {}) {
  const socket = useSocket();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  const [participants, setParticipants] = useState([]);
  const [mediaError, setMediaError] = useState(null);
  const [isMuted, setIsMuted] = useState(false); // NAYA: mic button ke liye visual state
  const [isVideoOff, setIsVideoOff] = useState(false); // NAYA: camera button ke liye visual state
  const peerConnections = useRef({});

  const createPeerConnection = useCallback(
    (targetSocketId, stream) => {
      const pc = new RTCPeerConnection(ICE_SERVERS);

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('call:ice-candidate', { targetSocketId, candidate: event.candidate });
        }
      };

      pc.ontrack = (event) => {
        console.log('[WebRTC] Remote track received from', targetSocketId);
        setRemoteStreams((prev) => ({ ...prev, [targetSocketId]: event.streams[0] }));
      };

      pc.oniceconnectionstatechange = () => {
        console.log('[WebRTC] ICE state:', pc.iceConnectionState, targetSocketId);
      };

      peerConnections.current[targetSocketId] = pc;
      return pc;
    },
    [socket]
  );

  useEffect(() => {
    if (!socket || !roomId) {
      console.warn('[WebRTC] Waiting — socket or roomId missing', { hasSocket: !!socket, roomId });
      return undefined;
    }

    let stream;
    let cancelled = false;

    async function init() {
      try {
        console.log('[WebRTC] Requesting getUserMedia, video:', video);
        stream = await navigator.mediaDevices.getUserMedia({ audio: true, video });
        console.log('[WebRTC] Got local stream, tracks:', stream.getTracks().map((t) => t.kind));
      } catch (err) {
        console.error('[WebRTC] getUserMedia failed:', err.name, err.message);
        if (!cancelled) setMediaError(err.message);
        return;
      }

      if (cancelled) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      setLocalStream(stream);
      socket.emit('call:join-room', { roomId });

      socket.on('call:existing-participants', (list) => {
        console.log('[WebRTC] Existing participants:', list);
        setParticipants(list);
        list.forEach(async (p) => {
          const pc = createPeerConnection(p.socketId, stream);
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit('call:offer', { targetSocketId: p.socketId, offer });
        });
      });

      socket.on('call:user-joined', (p) => {
        console.log('[WebRTC] User joined:', p);
        setParticipants((prev) => [...prev, p]);
      });

      socket.on('call:offer', async ({ fromSocketId, offer }) => {
        const pc = createPeerConnection(fromSocketId, stream);
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('call:answer', { targetSocketId: fromSocketId, answer });
      });

      socket.on('call:answer', async ({ fromSocketId, answer }) => {
        const pc = peerConnections.current[fromSocketId];
        if (pc) await pc.setRemoteDescription(new RTCSessionDescription(answer));
      });

      socket.on('call:ice-candidate', async ({ fromSocketId, candidate }) => {
        const pc = peerConnections.current[fromSocketId];
        if (pc) await pc.addIceCandidate(new RTCIceCandidate(candidate));
      });

      socket.on('call:user-left', ({ socketId }) => {
        peerConnections.current[socketId]?.close();
        delete peerConnections.current[socketId];
        setRemoteStreams((prev) => {
          const next = { ...prev };
          delete next[socketId];
          return next;
        });
        setParticipants((prev) => prev.filter((p) => p.socketId !== socketId));
      });
    }

    init();

    return () => {
      cancelled = true;
      socket.emit('call:leave-room', { roomId });
      socket.off('call:existing-participants');
      socket.off('call:user-joined');
      socket.off('call:offer');
      socket.off('call:answer');
      socket.off('call:ice-candidate');
      socket.off('call:user-left');
      stream?.getTracks().forEach((track) => track.stop());
      Object.values(peerConnections.current).forEach((pc) => pc.close());
      peerConnections.current = {};
    };
  }, [socket, roomId, video, createPeerConnection]);

  const toggleAudio = useCallback(() => {
    localStream?.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
    setIsMuted((prev) => !prev); // NAYA: UI ke liye mute state track karein
  }, [localStream]);

  const toggleVideo = useCallback(() => {
    localStream?.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
    setIsVideoOff((prev) => !prev); // NAYA: UI ke liye video-off state track karein
  }, [localStream]);

  return {
    localStream,
    remoteStreams,
    participants,
    mediaError,
    toggleAudio,
    toggleVideo,
    isMuted,
    isVideoOff,
  };
}