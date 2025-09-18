// hooks/useReviewApproval.ts
import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import {
  FetchParams,
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

import {
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

// Define a generic type for the review mutation payload
interface ReviewPayload {
  id: string;
  approveStatus: "approve" | "reject";
  reason?: string;
}

// Hook for Percentage Ranges
interface UsePercentageRangesResult {
  percentageRanges: PercentageRange[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  reviewMutation: UseMutationResult<any, Error, ReviewPayload>;
}

export const usePercentageRanges = (params: FetchParams): UsePercentageRangesResult => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<GetPercentageResponse, Error>({
    queryKey: ["percentageRanges", params],
    queryFn: () => getAllPercentageRanges(params),
  });

  const reviewMutation = useMutation({
    mutationFn: (payload: ReviewPayload) => reviewPercentageRange(payload.id, payload.approveStatus, payload.reason),
    onSuccess: (data, variables) => {
      if (variables.approveStatus === 'approve') {
        queryClient.setQueryData(["percentageRanges", params], (oldData: GetPercentageResponse | undefined) => {
          if (oldData) {
            return {
              ...oldData,
              responsedata: oldData.responsedata.filter(item => item.id !== variables.id)
            };
          }
          return oldData;
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["percentageRanges"] });
      }
    },
  });

  return {
    percentageRanges: data?.responsedata || [],
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
  reviewMutation: UseMutationResult<any, Error, ReviewPayload>;
}

export const useLiabilities = (params: FetchParams): UseLiabilitiesResult => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<GetAllLiabilitiesResponse, Error>({
    queryKey: ["liabilities", params],
    queryFn: () => getAllLiabilities(params),
  });

  const reviewMutation = useMutation({
    mutationFn: (payload: ReviewPayload) => reviewLiability(payload.id, payload.approveStatus, payload.reason),
    onSuccess: (data, variables) => {
      if (variables.approveStatus === 'approve') {
        queryClient.setQueryData(["liabilities", params], (oldData: GetAllLiabilitiesResponse | undefined) => {
          if (oldData) {
            return {
              ...oldData,
              responsedata: oldData.responsedata.filter(item => item.id !== variables.id)
            };
          }
          return oldData;
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["liabilities"] });
      }
    },
  });

  return {
    liabilities: data?.responsedata || [],
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
  reviewMutation: UseMutationResult<any, Error, ReviewPayload>;
}

export const useBands = (params: FetchParams): UseBandsResult => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<GetBandResponse, Error>({
    queryKey: ["bands", params],
    queryFn: () => getAllBands(params),
  });

  const reviewMutation = useMutation({
    mutationFn: (payload: ReviewPayload) => reviewBand(payload.id, payload.approveStatus, payload.reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bands"] });
    },
  });

  return {
    bands: data?.responsedata || [],
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
  reviewMutation: UseMutationResult<any, Error, ReviewPayload>;
}

export const useTariffs = (params: FetchParams): UseTariffsResult => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<GetTariffResponse, Error>({
    queryKey: ["tariffs", params],
    queryFn: () => getAllTariffs(params),
  });

  const reviewMutation = useMutation({
    mutationFn: (payload: ReviewPayload) => reviewTariff(payload.id, payload.approveStatus, payload.reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tariffs"] });
    },
  });

  return {
    tariffs: data?.responsedata || [],
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
  reviewMutation: UseMutationResult<any, Error, ReviewPayload>;
}

export const useMeters = (params: FetchParams): UseMetersResult => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<MeterResponse, Error>({
    queryKey: ["meters", params],
    queryFn: () => getAllMeters(params),
  });

  const reviewMutation = useMutation({
    mutationFn: (payload: ReviewPayload) => reviewMeter(payload.id, payload.approveStatus, payload.reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meters"] });
    },
  });

  return {
    meters: data?.responsedata?.data || [], // Note: MeterResponse has a nested 'data' property
    isLoading,
    isError,
    error,
    reviewMutation,
  };
};

// You can also add hooks for single item fetching here if needed
export const useSinglePercentageRange = (id: string): UseQueryResult<GetPercentageResponse, Error> => {
    return useQuery<GetPercentageResponse, Error>({
      queryKey: ["percentageRange", id],
      queryFn: () => getPercentageRange(id),
      enabled: !!id,
    });
};

export const useSingleLiability = (id: string): UseQueryResult<GetAllLiabilitiesResponse, Error> => {
    return useQuery<GetAllLiabilitiesResponse, Error>({
      queryKey: ["liability", id],
      queryFn: () => getLiability(id),
      enabled: !!id,
    });
};

export const useSingleBand = (id: string): UseQueryResult<GetBandResponse, Error> => {
    return useQuery<GetBandResponse, Error>({
      queryKey: ["band", id],
      queryFn: () => getBand(id),
      enabled: !!id,
    });
};

export const useSingleTariff = (id: string): UseQueryResult<GetTariffResponse, Error> => {
    return useQuery<GetTariffResponse, Error>({
      queryKey: ["tariff", id],
      queryFn: () => getTariff(id),
      enabled: !!id,
    });
};

export const useSingleMeter = (id: string): UseQueryResult<MeterResponse, Error> => {
    return useQuery<MeterResponse, Error>({
      queryKey: ["meter", id],
      queryFn: () => getMeter(id),
      enabled: !!id,
    });
};


