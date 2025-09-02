interface SubModule {
  name: string;
  access: boolean;
}

interface Module {
  name: string;
  access: boolean;
  subModules: SubModule[];
}

interface Permission {
  view: boolean;
  edit: boolean;
  approve: boolean;
  disable: boolean;
}

export interface OrganizationAccessPayload {
  orgId: string;
  groupTitle: string;
  modules: Module[];
  permission: Permission;
}
