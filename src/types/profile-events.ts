export interface MeterModel {
  meterModel: string;
  createdAt: string;
  updatedAt: string;
}

export interface NodeInfo {
  id: string;
  nodeId: string;
  regionId?: string;
  assetId?: string;
  name: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface NodeTree {
  id: string;
  orgId: string;
  name: string;
  parentId?: string;
  nodeInfo: NodeInfo;
  nodesTree: NodeTree[];
}

export interface EventType {
  id: number;
  name: string;
  obisCode: string;
  description: string;
}

export interface ProfileEventsApiResponse {
  responsecode: "000" | string;
  responsedesc: string;
  responsedata: {
    models: MeterModel[];
    nodes: NodeTree[];
    event_types: EventType[];
  };
}

export interface ProfileDataItem {
  meterNumber: string;
  meterModel: string;
  entryTimestamp: string;
  receivedAt: string;
  t1ActiveEnergy: string;
  t2ActiveEnergy: string;
  t3ActiveEnergy: string;
  t4ActiveEnergy: string;
  totalActiveEnergy: string;
  totalApparentEnergy: string;
  meter: {
    id: string;
    orgId: string;
    nodeId: string;
    meterNumber: string;
    accountNumber: string;
    simNumber: string;
    fixedEnergy: string;
    dss: string;
    meterCategory: string;
    meterClass: string;
    meterType: string;
    smartStatus: boolean;
    customerId: string;
    oldSgc: string;
    newSgc: string;
    oldKrn: string;
    newKrn: string;
    oldTariffIndex: number;
    newTariffIndex: number;
    flatNode: {
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
    };
    createdAt: string;
    updatedAt: string;
  };
}

export interface EventRecord {
  id: number;
  meterNumber: string;
  meterModel: string;
  eventTypeId: string;
  eventTime: string;
  eventName: string;
  eventType: {
    id: number;
    name: string;
    obisCode: string;
    description: string;
  };
  meter: {
    orgId: string;
    nodeId: string;
    meterNumber: string;
    accountNumber: string;
    simNumber: string;
    fixedEnergy: string;
    dss: string;
    meterCategory: string;
    meterClass: string;
    meterType: string;
    smartStatus: boolean;
    customerId: string;
    oldSgc: string;
    newSgc: string;
    oldKrn: string;
    newKrn: string;
    oldTariffIndex: number;
    newTariffIndex: number;
    flatNode: {
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
    };
    createdAt: string;
    updatedAt: string;
  };
}

export interface EventsApiResponse {
  responsecode: "000" | string;
  responsedesc: string;
  responsedata: {
    totalData: number;
    data: EventRecord[];
  };
}

export interface GetEventsParams {
  page: number;
  size: number;
  startDate: string;
  endDate: string;
  meterNumber: string;
  eventTypeName: string;
  model: string;
  search: string;
  node: string;
}

export interface ProfileRecord {
  id: number;
  meterNumber: string;
  meterModel: string;
  profileType: string;
  profileTime: string;
  profileName: string;
  value: string;
  meter: {
    orgId: string;
    nodeId: string;
    meterNumber: string;
    accountNumber: string;
    simNumber: string;
    fixedEnergy: string;
    dss: string;
    meterCategory: string;
    meterClass: string;
    meterType: string;
    smartStatus: boolean;
    customerId: string;
    oldSgc: string;
    newSgc: string;
    oldKrn: string;
    newKrn: string;
    oldTariffIndex: number;
    newTariffIndex: number;
    flatNode: {
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
    };
    createdAt: string;
    updatedAt: string;
  };
}

export interface ProfilesApiResponse {
  responsecode: "000" | string;
  responsedesc: string;
  responsedata: {
    totalData: number;
    data: ProfileDataItem[];
    size: number;
    totalPages: number;
    page: number;
  };
}

export interface GetProfilesParams {
  page: number;
  size: number;
  startDate: string;
  endDate: string;
  meterNumber: string;
  profile: string;
  model: string;
  search: string;
  node: string;
}