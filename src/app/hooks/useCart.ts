"use client";

import { useState, useEffect } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      setCart(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ADD TO CART
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id
      );

      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [...prev, { product, quantity: 1 }];
    });
  };

  // REMOVE ITEM
  const removeFromCart = (id: number) => {
    setCart((prev) =>
      prev.filter(
        (item) => item.product.id !== id
      )
    );
  };

  // DECREASE QUANTITY
  const decreaseQuantity = (id: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === id) {
            return {
              ...item,
              quantity: item.quantity - 1,
            };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  // TOTAL PRICE
  const totalPrice = cart.reduce(
    (sum, item) =>
      sum + item.product.price * item.quantity,
    0
  );

  // CLEAR CART
  const clearCart = () => setCart([]);

  return {
    cart,
    addToCart,
    removeFromCart,
    decreaseQuantity,
    totalPrice,
    clearCart,
  };
}