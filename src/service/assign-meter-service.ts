// service/assign-meter-service.ts

import axios from "axios";
import { env } from "@/env";
import { handleApiError } from "error"; // Assuming this utility exists

const API_URL = env.NEXT_PUBLIC_BASE_URL;
const CUSTOM_HEADER = env.NEXT_PUBLIC_CUSTOM_HEADER;

// --- Type Definitions ---

export interface ManufacturerDetails {
    id: string;
    orgId: string;
    manufacturerId: string;
    name: string;
    contactPerson: string;
    state: string;
    city: string;
    street: string;
    email: string;
    phoneNo: string;
    createdAt: string;
    updatedAt: string;
}

export interface MeterAPIItem {
    id: string;
    meterNumber: string;
    simNumber: string;
    type: "VIRTUAL" | "NON-VIRTUAL" | string; // Key field for separation
    meterCategory: string;
    meterClass: string;
    meterType: string;
    meterManufacturer: string;
    meterStage: string;
    status: string;
    oldSgc: string;
    newSgc: string;
    oldKrn: string;
    newKrn: string;
    oldTariffIndex: number;
    newTariffIndex: number;
    manufacturer: ManufacturerDetails;
    createdAt: string;
    updatedAt: string;
}

export interface MetersApiResponse {
    responsecode: "000" | string;
    responsedesc: string;
    responsedata: {
        totalData: number;
        data: MeterAPIItem[];
    };
}

export interface GetMetersParams {
    page: number;
    pageSize: number;
    searchTerm: string;
    sortBy: keyof MeterAPIItem | null;
    sortDirection: "asc" | "desc" | null;
    type?: string;
}

export interface AssignData {
    firstName: string;
    lastName: string;
    accountNumber: string;
    nin: string;
    phone: string;
    email: string;
    state: string;
    city: string;
    streetName: string;
    houseNo: string;
}

export interface VirtualMeterPayload {
    id?: string;
    customerId: string;
    meterNumber: string;
    accountNumber: string;
    feeder?: string;
    dss?: string;
    cin?: string;
    tariff?: string;
    status?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    state?: string;
    city?: string;
    streetName?: string;
    houseNo?: string;
    category?: string;
    energyType?: string;
    fixedEnergy?: string;
    custoType?: string;
    image?: File | null;
    consumptionType?: string;
}

// --- NEW ACTION PAYLOADS ---

/**
 * Payload for POST /meter/service/cin/assign
 */
export interface AssignMeterPayload {
    meterNumber: string;
    cin: string;
    tariff: string;
    feeder: string;
    dss: string;
    accountNumber: string;
    category: string; // "Prepaid" or "Postpaid"
    state: string;
    city: string;
    streetName: string;
    houseNo: string;
    latitude: string | number;
    longitude: string | number;
}

/**
 * Payload for POST /meter/service/change-state
 */
export interface ChangeMeterStatePayload {
    meterNumber: string;
    status: "Activate" | "Deactivate";
}

/**
 * Payload for POST /meter/service/update
 */
export interface UpdateMeterPayload {
    meterNumber: string;
    meterClass: string;
    meterType: string;
    meterManufacturer: string;
    meterCategory: string; // E.g., "Prepaid", "Postpaid"
    oldSgc: string;
    newSgc: string;
    oldKrn: string;
    newKrn: string;
    oldTariffIndex: number;
    newTariffIndex: number;
    simNumber: string;
}

/**
 * Payload for POST /meter/service/migrate
 */
export interface MigrateMeterPayload {
    meterNumber: string;
    feeder: string;
    dss: string;
    tariff: string;
}

/**
 * Payload for POST /meter/service/detach
 */
export interface DetachMeterPayload {
    meterNumber: string;
    reason: string;
}

// --- API Service Functions ---

/**
 * Fetches a paginated, searchable, and sortable list of all meter data.
 * Endpoint: /meter/service/all
 * @param params - Pagination, search, and sort parameters.
 * @returns A promise resolving to the API response containing meter data.
 */
