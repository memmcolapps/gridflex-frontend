// service/billing-service.ts

import axios from "axios";
import { env } from "@/env";
import { handleApiError } from "error";

const API_URL = env.NEXT_PUBLIC_BASE_URL;
const CUSTOM_HEADER = env.NEXT_PUBLIC_CUSTOM_HEADER;

// --- Type Definitions ---

export interface MeterReadingItem {
    id: number;
    meterNo: string;
    feederLine: string;
    tariffType: string;
    larDate: string;
    lastReading: number;
    readingType: string;
    readingDate: string;
    currentReadings: number;
}

export interface MeterReadingsApiResponse {
    responsecode: "000" | string;
    responsedesc: string;
    responsedata: {
        totalData: number;
        data: MeterReadingItem[];
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

        const response = await axios.get(`${API_URL}/billing/service/meter/reading/service/all`, {
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