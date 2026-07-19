"use client";

import { memo, useRef, useCallback } from "react";
import { useCart } from "../context/CartContext";
import { CartItem as CartItemType } from "../lib/api";

function CartItem({ item }: { item: CartItemType }) {
  const { addToCart, removeFromCart, decreaseQuantity } = useCart();
  const product = item.product;
  const increaseRef = useRef(0);
  const decreaseRef = useRef(0);
  const inflightRef = useRef(false);

  const handleIncrease = useCallback(() => {
    if (inflightRef.current) return;
    const now = Date.now();
    if (now - increaseRef.current < 300) return;
    increaseRef.current = now;
    inflightRef.current = true;
    addToCart(product).finally(() => { inflightRef.current = false; });
  }, [addToCart, product]);

  const handleDecrease = useCallback(() => {
    if (inflightRef.current) return;
    const now = Date.now();
    if (now - decreaseRef.current < 300) return;
    decreaseRef.current = now;
    inflightRef.current = true;
    decreaseQuantity(product.id).finally(() => { inflightRef.current = false; });
  }, [decreaseQuantity, product.id]);

  if (!product) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-border rounded-2xl bg-card transition-all duration-200 hover:shadow-sm">
      {/* Image + Name */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-16 h-16 bg-muted/10 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-muted/40 text-xs">N/A</span>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-medium truncate">{product.name}</h3>
          <p className="text-xs text-muted mt-0.5">${(product.price ?? 0).toFixed(2)} each</p>
        </div>
      </div>

      {/* Quantity + Price + Remove */}
      <div className="flex items-center justify-between sm:justify-end gap-4">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleDecrease}
            className="w-8 h-8 flex items-center justify-center border border-border rounded-lg text-muted hover:text-foreground hover:border-muted transition-all duration-150 text-sm"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
          <button
            onClick={handleIncrease}
            className="w-8 h-8 flex items-center justify-center border border-border rounded-lg text-muted hover:text-foreground hover:border-muted transition-all duration-150 text-sm"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <p className="text-sm font-semibold min-w-[70px] text-right">
          ${((product.price ?? 0) * item.quantity).toFixed(2)}
        </p>

        <button
          onClick={() => removeFromCart(product.id)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-destructive hover:bg-destructive/10 transition-all duration-150"
          aria-label={`Remove ${product.name} from cart`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default memo(CartItem);
