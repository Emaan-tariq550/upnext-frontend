import Skeleton from '../ui/Skeleton';
import EmptyState from '../ui/EmptyState';
import { FiMessageSquare } from 'react-icons/fi';
import useAuthStore from '../../store/authStore';

export default function ConversationList({ conversations, isLoading, activeId, onSelect }) {
  const currentUser = useAuthStore((s) => s.user);

  return (
    <div className="border-r border-upnext-border bg-upnext-surface/40 overflow-y-auto">
      <div className="border-b border-upnext-border p-4">
        <h2 className="font-semibold">Messages</h2>
      </div>

      {isLoading ? (
        <div className="space-y-2 p-3">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-16" />)}
        </div>
      ) : conversations?.length ? (
        <div className="p-2">
          {conversations.map((convo) => {
            const otherUser =
              convo.type === 'private'
                ? convo.participants.find((p) => p._id !== currentUser?._id)
                : null;
            const displayName = convo.type === 'group' ? convo.groupName : otherUser?.displayName;
            const avatarUrl = convo.type === 'group' ? convo.groupAvatarUrl : otherUser?.avatarUrl;

            return (
              <button
                key={convo._id}
                data-cursor-hover
                onClick={() => onSelect(convo)}
                className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors ${
                  activeId === convo._id ? 'bg-upnext-primary/15' : 'hover:bg-white/5'
                }`}
              >
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-upnext-primary/20">
                  {avatarUrl && <img src={avatarUrl} className="h-full w-full object-cover" alt="" />}
                  {otherUser?.isOnline && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-upnext-surface bg-green-500" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{displayName || 'Unknown'}</p>
                  <p className="truncate text-xs text-upnext-muted">
                    {convo.lastMessage?.isDeleted ? 'Message deleted' : convo.lastMessage?.content || 'No messages yet'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <EmptyState icon={FiMessageSquare} title="No conversations" subtitle="Follow friends to start chatting." />
      )}
    </div>
  );
}