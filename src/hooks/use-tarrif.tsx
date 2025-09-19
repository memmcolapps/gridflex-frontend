import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchTariffs,
  createTariff,
  changeTariffStatus,
  changeTariffApprovalStatus,
  type TariffPayload,
} from "../service/tarriff-service";
import { useAuth } from "../context/auth-context";
import { queryClient } from "@/lib/queryClient";

export const useTariff = () => {
  const { isAuthenticated } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["tariffs"],
    queryFn: fetchTariffs,
    enabled: isAuthenticated,
  });

  return {
    tariffs: data?.success ? data.data : [],
    isLoading,
    error,
  };
};

export const useCreateTariff = () => {
  return useMutation({
    mutationFn: async (tariff: TariffPayload) => {
      const response = await createTariff(tariff);
      if ("success" in response && !response.success) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tariffs"],
      });
    },
  });
};

type ChangeTariffStatusParams = {
  tariffId: string;
  status: boolean;
};

export const useChangeTariffStatus = () => {
  return useMutation({
    mutationFn: async ({ tariffId, status }: ChangeTariffStatusParams) => {
      const response = await changeTariffStatus(tariffId, status);
      if ("success" in response && !response.success) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tariffs"],
      });
    },
  });
};

type ChangeTariffApprovalStatusParams = {
  tariffId: string | number;
  approvalStatus: "Approved" | "Rejected";
};

export const useChangeTariffApprovalStatus = () => {
  return useMutation({
    mutationFn: async ({
      tariffId,
      approvalStatus,
    }: ChangeTariffApprovalStatusParams) => {
      const response = await changeTariffApprovalStatus(
        tariffId,
        approvalStatus,
      );
      if ("success" in response && !response.success) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tariffs"],
      });
    },
  });
};
