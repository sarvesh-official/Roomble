'use client';

import { useState } from 'react';
import { Paperclip, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface FileSharingProps {
  onSend?: (file: File) => void;
  isDisabled?: boolean;
}

export function FileSharing({ onSend, isDisabled = false }: FileSharingProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleSend = () => {
    if (selectedFile && onSend) {
      onSend(selectedFile);
      setSelectedFile(null);
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <label className="cursor-pointer">
            <div className="flex items-center justify-center h-9 w-9 rounded-md hover:bg-muted transition-colors">
              <Paperclip className="h-5 w-5 text-muted-foreground" />
              <input 
                type="file" 
                className="hidden" 
                onChange={handleFileChange} 
                disabled={isDisabled}
              />
            </div>
          </label>
        </TooltipTrigger>
        <TooltipContent>Attach file</TooltipContent>
      </Tooltip>
      
      {selectedFile && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground truncate max-w-[100px]">
            {selectedFile.name}
          </span>
          <Button 
            size="sm" 
            onClick={handleSend} 
            disabled={isDisabled}
            className="h-7 px-2"
          >
            <Send className="h-3 w-3 mr-1" />
            Send
          </Button>
        </div>
      )}
    </div>
  );
}
