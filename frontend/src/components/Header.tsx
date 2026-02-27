import React from 'react';
import LoginButton from './LoginButton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
}

export default function Header({ onToggleSidebar, sidebarOpen }: HeaderProps) {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;

  const initials = userProfile?.name
    ? userProfile.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <header className="h-14 flex items-center justify-between px-3 sm:px-4 border-b border-border bg-inc-surface-2 shrink-0 z-10">
      {/* Left side: hamburger (mobile only) + logo */}
      <div className="flex items-center gap-1 sm:gap-2 min-w-0">
        {isAuthenticated && onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="flex items-center justify-center w-11 h-11 -ml-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-inc-surface-3 transition-colors md:hidden shrink-0"
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        )}
        <img
          src="/assets/generated/inc-ai-logo.dim_320x80.png"
          alt="INC.ai"
          className="h-7 sm:h-8 w-auto object-contain shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <span className="font-display font-bold text-lg sm:text-xl text-foreground tracking-tight hidden sm:block">
          INC<span className="text-inc-red">.ai</span>
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {isAuthenticated && userProfile && (
          <div className="flex items-center gap-2">
            <Avatar className="w-7 h-7 shrink-0">
              <AvatarFallback className="bg-inc-red/20 text-inc-red text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground hidden sm:block max-w-[120px] truncate">
              {userProfile.name}
            </span>
          </div>
        )}
        <LoginButton />
      </div>
    </header>
  );
}
