import axios from "axios";
import { env } from "@/env";
import { handleApiError } from "error";
import {
  type GetManufacturersResponse,
  type Manufacturer,
} from "@/types/meters-manufacturers";

const API_URL = env.NEXT_PUBLIC_BASE_URL;
const CUSTOM_HEADER = env.NEXT_PUBLIC_CUSTOM_HEADER;

export async function fetchManufacturers(
  page?: number,
  size?: number,
  name?: string,
  manufacturerId?: string,
  sgc?: string,
  state?: string,
  createdAt?: string,
): Promise<
  | {
      success: true;
      data: {
        totalData: number;
        data: Manufacturer[];
        size: number;
        totalPages: number;
        page: number;
      };
    }
  | { success: false; error: string }
> {
  try {
    const token = localStorage.getItem("auth_token");

    page ??= 1;
    size ??= 10;

    const response = await axios.get<GetManufacturersResponse>(
      `${API_URL}/manufacturer/service/all-manufacturers?page=${page}&size=${size}&name=${name}&manufacturerId=${manufacturerId}&sgc=${sgc}&state=${state}&createdAt=${createdAt}`,
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
      data: response.data.responsedata,
    };
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error),
    };
  }
}
