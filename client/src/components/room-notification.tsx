'use client';

import { useState } from 'react';
import { Bell, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useRoomApi } from '@/app/api/room';
import { useRoomNotifications } from '@/hooks/useRoomNotifications';
import { Button } from './ui/button';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from './ui/card';
import { Badge } from './ui/badge';

export function RoomNotifications() {
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();
  const { joinRoom } = useRoomApi();
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
  const { notifications, dismissNotification, clearAllNotifications } = useRoomNotifications();

  const handleJoinRoom = async (roomId: string) => {
    try {
      setIsJoiningRoom(true);
      await joinRoom({ roomCode: roomId });
      router.push(`/room/${roomId}`);
      
      // Remove the notification after joining
      dismissNotification(roomId);
      
      // Close the notification panel
      setShowNotifications(false);
    } catch (error) {
      console.error('Failed to join room:', error);
      toast.error('Failed to join room. Please try again.');
    } finally {
      setIsJoiningRoom(false);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <Bell className="h-5 w-5" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
            {notifications.length}
          </span>
        )}
      </Button>

      {showNotifications && (
        <Card className="absolute right-0 top-full mt-2 w-80 z-50 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Room Notifications</CardTitle>
            <CardDescription className="text-xs">
              New public rooms you might want to join
            </CardDescription>
          </CardHeader>
          
          <CardContent className="max-h-[300px] overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-4">
                No new rooms available
              </p>
            ) : (
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className="flex items-start justify-between rounded-md border p-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{notification.name}</p>
                        <Badge variant="outline" className="text-[10px]">
                          {notification.isPublic ? 'Public' : 'Private'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Room ID: {notification.id}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => dismissNotification(notification.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          
          {notifications.length > 0 && (
            <CardFooter className="flex justify-between pt-0">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs"
                onClick={clearAllNotifications}
              >
                Clear all
              </Button>
            </CardFooter>
          )}
        </Card>
      )}
    </div>
  );
}
