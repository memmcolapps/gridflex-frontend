// hooks/use-meter-bulk.ts

import { useMutation } from "@tanstack/react-query";
import {
    downloadMeterCsvTemplate,
    downloadMeterExcelTemplate,
    bulkUploadMeters,
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