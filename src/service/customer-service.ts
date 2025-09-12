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

        const response = await axios.get(`${API_URL}/customer/service/all`, {
            params,
            headers: {
                "Content-Type": "application/json",
                custom: CUSTOM_HEADER,
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.responsecode !== "000") {
            throw new Error(response.data.responsedesc ?? "Failed to fetch customer data.");
        }

        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export async function addCustomer(customerData: AddCustomerPayload): Promise<CustomerMutationResponse> {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("Authentication token not found.");
        }

        const response = await axios.post(`${API_URL}/customer/service/create`, customerData, {
            headers: {
                "Content-Type": "application/json",
                custom: CUSTOM_HEADER,
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.responsecode !== "000") {
            throw new Error(response.data.responsedesc ?? "Failed to add customer.");
        }

        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export async function updateCustomer(customerData: UpdateCustomerPayload): Promise<CustomerMutationResponse> {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("Authentication token not found.");
        }

        const response = await axios.put(`${API_URL}/customer/service/update`, customerData, {
            headers: {
                "Content-Type": "application/json",
                custom: CUSTOM_HEADER,
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.responsecode !== "000") {
            throw new Error(response.data.responsedesc ?? "Failed to update customer.");
        }

        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export async function blockCustomer({ customerId, reason }: BlockCustomerPayload): Promise<CustomerMutationResponse> {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("Authentication token not found.");
        }

        const formData = new FormData();
        formData.append("customerId", customerId);
        formData.append("status", "block");
        formData.append("reason", reason);

        const response = await axios.patch(`${API_URL}/customer/service/change-state`, formData, {
            headers: {
                "Content-Type": "multipart/form-data", // Use multipart/form-data for FormData
                custom: CUSTOM_HEADER,
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.responsecode !== "000") {
            throw new Error(response.data.responsedesc ?? "Failed to block customer.");
        }

        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}