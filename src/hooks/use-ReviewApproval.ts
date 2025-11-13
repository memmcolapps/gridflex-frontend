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
    GetPercentageResponse,
    Error,
    ReviewPayload
  >;
}

export const usePercentageRanges = (
  params: FetchParams,
): UsePercentageRangesResult => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<
    GetPercentageResponse,
    Error
  >({
    queryKey: ["percentageRange", params],
    queryFn: () => getAllPercentageRanges(params),
  });

  const reviewMutation = useMutation<
    GetPercentageResponse,
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
    percentageRanges: data?.responsedata ?? [],
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
    GetPercentageResponse,
    Error,
    ReviewPayload
  >;
}

export const useLiabilities = (params: FetchParams): UseLiabilitiesResult => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<
    GetAllLiabilitiesResponse,
    Error
  >({
    queryKey: ["liability", params],
    queryFn: () => getAllLiabilities(params),
  });

  const reviewMutation = useMutation<
    GetPercentageResponse,
    Error,
    ReviewPayload
  >({
    mutationFn: (payload) => reviewLiability(payload.id, payload.approveStatus),
    onSuccess: (data, variables) => {
      if (variables.approveStatus === "approve") {
        queryClient.setQueryData(
          ["liabilities", params],
          (oldData: GetAllLiabilitiesResponse | undefined) => {
            if (oldData) {
              return {
                ...oldData,
                responsedata: oldData.responsedata.filter(
                  (item) => item.liabilityCauseId !== variables.id,
                ),
              };
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
    liabilities: data?.responsedata ?? [],
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
    GetPercentageResponse,
    Error,
    ReviewPayload
  >;
}

export const useBands = (params: FetchParams): UseBandsResult => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<GetBandResponse, Error>({
    queryKey: ["bands", params],
    queryFn: () => getAllBands(params),
  });

  const reviewMutation = useMutation<
    GetPercentageResponse,
    Error,
    ReviewPayload
  >({
    mutationFn: (payload) => reviewBand(payload.id, payload.approveStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bands"] });
    },
  });

  return {
    bands: data?.responsedata ?? [],
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
    GetPercentageResponse,
    Error,
    ReviewPayload
  >;
}

export const useTariffs = (params: FetchParams): UseTariffsResult => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<
    GetTariffResponse,
    Error
  >({
    queryKey: ["tariffs", params],
    queryFn: () => getAllTariffs(params),
  });

  // Ensure tariffs is always an array, handling different response structures
  let tariffs: Tariff[] = [];
  if (data?.responsedata) {
    if (Array.isArray(data.responsedata)) {
      tariffs = data.responsedata;
    } else if (
      typeof data.responsedata === "object" &&
      Array.isArray((data.responsedata as TariffResponseData).data)
    ) {
      tariffs = (data.responsedata as TariffResponseData).data ?? [];
    }
  }

  const reviewMutation = useMutation<
    GetPercentageResponse,
    Error,
    ReviewPayload
  >({
    mutationFn: (payload) => reviewTariff(payload.id, payload.approveStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tariffs"] });
    },
  });

  return {
    tariffs,
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
    GetPercentageResponse,
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

  const { data, isLoading, isError, error } = useQuery<MeterResponse, Error>({
    queryKey: ["meters", params],
    queryFn: () => getAllMeters(params),
  });

  const reviewMutation = useMutation<
    GetPercentageResponse,
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
    meters: data?.responsedata?.data ?? [],
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
): UseQueryResult<GetPercentageResponse, Error> => {
  return useQuery<GetPercentageResponse, Error>({
    queryKey: ["percentageRange", id],
    queryFn: () => getPercentageRange(id),
    enabled: !!id,
  });
};

export const useSingleLiability = (
  id: string,
): UseQueryResult<GetAllLiabilitiesResponse, Error> => {
  return useQuery<GetAllLiabilitiesResponse, Error>({
    queryKey: ["liability", id],
    queryFn: () => getLiability(id),
    enabled: !!id,
  });
};

export const useSingleBand = (
  id: string,
): UseQueryResult<GetBandResponse, Error> => {
  return useQuery<GetBandResponse, Error>({
    queryKey: ["bands", id],
    queryFn: () => getBand(id),
    enabled: !!id,
  });
};

export const useSingleTariff = (
  id: string,
): UseQueryResult<GetTariffResponse, Error> => {
  return useQuery<GetTariffResponse, Error>({
    queryKey: ["tariffs", id],
    queryFn: () => getTariff(id),
    enabled: !!id,
  });
};

export const useSingleMeter = (
  id: string,
): UseQueryResult<MeterResponse, Error> => {
  return useQuery<MeterResponse, Error>({
    queryKey: ["meters", id],
    queryFn: () => getMeter(id),
    enabled: !!id,
  });
};
