"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";

import { AuthAPI, User } from "../lib/api";
import { setToken, getToken, removeToken } from "../lib/auth";

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const userData = await AuthAPI.me();
          setUser(userData);
        } catch {
          removeToken();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = useCallback(async (data: LoginData) => {
    const response = await AuthAPI.login(data);
    setToken(response.access_token);

    try {
      if (response.user) {
        setUser(response.user);
      } else {
        const me = await AuthAPI.me();
        setUser(me);
      }
    } catch {
      removeToken();
      throw new Error("Failed to load user profile");
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    await AuthAPI.register(data);
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
    window.location.href = "/login";
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }
  return context;
}
