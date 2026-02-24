import type { Category } from '../types';

const ITEM_TO_CATEGORY: Record<string, Category> = {
  milk: 'dairy',
  cheese: 'dairy',
  yogurt: 'dairy',
  butter: 'dairy',
  cream: 'dairy',
  eggs: 'dairy',
  apple: 'produce',
  apples: 'produce',
  banana: 'produce',
  bananas: 'produce',
  orange: 'produce',
  oranges: 'produce',
  tomato: 'produce',
  tomatoes: 'produce',
  lettuce: 'produce',
  carrot: 'produce',
  carrots: 'produce',
  onion: 'produce',
  onions: 'produce',
  potato: 'produce',
  potatoes: 'produce',
  bread: 'bakery',
  bagel: 'bakery',
  bagels: 'bakery',
  croissant: 'bakery',
  water: 'beverages',
  juice: 'beverages',
  coffee: 'beverages',
  tea: 'beverages',
  soda: 'beverages',
  beer: 'beverages',
  wine: 'beverages',
  chips: 'snacks',
  crackers: 'snacks',
  cookies: 'snacks',
  nuts: 'snacks',
  cereal: 'snacks',
  soap: 'personal care',
  shampoo: 'personal care',
  toothpaste: 'personal care',
  deodorant: 'personal care',
  detergent: 'household',
  paper: 'household',
  towels: 'household',
  ice: 'frozen',
  'ice cream': 'frozen',
  pizza: 'frozen',
  vegetables: 'frozen',
};

export function getCategoryForItem(name: string): Category {
  const normalized = name.toLowerCase().trim();
  const single = normalized.replace(/s$/, '');
  return (
    ITEM_TO_CATEGORY[normalized] ??
    ITEM_TO_CATEGORY[single] ??
    'other'
  );
}

export const CATEGORY_LABELS: Record<Category, string> = {
  dairy: 'Dairy',
  produce: 'Produce',
  bakery: 'Bakery',
  beverages: 'Beverages',
  snacks: 'Snacks',
  household: 'Household',
  'personal care': 'Personal Care',
  frozen: 'Frozen',
  other: 'Other',
};
