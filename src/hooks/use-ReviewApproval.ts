import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { FetchParams } from "@/service/reviewapproval-service";
import {
  getAllPercentageRanges,
  getPercentageRange,
  reviewPercentageRange,
  getAllLiabilities,
  getLiability,
  reviewLiability,
  getAllBands,
  getBand,
  reviewBand,
  getAllTariffs,
  getTariff,
  reviewTariff,
  getAllMeters,
  getMeter,
  reviewMeter,
} from "@/service/reviewapproval-service";
import { bulkApproveMeters } from "@/service/meter-bulk-service";
import type {
  GetPercentageResponse,
  GetAllLiabilitiesResponse,
  GetBandResponse,
  GetTariffResponse,
  MeterResponse,
  PercentageRange,
  Liability,
  Band,
  Tariff,
  Meter,
} from "@/types/review-approval";
import type { UseQueryResult, UseMutationResult } from "@tanstack/react-query";

interface ReviewPayload {
  id: string;
  approveStatus: "approve" | "reject";
  reason?: string;
}
interface TariffResponseData {
  data?: Tariff[];
}

// Hook for Percentage Ranges
interface UsePercentageRangesResult {
  percentageRanges: PercentageRange[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  reviewMutation: UseMutationResult<
    { success: true } | { success: false; error: string },
    Error,
    ReviewPayload
  >;
}

export const usePercentageRanges = (
  params: FetchParams,
): UsePercentageRangesResult => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<
    PercentageRange[],
    Error
  >({
    queryKey: ["percentageRange", params],
    queryFn: async () => {
      const result = await getAllPercentageRanges(params);
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error);
      }
    },
  });

  const reviewMutation = useMutation<
    { success: true } | { success: false; error: string },
    Error,
    ReviewPayload
  >({
    mutationFn: (payload) =>
      reviewPercentageRange(payload.id, payload.approveStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["percentageRange"] });
    },
  });

  return {
    percentageRanges: data ?? [],
    isLoading,
    isError,
    error,
    reviewMutation,
  };
};

// Hook for Liabilities
interface UseLiabilitiesResult {
  liabilities: Liability[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  reviewMutation: UseMutationResult<
    { success: true } | { success: false; error: string },
    Error,
    ReviewPayload
  >;
}

export const useLiabilities = (params: FetchParams): UseLiabilitiesResult => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<
    Liability[],
    Error
  >({
    queryKey: ["liability", params],
    queryFn: async () => {
      const result = await getAllLiabilities(params);
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error);
      }
    },
  });

  const reviewMutation = useMutation<
    { success: true } | { success: false; error: string },
    Error,
    ReviewPayload
  >({
    mutationFn: (payload) => reviewLiability(payload.id, payload.approveStatus),
    onSuccess: (data, variables) => {
      if (variables.approveStatus === "approve") {
        queryClient.setQueryData(
          ["liabilities", params],
          (oldData: Liability[] | undefined) => {
            if (oldData) {
              return oldData.filter(
                (item) => item.liabilityCauseId !== variables.id,
              );
            }
            return oldData;
          },
        );
      } else {
        queryClient.invalidateQueries({ queryKey: ["liability"] });
      }
    },
  });

  return {
    liabilities: data ?? [],
    isLoading,
    isError,
    error,
    reviewMutation,
  };
};

// Hook for Bands
interface UseBandsResult {
  bands: Band[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  reviewMutation: UseMutationResult<
    { success: true } | { success: false; error: string },
    Error,
    ReviewPayload
  >;
}

export const useBands = (params: FetchParams): UseBandsResult => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<Band[], Error>({
    queryKey: ["bands", params],
    queryFn: async () => {
      const result = await getAllBands(params);
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error);
      }
    },
  });

  const reviewMutation = useMutation<
    { success: true } | { success: false; error: string },
    Error,
    ReviewPayload
  >({
    mutationFn: (payload) => reviewBand(payload.id, payload.approveStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bands"] });
    },
  });

  return {
    bands: data ?? [],
    isLoading,
    isError,
    error,
    reviewMutation,
  };
};

