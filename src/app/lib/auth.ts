// lib/auth.ts

const TOKEN_KEY = "token";

// ========================
// Save Token
// ========================
export function setToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

// ========================
// Get Token
// ========================
export function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
}

// ========================
// Remove Token
// ========================
export function removeToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}

// ========================
// Check Login
// ========================
export function isAuthenticated(): boolean {
  return !!getToken();
}

// ========================
// Logout
// ========================
export function logout() {
  removeToken();
  window.location.href = "/login";
}