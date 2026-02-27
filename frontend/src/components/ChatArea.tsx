import React, { useCallback, useEffect } from 'react';
import { useGetMessages, useSendMessage } from '../hooks/useQueries';
import { useChatContext } from '../context/ChatContext';
import { type Message as MessageType } from '../backend';
import { Role } from '../backend';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import EmptyState from './EmptyState';
import { Loader2 } from 'lucide-react';

export default function ChatArea() {
  const { activeSession } = useChatContext();
  const { data: messages = [], isLoading: messagesLoading } = useGetMessages(activeSession);
  const sendMessage = useSendMessage();

  const handleSend = useCallback(
    async (userMessage: string) => {
      if (!activeSession) return;

      const history = messages.map((msg: MessageType) => ({
        role: msg.role === Role.user ? ('user' as const) : ('assistant' as const),
        content: msg.content,
      }));

      sendMessage.mutate({
        sessionName: activeSession,
        userMessage,
        conversationHistory: history,
      });
    },
    [activeSession, messages, sendMessage]
  );

  // Scroll message list to bottom when virtual keyboard opens (viewport shrinks)
  useEffect(() => {
    const handleResize = () => {
      setTimeout(() => {
        const messageList = document.querySelector('[data-message-list]');
        if (messageList) {
          messageList.scrollTop = messageList.scrollHeight;
        }
      }, 150);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const errorMessage = sendMessage.isError
    ? 'Failed to get a response. Please try again.'
    : null;

  if (!activeSession) {
    return (
      <main className="flex-1 flex flex-col bg-background overflow-hidden min-w-0">
        <EmptyState noSessionSelected={true} />
      </main>
    );
  }

  if (messagesLoading) {
    return (
      <main className="flex-1 flex flex-col bg-background overflow-hidden min-w-0 items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-inc-red" />
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col bg-background overflow-hidden min-w-0">
      {/* Session title bar */}
      <div className="px-3 sm:px-4 py-2.5 border-b border-border bg-inc-surface-2 shrink-0">
        <h2 className="text-sm font-semibold text-foreground truncate">{activeSession}</h2>
      </div>

      {/* Messages — flex-1 fills available space */}
      <MessageList messages={messages} isTyping={sendMessage.isPending} />

      {/* Input — anchored at bottom, shrink-0 so it never gets pushed off screen */}
      <MessageInput
        onSend={handleSend}
        isLoading={sendMessage.isPending}
        disabled={false}
        error={errorMessage}
      />
    </main>
  );
}
