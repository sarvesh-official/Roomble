'use client';

import { motion } from 'framer-motion';
import { memo } from 'react';
import { Sparkle, Reply } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MessageReactions } from './message-reactions';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export interface MessageProps {
  id: string;
  content: string;
  role: 'user' | 'system';
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
      className="w-full mx-auto max-w-4xl px-4 group/message"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      data-role={message.role}
    >
      <div 
        className={cn(
          "flex gap-4 w-full",
          message.role === "user" 
            ? "group-data-[role=user]/message:flex-row-reverse group-data-[role=user]/message:max-w-[80%] group-data-[role=user]/message:ml-auto" 
            : ""
        )}
      >
        {message.role === "system" && (
          <div className="w-10 h-10 flex items-center rounded-full justify-center shrink-0 ring-1 ring-border bg-background">
            <div>
              <Sparkle className="h-5 w-5" />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4 w-full">
          <div className={cn(
            "flex items-center gap-2",
            message.role === "user" ? "flex-row-reverse" : "flex-row"
          )}>
            <span className="font-medium text-foreground text-sm">{message.username}</span>
            <span className="text-xs text-muted-foreground">{formattedTime}</span>
          </div>
          
          <div 
            className={cn(
              "px-4 py-3 rounded-xl break-words",
              message.role === "user" 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-foreground"
            )}
          >
            {message.content}
          </div>
          
          {/* Message actions */}
          <div className={cn(
            "flex items-center gap-2 opacity-0 group-hover/message:opacity-100 transition-opacity",
            message.role === "user" ? "justify-end" : "justify-start"
          )}>
            <MessageReactions messageId={message.id} />
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 rounded-full"
                >
                  <Reply className="h-4 w-4 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reply</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {message.role === "user" && (
          <div className="w-8 h-8 flex items-center rounded-full justify-center shrink-0 ring-1 ring-border bg-primary text-primary-foreground">
            <div className="font-semibold text-sm">
              {message.username.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export const Message = memo(PureMessage);

export function ThinkingMessage() {
  return (
    <div className="w-full mx-auto max-w-4xl px-4">
      <div className="flex gap-4">
        <div className="w-8 h-8 flex items-center rounded-full justify-center shrink-0 ring-1 ring-border bg-background">
          <div>
            <Sparkle className="h-5 w-5" />
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          <div className="h-4 w-full max-w-md bg-muted rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
