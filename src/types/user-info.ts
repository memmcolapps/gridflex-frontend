interface UserRole {
  roleId: number;
  operatorRole: string;
}

interface UserNode {
  id: number;
  name: string;
  parent_id: number | null;
}

export interface UserInfo {
  id: string;
  orgId: string;
  nodeId: string;
  firstname: string;
  lastname: string;
  email: string;
  status: boolean;
  active: boolean;
  lastActive: string;
  password: string;
  groups: {
    id: string;
    orgId: string;
    groupTitle: string;
    modules: Array<{
      id: string;
      orgId: string;
      name: string;
      access: boolean;
      groupId: string;
      subModules: Array<{
        id: string;
        orgId: string;
        name: string;
        access: boolean;
        moduleId: string;
      }>;
    }>;
    permissions: {
      id: string;
      orgId: string;
      view: boolean;
      edit: boolean;
      approve: boolean;
      disable: boolean;
    };
  };
  business: {
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
  };
  nodes: Array<{
    id: string;
    org_id: string;
    name: string;
    parent_id: string | null;
  }>;
  createdAt: string;
  updatedAt: string;
}
