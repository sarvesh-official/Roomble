'use client';

import { motion } from 'framer-motion';
import { memo } from 'react';
import { Sparkle } from 'lucide-react'; 
import { cn } from '@/lib/utils';
import Image from 'next/image';
  
export interface MessageProps {
  id: string;
  content: string;
  role: "currentUser" | "others";
  profileUrl: string;
  username: string;
  timestamp: Date;
}

function PureMessage({
  message,
}: {
  message: MessageProps;
}) {
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(message.timestamp);

  return (
    <motion.div
      data-testid={`message-${message.role}`}
      className={cn(
        "w-full mx-auto max-w-4xl px-4 group/message pb-4",
        message.role === "currentUser" ? "items-end" : "items-start"
      )}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      data-role={message.role}
    >
      <div 
        className={cn(
          "flex flex-col",
          message.role === "currentUser" 
            ? "max-w-[80%] ml-auto items-end" 
            : "max-w-[80%] items-start"
        )}
      >
        {/* User info row with avatar and name */}
        <div className={cn(
          "flex items-center gap-2 mb-1",
          message.role === "currentUser" ? "flex-row-reverse" : "flex-row"
        )}>
          <div className="w-6 h-6 flex items-center rounded-full justify-center shrink-0 ring-1 ring-border overflow-hidden"
            style={message.role === "currentUser" ? {backgroundColor: "var(--primary)"} : {backgroundColor: "var(--background)"}}
          >
            {message.profileUrl ? (
              <Image 
                src={message.profileUrl} 
                alt={message.username} 
                width={24} 
                height={24} 
                className="h-full w-full object-cover" 
              />
            ) : (
              <div className="font-semibold text-xs"
                style={message.role === "currentUser" ? {color: "var(--primary-foreground)"} : {}}
              >
                {message.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <span className="font-medium text-foreground text-sm">{message.username}</span>
        </div>
        
        {/* Message content */}
        <div 
          className={cn(
            "px-4 py-3 rounded-xl break-words inline-block max-w-full",
            message.role === "currentUser" 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted text-foreground",
            message.content.length < 20 ? "w-auto" : "w-full"
          )}
        >
          {message.content}
        </div>
        
        {/* Timestamp at bottom */}
        <span className="text-xs text-muted-foreground mt-1">{formattedTime}</span>
      </div>
    </motion.div>
  );
}

export const Message = memo(PureMessage);

export function ThinkingMessage() {
  return (
    <div className="w-full mx-auto max-w-4xl px-4 pb-2">
      <div className="flex flex-col max-w-[80%]">
        {/* User info row with avatar and name */}
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 flex items-center rounded-full justify-center shrink-0 ring-1 ring-border bg-background overflow-hidden">
            <Sparkle className="h-3 w-3" />
          </div>
          <div className="h-4 w-24 bg-muted rounded animate-pulse" />
        </div>
        
        {/* Message content */}
        <div className="h-10 w-full max-w-md bg-muted rounded-xl animate-pulse" />
        
        {/* Timestamp at bottom */}
        <div className="h-3 w-16 bg-muted rounded animate-pulse mt-1 self-start" />
      </div>
    </div>
  );
}
