'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { generateRoomId } from '@/lib/utils';
import { WhyRoomble } from "./why-roomble";
import FeatureSection from "./feature-section";
import { GlobalConnectivityBento } from "./global-connectivity-bento";
import { GradientBars } from '@/components/ui/gradient-bars';
import { TextReveal } from '@/components/ui/text-reveal';
import { ContainerTextFlip } from '@/components/ui/container-text-flip';
import { ThemeToggleButton } from './ui/theme-toggle-button';
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";

export function LandingPage() {
  const router = useRouter();
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [roomIdInput, setRoomIdInput] = useState('');
  const [roomIdError, setRoomIdError] = useState('');
  const { resolvedTheme } = useTheme();
  const isDarkTheme = resolvedTheme === 'dark';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const navItems = [
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "Join",
      link: "#join",
    },
    {
      name: "Community",
      link: "/community",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header with Resizable Navbar */}
      <Navbar className="top-0">
        {/* Desktop Navigation */}
        <NavBody>
          <div className="flex items-center gap-2">
            <div className="size-8 overflow-hidden">
              <Image src="/icon.png" alt="Roomble" width={32} height={32} className="w-full h-full object-contain" />
            </div>
            <span className="font-semibold text-xl">Roomble</span>
          </div>
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <ThemeToggleButton randomize={true} />
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <div className="flex items-center gap-2">
              <div className="size-8 overflow-hidden">
                <Image src="/icon.png" alt="Roomble" width={32} height={32} className="w-full h-full object-contain" />
              </div>
              <span className="font-semibold text-xl">Roomble</span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggleButton randomize={true} />
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </div>
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden h-screen flex items-center justify-center">
          <GradientBars />
          <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center">
            <div className="size-24 mb-6">
              <Image src="/icon.png" alt="Roomble" width={96} height={96} className="w-full h-full object-contain" priority />
            </div>
            <TextReveal>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Conversations, <ContainerTextFlip words={["Simplified", "Connected", "Instant", "Seamless"]} />
              </h1>
            </TextReveal>
            <TextReveal delay={0.7}>
              <p className="text-xl text-muted-foreground max-w-2xl mb-10">
                Create, join, and share rooms instantly. A new way to connect in real time.
              </p>
            </TextReveal>
            <TextReveal delay={0.9}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="sm:w-auto w-full gap-2 px-6"
                  onClick={handleCreateRoom}
                  disabled={isCreatingRoom}
                >
                  {isCreatingRoom ? 'Creating...' : 'Create Room'}
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
            </TextReveal>
          </div>
        </section>

        {/* Features Section */}
        <WhyRoomble />
        
        {/* Global Connectivity Section */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Global Connectivity</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Connect with people from around the world using Roomble's seamless communication platform.
              </p>
            </div>
            
            <GlobalConnectivityBento />
          </div>
        </section>

        {/* Feature Section */}
        <FeatureSection />
        
        {/* See in Action Section */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-40 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 right-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col items-center mb-16">
              <div className="bg-primary/10 text-primary shadow-primary/10 group-hover:bg-primary/20 group-hover:shadow-primary/20 mb-4 flex h-16 w-16 items-center justify-center rounded-full shadow transition-all duration-500">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-primary/20 animate-ping opacity-75"></div>
                  <Image src="/icon.png" alt="Roomble" width={48} height={48} className="relative z-10 w-full h-full object-contain" />
                </div>
              </div>
              <div className="relative">
                <h2 className="text-4xl font-bold mb-4 relative z-10">See Roomble in Action</h2>
                <div className="absolute -bottom-3 left-0 right-0 h-3 bg-primary/20 -z-10 transform skew-x-12"></div>
              </div>
              <div className="h-1 w-24 bg-gradient-to-r from-primary/30 to-primary/70 rounded-full my-6"></div>
              <p className="text-muted-foreground max-w-2xl text-center text-lg">
                Experience the simplicity and power of Roomble's real-time collaboration. 
                <span className="text-primary font-medium">Connect instantly</span> with anyone, anywhere.
              </p>
            </div>
            
            {/* Chat Mockup */}
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
                <div className="aspect-video rounded-xl overflow-hidden border shadow-md transition-colors duration-300"
                  style={{ backgroundColor: isDarkTheme ? 'hsl(240 10% 3.9%)' : 'hsl(0 0% 100%)' }}>
                  <div className="h-10 border-b flex items-center px-4 transition-colors duration-300"
                    style={{ borderColor: isDarkTheme ? 'hsl(240 3.7% 15.9%)' : 'hsl(240 5.9% 90%)' }}>
                    <div className="size-5 overflow-hidden mr-2">
                      <div className="w-full h-full bg-contain bg-center bg-no-repeat" style={{ backgroundImage: "url('/icon.png')" }}></div>
                    </div>
                    <div className="h-3 w-24 rounded transition-colors duration-300"
                      style={{ backgroundColor: isDarkTheme ? 'hsl(240 3.7% 15.9%)' : 'hsl(240 4.8% 95.9%)' }}></div>
                    <div className="ml-auto flex gap-2">
                      <div className="h-6 w-16 rounded transition-colors duration-300"
                        style={{ backgroundColor: isDarkTheme ? 'hsl(240 3.7% 15.9%)' : 'hsl(240 4.8% 95.9%)' }}></div>
                      <div className="h-6 w-6 rounded transition-colors duration-300"
                        style={{ backgroundColor: isDarkTheme ? 'hsl(240 3.7% 15.9%)' : 'hsl(240 4.8% 95.9%)' }}></div>
                    </div>
                  </div>
                  <div className="flex h-[calc(100%-2.5rem)]">
                    <div className="w-48 border-r p-3 space-y-2 transition-colors duration-300"
                      style={{ borderColor: isDarkTheme ? 'hsl(240 3.7% 15.9%)' : 'hsl(240 5.9% 90%)' }}>
                      {[1, 2, 3].map(i => (
                        <div key={`sidebar-${i}`} className="h-8 rounded transition-colors duration-300"
                          style={{ backgroundColor: isDarkTheme ? 'hsl(240 3.7% 15.9%)' : 'hsl(240 4.8% 95.9%)' }}></div>
                      ))}
                    </div>
                    <div className="flex-1 p-4 space-y-3">
                      {[1, 2].map(i => (
                        <div key={`dark-${i}`} className={`max-w-[60%] ${i % 2 === 0 ? 'ml-auto' : ''} p-2 rounded-lg transition-colors duration-300`}
                          style={{ backgroundColor: i % 2 === 0 
                            ? (isDarkTheme ? 'rgba(67, 56, 202, 0.3)' : 'rgba(79, 70, 229, 0.1)') 
                            : (isDarkTheme ? 'hsl(240 3.7% 15.9%)' : 'hsl(240 4.8% 95.9%)') }}>
                          <div className="h-2 w-16 rounded mb-2 transition-colors duration-300"
                            style={{ backgroundColor: isDarkTheme ? 'hsl(240 5% 26%)' : 'hsl(240 5% 64.9%)' }}></div>
                          <div className="space-y-1">
                            <div className="h-2 w-full rounded transition-colors duration-300"
                              style={{ backgroundColor: isDarkTheme ? 'hsl(240 5% 26%)' : 'hsl(240 5% 64.9%)' }}></div>
                            <div className="h-2 w-[80%] rounded transition-colors duration-300"
                              style={{ backgroundColor: isDarkTheme ? 'hsl(240 5% 26%)' : 'hsl(240 5% 64.9%)' }}></div>
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
              <Link href="/theme-toggle-demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Theme Toggle Demo
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
