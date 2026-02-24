export type Category =
  | 'dairy'
  | 'produce'
  | 'bakery'
  | 'beverages'
  | 'snacks'
  | 'household'
  | 'personal care'
  | 'frozen'
  | 'other';

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  category: Category;
  price?: number; // optional for search/filter
  brand?: string;
  notes?: string;
  addedAt: number;
}

export interface VoiceAction {
  type: 'add' | 'remove' | 'search' | 'unknown';
  item?: string;
  quantity?: number;
  filters?: { brand?: string; maxPrice?: number; organic?: boolean };
}

export interface Suggestion {
  text: string;
  item?: string;
  reason: 'history' | 'seasonal' | 'substitute';
}
