import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiGlobe } from 'react-icons/fi';
import { useSocket } from '../hooks/useSocket';
import useAuthStore from '../store/authStore';
import GlassCard from '../components/ui/GlassCard';

const MAX_HISTORY = 100;

export default function GlobalChatPage() {
  const socket = useSocket();
  const currentUser = useAuthStore((s) => s.user);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!socket) return undefined;

    const handleNewMessage = (message) => {
      setMessages((prev) => [...prev.slice(-MAX_HISTORY + 1), message]);
    };

    socket.on('global-chat:new-message', handleNewMessage);
    return () => socket.off('global-chat:new-message', handleNewMessage);
  }, [socket]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!draft.trim() || !socket) return;
    socket.emit('global-chat:send', { content: draft.trim() });
    setDraft('');
  };

  return (
    <div className="flex h-[calc(100vh-140px)] flex-col">
      <div className="mb-4 flex items-center gap-2">
        <FiGlobe className="text-upnext-primary" />
        <h1 className="font-display text-xl font-bold">Global Chat</h1>
      </div>

      <GlassCard hover={false} className="flex flex-1 flex-col overflow-hidden p-0">
        <div className="flex-1 space-y-2 overflow-y-auto p-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isOwn = msg.userId === currentUser?._id;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}
                >
                  <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-upnext-primary/20">
                    {msg.avatarUrl && <img src={msg.avatarUrl} className="h-full w-full object-cover" alt="" />}
                  </div>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${isOwn ? 'bg-upnext-primary text-black' : 'bg-upnext-surface-2'}`}>
                    {!isOwn && <p className="mb-0.5 text-xs font-medium text-upnext-primary">{msg.displayName}</p>}
                    {msg.content}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        <div className="flex items-center gap-3 border-t border-upnext-border p-4">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            maxLength={500}
            placeholder="Say something to everyone..."
            className="flex-1 rounded-xl border border-upnext-border bg-black/40 px-4 py-2.5 text-sm outline-none focus:border-upnext-primary"
          />
          <button data-cursor-hover onClick={handleSend} className="rounded-xl bg-upnext-primary p-2.5 text-black">
            <FiSend />
          </button>
        </div>
      </GlassCard>
    </div>
  );
}