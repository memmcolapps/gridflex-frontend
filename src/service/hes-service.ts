import type {
  CreateSchedulePayload,
  HierarchyResponse,
  ProfileEvent,
  ProfileEventsResponse,
  ResetCronPayload,
  ScheduleListResponse,
} from "@/types/hes";
import { env } from "@/env";
import { axiosInstance } from "@/lib/axios";
import { handleApiError } from "@/utils/error-handler";

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
  meters: { meterNumber: string }[];
  obisCode: { code: string }[];
}

export const triggerRealtimeStream = async (
  payload: RealtimeStreamRequest,
): Promise<
  { success: true; data: unknown } | { success: false; error: string }
> => {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) return { success: false, error: "Auth token not found" };

    const response = await axiosInstance.post("/hes/service/stream", payload, {
      headers: {
        "Content-Type": "application/json",
        custom: CUSTOM_HEADER,
        Authorization: `Bearer ${token}`,
      },
    });

    return { success: true, data: response.data };
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
