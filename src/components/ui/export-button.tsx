"use client";

import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { SquareArrowOutUpRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export interface ExportColumn {
  key: string;
  label: string;
  transform?: (value: unknown) => string;
}

export interface ExportButtonProps {
  data: unknown[];
  columns: ExportColumn[];
  fileName?: string;
  disabled?: boolean;
  className?: string;
}

export function ExportButton({
  data,
  columns,
  fileName = "export",
  disabled = false,
  className = "",
}: ExportButtonProps) {
  const handleExport = () => {
    if (!data || data.length === 0) {
      toast.error("No data available to export");
      return;
    }

    // Prepare data for Excel export
    const excelData = data.map((item) => {
      const row: Record<string, unknown> = {};
      columns.forEach((col) => {
        // Handle nested properties (e.g., "manufacturer.name")
        const keys = col.key.split(".");
        let value: unknown = item;
        for (const k of keys) {
          value = (value as Record<string, unknown>)?.[k];
        }
        // Apply transform function if provided
        row[col.label] = col.transform ? col.transform(value) : (value ?? "");
      });
      return row;
    });

    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    // Generate Excel file and trigger download
    XLSX.writeFile(
      workbook,
      `${fileName}_${new Date().toISOString().split("T")[0]}.xlsx`,
    );

    toast.success("Data exported successfully!");
  };

  return (
    <Button
      className={`gap-1 bg-[#161CCA] text-white hover:bg-[#121eb3] ${className}`}
      onClick={handleExport}
      disabled={disabled}
    >
      <SquareArrowOutUpRight
        className="text-white"
        strokeWidth={2.5}
        size={12}
      />
      <Label className="cursor-pointer text-white">Export</Label>
    </Button>
  );
}
