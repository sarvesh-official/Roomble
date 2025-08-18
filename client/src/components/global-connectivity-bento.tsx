'use client';

import React from 'react';
import { BentoGrid } from './ui/bento-grid';
import { Globe, Zap, Clock, Users, Laptop, Shield } from 'lucide-react';
import ClientOnlyGlobe from '@/components/ui/client-only-globe';
import { WorldMap } from './ui/world-map';

export function GlobalConnectivityBento() {
  // Items for the bento grid on the left side
  const items = [
    {
      title: 'Worldwide Connections',
      description:
        'Our platform breaks down geographical barriers, allowing you to collaborate and communicate with anyone, anywhere.',
      icon: <Globe className="size-6" />,
      size: 'large' as const,
      customContent: (
        <div className="relative w-[120px] h-[120px] rounded-full overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 group-hover:shadow-primary/20 transition-all duration-500 mt-4">
          {/* Light Theme Globe */}
          <div className="dark:hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900"></div>
            <div className="relative z-10">
              <ClientOnlyGlobe
                scale={1.5}
                baseColor={[0.15, 0.15, 0.15]}
                markerColor={[1, 1, 1]}
                glowColor={[0.7, 0.7, 0.7]}
                dark={0.9}
                mapBrightness={10}
                diffuse={0.8}
                mapSamples={100000}
              />
            </div>
          </div>
          
          {/* Dark Theme Globe */}
          <div className="hidden dark:block">
            <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-100"></div>
            <div className="relative z-10">
              <ClientOnlyGlobe
                scale={1.5}
                baseColor={[0.95, 0.95, 0.95]}
                markerColor={[0.1, 0.1, 0.1]}
                glowColor={[0.8, 0.8, 0.8]}
                dark={0}
                mapBrightness={4}
                diffuse={1.2}
                mapSamples={100000}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Real-time Communication',
      description:
        'Instant messaging and real-time updates keep everyone in sync.',
      icon: <Zap className="size-6" />,
      size: 'small' as const,
    },
    {
      title: 'Low-latency Connections',
      description: 'Experience minimal delay with our optimized global network.',
      icon: <Clock className="size-6" />,
      size: 'medium' as const,
    },
    {
      title: 'Cross-border Collaboration',
      description: "Work seamlessly with teammates across different countries and time zones.",
      icon: <Users className="size-6" />,
      size: 'medium' as const,
    },
    {
      title: 'Device Compatibility',
      description: 'Connect from any device, anywhere in the world.',
      icon: <Laptop className="size-6" />,
      size: 'small' as const,
    },
    {
      title: 'Global Visualization',
      description:
        'See our worldwide network in action with our interactive globe visualization.',
      icon: <Shield className="size-6" />,
      size: 'large' as const,
      customContent: (
        <div className="bg-background flex flex-col items-center justify-center overflow-hidden">
          <article className="border-border relative mx-auto my-4 max-w-[400px] rounded-xl border p-4 text-center">
            <div className="relative z-10">
              <h3 className="text-xl leading-[100%] font-semibold tracking-tighter mb-2">
                Welcome to Roomble
              </h3>
              <WorldMap 
                points={[
                  { lat: 37.7749, lng: -122.4194, label: "SF" },
                  { lat: 51.5074, lng: -0.1278, label: "LDN" },
                ]}
                lineColor="#0ea5e9"
              />
            </div>
          </article>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
      {/* Left column - Bento Grid */}
      <div className="w-full md:w-3/5">
        <BentoGrid items={items} />
      </div>
      
      {/* Right column - Globe */}
      <div className="w-full md:w-2/5 sticky top-24">
        <div className="bg-background rounded-xl border border-border p-6 pb-12 shadow-sm overflow-visible">
          <h2 className="text-2xl font-bold mb-4">Global Network Visualization</h2>
          <p className="text-muted-foreground mb-6">
            Our platform connects users across the globe with low-latency, secure communication channels.
            Explore our worldwide network through this interactive visualization.
          </p>
          <div className="relative mx-auto pb-8 overflow-visible">
            <WorldMap 
              points={[
                { lat: 37.7749, lng: -122.4194, label: "San Francisco" },
                { lat: 40.7128, lng: -74.0060, label: "New York" },
                { lat: 51.5074, lng: -0.1278, label: "London" },
                { lat: 35.6762, lng: 139.6503, label: "Tokyo" },
                { lat: -33.8688, lng: 151.2093, label: "Sydney" },
              ]}
              dots={[
                { 
                  start: { lat: 37.7749, lng: -122.4194 },
                  end: { lat: 35.6762, lng: 139.6503 }
                },
                { 
                  start: { lat: 51.5074, lng: -0.1278 },
                  end: { lat: 40.7128, lng: -74.0060 }
                },
              ]}
              lineColor="#0ea5e9"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
