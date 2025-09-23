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
  type?: string; // Filter by approval status
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
  type = "pending-state",
}: FetchParams): Promise<GetPercentageResponse> {
  const params: Record<string, any> = {
    page: String(page),
    pageSize: String(pageSize),
  };

  if (type) {
    params.type = type;
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

// reviewapproval-service.ts
export async function reviewPercentageRange(
  percentageId: string,
  approveStatus: "approve" | "reject",
): Promise<GetPercentageResponse> {
  // Create a params object with all required data for the URL query
  const params: {
    percentageId: string;
    approveStatus: "approve" | "reject";
  } = {
    percentageId: percentageId,
    approveStatus,
  };

  if (approveStatus) {
    params.approveStatus = approveStatus;
  }

  return fetchApi<GetPercentageResponse>(
    `${API_URL}/debt-setting/service/percentage-range/approve`,
    params, // Pass the payload as the URL parameters
    "PUT",
    undefined, // No request body
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
  const params: Record<string, any> = {
    page: String(page),
    pageSize: String(pageSize),
  };

  if (type) {
    params.type = type;
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
): Promise<GetPercentageResponse> {
  // Create a params object with all required data for the URL query
  const params: {
    liabilityCauseId: string;
    approveStatus: "approve" | "reject";
  } = {
    liabilityCauseId: id,
    approveStatus,
  };

  if (approveStatus) {
    params.approveStatus = approveStatus;
  }

  return fetchApi<GetPercentageResponse>(
    `${API_URL}/debt-setting/service/liability-cause/approve`,
    params, // Pass the payload as the URL parameters
    "PUT",
    undefined, // No request body
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
  const params: Record<string, any> = {
    page: String(page),
    pageSize: String(pageSize),
  };
  if (type) {
    params.type = type;
  }
  if (type) {
    params.type = type;
  }

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
): Promise<GetPercentageResponse> {
  // Create a params object with all required data for the URL query
  const params: {
    bandId: string;
    approveStatus: "approve" | "reject";
  } = {
     bandId: id,
    approveStatus,
  };

  if (approveStatus) {
    params.approveStatus = approveStatus;
  }

  return fetchApi<GetPercentageResponse>(
    `${API_URL}/band/service/approve`,
    params, // Pass the payload as the URL parameters
    "PUT",
    undefined, // No request body
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
  const params: Record<string, any> = {
    page: String(page),
    pageSize: String(pageSize),
  };

  if (type) {
    params.type = type;
  }
  if (type) {
    params.type = type;
  }
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
): Promise<GetPercentageResponse> {
  // Create a params object with all required data for the URL query
  const params: {
    tId: string;
    approveStatus: "approve" | "reject";
  } = {
     tId: id,
    approveStatus,
  };

  if (approveStatus) {
    params.approveStatus = approveStatus;
  }

  return fetchApi<GetPercentageResponse>(
    `${API_URL}/tariff/service/approve`,
    params, // Pass the payload as the URL parameters
    "PUT",
    undefined, // No request body
  );
}

// Meter
export async function getAllMeters({
  page,
  pageSize,
  searchTerm,
  sortBy,
  sortDirection,
  type = "pending-state",
}: FetchParams): Promise<MeterResponse> {
  const params: Record<string, any> = {
    page: String(page),
    pageSize: String(pageSize),
  };
  if (type) {
    params.type = type;
  }
  if (type) {
    params.type = type;
  }
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
): Promise<GetPercentageResponse> {
  // Create a params object with all required data for the URL query
  const params: {
    meterVersionId: string;
    approveStatus: "approve" | "reject";
  } = {
      meterVersionId: id,
    approveStatus,
  };

  if (approveStatus) {
    params.approveStatus = approveStatus;
  }

  return fetchApi<GetPercentageResponse>(
    `${API_URL}/debt-setting/service/meter/approve`,
    params, // Pass the payload as the URL parameters
    "PUT",
    undefined, // No request body
  );
}
