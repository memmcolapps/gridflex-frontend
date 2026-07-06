import React, { useMemo, useEffect } from "react";
import { FilterPanel } from "./FilterPanel";
import { DataTable } from "./DataTable";
import { useRealtimeStream } from "@/hooks/use-realtime-stream";
import { useObisData } from "@/hooks/use-hes-hierarchy";

interface RealTimeDataTableProps {
  meterType?: string;
  onMeterSelection?: (meters: string[]) => void;
  sortDirection?: "asc" | "desc" | null;
  onExportDataChange?: (data: {
    displayData: import("@/hooks/use-realtime-stream").MeterData[];
    selectedReading: string[];
    readingLabelMap: Record<string, string>;
  }) => void;
}

export function RealTimeDataTable({
  meterType: currentMeterType = "MD",
  onMeterSelection,
  sortDirection = null,
  onExportDataChange,
}: RealTimeDataTableProps) {
  const { data, selectedReading, isStreaming, error, run } = useRealtimeStream();

  const { data: obisData } = useObisData(currentMeterType as "MD" | "Non-MD");

  const readingLabelMap = useMemo(() => {
    if (!obisData) return {};
    const map: Record<string, string> = {};
    Object.values(obisData.responsedata)
      .flat()
      .forEach((item) => {
        if (item.obisCodeCombined) {
          map[item.obisCodeCombined] = item.description;
        }
      });
    return map;
  }, [obisData]);

  const displayData = useMemo(() => {
    if (!sortDirection) return data;

    return [...data].sort((a, b) =>
      sortDirection === "asc"
        ? a.meter.localeCompare(b.meter)
        : b.meter.localeCompare(a.meter),
    );
  }, [data, sortDirection]);

  useEffect(() => {
    onExportDataChange?.({ displayData, selectedReading, readingLabelMap });
  }, [displayData, selectedReading, readingLabelMap, onExportDataChange]);

  const handleRun = async (filters: {
    hierarchy: string;
    unit: string;
    meters: string[];
    reading: string[];
    obisCodes: string[];
  }) => {
    if (onMeterSelection) onMeterSelection(filters.meters);

    await run({
      meterType: currentMeterType,
      meters: filters.meters,
      reading: filters.reading,
      obisCodes: filters.obisCodes,
    });
  };

  return (
    <div className="mx-auto max-w-screen space-y-6 overflow-x-hidden px-4">
      <div className="pt-8 pb-4">
        <FilterPanel onRun={handleRun} meterType={currentMeterType} />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div>
        {displayData.length > 0 && (
          <DataTable
            data={displayData}
            reading={selectedReading}
            readingLabelMap={readingLabelMap}
            loading={isStreaming}
          />
        )}
      </div>
    </div>
  );
}
