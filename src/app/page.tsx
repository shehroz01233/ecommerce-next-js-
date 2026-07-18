"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { ProductAPI, Product } from "./lib/api";
import ProductCard from "./components/ProductCard";
import ProductCardSkeleton from "./components/ProductCardSkeleton";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const fetchProducts = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError("");
    try {
      const res = await ProductAPI.getAll({ limit: 10 }, controller.signal);
      if (controller.signal.aborted) return;
      const list = Array.isArray(res) ? res : res?.products || [];
      setProducts(list);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- initial data fetch on mount */
    fetchProducts();
    return () => abortRef.current?.abort();
  }, [fetchProducts]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(120,119,198,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_left,_rgba(74,144,226,0.1),transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-gray-400 mb-4 tracking-wide uppercase">New Collection</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
              Shop the
              <br />
              <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                latest trends
              </span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-md">
              Discover curated products with quality you can trust and prices that make sense.
            </p>
            <div className="flex gap-3">
              <Link
                href="/products"
                className="bg-white text-gray-900 px-6 py-3 rounded-xl font-medium text-sm hover:bg-gray-100 active:scale-[0.98] transition-all duration-150"
              >
                Browse Products
              </Link>
              <Link
                href="/register"
                className="border border-white/20 text-white px-6 py-3 rounded-xl font-medium text-sm hover:bg-white/10 active:scale-[0.98] transition-all duration-150"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Featured Products</h2>
            <p className="text-sm text-muted mt-1">Handpicked for you</p>
          </div>
          {products.length > 0 && (
            <Link href="/products" className="text-sm text-muted hover:text-foreground transition-colors">
              View all →
            </Link>
          )}
        </div>

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {error && (
          <div className="card p-6 text-center">
            <p className="text-sm text-destructive mb-3">{error}</p>
            <button onClick={fetchProducts} className="btn-secondary px-4 py-2 text-xs">
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="card py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🛍️</span>
            </div>
            <h3 className="font-semibold mb-1">No products yet</h3>
            <p className="text-sm text-muted">Check back later for new arrivals!</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-bold mb-2">Ready to start shopping?</h2>
          <p className="text-sm text-muted mb-6">Create an account to track orders and save your favorites.</p>
          <Link href="/register" className="btn-primary inline-flex">
            Get Started — It&apos;s Free
          </Link>
        </div>
      </section>
    </div>
  );
}
