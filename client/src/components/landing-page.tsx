'use client';

import { useState, useEffect } from 'react';
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
import { AppFlowTimeline } from './app-flow-timeline';
import { AvatarStack } from '@/components/ui/avatar-stack';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
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
  const [mounted, setMounted] = useState(false);
  
  // Set mounted state after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

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
                Connect with people from around the world using Roomble&apos;s seamless communication platform.
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
            <div className="flex flex-col items-center mb-8">
              <div className="relative size-12 mb-6">
                <div className="absolute -inset-1 rounded-full bg-primary/20 animate-ping opacity-75"></div>
                <Image src="/icon.png" alt="Roomble" width={48} height={48} className="relative z-10 w-full h-full object-contain" />
              </div>
              <div className="relative">
                <h2 className="text-4xl font-bold mb-4 relative z-10">Roomble in Action</h2>
                <div className="absolute -bottom-3 left-0 right-0 h-3 bg-primary/20 -z-10 transform skew-x-12"></div>
              </div>
              <div className="h-1 w-24 bg-gradient-to-r from-primary/30 to-primary/70 rounded-full my-6"></div>
              <p className="text-muted-foreground max-w-2xl text-center text-lg mb-2">
                Experience the simplicity and power of Roomble&apos;s real-time collaboration. 
                <span className="text-primary font-medium"> Connect instantly</span> with anyone, anywhere.
              </p>
              <p className="text-primary/80 font-medium text-lg mb-8">
                Follow the journey of how users interact with Roomble from start to finish
              </p>
            </div>
            
            {/* App Flow Timeline */}
            <div className="max-w-6xl mx-auto mb-16">
              <AppFlowTimeline />
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
          
          <div className="mt-8 pt-6 border-t">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-muted-foreground">
                <p>Community page coming soon — a place to discover and join open conversations.</p>
                <p className="mt-2">© {new Date().getFullYear()} Roomble. All rights reserved.</p>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Created by:</span>
                <div className="scale-90 origin-right">
                  <AvatarStack animate>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Avatar className="cursor-pointer">
                          <AvatarImage src="/profilepic.jpg" />
                          <AvatarFallback>S</AvatarFallback>
                        </Avatar>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-60">
                        <div className="flex justify-between space-x-4">
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold">Sarvesh</h4>
                            <p className="text-xs text-muted-foreground">SDE Intern at Lowe&apos;s</p>
                            <div className="flex items-center pt-2 space-x-2">
                              <a
                                href="https://github.com/sarvesh-official"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1 rounded-full transition-colors"
                              >
                                GitHub
                              </a>
                              <a
                                href="https://sarvee.dev"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs bg-muted hover:bg-muted/80 px-3 py-1 rounded-full transition-colors"
                              >
                                Portfolio
                              </a>
                            </div>
                          </div>
                          <div className="h-12 w-12 rounded-full overflow-hidden">
                            <img src="/profilepic.jpg" alt="Sarvesh" className="object-cover w-full h-full" />
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </AvatarStack>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
