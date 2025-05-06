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
  responsedata: Array<Tariff>;
}

const API_URL = env.NEXT_PUBLIC_BASE_URL;
const CUSTOM_HEADER = env.NEXT_PUBLIC_CUSTOM_HEADER;

export async function fetchTariffs(): Promise<Tariff[]> {
  try {
    const token = localStorage.getItem("auth_token");

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

    if (response.data.responsecode === "000") {
      return response.data.responsedata;
    } else {
      throw new Error(response.data.responsedesc ?? "Failed to fetch tariffs");
    }
  } catch (error) {
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
