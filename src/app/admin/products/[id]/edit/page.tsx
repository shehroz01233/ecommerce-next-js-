"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ProductAPI, AdminAPI } from "../../../../lib/api";
import ProtectedRoute from "../../../../components/ProtectedRoute";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import ProductForm from "../../../../components/ProductForm";

export default function EditProductPage() {
  return (
    <ProtectedRoute adminOnly>
      <EditProductContent />
    </ProtectedRoute>
  );
}

function EditProductContent() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id);

  const [initialData, setInitialData] = useState<{
    name: string;
    price: string;
    description: string;
    image: string;
    category: string;
    stock: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    const fetchProduct = async () => {
      try {
        const product = await ProductAPI.getById(id);
        setInitialData({
          name: product.name || "",
          price: String(product.price || ""),
          description: product.description || "",
          image: product.image || "",
          category: product.category || "",
          stock: product.stock !== undefined ? String(product.stock) : "",
        });
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    return () => controller.abort();
  }, [id]);

  const handleSubmit = async (data: {
    name: string;
    price: number;
    description: string;
    image: string;
    category: string;
    stock: number;
  }) => {
    setSaving(true);
    setError("");

    try {
      await AdminAPI.updateProduct(id, data);
      router.push("/admin/products");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="text-sm text-muted hover:text-foreground transition-colors inline-flex items-center gap-1.5 mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to products
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Edit Product #{id}</h1>
            <p className="text-sm text-muted mt-1">Update product details below</p>
          </div>
          <Link
            href={`/products/${id}`}
            target="_blank"
            className="btn-secondary px-4 py-2.5 inline-flex items-center gap-2 hover:bg-muted/10 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View Product
          </Link>
        </div>
      </div>

      {initialData && (
        <ProductForm
          initialData={initialData}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
          loading={saving}
          error={error}
        />
      )}
    </div>
  );
}
