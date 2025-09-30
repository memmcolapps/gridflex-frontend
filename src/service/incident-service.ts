import axios from "axios";
import { handleApiError } from "error";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export interface Org {
  businessName: string;
  createdAt: string;
  updatedAt: string
}

export interface Client {
  firstname: string;
  lastname: string;
  createdAt: string;
  updatedAt: string
}

export interface IncidentReport {
  responsecode: string;
  responsedesc: string;
  responsedata: {
    totalData: number;
    data: Incident[];
  };
}

export interface Incident {
  id: string;
  type?: string;
  message: string;
  createdAt: string;
  status: boolean;
  organization: Org;
  user: Client;
}


export interface IncidentResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: IncidentMessage;
}

export interface IncidentMessage {
  message: string;
}

export const createMessage = async (
  data: IncidentMessage
): Promise<IncidentResponse> => {
  
    const token = localStorage.getItem("auth_token");

  const response = await axios.post<IncidentResponse>(
    `${API_URL}/audit-log/service/incident/report`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getIncidentReports = async (
  page?: number,
  size?: number
): Promise<{
  success: boolean;
  data?: IncidentReport['responsedata'];
  error?: string;
}> => {
  try {
    const token = localStorage.getItem("auth_token");
    const response = await axios.get<IncidentReport>(
      `${API_URL}/audit-log/service/incident/report/get`,
      {
        params: { page, size },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.responsecode !== "000") {
      return { success: false, error: response.data.responsedesc };
    }

    return {
      success: true,
      data: response.data.responsedata
    };
  } catch (error: unknown) {
    const errorResult = handleApiError(error, "incidentReport");
    return { success: false, error: errorResult };
  }
};
