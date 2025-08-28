'use client';

import { Calendar, Globe, Lock, MessageSquare, Tag, Users } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Room } from '@/types/room';

interface RoomConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  room: Room | null;
  onJoinRoom: (roomId: string) => void;
}

export function RoomConfirmationDialog({ 
  isOpen, 
  onOpenChange, 
  room, 
  onJoinRoom 
}: RoomConfirmationDialogProps) {
  if (!room) return null;
  
  return (
    <AlertDialog 
      open={isOpen} 
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="pb-2 border-b">
          <AlertDialogTitle className="text-xl font-bold">Join Room Confirmation</AlertDialogTitle>
        </AlertDialogHeader>
        
        <div className="py-4">
          <h3 className="text-lg font-semibold mb-2">{room.name}</h3>
          {room.description && (
            <p className="text-muted-foreground mb-5">{room.description}</p>
          )}
          
          <div className="grid grid-cols-1 gap-4 mb-2">
            {/* Room status and creator */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 bg-card/50 p-3 rounded-lg border border-border/30">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-full ${room.isPublic !== false ? 'bg-green-500/10' : 'bg-amber-500/10'}`}>
                  {room.isPublic !== false ? (
                    <Globe size={16} className="text-green-500" />
                  ) : (
                    <Lock size={16} className="text-amber-500" />
                  )}
                </div>
                <span className="font-medium">{room.isPublic !== false ? 'Public Room' : 'Private Room'}</span>
              </div>
              <div className="flex items-center flex-wrap gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm text-muted-foreground">Created by:</span>
                <span className="text-xs sm:text-sm font-medium">{room.createdBy || 'Unknown'}</span>
                {room.createdByYou && (
                  <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">You</span>
                )}
              </div>
            </div>
            
            {/* Room details */}
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
              {/* Participants */}
              <div className="flex items-center gap-2 bg-card/50 p-3 rounded-lg border border-border/30">
                <div className="p-1.5 rounded-full bg-blue-500/10">
                  <Users size={16} className="text-blue-500" />
                </div>
                <span className="text-xs sm:text-sm">{room.participants} participants</span>
              </div>
              
              {/* Last active */}
              <div className="flex items-center gap-2 bg-card/50 p-3 rounded-lg border border-border/30">
                <div className="p-1.5 rounded-full bg-purple-500/10">
                  <Calendar size={16} className="text-purple-500" />
                </div>
                <span className="text-xs sm:text-sm">{room.lastActive}</span>
              </div>
              
              {/* Activity */}
              <div className="flex items-center gap-2 bg-card/50 p-3 rounded-lg border border-border/30 col-span-1 xs:col-span-2">
                <div className="p-1.5 rounded-full bg-amber-500/10">
                  <MessageSquare size={16} className="text-amber-500" />
                </div>
                <span className="text-xs sm:text-sm">Active discussion</span>
              </div>
            </div>
            
            {/* Tags */}
            {room.tags && room.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1 bg-card/50 p-3 rounded-lg border border-border/30">
                <div className="flex items-center gap-1 mr-2">
                  <Tag size={14} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Tags:</span>
                </div>
                {room.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <AlertDialogFooter className="pt-2 border-t">
          <AlertDialogCancel className="bg-muted hover:bg-muted/80">Cancel</AlertDialogCancel>
          <AlertDialogAction 
            className="bg-primary hover:bg-primary/90"
            onClick={() => {
              if (room) {
                onJoinRoom(room.id);
              }
            }}
          >
            Join Room
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
