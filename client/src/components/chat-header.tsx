'use client';


import { useRouter } from 'next/navigation';
import { useWindowSize } from 'react-use';
import Image from 'next/image';

import { RoomSettings } from '@/components/room-settings';
import { ShareButton } from '@/components/share-button';
import { SidebarToggle } from '@/components/sidebar-toggle';
import { Button } from '@/components/ui/button';
import { useSidebar } from './ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { VisibilitySelector } from './visibility-selector';
import { Users } from 'lucide-react';

interface ChatHeaderProps {
  memberCount?: number;
}

export function ChatHeader({ memberCount = 24 }: ChatHeaderProps) {
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
        <div className="flex items-center gap-1 text-sm text-zinc-400">
          <Users className={isMobile ? "h-4 w-4" : "h-5 w-5"} />
          <span>{memberCount}</span>
        </div>
        
        <ShareButton />
      </div>
    </header>
  );
}
