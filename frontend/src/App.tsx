import React, { useState, useEffect } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { ChatProvider } from './context/ChatContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import LoginScreen from './components/LoginScreen';
import ProfileSetupModal from './components/ProfileSetupModal';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched: profileFetched,
  } = useGetCallerUserProfile();

  // Mobile sidebar state — closed by default on mobile, open on desktop
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    return typeof window !== 'undefined' && window.innerWidth >= 768;
  });

  // On resize to mobile, close sidebar; on resize to desktop, open it
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const closeSidebar = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  // Show loading spinner while initializing auth
  if (isInitializing) {
    return (
      <div className="min-h-[100dvh] bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-inc-red" />
          <p className="text-muted-foreground text-sm">Initializing...</p>
        </div>
      </div>
    );
  }

  // Show login screen for unauthenticated users
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // Show loading while fetching profile
  if (profileLoading && !profileFetched) {
    return (
      <div className="min-h-[100dvh] bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-inc-red" />
          <p className="text-muted-foreground text-sm">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Show profile setup modal for new users
  const showProfileSetup = isAuthenticated && !profileLoading && profileFetched && userProfile === null;

  if (showProfileSetup) {
    return (
      <div className="min-h-[100dvh] bg-background">
        <ProfileSetupModal open={true} />
      </div>
    );
  }

  // Main chat interface
  return (
    <ChatProvider>
      <div className="h-[100dvh] flex flex-col bg-background overflow-hidden">
        <Header onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        <div className="flex flex-1 overflow-hidden relative">
          {/* Mobile overlay backdrop */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-20 md:hidden"
              onClick={closeSidebar}
              aria-hidden="true"
            />
          )}
          <Sidebar open={sidebarOpen} onClose={closeSidebar} />
          <ChatArea />
        </div>
        {/* Footer */}
        <footer className="shrink-0 border-t border-border bg-inc-surface-2 py-1.5 px-4 text-center">
          <p className="text-xs text-muted-foreground">
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
    </ChatProvider>
  );
}

export default function App() {
  return <AppContent />;
}
