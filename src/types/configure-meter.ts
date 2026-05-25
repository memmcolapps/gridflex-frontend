export interface SetCTPTRatioPayload {
  serial: string;
  ctNumerator: number;
  ctDenominator: number;
  ptNumerator: number;
  ptDenominator: number;
}

export interface SetAPNPayload {
  serial: string;
  apn: string;
}

export interface ReadMeterPayload {
  serial: string;
  type: "READ_RATIO" | "READ_IP" | "READ_CLOCK" | "READ_RELAY_MODE" | "READ_APN" | "READ_RELAY_STATUS";
}

interface ReadMeterResponseData {
  meterNo: string;
  obisCode: string;
  attributeIndex: number;
  dataIndex: number;
  value: number;
  scaler: number;
  unit: string;
  message: string;
}

export interface ReadMeterResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: ReadMeterResponseData;
}

export interface SetDateTimePayload {
  serial: string;
  dateTime: string;
}

export interface SetIpPortPayload {
  serial: string;
  ip: string;
  port: number;
}

export interface SmartMeterInfo {
  meterModel: string;
  createdAt: string;
  updatedAt: string;
}

export interface FlatNode {
  rootId: string;
  rootName: string;
  regionId: string;
  regionName: string;
  regionNodeId: string;
  regionParentId: string;
  regionRegionId: string;
  businessId: string;
  businessNodeId: string;
  businessParentId: string;
  businessRegionId: string;
  businessName: string;
  serviceId: string;
  serviceNodeId: string;
  serviceParentId: string;
  serviceRegionId: string;
  serviceName: string;
  feederId: string;
  feederNodeId: string;
  feederParentId: string;
  feederAssetId: string;
  feederName: string;
  dssId: string;
  dssNodeId: string;
  dssParentId: string;
  dssAssetId: string;
  dssName: string;
}

export interface MeterDetail {
  orgId: string;
  nodeId: string;
  meterId: string;
  meterNumber: string;
  simNumber: string;
  region: string;
  dss: string;
  meterCategory: string;
  meterClass: string;
  meterManufacturerName: string;
  meterStage: string;
  customerId: string;
  oldSgc: string;
  newSgc: string;
  oldKrn: string;
  newKrn: string;
  oldTariffIndex: number;
  newTariffIndex: number;
  smartMeterInfo: SmartMeterInfo;
  flatNode: FlatNode;
  createdAt: string;
  updatedAt: string;
}

export interface MeterConfigItem {
  meterNo: string;
  connectionType: "ONLINE" | "OFFLINE";
  onlineTime: string;
  offlineTime: string;
  updatedAt: string;
  businessName: string;
  meter: MeterDetail;
}

export interface MeterConfigResponseData {
  totalData: number;
  data: MeterConfigItem[];
  size: number;
  totalPages: number;
  page: number;
}

export interface MeterConfigResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: MeterConfigResponseData;
}

export interface RelayControlPayload {
  serial: string;
  state: 0 | 1;
  type: "connect" | "disconnect";
}

export interface FetchMeterConfigParams {
  page?: number;
  size?: number;
}

export interface SetRelayModePayload {
  serial: string;
  mode: string;
}

export interface SetTokenPayload {
  serial: string;
  credit: string;
}

export interface SetTokenResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: {
    data: {
      meterSerial: string;
      creditToken: string;
      status: string;
      dlmsStatus: string;
      message: string;
      tokenStatus: string;
      tokenResultCode: number;
      meterCreditBalance: number;
      logoutToken: string;
    };
    status: string;
    timestamp: string;
  };
}
