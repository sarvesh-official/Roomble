'use client';

import React from 'react';
import { BentoGrid } from './ui/bento-grid';
import { Zap, Clock, Users, Laptop, Shield } from 'lucide-react';

export function GlobalConnectivityBento() {
  // Items for the bento grid on the left side
  const items = [
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
      title: 'Global Security',
      description:
        'Our secure infrastructure ensures your data is protected across all global connections.',
      icon: <Shield className="size-6" />,
      size: 'large' as const,
    },
  ];

  return (
    <div className="container mx-auto">
      {/* Full width Bento Grid */}
      <div className="w-full">
        <BentoGrid items={items} />
      </div>
    </div>
  );
}
