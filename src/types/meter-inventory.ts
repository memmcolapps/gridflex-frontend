// Meter inventory item from GET response
export interface MeterInventoryItem {
  id: string;
  meterNumber: string;
  simNumber: string;
  substation: string;
  feederLine: string;
  transformer: string;
  meterCategory: string;
  meterClass: string;
  meterType: string;
  approvedStatus: string;
  status: boolean;
  ctRatioNum: number;
  ctRatioDenom: number;
  voltRatioNum: number;
  multiplier: number;
  meterRating: number;
  initialReading: number;
  dial: number;
  latitude: string;
  longitude: string;
  createdAt: string;
  updatedAt: string;
}

// MD Meter specific information
export interface MdMeterInfo {
  ctRatioNum: string;
  ctRatioDenom: string;
  voltRatioNum: string;
  voltRatioDenom: string;
  multiplier: string;
  meterRating: string;
  initialReading: string;
  dial: string;
  latitude: string;
  longitude: string;
}

// Create meter payload
export interface CreateMeterPayload {
  meterNumber: string;
  simNumber: string;
  meterCategory: string;
  meterClass: string;
  meterManufacturer: string; // Manufacturer ID
  meterType: string;
  oldSgc: string;
  newSgc: string;
  oldKrn: string;
  newKrn: string;
  oldTariffIndex: number;
  newTariffIndex: number;
  mdMeterInfo?: MdMeterInfo; // Optional - only for MD meters
}

// Update meter payload (different structure)
export interface UpdateMeterPayload {
  id: string;
  meterNumber: string;
  simNumber: string;
  meterCategory: string;
  meterClass: string;
  manufacturer: string; // Note: different field name
  meterType: string;
  ctRatioNum: string;
  ctRatioDenom: string;
  voltRatioNum: string;
  voltRatioDenom: string;
  multiplier: string;
  meterRating: string;
  initialReading: string;
  dial: string;
  latitude: string;
  longitude: string;
}

export interface MeterInventoryResponse {
  totalData: number;
  data: MeterInventoryItem[];
  size: number;
  totalPages: number;
  page: number;
}

export interface GetMeterInventoryResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: MeterInventoryResponse;
}

export interface MeterInventoryFilters {
  page?: number;
  size?: number;
  meterNumber?: string;
  simNo?: string;
  manufacturer?: string;
  meterClass?: string;
  category?: string;
  approvedStatus?: string;
  status?: string;
  createdAt?: string;
}

export interface ApiResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: string;
}