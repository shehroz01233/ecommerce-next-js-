"use client";

import { useEffect, useState } from "react";
import { AdminAPI, Order } from "../../lib/api";
import { statusColor } from "../../lib/utils";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import { useToast } from "../../components/Toast";

export default function AdminOrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const { addToast } = useToast();

  const fetchOrders = async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const data = await AdminAPI.getAllOrders(signal);
      if (signal?.aborted) return;
      if (Array.isArray(data)) {
        setOrders(data.sort((a, b) => (b.id || 0) - (a.id || 0)));
      } else {
        const dashboard = await AdminAPI.getDashboard(signal);
        if (signal?.aborted) return;
        setOrders((dashboard?.orders || []).sort((a: Order, b: Order) => (b.id || 0) - (a.id || 0)));
      }
    } catch (err: unknown) {
      if (signal?.aborted) return;
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    /* eslint-disable react-hooks/set-state-in-effect -- initial data fetch */
    fetchOrders(controller.signal);
    return () => controller.abort();
  }, []);

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await AdminAPI.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      addToast("success", `Order #${orderId} updated to "${newStatus}"`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update status";
      addToast("error", msg);
    } finally {
      setUpdatingId(null);
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

  if (orders.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <EmptyState icon="📦" title="No orders yet" description="Orders will appear here when customers start purchasing." />
      </div>
    );
  }

  const statusOptions = ["pending", "processing", "shipped", "delivered", "cancelled"];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orders</h1>
          <p className="text-sm text-muted mt-1">{orders.length} total order{orders.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => fetchOrders()}
          className="btn-secondary px-4 py-2.5 hover:bg-muted/10 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-muted/10 border-b border-border">
              <tr>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wider">Order</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wider">User</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wider">Items</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wider">Total</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/5 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-medium text-foreground">#{order.id}</td>
                  <td className="px-5 py-3.5 text-sm text-muted">User #{order.user_id || "-"}</td>
                  <td className="px-5 py-3.5 text-sm text-muted">
                    {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? "s" : ""}
                  </td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-foreground">${(order.total ?? 0).toFixed(2)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusColor(order.status || "pending")}`}>
                      {order.status || "Pending"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted">
                    {order.created_at ? new Date(order.created_at).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-5 py-3.5">
                    <select
                      value={order.status || "pending"}
                      onChange={(e) => {
                        const newStatus = e.target.value;
                        if (window.confirm(`Change order status to "${newStatus}"?`)) {
                          handleStatusUpdate(order.id, newStatus);
                        }
                      }}
                      disabled={updatingId === order.id}
                      className="input text-xs py-1.5 px-2.5 w-auto bg-card disabled:opacity-50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
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
