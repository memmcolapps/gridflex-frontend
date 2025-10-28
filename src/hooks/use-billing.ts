// hooks/use-billing.ts

import { useQuery } from "@tanstack/react-query";
import {
    getMeterReadings,
    type MeterReadingsApiResponse,
    type MeterReadingItem,
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
            meterReadings: data.responsedata.data,
            totalData: data.responsedata.totalData,
        }),
    });
};