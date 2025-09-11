import axios from "axios";
import { env } from "@/env";
import { handleApiError } from "error";

export interface GenerateOtpPayload {
    username: string;
}

export interface ChangePasswordPayload {
    usernam: string;
    otp: string;
    password: string;
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

        const response = await axios.post<ApiResponse>(
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
        // Correctly format data as application/x-www-form-urlencoded
        const formData = new URLSearchParams();
        formData.append("username", data.usernam);
        formData.append("otp", data.otp);
        formData.append("password", data.password);

        const response = await axios.post<ApiResponse>(
            `${API_URL}/auth/service/forget-password`,
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
                error: response.data.responsedesc ?? "Failed to change password",
            };
        }
        return { success: true };
    } catch (error) {
        return { success: false, error: handleApiError(error) };
    }
}