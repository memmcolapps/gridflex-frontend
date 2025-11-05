import axios from "axios";
import { env } from "@/env";
import { handleApiError } from "@/utils/error-handler";
import { type DashboardApiResponse } from "@/types/dashboard";

const API_URL = env.NEXT_PUBLIC_BASE_URL;
const CUSTOM_HEADER = env.NEXT_PUBLIC_CUSTOM_HEADER;

export interface DashboardFilters {
  band?: string;
  year?: string;
  meterCategory?: string;
}

export async function getDashboard(filters?: DashboardFilters): Promise<
  { success: true; data: DashboardApiResponse["responsedata"] } | { success: false; error: string }
> {
  try {
    const token = localStorage.getItem("auth_token");
    const params = new URLSearchParams();

    if (filters?.band && filters.band !== "Band" && filters.band !== "All Bands") {
      params.append("band", filters.band);
    }
    if (filters?.year && filters.year !== "Year" && filters.year !== "All Years") {
      params.append("year", filters.year);
    }
    if (filters?.meterCategory && filters.meterCategory !== "Meter Category" && filters.meterCategory !== "All Categories") {
      params.append("meterCategory", filters.meterCategory);
    }

    const queryString = params.toString();
    const url = `${API_URL}/dashboard/service/data-management${queryString ? `?${queryString}` : ""}`;

    const response = await axios.get<DashboardApiResponse>(url, {
      headers: {
        "Content-Type": "application/json",
        custom: CUSTOM_HEADER,
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data.responsecode !== "000") {
      return {
        success: false,
        error: response.data.responsedesc ?? "Failed to fetch dashboard",
      };
    }
    return {
      success: true,
      data: response.data.responsedata,
    };
  } catch (error) {
    const apiError = handleApiError(error);
    return {
      success: false,
      error: apiError.message,
    };
  }
}