// @/service/profile-service.ts
import axios from "axios";
import { env } from "@/env";
import { handleApiError } from "error";

export interface UpdateProfilePayload {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
}

// Add an interface for the user data you expect to receive
export interface UserData {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    business?: {
        businessName: string;
    };
    // Add other user properties here
}

const API_URL = env.NEXT_PUBLIC_BASE_URL;
const CUSTOM_HEADER = env.NEXT_PUBLIC_CUSTOM_HEADER;

export async function updateProfile(
    data: UpdateProfilePayload,
): Promise<{ success: true } | { success: false; error: string }> {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("Authentication token not found.");
        }

        const response = await axios.put(
            `${API_URL}/user/service/update`,
            data,
            {
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
                error: response.data.responsedesc ?? "Failed to update profile",
            };
        }

        return {
            success: true,
        };
    } catch (error) {
        return {
            success: false,
            error: handleApiError(error),
        };
    }
}

// Add the fetchUser function here and export it
export async function fetchUser(): Promise<UserData> {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("Authentication token not found.");
        }

        const response = await axios.get(
            `${API_URL}/user/service/get-profile`, // Use the correct endpoint for fetching the user profile
            {
                headers: {
                    "Content-Type": "application/json",
                    custom: CUSTOM_HEADER,
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.data.responsecode !== "000") {
            throw new Error(response.data.responsedesc ?? "Failed to fetch user profile.");
        }

        return response.data.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}