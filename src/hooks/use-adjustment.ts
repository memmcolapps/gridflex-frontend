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

export const useAllAdjustments = (type: "credit" | "debit", searchTerm?: string) => {
  return useQuery<Adjustment[]>({
    queryKey: ["adjustments", type, searchTerm],
    queryFn: async () => {
      const result = await fetchAllAdjustments(type, searchTerm);
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error);
      }
    },
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
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Meter Fetched Successfully!");
      } else {
        toast.error(response.error);
      }
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
      if (response.success) {
        toast.success("Adjustment created successfully!");
        queryClient.invalidateQueries({ queryKey: ["adjustments"] });
      } else {
        toast.error(response.error);
      }
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
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Debit reconciled successfully!");
        queryClient.invalidateQueries({ queryKey: ["adjustments", "debit"] });
      } else {
        toast.error(response.error);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useAllLiabilityCauses = () => {
  return useQuery({
    queryKey: ["liability-causes"],
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
