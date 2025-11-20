import { axiosInstance } from "@/lib/axios";
import {
  type CommunicationReportResponse,
  type CommunicationReportData,
} from "@/types/reports";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("auth_token");
  if (!token) {
    throw new Error("Authentication token not found.");
  }
  return `Bearer ${token}`;
};

export const fetchAllCommunicationReports = async (
  page = 0,
  size = 5,
  type: "MD" | "Non-MD",
  search = "",
): Promise<CommunicationReportData[]> => {
  try {
    axios.defaults.headers.common.Authorization = getAuthHeader();

    const response = await axiosInstance.get<CommunicationReportResponse>(
      `${BASE_URL}/hes/service/communication/report`,
      {
        params: {
          page,
          size,
          type,
          search,
        },
      },
    );

    if (response.data?.responsecode !== "000") {
      throw new Error(
        response.data?.responsedesc ?? "Failed to fetch communication reports.",
      );
    }

    return response.data.responsedata?.data ?? [];
  } catch (error) {
    console.error("Error fetching communication reports:", error);

    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.responsedesc ??
          "Failed to fetch communication reports.",
      );
    }

    throw error;
  }
};
