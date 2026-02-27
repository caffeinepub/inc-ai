import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ChatContextType {
  activeSession: string | null;
  setActiveSession: (session: string | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [activeSession, setActiveSession] = useState<string | null>(null);

  return (
    <ChatContext.Provider value={{ activeSession, setActiveSession }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}
