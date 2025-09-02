'use client';

import { useState, useEffect } from 'react';
import { useSocket } from './useSocket';

interface RoomNotification {
  id: string;
  name: string;
  isPublic: boolean;
  timestamp: Date;
}

export function useRoomNotifications() {
  const [notifications, setNotifications] = useState<RoomNotification[]>([]);
  const { socket } = useSocket();

  useEffect(() => {
    console.log('useRoomNotifications: Socket state:', socket ? 'connected' : 'not connected');
    
    if (!socket) {
      console.warn('useRoomNotifications: No socket connection available');
      return;
    }

    if (!socket.connected) {
      console.log('useRoomNotifications: Socket not connected, attempting to connect');
      socket.connect();
    }

    const handleNewRoom = (data: { id: string; name: string; isPublic: boolean }) => {
      console.log('useRoomNotifications: Received new-room event:', data);

      setNotifications(prev => {

        const exists = prev.some(n => n.id === data.id);
        if (exists) {
          console.log('useRoomNotifications: Notification already exists, skipping');
          return prev;
        }
        
        console.log('useRoomNotifications: Adding new notification');
        return [
          ...prev,
          {
            id: data.id,
            name: data.name,
            isPublic: data.isPublic,
            timestamp: new Date()
          }
        ];
      });
    };


    socket.off('new-room');
    
    console.log('useRoomNotifications: Setting up new-room listener');
    socket.on('new-room', handleNewRoom);
    

    const handleConnect = () => {
      console.log('useRoomNotifications: Socket reconnected');
    };
    
    socket.off('connect');
    socket.on('connect', handleConnect);


    socket.emit('ping', { timestamp: new Date().toISOString() });

    return () => {
      console.log('useRoomNotifications: Cleaning up event listeners');
      if (socket) {
        socket.off('new-room', handleNewRoom);
        socket.off('connect', handleConnect);
      }
    };
  }, [socket]);

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    dismissNotification,
    clearAllNotifications
  };
}
