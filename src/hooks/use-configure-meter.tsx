import {
  fetchMeterConfigurations,
  setAPN,
  setCTPTRatio,
  setDateTime,
  setIpPort,
} from "@/service/configure-meter-service";
import {
  type SetDateTimePayload,
  type SetAPNPayload,
  type SetCTPTRatioPayload,
  type SetIpPortPayload,
  type FetchMeterConfigParams,
  type MeterConfigItem,
} from "@/types/configure-meter";
import { type Meter } from "@/types/meter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function mapToMeter(item: MeterConfigItem, index: number): Meter {
  return {
    sN: String(index + 1).padStart(2, "0"),
    meterNumber: item.meter.meterNumber,
    simNo: item.meter.simNumber,
    businessHub: item.businessName,
    class: item.meter.meterClass,
    category: item.meter.meterCategory,
    manufacturer: item.meter.meterManufacturerName,
    model: item.meter.smartMeterInfo?.meterModel ?? "—",
    status: item.connectionType === "ONLINE" ? "Online" : "Offline",
    region: item.meter.region,
    serviceCenter: item.businessName,
    feeder: item.meter.dss,
    transformer: item.meter.dss,
    lastSync: item.updatedAt
      ? new Date(item.updatedAt).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "—",
  };
}

export const useMeterConfigurations = (params: FetchMeterConfigParams = {}) => {
  return useQuery({
    queryKey: ["meters", params],
    queryFn: async () => {
      const response = await fetchMeterConfigurations(params);
      return {
        meters: response.responsedata.data.map(mapToMeter),
        totalData: response.responsedata.totalData,
        totalPages: response.responsedata.totalPages,
      };
    },
  });
};

export const useSetCTPTRatio = () => {
  const queryClient = useQueryClient();
  return useMutation<
    { responsecode: string; responsedesc: string },
    Error,
    SetCTPTRatioPayload
  >({
    mutationFn: setCTPTRatio,
    onSuccess: (data, variables) => {
      toast.success(
        `CT & VT ratio configured successfully for meter ${variables.serial}!`,
      );
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
      toast.success(
        `APN configured successfully for meter ${variables.serial}!`,
      );
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
      toast.success(
        `Date and Time configured successfully for meter ${variables.serial}!`,
      );
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
      toast.success(
        `Ip Address configured successfully for meter ${variables.serial}!`,
      );
      queryClient.invalidateQueries({ queryKey: ["meters"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to configure Ip Address: ${error.message}`);
    },
  });
};
