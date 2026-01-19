import { env } from "@/env";
import { handleApiError } from "error";
import { axiosInstance } from "@/lib/axios";
import {
  type CommunicationReportResponse,
  type CommunicationReportData,
} from "@/types/reports";

const API_URL = env.NEXT_PUBLIC_BASE_URL;
const CUSTOM_HEADER = env.NEXT_PUBLIC_CUSTOM_HEADER;

export async function fetchAllCommunicationReports(
  page = 0,
  size = 5,
  type: "MD" | "Non-MD" = "MD",
  search = "",
): Promise<CommunicationReportData[]> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", size.toString());
    params.append("type", type);
    if (search) {
      params.append("search", search);
    }

    const response = await axiosInstance.get<CommunicationReportResponse>(
      `${API_URL}/hes/service/communication/report`,
      {
        params,
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data.responsecode !== "000") {
      throw new Error(
        response.data.responsedesc ?? "Failed to fetch communication reports.",
      );
    }

    return response.data.responsedata?.data ?? [];
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function fetchCommunicationRangeReport(
  startDate: string,
  endDate: string,
  meterNumbers: string[],
  type: "MD" | "Non-MD",
): Promise<CommunicationReportData[]> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const params = new URLSearchParams();
    params.append("startDate", startDate);
    params.append("endDate", endDate);
    params.append("meterNumber", meterNumbers.join(", "));
    params.append("type", type);

    const response = await axiosInstance.get<CommunicationReportResponse>(
      `${API_URL}/hes/service/communication/range/report`,
      {
        params,
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data.responsecode !== "000") {
      throw new Error(
        response.data.responsedesc ?? "Failed to fetch communication range report.",
      );
    }

    return response.data.responsedata?.data ?? [];
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}
