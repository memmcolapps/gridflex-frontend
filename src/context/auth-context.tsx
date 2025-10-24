// context/auth-context.tsx

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { loginApi, logoutApi } from "../service/auth-service";
import { useRouter } from "next/navigation";
import { queryClient } from "@/lib/queryClient";

// Centralized types
import { type UserInfo } from "@/types/user-info";
import { getFirstAccessiblePath } from "@/utils/permissions";

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
  logout: () => Promise<void>;
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
        const redirectPath = getFirstAccessiblePath(user_info);
        router.push(redirectPath);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to login";
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

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("auth_token");
      const userInfo = localStorage.getItem("user_info");

      const parsedUser = userInfo ? JSON.parse(userInfo) : null;
      const username = parsedUser?.email ?? parsedUser?.username;

      if (token && username) {
        try {
          await logoutApi(token, username);
        } catch (apiError) {
          console.warn("Logout API failed:", apiError);
        }
      }

      // Clear all cached queries to prevent data leakage between users
      queryClient.clear();

      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_info");
      setUser(null);
      setIsAuthenticated(false);

      router.push("/login");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to logout";
      setError(errorMessage);
      console.error("Logout error:", err);

      // Clear cache even if logout API fails
      queryClient.clear();

      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_info");
      setUser(null);
      setIsAuthenticated(false);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const handleExpired = () => {
      console.log("Token expired detected!");
      logout();
    };

    window.addEventListener("auth-token-expired", handleExpired);

    return () => {
      window.addEventListener("auth-token-expired", handleExpired);
    };
  }, [logout]);

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
