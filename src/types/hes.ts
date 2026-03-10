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

export interface Node {
  id: string;
  orgId: string;
  name: string;
  parentId?: string;
  nodeInfo: NodeInfo;
  nodesTree: Node[];
}

export interface EventType {
  id: number;
  name: string;
  obisCode: string;
  description: string;
}

export interface HierarchyResponseData {
  models: MeterModel[];
  nodes: Node[];
  event_types: EventType[];
}

export interface HierarchyResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: HierarchyResponseData;
}

export interface ScheduleItem {
  name: string;
  orgId: string;
  cronExpression: string;
  cronJob: boolean;
  description: string;
  interfaceName: string;
  jobClass: string;
  jobGroup: string;
  jobName: string;
  jobStatus: string;
  repeatTime: string;
  repeatMinutes: string;
  repeatHours: string;
  lastRunTime: string;
  obisCode: string;
  updatedAt: string;
}

export interface ScheduleListResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: {
    totalData: number;
    data: ScheduleItem[];
    size: number;
    totalPages: number;
    page: number;
  };
}