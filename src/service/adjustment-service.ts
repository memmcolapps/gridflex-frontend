/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  type Adjustment,
  type ApiResponse,
  type AdjustmentPayload,
  type AdjustmentMutationResponse,
  type Meter,
  type LiabilityCause,
  type PaymentHistoryItem,
  type PaymentHistoryTransaction,
  type PaymentHistoryResponse,
} from "@/types/credit-debit";
import { env } from "@/env";
import { handleApiError } from "@/utils/error-handler";
import { axiosInstance } from "@/lib/axios";

const API_URL = env.NEXT_PUBLIC_BASE_URL;
const CUSTOM_HEADER = env.NEXT_PUBLIC_CUSTOM_HEADER;

// Function to fetch all adjustments by type (credit or debit)
export const fetchAllAdjustments = async (
  type: "credit" | "debit",
  page = 0,
  size = 10,
  searchTerm?: string,
): Promise<
  | { success: true; data: Adjustment[]; totalData?: number }
  | { success: false; error: string }
> => {
  try {
    const token = localStorage.getItem("auth_token");

    const params: Record<string, string | number> = {
      type,
      page,
      size,
    };

    if (searchTerm) params.search = searchTerm;

    const response = await axiosInstance.get<ApiResponse<any>>(
      `${API_URL}/debit-credit-adjustment/service/all`,
      {
        params,
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
        error: response.data?.responsedesc || "Failed to fetch adjustments.",
      };
    }

    // Correctly access the nested data array
    const adjustments = response.data?.responsedata?.data;

    return {
      success: true,
      data: Array.isArray(adjustments) ? adjustments : [],
      totalData: response.data?.responsedata?.totalData,
    };
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error).message,
    };
  }
};

// Function to search for a meter by its number or account number
export const searchMeterByNumber = async (
  searchTerm: string,
  searchType: "meterNumber" | "accountNumber",
): Promise<
  { success: true; data: Meter } | { success: false; error: string }
> => {
  try {
    const token = localStorage.getItem("auth_token");

    const params = { [searchType]: searchTerm };

    const response = await axiosInstance.get<ApiResponse<Meter>>(
      `${API_URL}/meter/service/single`,
      {
        params,
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data?.responsecode !== "000" || !response.data?.responsedata) {
      return {
        success: false,
        error: response.data?.responsedesc || "Failed to fetch meter details.",
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

// Function to fetch all liability causes
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

    if (response.data?.responsecode !== "000" || !response.data?.responsedata) {
      return {
        success: false,
        error:
          response.data?.responsedesc || "Failed to fetch liability causes.",
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

// Function to create a debit or credit adjustment
export const createAdjustment = async (
  payload: AdjustmentPayload,
): Promise<{ success: true } | { success: false; error: string }> => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await axiosInstance.post<AdjustmentMutationResponse>(
      `${API_URL}/debit-credit-adjustment/service/create`,
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
        error: response.data?.responsedesc || "Failed to create adjustment.",
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

// Function to reconcile a debit
export const reconcileDebit = async (
  debitCreditAdjustmentId: string,
  amount: number,
): Promise<
  { success: true; data: any } | { success: false; error: string }
> => {
  try {
    const token = localStorage.getItem("auth_token");

    // Corrected to use POST request with URL parameters
    const response = await axiosInstance.post(
      `${API_URL}/debit-credit-adjustment/service/reconcile-dept`,
      null,
      {
        params: {
          debitCreditAdjustmentId,
          amount,
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
        error: response.data?.responsedesc ?? "Failed to reconcile debit.",
      };
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error).message,
    };
  }
};

// Function to fetch payment history for a meter and liability cause
export const fetchPaymentHistory = async (
  meterId: string,
  liabilityCauseId: string | undefined,
  type: "credit" | "debit",
): Promise<
  | { success: true; data: PaymentHistoryTransaction[][] }
  | { success: false; error: string }
> => {
  try {
    const token = localStorage.getItem("auth_token");

    const params: Record<string, string> = {
      meterId,
      type,
    };

    if (liabilityCauseId) {
      params.liabilityCauseId = liabilityCauseId;
    }

    const response = await axiosInstance.get<PaymentHistoryResponse>(
      `${API_URL}/debit-credit-adjustment/service/payment-history`,
      {
        params,
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data?.responsecode !== "000" || !response.data?.responsedata) {
      return {
        success: false,
        error:
          response.data?.responsedesc || "Failed to fetch payment history.",
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

// New function to fetch payment history for frequently-used-reports
// Returns PaymentHistoryTransaction[][] based on the new API response structure
export const fetchPaymentHistoryTransactions = async (
  meterId: string,
  liabilityCauseId: string,
  type: "credit" | "debit",
): Promise<
  | { success: true; data: PaymentHistoryTransaction[][] }
  | { success: false; error: string }
> => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await axiosInstance.get<PaymentHistoryResponse>(
      `${API_URL}/debit-credit-adjustment/service/payment-history`,
      {
        params: {
          meterId,
          liabilityCauseId,
          type,
        },
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data?.responsecode !== "000" || !response.data?.responsedata) {
      return {
        success: false,
        error:
          response.data?.responsedesc || "Failed to fetch payment history.",
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
