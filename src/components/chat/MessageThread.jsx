import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { FiSend, FiWifiOff, FiPaperclip, FiMic, FiSquare } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { chatApi } from '../../api/chatApi';
import { useSocket } from '../../hooks/useSocket';
import useAuthStore from '../../store/authStore';
import ChatCallButtons from './ChatCallButtons';
import EmojiPicker from './EmojiPicker';
import MessageBubble from './MessageBubble';

function getSupportedAudioMimeType() {
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) || '';
}

export default function MessageThread({ conversation }) {
  const socket = useSocket();
  const currentUser = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const otherParticipant = conversation.participants?.find((p) => p._id !== currentUser?._id);

  const { data: messages } = useQuery({
    queryKey: ['messages', conversation._id],
    queryFn: () => chatApi.getMessages(conversation._id).then((r) => r.data.data),
  });

  useEffect(() => {
    if (!socket) return undefined;

    socket.emit('chat:join-conversation', { conversationId: conversation._id });

    const handleNewMessage = (message) => {
      if (message.conversation !== conversation._id) return;
      queryClient.setQueryData(['messages', conversation._id], (old = []) => [...old, message]);

      if (message.sender._id !== currentUser?._id) {
        socket.emit('chat:mark-read', { conversationId: conversation._id, messageId: message._id });
      }
    };

    const handleTyping = ({ conversationId, userId, isTyping }) => {
      if (conversationId !== conversation._id || userId === currentUser?._id) return;
      setTypingUsers((prev) => (isTyping ? [...new Set([...prev, userId])] : prev.filter((id) => id !== userId)));
    };

    const handleRead = ({ messageId, userId }) => {
      queryClient.setQueryData(['messages', conversation._id], (old = []) =>
        old.map((m) => (m._id === messageId ? { ...m, readBy: [...new Set([...(m.readBy || []), userId])] } : m))
      );
    };

    socket.on('chat:new-message', handleNewMessage);
    socket.on('chat:typing', handleTyping);
    socket.on('chat:read', handleRead);

    return () => {
      socket.emit('chat:leave-conversation', { conversationId: conversation._id });
      socket.off('chat:new-message', handleNewMessage);
      socket.off('chat:typing', handleTyping);
      socket.off('chat:read', handleRead);
    };
  }, [socket, conversation._id, queryClient, currentUser?._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTypingChange = (value) => {
    setDraft(value);
    if (!socket) return;

    socket.emit('chat:typing', { conversationId: conversation._id, isTyping: true });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('chat:typing', { conversationId: conversation._id, isTyping: false });
    }, 1500);
  };

  const handleSend = () => {
    if (!draft.trim() || !socket) return;

    socket.emit('chat:send-message', { conversationId: conversation._id, content: draft.trim() }, (response) => {
      if (!response?.success) toast.error(response?.message || 'Failed to send');
    });

    setDraft('');
    socket.emit('chat:typing', { conversationId: conversation._id, isTyping: false });
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files).slice(0, 6);
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((f) => formData.append('media', f));

    try {
      await chatApi.sendMedia(conversation._id, formData);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send media');
    }
    e.target.value = '';
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getSupportedAudioMimeType();

      if (!mimeType) {
        toast.error('Voice recording is not supported in this browser');
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      const recorder = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());

        if (audioChunksRef.current.length === 0) {
          toast.error('Recording was empty, please try again');
          return;
        }

        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        const extension = mimeType.includes('webm') ? 'webm' : mimeType.includes('mp4') ? 'm4a' : 'ogg';
        const formData = new FormData();
        formData.append('media', blob, `voice-${Date.now()}.${extension}`);

        try {
          await chatApi.sendMedia(conversation._id, formData);
        } catch (err) {
          toast.error(err.response?.data?.message || 'Failed to send voice message');
        }
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      toast.error('Microphone access denied');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-upnext-border p-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 overflow-hidden rounded-full bg-upnext-primary/20">
            {otherParticipant?.avatarUrl && (
              <img src={otherParticipant.avatarUrl} className="h-full w-full object-cover" alt="" />
            )}
          </div>
          <p className="text-sm font-medium">{otherParticipant?.displayName || 'Chat'}</p>
        </div>
        <ChatCallButtons conversationId={conversation._id} otherUserId={otherParticipant?._id} />
      </div>

      {!socket && (
        <div className="flex shrink-0 items-center gap-2 bg-red-500/10 px-4 py-2 text-xs text-red-400">
          <FiWifiOff /> Not connected — messages won't send in real time
        </div>
      )}

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
        <AnimatePresence initial={false}>
          {messages?.map((msg) => (
            <MessageBubble
              key={msg._id}
              msg={msg}
              isOwn={msg.sender._id === currentUser?._id}
              conversationId={conversation._id}
            />
          ))}
        </AnimatePresence>

        {typingUsers.length > 0 && (
          <div className="flex gap-1 px-4">
            <span className="h-2 w-2 animate-bounce rounded-full bg-upnext-muted [animation-delay:-0.3s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-upnext-muted [animation-delay:-0.15s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-upnext-muted" />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="flex shrink-0 items-center gap-2 border-t border-upnext-border p-4">
        <button
          data-cursor-hover
          onClick={() => fileInputRef.current?.click()}
          className="rounded-lg p-2 text-upnext-muted hover:bg-white/10 hover:text-upnext-text"
        >
          <FiPaperclip className="h-5 w-5" />
        </button>
        <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple hidden onChange={handleFileSelect} />

        <input
          value={draft}
          onChange={(e) => handleTypingChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 rounded-xl border border-upnext-border bg-black/40 px-4 py-2.5 text-sm outline-none focus:border-upnext-primary"
        />

        <EmojiPicker onSelect={(emoji) => setDraft((prev) => prev + emoji)} />

        <button
          data-cursor-hover
          onClick={isRecording ? stopRecording : startRecording}
          className={`rounded-lg p-2 ${
            isRecording ? 'animate-pulse bg-red-500 text-white' : 'text-upnext-muted hover:bg-white/10 hover:text-upnext-text'
          }`}
        >
          {isRecording ? <FiSquare className="h-5 w-5" /> : <FiMic className="h-5 w-5" />}
        </button>

        <button
          data-cursor-hover
          onClick={handleSend}
          disabled={!socket}
          className="rounded-xl bg-upnext-primary p-2.5 text-black hover:bg-upnext-primary-dark disabled:opacity-40"
        >
          <FiSend />
        </button>
      </div>
    </div>
  );
}