'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ThemeToggleButton } from '@/components/ui/theme-toggle-button';
import { UserDropdown } from '@/components/user-dropdown';
import { RoomNotifications } from '@/components/room-notification';

export function DashboardHeader() {
  const router = useRouter();
  
  return (
    <header className="border-b border-border/40 sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3 flex justify-between items-center">
        <div className="flex items-center gap-1.5 sm:gap-2 cursor-pointer" onClick={() => router.push('/')}>
          <div className="size-7 sm:size-8 overflow-hidden">
            <Image src="/icon.png" alt="Roomble" width={32} height={32} className="w-full h-full object-contain" />
          </div>
          <span className="font-semibold text-lg sm:text-xl">Roomble</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <RoomNotifications />
          <ThemeToggleButton randomize={true} />
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}
