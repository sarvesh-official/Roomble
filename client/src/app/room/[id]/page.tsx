'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
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
  const { socket } = useSocket();
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


  const [participants, setParticipants] = useState<Participant[]>([]);
  
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      setIsLoadingMessages(true);
      const response = await getMessages(roomId.toLowerCase());
      
      if (response && response.messages) {
        interface ApiMessage {
          id: string;
          content: string;
          senderId: string;
          senderProfileUrl?: string;
          senderName: string;
          createdAt: string;
        }
        
        const formattedMessages = response.messages.map((msg: ApiMessage) => ({
          id: msg.id,
          content: msg.content,
          role: user?.id === msg.senderId ? 'currentUser' as const : 'others' as const,
          profileUrl: msg.senderProfileUrl || '',
          username: msg.senderName,
          timestamp: new Date(msg.createdAt || Date.now())
        }));
        setMessages(formattedMessages);
      } else if (response && Array.isArray(response)) {
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
      
      if (response && response.participants && Array.isArray(response.participants)) {
        setParticipants(response.participants);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setIsLoadingMessages(false);
    }

  }, [roomId, getMessages, user]);
  
  useEffect(() => {
    let isMounted = true;
    if (roomId && isJoined && isMounted) {
      fetchMessages();
    }
    return () => { isMounted = false; };
  }, [roomId, isJoined]);

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
  }, [username]);

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

  }, [isUserLoaded, user?.id]);

  useEffect(() => {
    if (!socket || !roomId) {
      console.log('Room page: Missing socket or roomId', { socketExists: !!socket, roomId });
      return;
    }
    
    // Clean up previous listeners before setting up new ones
    socket.off("message");
    socket.off("participant-joined");
    socket.off("participant-left");
    socket.off("room-participants");
    
    const lowerCaseRoomId = roomId.toLowerCase();
    console.log('Room page: Joining room', lowerCaseRoomId);
    
    socket.emit('join-room', lowerCaseRoomId, {
      userId: user?.id || 'guest-' + Date.now(),
      name: username,
      avatar: user?.imageUrl || null
    });
    
    // Request current participants list
    socket.emit('get-participants', lowerCaseRoomId);
  
    const handleNewMessage = (message: { content: string; senderName: string; senderProfileUrl: string; senderId: string }) => {
      console.log('Room page: Received message:', message);
      
      // Skip messages from the current user to prevent duplicates
      // The current user's messages are already added in handleSendMessage
      if (user?.id === message.senderId) {
        return;
      }
      
      const newMessage: MessageProps = {
        id: Date.now().toString(),
        content: message.content,
        role: 'others' as const, // Always 'others' since we're filtering out current user messages
        profileUrl: message.senderProfileUrl || '',
        username: message.senderName,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
    };
    
    const handleParticipantJoined = (participant: Participant) => {
      console.log('Room page: Participant joined:', participant);
      setParticipants(prev => {
        // Check if participant already exists
        if (prev.some(p => p.id === participant.id)) {
          return prev.map(p => p.id === participant.id ? {...p, isActive: true} : p);
        }
        return [...prev, participant];
      });
    };
    
    const handleParticipantLeft = (participantId: string) => {
      console.log('Room page: Participant left:', participantId);
      setParticipants(prev => 
        prev.map(p => p.id === participantId ? {...p, isActive: false} : p)
      );
    };
    
    const handleRoomParticipants = (roomParticipants: Participant[]) => {
      console.log('Room page: Room participants:', roomParticipants);
      setParticipants(roomParticipants);
    };
    
    // Set up event listeners
    socket.on("message", handleNewMessage);
    socket.on("participant-joined", handleParticipantJoined);
    socket.on("participant-left", handleParticipantLeft);
    socket.on("room-participants", handleRoomParticipants);
    
    // Handle reconnection
    const handleReconnect = () => {
      console.log('Room page: Socket reconnected, rejoining room', lowerCaseRoomId);
      socket.emit('join-room', lowerCaseRoomId, {
        userId: user?.id || 'guest-' + Date.now(),
        name: username,
        avatar: user?.imageUrl || null
      });
    };
    
    socket.on("connect", handleReconnect);

    return () => {
      console.log('Room page: Cleaning up socket listeners');
      socket.emit('leave-room', lowerCaseRoomId);
      socket.off("message", handleNewMessage);
      socket.off("participant-joined", handleParticipantJoined);
      socket.off("participant-left", handleParticipantLeft);
      socket.off("room-participants", handleRoomParticipants);
      socket.off("connect", handleReconnect);
    };
  }, [socket, roomId, user?.id, username]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !roomId || !username) return;
    
    const newMessageId = Date.now().toString();
    const newMessage: MessageProps = {
      id: newMessageId,
      content: content.trim(),
      role: 'currentUser',
      username: username,
      profileUrl: user?.imageUrl || '',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    try {
      await sendMessage({
        roomId: roomId.toLowerCase(),
        content: content.trim(),
        senderId: user?.id || 'guest',
        senderName: username,
        senderProfileUrl: user?.imageUrl || ''
      });
    } catch (error) {
      console.error('Failed to send message:', error);

      setMessages(prev => prev.filter(msg => msg.id !== newMessageId));
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
          <div className="flex-1 min-h-0 overflow-hidden relative bg-background">
            <div className="h-full overflow-auto" id="messages-scroll-container">
              <div className="mx-auto w-full md:max-w-2xl lg:max-w-2xl xl:max-w-3xl">
                {isLoadingMessages && messages.length === 0 && (
                  <div className="flex justify-center items-center p-4">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      <span className="text-sm text-muted-foreground ml-2">Loading messages...</span>
                    </div>
                  </div>
                )}
                <Messages 
                  messages={messages} 
                  isTyping={false} 
                  roomName={roomId}
                  isPrivate={false}
                />
              </div>
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
