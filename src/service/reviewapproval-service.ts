import type {
  GetPercentageResponse,
  GetAllLiabilitiesResponse,
  GetBandResponse,
  GetTariffResponse,
  MeterResponse,
  PercentageRange,
  Liability,
  Band,
  Tariff,
  Meter,
} from "@/types/review-approval";
import { env } from "@/env";
import { handleApiError } from "@/utils/error-handler";
import { axiosInstance } from "@/lib/axios";

const API_URL = env.NEXT_PUBLIC_BASE_URL;
const CUSTOM_HEADER = env.NEXT_PUBLIC_CUSTOM_HEADER;

export interface FetchParams {
  page: number;
  pageSize: number;
  searchTerm?: string;
  sortBy?: string | null;
  sortDirection?: "asc" | "desc" | null;
  type?: string; 
  meterStage?: string; 
}



// Percentage Range
export async function getAllPercentageRanges({
  page,
  pageSize,
  searchTerm,
  sortBy,
  sortDirection,
  type = "pending-state",
}: FetchParams): Promise<
  { success: true; data: PercentageRange[] } | { success: false; error: string }
> {
  try {
    const token = localStorage.getItem("auth_token");

    const params: Record<string, string> = {
      page: String(page),
      pageSize: String(pageSize),
    };

    if (type) params.type = type;
    if (searchTerm) params.search = searchTerm;
    if (sortBy) {
      params.sortBy = sortBy;
      params.sortDirection = sortDirection ?? "asc";
    }

    const response = await axiosInstance.get<GetPercentageResponse>(
      `${API_URL}/debt-setting/service/percentage-range/all`,
      {
        params,
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
        error: response.data.responsedesc || "Failed to fetch percentage ranges",
      };
    }

    return {
      success: true,
      data: response.data.responsedata,
    };
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error).message,
    };
  }
}

export async function getPercentageRange(
  id: string,
): Promise<
  { success: true; data: PercentageRange[] } | { success: false; error: string }
> {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await axiosInstance.get<GetPercentageResponse>(
      `${API_URL}/debt-setting/service/percentage-range/single`,
      {
        params: { percentageVersionId: id },
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
        error: response.data.responsedesc || "Failed to fetch percentage range",
      };
    }

    return {
      success: true,
      data: response.data.responsedata,
    };
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error).message,
    };
  }
}

export async function reviewPercentageRange(
  percentageId: string,
  approveStatus: "approve" | "reject",
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await axiosInstance.put<GetPercentageResponse>(
      `${API_URL}/debt-setting/service/percentage-range/approve`,
      null,
      {
        params: {
          percentageId,
          approveStatus,
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
        error: response.data.responsedesc || "Failed to review percentage range",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error).message,
    };
  }
}

// Liability
export async function getAllLiabilities({
  page,
  pageSize,
  searchTerm,
  sortBy,
  sortDirection,
  type = "pending-state",
}: FetchParams): Promise<
  { success: true; data: Liability[] } | { success: false; error: string }
> {
  try {
    const token = localStorage.getItem("auth_token");

    const params: Record<string, string> = {
      page: String(page),
      pageSize: String(pageSize),
    };

    if (type) params.type = type;
    if (searchTerm) params.search = searchTerm;
    if (sortBy) {
      params.sortBy = sortBy;
      params.sortDirection = sortDirection ?? "asc";
    }

    const response = await axiosInstance.get<GetAllLiabilitiesResponse>(
      `${API_URL}/debt-setting/service/liability-cause/all`,
      {
        params,
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
        error: response.data.responsedesc || "Failed to fetch liabilities",
      };
    }

    return {
      success: true,
      data: response.data.responsedata,
    };
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error).message,
    };
  }
}

export async function getLiability(
  id: string,
): Promise<
  { success: true; data: Liability[] } | { success: false; error: string }
> {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await axiosInstance.get<GetAllLiabilitiesResponse>(
      `${API_URL}/liability/service/${id}`,
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
        error: response.data.responsedesc || "Failed to fetch liability",
      };
    }

    return {
      success: true,
      data: response.data.responsedata,
    };
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error).message,
    };
  }
}

export async function reviewLiability(
  id: string,
  approveStatus: "approve" | "reject",
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await axiosInstance.put<GetPercentageResponse>(
      `${API_URL}/debt-setting/service/liability-cause/approve`,
      null,
      {
        params: {
          liabilityCauseId: id,
          approveStatus,
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
        error: response.data.responsedesc || "Failed to review liability",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error).message,
    };
  }
}

// Band
export async function getAllBands({
  page,
  pageSize,
  searchTerm,
  sortBy,
  sortDirection,
  type = "pending-state",
}: FetchParams): Promise<
  { success: true; data: Band[] } | { success: false; error: string }
