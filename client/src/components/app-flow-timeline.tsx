'use client';

import React from "react";
import Image from 'next/image';
import { Timeline } from "@/components/ui/timeline";
import { cn } from "@/lib/utils";

export function AppFlowTimeline() {
  const data = [
    {
      title: "Create a Room",
      content: (
        <div>
          <p className="mb-6 text-sm font-normal text-muted-foreground md:text-base">
            Start by creating your own room with a single click. No registration required - get started instantly.
          </p>
          <div className="rounded-lg overflow-hidden border shadow-md bg-card">
            <div className="p-4 border-b flex items-center gap-2">
              <div className="size-6 overflow-hidden">
                <Image src="/icon.png" alt="Roomble" width={24} height={24} className="w-full h-full object-contain" />
              </div>
              <span className="font-medium">Room Creation</span>
            </div>
            <div className="p-6 flex flex-col items-center justify-center">
              <div className="size-12 mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <div className="size-6 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>
              </div>
              <div className="h-10 w-40 bg-primary/20 rounded-md flex items-center justify-center">
                <span className="text-sm font-medium">Create Room</span>
              </div>
              <div className="mt-6 flex items-center gap-2">
                <div className="h-1 w-3 rounded-full bg-primary/40"></div>
                <div className="h-1 w-20 rounded-full bg-primary/20"></div>
                <div className="h-1 w-3 rounded-full bg-primary/40"></div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Join the Conversation",
      content: (
        <div>
          <p className="mb-6 text-sm font-normal text-muted-foreground md:text-base">
            Enter your room and start chatting immediately. Share the room ID with others to invite them to join.
          </p>
          <div className="rounded-lg overflow-hidden border shadow-md bg-card">
            <div className="p-4 border-b flex items-center gap-2">
              <div className="size-6 overflow-hidden">
                <Image src="/icon.png" alt="Roomble" width={24} height={24} className="w-full h-full object-contain" />
              </div>
              <span className="font-medium">Chat Interface</span>
            </div>
            <div className="p-4 flex flex-col">
              <div className="flex flex-col space-y-4">
                <div className="max-w-[80%] p-3 rounded-lg bg-muted">
                  <div className="h-3 w-16 bg-muted-foreground/20 rounded mb-2"></div>
                  <div className="space-y-1">
                    <div className="h-2 w-full bg-muted-foreground/20 rounded"></div>
                    <div className="h-2 w-[80%] bg-muted-foreground/20 rounded"></div>
                  </div>
                </div>
                <div className="max-w-[80%] ml-auto p-3 rounded-lg bg-primary/10">
                  <div className="h-3 w-16 bg-primary/20 rounded mb-2"></div>
                  <div className="space-y-1">
                    <div className="h-2 w-full bg-primary/20 rounded"></div>
                    <div className="h-2 w-[80%] bg-primary/20 rounded"></div>
                  </div>
                </div>
              </div>
              <div className="mt-4 h-10 bg-muted/50 rounded-md w-full"></div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Video Conferencing",
      content: (
        <div>
          <p className="mb-6 text-sm font-normal text-muted-foreground md:text-base">
            Connect face-to-face with crystal-clear video calls, screen sharing, and interactive features.
          </p>
          <div className="rounded-lg overflow-hidden border shadow-md bg-card">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-6 overflow-hidden">
                  <Image src="/icon.png" alt="Roomble" width={24} height={24} className="w-full h-full object-contain" />
                </div>
                <span className="font-medium">Video Call</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 7l-7 5 7 5V7z"/>
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                  </svg>
                </div>
                <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="23"/>
                    <line x1="8" y1="23" x2="16" y2="23"/>
                  </svg>
                </div>
              </div>
            </div>
            <div className="aspect-video bg-muted/80 relative p-2">
              {/* Main video area */}
              <div className="w-full h-full rounded-md bg-muted/50 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-2 w-full max-w-md">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="aspect-video bg-muted/30 rounded-md overflow-hidden relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium">{String.fromCharCode(64 + i)}</span>
                          </div>
                        </div>
                        <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                          {i === 1 ? 'You' : `User ${i}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/50 rounded-full px-3 py-1.5">
                <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="23"/>
                    <line x1="8" y1="23" x2="16" y2="23"/>
                  </svg>
                </div>
                <div className="size-8 rounded-full bg-primary flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 7l-7 5 7 5V7z"/>
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                  </svg>
                </div>
                <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                </div>
                <div className="size-8 rounded-full bg-destructive flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </div>
              </div>
            </div>
            <div className="p-3 flex justify-between items-center">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="size-6 rounded-full bg-primary/10 border border-card flex items-center justify-center text-xs">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
                <div className="size-6 rounded-full bg-primary/20 border border-card flex items-center justify-center">
                  <span className="text-xs">+2</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">Meeting duration: 00:32:14</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Join the Community",
      content: (
        <div>
          <p className="mb-6 text-sm font-normal text-muted-foreground md:text-base">
            Connect with other users, share ideas, and build a network of collaborators in the Roomble community.
          </p>
          <div className="rounded-lg overflow-hidden border shadow-md bg-card">
            <div className="p-4 border-b flex items-center gap-2">
              <div className="size-6 overflow-hidden">
                <Image src="/icon.png" alt="Roomble" width={24} height={24} className="w-full h-full object-contain" />
              </div>
              <span className="font-medium">Community Hub</span>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="size-10 rounded-full bg-primary/10 border-2 border-card flex items-center justify-center overflow-hidden">
                      {i % 2 === 0 ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="size-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      ) : (
                        <div className="bg-gradient-to-br from-primary/40 to-primary/20 w-full h-full flex items-center justify-center text-xs font-medium">
                          {String.fromCharCode(64 + i)}
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="size-10 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center">
                    <span className="text-xs font-medium">+12</span>
                  </div>
                </div>
              </div>
              <div className="border rounded-lg overflow-hidden mb-4">
                <div className="bg-muted/30 p-2 border-b flex items-center gap-2">
                  <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">R</div>
                  <span className="text-xs font-medium">Roomble Community</span>
                </div>
                <div className="p-3 space-y-3">
                  <div className="flex gap-2">
                    <div className="size-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-xs">A</div>
                    <div className="bg-muted/40 rounded-lg p-2 text-xs">
                      <p className="font-medium mb-1">Alex</p>
                      <p>Has anyone tried the new video feature? It works great on mobile!</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="size-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-xs">S</div>
                    <div className="bg-muted/40 rounded-lg p-2 text-xs">
                      <p className="font-medium mb-1">Sarah</p>
                      <p>Yes! The quality is amazing even on slower connections.</p>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <div className="bg-primary/10 rounded-lg p-2 text-xs">
                      <p className="font-medium mb-1">You</p>
                      <p>I'll be hosting a community call tomorrow to showcase the new features!</p>
                    </div>
                    <div className="size-8 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center text-xs">Y</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <div className="h-8 w-32 bg-primary/20 rounded-md flex items-center justify-center">
                  <span className="text-xs font-medium">Join Community</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="relative w-full overflow-clip">
      <Timeline data={data} />
    </div>
  );
}
