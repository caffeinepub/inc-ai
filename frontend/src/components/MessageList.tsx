import React, { useEffect, useRef } from 'react';
import { type Message as MessageType } from '../backend';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import EmptyState from './EmptyState';

interface MessageListProps {
  messages: MessageType[];
  isTyping: boolean;
}

export default function MessageList({ messages, isTyping }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (messages.length === 0 && !isTyping) {
    return <EmptyState noSessionSelected={false} />;
  }

  return (
    <div
      data-message-list
      className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6 space-y-3 sm:space-y-4"
    >
      {messages.map((msg, idx) => (
        <Message key={idx} message={msg} />
      ))}
      {isTyping && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
