'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarToggle } from '@/components/sidebar-toggle';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { generateMessageId, formatTime } from '@/lib/utils';

interface Message {
  id: string;
  username: string;
  content: string;
  timestamp: Date;
  type?: 'user' | 'system';
}

export default function RoomPage() {
  const params = useParams();
  const roomId = params.id as string;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isJoined, setIsJoined] = useState(false);

  const addMessage = (content: string, type: 'user' | 'system' = 'user') => {
    if (!content.trim()) return;
    
    const message: Message = {
      id: generateMessageId(),
      username: type === 'system' ? 'System' : username.trim(),
      content: content.trim(),
      timestamp: new Date(),
      type,
    };
    
    setMessages(prev => [...prev, message]);
    if (type === 'user') {
      setNewMessage('');
    }
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setIsJoined(true);
      addMessage(`${username.trim()} joined the room`, 'system');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && username.trim()) {
      addMessage(newMessage);
    }
  };

  // Join room UI using the same design system
  if (!isJoined) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="mx-auto w-full max-w-md space-y-6 rounded-lg border bg-card p-6 shadow-lg">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Join Room</h1>
            <p className="text-sm text-muted-foreground">
              Room ID: <span className="font-mono font-medium">{roomId}</span>
            </p>
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
              />
            </div>
            
            <Button type="submit" className="w-full">
              Join Room
            </Button>
          </form>

          <div className="text-center">
            <Link 
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Chat room UI using the same layout as the AI chatbot
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <AppSidebar />
        
        <div className="flex flex-col w-full">
          {/* Header matching the AI chat header */}
          <header className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <SidebarToggle />
              <div className="flex flex-col">
                <h1 className="text-lg font-semibold">🚪 Room {roomId}</h1>
                <p className="text-sm text-muted-foreground">Welcome, {username}!</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(window.location.href)}
              >
                📋 Copy Link
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  Leave Room
                </Link>
              </Button>
            </div>
          </header>

          {/* Messages area */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center space-y-2">
                    <h2 className="text-xl font-medium">Ready to chat!</h2>
                    <p className="text-muted-foreground">
                      Send your first message to get the conversation started.
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`rounded-lg border p-4 ${
                      message.type === 'system' 
                        ? 'bg-muted/50 border-muted' 
                        : 'bg-card'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium text-sm ${
                        message.type === 'system' 
                          ? 'text-muted-foreground' 
                          : 'text-foreground'
                      }`}>
                        {message.username}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm">{message.content}</p>
                  </div>
                ))
              )}
            </div>

            {/* Message input matching the AI chat input */}
            <div className="border-t p-4">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <Button type="submit">
                  Send
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
