import React, { useState, useRef, useCallback } from 'react';
import { Send, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
  error?: string | null;
}

export default function MessageInput({ onSend, isLoading, disabled, error }: MessageInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isLoading || disabled) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [value, isLoading, disabled, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const ta = e.target;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
  };

  // Scroll input into view when focused on mobile (keyboard opens)
  const handleFocus = () => {
    setTimeout(() => {
      containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 300);
  };

  const canSend = value.trim().length > 0 && !isLoading && !disabled;

  return (
    <div ref={containerRef} className="border-t border-border bg-inc-surface-2 px-3 sm:px-4 py-3 shrink-0">
      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm mb-2 px-1">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      <div className="flex items-end gap-2 bg-inc-surface-3 border border-border rounded-xl px-3 py-2 focus-within:border-inc-red/50 transition-colors">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder="Message INC.ai…"
          disabled={isLoading || disabled}
          rows={1}
          className={cn(
            'flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none',
            'min-h-[28px] max-h-[160px] overflow-y-auto leading-7',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        />
        <button
          onClick={handleSend}
          disabled={!canSend}
          className={cn(
            'rounded-xl transition-all duration-150 shrink-0 mb-0.5',
            'flex items-center justify-center min-w-[44px] min-h-[44px]',
            canSend
              ? 'bg-inc-red text-white hover:bg-inc-red-light inc-glow-sm'
              : 'bg-inc-surface-4 text-muted-foreground cursor-not-allowed'
          )}
          title="Send message"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
      <p className="text-xs text-muted-foreground mt-1.5 text-center hidden sm:block">
        INC.ai can make mistakes. Verify important information.
      </p>
    </div>
  );
}
