export const SUBSTITUTES: Record<string, string[]> = {
  milk: ['almond milk', 'oat milk', 'soy milk', 'coconut milk', 'lactose-free milk'],
  bread: ['whole grain bread', 'sourdough', 'bagels', 'tortillas'],
  butter: ['margarine', 'olive oil', 'coconut oil'],
  eggs: ['tofu', 'chia seeds', 'applesauce'],
  cheese: ['nutritional yeast', 'vegan cheese', 'cottage cheese'],
  yogurt: ['greek yogurt', 'cottage cheese', 'kefir'],
  sugar: ['honey', 'maple syrup', 'stevia'],
  pasta: ['rice', 'zucchini noodles', 'quinoa'],
  rice: ['cauliflower rice', 'quinoa', 'couscous'],
  potato: ['sweet potato', 'cauliflower', 'turnip'],
  beef: ['chicken', 'turkey', 'tofu', 'lentils'],
  chicken: ['turkey', 'tofu', 'tempeh'],
  toothpaste: ['natural toothpaste', 'baking soda'],
  shampoo: ['conditioner', 'co-wash'],
};

export function getSubstitutes(itemName: string): string[] {
  const key = itemName.toLowerCase().trim().replace(/\s+/g, ' ');
  for (const [item, subs] of Object.entries(SUBSTITUTES)) {
    if (key.includes(item)) return subs;
  }
  return [];
}
