import axios from "axios";
import { env } from "@/env";
import { handleApiError } from "error";
import {
  type ApiResponse,
  type GetManufacturersResponse,
  type Manufacturer,
} from "@/types/meters-manufacturers";

const API_URL = env.NEXT_PUBLIC_BASE_URL;
const CUSTOM_HEADER = env.NEXT_PUBLIC_CUSTOM_HEADER;

export async function fetchManufacturers(): Promise<
  | {
      success: true;
      data: Manufacturer[];
    }
  | { success: false; error: string }
> {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await axios.get<GetManufacturersResponse>(
      `${API_URL}/manufacturer/service/all`,
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
        error: response.data.responsedesc || "Failed to fetch tariffs",
      };
    }
    return {
      success: true,
      data: response.data.responsedata,
    };
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error),
    };
  }
}

export async function createManufacturer(
  manufacturer: Omit<Manufacturer, "id" | "orgId" | "createdAt" | "updatedAt">,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await axios.post<ApiResponse>(
      `${API_URL}/manufacturer/service/create`,
      manufacturer,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data.responsecode !== "000") {
      return {
        success: false,
        error: response.data.responsedesc || "Failed to fetch tariffs",
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

export async function updateManufacturer(
  manufacturer: Omit<Manufacturer, "orgId" | "createdAt" | "updatedAt">,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await axios.put<ApiResponse>(
      `${API_URL}/manufacturer/service/update`,
      manufacturer,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data.responsecode !== "000") {
      return {
        success: false,
        error: response.data.responsedesc || "Failed to fetch tariffs",
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
