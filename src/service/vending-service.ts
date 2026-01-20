// vending-service.ts

import { env } from "@/env";
import { handleApiError } from "error";
import type {
  GenerateCreditTokenPayload,
  GenerateCreditTokenResponse,
  CalculateCreditTokenResponse,
  VendingTransaction,
  VendingDashboardResponse,
  VendingDashboardPayload,
  PrintTokenPayload,
  CalculateCreditTokenPayload,
} from "@/types/vending";
import { axiosInstance } from "@/lib/axios";

const API_URL = env.NEXT_PUBLIC_BASE_URL;
const CUSTOM_HEADER = env.NEXT_PUBLIC_CUSTOM_HEADER;

export async function generateCreditToken(
  payload: GenerateCreditTokenPayload,
): Promise<
  | { success: true; data: GenerateCreditTokenResponse["responsedata"] }
  | { success: false; error: string }
> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      return {
        success: false,
        error: "Authorization token not found",
      };
    }
    const response = await axiosInstance.post<GenerateCreditTokenResponse>(
      `${API_URL}/vending/service/generate/token/credit`,
      payload,
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
        error: response.data.responsedesc || "Failed to generate credit token",
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

export interface GenerateKCTPayload {
  meterNumber?: string;
  meterAccountNumber?: string;
  tokenType: string;
  reason: string;
  oldSgc: string;
  newSgc: string;
  oldKrn: string;
  newKrn: string;
  oldTariffIndex: number;
  newTariffIndex: number;
}

export interface GenerateKCTResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: VendingTransaction;
}

export async function generateKCTToken(
  payload: GenerateKCTPayload,
): Promise<
  | { success: true; data: GenerateKCTResponse["responsedata"] }
  | { success: false; error: string }
> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      return {
        success: false,
        error: "Authorization token not found",
      };
    }
    const response = await axiosInstance.post<GenerateKCTResponse>(
      `${API_URL}/vending/service/generate/token/kct`,
      payload,
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
        error: response.data.responsedesc || "Failed to generate KCT token",
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

export interface GenerateClearTamperPayload {
  meterNumber?: string;
  meterAccountNumber?: string;
  tokenType: string;
  reason: string;
}

export interface GenerateClearTamperResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: VendingTransaction;
}

export async function generateClearTamperToken(
  payload: GenerateClearTamperPayload,
): Promise<
  | { success: true; data: GenerateClearTamperResponse["responsedata"] }
  | { success: false; error: string }
> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      return {
        success: false,
        error: "Authorization token not found",
      };
    }
    const response = await axiosInstance.post<GenerateClearTamperResponse>(
      `${API_URL}/vending/service/generate/token/clear-tamper`,
      payload,
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
        error:
          response.data.responsedesc || "Failed to generate Clear Tamper token",
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

export interface GenerateClearCreditPayload {
  meterNumber?: string;
  meterAccountNumber?: string;
  tokenType: string;
  reason: string;
}

export interface GenerateClearCreditResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: VendingTransaction;
}

export async function generateClearCreditToken(
  payload: GenerateClearCreditPayload,
): Promise<
  | { success: true; data: GenerateClearCreditResponse["responsedata"] }
  | { success: false; error: string }
> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      return {
        success: false,
        error: "Authorization token not found",
      };
    }
    const response = await axiosInstance.post<GenerateClearCreditResponse>(
      `${API_URL}/vending/service/generate/token/clear-credit`,
      payload,
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
        error:
          response.data.responsedesc || "Failed to generate Clear Credit token",
      };
    }

    return {
      success: true,
      data: response.data.responsedata,
    };
  } catch (error) {
    console.error("KCT and Clear Tamper API error:", error);
    return {
      success: false,
      error: handleApiError(error),
    };
  }
}

export interface GenerateKCTAndClearTamperPayload {
  meterNumber?: string;
  tokenType: string;
  reason: string;
  oldSgc: string;
  newSgc: string;
}

export interface GenerateKCTAndClearTamperResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: VendingTransaction;
}

export async function generateKCTAndClearTamperToken(
  payload: GenerateKCTAndClearTamperPayload,
): Promise<
  | { success: true; data: GenerateKCTAndClearTamperResponse["responsedata"] }
  | { success: false; error: string }
> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      return {
        success: false,
        error: "Authorization token not found",
      };
    }
    console.log("KCT and Clear Tamper API call payload:", payload);
    const response =
      await axiosInstance.post<GenerateKCTAndClearTamperResponse>(
        `${API_URL}/vending/service/generate/token/kct-clear-tamper`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            custom: CUSTOM_HEADER,
            Authorization: `Bearer ${token}`,
          },
        },
      );
    console.log("KCT and Clear Tamper API response:", response.data);

    if (response.data.responsecode !== "000") {
      return {
        success: false,
        error:
          response.data.responsedesc ||
          "Failed to generate KCT and Clear Tamper token",
      };
    }

    return {
      success: true,
      data: response.data.responsedata,
    };
  } catch (error) {
    console.error("KCT and Clear Tamper API error:", error);
    return {
      success: false,
      error: handleApiError(error),
    };
  }
}

