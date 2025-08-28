'use client';

import { useState } from 'react';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ShareRoomModal } from './share-room-modal';
import { useParams } from 'next/navigation';

interface ShareButtonProps {
  className?: string;
}

export function ShareButton({ className }: ShareButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const params = useParams();
  const roomId = params?.id as string || 'room-123'; // Fallback ID for demo

  return (
    <>
      <Button
        variant="default"
        size="sm"
        className={`px-2 h-8 ${className}`}
        onClick={() => setIsModalOpen(true)}
      >
        <Share2 className="h-4 w-4" />
        <span className="hidden sm:inline ml-2">Share</span>
      </Button>
      
      <ShareRoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        roomId={roomId}
      />
    </>
  );
}
