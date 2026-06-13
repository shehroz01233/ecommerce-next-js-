"use client";

import { useEffect, useState } from "react";
import { ProductAPI } from "../../lib/api";
import ProductCard from "../../components/ProductCard";

interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await ProductAPI.getAll();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <h3 style={{ padding: "20px" }}>
        Loading products...
      </h3>
    );
  }

  if (error) {
    return (
      <h3 style={{ color: "red", padding: "20px" }}>
        {error}
      </h3>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>🛍️ All Products</h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
          marginTop: "20px",
        }}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </div>
  );
}