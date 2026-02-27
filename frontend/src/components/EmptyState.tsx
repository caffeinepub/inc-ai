import React from 'react';
import { Sparkles, MessageSquare, Zap, Shield } from 'lucide-react';

interface EmptyStateProps {
  noSessionSelected?: boolean;
}

export default function EmptyState({ noSessionSelected = false }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 sm:p-8 text-center overflow-y-auto">
      {/* Logo / Brand */}
      <div className="mb-4 sm:mb-6">
        <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-inc-red/10 flex items-center justify-center mx-auto mb-3 sm:mb-4 inc-glow">
          <Sparkles className="w-7 h-7 sm:w-10 sm:h-10 text-inc-red" />
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground tracking-tight">
          INC<span className="text-inc-red">.ai</span>
        </h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base max-w-[260px] sm:max-w-none mx-auto">
          {noSessionSelected
            ? 'Select a chat or create a new one to get started'
            : 'Start the conversation below'}
        </p>
      </div>

      {/* Feature hints */}
      {noSessionSelected && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 w-full max-w-[280px] sm:max-w-lg mt-2 sm:mt-4">
          {[
            { icon: MessageSquare, title: 'Multi-session', desc: 'Manage multiple conversations' },
            { icon: Zap, title: 'Instant AI', desc: 'Powered by advanced language models' },
            { icon: Shield, title: 'Secure', desc: 'Your data on the Internet Computer' },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-inc-surface-2 border border-border rounded-xl p-3 sm:p-4 text-left"
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-inc-red mb-1.5 sm:mb-2" />
              <p className="text-sm font-semibold text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
