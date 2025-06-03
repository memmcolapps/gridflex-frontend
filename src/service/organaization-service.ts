import axios from "axios";
import { toast } from "sonner";
import { handleApiError } from "@/utils/error-handler";
import { env } from "@/env";
// Define FormData type here if the import is missing or incorrect
export interface FormData {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  contactPerson: string;
  address: string;
  serialNo?: string;
  assetId?: string;
  status?: string;
  voltage?: string;
  description?: string;
  latitude?: string;
  longitude?: string;
}

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

export async function updateNode(nodeId: string, data: FormData): Promise<void> {
  try {
    const token = localStorage.getItem("auth_token");
    const payload = {
      name: data.name,
      nodeId: data.id,
      phoneNo: data.phoneNumber,
      email: data.email,
      contactPerson: data.contactPerson,
      address: data.address,
      serialNo: data.serialNo ?? undefined,
      assetId: data.assetId ?? undefined,
      status: data.status ? data.status === "Active" : undefined,
      voltage: data.voltage ?? undefined,
      description: data.description ?? undefined,
      latitude: data.latitude ?? undefined,
      longitude: data.longitude ?? undefined,
    };

    const response = await axios.put(
      `${API_URL}/node/service/${nodeId}`,
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
      throw new Error(
        response.data.responsedesc ?? "Failed to update node",
      );
    }
  } catch (error) {
    const apiError = handleApiError(error);
    toast.error(apiError.message);
    throw apiError;
  }
}

export async function addNode(data: { name: string; nodeType: string; data: FormData }): Promise<void> {
  try {
    const token = localStorage.getItem("auth_token");
    const payload = {
      name: data.name,
      type: data.nodeType,
      nodeId: data.data.id ?? undefined,
      phoneNo: data.data.phoneNumber,
      email: data.data.email,
      contactPerson: data.data.contactPerson,
      address: data.data.address,
      serialNo: data.data.serialNo ?? undefined,
      assetId: data.data.assetId ?? undefined,
      status: data.data.status ? data.data.status === "Active" : undefined,
      voltage: data.data.voltage ?? undefined,
      description: data.data.description ?? undefined,
      latitude: data.data.latitude ?? undefined,
      longitude: data.data.longitude ?? undefined,
    };

    const response = await axios.post(
      `${API_URL}/node/service`,
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
      throw new Error(
        response.data.responsedesc ?? "Failed to add node",
      );
    }
  } catch (error) {
    const apiError = handleApiError(error);
    toast.error(apiError.message);
    throw apiError;
  }
}