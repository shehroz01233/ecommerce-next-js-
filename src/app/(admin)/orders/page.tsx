"use client";

import { useEffect, useState } from "react";
import { AdminAPI } from "../../lib/api";

interface OrderItem {
  product_id: number;
  quantity: number;
}

interface Order {
  id: number;
  total: number;
  status: string;
  items: OrderItem[];
  created_at?: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const dashboard = await AdminAPI.getDashboard();
      const data = dashboard.orders ?? [];
      setOrders(data);
    } catch (err: any) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <h3 style={{ padding: "20px" }}>Loading orders...</h3>;
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
      <h1>📦 Admin Orders</h1>

      <div style={{ marginTop: "20px" }}>
        {orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              style={{
                padding: "15px",
                marginBottom: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            >
              <h3>Order #{order.id}</h3>

              <p>
                <b>Status:</b> {order.status}
              </p>

              <p>
                <b>Total:</b> ${order.total}
              </p>

              <p>
                <b>Items:</b>
              </p>

              <ul>
                {order.items.map(
                  (item, index) => (
                    <li key={index}>
                      Product ID:{" "}
                      {item.product_id} ×{" "}
                      {item.quantity}
                    </li>
                  )
                )}
              </ul>

              {order.created_at && (
                <p style={{ fontSize: "12px" }}>
                  {new Date(
                    order.created_at
                  ).toLocaleString()}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}