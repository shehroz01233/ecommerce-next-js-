// "use client";

// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   ReactNode,
// } from "react";

// interface Product {
//   id: number;
//   name: string;
//   price: number;
//   image?: string;
// }

// interface CartItem {
//   product: Product;
//   quantity: number;
// }

// interface CartContextType {
//   cart: CartItem[];
//   addToCart: (product: Product) => void;
//   removeFromCart: (productId: number) => void;
//   increaseQty: (productId: number) => void;
//   decreaseQty: (productId: number) => void;
//   clearCart: () => void;
//   totalPrice: number;
// }

// const CartContext = createContext<CartContextType | null>(null);

// export function CartProvider({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   const [cart, setCart] = useState<CartItem[]>([]);

//   // Load cart from localStorage
//   useEffect(() => {
//     const stored = localStorage.getItem("cart");
//     if (stored) setCart(JSON.parse(stored));
//   }, []);

//   // Save cart to localStorage
//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cart));
//   }, [cart]);

//   const addToCart = (product: Product) => {
//     setCart((prev) => {
//       const existing = prev.find(
//         (item) => item.product.id === product.id
//       );

//       if (existing) {
//         return prev.map((item) =>
//           item.product.id === product.id
//             ? {
//                 ...item,
//                 quantity: item.quantity + 1,
//               }
//             : item
//         );
//       }

//       return [...prev, { product, quantity: 1 }];
//     });
//   };

//   const removeFromCart = (productId: number) => {
//     setCart((prev) =>
//       prev.filter(
//         (item) => item.product.id !== productId
//       )
//     );
//   };

//   const increaseQty = (productId: number) => {
//     setCart((prev) =>
//       prev.map((item) =>
//         item.product.id === productId
//           ? {
//               ...item,
//               quantity: item.quantity + 1,
//             }
//           : item
//       )
//     );
//   };

//   const decreaseQty = (productId: number) => {
//     setCart((prev) =>
//       prev
//         .map((item) =>
//           item.product.id === productId
//             ? {
//                 ...item,
//                 quantity: item.quantity - 1,
//               }
//             : item
//         )
//         .filter((item) => item.quantity > 0)
//     );
//   };

//   const clearCart = () => {
//     setCart([]);
//   };

//   const totalPrice = cart.reduce(
//     (sum, item) =>
//       sum + item.product.price * item.quantity,
//     0
//   );

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         addToCart,
//         removeFromCart,
//         increaseQty,
//         decreaseQty,
//         clearCart,
//         totalPrice,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }

// export function useCartContext() {
//   const context = useContext(CartContext);

//   if (!context) {
//     throw new Error(
//       "useCartContext must be used inside CartProvider"
//     );
//   }

//   return context;
// }


"use client";

import { createContext, useContext, useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  image?: string;
};

type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  decreaseQuantity: (id: number) => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // ✅ ADD TO CART FIXED
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);

      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((i) => i.product.id !== id));
  };

  const decreaseQuantity = (id: number) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.product.id === id
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, decreaseQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}