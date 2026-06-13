"use client";

import { useState } from "react";
import { useCart } from "../../hooks/useCart";
import { OrderAPI } from "../../lib/api";

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (cart.length === 0) {
        setError("Cart is empty");
        setLoading(false);
        return;
      }

      const orderPayload = {
        items: cart.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
        total: totalPrice,
      };

      await OrderAPI.createOrder(orderPayload);

      clearCart();
      setSuccess("Order placed successfully 🎉");
    } catch (err: any) {
      setError(err.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🧾 Checkout</h1>

      {/* Order Summary */}
      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          background: "white",
          borderRadius: "8px",
        }}
      >
        <h3>Order Summary</h3>

        {cart.map((item) => (
          <div
            key={item.product.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "8px",
            }}
          >
            <span>
              {item.product.name} × {item.quantity}
            </span>
            <span>
              ${(item.product.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}

        <hr />

        <h2>Total: ${totalPrice.toFixed(2)}</h2>
      </div>

      {/* Messages */}
      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>
          {error}
        </p>
      )}

      {success && (
        <p style={{ color: "green", marginTop: "10px" }}>
          {success}
        </p>
      )}

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={loading}
        style={{
          marginTop: "15px",
          padding: "12px",
          width: "100%",
          background: "black",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        {loading ? "Processing..." : "Place Order"}
      </button>
    </div>
  );
}