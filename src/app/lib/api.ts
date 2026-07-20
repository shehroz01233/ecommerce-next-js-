/* eslint-disable @typescript-eslint/no-explicit-any */
// DATABASE_URL is for the database connection, not an API endpoint — never use it as the API URL.
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

if (typeof window !== "undefined" && process.env.NODE_ENV === "production" && BASE_URL.startsWith("http://")) {
  console.error("[SECURITY] NEXT_PUBLIC_API_URL must use HTTPS in production. Auth tokens may be sent in cleartext.");
}

import { getToken } from "./auth";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const token = getToken();
    if (token && typeof window !== "undefined" && process.env.NODE_ENV === "production" && BASE_URL.startsWith("http://")) {
      throw new ApiError("[SECURITY] Refusing to send auth token over HTTP in production. Set NEXT_PUBLIC_API_URL to an HTTPS URL.", 0);
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });

    const contentType = res.headers.get("content-type");
    let data: any = null;

    if (contentType?.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    if (!res.ok) {
      const raw =
        typeof data === "string"
          ? data
          : data?.detail || data?.message || `API Error (${res.status})`;
      if (process.env.NODE_ENV === "development") {
        console.error(`[API] ${res.status} ${endpoint}: ${raw}`);
      }

      const statusMessages: Record<number, string> = {
        400: "Invalid request",
        401: "Authentication required. Please sign in.",
        403: "You don't have permission for this action",
        404: "Resource not found",
        409: "Conflict — this may already exist",
        422: "Invalid data provided",
        429: "Too many requests. Please try again later",
      };

      const friendly =
        res.status >= 500
          ? "Server error. Please try again later"
          : statusMessages[res.status] ||
            "Something went wrong. Please try again.";
      throw new ApiError(friendly, res.status);
    }

    return data as T;
  } catch (err: any) {
    if (err.name === "AbortError") throw err;
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      throw new ApiError("Network error – server may be offline", 0);
    }
    if (err instanceof Error) throw err;
    throw new ApiError("Unknown error", 0);
  }
}

function get<T = any>(url: string, signal?: AbortSignal) {
  return request<T>(url, { method: "GET", signal });
}

function post<T = any>(url: string, body?: any, signal?: AbortSignal) {
  return request<T>(url, {
    method: "POST",
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });
}

function put<T = any>(url: string, body?: any, signal?: AbortSignal) {
  return request<T>(url, {
    method: "PUT",
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });
}

function del<T = any>(url: string, signal?: AbortSignal) {
  return request<T>(url, { method: "DELETE", signal });
}

// =====================
// TYPES
// =====================
export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  created_at?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  image?: string;
  category?: string;
  stock?: number;
  rating?: number;
  review_count?: number;
  created_at?: string;
}

export interface CartItem {
  id?: number;
  product: Product;
  quantity: number;
}

export interface Order {
  id: number;
  total: number;
  status: string;
  items: OrderItem[];
  created_at?: string;
  user_id?: number;
}

export interface OrderItem {
  product_id: number;
  product_name?: string;
  quantity: number;
  price?: number;
}

export interface Review {
  id: number;
  user_id: number;
  user_name?: string;
  product_id: number;
  rating: number;
  comment: string;
  created_at?: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue?: number;
  recentOrders?: Order[];
}

// =====================
// AUTH API
// =====================
export const AuthAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    post<{ message?: string }>("/api/auth/register", data),

  login: (data: { email: string; password: string }) =>
    post<{ access_token: string; user?: User }>("/api/auth/login", data),

  me: (signal?: AbortSignal) => get<User>("/api/users/me", signal),
};

// =====================
// USER API
// =====================
export const UserAPI = {
  updateProfile: (data: { name: string }, signal?: AbortSignal) =>
    put<User>("/api/users/me", data, signal),
};

// =====================
// PRODUCT API
// =====================
export const ProductAPI = {
  getAll: (params?: { search?: string; category?: string; sort?: string; page?: number; limit?: number }, signal?: AbortSignal) => {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.category) query.set("category", params.category);
    if (params?.sort) query.set("sort", params.sort);
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    return get<Product[] | { products: Product[]; total?: number; page?: number; pages?: number }>(
      `/api/products${qs ? `?${qs}` : ""}`,
      signal
    );
  },

  getById: (id: number, signal?: AbortSignal) => get<Product>(`/api/products/${id}`, signal),

  create: (data: Partial<Product>, signal?: AbortSignal) => post<Product>("/api/products", data, signal),

  update: (id: number, data: Partial<Product>, signal?: AbortSignal) =>
    put<Product>(`/api/products/${id}`, data, signal),

  delete: (id: number, signal?: AbortSignal) => del(`/api/products/${id}`, signal),

  getCategories: (signal?: AbortSignal) => get<string[]>("/api/products/categories", signal),

  getReviews: (id: number, signal?: AbortSignal) => get<Review[]>(`/api/reviews/product/${id}`, signal),

  addReview: (id: number, data: { rating: number; comment: string }, signal?: AbortSignal) =>
    post<Review>("/api/reviews/", { product_id: id, ...data }, signal),
};

// =====================
// CART API
// =====================
export const CartAPI = {
  getCart: (signal?: AbortSignal) => get<CartItem[]>("/api/cart", signal),

  addItem: (data: { product_id: number; quantity?: number }, signal?: AbortSignal) =>
    post<CartItem>("/api/cart", data, signal),

  updateItem: (itemId: number, quantity: number, signal?: AbortSignal) =>
    put<CartItem>(`/api/cart/${itemId}`, { quantity }, signal),

  removeItem: (itemId: number, signal?: AbortSignal) => del(`/api/cart/${itemId}`, signal),

  clear: (signal?: AbortSignal) => del("/api/cart", signal),
};

// =====================
// ORDER API
// =====================
export const OrderAPI = {
  createOrder: (data: {
    items: { product_id: number; quantity: number }[];
    shipping_address?: { address: string; city: string; zip_code: string; phone: string };
  }, signal?: AbortSignal) =>
    post<Order>("/api/orders", data, signal),

  getUserOrders: (signal?: AbortSignal) => get<Order[]>("/api/orders/user/me", signal),
};

// =====================
// ADMIN API
// =====================
export const AdminAPI = {
  getDashboard: (signal?: AbortSignal) => get<{ orders: Order[] }>("/api/admin/", signal),

  getStats: (signal?: AbortSignal) => get<DashboardStats>("/api/admin/stats", signal),

  getAllProducts: (signal?: AbortSignal) => get<Product[]>("/api/products/", signal),

  createProduct: (data: Partial<Product>, signal?: AbortSignal) =>
    post<Product>("/api/products/", data, signal),

  updateProduct: (id: number, data: Partial<Product>, signal?: AbortSignal) =>
    put<Product>(`/api/products/${id}`, data, signal),

  deleteProduct: (id: number, signal?: AbortSignal) => del(`/api/products/${id}`, signal),

  getAllOrders: (signal?: AbortSignal) => get<Order[]>("/api/orders/", signal),

  updateOrderStatus: (id: number, status: string, signal?: AbortSignal) =>
    put<Order>(`/api/orders/${id}`, { status }, signal),

  getAllUsers: (signal?: AbortSignal) => get<User[]>("/api/admin/users", signal),
};
