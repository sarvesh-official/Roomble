export interface Room {
  id: string;
  name: string;
  description: string;
  participants: number;
  lastActive: string;
  tags?: string[];
  featured?: boolean;
  popular?: boolean;
  isPublic?: boolean;
  createdBy?: string;
  createdByYou?: boolean;
}


export interface CreateRoom{
    name: string;
    description?: string;
    isPublic: boolean;
    tagIds?: string[];
    customTags?: string[];
    createdBy?: string;
}

export interface JoinRoom{
    roomCode: string;
}