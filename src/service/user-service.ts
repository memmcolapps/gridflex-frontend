import axios from "axios";
import { env } from "@/env";
import { handleApiError } from "error";
import { Group } from "next/dist/shared/lib/router/utils/route-regex";

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
