'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Check, ChevronDown, Settings, Users, Bell, BellOff } from 'lucide-react';

// Define available room settings
const roomSettings = [
  {
    id: 'invite',
    name: 'Invite People',
    description: 'Add people to this room',
    icon: <Users className="h-4 w-4 mr-2" />
  },
  {
    id: 'notifications',
    name: 'Notifications',
    description: 'Manage notification settings',
    icon: <Bell className="h-4 w-4 mr-2" />
  },
  {
    id: 'mute',
    name: 'Mute Room',
    description: 'Turn off notifications for this room',
    icon: <BellOff className="h-4 w-4 mr-2" />
  }
];

export function RoomSettings({
  className,
}: React.ComponentProps<typeof Button>) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        asChild
        className={cn(
          'w-fit data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
          className,
        )}
      >
        <Button
          variant="outline"
          size="sm"
          className="md:px-2 md:h-[34px] px-1 h-8"
        >
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline ml-2">Room Settings</span>
          <ChevronDown className="ml-1 sm:ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[300px]">
        {roomSettings.map((setting) => {
          const { id } = setting;

          return (
            <DropdownMenuItem
              key={id}
              onSelect={() => {
                setOpen(false);
                // Handle setting selection
                console.log(`Selected setting: ${id}`);
              }}
              className="gap-4 group/item flex flex-row justify-between items-center w-full"
            >
              <div className="flex items-center">
                {setting.icon}
                <div className="flex flex-col gap-1 items-start">
                  <div>{setting.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {setting.description}
                  </div>
                </div>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
