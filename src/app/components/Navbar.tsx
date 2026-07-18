"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";

export default function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (mobileOpen) setMobileOpen(false);
  }

  useEffect(() => {
    if (mobileOpen) firstLinkRef.current?.focus();
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileOpen(false);
    }
  };

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

  const navLinkClass = (path: string) =>
    `text-sm transition-colors duration-150 ${
      isActive(path)
        ? "text-white font-medium"
        : "text-gray-400 hover:text-white"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-xl border-b border-white/10" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left */}
          <div className="flex items-center gap-8">
            <Link href="/" className="text-lg font-bold text-white tracking-tight hover:opacity-80 transition-opacity">
              E-Shop
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/products" className={navLinkClass("/products")}>Products</Link>
              {isAuthenticated && (
                <Link href="/orders" className={navLinkClass("/orders")}>My Orders</Link>
              )}
              {isAdmin && (
                <Link href="/admin/dashboard" className={navLinkClass("/admin")}>Admin</Link>
              )}
            </div>
          </div>

          {/* Center - Search */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center" role="search">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search products"
                className="bg-white/10 text-sm text-white placeholder-gray-500 rounded-full pl-10 pr-4 py-1.5 outline-none border border-white/10 focus:border-white/30 focus:bg-white/15 w-64 transition-all duration-200"
              />
            </div>
          </form>

          {/* Right */}
          <div className="hidden md:flex items-center gap-5">
            <Link href="/cart" className="relative text-sm text-gray-400 hover:text-white transition-colors duration-150">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121 0 2.09-.773 2.34-1.872l1.836-8.046A1.125 1.125 0 0018.054 3H5.106m2.394 11.25l-1.5-6h13.5" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2.5 bg-white text-gray-900 text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center leading-none">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link href="/profile" className="text-sm text-gray-400 hover:text-white transition-colors truncate max-w-[100px]">
                  {user?.name || user?.email || "Account"}
                </Link>
                <button onClick={logout} className="text-xs text-gray-500 hover:text-white border border-white/10 rounded-full px-3 py-1 hover:border-white/30 transition-all duration-150">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link href="/register" className="text-sm bg-white text-gray-900 rounded-full px-4 py-1.5 hover:bg-gray-200 transition-colors font-medium">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors relative w-10 h-10 flex items-center justify-center"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-current transition-all duration-300 origin-center ${mobileOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
              <span className={`w-full h-0.5 bg-current transition-all duration-300 ${mobileOpen ? "opacity-0 scale-x-0" : ""}`} />
              <span className={`w-full h-0.5 bg-current transition-all duration-300 origin-center ${mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        ref={menuRef}
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
          mobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
        onKeyDown={(e) => { if (e.key === "Escape") setMobileOpen(false); }}
      >
        <div className="px-4 py-4 border-t border-white/10 space-y-1">
          <form onSubmit={handleSearch} className="flex mb-3" role="search">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search products"
                className="w-full bg-white/10 text-sm text-white placeholder-gray-500 rounded-lg pl-10 pr-4 py-2 outline-none border border-white/10"
              />
            </div>
          </form>

          <Link ref={firstLinkRef} href="/products" className={`block py-2.5 text-sm ${isActive("/products") ? "text-white font-medium" : "text-gray-400 hover:text-white"} transition-colors`}>
            Products
          </Link>
          <Link href="/cart" className={`block py-2.5 text-sm ${isActive("/cart") ? "text-white font-medium" : "text-gray-400 hover:text-white"} transition-colors`}>
            Cart {totalItems > 0 && `(${totalItems})`}
          </Link>
          {isAuthenticated && (
            <>
              <Link href="/orders" className={`block py-2.5 text-sm ${isActive("/orders") ? "text-white font-medium" : "text-gray-400 hover:text-white"} transition-colors`}>
                My Orders
              </Link>
              <Link href="/profile" className={`block py-2.5 text-sm ${isActive("/profile") ? "text-white font-medium" : "text-gray-400 hover:text-white"} transition-colors`}>
                Profile
              </Link>
              {isAdmin && (
                <Link href="/admin/dashboard" className={`block py-2.5 text-sm ${isActive("/admin") ? "text-white font-medium" : "text-gray-400 hover:text-white"} transition-colors`}>
                  Admin Dashboard
                </Link>
              )}
              <button onClick={logout} className="block py-2.5 text-sm text-red-400 hover:text-red-300 transition-colors">
                Logout
              </button>
            </>
          )}
          {!isAuthenticated && (
            <div className="pt-2 flex gap-2">
              <Link href="/login" className="flex-1 text-center py-2.5 text-sm border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-white/30 transition-all">
                Sign In
              </Link>
              <Link href="/register" className="flex-1 text-center py-2.5 text-sm bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
