export interface Pet {
  id: number;
  name: string;
  category?: {
    id: number,
    name: string
  };
  photoUrls?: string[];
  avatar?: string;
}
