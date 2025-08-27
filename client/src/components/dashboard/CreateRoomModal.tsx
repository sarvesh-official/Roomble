'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Globe, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { generateRoomId } from '@/lib/utils';

interface CreateRoomModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateRoom: (roomId: string) => void;
}

export function CreateRoomModal({ isOpen, onOpenChange, onCreateRoom }: CreateRoomModalProps) {
  const { user } = useUser();
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [roomNameInput, setRoomNameInput] = useState('');
  const [roomNameError, setRoomNameError] = useState('');
  const [roomDescriptionInput, setRoomDescriptionInput] = useState('');
  const [roomTagsInput, setRoomTagsInput] = useState('');
  const [isRoomPublic, setIsRoomPublic] = useState(true);

  const handleCreateRoom = () => {
    // Validate room name
    if (!roomNameInput.trim()) {
      setRoomNameError('Please enter a room name');
      return;
    }

    setIsCreatingRoom(true);
    const roomId = generateRoomId();

    // Process tags if provided
    const tags = roomTagsInput.trim()
      ? roomTagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      : [];

    // Get current user name (in a real app, this would come from authentication)
    const currentUser = user?.fullName || localStorage.getItem('roomble-username') || 'Guest User';

    // In a real app, you would save the room data to your backend
    // For now, we'll just store in localStorage and navigate to the room
    setTimeout(() => {
      // Store room details in localStorage
      localStorage.setItem('roomble-room-name', roomNameInput.trim());
      localStorage.setItem('roomble-room-description', roomDescriptionInput.trim());
      localStorage.setItem('roomble-room-tags', JSON.stringify(tags));
      localStorage.setItem('roomble-room-public', String(isRoomPublic));
      localStorage.setItem('roomble-room-creator', currentUser);
      
      // Reset form
      setRoomNameInput('');
      setRoomDescriptionInput('');
      setRoomTagsInput('');
      setIsRoomPublic(true);
      setIsCreatingRoom(false);
      
      onCreateRoom(roomId);
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Room</DialogTitle>
          <DialogDescription>
            Give your room a name and start a new conversation.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="room-name">Room Name</Label>
            <Input
              id="room-name"
              placeholder="Enter room name"
              value={roomNameInput}
              onChange={(e) => {
                setRoomNameInput(e.target.value);
                setRoomNameError('');
              }}
              className={roomNameError ? 'border-destructive' : ''}
              autoFocus
            />
            {roomNameError && (
              <p className="text-xs text-destructive mt-1">{roomNameError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="room-description">Description (optional)</Label>
            <Input
              id="room-description"
              placeholder="Brief description of your room"
              value={roomDescriptionInput}
              onChange={(e) => setRoomDescriptionInput(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="room-tags">Tags (optional)</Label>
            <Input
              id="room-tags"
              placeholder="Comma-separated tags (e.g., Design, Weekly, Team)"
              value={roomTagsInput}
              onChange={(e) => setRoomTagsInput(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Separate tags with commas</p>
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="room-public" className="flex items-center gap-2">
              <div className="flex-shrink-0">
                {isRoomPublic ? (
                  <Globe size={18} className="text-green-500" />
                ) : (
                  <Lock size={18} className="text-amber-500" />
                )}
              </div>
              <div>
                <span>{isRoomPublic ? 'Public Room' : 'Private Room'}</span>
                <p className="text-xs text-muted-foreground">
                  {isRoomPublic 
                    ? 'Anyone can find and join this room' 
                    : 'Only people with the room code can join'}
                </p>
              </div>
            </Label>
            <Switch
              id="room-public"
              checked={isRoomPublic}
              onCheckedChange={setIsRoomPublic}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleCreateRoom}
            disabled={isCreatingRoom}
          >
            {isCreatingRoom ? 'Creating...' : 'Create Room'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
