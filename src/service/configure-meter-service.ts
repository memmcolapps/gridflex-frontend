import { env } from "@/env";
import { axiosInstance } from "@/lib/axios";
import {
  type SetDateTimePayload,
  type SetAPNPayload,
  type SetCTPTRatioPayload,
  type SetIpPortPayload,
  type ConfigureResponse,
  type FetchMeterConfigParams,
  type MeterConfigResponse,
  type ReadMeterResponse,
  type ReadMeterPayload,
  type RelayControlPayload,
  type SetRelayModePayload,
  type SetTokenPayload,
  type SetTokenResponse,
} from "@/types/configure-meter";
import { handleApiError } from "@/utils/error-handler";

const API_URL = env.NEXT_PUBLIC_BASE_URL;
const CUSTOM_HEADER = env.NEXT_PUBLIC_CUSTOM_HEADER;

export async function fetchMeterConfigurations(
  params: FetchMeterConfigParams = {},
): Promise<MeterConfigResponse> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const { page = 0, size = 10 } = params;

    const response = await axiosInstance.get(
      `${API_URL}/hes/service/meter-configuration`,
      {
        params: { page, size },
        headers: {
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data: MeterConfigResponse = response.data;

    if (data.responsecode !== "000") {
      throw new Error(
        data.responsedesc ?? "Failed to fetch meter configurations.",
      );
    }

    return data;
  } catch (error) {
    throw new Error(handleApiError(error).message);
  }
}

export async function setCTPTRatio(
  data: SetCTPTRatioPayload,
): Promise<ConfigureResponse> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const { serial, ctNumerator, ctDenominator, ptNumerator, ptDenominator } =
      data;

    const response = await axiosInstance.post(
      `${API_URL}/hes/service/dlms/set-ctpt`,
      null,
      {
        params: {
          serial,
          ctNumerator,
          ctDenominator,
          ptNumerator,
          ptDenominator,
        },
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
): Promise<ConfigureResponse> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const { serial, apn } = data;

    const response = await axiosInstance.post(
      `${API_URL}/hes/service/dlms/set-apn`,
      null,
      {
        params: { serial, apn },
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
      throw new Error(response.data.responsedesc ?? "Failed to configure APN.");
    }

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error).message);
  }
}

export async function setDateTime(
  data: SetDateTimePayload,
): Promise<ConfigureResponse> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const { serial, dateTime } = data;

    const response = await axiosInstance.post(
      `${API_URL}/hes/service/dlms/set-clock`,
      null,
      {
        params: { serial, dateTime },
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
): Promise<ConfigureResponse> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const { serial, ip, port } = data;

    const response = await axiosInstance.post(
      `${API_URL}/hes/service/dlms/set-ip-port`,
      null,
      {
        params: { serial, ip, port },
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

export async function readMeter(
  data: ReadMeterPayload,               
): Promise<ReadMeterResponse> {        
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const { serial, type } = data;

    const response = await axiosInstance.get(
      `${API_URL}/hes/service/dlms/read-meter`,
      {
        params: { serial, type },
        headers: {
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data.responsecode !== "000") {
      throw new Error(response.data.responsedesc ?? "Meter cannot be read.");
    }

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error).message);
  }
}

export async function relayControl(
  data: RelayControlPayload,
): Promise<{
  responsecode: string;
  responsedesc: string;
  responsedata: {
    status: string;
    message: string;
    data?: { relayStatus?: string };
  };
}> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const { serial, state } = data;

    const response = await axiosInstance.post(
      `${API_URL}/hes/service/dlms/relay-control`,
      null,
      {
        params: { serial, state },
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
        response.data.responsedesc ?? "Failed to control relay.",
      );
    }

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error).message);
  }
}

export async function setRelayMode(
  data: SetRelayModePayload,
): Promise<ConfigureResponse> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const { serial, mode } = data;

    const response = await axiosInstance.post(
      `${API_URL}/hes/service/dlms/relay-mode`,
      null,
      {
        params: { serial, mode },
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
        response.data.responsedesc ?? "Failed to change relay mode.",
      );
    }

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error).message);
  }
}

export async function setToken(
  data: SetTokenPayload,
): Promise<SetTokenResponse> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const { serial, credit } = data;

    const response = await axiosInstance.post(
      `${API_URL}/hes/service/dlms/set-token`,
      null,
      {
        params: { serial, credit },
        headers: {
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data.responsecode !== "000") {
      throw new Error(
        response.data.responsedesc ?? "Failed to send token.",
      );
    }

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error).message);
  }
}