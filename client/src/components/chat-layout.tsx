'use client';

import { useState } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { Messages } from '@/components/messages';
import { ChatInput } from '@/components/chat-input';
import { MessageProps } from '@/components/message';
import { generateRoomId } from '@/lib/utils';
import { ChatHeader } from '@/components/chat-header';

export function ChatLayout() {
  // Room information
  const [roomInfo] = useState({
    name: 'General',
    isPrivate: false
  });
  
  const memberCount = 24;
  
  const [messages, setMessages] = useState<MessageProps[]>([
    {
      id: '1',
      content: 'Welcome to the General room!',
      role: 'system',
      username: 'System',
      timestamp: new Date(),
    },
    {
      id: '2',
      content: 'Hey everyone! How are you all doing today?',
      role: 'user',
      username: 'Alex',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    },
    {
      id: '3',
      content: "I'm doing great! Just finished working on a new project.",
      role: 'system',
      username: 'Taylor',
      timestamp: new Date(Date.now() - 1000 * 60 * 14), // 14 minutes ago
    },
    {
      id: '4',
      content: 'What kind of project are you working on?',
      role: 'user',
      username: 'You',
      timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
    },
    {
      id: '5',
      content: "It's a new chat application using React and WebSocket. I'm trying to make it as user-friendly as possible.",
      role: 'system',
      username: 'Taylor',
      timestamp: new Date(Date.now() - 1000 * 60 * 8), // 8 minutes ago
    },
    {
      id: '6',
      content: "That sounds interesting! I've been working with WebSocket recently too. Let me know if you need any help with that.",
      role: 'user',
      username: 'You',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (content: string) => {
    const newMessage: MessageProps = {
      id: generateRoomId(),
      content,
      role: 'user',
      username: 'You',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    
    // Simulate a response
    setIsTyping(true);
    setTimeout(() => {
      const responseMessage: MessageProps = {
        id: generateRoomId(),
        content: `You said: "${content}"`,
        role: 'system',
        username: 'Bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, responseMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="flex h-screen w-full bg-black">
      <AppSidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <ChatHeader memberCount={memberCount} />
        <div className="flex-1 min-h-0 overflow-auto relative bg-black">
          <div className="mx-auto w-full md:max-w-2xl lg:max-w-2xl xl:max-w-3xl">
            <Messages 
              messages={messages} 
              isTyping={isTyping} 
              roomName={roomInfo.name}
              isPrivate={roomInfo.isPrivate}
            />
          </div>
        </div>
        <div className="p-4 sticky bottom-0 z-10">
          <div className="mx-auto w-full md:max-w-2xl lg:max-w-2xl xl:max-w-3xl">
            <ChatInput onSend={handleSendMessage} isDisabled={isTyping} />
          </div>
        </div>
      </div>
    </div>
  );
}
