'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { LoaderIcon, Star } from 'lucide-react';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  useSidebar,
} from '@/components/ui/sidebar';

// Import the ChatItem component from app-sidebar.tsx
import { ChatItem } from './app-sidebar';

// Mock data for room list
interface RoomItemData {
  id: string;
  name: string;
  category: 'favorites' | 'public' | 'private';
  isPrivate: boolean;
  memberCount: number;
}

const mockRooms: RoomItemData[] = [
  { id: '1', name: 'General', category: 'favorites', isPrivate: false, memberCount: 24 },
  { id: '2', name: 'Design Team', category: 'favorites', isPrivate: true, memberCount: 8 },
  { id: '3', name: 'Development', category: 'public', isPrivate: false, memberCount: 16 },
  { id: '4', name: 'Marketing', category: 'public', isPrivate: false, memberCount: 12 },
  { id: '5', name: 'Project Alpha', category: 'private', isPrivate: true, memberCount: 5 },
  { id: '6', name: 'Secret Room', category: 'private', isPrivate: true, memberCount: 3 },
];

export function SidebarHistory() {
  const { setOpenMobile } = useSidebar();
  const params = useParams();
  const id = params?.id as string;
  const [isLoading, setIsLoading] = useState(false);

  // Filter rooms by category
  const favoriteRooms = mockRooms.filter(room => room.category === 'favorites');
  const publicRooms = mockRooms.filter(room => room.category === 'public');
  const privateRooms = mockRooms.filter(room => room.category === 'private');

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <div className="flex flex-col gap-4">
              {favoriteRooms.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-xs text-zinc-500 flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    <span>Favorites</span>
                  </div>
                  {favoriteRooms.map((room) => (
                    <ChatItem
                      key={room.id}
                      id={room.id}
                      name={room.name}
                      active={room.id === id}
                      isPrivate={room.isPrivate}
                      memberCount={room.memberCount}
                      onClick={() => setOpenMobile(false)}
                    />
                  ))}
                </div>
              )}
              
              {publicRooms.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-xs text-zinc-500">
                    Public Rooms
                  </div>
                  {publicRooms.map((room) => (
                    <ChatItem
                      key={room.id}
                      id={room.id}
                      name={room.name}
                      active={room.id === id}
                      isPrivate={room.isPrivate}
                      memberCount={room.memberCount}
                      onClick={() => setOpenMobile(false)}
                    />
                  ))}
                </div>
              )}
              
              {privateRooms.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-xs text-zinc-500">
                    Private Rooms
                  </div>
                  {privateRooms.map((room) => (
                    <ChatItem
                      key={room.id}
                      id={room.id}
                      name={room.name}
                      active={room.id === id}
                      isPrivate={room.isPrivate}
                      memberCount={room.memberCount}
                      onClick={() => setOpenMobile(false)}
                    />
                  ))}
                </div>
              )}
            </div>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      {isLoading && (
        <div className="p-2 text-zinc-500 flex flex-row gap-2 items-center mt-8">
          <div className="animate-spin">
            <LoaderIcon className="size-4" />
          </div>
          <div>Loading rooms...</div>
        </div>
      )}
    </>
  );
}
