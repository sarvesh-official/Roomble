'use client';


import { useRouter } from 'next/navigation';
import { useWindowSize } from 'react-use';
import Image from 'next/image';
import { useState } from 'react';

import { RoomSettings } from '@/components/room-settings';
import { ShareButton } from '@/components/share-button';
import { SidebarToggle } from '@/components/sidebar-toggle';
import { Button } from '@/components/ui/button';
import { useSidebar } from './ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { VisibilitySelector } from './visibility-selector';
import { Users } from 'lucide-react';
import { ThemeToggleButton } from './ui/theme-toggle-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ChatHeaderProps {
  memberCount?: number;
  participants?: Array<{
    id: string;
    name: string;
    isActive: boolean;
    avatar: string | null;
  }>;
}

export function ChatHeader({ memberCount = 24, participants }: ChatHeaderProps) {
  // Default participants if none provided
  const defaultParticipants = [
    { id: '1', name: 'Alex Smith', isActive: true, avatar: null },
    { id: '2', name: 'Jamie Doe', isActive: true, avatar: null },
    { id: '3', name: 'Taylor Wilson', isActive: false, avatar: null },
  ];
  
  const roomParticipants = participants || defaultParticipants;
  const router = useRouter();
  const { open } = useSidebar();
  const { width: windowWidth } = useWindowSize();
  const isMobile = windowWidth < 640;

  return (
    <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2 text-foreground justify-between z-20">
      <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
        <SidebarToggle />

        {(!open || windowWidth < 768) && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size={isMobile ? "sm" : "default"}
                className="md:px-2 px-1 md:h-fit"
                onClick={() => {
                  router.push('/');
                  router.refresh();
                }}
              >
                <div className={isMobile ? "size-4" : "size-5"}>  
                  <Image src="/icon.png" alt="New Room" width={20} height={20} className="w-full h-full object-contain" />
                </div>
                <span className="sr-only">New Room</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Create New Room</TooltipContent>
          </Tooltip>
        )}

        <div className={isMobile ? "flex gap-1" : "flex gap-2"}>
          <RoomSettings />
          <VisibilitySelector />
        </div>
      </div>
      
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Participants Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1 relative">
              <Users className={isMobile ? "h-4 w-4" : "h-5 w-5"} />
              <span>{roomParticipants.filter(p => p.isActive).length}</span>
              <span className="sr-only">View participants</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Room Participants</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {roomParticipants.length > 0 ? (
              roomParticipants.map(participant => (
                <DropdownMenuItem key={participant.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      {participant.avatar ? (
                        <Image 
                          src={participant.avatar} 
                          alt={participant.name} 
                          width={32} 
                          height={32} 
                          className="rounded-full" 
                        />
                      ) : (
                        <span className="text-xs font-medium">
                          {participant.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span>{participant.name}</span>
                  </div>
                  <span className={`h-2 w-2 rounded-full ${participant.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                </DropdownMenuItem>
              ))
            ) : (
              <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                No participants yet
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <ThemeToggleButton
          randomize={true}
        />
        <ShareButton />
      </div>
    </header>
  );
}
