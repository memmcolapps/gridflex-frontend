import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchBands,
  createBand,
  type Band,
  updateBand,
} from "../service/band-service";
import { useAuth } from "../context/auth-context";

export const useBand = () => {
  const { isAuthenticated } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["bands"],
    queryFn: fetchBands,
    enabled: isAuthenticated,
  });

  return {
    bands: data?.success ? data.data : [],
    isLoading,
    error,
  };
};

export const useCreateBand = () => {
  return useMutation({
    mutationFn: async (band: Band) => {
      const response = await createBand(band);
      if ("success" in response && !response.success) {
        throw new Error(response.error);
      }
      return response;
    },
  });
};

export const useUpdateBand = () => {
  return useMutation({
    mutationFn: async (band: Band) => {
      const response = await updateBand(band);
      if ("success" in response && !response.success) {
        throw new Error(response.error);
      }
      return response;
    },
  });
};
