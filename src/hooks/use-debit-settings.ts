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
    bulkApproveLiabilityCauses,
    bulkApprovePercentageRanges,
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
        queryKey: ["liability"],
        queryFn: async () => {
            const result = await fetchAllLiabilityCauses();
            if (result.success) {
                return result.data;
            } else {
                throw new Error(result.error);
            }
        },
    });
};

export const useCreateLiabilityCause = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: LiabilityCausePayload) => createLiabilityCause(payload),
        onSuccess: (response) => {
            if (response.success) {
                toast.success("Liability cause created successfully!");
                queryClient.invalidateQueries({ queryKey: ["liability"] });
            } else {
                toast.error(response.error);
            }
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
            if (response.success) {
                toast.success("Liability cause updated successfully!");
                queryClient.invalidateQueries({ queryKey: ["liability"] });
            } else {
                toast.error(response.error);
            }
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
            if (response.success) {
                toast.success("Liability cause status updated successfully!");
                queryClient.invalidateQueries({ queryKey: ["liability"] });
            } else {
                toast.error(response.error);
            }
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};

// --- Percentage Range Hooks ---

export const useAllPercentageRanges = () => {
    return useQuery<PercentageRange[]>({
        queryKey: ["percentageRange"],
        queryFn: async () => {
            const result = await fetchAllPercentageRanges();
            if (result.success) {
                return result.data;
            } else {
                throw new Error(result.error);
            }
        },
    });
};

export const useCreatePercentageRange = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: PercentageRangePayload) => createPercentageRange(payload),
        onSuccess: (response) => {
            if (response.success) {
                toast.success("Percentage range created successfully!");
                queryClient.invalidateQueries({ queryKey: ["percentageRange"] });
            } else {
                toast.error(response.error);
            }
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
            if (response.success) {
                toast.success("Percentage range updated successfully!");
                queryClient.invalidateQueries({ queryKey: ["percentageRange"] });
            } else {
                toast.error(response.error);
            }
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
            if (response.success) {
                toast.success("Percentage range status updated successfully!");
                queryClient.invalidateQueries({ queryKey: ["percentageRange"] });
            } else {
                toast.error(response.error);
            }
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};

export const useBulkApproveLiabilityCauses = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (liabilityCauses: { name: string }[]) => bulkApproveLiabilityCauses(liabilityCauses),
        onSuccess: (response) => {
            if (response.success) {
                toast.success(`${response.data.successCount} of ${response.data.totalRecords} liability causes approved successfully!`);
                queryClient.invalidateQueries({ queryKey: ["liability"] });
            } else {
                toast.error(response.error);
            }
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};

export const useBulkApprovePercentageRanges = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (percentageRanges: { code: string }[]) => bulkApprovePercentageRanges(percentageRanges),
        onSuccess: (response) => {
            if (response.success) {
                toast.success(`${response.data.successCount} of ${response.data.totalRecords} percentage ranges approved successfully!`);
                queryClient.invalidateQueries({ queryKey: ["percentageRange"] });
            } else {
                toast.error(response.error);
            }
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};