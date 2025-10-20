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
    type ChangeMeterStateParams, // Updated
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

const mapToFrontendMeter = (apiItem: MeterAPIItem, isVirtual: boolean): MeterInventoryItem | VirtualMeterData => {
    const baseData = {
        id: apiItem.id,
        meterNumber: apiItem.meterNumber,
        category: apiItem.meterCategory,
        meterType: apiItem.meterType,
        status: apiItem.status,
        meterStage: apiItem.meterStage,
    };

    if (isVirtual) {
        return {
            ...baseData,
            assignedStatus: apiItem.meterStage,
            customerId: 'VIRTUAL',
            accountNumber: 'VIRTUAL-' + apiItem.meterNumber,
            cin: 'N/A', tariff: 'N/A', feeder: 'N/A', dss: 'N/A',
            firstName: apiItem.manufacturer?.name || 'Virtual User', lastName: '',
            phone: apiItem.manufacturer?.phoneNo || 'N/A', state: apiItem.manufacturer?.state || 'N/A',
            city: apiItem.manufacturer?.city || 'N/A', streetName: apiItem.manufacturer?.street || 'N/A',
            houseNo: 'N/A', image: null, consumptionType: 'Non-MD',
            category: apiItem.meterCategory,
            meterCategory: apiItem.meterCategory,
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
        meterStage: apiItem.meterStage,
        simNumber: apiItem.simNumber,
        simNo: apiItem.simNumber,
        oldTariffIndex: apiItem.oldTariffIndex,
        newTariffIndex: apiItem.newTariffIndex,
        oldSgc: apiItem.oldSgc,
        newSgc: apiItem.newSgc,
        oldKrn: apiItem.oldKrn,
        newKrn: apiItem.newKrn,
        manufacturer: apiItem.manufacturer,
        smartStatus: apiItem.meterType === 'SMART',
        smartMeterInfo: {
            meterModel: apiItem.smartMeterInfo?.meterModel ?? 'N/A',
            protocol: apiItem.smartMeterInfo?.protocol ?? 'N/A',
            authentication: apiItem.smartMeterInfo?.authentication ?? 'N/A',
            password: 'N/A',
        },
        customerId: apiItem.customerId,
        accountNumber: apiItem.accountNumber,
        cin: apiItem.cin,
        tariff: apiItem.tariff,
        dss: apiItem.dss,
        debitMop: apiItem.paymentMode?.debitPaymentMode,
        creditMop: apiItem.paymentMode?.creditPaymentMode,
        debitPaymentPlan: apiItem.paymentMode?.debitPaymentPlan,
        creditPaymentPlan: apiItem.paymentMode?.creditPaymentPlan,
        state: apiItem.meterAssignLocation?.state ?? apiItem.customer?.state,
        city: apiItem.meterAssignLocation?.city ?? apiItem.customer?.city,
        streetName: apiItem.meterAssignLocation?.streetName ?? apiItem.customer?.streetName,
        houseNo: apiItem.meterAssignLocation?.houseNo ?? apiItem.customer?.houseNo,
        phone: apiItem.customer?.phoneNumber,
        firstName: apiItem.customer?.firstname,
        lastName: apiItem.customer?.lastname,
        createdAt: apiItem.createdAt,
        updatedAt: apiItem.updatedAt,
    } as MeterInventoryItem;
};

export const useMeters = ({ page, pageSize, searchTerm, sortBy, sortDirection, type }: UseMetersParams) => {
    return useQuery<
        MetersApiResponse,
        Error,
        { actualMeters: MeterInventoryItem[], virtualMeters: VirtualMeterData[], totalData: number }
    >({
        queryKey: ["meters", page, pageSize, searchTerm, sortBy, sortDirection, type],
        queryFn: () => getMeters({ page, pageSize, searchTerm, sortBy: sortBy ?? null, sortDirection: sortDirection ?? null, type }),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
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

export const useAssignMeter = () => {
    const queryClient = useQueryClient();
    return useMutation<
        { responsecode: string; responsedesc: string },
        Error,
        AssignMeterPayload
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

// Updated useChangeMeterState to use ChangeMeterStateParams
export const useChangeMeterState = () => {
    const queryClient = useQueryClient();
    return useMutation<
        { responsecode: string; responsedesc: string },
        Error,
        ChangeMeterStateParams
    >({
        mutationFn: changeMeterState,
        onSuccess: (_, variables) => {
            const action = variables.status ? "activated" : "deactivated";
            toast.success(`Meter ${variables.meterId} ${action} successfully!`);
            queryClient.invalidateQueries({ queryKey: ["meters"] });
        },
        onError: (error: Error, variables) => {
            const action = variables.status ? "activate" : "deactivate";
            toast.error(`Failed to ${action} meter: ${error.message}`);
        },
    });
};

export const useMigrateMeter = () => {
    const queryClient = useQueryClient();
    return useMutation<
        { responsecode: string; responsedesc: string },
        Error,
        MigrateMeterPayload
    >({
        mutationFn: migrateMeter,
        onSuccess: (data, variables) => {
            toast.success(`Meter ${variables.meterId} migrated successfully!`);
            queryClient.invalidateQueries({ queryKey: ["meters"] });
        },
        onError: (error: Error) => {
            toast.error(`Failed to migrate meter: ${error.message}`);
        },
    });
};

export const useDetachMeter = () => {
    const queryClient = useQueryClient();
    return useMutation<
        { responsecode: string; responsedesc: string },
        Error,
        DetachMeterPayload
    >({
        mutationFn: detachMeter,
        onSuccess: (data, variables) => {
            toast.success(`Meter detached successfully!`);
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



export type { AssignMeterPayload, ChangeMeterStateParams, UpdateMeterPayload, MigrateMeterPayload, DetachMeterPayload };