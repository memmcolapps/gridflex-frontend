export interface VirtualMeterData {
  id: string;
  customerId: string;
  meterNumber: string;
  accountNumber: string;
  feeder?: string; 
  dss?: string;
  category?: string;
  cin?: string;
  tariff?: string;
  status?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  state?: string;
  city?: string;
  streetName?: string;
  houseNo?: string;
  reason?: string;
  debitMop?: string; // Added for payment fields
  debitPaymentPlan?: string;
  creditMop?: string;
  creditPaymentPlan?: string;
  energyType?: string;
  fixedEnergy?: string;
  custoType?: string;
  image?: File | null;
  consumptionType?: string; // Added for consumption type
  assignedStatus?: string; // Added for assigned status
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

export interface MeterInventoryResponse {
  totalData: number;
  data: MeterData[];
  size: number;
  totalPages: number;
  page: number;
}

export interface GetMeterInventoryResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: MeterInventoryResponse;
}
// types/meter.ts
export interface Meter {
  sN: string;
  meterNumber: string;
  simNo: string;
  businessHub: string;
  class: string;
  category: string;
  manufacturer: string;
  model: string;
  status: string;
  region: string;
  serviceCenter: string;
  feeder: string;
  transformer: string;
  lastSync: string;
}

// Payload interfaces for meter operations
export interface MdMeterInfo {
  ctRatioNum: string;
  ctRatioDenom: string;
  voltRatioNum: string;
  voltRatioDenom: string;
  multiplier: string;
  meterRating: string;
  initialReading: string;
  dial: string;
  longitude: string;
  latitude: string;
}

export interface SmartMeterInfo {
  meterModel: string;
  protocol: string;
  authentication: string;
  password: string;
}

export interface CreateMeterPayload {
  id: string;
  meterNumber: string;
  // meterManufacturer?: string;
  meterClass: string;
  meterType: string;
  meterCategory: string;
  dateAdded?: string;
  oldSgc?: string;
  newSgc?: string;
  oldKrn?: string;
  newKrn?: string;
  oldTariffIndex?: number;
  newTariffIndex?: number;
  simNumber: string;
  smartStatus?: boolean;
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
  smartMeterInfo?: {
    meterModel: string;
    protocol: string;
    authentication: string;
    password: string;
  };
}

export interface UpdateMeterPayload extends CreateMeterPayload {
  id: string;
}

// Response interfaces
export interface GetMeterResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: MeterData[];
}

export interface MeterApiResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: string;
}

// Add MeterInventoryFilters interface for the backend request parameters
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
  createdAt?: string; // Format like '27-05-2025' or 'YYYY-MM-DD' as per API
}