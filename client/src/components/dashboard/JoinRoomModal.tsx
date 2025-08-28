'use client';

import EnhancedOTPInput from '@/components/enhanced-otp-input';

interface JoinRoomModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (roomId: string) => void;
}

export function JoinRoomModal({ isOpen, onOpenChange, onSuccess }: JoinRoomModalProps) {
  return (
    <EnhancedOTPInput    
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Join a Room"
      description="Enter the 6-digit code to join this room"
      onSuccess={(roomId) => onSuccess(roomId)}
    />
  );
}
