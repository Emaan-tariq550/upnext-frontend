import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FiCheck, FiMoreVertical, FiTrash2 } from 'react-icons/fi';
import { chatApi } from '../../api/chatApi';

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function MessageBubble({ msg, isOwn, conversationId }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const queryClient = useQueryClient();

  const isReadByOther = isOwn && msg.readBy?.some((id) => id !== msg.sender._id);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const deleteMutation = useMutation({
    mutationFn: (forEveryone) => chatApi.deleteMessage(msg._id, forEveryone),
    onSuccess: (_, forEveryone) => {
      queryClient.setQueryData(['messages', conversationId], (old = []) => {
        if (forEveryone) {
          return old.map((m) => (m._id === msg._id ? { ...m, isDeleted: true, content: '', attachments: [] } : m));
        }
        return old.filter((m) => m._id !== msg._id);
      });
      toast.success('Message deleted');
      setMenuOpen(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete'),
  });

  if (msg.isDeleted) {
    return (
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
        <div className="max-w-[70%] rounded-2xl bg-upnext-surface-2 px-4 py-2.5 text-sm italic text-upnext-muted">
          Message deleted
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group flex items-start gap-1 ${isOwn ? 'justify-end' : 'justify-start'}`}
    >
      {isOwn && (
        <div className="relative mt-2 opacity-0 transition-opacity group-hover:opacity-100" ref={menuRef}>
          <button
            data-cursor-hover
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-1 text-upnext-muted hover:bg-white/10"
          >
            <FiMoreVertical className="h-3.5 w-3.5" />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 top-full z-10 mt-1 w-44 rounded-xl border border-upnext-border bg-upnext-surface p-1.5 shadow-xl"
              >
                <button
                  data-cursor-hover
                  onClick={() => deleteMutation.mutate(false)}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs hover:bg-white/5"
                >
                  <FiTrash2 className="h-3.5 w-3.5" /> Delete for me
                </button>
                <button
                  data-cursor-hover
                  onClick={() => deleteMutation.mutate(true)}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-red-400 hover:bg-red-500/10"
                >
                  <FiTrash2 className="h-3.5 w-3.5" /> Delete for everyone
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${isOwn ? 'bg-upnext-primary text-black' : 'bg-upnext-surface-2 text-upnext-text'}`}>
        {msg.content && <p>{msg.content}</p>}
        {msg.attachments?.map((att, i) => (
          <div key={i} className="mt-1">
            {att.type === 'image' && <img src={att.url} className="max-h-80 max-w-full rounded-lg object-cover" alt="" />}
            {att.type === 'video' && <video src={att.url} controls className="max-h-80 max-w-full rounded-lg" />}
            {att.type === 'audio' && <audio src={att.url} controls className="max-w-full" />}
          </div>
        ))}
        <div className={`mt-1 flex items-center gap-1 text-[10px] ${isOwn ? 'text-black/60' : 'text-upnext-muted'}`}>
          {formatTime(msg.createdAt)}
          {isOwn && <FiCheck className={`h-3 w-3 ${isReadByOther ? 'text-blue-700' : ''}`} />}
        </div>
      </div>
    </motion.div>
  );
}