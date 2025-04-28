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
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  contact: string;
  ustate: boolean;
  permission: boolean;
  active: boolean;
  roleId: number;
  hierarchy: number;
  roles: UserRole[];
  nodes: UserNode[];
  createdAt: string;
  updatedAt: string;
}
