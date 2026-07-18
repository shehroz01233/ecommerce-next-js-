"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const passwordStrength = useMemo(() => {
    if (!password) return { level: 0, label: "", color: "bg-muted/20", width: "0%" };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { level: 1, label: "Weak", color: "bg-destructive", width: "25%" };
    if (score <= 2) return { level: 2, label: "Fair", color: "bg-orange-500", width: "50%" };
    if (score <= 3) return { level: 3, label: "Good", color: "bg-yellow-500", width: "75%" };
    return { level: 4, label: "Strong", color: "bg-success", width: "100%" };
  }, [password]);

  useEffect(() => {
    if (isAuthenticated) router.push("/");
  }, [isAuthenticated, router]);
  if (isAuthenticated) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least 1 uppercase letter");
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least 1 number");
      return;
    }

    setLoading(true);

    try {
      await register({ name, email, password });
      setSuccess("Account created! Redirecting to login...");
      timerRef.current = setTimeout(() => router.push("/login"), 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-2xl font-bold tracking-tight text-foreground transition-base hover:opacity-80">
            E-Shop
          </Link>
        </div>

        <div className="card p-8 shadow-lg shadow-black/5">
          <h2 className="text-xl font-bold text-foreground text-center mb-1">Create account</h2>
          <p className="text-sm text-muted text-center mb-6">Get started with E-Shop</p>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 text-destructive text-sm mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-success/10 border border-success/20 rounded-xl p-3 text-success text-sm mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
              <input
                type="text"
                required
                autoComplete="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <input
                type="password"
                required
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
              />
              {password && (
                <div className="mt-2.5 space-y-1.5">
                  <div className="h-1 w-full bg-muted/20 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: passwordStrength.width }}
                    />
                  </div>
                  <p className={`text-xs ${
                    passwordStrength.level <= 1 ? "text-destructive" :
                    passwordStrength.level <= 2 ? "text-orange-500" :
                    passwordStrength.level <= 3 ? "text-yellow-500" :
                    "text-success"
                  }`}>
                    {passwordStrength.label}
                  </p>
                </div>
              )}
              <p className="text-xs text-muted mt-1">Min 8 characters, 1 uppercase, 1 number</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Confirm Password</label>
              <input
                type="password"
                required
                autoComplete="new-password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-2.5"
            >
              {loading && <LoadingSpinner size="sm" />}
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-foreground font-medium transition-base hover:opacity-70">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
