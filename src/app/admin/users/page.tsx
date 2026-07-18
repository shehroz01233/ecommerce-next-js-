"use client";

import { useEffect, useState, useRef } from "react";
import { AdminAPI, User } from "../../lib/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";

export default function AdminUsersContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isCurrentRef = useRef(true);

  useEffect(() => {
    isCurrentRef.current = true;
    const controller = new AbortController();
    const fetchUsers = async () => {
      try {
        const data = await AdminAPI.getAllUsers(controller.signal);
        if (!isCurrentRef.current) return;
        if (Array.isArray(data)) {
          setUsers(data);
        }
      } catch (err: unknown) {
        if (!isCurrentRef.current) return;
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Failed to load users");
      } finally {
        if (isCurrentRef.current) setLoading(false);
      }
    };
    fetchUsers();
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <EmptyState icon="👥" title="No users found" description="User accounts will appear here." />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Users</h1>
        <p className="text-sm text-muted mt-1">{users.length} registered user{users.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead className="bg-muted/10 border-b border-border">
              <tr>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wider">ID</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wider">Email</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wider">Role</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-muted uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/5 transition-colors">
                  <td className="px-5 py-3.5 text-sm text-muted">#{user.id}</td>
                  <td className="px-5 py-3.5 text-sm font-medium text-foreground">{user.name}</td>
                  <td className="px-5 py-3.5 text-sm text-muted">{user.email}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {user.role || "user"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : "-"}
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
