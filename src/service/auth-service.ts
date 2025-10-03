import { toast } from "sonner";
import { type UserInfo } from "../types/user-info";
import { handleAuthError } from "@/utils/error-handler";
import { env } from "@/env";
import api from "./api";

interface LoginResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: LoginResponseData;
}

interface LoginResponseData {
  access_token: string;
  user_info: UserInfo;
}

interface LogoutResponse{
  responsecode: string;
  responsedesc: string;
  responsedata: LogoutResponseData;
}

interface LogoutResponseData{
  success?: boolean;
  message: string;
}

const API_URL = env.NEXT_PUBLIC_BASE_URL;
const CUSTOM_HEADER = env.NEXT_PUBLIC_CUSTOM_HEADER;

export async function loginApi(
  email: string,
  password: string,
): Promise<LoginResponseData> {
  try {
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    const response = await api.post<LoginResponse>(
      `${API_URL}/auth/service/admin/login`,
      formData,
      {
        headers: {
          custom: CUSTOM_HEADER,
        },
      },
    );

    if (response.data.responsecode === "000") {
      toast.success(response.data.responsedesc);
      return response.data.responsedata;
    } else {
      throw new Error(response.data.responsedesc ?? "Login failed");
    }
  } catch (error: unknown) {
    const apiError = handleAuthError(error);
    toast.error(apiError.message);
    throw new Error(apiError.message);
  }
}

export const logoutApi = async (
  token: string,
  username: string
): Promise<LogoutResponse> => {
  const formData = new FormData();
  formData.append("username", username);

  const response = await fetch(`${API_URL}/auth/service/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Logout failed");
  }

  return response.json();
};