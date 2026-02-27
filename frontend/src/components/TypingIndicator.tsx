import React from 'react';

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 animate-fade-in">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-inc-red/20 flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-inc-red font-display font-bold text-xs">AI</span>
      </div>

      {/* Dots */}
      <div className="bg-inc-surface-3 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
        <span className="typing-dot w-2 h-2 rounded-full bg-muted-foreground inline-block" />
        <span className="typing-dot w-2 h-2 rounded-full bg-muted-foreground inline-block" />
        <span className="typing-dot w-2 h-2 rounded-full bg-muted-foreground inline-block" />
      </div>
    </div>
  );
}
