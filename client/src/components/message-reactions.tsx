'use client';

import { useState } from 'react';
import { Smile } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface ReactionProps {
  messageId: string;
  onReact?: (messageId: string, reaction: string) => void;
}

const REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🎉'];

export function MessageReactions({ messageId, onReact }: ReactionProps) {
  const [showReactions, setShowReactions] = useState(false);
  const [reactions, setReactions] = useState<Record<string, number>>({});
  
  const handleReaction = (reaction: string) => {
    setReactions(prev => ({
      ...prev,
      [reaction]: (prev[reaction] || 0) + 1
    }));
    
    if (onReact) {
      onReact(messageId, reaction);
    }
    
    setShowReactions(false);
  };
  
  return (
    <div className="relative">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 rounded-full"
            onClick={() => setShowReactions(!showReactions)}
          >
            <Smile className="h-4 w-4 text-muted-foreground" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Add reaction</TooltipContent>
      </Tooltip>
      
      {showReactions && (
        <div className="absolute bottom-full mb-2 bg-popover shadow-md rounded-full p-1 flex items-center gap-1 z-10">
          {REACTIONS.map(reaction => (
            <button
              key={reaction}
              className="text-lg hover:bg-muted rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              onClick={() => handleReaction(reaction)}
            >
              {reaction}
            </button>
          ))}
        </div>
      )}
      
      {Object.entries(reactions).length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {Object.entries(reactions).map(([reaction, count]) => (
            <div 
              key={reaction} 
              className="flex items-center bg-muted rounded-full px-2 py-0.5 text-xs"
            >
              <span className="mr-1">{reaction}</span>
              <span className="text-muted-foreground">{count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
