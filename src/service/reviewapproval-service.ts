import axios from "axios";
import { handleApiError } from "error";
import {
  GetPercentageResponse,
  GetAllLiabilitiesResponse,
  GetBandResponse,
  GetTariffResponse,
  MeterResponse,
} from "@/types/review-approval";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
const CUSTOM_HEADER = process.env.NEXT_PUBLIC_CUSTOM_HEADER;

export interface FetchParams {
  page: number;
  pageSize: number;
  searchTerm?: string;
  sortBy?: string | null;
  sortDirection?: "asc" | "desc" | null;
  approveStatus?: string; // Filter by approval status
}

export interface ApproveRejectPayload {
  id?: string;
  liabilityCauseId?: string;
  approveStatus: "approve" | "reject";
  reason?: string;
}

// Utility function to handle API requests with common logic
async function fetchApi<T>(
  url: string,
  params: Record<string, any> = {},
  method: "GET" | "POST" | "PUT" = "GET",
  data?: any,
): Promise<T> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const config = {
      method,
      url,
      params,
      data: method === "POST" || method === "PUT" ? data : undefined,
      headers: {
        "Content-Type": "application/json",
        custom: CUSTOM_HEADER,
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios(config);

    if (response.data.responsecode !== "000") {
      throw new Error(
        response.data.responsedesc ?? "An unknown error occurred.",
      );
    }

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

// Percentage Range
export async function getAllPercentageRanges({
  page,
  pageSize,
  searchTerm,
  sortBy,
  sortDirection,
  approveStatus = "pending",
}: FetchParams): Promise<GetPercentageResponse> {
  const params: Record<string, any> = {
    page: String(page),
    pageSize: String(pageSize),
  };

  if (approveStatus) {
    params.approveStatus = approveStatus;
  }

  if (searchTerm) params.search = searchTerm;
  if (sortBy) {
    params.sortBy = sortBy;
    params.sortDirection = sortDirection ?? "asc";
  }

  const url = `${API_URL}/debt-setting/service/percentage-range/all`;

  return await fetchApi<GetPercentageResponse>(url, params);
}

export async function getPercentageRange(
  id: string,
): Promise<GetPercentageResponse> {
  return fetchApi<GetPercentageResponse>(
    `${API_URL}/debt-setting/service/percentage-range/single`,
    { percentageVersionId: id },
  );
}

export async function reviewPercentageRange(
  id: string,
  approveStatus: "approve" | "reject",
  reason?: string,
): Promise<GetPercentageResponse> {
  const params = { percentageId: id, approveStatus };
  const data = reason ? { reason } : undefined;
  return fetchApi<GetPercentageResponse>(
    `${API_URL}/debt-setting/service/percentage-range/approve`,
    params,
    "PUT",
    data,
  );
}

// Liability
export async function getAllLiabilities({
  page,
  pageSize,
  searchTerm,
  sortBy,
  sortDirection,
  approveStatus,
}: FetchParams): Promise<GetAllLiabilitiesResponse> {
  const params: Record<string, any> = {
    page: String(page),
    pageSize: String(pageSize),
  };
  if (approveStatus) {
    params.approveStatus = approveStatus;
  }
  if (searchTerm) params.search = searchTerm;
  if (sortBy) {
    params.sortBy = sortBy;
    params.sortDirection = sortDirection ?? "asc";
  }
  return fetchApi<GetAllLiabilitiesResponse>(
    `${API_URL}/debt-setting/service/liability-cause/all`,
    params,
  );
}

export async function getLiability(
  id: string,
): Promise<GetAllLiabilitiesResponse> {
  return fetchApi<GetAllLiabilitiesResponse>(
    `${API_URL}/liability/service/${id}`,
  );
}

export async function reviewLiability(
  id: string,
  approveStatus: "approve" | "reject",
  reason?: string,
): Promise<GetAllLiabilitiesResponse> {
  const params = { liabilityCauseId: id, approveStatus };
  const data = reason ? { reason } : undefined;
  return fetchApi<GetAllLiabilitiesResponse>(
    `${API_URL}/debt-setting/service/liability-cause/approve`,
    params,
    "PUT",
    data,
  );
}

// Band
export async function getAllBands({
  page,
  pageSize,
  searchTerm,
  sortBy,
  sortDirection,
}: FetchParams): Promise<GetBandResponse> {
  const params: Record<string, any> = {
    page: String(page),
    pageSize: String(pageSize),
  };
  if (searchTerm) params.search = searchTerm;
  if (sortBy) {
    params.sortBy = sortBy;
    params.sortDirection = sortDirection ?? "asc";
  }
  return fetchApi<GetBandResponse>(`${API_URL}/band/service/all`, params);
}

export async function getBand(id: string): Promise<GetBandResponse> {
  return fetchApi<GetBandResponse>(`${API_URL}/band/service/${id}`);
}

export async function reviewBand(
  id: string,
  approveStatus: "approve" | "reject",
  reason?: string,
): Promise<GetBandResponse> {
  const payload: ApproveRejectPayload = { id, approveStatus };
  if (reason) {
    payload.reason = reason;
  }
  return fetchApi<GetBandResponse>(
    `${API_URL}/band/service/approve`,
    {},
    "POST",
    payload,
  );
}

// Tariff
export async function getAllTariffs({
  page,
  pageSize,
  searchTerm,
  sortBy,
  sortDirection,
}: FetchParams): Promise<GetTariffResponse> {
  const params: Record<string, any> = {
    page: String(page),
    pageSize: String(pageSize),
  };
  if (searchTerm) params.search = searchTerm;
  if (sortBy) {
    params.sortBy = sortBy;
    params.sortDirection = sortDirection ?? "asc";
  }
  return fetchApi<GetTariffResponse>(`${API_URL}/tariff/service/all`, params);
}

export async function getTariff(id: string): Promise<GetTariffResponse> {
  return fetchApi<GetTariffResponse>(`${API_URL}/tariff/service/${id}`);
}

export async function reviewTariff(
  id: string,
  approveStatus: "approve" | "reject",
  reason?: string,
): Promise<GetTariffResponse> {
  const payload: ApproveRejectPayload = { id, approveStatus };
  if (reason) {
    payload.reason = reason;
  }
  return fetchApi<GetTariffResponse>(
    `${API_URL}/tariff/service/approve-reject`,
    {},
    "POST",
    payload,
  );
}

// Meter
export async function getAllMeters({
  page,
  pageSize,
  searchTerm,
  sortBy,
  sortDirection,
}: FetchParams): Promise<MeterResponse> {
  const params: Record<string, any> = {
    page: String(page),
    pageSize: String(pageSize),
  };
  if (searchTerm) params.search = searchTerm;
  if (sortBy) {
    params.sortBy = sortBy;
    params.sortDirection = sortDirection ?? "asc";
  }
  return fetchApi<MeterResponse>(`${API_URL}/meter/service/all`, params);
}

export async function getMeter(id: string): Promise<MeterResponse> {
  return fetchApi<MeterResponse>(`${API_URL}/meter/service/${id}`);
}

export async function reviewMeter(
  id: string,
  approveStatus: "approve" | "reject",
  reason?: string,
): Promise<MeterResponse> {
  const payload: ApproveRejectPayload = { id, approveStatus };
  if (reason) {
    payload.reason = reason;
  }
  return fetchApi<MeterResponse>(
    `${API_URL}/meter/service/approve`,
    {},
    "POST",
    payload,
  );
}
