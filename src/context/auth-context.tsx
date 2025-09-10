// context/auth-context.tsx

"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { loginApi } from "../service/auth-service";
import { useRouter } from "next/navigation";

// Centralized types
import { type UserInfo } from "@/types/user-info";

// Type for the login API response
interface LoginResponseData {
  access_token: string;
  user_info: UserInfo;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserInfo | null;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  // This is the missing part, you need to add updateUser to the type definition
  updateUser: (userInfo: UserInfo) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem("auth_token");
    } catch {
      return false;
    }
  });
  
  const [user, setUser] = useState<UserInfo | null>(() => {
    try {
      const userInfo = localStorage.getItem("user_info");
      return userInfo ? (JSON.parse(userInfo) as UserInfo) : null;
    } catch {
      return null;
    }
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const login = useCallback(
    async (username: string, password: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response: LoginResponseData = await loginApi(username, password);

        if (!response?.access_token) {
          throw new Error("Invalid response from server");
        }

        const { access_token, user_info } = response;

        localStorage.setItem("auth_token", access_token);
        localStorage.setItem("user_info", JSON.stringify(user_info));

        setUser(user_info);
        setIsAuthenticated(true);
        router.push("/data-management/dashboard");
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to login";
        setError(errorMessage);
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_info");
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  const logout = useCallback(() => {
    setIsLoading(true);
    try {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_info");
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      router.push("/login");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to logout";
      setError(errorMessage);
      console.error("Logout error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [router]);
  
  // This is the new function to allow other components to update the user data
  const updateUser = useCallback((userInfo: UserInfo) => {
    setUser(userInfo);
    localStorage.setItem("user_info", JSON.stringify(userInfo));
  }, []);

  const value = {
    isAuthenticated,
    user,
    error,
    login,
    logout,
    isLoading,
    updateUser,
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