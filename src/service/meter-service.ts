import axios from "axios";
import { env } from "@/env";
import { handleApiError } from "error";
import {
  type ApiResponse,
  type GetManufacturersResponse,
  type Manufacturer,
} from "@/types/meters-manufacturers";

import {
  type CreateMeterPayload,
  type GetMeterInventoryResponse,
  type MeterInventoryFilters,
  type MeterInventoryResponse,
  type UpdateMeterPayload,
  type ApiResponse as MeterApiResponse,
} from "@/types/meter-inventory";



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

export async function fetchMeterInventory(
  filters?: MeterInventoryFilters
): Promise<
  | {
      success: true;
      data: MeterInventoryResponse;
    }
  | { success: false; error: string }
> {
  try {
    // ✅ Handle the default value inside the function
    const queryFilters = filters || {};
    
    const token = localStorage.getItem("auth_token");

    // Build query parameters
    const params = new URLSearchParams();
    if (queryFilters.page !== undefined) params.append("page", queryFilters.page.toString());
    if (queryFilters.size !== undefined) params.append("size", queryFilters.size.toString());
    if (queryFilters.meterNumber) params.append("meterNumber", queryFilters.meterNumber);
    if (queryFilters.simNo) params.append("simNo", queryFilters.simNo);
    if (queryFilters.manufacturer) params.append("manufacturer", queryFilters.manufacturer);
    if (queryFilters.meterClass) params.append("meterClass", queryFilters.meterClass);
    if (queryFilters.category) params.append("category", queryFilters.category);
    if (queryFilters.approvedStatus) params.append("approvedStatus", queryFilters.approvedStatus);
    if (queryFilters.status) params.append("status", queryFilters.status);
    if (queryFilters.createdAt) params.append("createdAt", queryFilters.createdAt);

    const response = await axios.get<GetMeterInventoryResponse>(
      `${API_URL}/meter/service/all-meters?${params.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.responsecode !== "000") {
      return {
        success: false,
        error: response.data.responsedesc || "Failed to fetch meter inventory",
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

export async function createMeter(
  meter: CreateMeterPayload
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await axios.post<MeterApiResponse>(
      `${API_URL}/meter/service/create`,
      meter,
      {
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.responsecode !== "000") {
      return {
        success: false,
        error: response.data.responsedesc || "Failed to create meter",
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

export async function updateMeter(
  meter: UpdateMeterPayload
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await axios.put<MeterApiResponse>(
      `${API_URL}/meter/service/update`,
      meter,
      {
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.responsecode !== "000") {
      return {
        success: false,
        error: response.data.responsedesc || "Failed to update meter",
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