export async function getMeters({
    page,
    pageSize,
    searchTerm,
    sortBy,
    sortDirection,
    type,
}: GetMetersParams): Promise<MetersApiResponse> {
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
        if (type) {
            params.append("type", type);
        }

        const response = await axios.get(`${API_URL}/meter/service/all`, {
            params,
            headers: {
                "Content-Type": "application/json",
                custom: CUSTOM_HEADER,
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.responsecode !== "000") {
            throw new Error(response.data.responsedesc ?? "Failed to fetch meter data.");
        }

        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

/**
 * Saves or updates a meter.
 * Endpoint: POST /api/meters
 * @param meter - The meter data to save.
 * @returns A promise resolving to the API response.
 */
export async function saveMeter(meter: object): Promise<{ responsecode: string; responsedesc: string }> {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("Authentication token not found.");
        }

        const response = await axios.post(`${API_URL}/api/meters`, meter, {
            headers: {
                "Content-Type": "application/json",
                custom: CUSTOM_HEADER,
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.responsecode !== "000") {
            throw new Error(response.data.responsedesc ?? "Failed to save meter.");
        }

        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

/**
 * Activates a meter.
 * Endpoint: POST /api/meters/{id}/activate
 * @param id - The meter ID.
 * @returns A promise resolving to the API response.
 */
export async function activateMeter(id: string): Promise<{ responsecode: string; responsedesc: string }> {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("Authentication token not found.");
        }

        const response = await axios.post(`${API_URL}/api/meters/${id}/activate`, {}, {
            headers: {
                "Content-Type": "application/json",
                custom: CUSTOM_HEADER,
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.responsecode !== "000") {
            throw new Error(response.data.responsedesc ?? "Failed to activate meter.");
        }

        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

/**
 * Deactivates a meter.
 * Endpoint: POST /api/meters/{id}/deactivate
 * @param id - The meter ID.
 * @param reason - Optional deactivation reason.
 * @returns A promise resolving to the API response.
 */
export async function deactivateMeter(id: string, reason?: string): Promise<{ responsecode: string; responsedesc: string }> {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("Authentication token not found.");
        }

        const response = await axios.post(`${API_URL}/api/meters/${id}/deactivate`, { reason }, {
            headers: {
                "Content-Type": "application/json",
                custom: CUSTOM_HEADER,
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.responsecode !== "000") {
            throw new Error(response.data.responsedesc ?? "Failed to deactivate meter.");
        }

        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

/**
 * Assigns a meter to a customer.
 * Endpoint: POST /meter/service/cin/assign (NEW ENDPOINT)
 * @param data - Assignment data.
 * @returns A promise resolving to the API response.
 */
export async function assignMeter(data: AssignMeterPayload): Promise<{ responsecode: string; responsedesc: string }> {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("Authentication token not found.");
        }

        const response = await axios.post(`${API_URL}/meter/service/cin/assign`, data, {
            headers: {
                "Content-Type": "application/json",
                custom: CUSTOM_HEADER,
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.responsecode !== "000") {
            throw new Error(response.data.responsedesc ?? "Failed to assign meter.");
        }
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

/**
 * Changes meter state (Activate/Deactivate).
 * Endpoint: POST /meter/service/change-state
 */
export async function changeMeterState(data: ChangeMeterStatePayload): Promise<{ responsecode: string; responsedesc: string }> {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) throw new Error("Authentication token not found.");

        const response = await axios.post(`${API_URL}/meter/service/change-state`, data, {
            headers: {
                "Content-Type": "application/json",
                custom: CUSTOM_HEADER,
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.responsecode !== "000") {
            throw new Error(response.data.responsedesc ?? `Failed to ${data.status.toLowerCase()} meter.`);
        }
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

/**
 * Updates meter details (Edit).
 * Endpoint: POST /meter/service/update
 */
export async function updateMeter(data: UpdateMeterPayload): Promise<{ responsecode: string; responsedesc: string }> {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) throw new Error("Authentication token not found.");

        const response = await axios.post(`${API_URL}/meter/service/update`, data, {
            headers: {
                "Content-Type": "application/json",
                custom: CUSTOM_HEADER,
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.responsecode !== "000") {
            throw new Error(response.data.responsedesc ?? "Failed to update meter.");
        }
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

/**
 * Migrates a meter.
 * Endpoint: POST /meter/service/migrate
 */
export async function migrateMeter(data: MigrateMeterPayload): Promise<{ responsecode: string; responsedesc: string }> {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) throw new Error("Authentication token not found.");

        const response = await axios.post(`${API_URL}/meter/service/migrate`, data, {
            headers: {
                "Content-Type": "application/json",
                custom: CUSTOM_HEADER,
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.responsecode !== "000") {
            throw new Error(response.data.responsedesc ?? "Failed to migrate meter.");
        }
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

/**
 * Detaches a meter.
 * Endpoint: POST /meter/service/detach
 */
export async function detachMeter(data: DetachMeterPayload): Promise<{ responsecode: string; responsedesc: string }> {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) throw new Error("Authentication token not found.");

        const response = await axios.post(`${API_URL}/meter/service/detach`, data, {
            headers: {
                "Content-Type": "application/json",
                custom: CUSTOM_HEADER,
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.responsecode !== "000") {
            throw new Error(response.data.responsedesc ?? "Failed to detach meter.");
        }
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

/**
 * Bulk uploads meters.
 * Endpoint: POST /api/meters/bulk
 * @param data - Array of meter data.
 * @returns A promise resolving to the API response.
 */
export async function bulkUploadMeters(data: object[]): Promise<{ responsecode: string; responsedesc: string }> {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("Authentication token not found.");
        }

        const response = await axios.post(`${API_URL}/api/meters/bulk`, data, {
            headers: {
                "Content-Type": "application/json",
                custom: CUSTOM_HEADER,
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.responsecode !== "000") {
            throw new Error(response.data.responsedesc ?? "Failed to bulk upload meters.");
        }

        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

/**
 * Saves a virtual meter.
 * Endpoint: PUT /api/virtual-meters/{id}
 * @param id - The virtual meter ID.
 * @param meter - The meter data.
 * @returns A promise resolving to the API response.
 */
export async function saveVirtualMeter(id: string, meter: VirtualMeterPayload): Promise<{ responsecode: string; responsedesc: string }> {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("Authentication token not found.");
        }

        const response = await axios.put(`${API_URL}/api/virtual-meters/${id}`, meter, {
            headers: {
                "Content-Type": "application/json",
                custom: CUSTOM_HEADER,
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.responsecode !== "000") {
            throw new Error(response.data.responsedesc ?? "Failed to save virtual meter.");
        }

        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

/**
 * Deactivates a physical meter.
 * Endpoint: POST /api/meters/{id}/deactivate
 * @param id - The meter ID.
 * @returns A promise resolving to the API response.
 */
export async function deactivatePhysicalMeter(id: string): Promise<{ responsecode: string; responsedesc: string }> {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("Authentication token not found.");
        }

        const response = await axios.post(`${API_URL}/api/meters/${id}/deactivate`, {}, {
            headers: {
                "Content-Type": "application/json",
                custom: CUSTOM_HEADER,
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.responsecode !== "000") {
            throw new Error(response.data.responsedesc ?? "Failed to deactivate physical meter.");
        }

        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

/**
 * Creates a virtual meter.
 * Endpoint: POST /api/virtual-meters
 * @param meter - The meter data.
 * @returns A promise resolving to the API response.
 */
export async function createVirtualMeter(meter: VirtualMeterPayload): Promise<{ responsecode: string; responsedesc: string }> {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            throw new Error("Authentication token not found.");
        }

        const response = await axios.post(`${API_URL}/api/virtual-meters`, meter, {
            headers: {
                "Content-Type": "application/json",
                custom: CUSTOM_HEADER,
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.responsecode !== "000") {
            throw new Error(response.data.responsedesc ?? "Failed to create virtual meter.");
        }

        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}