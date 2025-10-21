interface SubModule {
  id: string;
  name: string;
  access: boolean;
}

interface Module {
  id: string;
  name: string;
  access: boolean;
  subModules: SubModule[];
}

interface Permission {
  id: string;
  view: boolean;
  edit: boolean;
  approve: boolean;
  disable: boolean;
}

export interface OrganizationAccessPayload {
  id: string;
  groupTitle: string;
  modules: Module[];
  permission: Permission;
}

export interface UpdateGroupPermissionPayload {
  id: string;
  groupTitle: string;
  modules: {
    id: string;
    name: string;
    access: boolean;
    subModules: {
      id: string;
      name: string;
      access: boolean;
    }[];
  }[];
  permission: {
    id: string;
    view: boolean;
    edit: boolean;
    approve: boolean;
    disable: boolean;
  };
}
