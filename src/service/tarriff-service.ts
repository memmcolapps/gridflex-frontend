import axios from "axios";
import { env } from "@/env";
import { handleApiError } from "error";

export interface Tariff {
  id: number;
  name: string;
  tariff_index: number;
  tariff_type: string;
  effective_date: string;
  tariff_rate: string;
  band: string;
  status: boolean;
  approve_status: "Pending" | "Approved" | "Rejected";
  created_at: string;
  updated_at: string;
}

export interface TariffPayload {
  name: string;
  tariff_index: number;
  tariff_type: string;
  effective_date: string;
  band: string;
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
  tariffId: string | number,
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
