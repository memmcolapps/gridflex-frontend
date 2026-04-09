import { setAPN, setCTPTRatio, setDateTime, setIpPort } from "@/service/configure-meter-service";
import { type SetDateTimePayload, type SetAPNPayload, type SetCTPTRatioPayload, type SetIpPortPayload } from "@/types/configure-meter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSetCTPTRatio = () => {
  const queryClient = useQueryClient();
  return useMutation<
    { responsecode: string; responsedesc: string },
    Error,
    SetCTPTRatioPayload
  >({
    mutationFn: setCTPTRatio,
    onSuccess: (data, variables) => {
      toast.success(`CT & VT ratio configured successfully for meter ${variables.serial}!`);
      queryClient.invalidateQueries({ queryKey: ["meters"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to configure CT & VT ratio: ${error.message}`);
    },
  });
};


export const useSetAPN = () => {
  const queryClient = useQueryClient();
  return useMutation<
    { responsecode: string; responsedesc: string },
    Error,
    SetAPNPayload
  >({
    mutationFn: setAPN,
    onSuccess: (data, variables) => {
      toast.success(`APN configured successfully for meter ${variables.serial}!`);
      queryClient.invalidateQueries({ queryKey: ["meters"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to configure APN: ${error.message}`);
    },
  });
};

export const useSetDateTime = () => {
  const queryClient = useQueryClient();
  return useMutation<
    { responsecode: string; responsedesc: string },
    Error,
    SetDateTimePayload
  >({
    mutationFn: setDateTime,
    onSuccess: (data, variables) => {
      toast.success(`Date and Time configured successfully for meter ${variables.serial}!`);
      queryClient.invalidateQueries({ queryKey: ["meters"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to configure Date and Time: ${error.message}`);
    },
  });
};

export const useSetIpPort = () => {
  const queryClient = useQueryClient();
  return useMutation<
    { responsecode: string; responsedesc: string },
    Error,
    SetIpPortPayload
  >({
    mutationFn: setIpPort,
    onSuccess: (data, variables) => {
      toast.success(`Ip Address configured successfully for meter ${variables.serial}!`);
      queryClient.invalidateQueries({ queryKey: ["meters"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to configure Ip Address: ${error.message}`);
    },
  });
};