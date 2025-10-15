import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createRegionBhubServiceCenter,
  createSubstationTransfomerFeeder,
  fetchOrganizationNodes,
  updateRegionBhubServiceCenter,
  updateSubstationTransfomerFeeder,
} from "../service/organaization-service";
import { useAuth } from "../context/auth-context";
import {
  type CreateRegionBhubServiceCenterPayload,
  type CreateSubstationTransfomerFeederPayload,
  type UpdateRegionBhubServiceCenterPayload,
  type UpdateSubstationTransfomerFeederPayload,
} from "@/types/organization-types";
import { queryClient } from "@/lib/queryClient";

export const useOrg = () => {
  const { isAuthenticated } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["organization-nodes"],
    queryFn: fetchOrganizationNodes,
    enabled: isAuthenticated,
  });

  return {
    nodes: data?.success ? data.data : [],
    isLoading,
    error,
  };
};

export const useCreateRegionBhubServiceCenter = () => {
  return useMutation({
    mutationFn: async (payload: CreateRegionBhubServiceCenterPayload) => {
      const response = await createRegionBhubServiceCenter(payload);
      if ("error" in response && response.success === false) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organization-nodes"],
      });
    },
  });
};

export const useUpdateRegionBhubServiceCenter = () => {
  return useMutation({
    mutationFn: async (payload: UpdateRegionBhubServiceCenterPayload) => {
      const response = await updateRegionBhubServiceCenter(payload);
      if ("error" in response && response.success === false) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organization-nodes"],
      });
    },
  });
};

export const useCreateSubstationTransfomerFeeder = () => {
  return useMutation({
    mutationFn: async (payload: CreateSubstationTransfomerFeederPayload) => {
      const response = await createSubstationTransfomerFeeder(payload);
      if ("error" in response && response.success === false) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organization-nodes"],
      });
    },
  });
};

export const useUpdateSubstationTransfomerFeeder = () => {
  return useMutation({
    mutationFn: async (payload: UpdateSubstationTransfomerFeederPayload) => {
      const response = await updateSubstationTransfomerFeeder(payload);
      if ("error" in response && response.success === false) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organization-nodes"],
      });
    },
  });
};
