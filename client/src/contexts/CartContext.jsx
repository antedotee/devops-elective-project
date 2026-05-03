import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "shopsmart-cart-v1";

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const count = useMemo(
    () => items.reduce((n, line) => n + line.qty, 0),
    [items],
  );

  const addItem = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const slug = product.slug;
      const idx = prev.findIndex((l) => l.slug === slug);
      if (idx === -1) {
        return [
          ...prev,
          {
            slug: product.slug,
            id: product.id,
            name: product.name,
            price_cents: product.price_cents,
            image_url: product.image_url,
            qty,
          },
        ];
      }
      const next = [...prev];
      next[idx] = { ...next[idx], qty: next[idx].qty + qty };
      return next;
    });
  }, []);

  const removeLine = useCallback((slug) => {
    setItems((prev) => prev.filter((l) => l.slug !== slug));
  }, []);

  const setQty = useCallback((slug, qty) => {
    const q = Math.max(0, Math.floor(Number(qty)));
    setItems((prev) => {
      if (q <= 0) return prev.filter((l) => l.slug !== slug);
      return prev.map((l) => (l.slug === slug ? { ...l, qty: q } : l));
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({ items, count, addItem, removeLine, setQty, clear }),
    [items, count, addItem, removeLine, setQty, clear],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
