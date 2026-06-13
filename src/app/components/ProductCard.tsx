"use client";

import Link from "next/link";
import { useCart } from "../hooks/useCart";

interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
}

export default function ProductCard({
  product,
}: {
  product: Product;
}) {
  const { addToCart } = useCart();

  return (
    <div
      style={{
        width: "200px",
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        background: "white",
      }}
    >
      {/* Image */}
      <div
        style={{
          height: "120px",
          background: "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "10px",
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

      {/* Name */}
      <h3 style={{ fontSize: "16px" }}>
        {product.name}
      </h3>

      {/* Price */}
      <p>
        <b>${product.price}</b>
      </p>

      {/* Buttons */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
        }}
      >
        {/* View Detail */}
        <Link
          href={`/product/${product.id}`}
          style={{
            textAlign: "center",
            padding: "6px",
            background: "#eee",
            textDecoration: "none",
            color: "black",
            borderRadius: "5px",
          }}
        >
          View
        </Link>

        {/* Add to Cart */}
        <button
          onClick={() => addToCart(product)}
          style={{
            padding: "6px",
            background: "black",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}