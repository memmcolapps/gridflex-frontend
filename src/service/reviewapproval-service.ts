import type {
  GetPercentageResponse,
  GetAllLiabilitiesResponse,
  GetBandResponse,
  GetTariffResponse,
  MeterResponse,
} from "@/types/review-approval";
import axios from "axios";
import { handleApiError } from "error";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
const CUSTOM_HEADER = process.env.NEXT_PUBLIC_CUSTOM_HEADER;

// Validate environment variables
if (!API_URL || !CUSTOM_HEADER) {
  throw new Error(
    "Missing required environment variables: API_URL or CUSTOM_HEADER",
  );
}

export interface FetchParams {
  page: number;
  pageSize: number;
  searchTerm?: string;
  sortBy?: string | null;
  sortDirection?: "asc" | "desc" | null;
  type?: string; // Filter by approval status
  meterStage?: string; // Filter by meter approval status
}

export interface ApproveRejectPayload {
  id?: string;
  liabilityCauseId?: string;
  approveStatus: "approve" | "reject";
  reason?: string;
}

interface QueryParams {
  page?: string;
  pageSize?: string;
  search?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  type?: string;
  percentageId?: string;
  liabilityCauseId?: string;
  bandId?: string;
  tId?: string;
  meterVersionId?: string;
  approveStatus?: "approve" | "reject";
  [key: string]: string | undefined; // Allow additional string params
}

// Utility function to construct API URLs
const getApiUrl = (path: string) => `${API_URL}${path}`;

// Utility function to handle API requests with common logic
async function fetchApi<T>(
  url: string,
  params: QueryParams = {},
  method: "GET" | "POST" | "PUT" = "GET",
  data?: ApproveRejectPayload | undefined,
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
  type = "pending-state",
}: FetchParams): Promise<GetPercentageResponse> {
  const params: QueryParams = {
    page: String(page),
    pageSize: String(pageSize),
  };

  if (type) params.type = type;
  if (searchTerm) params.search = searchTerm;
  if (sortBy) {
    params.sortBy = sortBy;
    params.sortDirection = sortDirection ?? "asc";
  }

  return await fetchApi<GetPercentageResponse>(
    getApiUrl("/debt-setting/service/percentage-range/all"),
    params,
  );
}

export async function getPercentageRange(
  id: string,
): Promise<GetPercentageResponse> {
  return fetchApi<GetPercentageResponse>(
    getApiUrl("/debt-setting/service/percentage-range/single"),
    { percentageVersionId: id },
  );
}

export async function reviewPercentageRange(
  percentageId: string,
  approveStatus: "approve" | "reject",
): Promise<GetPercentageResponse> {
  const params: QueryParams = {
    percentageId,
    approveStatus,
  };

  return fetchApi<GetPercentageResponse>(
    getApiUrl("/debt-setting/service/percentage-range/approve"),
    params,
    "PUT",
    undefined,
  );
}

// Liability
export async function getAllLiabilities({
  page,
  pageSize,
  searchTerm,
  sortBy,
  sortDirection,
  type = "pending-state",
}: FetchParams): Promise<GetAllLiabilitiesResponse> {
  const params: QueryParams = {
    page: String(page),
    pageSize: String(pageSize),
  };

  if (type) params.type = type;
  if (searchTerm) params.search = searchTerm;
  if (sortBy) {
    params.sortBy = sortBy;
    params.sortDirection = sortDirection ?? "asc";
  }

  return fetchApi<GetAllLiabilitiesResponse>(
    getApiUrl("/debt-setting/service/liability-cause/all"),
    params,
  );
}

export async function getLiability(
  id: string,
): Promise<GetAllLiabilitiesResponse> {
  return fetchApi<GetAllLiabilitiesResponse>(
    getApiUrl(`/liability/service/${id}`),
  );
}

export async function reviewLiability(
  id: string,
  approveStatus: "approve" | "reject",
): Promise<GetPercentageResponse> {
  const params: QueryParams = {
    liabilityCauseId: id,
    approveStatus,
  };

  return fetchApi<GetPercentageResponse>(
    getApiUrl("/debt-setting/service/liability-cause/approve"),
    params,
    "PUT",
    undefined,
  );
}

// Band
export async function getAllBands({
  page,
  pageSize,
  searchTerm,
  sortBy,
  sortDirection,
  type = "pending-state",
}: FetchParams): Promise<GetBandResponse> {
  const params: QueryParams = {
    page: String(page),
    pageSize: String(pageSize),
  };

  if (type) params.type = type;
  if (searchTerm) params.search = searchTerm;
  if (sortBy) {
    params.sortBy = sortBy;
    params.sortDirection = sortDirection ?? "asc";
  }

  return fetchApi<GetBandResponse>(getApiUrl("/band/service/all"), params);
}

export async function getBand(id: string): Promise<GetBandResponse> {
  return fetchApi<GetBandResponse>(getApiUrl(`/band/service/${id}`));
}

export async function reviewBand(
  id: string,
  approveStatus: "approve" | "reject",
): Promise<GetPercentageResponse> {
  const params: QueryParams = {
    bandId: id,
    approveStatus,
  };

  return fetchApi<GetPercentageResponse>(
    getApiUrl("/band/service/approve"),
    params,
    "PUT",
    undefined,
  );
}

// Tariff
export async function getAllTariffs({
  page,
  pageSize,
  searchTerm,
  sortBy,
  sortDirection,
  type = "pending-state",
}: FetchParams): Promise<GetTariffResponse> {
  const params: QueryParams = {
    page: String(page),
    pageSize: String(pageSize),
  };

  if (type) params.type = type;
  if (searchTerm) params.search = searchTerm;
  if (sortBy) {
    params.sortBy = sortBy;
    params.sortDirection = sortDirection ?? "asc";
  }

  return fetchApi<GetTariffResponse>(getApiUrl("/tariff/service/all"), params);
}

export async function getTariff(id: string): Promise<GetTariffResponse> {
  return fetchApi<GetTariffResponse>(getApiUrl(`/tariff/service/${id}`));
}

export async function reviewTariff(
  id: string,
  approveStatus: "approve" | "reject",
): Promise<GetPercentageResponse> {
  const params: QueryParams = {
    tId: id,
    approveStatus,
  };

  return fetchApi<GetPercentageResponse>(
    getApiUrl("/tariff/service/approve"),
    params,
    "PUT",
    undefined,
  );
}

// Meter
export async function getAllMeters({
  page,
  pageSize,
  searchTerm,
  sortBy,
  sortDirection,
  meterStage = "pending-state",
}: FetchParams): Promise<MeterResponse> {
  const params: QueryParams = {
    page: String(page),
    pageSize: String(pageSize),
  };

  if (meterStage) params.type = meterStage;
  if (searchTerm) params.search = searchTerm;
  if (sortBy) {
    params.sortBy = sortBy;
    params.sortDirection = sortDirection ?? "asc";
  }

  return fetchApi<MeterResponse>(getApiUrl("/meter/service/all"), params);
}

export async function getMeter(id: string): Promise<MeterResponse> {
  return fetchApi<MeterResponse>(getApiUrl(`/meter/service/${id}`));
}

export async function reviewMeter(
  id: string,
  approveStatus: "approve" | "reject",
): Promise<GetPercentageResponse> {
  const params: QueryParams = {
    meterVersionId: id,
    approveStatus,
  };

  return fetchApi<GetPercentageResponse>(
    getApiUrl("/debt-setting/service/meter/approve"),
    params,
    "PUT",
    undefined,
  );
}