> {
  try {
    const token = localStorage.getItem("auth_token");

    const params: Record<string, string> = {
      page: String(page),
      pageSize: String(pageSize),
    };

    if (type) params.type = type;
    if (searchTerm) params.search = searchTerm;
    if (sortBy) {
      params.sortBy = sortBy;
      params.sortDirection = sortDirection ?? "asc";
    }

    const response = await axiosInstance.get<GetBandResponse>(
      `${API_URL}/band/service/all`,
      {
        params,
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
        error: response.data.responsedesc || "Failed to fetch bands",
      };
    }

    return {
      success: true,
      data: response.data.responsedata,
    };
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error).message,
    };
  }
}

export async function getBand(
  id: string,
): Promise<
  { success: true; data: Band[] } | { success: false; error: string }
> {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await axiosInstance.get<GetBandResponse>(
      `${API_URL}/band/service/${id}`,
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
        error: response.data.responsedesc || "Failed to fetch band",
      };
    }

    return {
      success: true,
      data: response.data.responsedata,
    };
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error).message,
    };
  }
}

export async function reviewBand(
  id: string,
  approveStatus: "approve" | "reject",
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await axiosInstance.put<GetPercentageResponse>(
      `${API_URL}/band/service/approve`,
      null,
      {
        params: {
          bandId: id,
          approveStatus,
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
        error: response.data.responsedesc || "Failed to review band",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error).message,
    };
  }
}

// Tariff
export async function getAllTariffs({
  page,
  pageSize,
  searchTerm,
  sortBy,
  sortDirection,
  type = "pending-state",
}: FetchParams): Promise<
  { success: true; data: { data: Tariff[]; totalData: number; page: number; size: number; totalPages: number } } | { success: false; error: string }
> {
  try {
    const token = localStorage.getItem("auth_token");

    const params: Record<string, string> = {
      page: String(page),
      pageSize: String(pageSize),
    };

    if (type) params.type = type;
    if (searchTerm) params.search = searchTerm;
    if (sortBy) {
      params.sortBy = sortBy;
      params.sortDirection = sortDirection ?? "asc";
    }

    const response = await axiosInstance.get<GetTariffResponse>(
      `${API_URL}/tariff/service/all`,
      {
        params,
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
      error: handleApiError(error).message,
    };
  }
}

export async function getTariff(
  id: string,
): Promise<
  { success: true; data: { data: Tariff[]; totalData: number; page: number; size: number; totalPages: number } } | { success: false; error: string }
> {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await axiosInstance.get<GetTariffResponse>(
      `${API_URL}/tariff/service/${id}`,
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
        error: response.data.responsedesc || "Failed to fetch tariff",
      };
    }

    return {
      success: true,
      data: response.data.responsedata,
    };
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error).message,
    };
  }
}

export async function reviewTariff(
  id: string,
  approveStatus: "approve" | "reject",
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await axiosInstance.put<GetPercentageResponse>(
      `${API_URL}/tariff/service/approve`,
      null,
      {
        params: {
          tId: id,
          approveStatus,
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
        error: response.data.responsedesc || "Failed to review tariff",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error).message,
    };
  }
}

// Meter
export async function getAllMeters({
  page,
  pageSize,
  searchTerm,
  sortBy,
  sortDirection,
  type = "pending-state",
}: FetchParams): Promise<
  { success: true; data: { data: Meter[]; totalData: number; page: number; size: number; totalPages: number } } | { success: false; error: string }
> {
  try {
    const token = localStorage.getItem("auth_token");

    const params: Record<string, string> = {
      page: String(page),
      pageSize: String(pageSize),
    };

    if (type) params.type = type;
    if (searchTerm) params.search = searchTerm;
    if (sortBy) {
      params.sortBy = sortBy;
      params.sortDirection = sortDirection ?? "asc";
    }

    const response = await axiosInstance.get<MeterResponse>(
      `${API_URL}/meter/service/all`,
      {
        params,
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
        error: response.data.responsedesc || "Failed to fetch meters",
      };
    }

    return {
      success: true,
      data: response.data.responsedata,
    };
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error).message,
    };
  }
}

export async function getMeter(
  id: string,
): Promise<
  { success: true; data: { data: Meter[]; totalData: number; page: number; size: number; totalPages: number } } | { success: false; error: string }
> {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await axiosInstance.get<MeterResponse>(
      `${API_URL}/meter/service/${id}`,
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
        error: response.data.responsedesc || "Failed to fetch meter",
      };
    }

    return {
      success: true,
      data: response.data.responsedata,
    };
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error).message,
    };
  }
}

export async function reviewMeter(
  id: string,
  approveState: "approve" | "reject",
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await axiosInstance.put<GetPercentageResponse>(
      `${API_URL}/meter/service/approve`,
      null,
      {
        params: {
          meterVersionId: id,
          approveState,
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
        error: response.data.responsedesc || "Failed to review meter",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error).message,
    };
  }
}
