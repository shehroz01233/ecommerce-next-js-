"use client";

import { useCart } from "../context/CartContext";
import { CartItem as CartItemType } from "../lib/api";

function CartItem({ item }: { item: CartItemType }) {
  const { addToCart, removeFromCart, decreaseQuantity } = useCart();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-border rounded-2xl bg-card transition-all duration-200 hover:shadow-sm">
      {/* Image + Name */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-16 h-16 bg-muted/10 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
          {item.product.image ? (
            <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-muted/40 text-xs">N/A</span>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-medium truncate">{item.product.name}</h3>
          <p className="text-xs text-muted mt-0.5">${item.product.price.toFixed(2)} each</p>
        </div>
      </div>

      {/* Quantity + Price + Remove */}
      <div className="flex items-center justify-between sm:justify-end gap-4">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => decreaseQuantity(item.product.id)}
            className="w-8 h-8 flex items-center justify-center border border-border rounded-lg text-muted hover:text-foreground hover:border-muted transition-all duration-150 text-sm"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
          <button
            onClick={() => addToCart(item.product)}
            className="w-8 h-8 flex items-center justify-center border border-border rounded-lg text-muted hover:text-foreground hover:border-muted transition-all duration-150 text-sm"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <p className="text-sm font-semibold min-w-[70px] text-right">
          ${(item.product.price * item.quantity).toFixed(2)}
        </p>

        <button
          onClick={() => removeFromCart(item.product.id)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-destructive hover:bg-destructive/10 transition-all duration-150"
          aria-label={`Remove ${item.product.name} from cart`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default CartItem;
