"use client";

import { Suspense, useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ProductAPI, Product } from "../../lib/api";
import ProductCard from "../../components/ProductCard";
import ProductCardSkeleton from "../../components/ProductCardSkeleton";

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [categories, setCategories] = useState<string[]>([]);
  const [sort, setSort] = useState(searchParams.get("sort") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const fetchIdRef = useRef(0);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(searchTimerRef.current);
  }, [search]);

  useEffect(() => {
    const id = ++fetchIdRef.current;
    setLoading(true);
    setError("");

    const controller = new AbortController();
    ProductAPI.getAll({
      search: debouncedSearch || undefined,
      category: category || undefined,
      sort: sort || undefined,
      page,
      limit: 12,
    }, controller.signal)
      .then((res) => {
        if (id !== fetchIdRef.current) return;
        setLoading(false);
        if (Array.isArray(res)) {
          setProducts(res);
          setTotalPages(1);
        } else {
          setProducts(res.products || []);
          setTotalPages(res.pages || 1);
        }
      })
      .catch((err: unknown) => {
        if (id !== fetchIdRef.current) return;
        setLoading(false);
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Failed to load products");
      });

    return () => { controller.abort(); };
  }, [debouncedSearch, category, sort, page]);

  useEffect(() => {
    const controller = new AbortController();
    ProductAPI.getCategories(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const pushURL = useCallback((overrides: { search?: string; category?: string; sort?: string; page?: number }) => {
    const params = new URLSearchParams();
    const s = overrides.search !== undefined ? overrides.search : search;
    const c = overrides.category !== undefined ? overrides.category : category;
    const so = overrides.sort !== undefined ? overrides.sort : sort;
    const p = overrides.page !== undefined ? overrides.page : 1;
    if (s) params.set("search", s);
    if (c) params.set("category", c);
    if (so) params.set("sort", so);
    if (p > 1) params.set("page", String(p));
    router.push(`/products?${params.toString()}`);
  }, [router, search, category, sort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearTimeout(searchTimerRef.current);
    setDebouncedSearch(search);
    setPage(1);
    pushURL({ page: 1 });
  };

  const removeFilter = (type: "search" | "category" | "sort") => {
    const next = { search, category, sort };
    if (type === "search") { setSearch(""); setDebouncedSearch(""); next.search = ""; }
    if (type === "category") { setCategory(""); next.category = ""; }
    if (type === "sort") { setSort(""); next.sort = ""; }
    setPage(1);
    pushURL({ ...next, page: 1 });
  };

  const hasActiveFilters = search || category || sort;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <nav className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href="/" className="transition-base hover:text-foreground">Home</Link>
        <span>/</span>
        <span className="text-foreground font-medium">Products</span>
      </nav>

      <h1 className="text-2xl font-bold text-foreground mb-6">Products</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <button type="submit" className="btn-primary px-5 shrink-0">
            Search
          </button>
        </form>

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
            pushURL({ category: e.target.value, page: 1 });
          }}
          className="input sm:w-auto sm:min-w-[160px]"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
            pushURL({ sort: e.target.value, page: 1 });
          }}
          className="input sm:w-auto sm:min-w-[160px]"
        >
          <option value="">Sort by</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name_asc">Name: A-Z</option>
          <option value="name_desc">Name: Z-A</option>
          <option value="newest">Newest</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {search && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-muted/10 text-foreground border border-border transition-base">
              &quot;{search}&quot;
              <button onClick={() => removeFilter("search")} className="hover:opacity-60 transition-base">&times;</button>
            </span>
          )}
          {category && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-muted/10 text-foreground border border-border transition-base">
              {category}
              <button onClick={() => removeFilter("category")} className="hover:opacity-60 transition-base">&times;</button>
            </span>
          )}
          {sort && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-muted/10 text-foreground border border-border transition-base">
              {sort.replace(/_/g, " ")}
              <button onClick={() => removeFilter("sort")} className="hover:opacity-60 transition-base">&times;</button>
            </span>
          )}
          <button
            onClick={() => { setSearch(""); setDebouncedSearch(""); setCategory(""); setSort(""); setPage(1); pushURL({ search: "", category: "", sort: "", page: 1 }); }}
            className="text-xs text-muted transition-base hover:text-foreground"
          >
            Clear all
          </button>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-destructive text-sm">{error}</div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-muted/20 flex items-center justify-center mb-5">
            <svg className="w-7 h-7 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1.5">No products found</h3>
          <p className="text-sm text-muted">Try adjusting your search or filters</p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-10">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="btn-secondary px-3 py-1.5 text-xs"
              >
                Previous
              </button>
              {(() => {
                const pages: (number | "...")[] = [];
                const windowSize = 2;
                const start = Math.max(2, page - windowSize);
                const end = Math.min(totalPages - 1, page + windowSize);
                pages.push(1);
                if (start > 2) pages.push("...");
                for (let i = start; i <= end; i++) pages.push(i);
                if (end < totalPages - 1) pages.push("...");
                if (totalPages > 1) pages.push(totalPages);
                return pages.map((p, idx) =>
                  p === "..." ? (
                    <span key={`e${idx}`} className="px-1 text-xs text-muted">...</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-xl text-sm font-medium transition-base ${
                        p === page
                          ? "bg-primary text-primary-foreground"
                          : "text-muted hover:bg-muted/10"
                      }`}
                    >
                      {p}
                    </button>
                  )
                );
              })()}
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="btn-secondary px-3 py-1.5 text-xs"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
