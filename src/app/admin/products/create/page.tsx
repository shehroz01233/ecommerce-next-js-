"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AdminAPI } from "../../../lib/api";
import ProtectedRoute from "../../../components/ProtectedRoute";
import ProductForm from "../../../components/ProductForm";

export default function CreateProductPage() {
  return (
    <ProtectedRoute adminOnly>
      <CreateProductContent />
    </ProtectedRoute>
  );
}

function CreateProductContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (data: {
    name: string;
    price: number;
    description: string;
    image: string;
    category: string;
    stock: number;
  }) => {
    setLoading(true);
    setError("");

    try {
      await AdminAPI.createProduct(data);
      router.push("/admin/products");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-2xl font-bold text-foreground">Add New Product</h1>
        <p className="text-sm text-muted mt-1">Fill in the details to create a new product</p>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        submitLabel="Create Product"
        loading={loading}
        error={error}
      />
    </div>
  );
}
