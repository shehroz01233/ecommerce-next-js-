"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { AdminAPI, DashboardStats } from "../../lib/api";
import { statusColor } from "../../lib/utils";
import LoadingSpinner from "../../components/LoadingSpinner";

const StatIcons = {
  products: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  orders: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  ),
  users: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  revenue: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
} as const;

const QuickActionIcons = {
  add: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
    </svg>
  ),
  orders: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  edit: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
} as const;

export default function AdminDashboardContent() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isCurrentRef = useRef(true);

  useEffect(() => {
    isCurrentRef.current = true;
    const controller = new AbortController();
    const fetchStats = async () => {
      try {
        const data = await AdminAPI.getStats(controller.signal);
        if (!isCurrentRef.current) return;
        setStats(data);
      } catch (err: unknown) {
        if (!isCurrentRef.current) return;
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        if (isCurrentRef.current) setLoading(false);
      }
    };
    fetchStats();
    return () => {
      isCurrentRef.current = false;
      controller.abort();
    };
  }, []);

  const statCards = useMemo(() => [
    {
      label: "Products",
      value: stats?.totalProducts ?? 0,
      link: "/admin/products",
      gradient: "from-blue-500/10 to-blue-600/5",
      iconColor: "text-blue-600",
      icon: StatIcons.products,
    },
    {
      label: "Orders",
      value: stats?.totalOrders ?? 0,
      link: "/admin/orders",
      gradient: "from-emerald-500/10 to-emerald-600/5",
      iconColor: "text-emerald-600",
      icon: StatIcons.orders,
    },
    {
      label: "Users",
      value: stats?.totalUsers ?? 0,
      link: "/admin/users",
      gradient: "from-purple-500/10 to-purple-600/5",
      iconColor: "text-purple-600",
      icon: StatIcons.users,
    },
    {
      label: "Revenue",
      value: stats?.totalRevenue ?? 0,
      prefix: "$",
      link: "/admin/orders",
      gradient: "from-amber-500/10 to-amber-600/5",
      iconColor: "text-amber-600",
      icon: StatIcons.revenue,
    },
  ], [stats?.totalProducts, stats?.totalOrders, stats?.totalUsers, stats?.totalRevenue]);

  const quickActions = useMemo(() => [
    {
      label: "Add Product",
      link: "/admin/products/create",
      icon: QuickActionIcons.add,
    },
    {
      label: "View Orders",
      link: "/admin/orders",
      icon: QuickActionIcons.orders,
    },
    {
      label: "Manage Products",
      link: "/admin/products",
      icon: QuickActionIcons.edit,
    },
  ], []);

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
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted mt-1">Overview of your store</p>
        </div>
        <button
          onClick={() => router.push("/admin/products/create")}
          className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl hover:opacity-90 text-sm font-medium transition-opacity"
        >
          + Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <button
            key={stat.label}
            onClick={() => router.push(stat.link)}
            className={`text-left p-5 rounded-2xl border border-border bg-gradient-to-br ${stat.gradient} hover:shadow-md transition-all duration-200`}
          >
            <div className={`w-10 h-10 rounded-xl bg-muted/20 flex items-center justify-center ${stat.iconColor} mb-3`}>
              {stat.icon}
            </div>
            <p className="text-3xl font-bold text-foreground">
              {stat.prefix || ""}
              {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
            </p>
            <p className="text-sm text-muted mt-1">{stat.label}</p>
          </button>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => router.push(action.link)}
              className="card flex items-center gap-3 p-4 bg-card hover:bg-muted/10 transition-colors text-left"
            >
              <span className="w-9 h-9 rounded-xl bg-muted/10 flex items-center justify-center text-muted flex-shrink-0">
                {action.icon}
              </span>
              <span className="text-sm font-medium text-foreground">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {stats?.recentOrders && stats.recentOrders.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Orders</h2>
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/10">
                <tr>
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wider">Order</th>
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wider">Total</th>
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/5 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-medium text-foreground">#{order.id}</td>
                    <td className="px-5 py-3.5 text-sm text-foreground">${order.total?.toFixed(2)}</td>
                    <td className="px-5 py-3.5 text-sm">
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusColor(order.status || "pending")}`}>
                        {order.status || "Pending"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-muted">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString() : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
