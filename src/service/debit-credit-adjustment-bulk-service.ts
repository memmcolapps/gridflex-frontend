// service/debit-credit-adjustment-bulk-service.ts

import { env } from "@/env";
import { handleApiError } from "@/utils/error-handler";
import { axiosInstance } from "@/lib/axios";

const API_URL = env.NEXT_PUBLIC_BASE_URL;
const CUSTOM_HEADER = env.NEXT_PUBLIC_CUSTOM_HEADER;

// --- API Service Functions ---

export async function downloadDebitCreditCsvTemplate(): Promise<Blob> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const response = await axiosInstance.get(
      `${API_URL}/debit-credit-adjustment/service/download/template/csv`,
      {
        responseType: "blob",
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    const apiError = handleApiError(error);
    throw new Error(apiError.message);
  }
}

export async function downloadDebitCreditExcelTemplate(): Promise<Blob> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const response = await axiosInstance.get(
      `${API_URL}/debit-credit-adjustment/service/download/template/excel`,
      {
        responseType: "blob",
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    const apiError = handleApiError(error);
    throw new Error(apiError.message);
  }
}

export async function bulkUploadDebitCredit(file: File): Promise<{
  responsecode: string;
  responsedesc: string;
  responsedata: {
    totalRecords: number;
    failedCount: number;
    failedRecords: string[];
    successCount: number;
  };
}> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post(
      `${API_URL}/debit-credit-adjustment/service/bulk-upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data.responsecode !== "000") {
      throw new Error(
        response.data.responsedesc ??
          "Failed to bulk upload debit/credit adjustments.",
      );
    }

    return response.data;
  } catch (error) {
    const apiError = handleApiError(error);
    throw new Error(apiError.message);
  }
}
