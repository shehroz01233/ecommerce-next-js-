"use client";

import { useEffect, useState } from "react";
import { AdminAPI } from "../../lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await AdminAPI.getStats();
        setStats(data);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <h3 style={{ padding: "20px" }}>Loading dashboard...</h3>;
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
      <h1>📊 Admin Dashboard</h1>

      <div
        style={{
          display: "flex",
          gap: "15px",
          marginTop: "20px",
        }}
      >
        <div style={cardStyle}>
          <h2>{stats.totalProducts}</h2>
          <p>Total Products</p>
        </div>

        <div style={cardStyle}>
          <h2>{stats.totalOrders}</h2>
          <p>Total Orders</p>
        </div>

        <div style={cardStyle}>
          <h2>{stats.totalUsers}</h2>
          <p>Total Users</p>
        </div>
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  padding: "20px",
  background: "white",
  borderRadius: "10px",
  minWidth: "150px",
  textAlign: "center",
};