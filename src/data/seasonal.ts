const FEBRUARY_SEASONAL = [
  'citrus (oranges, lemons)',
  'winter squash',
  'kale',
  'brussels sprouts',
  'sweet potatoes',
  'parsnips',
  'hot chocolate',
  'soup ingredients',
];

const SEASONAL_BY_MONTH: Record<number, string[]> = {
  0: ['citrus', 'winter squash', 'kale', 'soup ingredients'],
  1: FEBRUARY_SEASONAL,
  2: ['asparagus', 'peas', 'spinach', 'spring onions'],
  3: ['strawberries', 'asparagus', 'peas', 'lettuce'],
  4: ['berries', 'cherries', 'zucchini', 'tomatoes'],
  5: ['berries', 'stone fruit', 'corn', 'cucumbers'],
  6: ['melons', 'peaches', 'tomatoes', 'bell peppers'],
  7: ['apples', 'pears', 'squash', 'pumpkin'],
  8: ['apples', 'pumpkin', 'sweet potatoes', 'cranberries'],
  9: ['pumpkin', 'brussels sprouts', 'turkey', 'cranberries'],
  10: ['citrus', 'winter squash', 'kale', 'holiday baking'],
  11: FEBRUARY_SEASONAL,
};

export function getSeasonalSuggestions(): string[] {
  const month = new Date().getMonth();
  return SEASONAL_BY_MONTH[month] ?? FEBRUARY_SEASONAL;
}
