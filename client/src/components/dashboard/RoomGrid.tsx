'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RoomCard } from './RoomCard';
import { Room } from '@/types/room';

interface RoomGridProps {
  rooms: Room[];
  searchQuery: string;
  onJoinRoom: (room: Room) => void;
  onCreateRoom: () => void;
  isLoading?: boolean;
}

export function RoomGrid({ rooms, searchQuery, onJoinRoom, onCreateRoom, isLoading = false }: RoomGridProps) {
  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      {isLoading ? (
        <div className="bg-card/50 border border-border/50 rounded-xl p-4 sm:p-8 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-muted mb-3"></div>
            <div className="h-4 w-32 bg-muted rounded mb-2"></div>
            <div className="h-3 w-48 bg-muted rounded mb-4"></div>
            <div className="h-9 w-32 bg-muted rounded"></div>
          </div>
        </div>
      ) : rooms.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {rooms.map((room, index) => (
            <RoomCard 
              key={room.id} 
              room={room} 
              index={index} 
              onJoinRoom={onJoinRoom} 
            />
          ))}
        </div>
      ) : (
        <div className="bg-card/50 border border-border/50 rounded-xl p-4 sm:p-8 text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
          <h3 className="text-lg font-medium mb-2">No rooms found</h3>
          <p className="text-muted-foreground">
            {searchQuery ? 'Try a different search term or create a new room.' : 'Create a new room to get started.'}
          </p>
          <Button
            className="mt-4 gap-2"
            variant="outline"
            onClick={onCreateRoom}
          >
            <Plus size={16} /> Create Room
          </Button>
        </div>
      )}
    </motion.div>
  );
}
