import { queryClient } from "@/lib/queryClient";
import {
  createManufacturer,
  fetchManufacturers,
  updateManufacturer,
} from "@/service/meter-service";
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
