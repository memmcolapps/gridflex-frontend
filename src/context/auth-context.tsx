"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import { loginApi } from "../service/auth-service";
import { type UserInfo } from "../types/user-info";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserInfo | null;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = useCallback(async (username: string, password: string) => {
    const response = await loginApi(username, password);

    setUser(response.user_info);
    setIsAuthenticated(true);
    setError(null);

    const authToken = response.access_token;
    if (authToken) {
      localStorage.setItem("auth_token", authToken);
      localStorage.setItem("user_info", JSON.stringify(response.user_info));
      router.push("/data-management/dashboard");
    }
  }, []);

  const logout = useCallback(() => {
    // authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  const value = {
    isAuthenticated,
    user,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
