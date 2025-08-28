'use client';

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { useTheme } from 'next-themes';

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

interface SidebarUserNavProps {
  username?: string;
}

export function SidebarUserNav({ username }: SidebarUserNavProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const [displayName, setDisplayName] = useState<string>('Guest');
  const [avatarId, setAvatarId] = useState<string>('Roomble');
  const [mounted, setMounted] = useState(false);
  
  // Handle client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Update avatar ID when username changes
  useEffect(() => {
    if (username) {
      setDisplayName(username);
      setAvatarId(username);
    }
  }, [username]);

  // Return a simplified version during server-side rendering
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
                  src={`https://avatar.vercel.sh/${avatarId}`}
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
            <DropdownMenuItem
              data-testid="user-nav-item-theme"
              className="cursor-pointer"
              onSelect={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            >
              {`Toggle ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild data-testid="user-nav-item-auth">
              <button
                type="button"
                className="w-full cursor-pointer"
                onClick={() => {
                  // No authentication functionality needed for now
                  console.log('Authentication button clicked');
                }}
              >
                Login to your account
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
