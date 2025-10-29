import axios from "axios";
import { env } from "@/env";
import { handleApiError } from "error";

export interface Tariff {
  id: string;
  name: string;
  org_id: string;
  action: string;
  tariff_type: string;
  effective_date: string;
  tariff_rate: string;
  band_id: string;
  band: {
    id: string;
    org_id: string;
    name: string;
    hour: number;
    approve_status: string;
    status: boolean;
    created_at: string;
    updated_at: string;
  };
  status: boolean;
  approve_status: string;
  created_at: string;
  updated_at: string;
}

export interface TariffPayload {
  name: string;
  tariff_type: string;
  effective_date: string;
  band_id: string;
  tariff_rate: string;
}

interface TariffResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: string;
}

interface TariffListResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: {
    data: Array<Tariff>;
    totalData: number;
    page: number;
    size: number;
  };
}

interface StatusChangeResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: string;
}

interface ApprovalStatusResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: string;
}

const API_URL = env.NEXT_PUBLIC_BASE_URL;
const CUSTOM_HEADER = env.NEXT_PUBLIC_CUSTOM_HEADER;

export async function fetchTariffs(): Promise<
  { success: true; data: Tariff[] } | { success: false; error: string }
> {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await axios.get<TariffListResponse>(
      `${API_URL}/tariff/service/all`,
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
      data: response.data.responsedata.data,
    };
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error),
    };
  }
}

export async function createTariff(
  tariff: TariffPayload,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await axios.post<TariffResponse>(
      `${API_URL}/tariff/service/create`,
      tariff,
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
        error: response.data.responsedesc || "Failed to create tariff",
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

export async function changeTariffStatus(
  tariffId: string,
  status: boolean,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await axios.patch<StatusChangeResponse>(
      `${API_URL}/tariff/service/change-state`,
      null,
      {
        params: {
          tariffId,
          status,
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
        error: response.data.responsedesc || "Failed to update tariff status",
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

export async function changeTariffApprovalStatus(
  tariffId: string | number,
  approvalStatus: "Approved" | "Rejected",
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const token = localStorage.getItem("auth_token");

    const formData = new FormData();
    formData.append("tariffId", tariffId.toString());
    formData.append("approvalStatus", approvalStatus.toLowerCase());

    const response = await axios.patch<ApprovalStatusResponse>(
      `${API_URL}/tariff/service/change-state`,
      null,
      {
        params: {
          tariffId,
          approvalStatus: approvalStatus.toLowerCase(),
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
        error: response.data.responsedesc || "Failed to update approval status",
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

export interface UpdateTariffPayload {
  t_id: string;
  name?: string;
  tariff_type?: string;
  effective_date?: string;
  tariff_rate?: string;
  band_id?: string;
}

export interface ExportTariffParams {
  // Add parameters as needed based on backend requirements
}

export interface ExportTariffResponse extends Blob {}

export async function updateTariff(
  tariff: UpdateTariffPayload,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await axios.put<TariffResponse>(
      `${API_URL}/tariff/service/update`,
      tariff,
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
        error: response.data.responsedesc || "Failed to update tariff",
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
export async function exportTariff(params: ExportTariffParams = {}): Promise<Blob> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    // Convert params to URLSearchParams for GET request
    const searchParams = new URLSearchParams();
    // Add any parameters as needed
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const url = searchParams.toString()
      ? `${API_URL}/tariff/service/export?${searchParams.toString()}`
      : `${API_URL}/tariff/service/export`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        custom: CUSTOM_HEADER,
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob', // Important for file downloads
    });

    // For file downloads, we don't check responsecode in the same way
    // The response will be a blob containing the Excel file
    // Check if the response is actually a blob (successful file download)
    if (response.data instanceof Blob) {
      return response.data;
    } else {
      // If it's not a blob, it might be an error response
      throw new Error('Failed to download file');
    }
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}
