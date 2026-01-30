// service/billing-service.ts

import { env } from "@/env";
import { handleApiError } from "error";
import { axiosInstance } from "@/lib/axios";

const API_URL = env.NEXT_PUBLIC_BASE_URL;
const CUSTOM_HEADER = env.NEXT_PUBLIC_CUSTOM_HEADER;

// --- Type Definitions ---

export interface MeterReadingItem {
  meterNumber: string;
  readingType: string;
  lastReading: number;
  currentReading: number;
  currentReadingDate: string;
  lastReadingDate: string;
  billMonth: string;
  billYear: string;
  createdAt: string;
  updatedAt: string;
  tariffType: string;
  feederName: string;
  dssName: string;
  meterClass: string;
  type: string;
}

export interface CreateMeterReadingPayload {
  meterNumber: string;
  billMonth: string;
  billYear: string;
  currentReading: string;
  meterClass: string;
}

export interface VirtualMeterReadingItem {
  meterId: string;
  date: string;
  currentReading: number;
}

export type CreateVirtualMeterReadingPayload = VirtualMeterReadingItem[];

export interface CreateMeterReadingResponse {
  responsecode: "000" | string;
  responsedesc: string;
  responsedata?: Record<string, unknown>;
}

export interface GenerateReadingParams {
  assetId: string;
  type: string;
  meterClass: string;
}

export interface GenerateReadingResponse {
  responsecode: "000" | string;
  responsedesc: string;
  responsedata: GeneratedReadingItem[];
}

export interface GeneratedReadingItem {
  meterNumber: string;
  address: string;
  feederName: string;
  businessName: string;
  serviceName: string;
  dssName: string;
  regionName: string;
}

export interface MeterReadingsApiResponse {
  responsecode: "000" | string;
  responsedesc: string;
  responsedata: {
    size: number;
    totalPages: number;
    reading: MeterReadingItem[];
    page: number;
    totalCount: number;
  };
}

export interface GetMeterReadingsParams {
  searchTerm: string;
  sortBy: keyof MeterReadingItem | null;
  sortDirection: "asc" | "desc" | null;
  meterClass: string;
  selectedMonth?: string;
  selectedYear?: string;
}

// --- Monthly Consumption Types ---

export interface MonthlyConsumptionItem {
  id: string;
  meterNumber: string;
  orgId: string;
  readingType: string;
  currentReading: number;
  currentReadingDate: string;
  createdAt: string;
  updatedAt: string;
  tariffType: string;
  feederName: string;
  dssName: string;
  meterClass: string;
  type: string;
  cumulativeReading: number;
  averageConsumption: number;
  consumption: number;
}

export interface MonthlyConsumptionApiResponse {
  responsecode: "000" | string;
  responsedesc: string;
  responsedata: {
    totalMeterConsumptions: number;
    consumptions: MonthlyConsumptionItem[];
    totalPages: number;
    pageSize: number;
    currentPage: number;
  };
}

export interface GetMonthlyConsumptionParams {
  search?: string;
  month?: string;
  year?: string;
  virtual?: boolean;
  page?: number;
  size?: number;
}

// --- Energy Import List Types ---

export interface EnergyImportListItem {
  id?: number;
  feederName: string;
  assetId: string;
  feederConsumption: string | number;
  prepaidConsumption: string | number;
  postpaidConsumption: string | number;
  mdVirtual: string | number;
  nonMdVirtual: string | number;
  month?: string;
  year?: string;
  technicalLoss?: string | number;
  commercialLoss?: string | number;
  nodeId?: string;
}

export interface EnergyImportListApiResponse {
  responsecode: "000" | string;
  responsedesc: string;
  responsedata: {
    totalFeeders: number;
    feeders: EnergyImportListItem[];
    totalPages: number;
    pageSize: number;
    currentPage: number;
  };
}

export interface GetEnergyImportListParams {
  search?: string;
  month?: string;
  year?: string;
  page?: number;
  size?: number;
}

// --- API Service Functions ---

export async function getMeterReadings({
  searchTerm,
  sortBy,
  sortDirection,
  meterClass,
  selectedMonth,
  selectedYear,
}: GetMeterReadingsParams): Promise<MeterReadingsApiResponse> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const params = new URLSearchParams();
    params.append("meterClass", meterClass);
    if (searchTerm) {
      params.append("search", searchTerm);
    }
    if (sortBy) {
      params.append("sortBy", sortBy);
      params.append("sortDirection", sortDirection ?? "asc");
    }
    if (selectedMonth && selectedMonth !== "Select Month") {
      params.append("month", selectedMonth.toUpperCase());
    }
    if (selectedYear && selectedYear !== "Select Year") {
      params.append("year", selectedYear);
    }

    const response = await axiosInstance.get(
      `${API_URL}/billing/service/meter/reading/all`,
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
        response.data.responsedesc ?? "Failed to fetch meter readings.",
      );
    }

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

