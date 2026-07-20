"use client";

import Link from "next/link";
import { useState, memo } from "react";
import { useCart } from "../hooks/useCart";
import { Product } from "../lib/api";
import { useToast } from "./Toast";

const ProductCard = memo(function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    if (adding) return;
    setAdding(true);
    try {
      await addToCart(product);
      addToast("success", `${product.name} added to cart`);
    } catch (err: unknown) {
      addToast("error", err instanceof Error ? err.message : "Failed to add");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="group p-3 border border-border rounded-2xl bg-card hover:shadow-lg hover:border-muted/50 transition-all duration-200 flex flex-col">
      <Link href={`/products/${product.id}`} className="block">
        <div className="aspect-[4/3] bg-muted/10 rounded-xl flex items-center justify-center overflow-hidden mb-3">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <span className="text-muted/40 text-sm">No Image</span>
          )}
        </div>
      </Link>

      <div className="flex-1 flex flex-col min-w-0">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-medium truncate group-hover:text-accent transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.category && (
          <span className="text-[11px] text-muted mt-0.5">{product.category}</span>
        )}

        <div className="flex items-center justify-between mt-2">
          <p className="text-base font-bold">${(product.price ?? 0).toFixed(2)}</p>
          {product.rating !== undefined && product.rating > 0 && (
            <span className="text-[11px] text-warning flex items-center gap-0.5">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              {product.rating.toFixed(1)}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={adding}
          className="mt-3 w-full py-2 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:opacity-90 active:scale-[0.98] disabled:opacity-50 transition-all duration-150"
        >
          {adding ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
});

export default ProductCard;
