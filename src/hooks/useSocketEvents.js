import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useSocket } from './useSocket';
import useAuthStore from '../store/authStore';
import useNotificationStore from '../store/notificationStore';
import useCelebrationStore from '../store/celebrationStore';
import useCallStore from '../store/callStore';

export function useSocketEvents() {
  const socket = useSocket();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const celebrate = useCelebrationStore((s) => s.celebrate);
  const setIncomingCall = useCallStore((s) => s.setIncomingCall);
  const clearIncomingCall = useCallStore((s) => s.clearIncomingCall);

  useEffect(() => {
    if (!socket) return undefined;

    const handleNewNotification = (notification) => {
      addNotification(notification);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });

      if (notification.type === 'achievement') {
        celebrate({ type: 'achievement', title: notification.body });
        queryClient.invalidateQueries({ queryKey: ['achievements'] });
      } else {
        toast(notification.title, { icon: '🔔' });
      }
    };

    const handlePresenceUpdate = ({ userId, isOnline }) => {
      queryClient.setQueriesData({ queryKey: ['friends'] }, (old) => {
        if (!old) return old;
        return { ...old, data: old.data?.map((f) => (f._id === userId ? { ...f, isOnline } : f)) };
      });
    };

    const handleChatNotification = ({ senderName, preview }) => {
      toast(`${senderName}: ${preview}`, { icon: '💬' });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    };

    const handleIncomingCall = (callData) => {
      setIncomingCall(callData);
    };

    const handleCallDeclined = () => {
      toast('Call declined', { icon: '📞' });
    };

    socket.on('notification:new', handleNewNotification);
    socket.on('presence:update', handlePresenceUpdate);
    socket.on('chat:message-notification', handleChatNotification);
    socket.on('call:incoming', handleIncomingCall);
    socket.on('call:declined', handleCallDeclined);

    return () => {
      socket.off('notification:new', handleNewNotification);
      socket.off('presence:update', handlePresenceUpdate);
      socket.off('chat:message-notification', handleChatNotification);
      socket.off('call:incoming', handleIncomingCall);
      socket.off('call:declined', handleCallDeclined);
    };
  }, [socket, queryClient, addNotification, setUser, celebrate, setIncomingCall, clearIncomingCall]);

  return socket;
}