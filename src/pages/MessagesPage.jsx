import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { FiArrowLeft, FiMessageSquare } from 'react-icons/fi';
import { chatApi } from '../api/chatApi';
import ConversationList from '../components/chat/ConversationList';
import MessageThread from '../components/chat/MessageThread';
import EmptyState from '../components/ui/EmptyState';

export default function MessagesPage() {
  const [activeConversation, setActiveConversation] = useState(null);
  const location = useLocation();

  const { data: conversations, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => chatApi.getConversations().then((r) => r.data.data),
    refetchInterval: 15000,
  });

  useEffect(() => {
    if (location.state?.conversationId && conversations) {
      const convo = conversations.find((c) => c._id === location.state.conversationId);
      if (convo) setActiveConversation(convo);
    }
  }, [location.state, conversations]);

  return (
    <div className="grid h-[calc(100vh-140px)] min-h-0 grid-cols-1 overflow-hidden rounded-2xl border border-upnext-border md:grid-cols-[320px_1fr]">
      <div className={`h-full min-h-0 ${activeConversation ? 'hidden md:block' : 'block'}`}>
        <ConversationList
          conversations={conversations}
          isLoading={isLoading}
          activeId={activeConversation?._id}
          onSelect={setActiveConversation}
        />
      </div>

      <div className={`h-full min-h-0 ${activeConversation ? 'block' : 'hidden md:block'}`}>
        {activeConversation ? (
          <div className="flex h-full min-h-0 flex-col">
            <button
              onClick={() => setActiveConversation(null)}
              className="flex shrink-0 items-center gap-2 border-b border-upnext-border p-3 text-sm text-upnext-muted md:hidden"
            >
              <FiArrowLeft /> Back
            </button>
            <MessageThread conversation={activeConversation} />
          </div>
        ) : (
          <div className="hidden h-full items-center justify-center md:flex">
            <EmptyState icon={FiMessageSquare} title="Select a conversation" subtitle="Pick someone to start chatting." />
          </div>
        )}
      </div>
    </div>
  );
}