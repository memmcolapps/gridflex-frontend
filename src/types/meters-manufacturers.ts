export interface CreateManufacturerPayload {
  manufacturerId: string;
  name: string;
  sgc: string;
  state: string;
  contactPerson: string;
  email: string;
  phoneNo: string;
}

export interface UpdateManufacturerPayload {
  id: string;
  manufacturerId: string;
  name: string;
  sgc: string;
  state: string;
  contactPerson: string;
  email: string;
  phoneNo: string;
}

export interface Manufacturer {
  id: string;
  orgId: string;
  manufacturerId: string;
  name: string;
  sgc: string;
  status: boolean;
  contactPerson: string;
  state: string;
  email: string;
  phoneNo: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: string;
}

export interface GetManufacturersResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: {
    totalData: number;
    data: Manufacturer[];
    size: number;
    totalPages: number;
    page: number;
  };
}
