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
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await loginApi(username, password);

      setUser(response.user_info);
      setIsAuthenticated(true);
      setError(null);

      const authToken = response.access_token;
      if (authToken) {
        localStorage.setItem("auth_token", authToken);
        localStorage.setItem("user_info", JSON.stringify(response.user_info));
        router.push("/data-management/dashboard");
      } else {
        setError("Login failed");
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to login");
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setIsLoading(true);
    try {
      // authService.logout();
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_info");
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to logout");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const value = {
    isAuthenticated,
    user,
    error,
    login,
    logout,
    isLoading,
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
