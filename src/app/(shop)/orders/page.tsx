"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { OrderAPI, Order } from "../../lib/api";
import { statusColor } from "../../lib/utils";
import ProtectedRoute from "../../components/ProtectedRoute";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersContent />
    </ProtectedRoute>
  );
}

function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const isCurrentRef = useRef(true);

  useEffect(() => {
    isCurrentRef.current = true;
    const controller = new AbortController();
    const fetchOrders = async () => {
      try {
        const data = await OrderAPI.getUserOrders(controller.signal);
        if (!isCurrentRef.current) return;
        if (Array.isArray(data)) {
          setOrders(data.sort((a, b) => (b.id || 0) - (a.id || 0)));
        }
      } catch (err: unknown) {
        if (!isCurrentRef.current) return;
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Failed to load orders");
      } finally {
        if (isCurrentRef.current) setLoading(false);
      }
    };
    fetchOrders();
    return () => {
      isCurrentRef.current = false;
      controller.abort();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-destructive text-sm">{error}</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <EmptyState
          icon="📦"
          title="No orders yet"
          description="Your order history will appear here after you make a purchase."
          action={
            <Link href="/products" className="btn-primary px-6">
              Start Shopping
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-2xl font-bold text-foreground mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="card overflow-hidden">
            <button
              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              aria-expanded={expandedOrder === order.id}
              className="w-full flex items-center justify-between p-5 text-left transition-base hover:bg-muted/10"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-muted/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Order #{order.id}</p>
                  {order.created_at && (
                    <p className="text-xs text-muted mt-0.5">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusColor(order.status)}`}>
                  {order.status || "Pending"}
                </span>
                <span className="font-bold text-foreground">${(order.total ?? 0).toFixed(2)}</span>
                <svg
                  aria-hidden="true"
                  className={`w-5 h-5 text-muted transition-transform duration-200 ${expandedOrder === order.id ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                expandedOrder === order.id ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="border-t border-border px-5 pb-5 pt-4">
                <h4 className="text-sm font-medium text-muted mb-3">Items</h4>
                <div className="space-y-2.5">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-muted/10 flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <div className="truncate">
                          <span className="text-foreground">Product #{item.product_id}</span>
                          {item.product_name && (
                            <span className="text-muted ml-1.5">({item.product_name})</span>
                          )}
                        </div>
                      </div>
                      <div className="text-muted shrink-0 ml-4">
                        × {item.quantity}
                        {item.price && <span className="ml-2 font-medium text-foreground">${(item.price * item.quantity).toFixed(2)}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
