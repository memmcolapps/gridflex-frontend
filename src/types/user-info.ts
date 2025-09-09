// interface UserRole {
//   roleId: number;
//   operatorRole: string;
// }

// interface UserNode {
//   id: number;
//   name: string;
//   parent_id: number | null;
// }
export interface Permission {
  id: string;
  orgId: string;
  view: boolean;
  edit: boolean;
  approve: boolean;
  disable: boolean;
}

export interface SubModule {
  id: string;
  orgId: string;
  name: string;
  access: boolean;
  moduleId: string;
}

export interface Module {
  id: string;
  orgId: string;
  name: string;
  access: boolean;
  groupId: string;
  subModules: SubModule[];
}

export interface Group {
  id: string;
  orgId: string;
  groupTitle: string;
  modules: Module[];
  permissions: Permission;
}

export interface Business {
  phoneNumber: string;
  id: string;
  businessName: string;
  businessType: string;
  businessContact: string;
  registrationNumber: string;
  country: string;
  state: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Node {
  id: string;
  org_id: string;
  name: string;
  parent_id: string | null;
}

export interface UserInfo {
  id: string;
  orgId: string;
  nodeId: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  email: string;
  status: boolean;
  active: boolean;
  lastActive: string;
  password?: string;
  groups: Group;
  business: Business;
  nodes: Node[];
  createdAt: string;
  updatedAt: string;
}