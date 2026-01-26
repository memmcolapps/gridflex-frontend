// hooks/use-billing.ts

import { useMutation, useQuery } from "@tanstack/react-query";
import {
    getMeterReadings,
    createMeterReading,
    generateReading,
    type MeterReadingsApiResponse,
    type MeterReadingItem,
    type CreateMeterReadingPayload,
    type CreateMeterReadingResponse,
    type GenerateReadingParams,
    type GenerateReadingResponse,
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

export const useGenerateReading = () => {
    return useMutation<GenerateReadingResponse, Error, GenerateReadingParams>({
        mutationFn: generateReading,
    });
};
