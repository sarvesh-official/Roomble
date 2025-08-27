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
