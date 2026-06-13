// // lib/api.ts

// const BASE_URL =
//   process.env.DATABASE_URL || "http://127.0.0.1:8000";

// // =========================
// // Generic API Request
// // =========================
// export async function apiRequest(
//   endpoint: string,
//   options: RequestInit = {}
// ) {
//   try {
//     const token =
//       typeof window !== "undefined"
//         ? localStorage.getItem("token")
//         : null;

//     const response = await fetch(`${BASE_URL}${endpoint}`, {
//       ...options,
//       headers: {
//         "Content-Type": "application/json",
//         ...(token
//           ? {
//               Authorization: `Bearer ${token}`,
//             }
//           : {}),
//         ...(options.headers || {}),
//       },
//     });

//     const contentType = response.headers.get("content-type");

//     let data: any = null;

//     if (contentType?.includes("application/json")) {
//       data = await response.json();
//     } else {
//       data = await response.text();
//     }

//     if (!response.ok) {
//       throw new Error(
//         data?.detail ||
//           data?.message ||
//           `API Error (${response.status})`
//       );
//     }

//     return data;
//   } catch (error: any) {
//     throw new Error(error.message || "Network Error");
//   }
// }

// // =========================
// // GET
// // =========================
// export async function get(endpoint: string) {
//   return apiRequest(endpoint, {
//     method: "GET",
//   });
// }

// // =========================
// // POST
// // =========================
// export async function post(endpoint: string, body: any) {
//   return apiRequest(endpoint, {
//     method: "POST",
//     body: JSON.stringify(body),
//   });
// }

// // =========================
// // PUT
// // =========================
// export async function put(endpoint: string, body: any) {
//   return apiRequest(endpoint, {
//     method: "PUT",
//     body: JSON.stringify(body),
//   });
// }

// // =========================
// // PATCH
// // =========================
// export async function patch(endpoint: string, body: any) {
//   return apiRequest(endpoint, {
//     method: "PATCH",
//     body: JSON.stringify(body),
//   });
// }

// // =========================
// // DELETE
// // =========================
// export async function del(endpoint: string) {
//   return apiRequest(endpoint, {
//     method: "DELETE",
//   });
// }

// // =========================
// // AUTH API
// // =========================
// export const AuthAPI = {
//   register: (userData: {
//     name: string;
//     email: string;
//     password: string;
//   }) =>
//     post("/api/auth/register", userData),

//   login: (credentials: {
//     email: string;
//     password: string;
//   }) =>
//     post("/api/auth/login", credentials),
// };

// // =========================
// // PRODUCT API
// // =========================
// export const ProductAPI = {
//   getAll: () => get("/api/products"),

//   getById: (id: number) =>
//     get(`/api/products/${id}`),

//   create: (productData: any) =>
//     post("/api/products", productData),

//   update: (id: number, productData: any) =>
//     put(`/api/products/${id}`, productData),

//   delete: (id: number) =>
//     del(`/api/products/${id}`),
// };

// // =========================
// // CART API
// // =========================
// export const CartAPI = {
//   getCart: (userId: number) =>
//     get(`/api/cart/${userId}`),

//   addToCart: (cartData: any) =>
//     post("/api/cart", cartData),

//   removeItem: (cartId: number) =>
//     del(`/api/cart/${cartId}`),
// };

// // =========================
// // ORDER API
// // =========================
// export const OrderAPI = {
//   createOrder: (orderData: any) =>
//     post("/api/orders", orderData),

//   getUserOrders: (userId: number) =>
//     get(`/api/orders/user/${userId}`),

//   getAllOrders: () =>
//     get("/api/orders"),
// };

// // =========================
// // ADMIN API
// // =========================
// export const AdminAPI = {
//   getDashboard: () =>
//     get("/api/admin"),

//   getStats: () =>
//     get("/api/admin/stats"),
// };


const BASE_URL =
  process.env.DATABASE_URL ||
  "http://127.0.0.1:8000";

// =========================
// TOKEN HELP
// =========================
function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

// =========================
// CORE REQUEST
// =========================
async function request(
  endpoint: string,
  options: RequestInit = {}
) {
  try {
    const token = getToken();

    const res = await fetch(
      `${BASE_URL}${endpoint}`,
      {
        ...options,
        headers: {
          "Content-Type":
            "application/json",
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
          ...(options.headers || {}),
        },
      }
    );

    const contentType =
      res.headers.get("content-type");

    let data: any = null;

    if (contentType?.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    if (!res.ok) {
      throw new Error(
        data?.detail ||
          data?.message ||
          "API Error"
      );
    }

    return data;
  } catch (err: any) {
    throw new Error(
      err.message || "Network Error"
    );
  }
}

// =========================
// METHOD HELPERS
// =========================
const get = (url: string) =>
  request(url, { method: "GET" });

const post = (url: string, body?: any) =>
  request(url, {
    method: "POST",
    body: JSON.stringify(body),
  });

const put = (url: string, body?: any) =>
  request(url, {
    method: "PUT",
    body: JSON.stringify(body),
  });

const del = (url: string) =>
  request(url, { method: "DELETE" });

// =========================
// AUTH API
// =========================
export const AuthAPI = {
  register: (data: {
    name: string;
    email: string;
    password: string;
  }) => post("/api/auth/register", data),

  login: (data: {
    email: string;
    password: string;
  }) => post("/api/auth/login", data),
};

// =========================
// PRODUCT API
// =========================
export const ProductAPI = {
  getAll: () => get("/api/products"),

  getById: (id: number) =>
    get(`/api/products/${id}`),

  create: (data: any) =>
    post("/api/products", data),

  update: (id: number, data: any) =>
    put(`/api/products/${id}`, data),

  delete: (id: number) =>
    del(`/api/products/${id}`),
};

// =========================
// CART API
// =========================
export const CartAPI = {
  getCart: (userId: number) =>
    get(`/api/cart/${userId}`),

  addToCart: (data: any) =>
    post("/api/cart", data),

  removeItem: (id: number) =>
    del(`/api/cart/${id}`),
};

// =========================
// ORDER API
// =========================
export const OrderAPI = {
  createOrder: (data: any) =>
    post("/api/orders", data),

  getUserOrders: (userId: number) =>
    get(`/api/orders/user/${userId}`),

  getAllOrders: () =>
    get("/api/orders"),
};

// =========================
// ADMIN API (FIXED - COMPLETE)
// =========================
export const AdminAPI = {
  getDashboard: () =>
    get("/api/admin"),

  getStats: () =>
    get("/api/admin/stats"),

  getAllProducts: () =>
    get("/api/admin/products"),

  createProduct: (data: any) =>
    post("/api/admin/products", data),

  updateProduct: (
    id: number,
    data: any
  ) =>
    put(`/api/admin/products/${id}`, data),

  deleteProduct: (id: number) =>
    del(`/api/admin/products/${id}`),
};