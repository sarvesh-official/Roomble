'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MessageSquare, Shield, Zap, Share2, ArrowRight } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { generateRoomId } from '@/lib/utils';

export function LandingPage() {
  const router = useRouter();
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [roomIdInput, setRoomIdInput] = useState('');
  const [roomIdError, setRoomIdError] = useState('');
  const { resolvedTheme } = useTheme();
  const isDarkTheme = resolvedTheme === 'dark';
  const { theme } = useTheme();

  const handleCreateRoom = () => {
    setIsCreatingRoom(true);
    const roomId = generateRoomId();
    
    // Store username if provided in previous sessions
    const storedUsername = localStorage.getItem('roomble-username');
    if (!storedUsername) {
      // Set a default username if none exists
      localStorage.setItem('roomble-username', 'Guest-' + Math.floor(Math.random() * 1000));
    }
    
    setTimeout(() => {
      router.push(`/room/${roomId}`);
    }, 500);
  };

  return (
    <div className={`flex flex-col min-h-screen bg-${theme}-background`}>
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="size-8 overflow-hidden">
            <Image src="/icon.png" alt="Roomble" width={32} height={32} className="w-full h-full object-contain" />
          </div>
          <span className="font-semibold text-xl">Roomble</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <a href="#features">Features</a>
            </Button>
            <Button variant="ghost" asChild>
              <a href="#preview">Preview</a>
            </Button>
            <Button variant="ghost" asChild>
              <a href="#join">Join</a>
            </Button>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className={`container mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center bg-${theme}-background`}>
          <div className="size-24 mb-6">
            <Image src="/icon.png" alt="Roomble" width={96} height={96} className="w-full h-full object-contain" priority />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Conversations, Simplified.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-10">
            Create, join, and share rooms instantly. A new way to connect in real time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="sm:w-auto w-full gap-2 px-6"
              onClick={handleCreateRoom}
              disabled={isCreatingRoom}
            >
              {isCreatingRoom ? 'Creating...' : 'Create Room'}
              {/* {!isCreatingRoom && <ArrowRight size={16} />} */}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="sm:w-auto w-full gap-2 px-6"
              asChild
            >   
              <Link href="#join">Join Room</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-gradient-to-b from-muted/30 to-muted/50 py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center mb-16">
              <div className="size-12 mb-4">
                <Image src="/icon.png" alt="Roomble" width={48} height={48} className="w-full h-full object-contain" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-center">Why Roomble?</h2>
              <div className="h-1 w-20 bg-primary/70 rounded-full mt-6"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <div className="bg-card p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-primary/20 group">
                <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <Share2 size={28} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Instant Sharing</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Short sharable unique room IDs make it easy to invite others to join your conversations.
                </p>
              </div>
              
              <div className="bg-card p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-primary/20 group">
                <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <Zap size={28} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Real-time Chat</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Powered by WebSockets for instant message delivery with no delays or refreshing needed.
                </p>
              </div>
              
              <div className="bg-card p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-primary/20 group">
                <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <Shield size={28} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Secure & Private</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your conversations stay private and secure with no data stored permanently on our servers.
                </p>
              </div>
              
              <div className="bg-card p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-primary/20 group">
                <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <MessageSquare size={28} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Just Chat</h3>
                <p className="text-muted-foreground leading-relaxed">
                  No setup required. Join and start chatting immediately with a clean, distraction-free interface.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Preview Section */}
        <section id="preview" className="py-20 md:py-32 bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center mb-16">
              <div className="size-12 mb-4">
                <Image src="/icon.png" alt="Roomble" width={48} height={48} className="w-full h-full object-contain" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-center">See Roomble in Action</h2>
              <div className="h-1 w-20 bg-primary/70 rounded-full mt-6 mb-6"></div>
              <p className="text-center text-muted-foreground max-w-2xl mx-auto">
                A clean, intuitive interface designed for distraction-free conversations.
              </p>
            </div>
            
            {/* Main Chat Mockup */}
            <div className="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl border mb-16">
              <div className="aspect-[16/9] bg-black/5 flex items-center justify-center">
                <div className="w-full h-full relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full max-w-3xl h-[80%] bg-card rounded-lg shadow-lg border flex transition-colors duration-300">
                      {/* Sidebar mockup */}
                      <div className="hidden md:block w-64 border-r p-4 transition-colors duration-300" 
                        style={{ backgroundColor: isDarkTheme ? 'hsl(240 5.9% 10%)' : 'hsl(0 0% 98%)' }}>
                        <div className="flex items-center gap-2 mb-6">
                          <div className="size-6 overflow-hidden rounded-sm">
                            <div className="w-full h-full bg-contain bg-center bg-no-repeat" style={{ backgroundImage: "url('/icon.png')" }}></div>
                          </div>
                          <div className="h-4 w-24 bg-muted rounded"></div>
                        </div>
                        <div className="space-y-2">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-2 p-2 rounded bg-muted/50">
                              <div className="size-4 rounded-full bg-primary/20"></div>
                              <div className="h-3 w-20 bg-muted rounded"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Chat area mockup */}
                      <div className="flex-1 flex flex-col">
                        <div className="h-12 border-b flex items-center px-4">
                          <div className="h-4 w-32 bg-muted rounded"></div>
                        </div>
                        <div className="flex-1 p-4 space-y-4 overflow-hidden">
                          {[1, 2, 3].map(i => (
                            <div key={i} className={`max-w-[80%] ${i % 2 === 0 ? 'ml-auto' : ''} p-3 rounded-lg ${i % 2 === 0 ? 'bg-primary/10' : 'bg-muted'}`}>
                              <div className="h-3 w-16 bg-muted/50 rounded mb-2"></div>
                              <div className="space-y-1">
                                <div className="h-2 w-full bg-muted/50 rounded"></div>
                                <div className="h-2 w-[80%] bg-muted/50 rounded"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="h-14 border-t p-2">
                          <div className="h-full bg-muted/30 rounded-md w-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional Mockups */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-16">
              {/* Mobile View Mockup */}
              <div className="bg-card rounded-xl overflow-hidden shadow-lg border p-6 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <div className="size-5 overflow-hidden">
                    <Image src="/icon.png" alt="Roomble" width={20} height={20} className="w-full h-full object-contain" />
                  </div>
                  <span>Mobile Experience</span>
                </h3>
                <div className="aspect-[9/16] max-w-[240px] mx-auto rounded-xl overflow-hidden border shadow-md transition-colors duration-300" 
                  style={{ backgroundColor: isDarkTheme ? 'hsl(240 10% 3.9%)' : 'hsl(0 0% 100%)' }}>
                  <div className="h-8 bg-muted/30 border-b flex items-center justify-center gap-2">
                    <div className="size-4 overflow-hidden">
                      <div className="w-full h-full bg-contain bg-center bg-no-repeat" style={{ backgroundImage: "url('/icon.png')" }}></div>
                    </div>
                    <div className="w-16 h-1 bg-muted rounded-full"></div>
                  </div>
                  <div className="p-2 h-full">
                    <div className="space-y-2">
                      {[1, 2, 3].map(i => (
                        <div key={`mobile-${i}`} className={`max-w-[80%] ${i % 2 === 0 ? 'ml-auto' : ''} p-2 rounded-lg ${i % 2 === 0 ? 'bg-primary/10' : 'bg-muted'}`}>
                          <div className="h-2 w-12 bg-muted/50 rounded mb-1"></div>
                          <div className="space-y-1">
                            <div className="h-1.5 w-full bg-muted/50 rounded"></div>
                            <div className="h-1.5 w-[60%] bg-muted/50 rounded"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4 text-center">Fully responsive design for on-the-go conversations</p>
              </div>
              
              {/* Dark Mode Mockup */}
              <div className="bg-card rounded-xl overflow-hidden shadow-lg border p-6 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <div className="size-5 overflow-hidden">
                    <Image src="/icon.png" alt="Roomble" width={20} height={20} className="w-full h-full object-contain" />
                  </div>
                  <span>Dark Mode Support</span>
                </h3>
                <div className={`aspect-video rounded-xl overflow-hidden border shadow-md ${isDarkTheme ? 'bg-zinc-900' : 'bg-zinc-900'}`}>
                  <div className="h-10 border-b border-zinc-800 flex items-center px-4">
                    <div className="size-5 overflow-hidden mr-2">
                      <div className="w-full h-full bg-contain bg-center bg-no-repeat" style={{ backgroundImage: "url('/icon.png')" }}></div>
                    </div>
                    <div className="h-3 w-24 bg-zinc-800 rounded"></div>
                    <div className="ml-auto flex gap-2">
                      <div className="h-6 w-16 rounded bg-zinc-800"></div>
                      <div className="h-6 w-6 rounded bg-zinc-800"></div>
                    </div>
                  </div>
                  <div className="flex h-[calc(100%-2.5rem)]">
                    <div className="w-48 border-r border-zinc-800 p-3 space-y-2">
                      {[1, 2, 3].map(i => (
                        <div key={`sidebar-${i}`} className="h-8 rounded bg-zinc-800"></div>
                      ))}
                    </div>
                    <div className="flex-1 p-4 space-y-3">
                      {[1, 2].map(i => (
                        <div key={`dark-${i}`} className={`max-w-[60%] ${i % 2 === 0 ? 'ml-auto' : ''} p-2 rounded-lg ${i % 2 === 0 ? 'bg-indigo-900/30' : 'bg-zinc-800'}`}>
                          <div className="h-2 w-16 bg-zinc-700 rounded mb-2"></div>
                          <div className="space-y-1">
                            <div className="h-2 w-full bg-zinc-700 rounded"></div>
                            <div className="h-2 w-[80%] bg-zinc-700 rounded"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4 text-center">Easy on the eyes with automatic dark mode</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section id="join" className="bg-gradient-to-b from-muted/50 to-muted/30 py-24">
          <div className="container mx-auto px-4 text-center">
            <div className="flex flex-col items-center mb-12">
              <div className="size-12 mb-4">
                <Image src="/icon.png" alt="Roomble" width={48} height={48} className="w-full h-full object-contain" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">Start your first conversation today</h2>
              <div className="h-1 w-20 bg-primary/70 rounded-full mt-6 mb-6"></div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Join an existing room or create your own in seconds. No registration required.
              </p>
            </div>
            <div className="max-w-lg mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center">
                <Button 
                  size="lg" 
                  className="sm:w-auto w-full gap-2 px-6"
                  onClick={handleCreateRoom}
                  disabled={isCreatingRoom}
                >
                  {isCreatingRoom ? 'Creating...' : 'Create a Room'}
                  {!isCreatingRoom && <ArrowRight size={16} />}
                </Button>
                <div className="relative sm:w-56 w-full">
                  <input 
                    type="text" 
                    placeholder="Enter room ID" 
                    className={`w-full h-11 px-4 rounded-md border bg-background ${roomIdError ? 'border-destructive' : ''}`}
                    value={roomIdInput}
                    onChange={(e) => {
                      setRoomIdInput(e.target.value);
                      setRoomIdError('');
                    }}
                  />
                  {roomIdError && (
                    <p className="text-xs text-destructive mt-1">{roomIdError}</p>
                  )}
                  <Button 
                    size="sm" 
                    className="absolute right-1 top-1 bottom-1"
                    onClick={() => {
                      // Validate room ID
                      if (!roomIdInput.trim()) {
                        setRoomIdError('Please enter a room ID');
                        return;
                      }
                      
                      // Basic validation - alphanumeric and reasonable length
                      if (!/^[a-zA-Z0-9-_]{3,16}$/.test(roomIdInput.trim())) {
                        setRoomIdError('Invalid room ID format');
                        return;
                      }
                      
                      // Store username if provided in previous sessions
                      const storedUsername = localStorage.getItem('roomble-username');
                      if (!storedUsername) {
                        // Set a default username if none exists
                        localStorage.setItem('roomble-username', 'Guest-' + Math.floor(Math.random() * 1000));
                      }
                      
                      router.push(`/room/${roomIdInput.trim()}`);
                    }}
                  >
                    Join
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                No registration required. Just enter a room ID or create a new one.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted/20 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="size-8 overflow-hidden">
                <Image src="/icon.png" alt="Roomble" width={32} height={32} className="w-full h-full object-contain" />
              </div>
              <span className="font-medium">Roomble</span>
            </div>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="https://github.com/sarvesh-official/Roomble" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                GitHub
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
            <p>Community page coming soon — a place to discover and join open conversations.</p>
            <p className="mt-2">&copy; {new Date().getFullYear()} Roomble. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
