/* eslint-disable @typescript-eslint/no-explicit-any */
// src/service/adjustment-service.ts

import { type Adjustment, type ApiResponse, type AdjustmentPayload, type AdjustmentMutationResponse, type Meter, type LiabilityCause } from '@/types/credit-debit';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Centralized Axios instance for all API calls
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Function to retrieve and set the authorization header
const getAuthHeader = () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
        throw new Error("Authentication token not found.");
    }
    return `Bearer ${token}`;
};

// Function to fetch all adjustments by type (credit or debit)
export const fetchAllAdjustments = async (type: 'credit' | 'debit'): Promise<Adjustment[]> => {
    try {
        axiosInstance.defaults.headers.common.Authorization = getAuthHeader();
        const response = await axiosInstance.get<ApiResponse<any>>('/debit-credit-adjustment/service/all', { params: { type } });

        // Correctly access the nested data array
        const adjustments = response.data?.responsedata?.data;

        if (Array.isArray(adjustments)) {
            return adjustments;
        }

        return [];
    } catch (error) {
        console.error('Error fetching adjustments:', error);
        throw error;
    }
};

// Function to search for a meter by its number or account number
export const searchMeterByNumber = async (searchTerm: string, searchType: 'meterNumber' | 'accountNumber'): Promise<Meter> => {
    try {
        axiosInstance.defaults.headers.common.Authorization = getAuthHeader();

        const params = { [searchType]: searchTerm };

        const response = await axiosInstance.get<ApiResponse<Meter>>('/meter/service/single', {
            params,
        });

        if (response.data?.responsecode !== "000" || !response.data?.responsedata) {
            throw new Error(response.data?.responsedesc || "Failed to fetch meter details.");
        }

        return response.data.responsedata;
    } catch (error) {
        console.error('Error fetching single meter:', error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data?.responsedesc ?? "Failed to fetch meter details.");
        }
        throw error;
    }
};

// Function to fetch all liability causes
export const fetchAllLiabilityCauses = async (): Promise<LiabilityCause[]> => {
    try {
        axiosInstance.defaults.headers.common.Authorization = getAuthHeader();
        const response = await axiosInstance.get<ApiResponse<LiabilityCause[]>>('/debt-setting/service/liability-cause/all');

        if (response.data?.responsecode !== "000" || !response.data?.responsedata) {
            throw new Error(response.data?.responsedesc || "Failed to fetch liability causes.");
        }

        return response.data.responsedata;
    } catch (error) {
        console.error('Error fetching liability causes:', error);
        throw error;
    }
};

// Function to create a debit or credit adjustment
export const createAdjustment = async (payload: AdjustmentPayload): Promise<AdjustmentMutationResponse> => {
    try {
        axiosInstance.defaults.headers.common.Authorization = getAuthHeader();
        const response = await axiosInstance.post<AdjustmentMutationResponse>('/debit-credit-adjustment/service/create', payload);

        if (response.data?.responsecode !== "000") {
            throw new Error(response.data?.responsedesc || "Failed to create adjustment.");
        }
        return response.data;
    } catch (error) {
        console.error('Error creating adjustment:', error);
        throw error;
    }
};

// Function to reconcile a debit
export const reconcileDebit = async (debitCreditAdjustmentId: string, amount: number) => {
    try {
        axiosInstance.defaults.headers.common.Authorization = getAuthHeader();
        // Corrected to use POST request with URL parameters
        const response = await axiosInstance.post('/debit-credit-adjustment/service/reconcile-dept', null, {
            params: {
                debitCreditAdjustmentId,
                amount,
            },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const errorMessage = error.response.data?.responsedesc ?? error.message;
            throw new Error(errorMessage);
        }
        throw new Error('An unknown error occurred.');
    }
};