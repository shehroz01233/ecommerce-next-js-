"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  ReactNode,
} from "react";

import { CartAPI, Product } from "../lib/api";
import { getToken } from "../lib/auth";

type CartItemData = {
  id?: number;
  product: Product;
  quantity: number;
};

type CartContextType = {
  cart: CartItemData[];
  loading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  decreaseQuantity: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalPrice: number;
  totalItems: number;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItemData[]>([]);
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const initializedRef = useRef(false);
  const cartRef = useRef<CartItemData[]>([]);

  useEffect(() => { cartRef.current = cart; });

  const loadLocalCart = useCallback((): CartItemData[] => {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  const saveLocalCart = useCallback((items: CartItemData[]) => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, []);

  const syncLocalToServer = useCallback(
    async (localCart: CartItemData[]) => {
      const failed: CartItemData[] = [];
      for (const item of localCart) {
        try {
          await CartAPI.addItem({
            product_id: item.product.id,
            quantity: item.quantity,
          });
        } catch {
          failed.push(item);
        }
      }
      if (failed.length === 0) {
        localStorage.removeItem("cart");
      } else {
        localStorage.setItem("cart", JSON.stringify(failed));
      }
    },
    []
  );

  const refreshCart = useCallback(async () => {
    if (!getToken()) return;
    setLoading(true);
    try {
      const data = await CartAPI.getCart();
      if (Array.isArray(data)) {
        setCart(data);
      } else if (Array.isArray((data as Record<string, unknown>)?.items)) {
        setCart((data as Record<string, unknown>).items as CartItemData[]);
      }
    } catch {
      // backend may not support cart endpoint, keep local
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const initCart = async () => {
      const token = getToken();
      const localCart = loadLocalCart();

      try {
        if (token) {
          if (localCart.length > 0) {
            await syncLocalToServer(localCart);
            await refreshCart();
          } else {
            await refreshCart();
          }
        } else {
          setCart(localCart);
        }
      } finally {
        setHydrated(true);
      }
    };
    initCart();
  }, [loadLocalCart, syncLocalToServer, refreshCart]);

  useEffect(() => {
    if (!hydrated) return;
    const token = getToken();
    if (!token) {
      try { saveLocalCart(cart); } catch { /* quota exceeded */ }
    }
  }, [cart, hydrated, saveLocalCart]);

  const addToCart = useCallback(
    async (product: Product, quantity = 1) => {
      const token = getToken();
      if (token) {
        try {
          await CartAPI.addItem({ product_id: product.id, quantity });
          await refreshCart();
          return;
        } catch {
          setCart((cur) => {
            const existing = cur.find((i) => i.product.id === product.id);
            const next = existing
              ? cur.map((i) =>
                  i.product.id === product.id
                    ? { ...i, quantity: i.quantity + quantity }
                    : i
                )
              : [...cur, { product, quantity }];
            try { saveLocalCart(next); } catch { /* quota */ }
            return next;
          });
          return;
        }
      }

      setCart((cur) => {
        const existing = cur.find((i) => i.product.id === product.id);
        const next = existing
          ? cur.map((i) =>
              i.product.id === product.id
                ? { ...i, quantity: i.quantity + quantity }
                : i
            )
          : [...cur, { product, quantity }];
        try { saveLocalCart(next); } catch { /* quota */ }
        return next;
      });
    },
    [refreshCart, saveLocalCart]
  );

  const removeFromCart = useCallback(
    async (productId: number) => {
      const token = getToken();
      const item = cartRef.current.find((i) => i.product.id === productId);

      if (token && item?.id) {
        try {
          await CartAPI.removeItem(item.id);
          await refreshCart();
          return;
        } catch {
          setCart((cur) => {
            const next = cur.filter((i) => i.product.id !== productId);
            try { saveLocalCart(next); } catch { /* quota */ }
            return next;
          });
          return;
        }
      }

      setCart((cur) => {
        const next = cur.filter((i) => i.product.id !== productId);
        try { saveLocalCart(next); } catch { /* quota */ }
        return next;
      });
    },
    [refreshCart, saveLocalCart]
  );

  const decreaseQuantity = useCallback(
    async (productId: number) => {
      const item = cartRef.current.find((i) => i.product.id === productId);
      if (!item) return;

      if (item.quantity <= 1) {
        return removeFromCart(productId);
      }

      const token = getToken();
      if (token && item.id) {
        try {
          await CartAPI.updateItem(item.id, item.quantity - 1);
          await refreshCart();
          return;
        } catch {
          setCart((cur) => {
            const next = cur.map((i) =>
              i.product.id === productId
                ? { ...i, quantity: i.quantity - 1 }
                : i
            );
            try { saveLocalCart(next); } catch { /* quota */ }
            return next;
          });
          return;
        }
      }

      setCart((cur) => {
        const next = cur.map((i) =>
          i.product.id === productId
            ? { ...i, quantity: i.quantity - 1 }
            : i
        );
        try { saveLocalCart(next); } catch { /* quota */ }
        return next;
      });
    },
    [removeFromCart, refreshCart, saveLocalCart]
  );

  const updateQuantity = useCallback(
    async (productId: number, quantity: number) => {
      if (quantity < 1) return removeFromCart(productId);

      const item = cartRef.current.find((i) => i.product.id === productId);
      if (!item) return;

      const token = getToken();
      if (token && item.id) {
        try {
          await CartAPI.updateItem(item.id, quantity);
          await refreshCart();
          return;
        } catch {
          setCart((cur) => {
            const next = cur.map((i) =>
              i.product.id === productId ? { ...i, quantity } : i
            );
            try { saveLocalCart(next); } catch { /* quota */ }
            return next;
          });
          return;
        }
      }

      setCart((cur) => {
        const next = cur.map((i) =>
          i.product.id === productId ? { ...i, quantity } : i
        );
        try { saveLocalCart(next); } catch { /* quota */ }
        return next;
      });
    },
    [removeFromCart, refreshCart, saveLocalCart]
  );

  const clearCart = useCallback(async () => {
    const token = getToken();
    if (token) {
      try {
        await CartAPI.clear();
      } catch {
        // Server failed — clear locally but also save empty to localStorage
        // so the next refresh doesn't restore stale items
      }
    }
    setCart([]);
    try { localStorage.removeItem("cart"); } catch { /* ignore */ }
  }, []);

  const totalPrice = useMemo(
    () => Math.round(cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0) * 100) / 100,
    [cart]
  );

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        updateQuantity,
        clearCart,
        totalPrice,
        totalItems,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
