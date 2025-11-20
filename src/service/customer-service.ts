// service/customer-service.ts

import axios from "axios";
import { env } from "@/env";
import { handleApiError } from "error";
import {
  type Customer,
  type CustomersApiResponse,
  type AddCustomerPayload,
  type UpdateCustomerPayload,
  type CustomerMutationResponse,
  type BlockCustomerPayload,
} from "@/types/customer-types";
import { axiosInstance } from "@/lib/axios";

interface Tariff {
  name: string;
  org_id: string;
  tariff_rate: string;
  band_id: string;
  band: {
    id: string;
    orgId: string;
    name: string;
    hour: string;
    approveStatus: string;
    createdAt: string;
    updatedAt: string;
  };
  created_at: string;
  updated_at: string;
}

export interface FetchCustomerResponse {
  GeneratedVirtualMeterNo: string;
  GeneratedAccountNumber: string;
  customer: Customer;
  tariffs: Tariff[];
}

const API_URL = env.NEXT_PUBLIC_BASE_URL;
const CUSTOM_HEADER = env.NEXT_PUBLIC_CUSTOM_HEADER;

export interface GetCustomersParams {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortBy: keyof Customer | null;
  sortDirection: "asc" | "desc" | null;
}

export async function getCustomers({
  page,
  pageSize,
  searchTerm,
  sortBy,
  sortDirection,
}: GetCustomersParams): Promise<CustomersApiResponse> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("pageSize", String(pageSize));
    if (searchTerm) {
      params.append("search", searchTerm);
    }
    if (sortBy) {
      params.append("sortBy", sortBy);
      params.append("sortDirection", sortDirection ?? "asc");
    }

    const response = await axiosInstance.get(
      `${API_URL}/customer/service/all`,
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
      throw new Error(
        response.data.responsedesc ?? "Failed to fetch customer data.",
      );
    }

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function addCustomer(
  customerData: AddCustomerPayload,
): Promise<CustomerMutationResponse> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const response = await axiosInstance.post(
      `${API_URL}/customer/service/create`,
      customerData,
      {
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data.responsecode !== "000") {
      throw new Error(response.data.responsedesc ?? "Failed to add customer.");
    }

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function updateCustomer(
  customerData: UpdateCustomerPayload,
): Promise<CustomerMutationResponse> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const response = await axiosInstance.put(
      `${API_URL}/customer/service/update`,
      customerData,
      {
        headers: {
          "Content-Type": "application/json",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data.responsecode !== "000") {
      throw new Error(
        response.data.responsedesc ?? "Failed to update customer.",
      );
    }

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function blockCustomer({
  customerId,
  reason,
}: BlockCustomerPayload): Promise<CustomerMutationResponse> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const formData = new FormData();
    formData.append("customerId", customerId);
    formData.append("status", "block");
    formData.append("reason", reason);

    const response = await axiosInstance.patch(
      `${API_URL}/customer/service/change-state`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Use multipart/form-data for FormData
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data.responsecode !== "000") {
      throw new Error(
        response.data.responsedesc ?? "Failed to block customer.",
      );
    }

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function bulkUploadCustomers(
  file: File,
): Promise<CustomerMutationResponse> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post(
      `${API_URL}/customer/service/bulk-upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data.responsecode !== "000") {
      throw new Error(
        response.data.responsedesc ?? "Failed to bulk upload customers.",
      );
    }

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function downloadCustomerCsvTemplate(): Promise<void> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const response = await axiosInstance.get(
      `${API_URL}/customer/service/download/template/csv`,
      {
        responseType: "blob",
        headers: {
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    // Create a blob link to download the file
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "customer_template.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function downloadCustomerExcelTemplate(): Promise<void> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const response = await axiosInstance.get(
      `${API_URL}/customer/service/download/template/excel`,
      {
        responseType: "blob",
        headers: {
          custom: CUSTOM_HEADER,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    // Create a blob link to download the file
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "customer_template.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}
/**
 * Fetches a single customer record by customer ID.
 * Endpoint: /api/meter/service/customer?customerId={id}
 * @param customerId The ID of the customer to fetch.
 * @returns A promise that resolves to the Customer record.
 */
export const fetchCustomerRecord = async (
  customerId: string,
): Promise<FetchCustomerResponse> => {
  if (!customerId) {
    // This should ideally not happen if the query is disabled correctly,
    // but serves as a safeguard.
    throw new Error("Customer ID is required for this search.");
  }

  const token = localStorage.getItem("auth_token");
  if (!token) {
    throw new Error("Authentication token not found.");
  }

  // The backend expects customerId in URL parameters (query string) for a GET request.
  const url = `${API_URL}/meter/service/customer?customerId=${customerId}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      custom: CUSTOM_HEADER,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorBody = await response
      .json()
      .catch(() => ({ responsedesc: "Unknown error" }));
    // Throw error for TanStack Query to catch
    throw new Error(
      errorBody.responsedesc ?? "Failed to fetch customer record.",
    );
  }

  // Assuming the successful API response structure is: { responsedata: FetchCustomerResponse }
  const result: { responsedata: FetchCustomerResponse } = await response.json();

  return result.responsedata;
};
