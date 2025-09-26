
// src/service/debt-settings-service.ts

import axios from 'axios';
import {
    type ApiResponse,
    type LiabilityCause,
    type LiabilityCausePayload,
    type UpdatedLiabilityCausePayload,
    type PercentageRange,
    type PercentageRangePayload,
    type UpdatedPercentageRangePayload,
} from '@/types/credit-debit';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const getAuthHeader = () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
        throw new Error("Authentication token not found.");
    }
    return `Bearer ${token}`;
};

// --- Liability Cause API Calls ---

export const fetchAllLiabilityCauses = async (): Promise<LiabilityCause[]> => {
    try {
        axiosInstance.defaults.headers.common.Authorization = getAuthHeader();
        const response = await axiosInstance.get<ApiResponse<LiabilityCause[]>>('/debt-setting/service/liability-cause/all');
        if (response.data?.responsecode !== "000") {
            throw new Error(response.data?.responsedesc || "Failed to fetch liability causes.");
        }
        return response.data.responsedata;
    } catch (error) {
        console.error('Error fetching liability causes:', error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data?.responsedesc ?? "Failed to fetch liability causes.");
        }
        throw error;
    }
};

export const createLiabilityCause = async (payload: LiabilityCausePayload): Promise<ApiResponse<LiabilityCause>> => {
    try {
        axiosInstance.defaults.headers.common.Authorization = getAuthHeader();
        const response = await axiosInstance.post<ApiResponse<LiabilityCause>>('/debt-setting/service/liability-cause/create', payload);
        if (response.data?.responsecode !== "000") {
            throw new Error(response.data?.responsedesc || "Failed to create liability cause.");
        }
        return response.data;
    } catch (error) {
        console.error('Error creating liability cause:', error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data?.responsedesc ?? "Failed to create liability cause.");
        }
        throw error;
    }
};

export const updateLiabilityCause = async (payload: UpdatedLiabilityCausePayload): Promise<ApiResponse<LiabilityCause>> => {
    try {
        axiosInstance.defaults.headers.common.Authorization = getAuthHeader();
        const response = await axiosInstance.put<ApiResponse<LiabilityCause>>('/debt-setting/service/liability-cause/update', payload);
        if (response.data?.responsecode !== "000") {
            throw new Error(response.data?.responsedesc || "Failed to update liability cause.");
        }
        return response.data;
    } catch (error) {
        console.error('Error updating liability cause:', error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data?.responsedesc ?? "Failed to update liability cause.");
        }
        throw error;
    }
};

export const changeLiabilityCauseStatus = async (id: string, status: boolean): Promise<ApiResponse<LiabilityCause>> => {
    try {
        axiosInstance.defaults.headers.common.Authorization = getAuthHeader();
        const response = await axiosInstance.put<ApiResponse<LiabilityCause>>(`/debt-setting/service/liability-cause/update/status`, { id, deactivated: !status });
        if (response.data?.responsecode !== "000") {
            throw new Error(response.data?.responsedesc || `Failed to ${status ? 'activate' : 'deactivate'} liability cause.`);
        }
        return response.data;
    } catch (error) {
        console.error(`Error ${status ? 'activating' : 'deactivating'} liability cause:`, error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data?.responsedesc ?? `Failed to ${status ? 'activate' : 'deactivate'} liability cause.`);
        }
        throw error;
    }
};

// --- Percentage Range API Calls ---

export const fetchAllPercentageRanges = async (): Promise<PercentageRange[]> => {
    try {
        axiosInstance.defaults.headers.common.Authorization = getAuthHeader();
        const response = await axiosInstance.get<ApiResponse<PercentageRange[]>>('/debt-setting/service/percentage-range/all');
        if (response.data?.responsecode !== "000") {
            throw new Error(response.data?.responsedesc || "Failed to fetch percentage ranges.");
        }
        return response.data.responsedata;
    } catch (error) {
        console.error('Error fetching percentage ranges:', error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data?.responsedesc ?? "Failed to fetch percentage ranges.");
        }
        throw error;
    }
};

export const createPercentageRange = async (payload: PercentageRangePayload): Promise<ApiResponse<PercentageRange>> => {
    try {
        axiosInstance.defaults.headers.common.Authorization = getAuthHeader();
        const response = await axiosInstance.post<ApiResponse<PercentageRange>>('/debt-setting/service/percentage-range/create', payload);
        if (response.data?.responsecode !== "000") {
            throw new Error(response.data?.responsedesc || "Failed to create percentage range.");
        }
        return response.data;
    } catch (error) {
        console.error('Error creating percentage range:', error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data?.responsedesc ?? "Failed to create percentage range.");
        }
        throw error;
    }
};

export const updatePercentageRange = async (payload: UpdatedPercentageRangePayload): Promise<ApiResponse<PercentageRange>> => {
    try {
        axiosInstance.defaults.headers.common.Authorization = getAuthHeader();
        const response = await axiosInstance.put<ApiResponse<PercentageRange>>('/debt-setting/service/percentage-range/update', payload);
        if (response.data?.responsecode !== "000") {
            throw new Error(response.data?.responsedesc || "Failed to update percentage range.");
        }
        return response.data;
    } catch (error) {
        console.error('Error updating percentage range:', error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data?.responsedesc ?? "Failed to update percentage range.");
        }
        throw error;
    }
};

export const changePercentageRangeStatus = async (id: string, status: boolean): Promise<ApiResponse<PercentageRange>> => {
    try {
        axiosInstance.defaults.headers.common.Authorization = getAuthHeader();
        const response = await axiosInstance.put<ApiResponse<PercentageRange>>(`/debt-setting/service/percentage-range/update/status`, { id, deactivated: !status });
        if (response.data?.responsecode !== "000") {
            throw new Error(response.data?.responsedesc || `Failed to ${status ? 'activate' : 'deactivate'} percentage range.`);
        }
        return response.data;
    } catch (error) {
        console.error(`Error ${status ? 'activating' : 'deactivating'} percentage range:`, error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data?.responsedesc ?? `Failed to ${status ? 'activate' : 'deactivate'} percentage range.`);
        }
        throw error;
    }
};