// Hook for Tariffs
interface UseTariffsResult {
  tariffs: Tariff[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  reviewMutation: UseMutationResult<
    { success: true } | { success: false; error: string },
    Error,
    ReviewPayload
  >;
}

export const useTariffs = (params: FetchParams): UseTariffsResult => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<
    Tariff[],
    Error
  >({
    queryKey: ["tariffs", params],
    queryFn: async () => {
      const result = await getAllTariffs(params);
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error);
      }
    },
  });

  const reviewMutation = useMutation<
    { success: true } | { success: false; error: string },
    Error,
    ReviewPayload
  >({
    mutationFn: (payload) => reviewTariff(payload.id, payload.approveStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tariffs"] });
    },
  });

  return {
    tariffs: data ?? [],
    isLoading,
    isError,
    error,
    reviewMutation,
  };
};

// Hook for Meters
interface UseMetersResult {
  meters: Meter[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  reviewMutation: UseMutationResult<
    { success: true } | { success: false; error: string },
    Error,
    ReviewPayload
  >;
  bulkApproveMutation: UseMutationResult<
    { responsecode: string; responsedesc: string },
    Error,
    { meterNumber: string }[]
  >;
}

export const useMeters = (params: FetchParams): UseMetersResult => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<
    { data: Meter[]; totalData: number; page: number; size: number; totalPages: number },
    Error
  >({
    queryKey: ["meters", params],
    queryFn: async () => {
      const result = await getAllMeters(params);
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error);
      }
    },
  });

  const reviewMutation = useMutation<
    { success: true } | { success: false; error: string },
    Error,
    ReviewPayload
  >({
    mutationFn: (payload) => reviewMeter(payload.id, payload.approveStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meters"] });
    },
  });

  const bulkApproveMutation = useMutation<
    { responsecode: string; responsedesc: string },
    Error,
    { meterNumber: string }[]
  >({
    mutationFn: (meterNumbers) => bulkApproveMeters(meterNumbers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meters"] });
    },
  });

  return {
    meters: data?.data ?? [],
    isLoading,
    isError,
    error,
    reviewMutation,
    bulkApproveMutation,
  };
};

// Single item fetching hooks
export const useSinglePercentageRange = (
  id: string,
): UseQueryResult<PercentageRange[], Error> => {
  return useQuery<PercentageRange[], Error>({
    queryKey: ["percentageRange", id],
    queryFn: async () => {
      const result = await getPercentageRange(id);
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error);
      }
    },
    enabled: !!id,
  });
};

export const useSingleLiability = (
  id: string,
): UseQueryResult<Liability[], Error> => {
  return useQuery<Liability[], Error>({
    queryKey: ["liability", id],
    queryFn: async () => {
      const result = await getLiability(id);
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error);
      }
    },
    enabled: !!id,
  });
};

export const useSingleBand = (
  id: string,
): UseQueryResult<Band[], Error> => {
  return useQuery<Band[], Error>({
    queryKey: ["bands", id],
    queryFn: async () => {
      const result = await getBand(id);
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error);
      }
    },
    enabled: !!id,
  });
};

export const useSingleTariff = (
  id: string,
): UseQueryResult<Tariff[], Error> => {
  return useQuery<Tariff[], Error>({
    queryKey: ["tariffs", id],
    queryFn: async () => {
      const result = await getTariff(id);
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error);
      }
    },
    enabled: !!id,
  });
};

export const useSingleMeter = (
  id: string,
): UseQueryResult<{ data: Meter[]; totalData: number; page: number; size: number; totalPages: number }, Error> => {
  return useQuery<{ data: Meter[]; totalData: number; page: number; size: number; totalPages: number }, Error>({
    queryKey: ["meters", id],
    queryFn: async () => {
      const result = await getMeter(id);
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error);
      }
    },
    enabled: !!id,
  });
};
