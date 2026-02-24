import type { ShoppingItem } from '../types';
import { CATEGORY_LABELS } from '../data/categories';

interface ShoppingListProps {
  items: ShoppingItem[];
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
  filterCategory: string | null;
  searchQuery: string;
  maxPriceFilter: number | null;
}

function filterItems(
  items: ShoppingItem[],
  category: string | null,
  query: string,
  maxPrice: number | null
): ShoppingItem[] {
  let list = items;
  if (category) {
    list = list.filter((i) => i.category === category);
  }
  if (query.trim()) {
    const q = query.toLowerCase();
    list = list.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        CATEGORY_LABELS[i.category].toLowerCase().includes(q)
    );
  }
  if (maxPrice != null) {
    list = list.filter((i) => (i.price ?? 999) <= maxPrice);
  }
  return list;
}

export function ShoppingList({
  items,
  onRemove,
  onQuantityChange,
  filterCategory,
  searchQuery,
  maxPriceFilter,
}: ShoppingListProps) {
  const filtered = filterItems(items, filterCategory, searchQuery, maxPriceFilter);
  const byCategory = filtered.reduce<Record<string, ShoppingItem[]>>((acc, item) => {
    const c = item.category;
    if (!acc[c]) acc[c] = [];
    acc[c].push(item);
    return acc;
  }, {});
  const order = Object.keys(CATEGORY_LABELS);

  if (filtered.length === 0) {
    return (
      <p className="py-8 text-center text-slate-400">
        {items.length === 0
          ? 'Your list is empty. Use voice or type to add items.'
          : 'No items match your search or filters.'}
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {order.map((cat) => {
        const list = byCategory[cat];
        if (!list?.length) return null;
        return (
          <li key={cat}>
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
              {CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]}
            </h3>
            <ul className="space-y-2">
              {list.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-2 rounded-xl bg-slate-800/60 px-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-slate-100">{item.name}</span>
                    {item.quantity > 1 && (
                      <span className="ml-2 text-slate-400">× {item.quantity}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 rounded-lg bg-slate-700/80">
                      <button
                        type="button"
                        onClick={() => onQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                        className="flex h-8 w-8 items-center justify-center text-slate-300 hover:bg-slate-600 hover:text-white"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="min-w-[1.5rem] text-center text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center text-slate-300 hover:bg-slate-600 hover:text-white"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemove(item.id)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-red-500/20 hover:text-red-400"
                      aria-label={`Remove ${item.name}`}
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-1.414 1.414M19 7h-6m6 0V5a2 2 0 00-2-2h-6a2 2 0 00-2 2v2m0 12v2a2 2 0 002 2h6a2 2 0 002-2v-2m0-12V5a2 2 0 012-2h2a2 2 0 012 2v2m0 12v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V7" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}
