import axios from "axios";
import { env } from "@/env";
import { handleApiError } from "error";

export interface Band {
  id?: string;
  name: string;
  hour: number;
  approveStatus?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface BandResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: string;
}

interface BandListResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: Band[];
}

type BandResult = { success: true } | { success: false; error: string };

const API_URL = env.NEXT_PUBLIC_BASE_URL;
const CUSTOM_HEADER = env.NEXT_PUBLIC_CUSTOM_HEADER;

export async function createBand(band: Omit<Band, "id">): Promise<BandResult> {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await axios.post<BandResponse>(
      `${API_URL}/band/service/create`,
      {
        name: band.name,
        hour: band.hour.toString(),
      },
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
        error: response.data.responsedesc || "Failed to fetch audit logs",
      };
    }

    return {
      success: true,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: handleApiError(error),
    };
  }
}

export async function fetchBands(): Promise<
  { success: true; data: Band[] } | { success: false; error: string }
> {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await axios.get<BandListResponse>(
      `${API_URL}/band/service/all`,
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
        error: response.data.responsedesc || "Failed to fetch audit logs",
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

export async function updateBand(
  band: Band,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await axios.put<BandResponse>(
      `${API_URL}/band/service/update`,
      {
        id: band.id,
        name: band.name,
        hour: band.hour.toString(),
      },
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
        error: response.data.responsedesc || "Failed to update band",
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
