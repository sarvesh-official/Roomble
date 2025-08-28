'use client';

import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Calendar, 
  Flame, 
  Globe, 
  Lock, 
  Star, 
  Tag, 
  Users 
} from 'lucide-react';
import { Room } from '@/types/room';

interface RoomCardProps {
  room: Room;
  index: number;
  onJoinRoom: (room: Room) => void;
}

export function RoomCard({ room, index, onJoinRoom }: RoomCardProps) {
  return (
    <motion.div
      className="relative p-4 sm:p-5 bg-card border border-border/50 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-all hover:border-primary/30 flex flex-col h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onClick={() => onJoinRoom(room)}
      whileHover={{ y: -2 }}
    >
      {/* Room status indicators */}
      <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex gap-1 sm:gap-1.5">
        {/* Public/Private indicator */}
        <div 
          className={`p-1.5 sm:p-2 ${room.isPublic !== false ? 'bg-green-500/10' : 'bg-amber-500/10'} rounded-full`} 
          title={room.isPublic !== false ? 'Public Room' : 'Private Room'}
        >
          {room.isPublic !== false ? (
            <Globe size={12} className="text-green-500 sm:size-[14px]" />
          ) : (
            <Lock size={12} className="text-amber-500 sm:size-[14px]" />
          )}
        </div>
        {room.featured && (
          <div className="p-1.5 sm:p-2 bg-primary/10 rounded-full" title="Featured Room">
            <Star size={12} className="text-primary sm:size-[14px]" />
          </div>
        )}
        {room.popular && (
          <div className="p-1.5 sm:p-2 bg-orange-500/10 rounded-full" title="Popular Room">
            <Flame size={12} className="text-orange-500 sm:size-[14px]" />
          </div>
        )}
        <button
          className="p-1.5 sm:p-2 bg-background/80 rounded-full hover:bg-background"
          onClick={(e) => {
            e.stopPropagation();
            onJoinRoom(room);
          }}
        >
          <ArrowRight size={14} className="sm:size-[16px]" />
        </button>
      </div>

      <h3 className="text-base sm:text-lg font-medium mb-1 pr-12 sm:pr-16">{room.name}</h3>

      {room.description && (
        <p className="text-muted-foreground text-xs sm:text-sm mb-2 sm:mb-3">{room.description}</p>
      )}

      {room.tags && room.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
          {room.tags.map(tag => (
            <span
              key={tag}
              className="text-[10px] sm:text-xs bg-primary/10 text-primary px-1.5 sm:px-2 py-0.5 rounded-full flex items-center gap-0.5 sm:gap-1"
            >
              <Tag size={8} className="sm:size-[10px]" />
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto pt-2 sm:pt-3 border-t border-border/30">
        <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <Users size={14} className="sm:size-[16px]" />
            <span>{room.participants} participants</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <Calendar size={14} className="sm:size-[16px]" />
            <span>{room.lastActive}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
