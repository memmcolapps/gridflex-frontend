import { env } from "@/env";
import { axiosInstance } from "@/lib/axios";
import { type SetDateTimePayload, type SetAPNPayload, type SetCTPTRatioPayload, type SetIpPortPayload } from "@/types/configure-meter";
import { handleApiError } from "@/utils/error-handler";

const API_URL = env.NEXT_PUBLIC_BASE_URL;
const CUSTOM_HEADER = env.NEXT_PUBLIC_CUSTOM_HEADER;

export async function setCTPTRatio(
  data: SetCTPTRatioPayload,
): Promise<{ responsecode: string; responsedesc: string }> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const { serials, ctNumerator, ctDenominator, ptNumerator, ptDenominator } = data;

    const response = await axiosInstance.post(
      `${API_URL}/hes/service/dlms/set-ctpt`,
      null, 
      {
        params: { serials, ctNumerator, ctDenominator, ptNumerator, ptDenominator },
        headers: {
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (
  response.data.responsecode !== "000" &&
  response.data.responsecode !== "131" 
) {
      throw new Error(
        response.data.responsedesc ?? "Failed to configure CT & VT ratio.",
      );
    }

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error).message);
  }
}

export async function setAPN(
  data: SetAPNPayload,
): Promise<{ responsecode: string; responsedesc: string }> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const { serials, apn } = data;

    const response = await axiosInstance.post(
      `${API_URL}/hes/service/dlms/set-apn`,
      null, 
      {
        params: { serials, apn },
        headers: {
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (
  response.data.responsecode !== "000" &&
  response.data.responsecode !== "131" 
) {
      throw new Error(
        response.data.responsedesc ?? "Failed to configure APN.",
      );
    }

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error).message);
  }
}

export async function setDateTime(
  data: SetDateTimePayload,
): Promise<{ responsecode: string; responsedesc: string }> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const { serials, dateTime } = data;

    const response = await axiosInstance.post(
      `${API_URL}/hes/service/dlms/set-clock`,
      null, 
      {
        params: { serials, dateTime },
        headers: {
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (
  response.data.responsecode !== "000" &&
  response.data.responsecode !== "131" 
) {
      throw new Error(
        response.data.responsedesc ?? "Failed to configure Date and Time.",
      );
    }

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error).message);
  }
}

export async function setIpPort(
  data: SetIpPortPayload,
): Promise<{ responsecode: string; responsedesc: string }> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const { serials, ip, port } = data;

    const response = await axiosInstance.post(
      `${API_URL}/hes/service/dlms/set-ip-port`,
      null, 
      {
        params: { serials, ip, port },
        headers: {
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (
  response.data.responsecode !== "000" &&
  response.data.responsecode !== "131" 
) {
      throw new Error(
        response.data.responsedesc ?? "Failed to configure Ip Address.",
      );
    }

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error).message);
  }
}