'use client';

import React from 'react';
import { BentoGrid } from './ui/bento-grid';
import { FileText, Layers, MessageSquare, Users, Video, Zap } from 'lucide-react';

export function WhyRoomble() {
  const items = [
    {
      title: 'Real-time Collaboration',
      description:
        'Connect and collaborate with teammates in real-time, no matter where they are located.',
      icon: <Users className="size-6" />,
      size: 'large' as const,
    },
    {
      title: 'Video Conferencing',
      description:
        'Crystal-clear video calls with screen sharing capabilities built right in.',
      icon: <Video className="size-6" />,
      size: 'small' as const,
    },
    {
      title: 'Instant Messaging',
      description: 'Chat with your team members instantly with rich text formatting.',
      icon: <MessageSquare className="size-6" />,
      size: 'medium' as const,
    },
    {
      title: 'Customizable Rooms',
      description: "Create and customize rooms for different teams, projects, or topics.",
      icon: <Layers className="size-6" />,
      size: 'medium' as const,
    },
    {
      title: 'Lightning Fast',
      description: 'Optimized for speed and performance across all devices.',
      icon: <Zap className="size-6" />,
      size: 'small' as const,
    },
    {
      title: 'Extensive Documentation',
      description:
        'Comprehensive guides and examples to help you get the most out of Roomble.',
      icon: <FileText className="size-6" />,
      size: 'large' as const,
    },
  ];

  return (
    <section id="features" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Roomble?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Roomble is designed to make virtual collaboration seamless and productive. 
            Here&apos;s why teams choose our platform for their remote work needs.
          </p>
        </div>
        
        <BentoGrid items={items} />
      </div>
    </section>
  );
}
