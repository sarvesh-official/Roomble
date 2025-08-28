'use client';

import { useClerk, useUser } from '@clerk/nextjs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function UserDropdown() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
        <Avatar className="h-9 w-9">
          <AvatarImage src={isLoaded ? user?.imageUrl : "/icon.png"} alt="Profile" />
          <AvatarFallback>{isLoaded && user?.firstName ? user.firstName[0] : "U"}</AvatarFallback>
        </Avatar>
        <span className="hidden md:inline-block font-medium text-sm">
          {isLoaded ? user?.firstName || "User" : "Loading..."}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{isLoaded ? user?.fullName : "Loading..."}</p>
            <p className="text-xs text-muted-foreground truncate">
              {isLoaded ? user?.emailAddresses[0]?.emailAddress : "Loading..."}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={() => signOut()}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserDropdown;
