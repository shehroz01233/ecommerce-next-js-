"use client";

import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { cart } = useCart();

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "15px 20px",
        background: "#111",
        color: "white",
        alignItems: "center",
      }}
    >
      {/* Left Side */}
      <div style={{ display: "flex", gap: "15px" }}>
        <Link href="/" style={{ color: "white" }}>
          Home
        </Link>

        <Link href="/products" style={{ color: "white" }}>
          Products
        </Link>

        <Link href="/cart" style={{ color: "white" }}>
          Cart ({cartCount})
        </Link>

        <Link href="/checkout" style={{ color: "white" }}>
          Checkout
        </Link>
      </div>

      {/* Right Side */}
      <div style={{ display: "flex", gap: "10px" }}>
        {isAuthenticated ? (
          <>
            <span>
              {user?.email || "User"}
            </span>

            <button
              onClick={logout}
              style={{
                padding: "6px 12px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              style={{ color: "white" }}
            >
              Login
            </Link>

            <Link
              href="/register"
              style={{ color: "white" }}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}