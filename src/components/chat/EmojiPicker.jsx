import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiSmile } from 'react-icons/fi';

const EMOJIS = ['😀', '😂', '😍', '🥰', '😎', '😢', '😡', '👍', '👎', '❤️', '🔥', '🎉', '🙏', '👏', '💯', '😴', '🤔', '😱', '🥳', '😅'];

export default function EmojiPicker({ onSelect }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        data-cursor-hover
        onClick={() => setOpen(!open)}
        className="rounded-lg p-2 text-upnext-muted hover:bg-white/10 hover:text-upnext-text"
      >
        <FiSmile className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full right-0 mb-2 grid grid-cols-5 gap-1 rounded-xl border border-upnext-border bg-upnext-surface p-3 shadow-xl"
          >
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                data-cursor-hover
                onClick={() => {
                  onSelect(emoji);
                  setOpen(false);
                }}
                className="rounded-lg p-1.5 text-xl hover:bg-white/10"
              >
                {emoji}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}