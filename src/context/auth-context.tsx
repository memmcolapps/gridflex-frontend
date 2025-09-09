"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { loginApi } from "../service/auth-service";
import { useRouter } from "next/navigation";

// Define the API response types based on your provided UserInfo structure
export interface Permission {
  id: string;
  orgId: string;
  view: boolean;
  edit: boolean;
  approve: boolean;
  disable: boolean;
}

export interface SubModule {
  id: string;
  orgId: string;
  name: string;
  access: boolean;
  moduleId: string;
}

export interface Module {
  id: string;
  orgId: string;
  name: string;
  access: boolean;
  groupId: string;
  subModules: SubModule[];
}

export interface Group {
  id: string;
  orgId: string;
  groupTitle: string;
  modules: Module[];
  permissions: Permission;
}

export interface Business {
  phoneNumber: string;
  id: string;
  businessName: string;
  businessType: string;
  businessContact: string;
  registrationNumber: string;
  country: string;
  state: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Node {
  id: string;
  org_id: string;
  name: string;
  parent_id: string | null;
}

export interface UserInfo {
  id: string;
  orgId: string;
  nodeId: string;
  firstname: string;
  lastname: string;
  email: string;
  status: boolean;
  active: boolean;
  lastActive: string;
  password?: string;
  groups: Group;
  business: Business;
  phoneNumber: string;
  nodes: Node[];
  createdAt: string;
  updatedAt: string;
}

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

  const checkAuthStatus = useCallback(() => {
    try {
      const authToken = localStorage.getItem("auth_token");
      const userInfo = localStorage.getItem("user_info");

      if (authToken && userInfo) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userInfo) as UserInfo);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (err) {
      console.error("Error checking auth status:", err);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

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
      const errorMessage =
        err instanceof Error ? err.message : "Failed to logout";
      setError(errorMessage);
      console.error("Logout error:", err);
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