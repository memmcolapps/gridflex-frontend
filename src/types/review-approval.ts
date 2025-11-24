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
  responsedata: {
    totalData: number;
    data: Tariff[];
    size: number;
    totalPages: number;
    page: number;
  };
}

export interface Tariff {
  id: string;
  name: string;
  org_id: string;
  created_by: string;
  description: string;
  tId: string;
  t_id: string;
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
  address: string;
  phoneNo: string;
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
  customer: {
    id: string;
    orgId: string;
    firstname: string;
    lastname: string;
    customerId?: string;
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
   meterAssignLocation: {
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
  oldMeterInfo: {
    id: string;
    orgId: string;
    meterNumber: string;
    simNumber: string;
    type: string;
    meterCategory: string;
    meterClass: string;
    meterType: string;
    meterStage: string;
    status: string;
    smartStatus: boolean;
    oldSgc: string;
    newSgc: string;
    oldKrn: string;
    newKrn: string;
    oldTariffIndex: string;
    newTariffIndex: string;
    meterAssignLocation: {
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
    customer: {
      id: string;
      orgId: string;
      firstname: string;
      lastname: string;
      customerId?: string;
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
    smartMeterInfo?: {
      id: string;
      meterId: string;
      orgId: string;
      meterModel: string;
      protocol: string;
      authentication: string;
      password: string;
      createdAt: string;
      updatedAt: string;
    };
    createdAt: string;
    updatedAt: string;
  };
  nodeInfo: {
    id: string;
    regionId: string;
    name: string;
    email: string;
    address: string;
    type: string;
    createdAt: string;
    updatedAt: string;
  };
  meterCategory: string;
  status: boolean | string;
  approveStatus: string;
  createdBy: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  customerId: string;
  customerName: string;
  simNumber: string;
  oldSgc: string;
  newSgc: string;
  meterClass: string;
  meterStage: string;
  reason?: string;
  oldKrn?: string;
  newKrn?: string;
  oldTariffIndex?: string;
  newTariffIndex?: string;
  imageUrl?: string;
}
