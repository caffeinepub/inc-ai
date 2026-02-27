import React from 'react';
import { type Message as MessageType } from '../backend';
import { Role } from '../backend';
import { cn } from '@/lib/utils';

interface MessageProps {
  message: MessageType;
}

function formatTime(timestamp: bigint): string {
  const ms = Number(timestamp / BigInt(1_000_000));
  const date = new Date(ms);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export default function Message({ message }: MessageProps) {
  const isUser = message.role === Role.user;

  if (isUser) {
    return (
      <div className="flex justify-end animate-fade-in">
        <div className="max-w-[88%] sm:max-w-[75%] flex flex-col items-end gap-1">
          <div className="bg-inc-red text-white rounded-2xl rounded-tr-sm px-3 sm:px-4 py-2 sm:py-2.5 text-sm leading-relaxed break-words min-w-0">
            {message.content}
          </div>
          <span className="text-xs text-muted-foreground px-1">
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 sm:gap-3 animate-fade-in">
      {/* AI Avatar */}
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-inc-red/20 flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-inc-red font-display font-bold text-xs">AI</span>
      </div>

      <div className="max-w-[88%] sm:max-w-[75%] flex flex-col gap-1 min-w-0">
        <div className="bg-inc-surface-3 text-foreground rounded-2xl rounded-tl-sm px-3 sm:px-4 py-2 sm:py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </div>
        <span className="text-xs text-muted-foreground px-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
