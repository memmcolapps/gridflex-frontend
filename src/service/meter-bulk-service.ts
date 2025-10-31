// service/meter-bulk-service.ts

import axios from "axios";
import { env } from "@/env";
import { handleApiError } from "error";

const API_URL = env.NEXT_PUBLIC_BASE_URL;
const CUSTOM_HEADER = env.NEXT_PUBLIC_CUSTOM_HEADER;

// --- API Service Functions ---

export async function downloadMeterCsvTemplate(): Promise<Blob> {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("Authentication token not found.");
        }

        const response = await axios.get(`${API_URL}/meter/service/download/template/csv`, {
            responseType: 'blob',
            headers: {
                "Content-Type": "application/json",
                custom: CUSTOM_HEADER,
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export async function downloadMeterExcelTemplate(): Promise<Blob> {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("Authentication token not found.");
        }

        const response = await axios.get(`${API_URL}/meter/service/download/template/excel`, {
            responseType: 'blob',
            headers: {
                "Content-Type": "application/json",
                custom: CUSTOM_HEADER,
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export async function downloadAllocateCsvTemplate(): Promise<Blob> {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("Authentication token not found.");
        }

        const response = await axios.get(`${API_URL}/meter/service/download/allocate/template/csv`, {
            responseType: 'blob',
            headers: {
                "Content-Type": "application/json",
                custom: CUSTOM_HEADER,
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export async function downloadAllocateExcelTemplate(): Promise<Blob> {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("Authentication token not found.");
        }

        const response = await axios.get(`${API_URL}/meter/service/download/allocate/template/excel`, {
            responseType: 'blob',
            headers: {
                "Content-Type": "application/json",
                custom: CUSTOM_HEADER,
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export async function bulkUploadMeters(file: File): Promise<{ responsecode: string; responsedesc: string }> {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("Authentication token not found.");
        }

        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`${API_URL}/meter/service/bulk-upload`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                custom: CUSTOM_HEADER,
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.responsecode !== "000") {
            throw new Error(response.data.responsedesc ?? "Failed to bulk upload meters.");
        }

        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export async function bulkAllocateMeters(file: File): Promise<{ responsecode: string; responsedesc: string; responsedata: { totalRecords: number; failedCount: number; failedRecords: string[]; successCount: number; } }> {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("Authentication token not found.");
        }

        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.put(`${API_URL}/meter/service/bulk-allocate`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                custom: CUSTOM_HEADER,
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.responsecode !== "000") {
            throw new Error(response.data.responsedesc ?? "Failed to bulk allocate meters.");
        }

        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export async function bulkApproveMeters(meterNumbers: { meterNumber: string }[]): Promise<{ responsecode: string; responsedesc: string }> {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("Authentication token not found.");
        }

        const response = await axios.put(`${API_URL}/meter/service/bulk-approve`, meterNumbers, {
            headers: {
                "Content-Type": "application/json",
                custom: CUSTOM_HEADER,
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.responsecode !== "000") {
            throw new Error(response.data.responsedesc ?? "Failed to bulk approve meters.");
        }

        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}