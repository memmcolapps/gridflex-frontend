// src/hooks/use-adjustment.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchAllAdjustments,
    searchMeterByNumber,
    createAdjustment,
    reconcileDebit,
    fetchAllLiabilityCauses,
} from "@/service/adjustment-service";
import { type Adjustment, type AdjustmentPayload } from "@/types/credit-debit";
import { toast } from "sonner";

export const useAllAdjustments = (type: "credit" | "debit") => {
    return useQuery<Adjustment[]>({
        queryKey: ["adjustments", type],
        queryFn: () => fetchAllAdjustments(type),
    });
};

export const useSearchMeter = () => {
    return useMutation({
        mutationFn: ({
            searchTerm,
            searchType,
        }: {
            searchTerm: string;
            searchType: "meterNumber" | "accountNumber";
        }) => searchMeterByNumber(searchTerm, searchType),
        onSuccess: () => {
            toast.success("Meter Fetched Successfully!");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};

export const useCreateAdjustment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: AdjustmentPayload) => createAdjustment(payload),
        onSuccess: (response) => {
            toast.success(response.responsedesc || "Adjustment created successfully!");
            queryClient.invalidateQueries({ queryKey: ["adjustments"] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};

export const useReconcileDebit = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            debitCreditAdjustmentId,
            amount,
        }: {
            debitCreditAdjustmentId: string;
            amount: number;
        }) => reconcileDebit(debitCreditAdjustmentId, amount),
        onSuccess: () => {
            toast.success("Debit reconciled successfully!");
            queryClient.invalidateQueries({ queryKey: ["adjustments", "debit"] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};

export const useAllLiabilityCauses = () => {
    return useQuery({
        queryKey: ["liability-causes"],
        queryFn: fetchAllLiabilityCauses,
    });
};