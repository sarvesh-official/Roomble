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
}

export function RoomGrid({ rooms, searchQuery, onJoinRoom, onCreateRoom }: RoomGridProps) {
  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      {rooms.length > 0 ? (
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
