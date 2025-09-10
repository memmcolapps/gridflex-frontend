import { queryClient } from "@/lib/queryClient";
import {
  createManufacturer,
  fetchManufacturers,
  updateManufacturer,
} from "@/service/meter-service";
import { type Manufacturer } from "@/types/meters-manufacturers";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetMeterManufactures = (
  page?: number,
  size?: number,
  name?: string,
  manufacturerId?: string,
  sgc?: string,
  state?: string,
  createdAt?: string,
) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["meters"],
    queryFn: () =>
      fetchManufacturers(
        page,
        size,
        name,
        manufacturerId,
        sgc,
        state,
        createdAt,
      ),
  });

  return {
    data: data?.success
      ? data.data
      : {
          totalData: 0,
          data: [],
          size: 0,
          totalPages: 0,
          page: 0,
        },
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
