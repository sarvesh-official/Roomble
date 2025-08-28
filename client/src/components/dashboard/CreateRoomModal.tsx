'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Globe, Lock, Tag, X } from 'lucide-react';
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
import { toast } from 'sonner';
import { createRoom } from '@/app/api/room';
import { getTags } from '@/app/api/tag';
import { Tag as TagType, TagOption } from '@/types/tag';
import { Badge } from '@/components/ui/badge';
import { Combobox } from '@/components/ui/combobox';

interface CreateRoomModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateRoomModal({ isOpen, onOpenChange }: CreateRoomModalProps) {
  const { user } = useUser();
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [roomNameInput, setRoomNameInput] = useState('');
  const [roomNameError, setRoomNameError] = useState('');
  const [roomDescriptionInput, setRoomDescriptionInput] = useState('');
  const [isRoomPublic, setIsRoomPublic] = useState(true);
  
  // Tag management
  const [availableTags, setAvailableTags] = useState<TagType[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState('');
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  
  // Store creator name in localStorage
  const creatorName = user?.fullName || user?.username || 'Anonymous';
  
  // Fetch available tags when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchTags = async () => {
        setIsLoadingTags(true);
        try {
          const tags = await getTags();
          setAvailableTags(tags);
        } catch (error) {
          console.error('Failed to fetch tags:', error);
          toast.error('Failed to load tags');
        } finally {
          setIsLoadingTags(false);
        }
      };
      
      fetchTags();
      
      // Reset form when modal opens
      setRoomNameInput('');
      setRoomNameError('');
      setRoomDescriptionInput('');
      setSelectedTagIds([]);
      setCustomTags([]);
      setCustomTagInput('');
      setIsRoomPublic(true);
    }
  }, [isOpen]);

  // Handle adding a custom tag
  const handleAddCustomTag = () => {
    if (!customTagInput.trim()) return;
    
    // Check if tag already exists in custom tags
    if (!customTags.includes(customTagInput.trim())) {
      setCustomTags([...customTags, customTagInput.trim()]);
    }
    
    setCustomTagInput('');
  };
  
  // Handle removing a custom tag
  const handleRemoveCustomTag = (tagToRemove: string) => {
    setCustomTags(customTags.filter(tag => tag !== tagToRemove));
  };
  
  // Handle removing a selected tag
  const handleRemoveSelectedTag = (tagIdToRemove: string) => {
    setSelectedTagIds(selectedTagIds.filter(id => id !== tagIdToRemove));
  };
  
  // Handle tag selection
  const handleTagSelect = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      handleRemoveSelectedTag(tagId);
    } else {
      setSelectedTagIds([...selectedTagIds, tagId]);
    }
  };

  const handleCreateRoom = async () => {
    try {
      if (!roomNameInput.trim()) {
        setRoomNameError('Please enter a room name');
        return;
      }
      
      setIsCreatingRoom(true);
      
      // Save creator name to localStorage
      if (user) {
        localStorage.setItem('roomCreator', creatorName);
      }
      
      // Create room with selected tags and custom tags
      const response = await createRoom({
        name: roomNameInput.trim(),
        description: roomDescriptionInput.trim(),
        isPublic: isRoomPublic,
        tagIds: selectedTagIds,
        customTags: customTags,
        createdBy: creatorName
      });
      
      toast.success('Room created successfully');
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to create room');
    } finally {
      setIsCreatingRoom(false);
    }
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
            <Label>Category Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedTagIds.map(tagId => {
                const tag = availableTags.find(t => t.id === tagId);
                if (!tag) return null;
                return (
                  <Badge 
                    key={tag.id} 
                    variant={tag.isCategory ? "category" : "default"}
                    className="flex items-center gap-1 py-1"
                  >
                    {tag.name}
                    <X 
                      size={14} 
                      className="cursor-pointer" 
                      onClick={() => handleRemoveSelectedTag(tag.id)} 
                    />
                  </Badge>
                );
              })}
            </div>
            
            <div className="mb-4">
              <Combobox
                options={availableTags.map(tag => ({
                  value: tag.id,
                  label: tag.name,
                  isCategory: tag.isCategory
                }))}
                onChange={handleTagSelect}
                placeholder={isLoadingTags ? "Loading tags..." : "Select tags..."}
                disabled={isLoadingTags}
              />
            </div>
            
            <Label>Custom Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {customTags.map(tag => (
                <Badge 
                  key={tag} 
                  variant="custom"
                  className="flex items-center gap-1 py-1"
                >
                  {tag}
                  <X 
                    size={14} 
                    className="cursor-pointer" 
                    onClick={() => handleRemoveCustomTag(tag)} 
                  />
                </Badge>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Add custom tag"
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCustomTag()}
              />
              <Button 
                type="button" 
                size="sm" 
                onClick={handleAddCustomTag}
                disabled={!customTagInput.trim()}
              >
                Add
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Create your own custom tags</p>
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
