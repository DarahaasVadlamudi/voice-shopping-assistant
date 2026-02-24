import { useCallback, useEffect, useState } from 'react';
import type { ShoppingItem } from '../types';
import { getCategoryForItem } from '../data/categories';

const STORAGE_KEY = 'voice-shopping-list';
const HISTORY_KEY = 'voice-shopping-history';

function loadList(): ShoppingItem[] {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) return JSON.parse(s);
  } catch (_) {}
  return [];
}

function saveList(items: ShoppingItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (_) {}
}

function loadHistory(): string[] {
  try {
    const s = localStorage.getItem(HISTORY_KEY);
    if (s) return JSON.parse(s);
  } catch (_) {}
  return [];
}

function pushHistory(itemName: string, max = 50) {
  const h = loadHistory().filter((x) => x.toLowerCase() !== itemName.toLowerCase());
  h.unshift(itemName);
  const out = h.slice(0, max);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(out));
  } catch (_) {}
  return out;
}

function generateId() {
  return `item-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>(loadList);

  useEffect(() => {
    saveList(items);
  }, [items]);

  const addItem = useCallback((name: string, quantity: number = 1) => {
    const trimmed = name.trim();
    if (!trimmed) return null;
    pushHistory(trimmed);
    const item: ShoppingItem = {
      id: generateId(),
      name: trimmed,
      quantity,
      category: getCategoryForItem(trimmed),
      addedAt: Date.now(),
    };
    setItems((prev) => [...prev, item]);
    return item;
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const removeByName = useCallback((name: string) => {
    const n = name.toLowerCase().trim();
    setItems((prev) => prev.filter((i) => !i.name.toLowerCase().includes(n)));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  }, []);

  const getHistory = useCallback(() => loadHistory(), []);

  const clearList = useCallback(() => setItems([]), []);

  return {
    items,
    addItem,
    removeItem,
    removeByName,
    updateQuantity,
    getHistory,
    clearList,
  };
}
