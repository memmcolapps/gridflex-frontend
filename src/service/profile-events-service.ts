import { env } from "@/env";
import { handleApiError } from "error";
import { axiosInstance } from "@/lib/axios";
import type {
  ProfileEventsApiResponse,
  EventsApiResponse,
  GetEventsParams,
  ProfilesApiResponse,
  GetProfilesParams,
  EventNameApiResponse,
  ProfileNameApiResponse,
  ModuleAccessApiResponse,
} from "@/types/profile-events";

const API_URL = env.NEXT_PUBLIC_BASE_URL;
const CUSTOM_HEADER = env.NEXT_PUBLIC_CUSTOM_HEADER;

export async function getProfileEventsData(): Promise<ProfileEventsApiResponse> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const response = await axiosInstance.get(`${API_URL}/hes/service/model`, {
      headers: {
        "Content-Type": "application/json",
        custom: CUSTOM_HEADER,
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.responsecode !== "000") {
      throw new Error(
        response.data.responsedesc ?? "Failed to fetch profile events data.",
      );
    }

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function getEventNames(): Promise<EventNameApiResponse> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) throw new Error("Authentication token not found.");

    const response = await axiosInstance.get(
      `${API_URL}/hes/service/profile-event-name`,
      {
        params: { type: "event" },
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data.responsecode !== "000") {
      throw new Error(
        response.data.responsedesc ?? "Failed to fetch event names.",
      );
    }

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function getProfileNames(): Promise<ProfileNameApiResponse> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) throw new Error("Authentication token not found.");

    const response = await axiosInstance.get(
      `${API_URL}/hes/service/profile-event-name`,
      {
        params: { type: "profile" },
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data.responsecode !== "000") {
      throw new Error(
        response.data.responsedesc ?? "Failed to fetch profile names.",
      );
    }

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}


export async function getModuleAccess(): Promise<ModuleAccessApiResponse> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) throw new Error("Authentication token not found.");

    const response = await axiosInstance.get(
      `${API_URL}/user/service/module-access`,
      {
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.responsecode !== "000") {
      throw new Error(
        response.data.responsedesc ?? "Failed to fetch module access."
      );
    }

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function getEvents({
  page,
  size,
  startDate,
  endDate,
  meterNumber,
  eventTypeName,
  model,
  node,
  eventTypeId,
}: GetEventsParams): Promise<EventsApiResponse> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const params = new URLSearchParams();
    // API uses 0-based page index
    params.append("page", String(page));
    params.append("size", String(size));
    params.append("startDate", startDate);
    params.append("endDate", endDate);
    params.append("meterNumber", meterNumber);
    // params.append("eventTypeName", eventTypeName);
    params.append("model", model);
    params.append("node", node);
    params.append("eventTypeId", eventTypeId ?? ""); 

    const response = await axiosInstance.get(`${API_URL}/hes/service/event`, {
      params,
      headers: {
        "Content-Type": "application/json",
        custom: CUSTOM_HEADER,
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.responsecode !== "000") {
      throw new Error(
        response.data.responsedesc ?? "Failed to fetch events data.",
      );
    }

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function getProfiles({
  page,
  size,
  startDate,
  endDate,
  meterNumber,
  profile,
  model,
  // search,
  node,
}: GetProfilesParams): Promise<ProfilesApiResponse> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const params = new URLSearchParams();
    // API uses 0-based page index
    params.append("page", String(page));
    params.append("size", String(size));
    params.append("startDate", startDate);
    params.append("endDate", endDate);
    params.append("meterNumber", meterNumber);
    params.append("profile", profile);
    params.append("model", model);
    // params.append("search", search);
    params.append("node", node);

    const response = await axiosInstance.get(`${API_URL}/hes/service/profile`, {
      params,
      headers: {
        "Content-Type": "application/json",
        custom: CUSTOM_HEADER,
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.responsecode !== "000") {
      throw new Error(
        response.data.responsedesc ?? "Failed to fetch profiles data.",
      );
    }

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}
