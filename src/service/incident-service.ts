import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

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
