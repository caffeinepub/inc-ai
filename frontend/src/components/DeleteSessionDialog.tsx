import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeleteSession } from '../hooks/useQueries';
import { useChatContext } from '../context/ChatContext';
import { Loader2 } from 'lucide-react';

interface DeleteSessionDialogProps {
  sessionName: string;
  open: boolean;
  onClose: () => void;
}

export default function DeleteSessionDialog({ sessionName, open, onClose }: DeleteSessionDialogProps) {
  const deleteSession = useDeleteSession();
  const { activeSession, setActiveSession } = useChatContext();

  const handleDelete = async () => {
    await deleteSession.mutateAsync(sessionName);
    if (activeSession === sessionName) {
      setActiveSession(null);
    }
    onClose();
  };

  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && onClose()}>
      <AlertDialogContent className="bg-inc-surface-2 border-border text-foreground w-[calc(100vw-2rem)] max-w-sm sm:max-w-md mx-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground">Delete Chat</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Are you sure you want to delete{' '}
            <span className="text-foreground font-medium">"{sessionName}"</span>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <AlertDialogCancel
            onClick={onClose}
            className="bg-inc-surface-3 border-border text-foreground hover:bg-inc-surface-4 min-h-[48px] w-full sm:w-auto"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteSession.isPending}
            className="bg-inc-red hover:bg-inc-red-light text-white border-0 min-h-[48px] w-full sm:w-auto"
          >
            {deleteSession.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
