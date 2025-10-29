// service/billing-service.ts

import axios from "axios";
import { env } from "@/env";
import { handleApiError } from "error";

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
    createdAt: string;
    updatedAt: string;
    tariffType: string;
    name: string;
}

export interface CreateMeterReadingPayload {
    meterNumber: string;
    billMonth: string;
    billYear: string;
    currentReading: string;
    meterClass: string;
}

export interface CreateMeterReadingResponse {
    responsecode: "000" | string;
    responsedesc: string;
    responsedata?: any;
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
        messages: MeterReadingItem[];
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
            params.append("month", selectedMonth);
        }
        if (selectedYear && selectedYear !== "Select Year") {
            params.append("year", selectedYear);
        }

        const response = await axios.get(`${API_URL}/billing/service/meter/reading/all`, {
            params,
            headers: {
                "Content-Type": "application/json",
                custom: CUSTOM_HEADER,
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.responsecode !== "000") {
            throw new Error(response.data.responsedesc ?? "Failed to fetch meter readings.");
        }

        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

// --- Export Tariff API Function ---


// --- Generate Reading API Function ---

export async function generateReading(params: GenerateReadingParams): Promise<GenerateReadingResponse> {
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

        const response = await axios.get(`${API_URL}/billing/service/meter/reading/generate?${searchParams.toString()}`, {
            headers: {
                "Content-Type": "application/json",
                custom: CUSTOM_HEADER,
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.responsecode !== "000") {
            throw new Error(response.data.responsedesc ?? "Failed to generate reading.");
        }

        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

// --- Create Meter Reading API Function ---

export async function createMeterReading(payload: CreateMeterReadingPayload): Promise<CreateMeterReadingResponse> {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("Authentication token not found.");
        }

        // Convert payload to URLSearchParams for GET request
        const searchParams = new URLSearchParams();
        searchParams.append("meterNumber", payload.meterNumber);
        searchParams.append("billMonth", payload.billMonth);
        searchParams.append("billYear", payload.billYear);
        searchParams.append("currentReading", payload.currentReading);
        searchParams.append("meterClass", payload.meterClass);

        const response = await axios.get(`${API_URL}/billing/service/meter/reading/create?${searchParams.toString()}`, {
            headers: {
                "Content-Type": "application/json",
                custom: CUSTOM_HEADER,
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.responsecode !== "000") {
            throw new Error(response.data.responsedesc ?? "Failed to create meter reading.");
        }

        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}