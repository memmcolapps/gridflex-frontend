import { env } from "@/env";
import { handleApiError } from "error";
import { axiosInstance } from "@/lib/axios";
import type {
  ProfileEventsApiResponse,
  EventsApiResponse,
  GetEventsParams,
  ProfilesApiResponse,
  GetProfilesParams,
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

export async function getEvents({
  page,
  size,
  startDate,
  endDate,
  meterNumber,
  eventTypeName,
  model,
  search,
  node,
}: GetEventsParams): Promise<EventsApiResponse> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("size", String(size));
    params.append("startDate", startDate);
    params.append("endDate", endDate);
    params.append("meterNumber", meterNumber);
    params.append("eventTypeName", eventTypeName);
    params.append("model", model);
    params.append("search", search);
    params.append("node", node);

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
  search,
  node,
}: GetProfilesParams): Promise<ProfilesApiResponse> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("size", String(size));
    params.append("startDate", startDate);
    params.append("endDate", endDate);
    params.append("meterNumber", meterNumber);
    params.append("profile", profile);
    params.append("model", model);
    params.append("search", search);
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