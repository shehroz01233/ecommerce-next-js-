"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "../../hooks/useCart";
import { OrderAPI } from "../../lib/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutContent />
    </ProtectedRoute>
  );
}

function CheckoutContent() {
  const { cart, totalPrice, totalItems, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phone, setPhone] = useState("");

  if (cart.length === 0 && !success) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <EmptyState
          icon="🧾"
          title="Nothing to checkout"
          description="Your cart is empty. Add some products first."
          action={
            <Link href="/products" className="btn-primary px-6">
              Browse Products
            </Link>
          }
        />
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <EmptyState
          icon="🎉"
          title="Order Placed!"
          description={success}
          action={
            <div className="flex gap-3">
              <Link href="/orders" className="btn-primary px-6">
                View Orders
              </Link>
              <Link href="/products" className="btn-secondary px-6">
                Continue Shopping
              </Link>
            </div>
          }
        />
      </div>
    );
  }

  const handleCheckout = async () => {
    if (!address.trim() || !city.trim()) {
      setError("Please fill in your shipping address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const orderPayload = {
        items: cart.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
        shipping_address: {
          address: address.trim(),
          city: city.trim(),
          zip_code: zipCode.trim(),
          phone: phone.trim(),
        },
      };

      await OrderAPI.createOrder(orderPayload);
      await clearCart();
      setSuccess("Your order has been placed successfully! You will receive a confirmation soon.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-2xl font-bold text-foreground mb-8">Checkout</h1>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-6 text-sm text-destructive">{error}</div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-5">Shipping Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Address *</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main St"
                  autoComplete="street-address"
                  className="input"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">City *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="New York"
                    autoComplete="address-level2"
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">ZIP Code</label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="10001"
                    autoComplete="postal-code"
                    className="input"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  autoComplete="tel"
                  className="input"
                />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-5">Payment Method</h2>
            <div className="flex items-center gap-3.5 p-4 bg-muted/10 border border-border rounded-xl">
              <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Cash on Delivery</p>
                <p className="text-xs text-muted">Pay when your order arrives</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-[340px] shrink-0">
          <div className="card p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold text-foreground mb-5">Order Summary</h2>

            <div className="space-y-3 mb-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-muted truncate mr-2">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="font-medium whitespace-nowrap">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Shipping</span>
                <span className="text-success">Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-3 border-t border-border">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="btn-primary w-full mt-6 py-3 flex items-center justify-center gap-2"
            >
              {loading && <LoadingSpinner size="sm" />}
              {loading ? "Processing..." : `Place Order – $${totalPrice.toFixed(2)}`}
            </button>

            <p className="text-xs text-muted text-center mt-3">
              {totalItems} item{totalItems !== 1 ? "s" : ""} in your order
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
