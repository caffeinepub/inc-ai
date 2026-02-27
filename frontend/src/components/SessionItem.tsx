import React, { useState } from 'react';
import { Trash2, MessageSquare } from 'lucide-react';
import { useChatContext } from '../context/ChatContext';
import DeleteSessionDialog from './DeleteSessionDialog';
import { cn } from '@/lib/utils';

interface SessionItemProps {
  sessionName: string;
  collapsed: boolean;
  onSelect?: () => void;
}

export default function SessionItem({ sessionName, collapsed, onSelect }: SessionItemProps) {
  const { activeSession, setActiveSession } = useChatContext();
  const [showDelete, setShowDelete] = useState(false);
  const isActive = activeSession === sessionName;

  const handleSelect = () => {
    setActiveSession(sessionName);
    onSelect?.();
  };

  return (
    <>
      <div
        className={cn(
          'group flex items-center gap-2 px-2 rounded-md cursor-pointer transition-all duration-150 relative',
          'min-h-[48px] py-2',
          isActive
            ? 'bg-inc-red/15 text-foreground'
            : 'text-muted-foreground hover:bg-inc-surface-3 hover:text-foreground'
        )}
        onClick={handleSelect}
        title={collapsed ? sessionName : undefined}
      >
        {/* Active indicator */}
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-inc-red rounded-r-full" />
        )}

        <MessageSquare
          className={cn(
            'shrink-0 w-4 h-4',
            isActive ? 'text-inc-red' : 'text-muted-foreground group-hover:text-foreground'
          )}
        />

        {!collapsed && (
          <>
            <span className="flex-1 text-sm truncate font-medium">{sessionName}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDelete(true);
              }}
              className={cn(
                'opacity-0 group-hover:opacity-100 rounded hover:bg-inc-red/20 hover:text-inc-red transition-all',
                'flex items-center justify-center min-w-[40px] min-h-[40px]',
                // On touch devices, always show the delete button
                'active:opacity-100'
              )}
              title="Delete chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      <DeleteSessionDialog
        sessionName={sessionName}
        open={showDelete}
        onClose={() => setShowDelete(false)}
      />
    </>
  );
}
