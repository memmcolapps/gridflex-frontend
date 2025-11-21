// src/service/debt-settings-service.ts

import axios from "axios";
import { env } from "@/env";
import { handleApiError } from "@/utils/error-handler";
import { axiosInstance } from "@/lib/axios";
import {
  type ApiResponse,
  type LiabilityCause,
  type LiabilityCausePayload,
  type UpdatedLiabilityCausePayload,
  type PercentageRange,
  type PercentageRangePayload,
  type UpdatedPercentageRangePayload,
} from "@/types/credit-debit";

const API_URL = env.NEXT_PUBLIC_BASE_URL;
const CUSTOM_HEADER = env.NEXT_PUBLIC_CUSTOM_HEADER;

// --- Liability Cause API Calls ---

export const fetchAllLiabilityCauses = async (): Promise<
  { success: true; data: LiabilityCause[] } | { success: false; error: string }
> => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await axiosInstance.get<ApiResponse<LiabilityCause[]>>(
      `${API_URL}/debt-setting/service/liability-cause/all`,
      {
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data?.responsecode !== "000") {
      return {
        success: false,
        error: response.data?.responsedesc || "Failed to fetch liability causes.",
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
};

export const createLiabilityCause = async (
  payload: LiabilityCausePayload,
): Promise<{ success: true } | { success: false; error: string }> => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await axiosInstance.post<ApiResponse<LiabilityCause>>(
      `${API_URL}/debt-setting/service/liability-cause/create`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data?.responsecode !== "000") {
      return {
        success: false,
        error: response.data?.responsedesc || "Failed to create liability cause.",
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
};

export const updateLiabilityCause = async (
  payload: UpdatedLiabilityCausePayload,
): Promise<{ success: true } | { success: false; error: string }> => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await axiosInstance.put<ApiResponse<LiabilityCause>>(
      `${API_URL}/debt-setting/service/liability-cause/update`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data?.responsecode !== "000") {
      return {
        success: false,
        error: response.data?.responsedesc || "Failed to update liability cause.",
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
};

// FIX: Uses URL query parameters and sends status directly (true for activate, false for deactivate).
export const changeLiabilityCauseStatus = async (
  id: string,
  status: boolean,
): Promise<{ success: true } | { success: false; error: string }> => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await axiosInstance.patch<ApiResponse<LiabilityCause>>(
      `${API_URL}/debt-setting/service/liability-cause/change-state`,
      null, // Body is null for parameters in URL
      {
        params: {
          liabilityCauseId: id,
          status: status,
        },
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data?.responsecode !== "000") {
      return {
        success: false,
        error: response.data?.responsedesc ||
          `Failed to ${status ? "activate" : "deactivate"} liability cause.`,
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
};

// --- Percentage Range API Calls ---

export const fetchAllPercentageRanges = async (): Promise<
  { success: true; data: PercentageRange[] } | { success: false; error: string }
> => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await axiosInstance.get<ApiResponse<PercentageRange[]>>(
      `${API_URL}/debt-setting/service/percentage-range/all`,
      {
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data?.responsecode !== "000") {
      return {
        success: false,
        error: response.data?.responsedesc || "Failed to fetch percentage ranges.",
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
};

export const createPercentageRange = async (
  payload: PercentageRangePayload,
): Promise<{ success: true } | { success: false; error: string }> => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await axiosInstance.post<ApiResponse<PercentageRange>>(
      `${API_URL}/debt-setting/service/percentage-range/create`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data?.responsecode !== "000") {
      return {
        success: false,
        error: response.data?.responsedesc || "Failed to create percentage range.",
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
};

export const updatePercentageRange = async (
  payload: UpdatedPercentageRangePayload,
): Promise<{ success: true } | { success: false; error: string }> => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await axiosInstance.put<ApiResponse<PercentageRange>>(
      `${API_URL}/debt-setting/service/percentage-range/update`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data?.responsecode !== "000") {
      return {
        success: false,
        error: response.data?.responsedesc || "Failed to update percentage range.",
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
};

// FINAL FIX: Uses URL query parameters, sends percentageId, and sends status directly as 'status'.
export const changePercentageRangeStatus = async (
  id: string,
  status: boolean,
): Promise<{ success: true } | { success: false; error: string }> => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await axiosInstance.patch<ApiResponse<PercentageRange>>(
      `${API_URL}/debt-setting/service/percentage-range/change-state`,
      null,
      {
        params: {
          percentageId: id,
          status: status,
        },
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data?.responsecode !== "000") {
      return {
        success: false,
        error: response.data?.responsedesc ||
          `Failed to ${status ? "activate" : "deactivate"} percentage range.`,
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
};

// Bulk approve for liability causes
export const bulkApproveLiabilityCauses = async (
  liabilityCauses: { name: string }[],
): Promise<
  { success: true; data: { successCount: number; failedCount: number; totalRecords: number; failedRecords: string[] } } | { success: false; error: string }
> => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await axiosInstance.put<
      ApiResponse<{
        successCount: number;
        failedCount: number;
        totalRecords: number;
        failedRecords: string[];
      }>
    >(`${API_URL}/debt-setting/service/liability-cause/bulk-approve`, liabilityCauses, {
      headers: {
        "Content-Type": "application/json",
        custom: CUSTOM_HEADER,
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data?.responsecode !== "000") {
      return {
        success: false,
        error: response.data?.responsedesc ||
          "Failed to bulk approve liability causes.",
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
};

// Bulk approve for percentage ranges
export const bulkApprovePercentageRanges = async (
  percentageRanges: { code: string }[],
): Promise<
  { success: true; data: { successCount: number; failedCount: number; totalRecords: number; failedRecords: string[] } } | { success: false; error: string }
> => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await axiosInstance.put<
      ApiResponse<{
        successCount: number;
        failedCount: number;
        totalRecords: number;
        failedRecords: string[];
      }>
    >(`${API_URL}/debt-setting/service/percentage-range/bulk-approve`, percentageRanges, {
      headers: {
        "Content-Type": "application/json",
        custom: CUSTOM_HEADER,
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data?.responsecode !== "000") {
      return {
        success: false,
        error: response.data?.responsedesc ||
          "Failed to bulk approve percentage ranges.",
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
};
