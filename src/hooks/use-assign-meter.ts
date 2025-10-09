/* eslint-disable @typescript-eslint/no-unused-vars */
// hooks/use-meter.ts

import { useQuery, useMutation } from "@tanstack/react-query";
import {
    getMeters,
    saveMeter,
    activateMeter,
    deactivateMeter,
    assignMeter,
    bulkUploadMeters,
    saveVirtualMeter,
    deactivatePhysicalMeter,
    createVirtualMeter,
    type MetersApiResponse,
    type MeterAPIItem,
    type GetMetersParams,
    type AssignData,
    type VirtualMeterPayload,
} from "../service/assign-meter-service";
import type { MeterInventoryItem } from "@/types/meter-inventory";
import type { VirtualMeterData } from "@/types/meter";
import { toast } from "sonner";

export interface UseMetersParams {
    page: number;
    pageSize: number;
    searchTerm: string;
    sortBy?: keyof MeterAPIItem | null;
    sortDirection?: "asc" | "desc" | null;
}

// --- Helper Function for Data Transformation ---

const mapToFrontendMeter = (apiItem: MeterAPIItem, isVirtual: boolean): MeterInventoryItem | VirtualMeterData => {
    // This function maps the MeterAPIItem fields to your frontend structure
    // (MeterInventoryItem or VirtualMeterData).

    const baseData = {
        id: apiItem.id,
        meterNumber: apiItem.meterNumber,
        category: apiItem.meterCategory,
        meterType: apiItem.meterType,
        status: apiItem.status,
    };

    if (isVirtual) {
        return {
            ...baseData,
            // Map virtual-specific fields
            status: apiItem.meterStage, // activation status
            customerId: 'VIRTUAL',
            accountNumber: 'VIRTUAL-' + apiItem.meterNumber,
            cin: 'N/A', tariff: 'N/A', feeder: 'N/A', dss: 'N/A',
            firstName: apiItem.manufacturer?.name || 'Virtual User', lastName: '',
            phone: apiItem.manufacturer?.phoneNo || 'N/A', state: apiItem.manufacturer?.state || 'N/A',
            city: apiItem.manufacturer?.city || 'N/A', streetName: apiItem.manufacturer?.street || 'N/A',
            houseNo: 'N/A', image: null, consumptionType: 'Non-MD',
            category: apiItem.meterCategory,
        } as VirtualMeterData;
    }

    return {
        id: apiItem.id,
        meterNumber: apiItem.meterNumber,
        meterManufacturer: apiItem.manufacturer?.name || 'N/A',
        meterClass: apiItem.meterClass,
        meterType: apiItem.meterType,
        meterCategory: apiItem.meterCategory,
        status: apiItem.status,
        simNumber: apiItem.simNumber,
        simNo: apiItem.simNumber, // duplicate for compatibility
        oldTariffIndex: apiItem.oldTariffIndex,
        newTariffIndex: apiItem.newTariffIndex,
        oldSgc: apiItem.oldSgc,
        newSgc: apiItem.newSgc,
        oldKrn: apiItem.oldKrn,
        newKrn: apiItem.newKrn,
        assignedStatus: apiItem.meterStage,
        meterStage: apiItem.meterStage,
        manufacturer: apiItem.manufacturer,
        smartStatus: apiItem.meterType === 'SMART', // assume based on type
        smartMeterInfo: {
            meterModel: 'N/A',
            protocol: 'N/A',
            authentication: 'N/A',
            password: 'N/A',
        },
        createdAt: apiItem.createdAt,
        updatedAt: apiItem.updatedAt,
        // optional fields omitted
    } as MeterInventoryItem;
};

// --- Stable Select Function ---

const selectMeters = (data: MetersApiResponse) => {
    const virtualMeters: VirtualMeterData[] = [];
    const actualMeters: MeterInventoryItem[] = [];

    data.responsedata.data.forEach((meter) => {
        const isVirtual = meter.type === "VIRTUAL";
        const frontendMeter = mapToFrontendMeter(meter, isVirtual);

        if (isVirtual) {
            virtualMeters.push(frontendMeter as VirtualMeterData);
        } else {
            actualMeters.push(frontendMeter as MeterInventoryItem);
        }
    });

    return { virtualMeters, actualMeters, totalData: data.responsedata.totalData };
};

