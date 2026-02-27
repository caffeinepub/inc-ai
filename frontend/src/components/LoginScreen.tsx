import React from 'react';
import { Sparkles, MessageSquare, Zap, Shield, LogIn, Loader2 } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function LoginScreen() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center px-4 py-8 sm:p-6 overflow-y-auto">
      {/* Brand */}
      <div className="text-center mb-7 sm:mb-10">
        <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-inc-red/10 flex items-center justify-center mx-auto mb-4 sm:mb-6 inc-glow">
          <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 text-inc-red" />
        </div>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-foreground tracking-tight mb-2">
          INC<span className="text-inc-red">.ai</span>
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg max-w-xs sm:max-w-sm mx-auto">
          Your intelligent AI assistant. Powered by advanced language models.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-xs sm:max-w-xl mb-7 sm:mb-10">
        {[
          { icon: MessageSquare, title: 'Multi-session Chats', desc: 'Organize conversations in separate sessions' },
          { icon: Zap, title: 'Instant Responses', desc: 'Powered by state-of-the-art AI models' },
          { icon: Shield, title: 'Secure & Private', desc: 'Data stored on the Internet Computer' },
        ].map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="bg-inc-surface-2 border border-border rounded-xl p-4 sm:p-5 text-center"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-inc-red/10 flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-inc-red" />
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">{title}</p>
            <p className="text-xs text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>

      {/* Login button */}
      <div className="flex flex-col items-center gap-3 w-full max-w-xs">
        <button
          onClick={login}
          disabled={isLoggingIn}
          className="w-full flex items-center justify-center gap-2 bg-inc-red hover:bg-inc-red-light text-white font-semibold rounded-xl px-6 py-3.5 min-h-[52px] transition-colors inc-glow-sm disabled:opacity-60 text-base"
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Logging in...
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              Login to INC.ai
            </>
          )}
        </button>
        <p className="text-xs text-muted-foreground">
          Secure login via Internet Identity
        </p>
      </div>

      {/* Footer */}
      <footer className="mt-10 sm:mt-16 text-center text-xs text-muted-foreground">
        <p>
          © {new Date().getFullYear()} INC.ai — Built with{' '}
          <span className="text-inc-red">♥</span> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'inc-ai')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-inc-red hover:text-inc-red-light transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
