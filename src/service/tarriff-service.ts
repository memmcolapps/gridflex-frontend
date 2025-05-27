import axios from "axios";
import { toast } from "sonner";
import { handleApiError } from "@/utils/error-handler";
import { env } from "@/env";

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

export async function fetchTariffs(): Promise<Tariff[]> {
  try {
    const token = localStorage.getItem("auth_token");

    console.log("Fetching tariffs..."); // Debug log

    const response = await axios.get<TariffListResponse>(
      `${API_URL}/tariff/service/all-tariff`,
      {
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log("API Response:", response.data); // Debug log

    if (response.data.responsecode === "000") {
      // if (!Array.isArray(response.data.responsedata)) {
      //   console.warn(
      //     "Response data is not an array:",
      //     response.data.responsedata,
      //   );
      //   return [];
      // }
      return response.data.responsedata.data;
    }

    console.warn(
      "Unexpected response code:",
      response.data.responsecode,
      response.data.responsedesc,
    );
    return [];
  } catch (error) {
    console.error("Error fetching tariffs:", error);
    const apiError = handleApiError(error);
    toast.error(apiError.message);
    return [];
  }
}

export async function createTariff(tariff: {
  name: string;
  tariff_index: number;
  tariff_type: string;
  effective_date: string;
  band: string;
  tariff_rate: string;
}): Promise<boolean> {
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

    if (response.data.responsecode === "000") {
      toast.success(response.data.responsedesc);
      return true;
    } else {
      throw new Error(response.data.responsedesc ?? "Failed to create tariff");
    }
  } catch (error) {
    const apiError = handleApiError(error);
    toast.error(apiError.message);
    return false;
  }
}

export async function changeTariffStatus(
  tariffId: string | number,
  status: boolean,
): Promise<boolean> {
  try {
    const token = localStorage.getItem("auth_token");
    console.log(`Changing tariff status for ID ${tariffId} to ${status}`); // Debug log

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

    console.log("Status change response:", response.data); // Debug log

    if (response.data.responsecode === "000") {
      toast.success(response.data.responsedesc);
      return true;
    }

    console.warn("Unexpected response:", response.data);
    throw new Error(
      response.data.responsedesc ?? "Failed to update tariff status",
    );
  } catch (error) {
    console.error("Error changing tariff status:", error);
    const apiError = handleApiError(error);
    toast.error(apiError.message);
    return false;
  }
}

export async function changeTariffApprovalStatus(
  tariffId: string | number,
  approvalStatus: "Approved" | "Rejected",
): Promise<boolean> {
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

    if (response.data.responsecode === "000") {
      toast.success(response.data.responsedesc);
      return true;
    } else {
      throw new Error(
        response.data.responsedesc ?? "Failed to update approval status",
      );
    }
  } catch (error) {
    const apiError = handleApiError(error);
    toast.error(apiError.message);
    return false;
  }
}
