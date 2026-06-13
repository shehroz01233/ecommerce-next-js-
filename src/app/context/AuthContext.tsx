"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { AuthAPI } from "../lib/api";
import {
  setToken,
  getToken,
  removeToken,
} from "../lib/auth";

interface User {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
}

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

  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();

    if (token) {
      setUser({
        email: "authenticated-user",
      });
    }

    setLoading(false);
  }, []);

  const login = async (data: LoginData) => {
    const response = await AuthAPI.login(data);

    setToken(response.access_token);

    setUser({
      email: data.email,
    });
  };

  const register = async (
    data: RegisterData
  ) => {
    await AuthAPI.register(data);
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuthContext must be used inside AuthProvider"
    );
  }

  return context;
}