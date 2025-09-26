export interface GetPercentageResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: PercentageRange[];
}

export interface PercentageRange {
  approveStatus: string;
  description: string;
  amountStartRange: string;
  amountEndRange: string;
  oldAmountStartRange: string;
  oldAmountEndRange: string;
  id: string;
  percentageId: string;
  orgId: string;
  percentage: string;
  code: string;
  band: {
    id: string;
    orgId: string;
    name: string;
    hour: string;
    approveStatus: string;
    createdAt: string;
    updatedAt: string;
  };
  oldPercentageRangeInfo: {
    id: string;
    orgId: string;
    percentage: string;
    code: string;
    band: {
      id: string;
      orgId: string;
      name: string;
      hour: string;
      approveStatus: string;
      createdAt: string;
      updatedAt: string;
    };
    amountStartRange: string;
    amountEndRange: string;
    status: boolean;
    approveStatus: string;
    createdBy: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface GetAllLiabilitiesResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: Liability[];
}
export interface Liability {
  id: string;
  liabilityCauseId: string;
  orgId: string;
  name: string;
  code: string;
  status: boolean;
  approveStatus: string;
  createdBy: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  oldLiabilityCauseInfo: {
    id: string;
    orgId: string;
    name: string;
    code: string;
    approveStatus: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface GetBandResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: Band[];
}
export interface Band {
  id: string;
  orgId: string;
  bandId: string;
  name: string;
  hour: string;
  createdBy: string;
  approveBy: string;
  approveStatus: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  oldBandInfo: {
    id: string;
    orgId: string;
    name: string;
    hour: string;
    approveStatus: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface GetTariffResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: Tariff[];
}

export interface Tariff {
  id: string;
  name: string;
  org_id: string;
  created_by: string;
  description: string;
  tId: string;
  tariff_id: string;
  tariff_type: string;
  effective_date: string;
  tariff_rate: string;
  band: Band;
  status: boolean;
  approve_status: string;
  created_at: string;
  updated_at: string;
  oldTariffInfo: {
    id: string;
    name: string;
    org_id: string;
    tariff_type: string;
    effective_date: string;
    tariff_rate: string;
    approve_status: string;
    band: {
      id: string;
      orgId: string;
      name: string;
      hour: string;
      approveStatus: string;
      createdAt: string;
    };
    created_at: string;
    updated_at: string;
  };
}

export interface MeterResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: {
    totalData: number;
    data: Meter[];
    size: number;
    totalPages: number;
    page: number;
  };
}

export interface Meter {
  id: string;
  meterId: string;
  orgId: string;
  meterNumber: string;
  meterType: string;
  manufacturer: {
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
  meterCategory: string;
  status: boolean;
  approveStatus: string;
  createdBy: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  customerId: string;
  customerName: string;
  simNumber: string;
  oldSGC: string;
  newSGC: string;
  meterClass: string;
  changeDescription: string;
  meterStage: string;
  reason?: string;
  oldkrn?: string;
  newkrn?: string;
  oldTariffIndex?: string;
  newTariffIndex?: string;
  imageUrl?: string;
}
