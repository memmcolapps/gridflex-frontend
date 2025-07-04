"use client";

import React, { useRef, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { UploadIcon } from "lucide-react";
import * as XLSX from "xlsx";

interface BulkUploadDialogProps<T> {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: T[]) => void;
    title?: string;
    description?: string;
    requiredColumns: string[];
    templateUrl?: string;
    maxFileSizeMb?: number;
}

export function BulkUploadDialog<T>({
    isOpen,
    onClose,
    onSave,
    title = "Upload File",
    description = "Click the link to download the required document format. Please ensure your file follows the structure before uploading.",
    requiredColumns,
    templateUrl = "/template.xlsx",
    maxFileSizeMb = 10,
}: BulkUploadDialogProps<T>) {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (
            selectedFile &&
            (selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                selectedFile.type === "text/csv")
        ) {
            if (selectedFile.size > maxFileSizeMb * 1024 * 1024) {
                setFile(null);
                setError(`File size exceeds ${maxFileSizeMb}MB limit`);
                return;
            }
            setFile(selectedFile);
            setError(null);
        } else {
            setFile(null);
            setError("Please upload a valid .xlsx or .csv file");
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
            try {
                const workbook = XLSX.read(data, { type: "binary" });
                const sheetName = workbook.SheetNames[0];
                const sheet = sheetName ? workbook.Sheets[sheetName] : undefined;
                if (!sheet) {
                    setError("Error: The selected file does not contain any sheet.");
                    return;
                }
                const worksheet = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 });
                const headers = worksheet[0]!;
                const rows = worksheet.slice(1);

                // Validate required columns
                const missingColumns = requiredColumns.filter((col) => !headers.includes(col));
                if (missingColumns.length > 0) {
                    setError(`Missing required columns: ${missingColumns.join(", ")}`);
                    return;
                }

                // Map rows to generic data
                const newData: T[] = rows.map((row: (string | undefined)[]) => {
                    const item: Record<string, string> = {};
                    requiredColumns.forEach((col) => {
                        const index = headers.indexOf(col);
                        item[col] = row[index]?.toString() ?? "";
                    });
                    return item as T;
                });

                onSave(newData);
                onClose();
            } catch {
                setError("Error processing file");
            }
        };
        reader.onerror = () => setError("Error reading file");
        reader.readAsBinaryString(file);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md rounded-lg p-6 h-fit bg-white">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-900">{title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <p className="text-sm text-gray-700">
                        {description.split("link to download").map((part, index) =>
                            index === 0 ? (
                                <span key={index}>{part}</span>
                            ) : (
                                <React.Fragment key={index}>
                                    <a href={templateUrl} className="text-[#161CCA] font-medium" download>
                                        link to download
                                    </a>
                                    {part}
                                </React.Fragment>
                            )
                        )}
                    </p>

                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                            "cursor-pointer border border-dashed border-gray-400 rounded-lg py-10 px-4 text-center flex flex-col items-center justify-center gap-2 hover:border-[#161CCA] transition"
                        )}
                    >
                        <UploadIcon className="text-[#161CCA] w-8 h-8" />
                        <p>
                            Click <span className="text-[#161CCA] underline">here</span> to upload file or Drag and Drop
                        </p>
                        <p className="text-xs text-gray-500">
                            Supported file format: <strong>.xlsx, .csv</strong> <br />
                            Maximum file size: <strong>{maxFileSizeMb}MB</strong>
                        </p>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx, .csv"
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    {error && <p className="text-sm text-red-600">{error}</p>}
                </div>
              
            </DialogContent>
        </Dialog>
    );
}