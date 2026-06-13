"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProductAPI } from "../../../lib/api";
import { useCart } from "../../../hooks/useCart";

interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const id = Number(params?.id);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await ProductAPI.getById(id);
        setProduct(data);
      } catch (err: any) {
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return <h3 style={{ padding: "20px" }}>Loading...</h3>;
  }

  if (error) {
    return (
      <h3 style={{ color: "red", padding: "20px" }}>
        {error}
      </h3>
    );
  }

  if (!product) {
    return <h3 style={{ padding: "20px" }}>Product not found</h3>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>{product.name}</h1>

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          background: "white",
          borderRadius: "10px",
          maxWidth: "500px",
        }}
      >
        {/* Image */}
        <div
          style={{
            height: "200px",
            background: "#eee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "15px",
          }}
        >
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              style={{
                maxHeight: "100%",
                maxWidth: "100%",
              }}
            />
          ) : (
            <span>No Image</span>
          )}
        </div>

        {/* Price */}
        <h2>${product.price}</h2>

        {/* Add to cart */}
        <button
          onClick={() => addToCart(product)}
          style={{
            padding: "10px",
            background: "black",
            color: "white",
            border: "none",
            cursor: "pointer",
            width: "100%",
            marginTop: "10px",
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}