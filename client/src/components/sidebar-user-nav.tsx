'use client';

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { useTheme } from 'next-themes';
import { SignOutButton, useUser } from '@clerk/nextjs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Image from 'next/image';

export function SidebarUserNav() {
  const { setTheme, resolvedTheme } = useTheme();
  const { user } = useUser();
  const [displayName, setDisplayName] = useState<string>('Guest');
  const [avatarId, setAvatarId] = useState<string>('Roomble');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      setDisplayName(user.fullName || user.username || user.firstName || '');
      setAvatarId(user.fullName || user.username || user.firstName || '');
    }
  }, [user]);

  if (!mounted) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            data-testid="user-nav-button"
            className="data-[state=open]:bg-sidebar-accent bg-background data-[state=open]:text-sidebar-accent-foreground h-10"
          >
            <div className="size-8 flex items-center rounded-full justify-center bg-sidebar-accent text-sidebar-foreground">
              <div className="size-6 rounded-full bg-sidebar-accent/50" />
            </div>
            <span data-testid="user-email" className="truncate">
              {displayName}
            </span>
            <ChevronUp className="ml-auto" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              data-testid="user-nav-button"
              className="data-[state=open]:bg-sidebar-accent bg-background data-[state=open]:text-sidebar-accent-foreground h-10"
            >
              <div className="size-8 flex items-center rounded-full justify-center bg-sidebar-accent text-sidebar-foreground">
                <Image
                  src={user?.imageUrl || `https://avatar.vercel.sh/${avatarId}`}
                  alt={displayName}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              </div>
              <span data-testid="user-email" className="truncate">
                {displayName}
              </span>
              <ChevronUp className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            data-testid="user-nav-menu"
            side="top"
            className="w-[--radix-popper-anchor-width]"
          >
            <DropdownMenuItem asChild data-testid="user-nav-item-auth">
              <div className="w-full cursor-pointer bg-red-600 hover:bg-red-700">
                <SignOutButton />
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
