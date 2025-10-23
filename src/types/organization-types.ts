export interface CreateRegionBhubServiceCenterPayload {
  parentId: string;
  regionId: string;
  name: string;
  phoneNo: string;
  email: string;
  contactPerson: string;
  address: string;
  type: string;
}

export interface CreateOrgResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: string;
}

export interface UpdateRegionBhubServiceCenterPayload {
  nodeId: string;
  regionId: string;
  name: string;
  phoneNo: string;
  email: string;
  contactPerson: string;
  address: string;
  type: string;
}

export interface CreateSubstationTransfomerFeederPayload {
  parentId: string;
  name: string;
  serialNo: string;
  phoneNo: string;
  email: string;
  contactPerson: string;
  address: string;
  status: boolean;
  voltage: string;
  latitude: string;
  longitude: string;
  description: string;
  assetId: string;
  type: string;
}

export interface UpdateSubstationTransfomerFeederPayload {
  nodeId: string;
  name: string;
  serialNo: string;
  phoneNo: string;
  email: string;
  contactPerson: string;
  address: string;
  status: boolean;
  voltage: string;
  latitude: string;
  longitude: string;
  description: string;
  assetId: string;
  type: string;
}
