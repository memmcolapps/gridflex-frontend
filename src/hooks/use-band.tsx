import { useMutation, useQuery } from "@tanstack/react-query";
import {
   fetchBands,
   createBand,
   type Band,
   updateBand,
   deactivateBand,
   activateBand,
   bulkApproveBands,
} from "../service/band-service";
import { useAuth } from "../context/auth-context";
import { queryClient } from "@/lib/queryClient";

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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bands"],
      });
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bands"],
      });
    },
  });
};

export const useDeactivateBand = () => {
  return useMutation({
    mutationFn: async (bandId: string) => {
      const response = await deactivateBand(bandId);
      if ("success" in response && !response.success) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bands"],
      });
    },
  });
};

export const useActivateBand = () => {
   return useMutation({
      mutationFn: async (bandId: string) => {
         const response = await activateBand(bandId);
         if ("success" in response && !response.success) {
            throw new Error(response.error);
         }
         return response;
      },
      onSuccess: () => {
         queryClient.invalidateQueries({
            queryKey: ["bands"],
         });
      },
   });
};

export const useBulkApproveBands = () => {
   return useMutation({
      mutationFn: async (bands: { name: string }[]) => {
         const response = await bulkApproveBands(bands);
         if ("success" in response && !response.success) {
            throw new Error(response.error);
         }
         return response;
      },
      onSuccess: () => {
         queryClient.invalidateQueries({
            queryKey: ["bands"],
         });
      },
   });
};
