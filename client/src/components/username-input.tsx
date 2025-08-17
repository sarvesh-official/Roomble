'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';

interface UsernameInputProps {
  onSubmit: (username: string) => void;
}

export function UsernameInput({ onSubmit }: UsernameInputProps) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSubmit(username.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Welcome to Roomble</h2>
        <p className="text-muted-foreground mb-6">
          Please enter a username to continue. This will be used for your avatar and display name.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full p-2 border rounded-md"
              autoFocus
              required
              minLength={2}
              maxLength={20}
            />
          </div>
          <Button 
            type="submit" 
            disabled={!username.trim()}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Enter Room
          </Button>
        </form>
      </div>
    </div>
  );
}
