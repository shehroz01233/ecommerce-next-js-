"use client";

import { useCart } from "../../hooks/useCart";
import CartItem from "../../components/CartItem";

export default function CartPage() {
  const { cart, totalPrice, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Your cart is empty 🛒</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>🛒 Your Cart</h1>

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {cart.map((item) => (
          <CartItem
            key={item.product.id}
            item={item}
          />
        ))}
      </div>

      {/* Total Section */}
      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          background: "white",
          borderRadius: "8px",
        }}
      >
        <h2>Total: ${totalPrice.toFixed(2)}</h2>

        <button
          onClick={clearCart}
          style={{
            padding: "10px",
            marginTop: "10px",
            background: "red",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}