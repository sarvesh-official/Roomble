export interface Tag {
  id: string;
  name: string;
  isCategory: boolean;
  createdAt: string;
}

export interface TagOption {
  value: string;
  label: string;
  isCategory?: boolean;
}
