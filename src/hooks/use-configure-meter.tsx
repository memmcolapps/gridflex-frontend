import {
  fetchMeterConfigurations,
  readMeter,
  setAPN,
  setCTPTRatio,
  setDateTime,
  setIpPort,
  relayControl,
  setRelayMode,
  setToken,
} from "@/service/configure-meter-service";
import {
  type ConfigureResponse,
  type SetDateTimePayload,
  type SetAPNPayload,
  type SetCTPTRatioPayload,
  type SetIpPortPayload,
  type FetchMeterConfigParams,
  type MeterConfigItem,
  type ReadMeterResponse,
  type ReadMeterPayload,
  type RelayControlPayload,
  type SetRelayModePayload,
  type SetTokenPayload,
  type SetTokenResponse,
} from "@/types/configure-meter";
import {
  type Meter,
  // type MeterDetailNested,
  // type FlatNode,
  // type SmartMeterInfoResponse,
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

export const useReadMeter = () =>
  useMutation<ReadMeterResponse, Error, ReadMeterPayload>({
    mutationFn: (data: ReadMeterPayload) => readMeter(data),
  });

export const useSetCTPTRatio = () => {
  const queryClient = useQueryClient();
  return useMutation<ConfigureResponse, Error, SetCTPTRatioPayload>({
    mutationFn: setCTPTRatio,
    onSuccess: (data) => {
      const { status, message } = data.responsedata.data;
      if (status === "success") {
        toast.success(`CT & VT ratio configured: ${message}`);
      } else {
        toast.error(`CT & VT ratio failed: ${message}`);
      }
      queryClient.invalidateQueries({ queryKey: ["meters"] });
    },
    onError: (error: Error) => {
      const match = /"details":"([^"]+)"/.exec(error.message);
      const friendlyMsg = match?.[1] ?? error.message;
      toast.error(friendlyMsg);
    },
  });
};

export const useSetAPN = () => {
  const queryClient = useQueryClient();
  return useMutation<ConfigureResponse, Error, SetAPNPayload>({
    mutationFn: setAPN,
    onSuccess: (data) => {
      const { status, message } = data.responsedata.data;
      if (status === "success") {
        toast.success(`APN configured: ${message}`);
      } else {
        toast.error(`APN failed: ${message}`);
      }
      queryClient.invalidateQueries({ queryKey: ["meters"] });
    },
    onError: (error: Error) => {
      const match = /"details":"([^"]+)"/.exec(error.message);
      const friendlyMsg = match?.[1] ?? error.message;
      toast.error(friendlyMsg);
    },
  });
};

export const useSetDateTime = () => {
  const queryClient = useQueryClient();
  return useMutation<ConfigureResponse, Error, SetDateTimePayload>({
    mutationFn: setDateTime,
    onSuccess: (data) => {
      const { status, message } = data.responsedata;
      if (status === "success") {
        toast.success(`Date and Time configured: ${message}`);
      } else {
        toast.error(`Date and Time failed: ${message}`);
      }
      queryClient.invalidateQueries({ queryKey: ["meters"] });
    },
    onError: (error: Error) => {
      const match = /"details":"([^"]+)"/.exec(error.message);
      const friendlyMsg = match?.[1] ?? error.message;
      toast.error(friendlyMsg);
    },
  });
};

export const useSetIpPort = () => {
  const queryClient = useQueryClient();
  return useMutation<ConfigureResponse, Error, SetIpPortPayload>({
    mutationFn: setIpPort,
    onSuccess: (data) => {
      const { status, message } = data.responsedata.data;
      if (status === "success") {
        toast.success(`IP Address configured: ${message}`);
      } else {
        toast.error(`IP Address failed: ${message}`);
      }
      queryClient.invalidateQueries({ queryKey: ["meters"] });
    },
    onError: (error: Error) => {
      const match = /"details":"([^"]+)"/.exec(error.message);
      const friendlyMsg = match?.[1] ?? error.message;
      toast.error(friendlyMsg);
    },
  });
};

export const useRelayControl = () => {
  const queryClient = useQueryClient();
  return useMutation<
    {
      responsecode: string;
      responsedesc: string;
      responsedata: {
        status: string;
        message: string;
        data?: { relayStatus?: string };
      };
    },
    Error,
    RelayControlPayload
  >({
    mutationFn: relayControl,
    onSuccess: (data, variables) => {
      const { status, message } = data.responsedata;

      if (status === "success") {
        const relayStatus = data.responsedata.data?.relayStatus ?? "completed";
        toast.success(`Relay ${variables.type}d successfully! Status: ${relayStatus}`);
      } else {
        toast.error(`${variables.type} failed: ${message}`);
      }
      queryClient.invalidateQueries({ queryKey: ["meters"] });
    },
    onError: (error: Error) => {
      const match = /"details":"([^"]+)"/.exec(error.message);
      const friendlyMsg = match?.[1] ?? error.message;
      toast.error(friendlyMsg);
    },
  });
};

export const useSetRelayMode = () => {
  const queryClient = useQueryClient();
  return useMutation<ConfigureResponse, Error, SetRelayModePayload>({
    mutationFn: setRelayMode,
    onSuccess: (data) => {
      const { status, message } = data.responsedata.data;
      if (status === "success") {
        toast.success(`Relay mode changed: ${message}`);
      } else {
        toast.error(`Relay mode failed: ${message}`);
      }
      queryClient.invalidateQueries({ queryKey: ["meters"] });
    },
    onError: (error: Error) => {
      const match = /"details":"([^"]+)"/.exec(error.message);
      const friendlyMsg = match?.[1] ?? error.message;
      toast.error(friendlyMsg);
    },
  });
};

export const useSetToken = () => {
  return useMutation<SetTokenResponse, Error, SetTokenPayload>({
    mutationFn: setToken,
    onSuccess: (data) => {
      const { status, data: responseData } = data.responsedata;
      if (status === "success") {
        toast.success(`Token sent successfully! Token Status: ${responseData.tokenStatus}. Credit balance: ${responseData.meterCreditBalance}`);
      } else {
        toast.error(`Token failed: ${responseData.message || responseData.tokenStatus}. Credit balance: ${responseData.meterCreditBalance}`);
      }
    },
    onError: (error: Error) => {
      const match = /"details":"([^"]+)"/.exec(error.message);
      const friendlyMsg = match?.[1] ?? error.message;
      toast.error(friendlyMsg);
    },
  });
};
