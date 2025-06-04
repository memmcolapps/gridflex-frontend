import axios from "axios";
import { toast } from "sonner";
import { handleApiError } from "@/utils/error-handler";
import { env } from "@/env";

export interface NodeInfo {
  id: string;
  nodeId: string;
  regionId?: string;
  bhubId?: string;
  name: string;
  phoneNo: string;
  email: string;
  contactPerson: string;
  address: string;
  serialNo?: string;
  status?: boolean;
  voltage?: string;
  description?: string;
  latitude?: string;
  longitude?: string;
  createdAt: string;
  updatedAt: string;
  // Add 'type' as it's present in your responseData
  type?: string;
}

export interface Node {
  id: string;
  orgId: string;
  name: string;
  parentId?: string;
  nodeInfo?: NodeInfo; // nodeInfo can be optional based on your response structure for some nodes
  nodesTree?: Node[]; // This is the crucial addition for nested nodes
}

interface OrganizationResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: Node[];
}

const API_URL = env.NEXT_PUBLIC_BASE_URL;
const CUSTOM_HEADER = env.NEXT_PUBLIC_CUSTOM_HEADER;

export async function fetchOrganizationNodes(): Promise<Node[]> {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await axios.get<OrganizationResponse>(
      `${API_URL}/node/service/all-nodes`,
      {
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data.responsecode === "000") {
      return response.data.responsedata;
    } else {
      throw new Error(
        response.data.responsedesc ?? "Failed to fetch organization nodes",
      );
    }
  } catch (error) {
    const apiError = handleApiError(error);
    toast.error(apiError.message);
    return [];
  }
}
