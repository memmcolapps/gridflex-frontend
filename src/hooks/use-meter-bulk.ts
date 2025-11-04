// hooks/use-meter-bulk.ts

import { useMutation } from "@tanstack/react-query";
import {
    downloadMeterCsvTemplate,
    downloadMeterExcelTemplate,
    bulkUploadMeters,
    downloadAllocateCsvTemplate,
    downloadAllocateExcelTemplate,
    bulkAllocateMeters,
    downloadAssignCsvTemplate,
    downloadAssignExcelTemplate,
    bulkAssignMeters,
    exportActualMeters,
    exportVirtualMeters,
} from "../service/meter-bulk-service";

export const useDownloadMeterCsvTemplate = () => {
    return useMutation({
        mutationFn: downloadMeterCsvTemplate,
        onSuccess: (blob) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'meter-template.csv';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        },
    });
};

export const useDownloadMeterExcelTemplate = () => {
    return useMutation({
        mutationFn: downloadMeterExcelTemplate,
        onSuccess: (blob) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'meter-template.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        },
    });
};

export const useBulkUploadMeters = () => {
    return useMutation({
        mutationFn: bulkUploadMeters,
    });
};

export const useDownloadAllocateCsvTemplate = () => {
    return useMutation({
        mutationFn: downloadAllocateCsvTemplate,
        onSuccess: (blob) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'allocate-template.csv';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        },
    });
};

export const useDownloadAllocateExcelTemplate = () => {
    return useMutation({
        mutationFn: downloadAllocateExcelTemplate,
        onSuccess: (blob) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'allocate-template.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        },
    });
};

export const useBulkAllocateMeters = () => {
    return useMutation({
        mutationFn: bulkAllocateMeters,
    });
};

export const useDownloadAssignCsvTemplate = () => {
    return useMutation({
        mutationFn: downloadAssignCsvTemplate,
        onSuccess: (blob) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'assign-template.csv';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        },
    });
};

export const useDownloadAssignExcelTemplate = () => {
    return useMutation({
        mutationFn: downloadAssignExcelTemplate,
        onSuccess: (blob) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'assign-template.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        },
    });
};

export const useBulkAssignMeters = () => {
    return useMutation({
        mutationFn: bulkAssignMeters,
    });
};

export const useExportActualMeters = () => {
    return useMutation({
        mutationFn: exportActualMeters,
        onSuccess: (blob) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'actual-meters-export.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        },
    });
};

export const useExportVirtualMeters = () => {
    return useMutation({
        mutationFn: exportVirtualMeters,
        onSuccess: (blob) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'virtual-meters-export.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        },
    });
};