export interface GenerateCompensationPayload {
  meterNumber?: string;
  meterAccountNumber?: string;
  tokenType: string;
  reason: string;
  units: number;
}

export interface GenerateCompensationResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: VendingTransaction;
}

export async function generateCompensationToken(
  payload: GenerateCompensationPayload,
): Promise<
  | { success: true; data: GenerateCompensationResponse["responsedata"] }
  | { success: false; error: string }
> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      return {
        success: false,
        error: "Authorization token not found",
      };
    }
    const response = await axiosInstance.post<GenerateCompensationResponse>(
      `${API_URL}/vending/service/generate/token/compensation`,
      payload,
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
        error:
          response.data.responsedesc || "Failed to generate Compensation token",
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

export interface PrintTokenResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: {
    printData: string; // PDF content for printing
  };
}

export async function printToken(
  payload: PrintTokenPayload,
): Promise<
  | { success: true; data: PrintTokenResponse["responsedata"] }
  | { success: false; error: string }
> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      return {
        success: false,
        error: "Authorization token not found",
      };
    }

    console.log("Service making API call with payload:", payload);
    const response = await axiosInstance.get(
      `${API_URL}/vending/service/generate/token/print`,
      {
        params: { id: payload.id, tokenType: payload.tokenType },
        headers: {
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // Important for PDF data
      },
    );
    console.log("Service received API response:", response);

    // Convert blob to string for consistency with existing interface
    const pdfText = await response.data.text();
    const mockResponse: PrintTokenResponse = {
      responsecode: "000",
      responsedesc: "Success",
      responsedata: {
        printData: pdfText,
      },
    };

    return {
      success: true,
      data: mockResponse.responsedata,
    };
  } catch (error) {
    console.error("Print token error:", error);
    return {
      success: false,
      error: handleApiError(error),
    };
  }
}

type CalculateCreditTokenPayload =
  | { meterNumber: string; initialAmount: number }
  | { accountNumber: string; initialAmount: number };

export async function calculateCreditToken(payload: {
  payload: CalculateCreditTokenPayload
}): Promise<
  | { success: true; data: CalculateCreditTokenResponse["responsedata"] }
  | { success: false; error: string }
> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      return {
        success: false,
        error: "Authorization token not found",
      };
    }

    const response = await axiosInstance.post<CalculateCreditTokenResponse>(
      `${API_URL}/vending/service/generate/token/credit/calculate`,
      payload,
      {
        headers: {
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data.responsecode !== "000") {
      return {
        success: false,
        error: response.data.responsedesc || "Failed to calculate credit token",
      };
    }

    return {
      success: true,
      data: response.data.responsedata,
    };
  } catch (error) {
    console.error("Calculate credit token error:", error);
    return {
      success: false,
      error: handleApiError(error),
    };
  }
}

export interface GetVendingTransactionsResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: {
    size: number;
    totalPages: number;
    messages: VendingTransaction[];
    page: number;
    totalCount: number;
  };
}

export async function getVendingTransactions(payload?: {
  page?: number;
  size?: number;
}): Promise<
  | { success: true; data: GetVendingTransactionsResponse["responsedata"] }
  | { success: false; error: string }
> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      return {
        success: false,
        error: "Authorization token not found",
      };
    }

    const params = new URLSearchParams();
    if (payload?.page !== undefined)
      params.append("page", payload.page.toString());
    if (payload?.size !== undefined)
      params.append("size", payload.size.toString());

    const response = await axiosInstance.get<GetVendingTransactionsResponse>(
      `${API_URL}/vending/service/generate/token/all?${params.toString()}`,
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
        error: response.data.responsedesc || "Failed to fetch transactions",
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

export async function getVendingDashboardData(
  payload?: VendingDashboardPayload,
): Promise<
  | { success: true; data: VendingDashboardResponse["responsedata"] }
  | { success: false; error: string }
> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      return {
        success: false,
        error: "Authorization token not found",
      };
    }

    const params = new URLSearchParams();
    if (payload?.band) params.append("band", payload.band);
    if (payload?.year) params.append("year", payload.year);
    if (payload?.meterCategory)
      params.append("meterCategory", payload.meterCategory);

    const response = await axiosInstance.get<VendingDashboardResponse>(
      `${API_URL}/dashboard/service/vending?${params.toString()}`,
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
        error: response.data.responsedesc || "Failed to fetch dashboard data",
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
