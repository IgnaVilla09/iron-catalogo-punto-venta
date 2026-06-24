'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/lib/types';

interface CartState {
  items: CartItem[];
  lastAddedAt: number;
  addItem: (item: CartItem) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
      (set) => ({
        items: [],
        lastAddedAt: 0,
        addItem: (item) =>
          set((state) => {
            const existing = state.items.find((entry) => entry.variantId === item.variantId);

            if (!existing) {
              return { items: [...state.items, item], lastAddedAt: Date.now() };
            }

            return {
              items: state.items.map((entry) =>
                entry.variantId === item.variantId
                  ? { ...entry, quantity: Math.min(entry.quantity + item.quantity, entry.stock), stock: item.stock }
                  : entry
              ),
              lastAddedAt: Date.now(),
            };
          }),
      updateQuantity: (variantId, quantity) =>
        set((state) => ({
          items: state.items
            .map((item) => item.variantId === variantId ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) } : item)
            .filter((item) => item.quantity > 0),
        })),
      removeItem: (variantId) =>
        set((state) => ({
          items: state.items.filter((item) => item.variantId !== variantId),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: 'iron-catalog-cart',
    }
  )
);
