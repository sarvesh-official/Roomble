'use client';

import { ChatLayout } from '@/components/chat-layout';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function Home() {
  return (
    <SidebarProvider>
      <ChatLayout />
    </SidebarProvider>
  );
}
