'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRoomApi } from '@/app/api/room';
import { toast } from 'sonner';
import { OTPInput, SlotProps } from 'input-otp';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Image from 'next/image';

interface JoinRoomModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (roomId: string) => void;
}

export function JoinRoomModal({ isOpen, onOpenChange, onSuccess }: JoinRoomModalProps) {
  const [roomCode, setRoomCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { joinRoom } = useRoomApi();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  async function onSubmit(e?: React.FormEvent<HTMLFormElement>) {
    e?.preventDefault?.();
    
    if (roomCode.length !== 6) {
      setError('Room code must be exactly 6 characters');
      return;
    }
    
    try {
      setIsLoading(true);
      
      await joinRoom({ roomCode });
      
      onSuccess(roomCode);
      
      setRoomCode('');
      setError('');
      
    } catch (error) {
      console.error('Failed to join room:', error);
      setError('Failed to join room. Please check the code and try again.');
      toast.error('Failed to join room. Please try again.');
      setIsLoading(false); 
    }
  }

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open: boolean) => {
        if (!open && !isLoading) {
          setError('');
          setRoomCode('');
          onOpenChange(open);
        } else if (isLoading) {
          return;
        } else {
          onOpenChange(open);
        }
      }}
    >
      <DialogContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h3 className="text-lg font-medium">Joining room...</h3>
            <p className="text-sm text-muted-foreground mt-2">Please wait while we connect you</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center gap-2">
              <div
                className="flex size-11 shrink-0 items-center justify-center rounded-full border"
                aria-hidden="true"
              >
                <Image src="/icon.png" alt="Roomble" width={32} height={32} className="w-full h-full object-contain" />
              </div>
              <DialogHeader>
                <DialogTitle className="sm:text-center">
                  Enter room code
                </DialogTitle>
                <DialogDescription className="sm:text-center">
                  Enter the 6-character code to join the room
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center py-6">
                <OTPInput
                  id="room-code-input"
                  ref={inputRef}
                  value={roomCode}
                  onChange={(val) => {
                    setRoomCode(val.toUpperCase());
                    setError('');
                  }}
                  containerClassName="flex items-center gap-4 has-disabled:opacity-50"
                  maxLength={6}
                  onFocus={() => setError('')}
                  render={({ slots }) => (
                    <div className="flex gap-1.5 xs:gap-2 sm:gap-3 px-2 py-1">
                      {slots.map((slot, idx) => (
                        <Slot key={idx} {...slot} />
                      ))}
                    </div>
                  )}
                  onComplete={onSubmit}
                  disabled={isLoading}
                />
              </div>
              {error && (
                <p
                  className="text-muted-foreground text-center text-xs"
                  role="alert"
                  aria-live="polite"
                >
                  {error}
                </p>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Slot(props: SlotProps) {
  return (
    <div
      className={
        "bg-background text-foreground flex h-12 w-10 sm:h-16 sm:w-12 md:h-20 md:w-16 items-center justify-center rounded-md font-medium shadow-md transition-all duration-200 border border-gray-500 dark:border-gray-200"}
    >
      {props.char !== null && (
        <div className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase">{props.char}</div>
      )}
    </div>
  )
}
