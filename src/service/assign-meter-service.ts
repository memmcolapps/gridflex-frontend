// service/assign-meter-service.ts

import axios from "axios";
import { env } from "@/env";
import { handleApiError } from "error";

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
    type: "VIRTUAL" | "NON-VIRTUAL" | string;
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
    customerId: string;
    accountNumber: string;
    cin: string;
    tariff: string;
    dss: string;
    customer: {
        id: string;
        firstname: string;
        lastname: string;
        customerId: string;
        phoneNumber: string;
        state: string;
        city: string;
        streetName: string;
        houseNo: string;
    };
    meterAssignLocation: {
        state: string;
        city: string;
        streetName: string;
        houseNo: string;
    };
    paymentMode: {
        debitPaymentMode: string;
        creditPaymentMode: string;
        debitPaymentPlan: string;
        creditPaymentPlan: string;
    };
    smartMeterInfo?: {
        meterModel: string;
        protocol: string;
        authentication: string;
        password: string;
    };
    mdMeterInfo?: {
        ctRatioNum: number;
        ctRatioDenom: number;
        voltRatioNum: number;
        voltRatioDenom: number;
        multiplier: number;
        meterRating: number;
        initialReading: number;
        dial: number;
        latitude: string;
        longitude: string;
    };
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

export interface AssignMeterPayload {
    meterNumber: string;
    customerId: string;
    tariffId: string;
    dssAssetId: string;
    feederAssetId: string;
    cin: string;
    accountNumber: string;
    state: string;
    city: string;
    houseNo: string;
    streetName: string;
    creditPaymentMode: string;
    debitPaymentMode: string;
    creditPaymentPlan: string;
    debitPaymentPlan: string;
}

export interface UpdateMeterPayload {
    meterNumber: string;
    meterClass: string;
    meterType: string;
    meterManufacturer: string;
    meterCategory: string;
    oldSgc: string;
    newSgc: string;
    oldKrn: string;
    newKrn: string;
    oldTariffIndex: number;
    newTariffIndex: number;
    simNumber: string;
}

export interface MigrateMeterPayload {
    meterId: string;
    migrationFrom: string;
    meterCategory: string;
    debitPaymentMode?: string;
    debitPaymentPlan?: string;
    creditPaymentMode?: string;
    creditPaymentPlan?: string;
}

export interface DetachMeterPayload {
    meterId: string;
    reason: string;
}

// Updated interface for change-state parameters
export interface ChangeMeterStateParams {
    meterId: string;
    status: boolean;
    reason?: string;
}

// --- API Service Functions ---

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

// Updated changeMeterState to use query parameters
export async function changeMeterState({ meterId, status, reason }: ChangeMeterStateParams): Promise<{ responsecode: string; responsedesc: string }> {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) throw new Error("Authentication token not found.");

        const params = new URLSearchParams();
        params.append("meterId", meterId);
        params.append("status", String(status));
        if (status) {
            // For activation, pass empty string as reason
            params.append("reason", "a");
        } else {
            // For deactivation, reason is required
            if (!reason) {
                throw new Error("Reason is required for deactivation.");
            }
            params.append("reason", reason);
        }

        const response = await axios.patch(`${API_URL}/meter/service/change-state`, null, {
            params,
            headers: {
                "Content-Type": "application/json",
                custom: CUSTOM_HEADER,
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.responsecode !== "000") {
            throw new Error(response.data.responsedesc ?? `Failed to ${status ? "activate" : "deactivate"} meter.`);
        }
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
}

export async function migrateMeter(data: MigrateMeterPayload): Promise<{ responsecode: string; responsedesc: string }> {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) throw new Error("Authentication token not found.");

        const response = await axios.patch(`${API_URL}/meter/service/migrate`, data, {
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

export async function detachMeter({ meterId, reason }: DetachMeterPayload): Promise<{ responsecode: string; responsedesc: string }> {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) throw new Error("Authentication token not found.");

        const params = new URLSearchParams();
        params.append("meterId", meterId);
        params.append("reason", reason);

        const response = await axios.post(`${API_URL}/meter/service/detach`, null, {
            params,
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