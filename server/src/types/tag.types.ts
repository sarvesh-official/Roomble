export interface CreateTag {
  name: string;
  isCategory?: boolean;
}

export interface TagResponse {
  id: string;
  name: string;
  isCategory: boolean;
  createdAt: Date;
}
