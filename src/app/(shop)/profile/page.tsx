"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { UserAPI } from "../../lib/api";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useToast } from "../../components/Toast";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const { user, updateUser, logout } = useAuth();
  const router = useRouter();
  const { addToast } = useToast();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      const updated = await UserAPI.updateProfile({ name: name.trim() });
      updateUser(updated);
      addToast("success", "Profile updated!");
    } catch (err: unknown) {
      addToast("error", err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-2xl font-bold text-foreground mb-8">My Account</h1>

      <div className="card p-6 mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-5">Profile Information</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled
              className="input opacity-60 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Role</label>
            <input
              type="text"
              value={user?.role || "user"}
              disabled
              className="input opacity-60 cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-6"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      <div className="card p-6 mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-5">Quick Links</h2>
        <div className="space-y-2">
          <button
            onClick={() => router.push("/orders")}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground rounded-xl transition-base hover:bg-muted/10"
          >
            <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            My Orders
          </button>
          <button
            onClick={() => router.push("/cart")}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground rounded-xl transition-base hover:bg-muted/10"
          >
            <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            My Cart
          </button>
          {user?.role === "admin" && (
            <button
              onClick={() => router.push("/admin/dashboard")}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground rounded-xl transition-base hover:bg-muted/10"
            >
              <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Admin Dashboard
            </button>
          )}
        </div>
      </div>

      <div className="card p-6">
        <button
          onClick={logout}
          className="btn-secondary w-full text-destructive border-destructive/20 hover:bg-destructive/10"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
