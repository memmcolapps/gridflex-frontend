// hooks/use-billing.ts

import { useMutation, useQuery } from "@tanstack/react-query";
import {
    getMeterReadings,
    createMeterReading,
    createVirtualMeterReading,
    generateReading,
    getMonthlyConsumption,
    type MeterReadingsApiResponse,
    type MeterReadingItem,
    type CreateMeterReadingPayload,
    type CreateVirtualMeterReadingPayload,
    type CreateMeterReadingResponse,
    type GenerateReadingParams,
    type GenerateReadingResponse,
    type MonthlyConsumptionApiResponse,
    type MonthlyConsumptionItem,
} from "../service/billing-service";

export interface UseMeterReadingsParams {
    searchTerm: string;
    sortBy?: keyof MeterReadingItem | null;
    sortDirection?: "asc" | "desc" | null;
    meterClass: string;
    selectedMonth?: string;
    selectedYear?: string;
}

export const useMeterReadings = ({
    searchTerm,
    sortBy,
    sortDirection,
    meterClass,
    selectedMonth,
    selectedYear,
}: UseMeterReadingsParams) => {
    return useQuery<
        MeterReadingsApiResponse,
        Error,
        { meterReadings: MeterReadingItem[]; totalData: number }
    >({
        queryKey: ["meterReadings", searchTerm, sortBy, sortDirection, meterClass, selectedMonth, selectedYear],
        queryFn: () => getMeterReadings({
            searchTerm,
            sortBy: sortBy ?? null,
            sortDirection: sortDirection ?? null,
            meterClass,
            selectedMonth,
            selectedYear,
        }),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        select: (data) => ({
            meterReadings: data.responsedata?.reading || [],
            totalData: data.responsedata?.totalCount || 0,
        }),
    });
};

export const useCreateMeterReading = () => {
    return useMutation<CreateMeterReadingResponse, Error, CreateMeterReadingPayload>({
        mutationFn: createMeterReading,
    });
};

export const useCreateVirtualMeterReading = () => {
    return useMutation<CreateMeterReadingResponse, Error, CreateVirtualMeterReadingPayload>({
        mutationFn: createVirtualMeterReading,
    });
};

export const useGenerateReading = () => {
    return useMutation<GenerateReadingResponse, Error, GenerateReadingParams>({
        mutationFn: generateReading,
    });
};

// --- Monthly Consumption Hook ---

export interface UseMonthlyConsumptionParams {
    search?: string;
    month?: string;
    year?: string;
    virtual?: boolean;
    page?: number;
    size?: number;
}

export const useMonthlyConsumption = ({
    search,
    month,
    year,
    virtual = false,
    page = 0,
    size = 10,
}: UseMonthlyConsumptionParams) => {
    return useQuery<
        MonthlyConsumptionApiResponse,
        Error,
        { consumptions: MonthlyConsumptionItem[]; totalCount: number; totalPages: number; currentPage: number }
    >({
        queryKey: ["monthlyConsumption", search, month, year, virtual, page, size],
        queryFn: () => getMonthlyConsumption({
            search,
            month,
            year,
            virtual,
            page,
            size,
        }),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        select: (data) => ({
            consumptions: data.responsedata?.consumptions || [],
            totalCount: data.responsedata?.totalMeterConsumptions || 0,
            totalPages: data.responsedata?.totalPages || 0,
            currentPage: data.responsedata?.currentPage || 0,
        }),
    });
};