// --- TanStack Query Hook ---

/**
 * A hook to fetch, paginate, and categorize meter data into Actual and Virtual lists.
 * @param params - The parameters to control pagination, searching, and sorting.
 * @returns The query result object, with data transformed into { actualMeters, virtualMeters }.
 */
export const useMeters = ({ page, pageSize, searchTerm, sortBy, sortDirection }: UseMetersParams) => {
    // The query result type is explicitly defined to reflect the transformed output:
    return useQuery<
        MetersApiResponse,
        Error,
        { actualMeters: MeterInventoryItem[], virtualMeters: VirtualMeterData[], totalData: number }
    >({
        // The query key ensures re-fetching happens only when these parameters change
        queryKey: ["meters", page, pageSize, searchTerm, sortBy, sortDirection],
        queryFn: () => getMeters({ page, pageSize, searchTerm, sortBy: sortBy ?? null, sortDirection: sortDirection ?? null }),
        staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
        refetchOnWindowFocus: false,

        // The select function separates the data into two lists based on the 'type' field
        select: (data) => {
            const virtualMeters: VirtualMeterData[] = [];
            const actualMeters: MeterInventoryItem[] = [];

            data.responsedata.data.forEach((meter) => {
                const isVirtual = meter.type === "VIRTUAL";
                const frontendMeter = mapToFrontendMeter(meter, isVirtual);

                if (isVirtual) {
                    virtualMeters.push(frontendMeter as VirtualMeterData);
                } else {
                    actualMeters.push(frontendMeter as MeterInventoryItem);
                }
            });

            return { virtualMeters, actualMeters, totalData: data.responsedata.totalData };
        },
    });
};

// --- Mutations ---

export const useSaveMeter = () => {
    return useMutation({
        mutationFn: saveMeter,
        onSuccess: () => {
            toast.success("Meter saved successfully!");
        },
        onError: (error: Error) => {
            toast.error(`Failed to save meter: ${error.message}`);
        },
    });
};

export const useActivateMeter = () => {
    return useMutation({
        mutationFn: activateMeter,
        onSuccess: () => {
            toast.success("Meter activated successfully!");
        },
        onError: (error: Error) => {
            toast.error(`Failed to activate meter: ${error.message}`);
        },
    });
};

export const useDeactivateMeter = () => {
    return useMutation({
        mutationFn: ({ id, reason }: { id: string; reason?: string }) => deactivateMeter(id, reason),
        onSuccess: () => {
            toast.success("Meter deactivated successfully!");
        },
        onError: (error: Error) => {
            toast.error(`Failed to deactivate meter: ${error.message}`);
        },
    });
};

export const useAssignMeter = () => {
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: AssignData }) => assignMeter(id, data),
        onSuccess: () => {
            toast.success("Meter assigned successfully!");
        },
        onError: (error: Error) => {
            toast.error(`Failed to assign meter: ${error.message}`);
        },
    });
};

export const useBulkUploadMeters = () => {
    return useMutation({
        mutationFn: bulkUploadMeters,
        onSuccess: () => {
            toast.success("Bulk upload completed successfully!");
        },
        onError: (error: Error) => {
            toast.error(`Failed to bulk upload meters: ${error.message}`);
        },
    });
};

export const useSaveVirtualMeter = () => {
    return useMutation({
        mutationFn: ({ id, meter }: { id: string; meter: VirtualMeterPayload }) => saveVirtualMeter(id, meter),
        onSuccess: () => {
            toast.success("Virtual meter saved successfully!");
        },
        onError: (error: Error) => {
            toast.error(`Failed to save virtual meter: ${error.message}`);
        },
    });
};

export const useDeactivatePhysicalMeter = () => {
    return useMutation({
        mutationFn: deactivatePhysicalMeter,
        onSuccess: () => {
            toast.success("Physical meter deactivated successfully!");
        },
        onError: (error: Error) => {
            toast.error(`Failed to deactivate physical meter: ${error.message}`);
        },
    });
};

export const useCreateVirtualMeter = () => {
    return useMutation({
        mutationFn: createVirtualMeter,
        onSuccess: () => {
            toast.success("Virtual meter created successfully!");
        },
        onError: (error: Error) => {
            toast.error(`Failed to create virtual meter: ${error.message}`);
        },
    });
};