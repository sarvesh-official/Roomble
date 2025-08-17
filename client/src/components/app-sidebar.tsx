'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MessageSquarePlus, Hash, Lock, Users } from 'lucide-react';

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

export function AppSidebar() {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar className="group-data-[side=left]:border-r-0 bg-black">
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
              <span className="text-lg font-semibold px-2 hover:bg-zinc-900 rounded-md cursor-pointer text-white">
                Roomble
              </span>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  type="button"
                  className="p-2 h-fit text-zinc-400 hover:text-white hover:bg-zinc-900"
                  onClick={() => {
                    setOpenMobile(false);
                    router.push('/');
                    router.refresh();
                  }}
                >
                  <MessageSquarePlus className="h-5 w-5" />
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
        <SidebarUserNav />
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
      className={`flex items-center gap-2 p-2 rounded-md transition-colors ${active ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
    >
      <div className="flex-shrink-0">
        {isPrivate ? <Lock className="h-4 w-4" /> : <Hash className="h-4 w-4" />}
      </div>
      <div className="w-full overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-sm truncate">{name}</span>
          {memberCount > 0 && (
            <div className="flex items-center text-xs text-zinc-500">
              <Users className="h-3 w-3 mr-1" />
              <span>{memberCount}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
