'use client';

import { memo, useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Message, MessageProps, ThinkingMessage } from './message';
import { ArrowDown, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';

interface MessagesProps {
  messages: MessageProps[];
  isTyping?: boolean;
  roomName?: string;
  isPrivate?: boolean;
}

function PureMessages({
  messages,
  isTyping = false,
  roomName = 'General',
}: MessagesProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Handle scroll to bottom
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Check if scrolled to bottom
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isBottom = scrollHeight - scrollTop - clientHeight < 10;
    setIsAtBottom(isBottom);
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      scrollToBottom();
    }
  }, [messages]);

  // Set up scroll event listener
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="relative flex flex-col flex-1 h-full overflow-hidden bg-black">
      {/* Room info header removed as requested */}
      
      <div
        ref={messagesContainerRef}
        className="flex flex-col min-w-0 gap-6 flex-1 h-full overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent"
        onScroll={handleScroll}
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="flex items-center justify-center size-12 rounded-full bg-primary/10 mb-4">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Welcome to {roomName}!</h2>
            <p className="text-muted-foreground mt-2">This is the beginning of the conversation.</p>
            <p className="text-muted-foreground">Send a message to start chatting.</p>
          </div>
        )}

        {messages.length > 0 && (
          <div className="pb-2">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                Today
              </div>
            </div>
            {messages.map((message) => (
              <Message
                key={message.id}
                message={message}
              />
            ))}
          </div>
        )}

        {isTyping && <ThinkingMessage />}

        <motion.div
          ref={messagesEndRef}
          className="shrink-0 min-w-[24px] min-h-[24px]"
        />
      </div>

      {/* Scroll to bottom button */}
      {!isAtBottom && messages.length > 0 && (
        <div className="absolute bottom-4 right-4 z-10">
          <Button
            onClick={scrollToBottom}
            size="icon"
            variant="secondary"
            className="rounded-full shadow-md h-10 w-10 bg-secondary hover:bg-secondary/80 text-secondary-foreground border-none"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export const Messages = memo(PureMessages);
