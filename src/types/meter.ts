export interface VirtualMeterData {
   id: string;
   nodeId?: string;
   customerId: string;
   meterNumber: string;
   accountNumber: string;
   simNumber?: string;
   feeder?: string;
   dss?: string;
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
   category?: string;
   meterCategory?: string;
   meterClass?: string;
   meterType?: string;
   meterStage?: string;
   cin?: string;
   tariff?: string;
   status?: string;
   smartStatus?: boolean;
   oldSgc?: string;
   newSgc?: string;
   oldKrn?: string;
   newKrn?: string;
   oldTariffIndex?: number;
   newTariffIndex?: number;
   firstName?: string;
   lastName?: string;
   phone?: string;
   state?: string;
   city?: string;
   streetName?: string;
   houseNo?: string;
   reason?: string;
   debitMop?: string;
   debitPaymentPlan?: string;
   creditMop?: string;
   creditPaymentPlan?: string;
   energyType?: string;
   fixedEnergy?: string;
   custoType?: string;
   image?: File | null;
   consumptionType?: string;
   assignedStatus?: string;
   customer?: {
       id: string;
       orgId: string;
       firstname: string;
       lastname: string;
       customerId: string;
       nin: string;
       phoneNumber: string;
       email: string;
       state: string;
       city: string;
       houseNo: string;
       streetName: string;
       status: string;
       vat: string;
       createdAt: string;
       updatedAt: string;
   };
   meterAssignLocation?: {
       id: string;
       orgId: string;
       meterId: string;
       state: string;
       city: string;
       houseNo: string;
       streetName: string;
       createdAt: string;
       updatedAt: string;
   };
   createdAt?: string;
   updatedAt?: string;
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
  meterNumber: string;
  meterClass: string;
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