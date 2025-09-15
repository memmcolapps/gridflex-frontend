import { queryClient } from "@/lib/queryClient";
import {
  createManufacturer,
  fetchManufacturers,
  updateManufacturer,
  fetchMeterInventory,
  createMeter,
  updateMeter,
} from "@/service/meter-service";
import {
  type MeterInventoryFilters,
  type CreateMeterPayload,
  type UpdateMeterPayload,
  type MeterInventoryResponse,
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
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["meter-inventory", filters], // ✅ Clear separation
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
    isLoading,
    refetch,
  };
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
        queryKey: ["meter-inventory"], // ✅ Only invalidate meter inventory
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