'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ThemeToggleButton } from '@/components/ui/theme-toggle-button';
import { useUser, SignInButton } from '@clerk/nextjs';
import { AppSidebar } from '@/components/app-sidebar';
import { Messages } from '@/components/messages';
import { ChatInput } from '@/components/chat-input';
import { ChatHeader } from '@/components/chat-header';
import { useSocket } from '@/hooks/useSocket';
import { useMessageApi } from '@/app/api/message';
import { MessageProps } from '@/components/message';

export default function RoomPage() {
  
  const params = useParams();
  const socket = useSocket();
  // const router = useRouter();
  const { user, isLoaded: isUserLoaded } = useUser();
  const roomId = params?.id as string;
  const { getMessages, sendMessage } = useMessageApi();

  const [username, setUsername] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<MessageProps[]>([]);

  type Participant = {
    id: string;
    name: string;
    isActive: boolean;
    avatar: string | null;
  };


  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', name: 'Alex Smith', isActive: true, avatar: null },
    { id: '2', name: 'Jamie Doe', isActive: true, avatar: null },
    { id: '3', name: 'Taylor Wilson', isActive: false, avatar: null },
  ]);
  
  // Fetch messages from API
  const fetchMessages = useCallback(async () => {
    try {
      const response = await getMessages(roomId.toLowerCase());
      if (response && Array.isArray(response)) {
        interface ApiMessage {
          id: string;
          content: string;
          senderId: string;
          senderProfileUrl?: string;
          senderName: string;
          createdAt: string;
        }
        
        const formattedMessages = response.map((msg: ApiMessage) => ({
          id: msg.id,
          content: msg.content,
          role: user?.id === msg.senderId ? 'currentUser' as const : 'others' as const,
          profileUrl: msg.senderProfileUrl || '',
          username: msg.senderName,
          timestamp: new Date(msg.createdAt || Date.now())
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  }, [roomId, getMessages, user, setMessages]);
  
  useEffect(() => {
    if (roomId && isJoined) {
      fetchMessages();
    }
  }, [roomId, isJoined, fetchMessages]);

  useEffect(() => {
    if (user && username) {

      const userExists = participants.some(p => p.name === username);
      if (!userExists) {
        setParticipants(prev => [
          ...prev,
          { 
            id: user.id || 'current-user', 
            name: username, 
            isActive: true, 
            avatar: user.imageUrl || null 
          }
        ]);
      }
    }

  }, [user, username, participants]);

  useEffect(() => {

    if (isUserLoaded) {
      if (user) {
        
        setUsername(user.fullName || user.username || user.firstName || '');
        setIsJoined(true);
        setIsLoading(false);
      } else {

        const storedUsername = localStorage.getItem('roomble-username');
        if (storedUsername) {
          setUsername(storedUsername);
        }
        setIsLoading(false);
      }
    }
  }, [user, isUserLoaded]);

  useEffect(() => {
    if (!socket || !roomId) return;
    
    const lowerCaseRoomId = roomId.toLowerCase();
    socket.emit('join-room', lowerCaseRoomId);
    console.log('Joining room:', lowerCaseRoomId);
  
    const handleNewMessage = (message: { content: string; senderName: string; senderProfileUrl: string }) => {
      console.log('Received message:', message);
      const newMessage: MessageProps = {
        id: Date.now().toString(),
        content: message.content,
        role: username === message.senderName ? 'currentUser' as const : 'others' as const,
        profileUrl: message.senderProfileUrl || '',
        username: message.senderName,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
    };
    
    socket.on("message", handleNewMessage);
  
    return () => {
      socket.emit('leave-room', lowerCaseRoomId);
      socket.off("message", handleNewMessage);
    };
  }, [socket, roomId, username]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !roomId || !username) return;
    
    try {
      await sendMessage({
        roomId: roomId.toLowerCase(),
        content,
        senderId: user?.id || 'guest',
        senderName: username,
        senderProfileUrl: user?.imageUrl || ''
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };


  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem('roomble-username', username.trim());
      setIsJoined(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (!isJoined && !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="mx-auto w-full max-w-md space-y-6 rounded-lg border bg-card p-6 shadow-lg">
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="size-16">
                <Image src="/icon.png" alt="Roomble" width={64} height={64} className="w-full h-full object-contain" priority />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Join Room</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Room ID: <span className="font-mono font-medium">{roomId}</span>
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-medium">Sign in to join</h2>
                <p className="text-sm text-muted-foreground mt-1">Use your account for the best experience</p>
              </div>
              
              <div className="flex justify-center">
                <SignInButton>
                  <Button className="w-full">Sign In</Button>
                </SignInButton>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue as guest</span>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleJoinRoom} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium leading-none">
                  Your Name
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your name"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  required
                  autoFocus
                />
              </div>
              
              <Button type="submit" className="w-full" variant="outline">
                Join as Guest
              </Button>
            </form>
          </div>

          <div className="flex flex-col items-center gap-4">
            <Link 
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to Home
            </Link>
            <div className="mt-2">
              <ThemeToggleButton randomize={true} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <AppSidebar username={username} />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <ChatHeader 
            participants={participants} 
          />
          <div className="flex-1 min-h-0 overflow-auto relative bg-background">
            <div className="mx-auto w-full md:max-w-2xl lg:max-w-2xl xl:max-w-3xl">
              <Messages 
                messages={messages} 
                isTyping={false} 
                roomName={roomId}
                isPrivate={false}
              />
            </div>
          </div>
          <div className="p-4 sticky bottom-0 z-10">
            <div className="mx-auto w-full md:max-w-2xl lg:max-w-2xl xl:max-w-3xl">
              <ChatInput onSend={handleSendMessage} isDisabled={false} />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
