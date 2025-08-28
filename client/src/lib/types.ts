// Basic types for Roomble chat app

export interface Message {
  id: string;
  username: string;
  content: string;
  timestamp: Date;
  roomId: string;
}

export interface User {
  id: string;
  username: string;
  joinedAt: Date;
}

export interface Room {
  id: string;
  name?: string;
  createdAt: Date;
  isPrivate: boolean;
  users: User[];
  messages: Message[];
}

export interface ChatEvent {
  type: 'user_joined' | 'user_left' | 'message' | 'typing';
  data: Message | User | { username: string } | { isTyping: boolean };
  timestamp: Date;
}
