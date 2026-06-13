"use client";

import { useCart } from "../hooks/useCart";

interface CartItemType {
  product: {
    id: number;
    name: string;
    price: number;
    image?: string;
  };
  quantity: number;
}

export default function CartItem({
  item,
}: {
  item: CartItemType;
}) {
  const {
    addToCart,
    removeFromCart,
    decreaseQuantity,
  } = useCart();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        background: "white",
      }}
    >
      {/* Product Info */}
      <div>
        <h3>{item.product.name}</h3>
        <p>${item.product.price}</p>
      </div>

      {/* Quantity Controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <button
          onClick={() =>
            decreaseQuantity(item.product.id)
          }
          style={{
            padding: "5px 10px",
            cursor: "pointer",
          }}
        >
          -
        </button>

        <span>{item.quantity}</span>

        <button
          onClick={() =>
            addToCart(item.product)
          }
          style={{
            padding: "5px 10px",
            cursor: "pointer",
          }}
        >
          +
        </button>
      </div>

      {/* Remove Button */}
      <button
        onClick={() =>
          removeFromCart(item.product.id)
        }
        style={{
          background: "red",
          color: "white",
          border: "none",
          padding: "6px",
          cursor: "pointer",
        }}
      >
        Remove
      </button>
    </div>
  );
}