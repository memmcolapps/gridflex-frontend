// src/hooks/use-debt-settings.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    fetchAllLiabilityCauses,
    createLiabilityCause,
    updateLiabilityCause,
    fetchAllPercentageRanges,
    createPercentageRange,
    updatePercentageRange,
    changeLiabilityCauseStatus,
    changePercentageRangeStatus,
} from "@/service/debit-settings-service";
import {
    type LiabilityCause,
    type LiabilityCausePayload,
    type UpdatedLiabilityCausePayload,
    type PercentageRange,
    type PercentageRangePayload,
    type UpdatedPercentageRangePayload,
} from "@/types/credit-debit";

// --- Liability Cause Hooks ---

export const useAllLiabilityCauses = () => {
    return useQuery<LiabilityCause[]>({
        queryKey: ["liability-causes"],
        queryFn: fetchAllLiabilityCauses,
    });
};

export const useCreateLiabilityCause = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: LiabilityCausePayload) => createLiabilityCause(payload),
        onSuccess: (response) => {
            toast.success(response.responsedesc ?? "Liability cause created successfully!");
            queryClient.invalidateQueries({ queryKey: ["liability-causes"] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};

export const useUpdateLiabilityCause = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: UpdatedLiabilityCausePayload) => updateLiabilityCause(payload),
        onSuccess: (response) => {
            toast.success(response.responsedesc ?? "Liability cause updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["liability-causes"] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};

export const useChangeLiabilityCauseStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: string, status: boolean }) => changeLiabilityCauseStatus(id, status),
        onSuccess: (response) => {
            toast.success(response.responsedesc ?? "Liability cause status updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["liability-causes"] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};

// --- Percentage Range Hooks ---

export const useAllPercentageRanges = () => {
    return useQuery<PercentageRange[]>({
        queryKey: ["percentage-ranges"],
        queryFn: fetchAllPercentageRanges,
    });
};

export const useCreatePercentageRange = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: PercentageRangePayload) => createPercentageRange(payload),
        onSuccess: (response) => {
            toast.success(response.responsedesc ?? "Percentage range created successfully!");
            queryClient.invalidateQueries({ queryKey: ["percentage-ranges"] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};

export const useUpdatePercentageRange = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: UpdatedPercentageRangePayload) => updatePercentageRange(payload),
        onSuccess: (response) => {
            toast.success(response.responsedesc ?? "Percentage range updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["percentage-ranges"] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};

export const useChangePercentageRangeStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: string, status: boolean }) => changePercentageRangeStatus(id, status),
        onSuccess: (response) => {
            toast.success(response.responsedesc ?? "Percentage range status updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["percentage-ranges"] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};


