'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { LoaderIcon, Star } from 'lucide-react';
import { useRoomApi } from '@/app/api/room';
import { toast } from 'sonner';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  useSidebar,
} from '@/components/ui/sidebar';

import { ChatItem } from './app-sidebar';

interface RoomItemData {
  id: string;
  name: string;
  category: 'favorites' | 'public' | 'private';
  isPrivate: boolean;
  memberCount: number;
  isCreator: boolean;
}

export function SidebarHistory() {
  const { setOpenMobile } = useSidebar();
  const params = useParams();
  const id = params?.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState<RoomItemData[]>([]);
  const { getJoinedRooms } = useRoomApi();
  
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        const response = await getJoinedRooms();
        
        const formattedRooms = response.rooms.map((room: any) => {

          const category: 'favorites' | 'public' | 'private' = room.isPrivate ? 'private' : 'public';
          
          return {
            id: room.id,
            name: room.name,
            category,
            isPrivate: room.isPrivate,
            memberCount: room.memberCount,
            isCreator: room.isCreator
          };
        });
        
        setRooms(formattedRooms);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
        toast.error('Failed to load rooms');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRooms();
  }, []);

  const favoriteRooms: RoomItemData[] = [];
  const publicRooms = rooms.filter(room => !room.isPrivate);
  const privateRooms = rooms.filter(room => room.isPrivate);

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <div className="flex flex-col gap-4">
              {favoriteRooms.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-xs text-muted-foreground flex items-center gap-1">
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
                  <div className="px-2 py-1 text-xs text-muted-foreground">
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
                  <div className="px-2 py-1 text-xs text-muted-foreground">
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
        <div className="p-2 text-muted-foreground flex flex-row gap-2 items-center mt-8">
          <div className="animate-spin">
            <LoaderIcon className="size-4" />
          </div>
          <div>Loading rooms...</div>
        </div>
      )}
    </>
  );
}
