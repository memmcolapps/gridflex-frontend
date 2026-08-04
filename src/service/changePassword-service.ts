import { env } from "@/env";
import { handleApiError } from "error";
import { axiosInstance } from "@/lib/axios";

export interface GenerateOtpPayload {
  username: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ApiResponse {
  responsecode: string;
  responsedesc: string;
}

const API_URL = env.NEXT_PUBLIC_BASE_URL;
const CUSTOM_HEADER = env.NEXT_PUBLIC_CUSTOM_HEADER;

export async function generateOtp(
  data: GenerateOtpPayload,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    // Correctly format data as application/x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append("username", data.username);

    const response = await axiosInstance.post<ApiResponse>(
      `${API_URL}/auth/service/generate-otp`,
      formData, // Send the URLSearchParams object
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          custom: CUSTOM_HEADER,
        },
      },
    );
    if (response.data.responsecode !== "000") {
      return {
        success: false,
        error: response.data.responsedesc ?? "Failed to generate OTP",
      };
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: handleApiError(error) };
  }
}

export async function changePassword(
  data: ChangePasswordPayload,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await axiosInstance.post<ApiResponse>(
      `${API_URL}/user/service/change-password`,
      null,
      {
        params: {
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        },
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (response.data.responsecode !== "000") {
      return {
        success: false,
        error: response.data.responsedesc ?? "Failed to change password",
      };
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: handleApiError(error) };
  }
}
