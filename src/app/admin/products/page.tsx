"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { AdminAPI, Product } from "../../lib/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import { useToast } from "../../components/Toast";

export default function AdminProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { addToast } = useToast();
  const fetchRef = useRef(0);
  const refreshControllerRef = useRef<AbortController | null>(null);

  const fetchProducts = async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const data = await AdminAPI.getAllProducts(signal);
      if (signal?.aborted) return;
      let safe: Product[] = [];
      if (Array.isArray(data)) safe = data;
      else if (Array.isArray((data as Record<string, unknown>)?.products)) safe = (data as Record<string, unknown>).products as Product[];
      else if (Array.isArray((data as Record<string, unknown>)?.data)) safe = (data as Record<string, unknown>).data as Product[];
      setProducts(safe);
    } catch (err: unknown) {
      if (signal?.aborted) return;
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    /* eslint-disable react-hooks/set-state-in-effect -- initial data fetch */
    fetchProducts(controller.signal);
    return () => {
      controller.abort();
      refreshControllerRef.current?.abort();
    };
  }, []);

  const refresh = () => {
    refreshControllerRef.current?.abort();
    const id = ++fetchRef.current;
    const controller = new AbortController();
    refreshControllerRef.current = controller;
    fetchProducts(controller.signal).finally(() => {
      if (id === fetchRef.current) setLoading(false);
    });
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await AdminAPI.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      addToast("success", `"${name}" deleted`);
    } catch (err: unknown) {
      addToast("error", err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-destructive text-sm">{error}</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <EmptyState
          icon="📦"
          title="No products yet"
          description="Add your first product to get started."
          action={
            <Link
              href="/admin/products/create"
              className="btn-primary inline-flex items-center gap-2 px-5 py-2.5"
            >
              + Add Product
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-sm text-muted mt-1">{products.length} total product{products.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={refresh}
            className="btn-secondary px-4 py-2.5 hover:bg-muted/10 transition-colors"
          >
            Refresh
          </button>
          <Link
            href="/admin/products/create"
            className="btn-primary inline-flex items-center gap-2 px-4 py-2.5"
          >
            + Add Product
          </Link>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-muted/10 border-b border-border">
              <tr>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wider">Product</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wider">Category</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wider">Price</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wider">Stock</th>
                <th className="text-right px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-muted/5 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted/20 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-medium text-foreground">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted">{product.category || "-"}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-foreground">${(product.price ?? 0).toFixed(2)}</td>
                  <td className="px-5 py-3.5 text-sm text-muted">
                    {product.stock !== undefined ? (
                      <span className={product.stock > 0 ? "text-success" : "text-destructive"}>
                        {product.stock}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="btn-secondary px-3 py-1.5 hover:bg-muted/10 transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        disabled={deletingId === product.id}
                        className="px-3 py-1.5 text-xs font-medium bg-destructive/10 text-destructive rounded-xl hover:bg-destructive/20 disabled:opacity-50 transition-colors"
                      >
                        {deletingId === product.id ? "..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
