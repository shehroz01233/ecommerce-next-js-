"use client";

import Link from "next/link";
import { useCart } from "../../hooks/useCart";
import CartItem from "../../components/CartItem";
import EmptyState from "../../components/EmptyState";

export default function CartPage() {
  const { cart, totalPrice, totalItems, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          description="Add some products to get started!"
          action={
            <Link href="/products" className="btn-primary px-6">
              Browse Products
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-2xl font-bold text-foreground mb-1">Shopping Cart</h1>
      <p className="text-sm text-muted mb-8">{totalItems} item{totalItems !== 1 ? "s" : ""} in your cart</p>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="space-y-3">
            {cart.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </div>
        </div>

        <div className="lg:w-[340px] shrink-0">
          <div className="card p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold text-foreground mb-5">Order Summary</h2>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Subtotal ({totalItems} items)</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Shipping</span>
                <span className="font-medium text-success">Free</span>
              </div>
            </div>

            <div className="border-t border-border pt-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold">Total</span>
                <span className="text-base font-bold">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <Link href="/checkout" className="btn-primary w-full text-center block py-2.5">
                Proceed to Checkout
              </Link>
              <Link href="/products" className="btn-secondary w-full text-center block py-2.5">
                Continue Shopping
              </Link>
              <button
                onClick={() => { if (window.confirm("Remove all items from your cart?")) clearCart(); }}
                className="w-full text-center py-2 text-sm font-medium text-destructive transition-base hover:opacity-70"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
