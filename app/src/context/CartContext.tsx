import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CartItem, Product } from '../types';

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  add(product: Product): void;
  remove(productId: number): void;
  setQty(productId: number, qty: number): void;
  clear(): void;
}

const CartContext = createContext<CartContextValue | null>(null);
const CART_KEY = 'rappiclone.cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) ?? '[]') as CartItem[];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const add = (product: Product) =>
      setItems((prev) => {
        const found = prev.find((i) => i.product.id === product.id);
        if (found) return prev.map((i) => (i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i));
        return [...prev, { product, qty: 1 }];
      });

    const remove = (productId: number) => setItems((prev) => prev.filter((i) => i.product.id !== productId));

    const setQty = (productId: number, qty: number) =>
      setItems((prev) =>
        qty <= 0
          ? prev.filter((i) => i.product.id !== productId)
          : prev.map((i) => (i.product.id === productId ? { ...i, qty } : i)),
      );

    return {
      items,
      count: items.reduce((a, i) => a + i.qty, 0),
      subtotal: items.reduce((a, i) => a + i.qty * i.product.price, 0),
      add,
      remove,
      setQty,
      clear: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}
