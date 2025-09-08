export interface GetUsersApiResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: GetUsersResponseData;
}

export interface GetUsersResponseData {
  totalData: number;
  data: GetUsersUser[];
  size: number;
  totalPages: number;
  page: number;
}

export interface GetUsersUser {
  id: string;
  orgId: string;
  nodeId: string;
  firstname: string;
  lastname: string;
  email: string;
  status: boolean;
  active: boolean;
  password: string;
  groups: GetUsersGroup;
  nodes: GetUsersNode;
  createdAt: string;
  updatedAt: string;
  lastActive?: string; // Optional field
}

interface GetUsersGroup {
  id: string;
  orgId: string;
  groupTitle: string;
  modules: GetUsersModule[];
  permissions: GetUsersPermissions;
}

interface GetUsersModule {
  id: string;
  orgId: string;
  name: string;
  access: boolean;
  groupId: string;
  subModules: GetUsersSubModule[];
}

interface GetUsersSubModule {
  id: string;
  orgId: string;
  name: string;
  access: boolean;
  moduleId: string;
}

interface GetUsersPermissions {
  id: string;
  orgId: string;
  view: boolean;
  edit: boolean;
  approve: boolean;
  disable: boolean;
}

interface GetUsersNode {
  id: string;
  orgId: string;
  name: string;
  parentId?: string; // Optional field for root nodes
  nodeInfo: GetUsersNodeInfo;
  nodesTree: GetUsersNode[];
}

interface GetUsersNodeInfo {
  id: string;
  nodeId: string;
  regionId?: string; // Optional field
  name: string;
  phoneNo: string;
  email: string;
  contactPerson: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  type: string;
  bhubId?: string; // Optional field
  serialNo?: string; // Optional field
  status?: boolean; // Optional field
  voltage?: string; // Optional field
  description?: string; // Optional field
  latitude?: string; // Optional field
  longitude?: string; // Optional field
}

export interface CreateUserPayload {
  user: {
    firstname: string;
    lastname: string;
    email: string;
    nodeId: string;
    password: string;
  };
  groupId: string;
}
