export interface Drill {
  id: number;
  premium: boolean;
  name: string;
  description: string;
  link: string;
  type: 'Drill' | 'Play';
  categories: string[];
  players: number;
}

export interface HighlightedDrill {
  id: number;
  name: string;
  categories: string[];
  players: number;
}

export interface Article {
  id: number;
  title: string;
  author: string;
  created_at: string;
}
