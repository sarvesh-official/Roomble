'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Hash, Lock, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { SidebarHistory } from './sidebar-history';
import { SidebarUserNav } from './sidebar-user-nav';

interface AppSidebarProps {
  username?: string;
}

export function AppSidebar({ username }: AppSidebarProps) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar className="group-data-[side=left]:border-r-0 bg-sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-row justify-between items-center">
            <Link
              href="/"
              onClick={() => {
                setOpenMobile(false);
              }}
              className="flex flex-row gap-3 items-center"
            >
              <div className="flex items-center gap-2">
                <div className="size-6 overflow-hidden">
                  <Image src="/icon.png" alt="Roomble" width={24} height={24} className="w-full h-full object-contain" />
                </div>
                <span className="text-lg font-semibold hover:bg-sidebar-accent rounded-md cursor-pointer text-sidebar-foreground">
                  Roomble
                </span>
              </div>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  type="button"
                  className="p-2 h-fit text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
                  onClick={() => {
                    setOpenMobile(false);
                    router.push('/');
                    router.refresh();
                  }}
                >
                  <div className="size-5 overflow-hidden">
                    <Image src="/icon.png" alt="New Room" width={20} height={20} className="w-full h-full object-contain" />
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent align="end">New Room</TooltipContent>
            </Tooltip>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarHistory />
      </SidebarContent>
      <SidebarFooter>
        <SidebarUserNav username={username} />
      </SidebarFooter>
    </Sidebar>
  );
}

export function ChatItem({
  id,
  name,
  active,
  onClick,
  isPrivate = false,
  memberCount = 0,
}: {
  id: string;
  name: string;
  active: boolean;
  onClick: () => void;
  isPrivate?: boolean;
  memberCount?: number;
}) {
  return (
    <Link
      href={`/room/${id}`}
      onClick={onClick}
      className={`flex items-center gap-2 p-2 rounded-md transition-colors ${active ? 'bg-sidebar-accent text-sidebar-foreground' : 'text-muted-foreground hover:text-sidebar-foreground'}`}
    >
      <div className="flex-shrink-0">
        {isPrivate ? <Lock className="h-4 w-4" /> : <Hash className="h-4 w-4" />}
      </div>
      <div className="w-full overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-sm truncate">{name}</span>
          {memberCount > 0 && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Users className="h-3 w-3 mr-1" />
              <span>{memberCount}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
