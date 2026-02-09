// Meter inventory item from GET response
export interface ManufacturerDetails {
  id: string;
  orgId: string;
  manufacturerId: string;
  name: string;
  contactPerson: string;
  state: string;
  city: string;
  street: string;
  email: string;
  phoneNo: string;
  createdAt: string;
  updatedAt: string;
}

export interface MeterInventoryItem {
  dssInfo?: {
    nodeId: string;
    parentId: string;
    assetId: string;
    name: string;
    type: string;
    createdAt: string;
    updatedAt: string;
  };
  tariffInfo?: {
    id: string;
    name: string;
    org_id: string;
    tariff_type: string;
    effective_date: string;
    tariff_rate: string;
    band_id: string;
    approve_status: string;
    band: {
      id: string;
      orgId: string;
      name: string;
      hour: string;
      approveStatus: string;
      createdAt: string;
      updatedAt: string;
    };
    created_at: string;
    updated_at: string;
  };
  feederInfo?: {
    nodeId: string;
    parentId: string;
    assetId: string;
    name: string;
    type: string;
    createdAt: string;
    updatedAt: string;
  };
  id?: string;
  meterNumber: string;
  meterManufacturer: string;
  meterClass: string;
  // meterType?: string;
  // meterCategory: string;
  dateAdded?: string;
  oldSgc?: string;
  newSgc?: string;
  oldKrn?: string;
  newKrn?: string;
  oldTariffIndex?: number;
  newTariffIndex?: number;
  simNumber?: string;
  smartStatus: boolean;
  mdMeterInfo?: {
    ctRatioNum?: string;
    ctRatioDenom?: string;
    voltRatioNum?: string;
    voltRatioDenom?: string;
    multiplier?: string;
    meterRating?: string;
    initialReading?: string;
    dial?: string;
    longitude?: string;
    latitude?: string;
  };
  // meterModel?: string;
  protocol?: string;
  authentication?: string;
  password?: string;
  customerId?: string | null;
  accountNumber?: string;
  tariff?: string;
  assignedStatus?: string;
  status?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  debitMop?: string; // Added for payment fields
  debitPaymentPlan?: string;
  creditPaymentPlan?: string;
  creditMop?: string;
  Image?: File;
  feederLine?: string;
  dss?: string; // Optional, as not always required
  cin?: string;
  state?: string;
  city?: string;
  streetName?: string;
  houseNo?: string;
  approvedStatus?: string;
  meterStage?: string;
  simNo?: string;
  manufacturer?: ManufacturerDetails;
  category?: string;
  type?: string;
  smartMeterInfo: {
    meterModel: string;
    protocol: string;
    authentication: string;
    password: string;
  };
  createdAt: string;
  updatedAt: string;
}

// MD Meter specific information
export interface mdMeterInfo {
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

// Smart meter info (aligned with expected structure)
export interface SmartMeterInfo {
  meterModel: string;
  protocol: string;
  authentication: string;
  password: string;
}

// Create meter payload (now includes missing fields)
export interface CreateMeterPayload {
  meterNumber: string;
  simNumber: string;
  meterClass: string;
  meterManufacturer: string; // Standardized field name
  oldSgc: string;
  newSgc: string;
  oldKrn: string;
  newKrn: string;
  oldTariffIndex: number;
  newTariffIndex: number;
  smartStatus?: boolean; // Added missing property
  smartMeterInfo?: SmartMeterInfo; // Added missing property (optional for creation)
  mdMeterInfo?: mdMeterInfo; // Optional - only for MD meters
}

// Update meter payload (now includes missing fields; standardized field names)
export interface UpdateMeterPayload {
  id: string;
  meterNumber: string;
  simNumber: string;
  meterClass: string;
  meterManufacturer: string; // Standardized field name
  oldSgc: string;
  newSgc: string;
  oldKrn: string;
  newKrn: string;
  oldTariffIndex: number;
  newTariffIndex: number;
  smartStatus?: boolean; // Added missing property
  smartMeterInfo?: SmartMeterInfo; // Added missing property (optional for creation)
  mdMeterInfo?: mdMeterInfo; //
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

// types.ts
export interface MeterData {
  id: string;
  meterNumber: string;
  meterManufacturer: string;
  meterClass: string;
  meterType?: string;
  meterCategory: string;
  dateAdded?: string;
  oldSgc?: string;
  newSgc?: string;
  oldKrn?: string;
  newKrn?: string;
  oldTariffIndex?: number;
  newTariffIndex?: number;
  simNumber?: string;
  smartStatus: boolean;
  MdMeterInfo?: {
    ctRatioNum?: string;
    ctRatioDenom?: string;
    voltRatioNum?: string;
    voltRatioDenom?: string;
    multiplier?: string;
    meterRating?: string;
    initialReading?: string;
    dial?: string;
    longitude?: string;
    latitude?: string;
  };
  meterModel?: string;
  protocol?: string;
  authentication?: string;
  password?: string;
  customerId?: string | null;
  accountNumber?: string;
  tariff?: string;
  assignedStatus?: string;
  status?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  debitMop?: string; // Added for payment fields
  debitPaymentPlan?: string;
  creditPaymentPlan?: string;
  creditMop?: string;
  Image?: File;
  feederLine?: string;
  dss?: string; // Optional, as not always required
  cin?: string;
  state?: string;
  city?: string;
  streetName?: string;
  houseNo?: string;
  approvedStatus?: string;
  meterStage?: string;
  type?: string;
  manufacturer?: {
    id: string;
    orgId: string;
    manufacturerId: string;
    name: string;
    contactPerson: string;
    state: string;
    city: string;
    street: string;
    email: string;
    phoneNo: string;
    createdAt: string;
    updatedAt: string;
  };
  smartMeterInfo: {
    meterModel: string;
    protocol: string;
    authentication: string;
    password: string;
  };
}

export interface BusinessHub {
  id: string;
  orgId: string;
  nodeId: string;
  parentId: string;
  regionId: string;
  name: string;
  phoneNo: string;
  email: string;
  contactPerson: string;
  address: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessHubResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: BusinessHub[];
}
