// hooks/use-debit-credit-bulk.ts

import { useMutation } from "@tanstack/react-query";
import {
  downloadDebitCreditCsvTemplate,
  downloadDebitCreditExcelTemplate,
  bulkUploadDebitCredit,
} from "../service/debit-credit-adjustment-bulk-service";

export const useDownloadDebitCreditCsvTemplate = () => {
  return useMutation({
    mutationFn: (type: "credit" | "debit") =>
      downloadDebitCreditCsvTemplate(type),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "debit-credit-template.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });
};

export const useDownloadDebitCreditExcelTemplate = () => {
  return useMutation({
    mutationFn: (type: "credit" | "debit") =>
      downloadDebitCreditExcelTemplate(type),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "debit-credit-template.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });
};

export const useBulkUploadDebitCredit = () => {
  return useMutation({
    mutationFn: bulkUploadDebitCredit,
  });
};
