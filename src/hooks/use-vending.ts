// use-vending.ts

import { generateCreditToken, printToken, calculateCreditToken, generateKCTToken, generateClearTamperToken, generateClearCreditToken, generateKCTAndClearTamperToken, generateCompensationToken, getVendingDashboardData, getVendingTransactions } from "@/service/vending-service";
import type { GenerateCreditTokenPayload, PrintTokenPayload, GenerateKCTPayload, GenerateClearTamperPayload, GenerateClearCreditPayload, GenerateKCTAndClearTamperPayload, GenerateCompensationPayload, VendingDashboardPayload, CalculateCreditTokenPayload } from "@/types/vending";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGenerateCreditToken = () => {
  return useMutation({
    mutationFn: async (payload: GenerateCreditTokenPayload) => {
      const response = await generateCreditToken(payload);
      if (!response.success) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success("Credit token generated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate credit token");
    },
  });
};

export const usePrintToken = () => {
  return useMutation({
    mutationFn: async (payload: PrintTokenPayload) => {
      console.log("Hook calling printToken with payload:", payload);
      const response = await printToken(payload);
      console.log("Hook received response:", response);
      if (!response.success) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success("Token printed successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to print token");
    },
  });
};

export const useCalculateCreditToken = () => {
  return useMutation({
    mutationFn: async (payload: CalculateCreditTokenPayload) => {
      const response = await calculateCreditToken(payload);
      if (!response.success) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success("Credit token calculated successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message ?? "Failed to calculate credit token");
    },
  });
};


export const useGenerateKCTToken = () => {
  return useMutation({
    mutationFn: async (payload: GenerateKCTPayload) => {
      const response = await generateKCTToken(payload);
      if (!response.success) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success("KCT token generated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate KCT token");
    },
  });
};

export const useGenerateClearTamperToken = () => {
  return useMutation({
    mutationFn: async (payload: GenerateClearTamperPayload) => {
      const response = await generateClearTamperToken(payload);
      if (!response.success) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success("Clear Tamper token generated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate Clear Tamper token");
    },
  });
};

export const useGenerateClearCreditToken = () => {
  return useMutation({
    mutationFn: async (payload: GenerateClearCreditPayload) => {
      const response = await generateClearCreditToken(payload);
      if (!response.success) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success("Clear Credit token generated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate Clear Credit token");
    },
  });
};

export const useGenerateKCTAndClearTamperToken = () => {
  return useMutation({
    mutationFn: async (payload: GenerateKCTAndClearTamperPayload) => {
      const response = await generateKCTAndClearTamperToken(payload);
      if (!response.success) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success("KCT and Clear Tamper token generated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate KCT and Clear Tamper token");
    },
  });
};

export const useGenerateCompensationToken = () => {
  return useMutation({
    mutationFn: async (payload: GenerateCompensationPayload) => {
      const response = await generateCompensationToken(payload);
      if (!response.success) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success("Compensation token generated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate Compensation token");
    },
  });
};

export const useVendingTransactions = (payload?: { page?: number; size?: number }) => {
  return useQuery({
    queryKey: ["vending-transactions", payload],
    queryFn: async () => {
      const response = await getVendingTransactions(payload);
      if (!response.success) {
        throw new Error(response.error);
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useVendingDashboard = (payload?: VendingDashboardPayload) => {
  return useQuery({
    queryKey: ["vending-dashboard", payload],
    queryFn: async () => {
      const response = await getVendingDashboardData(payload);
      if (!response.success) {
        throw new Error(response.error);
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};