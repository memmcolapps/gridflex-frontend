// components/meter-management/BulkUploadDialog.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useRef } from "react";
import * as XLSX from "xlsx";


interface BulkUploadDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: MeterData[]) => void;
}

interface MeterData {
    meterNumber: string;
    simNumber: string;
    model: string;
    meterManufacturer: string;
    accountNumber: string;
    sgc: string;
    tariff: string;
    id: string;
    approvalStatus: string;
    status: string;
}

export function BulkUploadDialog({ isOpen, onClose, onSave }: BulkUploadDialogProps) {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile && selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            setFile(selectedFile);
            setError(null);
        } else {
            setFile(null);
            setError("Please upload a valid Excel file (.xlsx)");
        }
    };

    const handleUpload = () => {
        if (!file) {
            setError("Please select a file first");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target?.result;
            const workbook = XLSX.read(data, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheet = sheetName ? workbook.Sheets[sheetName] : undefined;
            if (!sheet) {
                setError("Error: The selected Excel file does not contain the expected sheet.");
                return;
            }
            const worksheet = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 });

            // Assume first row is headers
            const headers = worksheet[0]!;
            const rows = worksheet!.slice(1);

            if (
                !headers.includes("meterNumber") ||
                !headers.includes("simNumber") ||
                !headers.includes("model") ||
                !headers.includes("accountNumber") ||
                !headers.includes("sgc") ||
                !headers.includes("tariff") ||
                !headers.includes("id") ||
                !headers.includes("approvalStatus") ||
                !headers.includes("status")
            ) {
                setError("Excel file must contain columns: meterNumber, simNumber, model, accountNumber, sgc, tariff, id, approvalStatus, status");
                return;
            }

            const newData: MeterData[] = rows.map((row: (string | undefined)[]) => ({
                meterNumber: headers.includes("meterNumber") ? row[headers.indexOf("meterNumber")]?.toString() ?? "" : "",
                simNumber: headers.includes("simNumber") ? row[headers.indexOf("simNumber")]?.toString() ?? "" : "",
                model: headers.includes("model") ? row[headers.indexOf("model")]?.toString() ?? "" : "",
                meterManufacturer: headers.includes("meterManufacturer") ? row[headers.indexOf("meterManufacturer")]?.toString() ?? "" : "",
                accountNumber: headers.includes("accountNumber") ? row[headers.indexOf("accountNumber")]?.toString() ?? "" : "",
                sgc: headers.includes("sgc") ? row[headers.indexOf("sgc")]?.toString() ?? "" : "",
                tariff: headers.includes("tariff") ? row[headers.indexOf("tariff")]?.toString() ?? "" : "",
                id: headers.includes("id") ? row[headers.indexOf("id")]?.toString() ?? "" : "",
                approvalStatus: headers.includes("approvalStatus") ? row[headers.indexOf("approvalStatus")]?.toString() ?? "Pending" : "Pending",
                status: headers.includes("status") ? row[headers.indexOf("status")]?.toString() ?? "In-Stock" : "In-Stock",
            }));

            onSave(newData);
            onClose();
        };
        reader.onerror = () => setError("Error reading file");
        reader.readAsBinaryString(file);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px] bg-white rounded-lg p-6">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-900">Bulk Upload Meters</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <Label className="text-sm text-gray-700">Upload Excel File</Label>
                    <Input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx"
                        onChange={handleFileChange}
                        className="mt-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                    <p className="text-sm text-gray-500 mt-2">
                        Please upload an Excel file with columns: meterNumber, simNumber, model, accountNumber, sgc, tariff, id, approvalStatus, status.
                    </p>
                </div>
                <DialogFooter className="flex justify-end gap-3">
                    <Button
                        variant="outline"
                        className="border-[#161CCA] text-[#161CCA] hover:bg-blue-50"
                        onClick={onClose}
                        size="lg"
                    >
                        Cancel
                    </Button>
                    <Button
                        className="bg-[#161CCA] text-white hover:bg-blue-700"
                        onClick={handleUpload}
                        disabled={!file}
                        size="lg"
                    >
                        Upload
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}