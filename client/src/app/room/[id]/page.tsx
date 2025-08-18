'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChatLayout } from '@/components/chat-layout';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ThemeToggleButton } from '@/components/ui/theme-toggle-button';

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params?.id as string;
  
  const [username, setUsername] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if username exists in localStorage
    const storedUsername = localStorage.getItem('roomble-username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    setIsLoading(false);
  }, []);

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      // Save username to localStorage
      localStorage.setItem('roomble-username', username.trim());
      setIsJoined(true);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  // Show username input if not joined
  if (!isJoined) {
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
            
            <Button type="submit" className="w-full">
              Join Room
            </Button>
          </form>

          <div className="flex flex-col items-center gap-4">
            <Link 
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to Home
            </Link>
            <div className="mt-2">
            <ThemeToggleButton variant="gif" url="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWI1ZmNvMGZyemhpN3VsdWp4azYzcWUxcXIzNGF0enp0eW1ybjF0ZyZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/Fa6uUw8jgJHFVS6x1t/giphy.gif" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show chat interface once joined
  return (
    <SidebarProvider>
      <ChatLayout />
    </SidebarProvider>
  );
}
