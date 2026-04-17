"use client";

import * as XLSX from "xlsx-js-style";
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
  variant?: "default" | "adjustment";
}

export function ExportButton({
  data,
  columns,
  fileName = "export",
  disabled = false,
  className = "",
  variant = "default",
}: ExportButtonProps) {
  const handleExport = () => {
    if (!data || data.length === 0) {
      toast.error("No data available to export");
      return;
    }

    // Prepare data for Excel export
    const excelData = data.map((item, index) => {
      const row: Record<string, unknown> = {};
      row["S/N"] = index + 1;
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

  const buttonClass =
    variant === "adjustment"
      ? `gap-1 bg-[#161CCA] text-white hover:bg-[#121eb3] ${className}`
      : `gap-1 bg-white text-[#161CCA] hover:bg-gray-50 border border-[#161CCA] ${className}`;

  return (
    <Button className={buttonClass} onClick={handleExport} disabled={disabled}>
      <SquareArrowOutUpRight
        className={variant === "adjustment" ? "text-white" : "text-[#161CCA]"}
        strokeWidth={2.5}
        size={12}
      />
      <Label
        className={`cursor-pointer ${variant === "adjustment" ? "text-white" : "text-[#161CCA]"}`}
      >
        Export
      </Label>
    </Button>
  );
}
