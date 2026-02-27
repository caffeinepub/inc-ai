import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Loader2, Sparkles } from 'lucide-react';

interface ProfileSetupModalProps {
  open: boolean;
}

export default function ProfileSetupModal({ open }: ProfileSetupModalProps) {
  const [name, setName] = useState('');
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await saveProfile.mutateAsync({ name: name.trim() });
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="bg-inc-surface-2 border-border text-foreground w-[calc(100vw-2rem)] max-w-md mx-auto rounded-2xl"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-inc-red/20 flex items-center justify-center inc-glow">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-inc-red" />
            </div>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-display font-bold text-foreground">
            Welcome to INC.ai
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1.5 text-sm">
            Before we begin, what should I call you?
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground font-medium text-sm">
              Your Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              className="bg-inc-surface-3 border-border text-foreground placeholder:text-muted-foreground focus:border-inc-red focus:ring-inc-red h-11 text-base"
              autoFocus
              maxLength={50}
            />
          </div>

          <Button
            type="submit"
            disabled={!name.trim() || saveProfile.isPending}
            className="w-full bg-inc-red hover:bg-inc-red-light text-white border-0 font-semibold min-h-[48px] text-base"
          >
            {saveProfile.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Setting up...
              </>
            ) : (
              "Let's Chat →"
            )}
          </Button>

          {saveProfile.isError && (
            <p className="text-destructive text-sm text-center">
              Something went wrong. Please try again.
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
