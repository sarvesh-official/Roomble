'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ShareRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
}

export function ShareRoomModal({ isOpen, onClose, roomId }: ShareRoomModalProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Room</DialogTitle>
          <DialogDescription>
            Share this room code with others to invite them to join.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          {/* Large Room Code Display */}
          <div className="flex gap-1.5 sm:gap-3 px-2 py-1">
            {roomId.split('').map((char, idx) => (
              <div 
                key={idx}
                className="bg-background text-foreground flex h-12 w-10 sm:h-16 sm:w-12 items-center justify-center rounded-md font-medium shadow-md transition-all duration-200 border border-gray-500 dark:border-gray-200"
              >
                <div className="text-2xl sm:text-3xl font-bold uppercase">{char}</div>
              </div>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={copyToClipboard}
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? 'Copied!' : 'Copy Code'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
