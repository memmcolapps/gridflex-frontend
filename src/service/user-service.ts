import axios from "axios";
import { env } from "@/env";
import { handleApiError } from "error";
import type {
  CreateGroupPermissionPayload,
  UpdateGroupPermissionPayload,
} from "@/types/group-permission-user";
import {
  type CreateUserPayload,
  type GetUsersApiResponse,
  type GetUsersResponseData,
} from "@/types/users-groups";

const API_URL = env.NEXT_PUBLIC_BASE_URL;
const CUSTOM_HEADER = env.NEXT_PUBLIC_CUSTOM_HEADER;

interface GroupPermissionResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: GroupPermission[];
}

export interface GroupPermission {
  id: string;
  groupTitle: string;
  orgId: string;
  permissions: {
    view: boolean;
    edit: boolean;
    approve: boolean;
    disable: boolean;
    id: string;
    orgId: string;
  };
  modules: Array<{
    id: string;
    name: string;
    access: boolean;
    subModules: Array<{ id: string; name: string; access: boolean }>;
  }>;
}

export async function getGroupPermission(): Promise<
  { success: true; data: GroupPermission[] } | { success: false; error: string }
> {
  try {
    const token = localStorage.getItem("auth_token");
    const response = await axios.get<GroupPermissionResponse>(
      `${API_URL}/user/service/groups`,
      {
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (response.data.responsecode !== "000") {
      return {
        success: false,
        error: response.data.responsedesc ?? "Failed to fetch tariffs",
      };
    }
    return {
      success: true,
      data: response.data.responsedata,
    };
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error),
    };
  }
}

export async function createGroupPermission(
  payload: CreateGroupPermissionPayload,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const token = localStorage.getItem("auth_token");
    const response = await axios.post<GroupPermissionResponse>(
      `${API_URL}/user/service/create/group-permission`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (response.data.responsecode !== "000") {
      return {
        success: false,
        error:
          response.data.responsedesc ?? "Failed to create group permission",
      };
    }
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error),
    };
  }
}

export async function updateGroupPermission(
  groupId: string,
  payload: UpdateGroupPermissionPayload,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const token = localStorage.getItem("auth_token");
    const response = await axios.put<GroupPermissionResponse>(
      `${API_URL}/user/service/update/group-permission`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (response.data.responsecode !== "000") {
      return {
        success: false,
        error:
          response.data.responsedesc ?? "Failed to update group permission",
      };
    }
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error),
    };
  }
}

export async function updateGroupPermissionField(
  groupId: string,
  permissionType: "view" | "edit" | "approve" | "disable",
  value: boolean,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const token = localStorage.getItem("auth_token");
    const response = await axios.patch<GroupPermissionResponse>(
      `${API_URL}/user/service/update/group-permission`,
      {
        permissionType,
        value,
      },
      {
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (response.data.responsecode !== "000") {
      return {
        success: false,
        error: response.data.responsedesc ?? "Failed to update permission",
      };
    }
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error),
    };
  }
}

export async function deactivateOrActivateGroupPermission(
  groupId: string,
  status: boolean,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const token = localStorage.getItem("auth_token");
    const response = await axios.patch<GroupPermissionResponse>(
      `${API_URL}/user/service/group/change-state?groupId=${groupId}&status=${status}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => status < 500,
      },
    );

    if (response.data.responsecode === "060") {
      return {
        success: false,
        error: "Cannot deactivate a group permission with users assigned",
      };
    }
    if (response.data.responsecode !== "000") {
      return {
        success: false,
        error:
          response.data.responsedesc ?? "Failed to deactivate group permission",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error),
    };
  }
}

export async function getUsers(): Promise<
  | { success: true; data: GetUsersResponseData }
  | { success: false; error: string }
> {
  try {
    const token = localStorage.getItem("auth_token");
    const response = await axios.get<GetUsersApiResponse>(
      `${API_URL}/user/service/all`,
      {
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (response.data.responsecode !== "000") {
      return {
        success: false,
        error: response.data.responsedesc ?? "Failed to fetch users",
      };
    }
    return {
      success: true,
      data: response.data.responsedata,
    };
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error),
    };
  }
}

export async function createUser(
  user: CreateUserPayload,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const token = localStorage.getItem("auth_token");
    const response = await axios.post(`${API_URL}/user/service/create`, user, {
      headers: {
        "Content-Type": "application/json",
        custom: CUSTOM_HEADER,
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data.responsecode !== "000") {
      return {
        success: false,
        error: response.data.responsedesc ?? "Failed to create user",
      };
    }
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error),
    };
  }
}

export interface EditUserPayload {
  user: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    nodeId: string;
  };
  groupId: string;
}

export async function editUser(
  user: EditUserPayload,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const token = localStorage.getItem("auth_token");
    const response = await axios.put(
      `${API_URL}/user/service/group/update`,
      user,
      {
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (response.data.responsecode !== "000") {
      return {
        success: false,
        error: response.data.responsedesc ?? "Failed to edit user",
      };
    }
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error),
    };
  }
}

export async function activateOrDeactivateUser(
  status: boolean,
  userId: string,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await axios.patch(
      `${API_URL}/user/service/change-state`,
      { status, id: userId },
      {
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (response.data.responsecode !== "000") {
      return {
        success: false,
        error: response.data.responsedesc ?? "Failed to update permission",
      };
    }
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error),
    };
  }
}
