import React, { useState, useEffect, useRef } from "react";
import { FilterPanel } from "./FilterPanel";
import { DataTable } from "./DataTable";
import type { RealTimeData } from "@/hooks/use-sse";
import type { RealtimeStreamRequest } from "@/service/hes-service";

export interface MeterData {
  [key: string]: string;
  meter: string;
  time: string;
}

interface RealTimeDataTableProps {
  sseData?: RealTimeData[];
  connectionStatus?: Record<string, boolean>;
  selectedMeters?: string[];
  onMeterSelection?: (meters: string[]) => void;
  meterType?: string;
  onRunStream?: (payload: RealtimeStreamRequest) => Promise<unknown>;
}

export function RealTimeDataTable({
  sseData = [],
  connectionStatus = {},
  selectedMeters = [],
  onMeterSelection,
  meterType: currentMeterType = "MD",
  onRunStream,
}: RealTimeDataTableProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<MeterData[]>([]);
  const [selectedReading, setSelectedReading] = useState<string[]>([]);

  // Maps obisString → reading key, e.g. "3;1.0.1.8.0.255;2;0" → "Active energy Import (+A)"
  const obisToReadingKeyRef = useRef<Record<string, string>>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Process incoming SSE events one by one
  useEffect(() => {
    if (!sseData || sseData.length === 0) return;

    // Only look at the latest SSE event
    const dataPoint = sseData[sseData.length - 1] as unknown as Record<string, unknown>;
    if (!dataPoint?.meterNo || !dataPoint?.obisString) return;

    const obisString = dataPoint.obisString as string;
    const meterNo = dataPoint.meterNo as string;
    const statuscode = dataPoint.statuscode as number;
    const value = dataPoint.value as string | undefined;
    const timestamp = dataPoint.timestamp as string | undefined;

    // Only process if this obisString was part of the current query
    const readingKey = obisToReadingKeyRef.current[obisString];
    if (!readingKey) return;

    setData(prev =>
      prev.map(row => {
        if (row.meter !== meterNo) return row;

        const resolvedValue = statuscode === -1 || value === undefined
          ? "N/A"
          : value;

        return {
          ...row,
          // Update timestamp on first successful read
          time: statuscode === 0 && timestamp ? timestamp : row.time,
          [readingKey]: resolvedValue,
          [`${readingKey}__status`]: String(statuscode),
          [`${readingKey}__loading`]: "false",
        };
      })
    );
  }, [sseData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleRun = async (filters: {
    hierarchy: string;
    unit: string;
    meters: string[];
    reading: string[];
    obisCodes: string[];
  }) => {
    setLoading(true);
    setSelectedReading(filters.reading);

    if (onMeterSelection) {
      onMeterSelection(filters.meters);
    }

    // Build reverse map: obisString → readingKey
    const obisMap: Record<string, string> = {};
    filters.obisCodes.forEach((obis, i) => {
      if (filters.reading[i]) {
        obisMap[obis] = filters.reading[i]!;
      }
    });
    obisToReadingKeyRef.current = obisMap;

    // Pre-fill rows immediately with loading skeletons
    const initialRows: MeterData[] = filters.meters.map(meter => {
      const row: MeterData = { meter, time: "—" };
      filters.reading.forEach(r => {
        row[r] = "";                        // empty = not yet received
        row[`${r}__status`] = "";
        row[`${r}__loading`] = "true";      // mark as loading
      });
      return row;
    });
    setData(initialRows);
    setLoading(false);

    // Optionally kick off the stream request
    try {
      if (onRunStream) {
        await onRunStream({
          meterType: currentMeterType,
          meters: filters.meters,
          obisString: filters.obisCodes,
        });
      }
    } catch {
      // SSE will still populate data; API error is non-fatal here
    }
  };

  return (
    <div className="mx-auto max-w-screen space-y-6 overflow-x-hidden px-4">
      <div className="pt-8 pb-4">
        <FilterPanel onRun={handleRun} meterType={currentMeterType} />
      </div>

      <div>
        {(loading || data.length > 0) && (
          <DataTable
            data={data}
            reading={selectedReading}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}