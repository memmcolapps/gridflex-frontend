import type {
  CreateSchedulePayload,
  HierarchyResponse,
  ObisDataResponse,
  OnlineMeterPayload,
  OnlineMetersResponse,
  ProfileEvent,
  ProfileEventsResponse,
  ResetCronPayload,
  ScheduleListResponse,
} from "@/types/hes";
import { env } from "@/env";
import { axiosInstance } from "@/lib/axios";
import { handleApiError } from "@/utils/error-handler";
import { fetchEventSource } from "@microsoft/fetch-event-source";

export const fetchHierarchyData = async (): Promise<HierarchyResponse> => {
  const baseUrl = env.NEXT_PUBLIC_BASE_URL;
  const token = localStorage.getItem("auth_token");

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not configured");
  }

  if (!token) {
    throw new Error("No authorization token found");
  }

  const response = await fetch(`${baseUrl}/hes/service/model`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch hierarchy data");
  }

  return response.json();
};

const CUSTOM_HEADER = env.NEXT_PUBLIC_CUSTOM_HEADER;

export interface RealtimeStreamRequest {
  meterType: string;
  meters: string[];
  obisString: string[];
}

export interface RealtimeReadingEvent {
  statuscode?: number;
  meterModel?: string | null;
  meterNo?: string | null;
  obisString?: string | null;
  timestamp?: string;
  desc?: string | null;
  value?: unknown;
  statusmessage?: string;
  elapsedMs?: number;
  batch?: boolean;
  [key: string]: unknown;
}

export interface RealtimeStreamCallbacks {
  onEvent?: (eventName: string, data: RealtimeReadingEvent) => void;
  onReading?: (data: RealtimeReadingEvent) => void;
  onCompleted?: (data: RealtimeReadingEvent) => void;
  onWarning?: (data: RealtimeReadingEvent) => void;
}

export const triggerRealtimeStream = async (
  payload: RealtimeStreamRequest,
  callbacks: RealtimeStreamCallbacks = {},
): Promise<
  { success: true; data: unknown } | { success: false; error: string }
> => {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) return { success: false, error: "Auth token not found" };
    if (!env.NEXT_PUBLIC_BASE_URL) {
      return {
        success: false,
        error: "NEXT_PUBLIC_BASE_URL is not configured",
      };
    }

    const events: RealtimeReadingEvent[] = [];

    await fetchEventSource(`${env.NEXT_PUBLIC_BASE_URL}/hes/service/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        custom: CUSTOM_HEADER ?? "",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      openWhenHidden: true,
      onopen: async (response) => {
        if (!response.ok) {
          throw new Error(
            `Realtime stream failed with status ${response.status}`,
          );
        }
      },
      onmessage: (event) => {
        if (!event.data) return;
        const parsedData = JSON.parse(event.data) as RealtimeReadingEvent;
        const eventName = event.event || "message";
        events.push(parsedData);
        callbacks.onEvent?.(eventName, parsedData);

        if (
          eventName === "reading" ||
          parsedData.meterNo ||
          parsedData.obisString
        ) {
          callbacks.onReading?.(parsedData);
        } else if (eventName === "completed") {
          callbacks.onCompleted?.(parsedData);
        } else if (eventName === "warning") {
          callbacks.onWarning?.(parsedData);
        }
      },
    });

    return { success: true, data: events };
  } catch (error) {
    return { success: false, error: handleApiError(error).message };
  }
};

export const fetchScheduleData = async (
  page: number,
  size: number,
  search?: string,
): Promise<
  | { success: true; data: ScheduleListResponse["responsedata"] }
  | { success: false; error: string }
> => {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) return { success: false, error: "Auth token not found" };

    const params: Record<string, string | number> = { page, size };
    if (search) params.search = search;

    const response = await axiosInstance.get<ScheduleListResponse>(
      "/hes/service/data/schedule",
      {
        params,
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data.responsecode !== "000") {
      return { success: false, error: response.data.responsedesc };
    }
    return { success: true, data: response.data.responsedata };
  } catch (error) {
    return { success: false, error: handleApiError(error).message };
  }
};

export const createSchedule = async (
  payload: CreateSchedulePayload,
): Promise<{ success: true } | { success: false; error: string }> => {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) return { success: false, error: "Auth token not found" };

    const response = await axiosInstance.post(
      "/hes/service/set/schedule",
      null,
      {
        params: {
          jobGroup: payload.jobGroup,
          jobName: payload.jobName,
          timeInterval: payload.repeatTime,
          unit: payload.unit,
        },
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data.responsecode !== "000" && response.status !== 200) {
      return { success: false, error: response.data.responsedesc };
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: handleApiError(error).message };
  }
};

export const fetchProfileEvents = async (): Promise<
  { success: true; data: ProfileEvent[] } | { success: false; error: string }
> => {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) return { success: false, error: "Auth token not found" };

    const response = await axiosInstance.get<ProfileEventsResponse>(
      "/hes/service/profile-events",
      {
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data.responsecode !== "000") {
      return { success: false, error: response.data.responsedesc };
    }

    return { success: true, data: response.data.responsedata };
  } catch (error) {
    return { success: false, error: handleApiError(error).message };
  }
};

export const resetCronSchedule = async (
  payload: ResetCronPayload,
): Promise<{ success: true } | { success: false; error: string }> => {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) return { success: false, error: "Auth token not found" };

    const response = await axiosInstance.post(
      "/hes/service/set/cron",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data.responsecode !== "000" && response.status !== 200) {
      return { success: false, error: response.data.responsedesc };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: handleApiError(error).message };
  }
};

export const getOnlineMeters = async (
  type: 'MD' | 'Non-MD',
): Promise <
  { success: true; data: OnlineMeterPayload[] } | { success: false; error: string }
> => {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) return { success: false, error: "Auth token not found" };

    const response = await axiosInstance.get<OnlineMetersResponse>(
      `/hes/service/online-meter`,
      {
        headers: {
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
        params: {
            type
          }
      },
    );

    if (response.data.responsecode !== "000") {
      return { success: false, error: response.data.responsedesc };
    }

    return { success: true, data: response.data.responsedata };
  } catch (error) {
    return { success: false, error: handleApiError(error).message };
  }
};

export const getObisData = async (
  type: 'MD' | 'Non-MD',
): Promise <
  { success: true; data: ObisDataResponse } | { success: false; error: string }
> => {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) return { success: false, error: "Auth token not found" };

    const response = await axiosInstance.get<ObisDataResponse>(
      `/hes/service/obis-data`,
      {
        headers: {
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
        params: { type },
      },
    );

    if (response.data.responsecode !== "000") {
      return { success: false, error: response.data.responsedesc };
    }

    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: handleApiError(error).message };
  }
};
