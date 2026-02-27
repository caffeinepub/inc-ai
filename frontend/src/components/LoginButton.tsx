import React from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { LogIn, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function LoginButton() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: unknown) {
        const err = error as Error;
        if (err?.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <Button
      onClick={handleAuth}
      disabled={isLoggingIn}
      variant={isAuthenticated ? 'outline' : 'default'}
      size="sm"
      className={cn(
        'min-h-[44px] px-3 sm:px-4',
        isAuthenticated
          ? 'border-border text-foreground hover:bg-secondary hover:text-foreground'
          : 'bg-inc-red hover:bg-inc-red-light text-white border-0 inc-glow-sm'
      )}
    >
      {isLoggingIn ? (
        <>
          <Loader2 className="w-4 h-4 sm:mr-1.5 animate-spin" />
          <span className="hidden sm:inline">Logging in...</span>
        </>
      ) : isAuthenticated ? (
        <>
          <LogOut className="w-4 h-4 sm:mr-1.5" />
          <span className="hidden sm:inline">Logout</span>
        </>
      ) : (
        <>
          <LogIn className="w-4 h-4 sm:mr-1.5" />
          <span className="hidden sm:inline">Login</span>
        </>
      )}
    </Button>
  );
}
