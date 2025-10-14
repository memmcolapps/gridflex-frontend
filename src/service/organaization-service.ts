import axios from "axios";
import { env } from "@/env";
import { handleApiError } from "error";
import type {
  CreateOrgResponse,
  CreateRegionBhubServiceCenterPayload,
  CreateSubstationTransfomerFeederPayload,
  UpdateRegionBhubServiceCenterPayload,
  UpdateSubstationTransfomerFeederPayload,
} from "@/types/organization-types";

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

export const createRegionBhubServiceCenter = async (
  payload: CreateRegionBhubServiceCenterPayload,
): Promise<{ success: boolean } | { success: boolean; error: string }> => {
  try {
    const token = localStorage.getItem("auth_token");
    const response = await axios.post<CreateOrgResponse>(
      `${API_URL}/node/service/create/node/region-bhub-service-center`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          custom: CUSTOM_HEADER,
        },
      },
    );

    if (response.data.responsecode !== "000") {
      return {
        success: false,
        error: response.data.responsedesc,
      };
    }

    return {
      success: true,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: handleApiError(error),
    };
  }
};

export const updateRegionBhubServiceCenter = async (
  payload: UpdateRegionBhubServiceCenterPayload,
): Promise<{ success: boolean } | { success: boolean; error: string }> => {
  try {
    const token = localStorage.getItem("auth_token");
    const response = await axios.put<CreateOrgResponse>(
      `${API_URL}/node/service/update/node/region-bhub-service-center`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          custom: CUSTOM_HEADER,
        },
      },
    );

    if (response.data.responsecode !== "000") {
      return {
        success: false,
        error: response.data.responsedesc,
      };
    }

    return {
      success: true,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: handleApiError(error),
    };
  }
};

export const createSubstationTransfomerFeeder = async (
  payload: CreateSubstationTransfomerFeederPayload,
): Promise<{ success: boolean } | { success: boolean; error: string }> => {
  try {
    const token = localStorage.getItem("auth_token");
    const response = await axios.post<CreateOrgResponse>(
      `${API_URL}/node/service/create/node/substation-transformer-feeder-line`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          custom: CUSTOM_HEADER,
        },
      },
    );

    if (response.data.responsecode !== "000") {
      return {
        success: false,
        error: response.data.responsedesc,
      };
    }

    return {
      success: true,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: handleApiError(error),
    };
  }
};

export const updateSubstationTransfomerFeeder = async (
  payload: UpdateSubstationTransfomerFeederPayload,
): Promise<{ success: boolean } | { success: boolean; error: string }> => {
  try {
    const token = localStorage.getItem("auth_token");
    const response = await axios.put<CreateOrgResponse>(
      `${API_URL}/node/service/update/node/substation-transformer-feeder-line`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          custom: CUSTOM_HEADER,
        },
      },
    );

    if (response.data.responsecode !== "000") {
      return {
        success: false,
        error: response.data.responsedesc,
      };
    }

    return {
      success: true,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: handleApiError(error),
    };
  }
};
