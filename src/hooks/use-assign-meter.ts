/* eslint-disable @typescript-eslint/no-unused-vars */
// hooks/use-assign-meter.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getMeters,
    saveMeter,
    assignMeter,
    bulkUploadMeters,
    saveVirtualMeter,
    deactivatePhysicalMeter,
    createVirtualMeter,
    changeMeterState,
    migrateMeter,
    detachMeter,
    type MetersApiResponse,
    type MeterAPIItem,
    type GetMetersParams,
    type AssignData,
    type VirtualMeterPayload,
    type AssignMeterPayload,
    type ChangeMeterStatePayload,
    type UpdateMeterPayload,
    type MigrateMeterPayload,
    type DetachMeterPayload,
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
    type?: string;
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
            assignedStatus: apiItem.meterStage,
            customerId: 'VIRTUAL',
            accountNumber: 'VIRTUAL-' + apiItem.meterNumber,
            cin: 'N/A', tariff: 'N/A', feeder: 'N/A', dss: 'N/A',
            firstName: apiItem.manufacturer?.name || 'Virtual User', lastName: '',
            phone: apiItem.manufacturer?.phoneNo || 'N/A', state: apiItem.manufacturer?.state || 'N/A',
            city: apiItem.manufacturer?.city || 'N/A', streetName: apiItem.manufacturer?.street || 'N/A',
            houseNo: 'N/A', image: null, consumptionType: 'Non-MD',
            category: apiItem.meterCategory,
            energyType: 'N/A',
            custoType: 'N/A',
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

// --- TanStack Query Hook ---

/**
 * A hook to fetch, paginate, and categorize meter data into Actual and Virtual lists.
 * @param params - The parameters to control pagination, searching, and sorting.
 * @returns The query result object, with data transformed into { actualMeters, virtualMeters }.
 */
export const useMeters = ({ page, pageSize, searchTerm, sortBy, sortDirection, type }: UseMetersParams) => {
    // The query result type is explicitly defined to reflect the transformed output:
    return useQuery<
        MetersApiResponse,
        Error,
        { actualMeters: MeterInventoryItem[], virtualMeters: VirtualMeterData[], totalData: number }
    >({
        // The query key ensures re-fetching happens only when these parameters change
        queryKey: ["meters", page, pageSize, searchTerm, sortBy, sortDirection, type],
        queryFn: () => getMeters({ page, pageSize, searchTerm, sortBy: sortBy ?? null, sortDirection: sortDirection ?? null, type }),
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
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: saveMeter,
        onSuccess: () => {
            toast.success("Meter saved successfully!");
            queryClient.invalidateQueries({ queryKey: ["meters"] });
        },
        onError: (error: Error) => {
            toast.error(`Failed to save meter: ${error.message}`);
        },
    });
};


// Hook for Meter Assignment (POST /meter/service/cin/assign)
export const useAssignMeter = () => {
    const queryClient = useQueryClient();
    return useMutation<
        { responsecode: string; responsedesc: string },
        Error,
        AssignMeterPayload // NEW signature
    >({
        mutationFn: assignMeter,
        onSuccess: () => {
            toast.success("Meter assigned successfully!");
            queryClient.invalidateQueries({ queryKey: ["meters"] });
        },
        onError: (error: Error) => {
            toast.error(`Failed to assign meter: ${error.message}`);
        },
    });
};

// Hook for Change Meter State (POST /meter/service/change-state)
export const useChangeMeterState = () => {
    const queryClient = useQueryClient();
    return useMutation<
        { responsecode: string; responsedesc: string },
        Error,
        ChangeMeterStatePayload
    >({
        mutationFn: changeMeterState,
        onSuccess: (data, variables) => {
            toast.success(`Meter ${variables.meterNumber} ${variables.status.toLowerCase()}d successfully!`);
            queryClient.invalidateQueries({ queryKey: ["meters"] });
        },
        onError: (error: Error) => {
            toast.error(`Failed to change meter state: ${error.message}`);
        },
    });
};

// Hook for Migrate Meter (POST /meter/service/migrate)
export const useMigrateMeter = () => {
    const queryClient = useQueryClient();
    return useMutation<
        { responsecode: string; responsedesc: string },
        Error,
        MigrateMeterPayload
    >({
        mutationFn: migrateMeter,
        onSuccess: (data, variables) => {
            toast.success(`Meter ${variables.meterNumber} migrated successfully!`);
            queryClient.invalidateQueries({ queryKey: ["meters"] });
        },
        onError: (error: Error) => {
            toast.error(`Failed to migrate meter: ${error.message}`);
        },
    });
};

// Hook for Detach Meter (POST /meter/service/detach)
export const useDetachMeter = () => {
    const queryClient = useQueryClient();
    return useMutation<
        { responsecode: string; responsedesc: string },
        Error,
        DetachMeterPayload
    >({
        mutationFn: detachMeter,
        onSuccess: (data, variables) => {
            toast.success(`Meter ${variables.meterNumber} detached successfully!`);
            queryClient.invalidateQueries({ queryKey: ["meters"] });
        },
        onError: (error: Error) => {
            toast.error(`Failed to detach meter: ${error.message}`);
        },
    });
};

export const useBulkUploadMeters = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: bulkUploadMeters,
        onSuccess: () => {
            toast.success("Bulk upload completed successfully!");
            queryClient.invalidateQueries({ queryKey: ["meters"] });
        },
        onError: (error: Error) => {
            toast.error(`Failed to bulk upload meters: ${error.message}`);
        },
    });
};

export const useSaveVirtualMeter = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, meter }: { id: string; meter: VirtualMeterPayload }) => saveVirtualMeter(id, meter),
        onSuccess: () => {
            toast.success("Virtual meter saved successfully!");
            queryClient.invalidateQueries({ queryKey: ["meters"] });
        },
        onError: (error: Error) => {
            toast.error(`Failed to save virtual meter: ${error.message}`);
        },
    });
};

export const useDeactivatePhysicalMeter = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deactivatePhysicalMeter,
        onSuccess: () => {
            toast.success("Physical meter deactivated successfully!");
            queryClient.invalidateQueries({ queryKey: ["meters"] });
        },
        onError: (error: Error) => {
            toast.error(`Failed to deactivate physical meter: ${error.message}`);
        },
    });
};

export const useCreateVirtualMeter = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createVirtualMeter,
        onSuccess: () => {
            toast.success("Virtual meter created successfully!");
            queryClient.invalidateQueries({ queryKey: ["meters"] });
        },
        onError: (error: Error) => {
            toast.error(`Failed to create virtual meter: ${error.message}`);
        },
    });
};

export type { AssignMeterPayload, ChangeMeterStatePayload, UpdateMeterPayload, MigrateMeterPayload, DetachMeterPayload };