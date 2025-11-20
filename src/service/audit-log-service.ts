import axios from "axios";
import { env } from "@/env";
import { handleApiError } from "error";
import { axiosInstance } from "@/lib/axios";

const API_URL = env.NEXT_PUBLIC_BASE_URL;
const CUSTOM_HEADER = env.NEXT_PUBLIC_CUSTOM_HEADER;

interface AuditLogListResponse {
  responsecode: string;
  responsedesc: string;
  responsedata: AuditLogRes;
}

interface AuditLogRes {
  totalData: number;
  data: AuditLog[];
  size: number;
  page: number;
}

export interface AuditLog {
  id: string;
  type: string;
  username: string;
  email: string;
  groupPermission: string;
  activity: string;
  userAgent: string;
  ipAddress: string;
  timeStamp: string;
}

export async function fetchAuditLogs(
  page?: number,
  size?: number,
): Promise<
  { success: true; data: AuditLogRes } | { success: false; error: string }
> {
  try {
    const token = localStorage.getItem("auth_token");

    page = page ?? 0;
    size = size ?? 10;

    const response = await axiosInstance.get<AuditLogListResponse>(
      `${API_URL}/audit-log/service/all?page=${page}&size=${size}`,
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
        error: response.data.responsedesc || "Failed to fetch audit logs",
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
