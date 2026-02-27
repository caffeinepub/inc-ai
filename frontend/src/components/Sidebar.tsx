import React, { useState } from 'react';
import { PanelLeftClose, PanelLeftOpen, Plus, Loader2, MessageSquarePlus } from 'lucide-react';
import { useListSessions, useCreateSession } from '../hooks/useQueries';
import { useChatContext } from '../context/ChatContext';
import SessionItem from './SessionItem';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { data: sessions = [], isLoading } = useListSessions();
  const createSession = useCreateSession();
  const { setActiveSession } = useChatContext();

  const handleNewChat = async () => {
    const timestamp = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const name = `Chat ${timestamp}`;
    try {
      await createSession.mutateAsync(name);
      setActiveSession(name);
      onClose();
    } catch {
      const uniqueName = `${name} (${Math.floor(Math.random() * 1000)})`;
      await createSession.mutateAsync(uniqueName);
      setActiveSession(uniqueName);
      onClose();
    }
  };

  return (
    <TooltipProvider>
      {/* ── Desktop sidebar (in-flow, collapsible) ── */}
      <aside
        className={cn(
          'hidden md:flex flex-col bg-inc-surface-2 border-r border-border shrink-0 transition-all duration-300',
          collapsed ? 'w-14' : 'w-64'
        )}
      >
        {/* Header */}
        <div
          className={cn(
            'flex items-center p-2 border-b border-border h-14',
            collapsed ? 'justify-center' : 'justify-between px-3'
          )}
        >
          {!collapsed && (
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Chats
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-11 h-11 rounded-md text-muted-foreground hover:text-foreground hover:bg-inc-surface-3 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {/* New Chat button */}
        <div className={cn('p-2', collapsed ? 'flex justify-center' : '')}>
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleNewChat}
                  disabled={createSession.isPending}
                  className="flex items-center justify-center w-11 h-11 rounded-md bg-inc-red/10 hover:bg-inc-red/20 text-inc-red transition-colors disabled:opacity-50"
                >
                  {createSession.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <MessageSquarePlus className="w-4 h-4" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">New Chat</TooltipContent>
            </Tooltip>
          ) : (
            <Button
              onClick={handleNewChat}
              disabled={createSession.isPending}
              className="w-full bg-inc-red/10 hover:bg-inc-red/20 text-inc-red border border-inc-red/20 hover:border-inc-red/40 font-medium text-sm min-h-[44px]"
              variant="ghost"
              size="sm"
            >
              {createSession.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              New Chat
            </Button>
          )}
        </div>

        {/* Sessions list */}
        <ScrollArea className="flex-1 px-2">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          ) : sessions.length === 0 ? (
            !collapsed && (
              <div className="text-center py-8 px-2">
                <p className="text-xs text-muted-foreground">No chats yet.</p>
                <p className="text-xs text-muted-foreground mt-1">Click "New Chat" to start.</p>
              </div>
            )
          ) : (
            <div className="space-y-0.5 py-1">
              {sessions.map((session) => (
                <SessionItem
                  key={session}
                  sessionName={session}
                  collapsed={collapsed}
                  onSelect={onClose}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </aside>

      {/* ── Mobile sidebar (fixed overlay drawer) ── */}
      <aside
        className={cn(
          'fixed top-14 left-0 bottom-0 z-30 flex flex-col bg-inc-surface-2 border-r border-border w-72',
          'transition-transform duration-300 ease-in-out md:hidden',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center px-4 border-b border-border h-14 shrink-0">
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Chats
          </span>
        </div>

        {/* New Chat button */}
        <div className="p-3">
          <Button
            onClick={handleNewChat}
            disabled={createSession.isPending}
            className="w-full bg-inc-red/10 hover:bg-inc-red/20 text-inc-red border border-inc-red/20 hover:border-inc-red/40 font-medium text-sm min-h-[48px]"
            variant="ghost"
          >
            {createSession.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            New Chat
          </Button>
        </div>

        {/* Sessions list */}
        <ScrollArea className="flex-1 px-2">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8 px-2">
              <p className="text-xs text-muted-foreground">No chats yet.</p>
              <p className="text-xs text-muted-foreground mt-1">Tap "New Chat" to start.</p>
            </div>
          ) : (
            <div className="space-y-0.5 py-1">
              {sessions.map((session) => (
                <SessionItem
                  key={session}
                  sessionName={session}
                  collapsed={false}
                  onSelect={onClose}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </aside>
    </TooltipProvider>
  );
}
