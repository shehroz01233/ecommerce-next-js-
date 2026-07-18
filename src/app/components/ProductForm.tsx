"use client";

import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

interface ProductFormData {
  name: string;
  price: string;
  description: string;
  image: string;
  category: string;
  stock: string;
}

interface ProductFormProps {
  initialData?: ProductFormData;
  onSubmit: (data: {
    name: string;
    price: number;
    description: string;
    image: string;
    category: string;
    stock: number;
  }) => Promise<void>;
  submitLabel: string;
  loading: boolean;
  error: string;
}

const defaultData: ProductFormData = {
  name: "",
  price: "",
  description: "",
  image: "",
  category: "",
  stock: "",
};

export default function ProductForm({
  initialData,
  onSubmit,
  submitLabel,
  loading,
  error,
}: ProductFormProps) {
  const [form, setForm] = useState<ProductFormData>(initialData || defaultData);
  const [imgError, setImgError] = useState(false);
  const [prevInitialData, setPrevInitialData] = useState(initialData);
  if (prevInitialData !== initialData) {
    setPrevInitialData(initialData);
    if (initialData) {
      setForm(initialData);
      setImgError(false);
    } else {
      setForm(defaultData);
      setImgError(false);
    }
  }

  const update = (field: keyof ProductFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "image") setImgError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const priceNum = Number(form.price);
    if (!form.name.trim() || !form.price || isNaN(priceNum) || priceNum <= 0) return;

    const stockNum = form.stock ? Number(form.stock) : 0;

    await onSubmit({
      name: form.name.trim(),
      price: priceNum,
      description: form.description.trim(),
      image: form.image.trim(),
      category: form.category.trim(),
      stock: isNaN(stockNum) ? 0 : Math.max(0, stockNum),
    });
  };

  return (
    <div className="card p-6">
      {error && (
        <div className="bg-red-500/10 border border-red-200 rounded-xl p-3.5 text-red-600 text-sm mb-5 flex items-center gap-2.5">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="pf-name" className="block text-sm font-medium text-foreground mb-1.5">Product Name *</label>
          <input
            id="pf-name"
            type="text"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="e.g. Wireless Headphones"
            className="input focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="pf-price" className="block text-sm font-medium text-foreground mb-1.5">Price ($) *</label>
            <input
              id="pf-price"
              type="number"
              required
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              placeholder="0.00"
              className="input focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label htmlFor="pf-stock" className="block text-sm font-medium text-foreground mb-1.5">Stock</label>
            <input
              id="pf-stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => update("stock", e.target.value)}
              placeholder="0"
              className="input focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div>
          <label htmlFor="pf-category" className="block text-sm font-medium text-foreground mb-1.5">Category</label>
          <input
            id="pf-category"
            type="text"
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            placeholder="e.g. Electronics"
            className="input focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label htmlFor="pf-image" className="block text-sm font-medium text-foreground mb-1.5">Image URL</label>
          <input
            id="pf-image"
            type="url"
            value={form.image}
            onChange={(e) => update("image", e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="input focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
          {form.image && !imgError && (
            <div className="mt-3 w-28 h-28 bg-muted/20 rounded-2xl overflow-hidden border border-border">
              <img
                src={form.image}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            </div>
          )}
        </div>

        <div>
          <label htmlFor="pf-description" className="block text-sm font-medium text-foreground mb-1.5">Description</label>
          <textarea
            id="pf-description"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Product description..."
            rows={3}
            className="input focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 py-2.5 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
          >
            {loading && <LoadingSpinner size="sm" />}
            {loading ? `${submitLabel}...` : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
