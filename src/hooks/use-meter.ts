// use-meter.ts

import { queryClient } from "@/lib/queryClient";
import {
  createManufacturer,
  fetchManufacturers,
  updateManufacturer,
  fetchMeterInventory,
  createMeter,
  updateMeter,
  fetchBusinessHubs,
  // -------------------------------------------------------------
  // NEW: Import allocateMeter and its payload type
  allocateMeter,
  type AllocateMeterPayload,
  // -------------------------------------------------------------
} from "@/service/meter-service";
import {
  type MeterInventoryFilters,
  type CreateMeterPayload,
  type UpdateMeterPayload,
  type MeterInventoryResponse,
  type BusinessHub,
} from "@/types/meter-inventory";
import { type Manufacturer } from "@/types/meters-manufacturers";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetMeterManufactures = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["meters"],
    queryFn: () => fetchManufacturers(),
  });

  return {
    data: data?.success ? data.data : ([] as Manufacturer[]),
    error,
    isLoading,
  };
};

export const useCreateManufacturer = () => {
  return useMutation({
    mutationFn: async (
      manufacturer: Omit<
        Manufacturer,
        "id" | "orgId" | "createdAt" | "updatedAt"
      >,
    ) => {
      const response = await createManufacturer(manufacturer);
      if ("success" in response && !response.success) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["meters"],
      });
    },
  });
};

export const useUpdateManufacturer = () => {
  return useMutation({
    mutationFn: async (
      manufacturer: Omit<Manufacturer, "orgId" | "createdAt" | "updatedAt">,
    ) => {
      const response = await updateManufacturer(manufacturer);
      if ("success" in response && !response.success) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["meters"],
      });
    },
  });
};

// Meter inventory hooks
export const useMeterInventory = (filters?: MeterInventoryFilters) => {
  const { data, error, isLoading, refetch, isError } = useQuery({
    queryKey: ["meter-inventory", filters],
    queryFn: () => fetchMeterInventory(filters),
    placeholderData: (previousData) => previousData,
  });

  return {
    data: data?.success ? data.data : ({} as MeterInventoryResponse),
    meters: data?.success ? data.data.data : [],
    totalData: data?.success ? data.data.totalData : 0,
    totalPages: data?.success ? data.data.totalPages : 0,
    currentPage: data?.success ? data.data.page : 0,
    currentSize: data?.success ? data.data.size : 0,
    error,
    isError,
    isLoading,
    refetch,
  };
};

/**
 * Hook to fetch business hubs filtered by orgId using TanStack Query.
 */
export const useBusinessHubs = (orgId: string) => {
  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: ["business-hubs", orgId],
    queryFn: () => fetchBusinessHubs(orgId),
    enabled: !!orgId, // Only run the query if orgId is truthy
  });

  return {
    data: data?.success ? data.data : ([] as BusinessHub[]),
    error,
    isError,
    isLoading,
    refetch,
  };
};

export const useAllocateMeter = () => {
  return useMutation({
    mutationFn: async ({ meterNumber, regionId }: AllocateMeterPayload) => {
      const response = await allocateMeter(meterNumber, regionId);

      if (!response.success) {
        throw new Error(response.error);
      }

      return response;
    },

    onSuccess: () => {
      // Refetch the meter inventory list after successful allocation
      queryClient.invalidateQueries({
        queryKey: ["meter-inventory"],
      });
    },
  });
};


export const useCreateMeter = () => {
  return useMutation({
    mutationFn: async (meter: CreateMeterPayload) => {
      const response = await createMeter(meter);
      if ("success" in response && !response.success) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["meter-inventory"],
      });
    },
  });
};

export const useUpdateMeter = () => {
  return useMutation({
    mutationFn: async (meter: UpdateMeterPayload) => {
      const response = await updateMeter(meter);
      if ("success" in response && !response.success) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["meter-inventory"],
      });
    },
  });
};
