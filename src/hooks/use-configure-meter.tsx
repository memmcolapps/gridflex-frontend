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
import {
  type Meter,
  type MeterDetailNested,
  type FlatNode,
  type SmartMeterInfoResponse,
} from "@/types/meter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function mapToMeter(item: MeterConfigItem): Meter {
  const meterDetail = item.meter;

  return {
    meterNo: item.meterNo,
    connectionType: item.connectionType,
    onlineTime: item.onlineTime ?? "",
    offlineTime: item.offlineTime ?? "",
    updatedAt: item.updatedAt ?? "",
    businessName: item.businessName,
    meter: {
      orgId: meterDetail.orgId,
      nodeId: meterDetail.nodeId,
      meterId: meterDetail.meterId,
      meterNumber: meterDetail.meterNumber,
      simNumber: meterDetail.simNumber,
      region: meterDetail.region,
      dss: meterDetail.dss,
      meterCategory: meterDetail.meterCategory,
      meterClass: meterDetail.meterClass,
      meterManufacturerName: meterDetail.meterManufacturerName,
      meterStage: meterDetail.meterStage,
      customerId: meterDetail.customerId,
      oldSgc: meterDetail.oldSgc,
      newSgc: meterDetail.newSgc,
      oldKrn: meterDetail.oldKrn,
      newKrn: meterDetail.newKrn,
      oldTariffIndex: meterDetail.oldTariffIndex,
      newTariffIndex: meterDetail.newTariffIndex,
      smartMeterInfo: meterDetail.smartMeterInfo,
      flatNode: meterDetail.flatNode,
      createdAt: meterDetail.createdAt ?? "",
      updatedAt: meterDetail.updatedAt ?? "",
    },
    // Legacy fields for backward compatibility
    sN: item.meterNo,
    meterNumber: meterDetail.meterNumber,
    simNo: meterDetail.simNumber,
    businessHub: item.businessName,
    class: meterDetail.meterClass,
    category: meterDetail.meterCategory,
    manufacturer: meterDetail.meterManufacturerName,
    model: meterDetail.smartMeterInfo?.meterModel ?? "",
    status: item.connectionType === "ONLINE" ? "Online" : "Offline",
    region: meterDetail.flatNode?.regionName ?? meterDetail.region ?? "",
    serviceCenter: meterDetail.flatNode?.serviceName ?? item.businessName,
    feeder: meterDetail.flatNode?.feederName ?? meterDetail.dss ?? "",
    transformer: meterDetail.flatNode?.dssName ?? "",
    lastSync: item.onlineTime ?? item.offlineTime ?? "",
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
      // toast.error(`Failed to configure CT & VT ratio: ${error.message}`);
      const match = /"details":"([^"]+)"/.exec(error.message);
      const friendlyMsg = match?.[1] ?? error.message;
      toast.error(friendlyMsg);
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
      // toast.error(`Failed to configure APN: ${error.message}`);
      const match = /"details":"([^"]+)"/.exec(error.message);
      const friendlyMsg = match?.[1] ?? error.message;
      toast.error(friendlyMsg);
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
      // toast.error(`Failed to configure Date and Time: ${error.message}`);
      const match = /"details":"([^"]+)"/.exec(error.message);
      const friendlyMsg = match?.[1] ?? error.message;
      toast.error(friendlyMsg);
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
      // toast.error(`Failed to configure Ip Address: ${error.message}`);
      const match = /"details":"([^"]+)"/.exec(error.message);
      const friendlyMsg = match?.[1] ?? error.message;
      toast.error(friendlyMsg);
    },
  });
};
