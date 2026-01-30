import { env } from "@/env";
import { handleApiError } from "error";
import { axiosInstance } from "@/lib/axios";

const API_URL = env.NEXT_PUBLIC_BASE_URL;
const CUSTOM_HEADER = env.NEXT_PUBLIC_CUSTOM_HEADER;

export interface FeederItem {
  assetId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface DSSItem {
  name: string;
  assetId: string;
  createdAt: string;
  updatedAt: string;
}

interface FeederResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: FeederItem[];
}

interface DSSResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: DSSItem[];
}

export async function fetchFeeders(): Promise<FeederItem[]> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const response = await axiosInstance.get<FeederResponse>(
      `${API_URL}/node/service/feeder`,
      {
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.responsecode !== "000") {
      throw new Error(
        response.data.responsedesc || "Failed to fetch feeders"
      );
    }

    return response.data.responsedata;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function fetchDSSByFeeder(feederAssetId: string): Promise<DSSItem[]> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const response = await axiosInstance.get<DSSResponse>(
      `${API_URL}/node/service/dss`,
      {
        params: { assetId: feederAssetId },
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.responsecode !== "000") {
      throw new Error(
        response.data.responsedesc || "Failed to fetch DSS"
      );
    }

    return response.data.responsedata;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}
