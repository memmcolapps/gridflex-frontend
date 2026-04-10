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
 
export interface FetchMeterConfigParams {
    page?: number;
    size?: number;
}