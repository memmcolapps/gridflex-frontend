import axios from "axios";
import { env } from "@/env";
import { handleApiError } from "error";

// Update the payload interface to include the 'id' field
export interface UpdateProfilePayload {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
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
            data, // The 'data' object now includes the 'id'
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