// --- Export Tariff API Function ---

// --- Generate Reading API Function ---

export async function generateReading(
  params: GenerateReadingParams,
): Promise<GenerateReadingResponse> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    // Convert params to URLSearchParams for GET request
    const searchParams = new URLSearchParams();
    searchParams.append("assetId", params.assetId);
    searchParams.append("type", params.type);
    searchParams.append("meterClass", params.meterClass);

    const response = await axiosInstance.get(
      `${API_URL}/billing/service/meter/reading/generate?${searchParams.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data.responsecode !== "000") {
      throw new Error(
        response.data.responsedesc ?? "Failed to generate reading.",
      );
    }

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

// --- Create Meter Reading API Function (NON-VIRTUAL) ---

export async function createMeterReading(
  payload: CreateMeterReadingPayload,
): Promise<CreateMeterReadingResponse> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const response = await axiosInstance.post(
      `${API_URL}/billing/service/meter/reading/create`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data.responsecode !== "000") {
      throw new Error(
        response.data.responsedesc ?? "Failed to create meter reading.",
      );
    }

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

// --- Create Virtual Meter Reading API Function ---

export async function createVirtualMeterReading(
  payload: CreateVirtualMeterReadingPayload,
): Promise<CreateMeterReadingResponse> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const response = await axiosInstance.post(
      `${API_URL}/billing/service/meter/reading/create`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data.responsecode !== "000") {
      throw new Error(
        response.data.responsedesc ?? "Failed to create virtual meter reading.",
      );
    }

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

// --- MD Energy Import Types ---

export interface MDEnergyImportConsumption {
  meterId: string;
  meterNumber: string;
  orgId: string;
  readingType: string;
  currentReading: number;
  createdAt: string;
  updatedAt: string;
  tariffType: string;
  feederName: string;
  dssName: string;
  meterClass: string;
  type: string;
  cumulativeReading: number;
  averageConsumption: number;
  consumption: number;
}

export interface MDEnergyImportApiResponse {
  responsecode: "000" | string;
  responsedesc: string;
  responsedata: {
    totalMeterConsumptions: number;
    consumptions: MDEnergyImportConsumption[];
    totalPages: number;
    pageSize: number;
    currentPage: number;
  };
}

export interface GetMDEnergyImportParams {
  search?: string;
  month?: string;
  year?: string;
  nodeId: string;
  page?: number;
  size?: number;
}

// --- Get MD Energy Import API Function ---

export async function getMDEnergyImport({
  search,
  month,
  year,
  nodeId,
  page = 0,
  size = 10,
}: GetMDEnergyImportParams): Promise<MDEnergyImportApiResponse> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", size.toString());
    params.append("nodeId", nodeId);

    if (search) {
      params.append("search", search);
    }
    if (month) {
      params.append("month", month);
    }
    if (year) {
      params.append("year", year);
    }

    const response = await axiosInstance.get(
      `${API_URL}/billing/service/virtual/md-meter/energy/import/assetId/all`,
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
        response.data.responsedesc ?? "Failed to fetch MD energy import data.",
      );
    }

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

// --- Get Monthly Consumption API Function ---

export async function getMonthlyConsumption({
  search,
  month,
  year,
  virtual = false,
  page = 0,
  size = 10,
}: GetMonthlyConsumptionParams): Promise<MonthlyConsumptionApiResponse> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", size.toString());
    params.append("virtual", virtual.toString());

    if (search) {
      params.append("search", search);
    }
    if (month) {
      params.append("month", month);
    }
    if (year) {
      params.append("year", year);
    }

    const response = await axiosInstance.get(
      `${API_URL}/billing/service/meter/consumption/all`,
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
        response.data.responsedesc ?? "Failed to fetch monthly consumption.",
      );
    }

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

// --- Get Energy Import List API Function ---

export async function getEnergyImportList({
  search,
  month,
  year,
  page = 0,
  size = 10,
}: GetEnergyImportListParams): Promise<EnergyImportListApiResponse> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", size.toString());

    if (search) {
      params.append("search", search);
    }
    if (month) {
      params.append("month", month);
    }
    if (year) {
      params.append("year", year);
    }

    const response = await axiosInstance.get(
      `${API_URL}/billing/service/virtual/md-meter/energy/import/list`,
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
        response.data.responsedesc ?? "Failed to fetch energy import list.",
      );
    }

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}
