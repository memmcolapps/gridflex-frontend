import axios from "axios";
import { env } from "@/env";
import { handleApiError } from "error";

export interface NodeInfo {
  id: string;
  nodeId?: string;
  regionId?: string;
  bhubId?: string;
  name: string;
  phoneNo: string;
  email: string;
  contactPerson: string;
  address: string;
  serialNo?: string;
  assetId?: string;
  status?: boolean;
  voltage?: string;
  description?: string;
  latitude?: string;
  longitude?: string;
  createdAt: string;
  updatedAt: string;
  type?: string;
}

export interface Node {
  id: string;
  orgId: string;
  name: string;
  parentId?: string;
  nodeInfo?: NodeInfo;
  nodesTree?: Node[];
}

interface OrganizationResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: Node[];
}

const API_URL = env.NEXT_PUBLIC_BASE_URL;
const CUSTOM_HEADER = env.NEXT_PUBLIC_CUSTOM_HEADER;

export async function fetchOrganizationNodes(): Promise<
  { success: true; data: Node[] } | { success: false; error: string }
> {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await axios.get<OrganizationResponse>(
      `${API_URL}/node/service/all`,
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
          response.data.responsedesc || "Failed to fetch organization nodes",
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
