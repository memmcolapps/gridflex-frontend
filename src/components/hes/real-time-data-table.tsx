/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
import React, { useState, useEffect, useRef } from "react";
import { FilterPanel } from "./FilterPanel";
import { DataTable } from "./DataTable";
import type { RealTimeData } from "@/hooks/use-sse";
import type {
  RealtimeReadingEvent,
  RealtimeStreamCallbacks,
  RealtimeStreamRequest,
} from "@/service/hes-service";

type MeterId = string;

interface MeterData {
  [key: string]: string;
  meter: string;
  time: string;
}

interface RealTimeDataTableProps {
  sseData?: RealTimeData[];
  connectionStatus?: { [key: string]: boolean };
  selectedMeters?: string[];
  onMeterSelection?: (meters: string[]) => void;
  meterType?: string;
  onRunStream?: (
    payload: RealtimeStreamRequest,
    callbacks?: RealtimeStreamCallbacks,
  ) => Promise<unknown>;
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
  const [realTimeData, setRealTimeData] = useState<Record<string, unknown>>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const buildEmptyRows = (meters: MeterId[]) =>
    meters.map((meter) => ({
      meter,
      time: new Date().toISOString(),
    }));

  const getReadingValue = (reading: RealtimeReadingEvent) => {
    if (reading.statuscode === -1) {
      return reading.statusmessage || "Failed";
    }
    if (reading.value === null || reading.value === undefined) {
      return "N/A";
    }
    return String(reading.value);
  };

  const upsertReading = (
    reading: RealtimeReadingEvent,
    columnByObis: Map<string, string>,
  ) => {
    const meterNo = reading.meterNo;
    if (!meterNo) return;

    const obisString = reading.obisString ?? "";
    const columnKey =
      columnByObis.get(obisString) ?? reading.desc ?? obisString ?? "value";
    const value = getReadingValue(reading);
    const timestamp = reading.timestamp ?? new Date().toISOString();

    setData((prevRows) => {
      const existingIndex = prevRows.findIndex((row) => row.meter === meterNo);
      if (existingIndex === -1) {
        return [
          ...prevRows,
          {
            meter: meterNo,
            time: timestamp,
            [columnKey]: value,
          },
        ];
      }

      return prevRows.map((row, index) =>
        index === existingIndex
          ? {
              ...row,
              time: timestamp,
              [columnKey]: value,
            }
          : row,
      );
    });
  };

  // Update real-time data when SSE data changes
  useEffect(() => {
    if (sseData && sseData.length > 0) {
      const newRealTimeData: Record<string, unknown> = {};

      sseData.forEach((dataPoint: RealTimeData) => {
        if (dataPoint.meterNo) {
          const existing =
            (newRealTimeData[dataPoint.meterNo] as Record<string, unknown>) ||
            {};
          newRealTimeData[dataPoint.meterNo] = {
            ...existing,
            ...dataPoint,
            timestamp: dataPoint.timestamp || new Date().toISOString(),
          };
        }
      });

      setRealTimeData((prevData) => ({
        ...prevData,
        ...newRealTimeData,
      }));
    }
  }, [sseData]);

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  const handleRun = async (filters: {
    hierarchy: string;
    unit: string;
    meters: MeterId[];
    reading: string[];
    obisCodes: string[];
  }) => {
    setLoading(true);
    setData(buildEmptyRows(filters.meters));
    setSelectedReading(filters.reading);

    // Notify parent component about selected meters
    if (onMeterSelection) {
      onMeterSelection(filters.meters);
    }

    try {
      if (onRunStream) {
        let receivedReading = false;
        const columnByObis = new Map(
          filters.obisCodes.map((obisCode, index) => [
            obisCode,
            filters.reading[index] ?? obisCode,
          ]),
        );

        const response = await onRunStream(
          {
            meterType: currentMeterType,
            meters: filters.meters,
            obisString: filters.obisCodes,
          },
          {
            onReading: (reading) => {
              receivedReading = true;
              upsertReading(reading, columnByObis);
              setLoading(false);
            },
            onCompleted: () => {
              setLoading(false);
            },
            onWarning: () => {
              setLoading(false);
            },
          },
        );

        const responseData =
          (response as { responsedata?: unknown })?.responsedata ?? response;
        const rows = Array.isArray(responseData) ? responseData : [];

        if (!receivedReading && rows.length > 0) {
          const newData = rows.map((item, index) => {
            const rowItem = item as Record<string, unknown>;
            const meterNo =
              (rowItem.meterNo as string) ??
              (rowItem.meterNumber as string) ??
              filters.meters[index] ??
              "N/A";

            const row: MeterData = {
              meter: meterNo,
              time: (rowItem.timestamp as string) ?? new Date().toISOString(),
            };

            filters.reading.forEach((readingCode) => {
              row[readingCode] = String(
                rowItem[readingCode] ??
                  rowItem.value ??
                  rowItem.codeValue ??
                  "N/A",
              );
            });

            return row;
          });

          setData(newData);
          setLoading(false);
          return;
        }
      }
    } catch {
      // Fall back to current UI data render logic when API errors.
    }

    // Clear any existing timeout to prevent memory leaks
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const newData = filters.meters.map((meter) => {
        // Get real-time data for the meter
        const rtData = (realTimeData[meter] as Record<string, unknown>) ?? {};

        const row: MeterData = {
          meter,
          time: (rtData.timestamp as string) ?? new Date().toISOString(),
        };

        filters.reading.forEach((r) => {
          row[r] = (rtData[r] as string) ?? "N/A";
        });

        return row;
      });
      setData(newData);
      setLoading(false);
      timeoutRef.current = null;
    }, 2000);
  };

  const getConnectionStatus = (meterId: string) => {
    return connectionStatus[meterId] ?? false;
  };

  return (
    <div className="mx-auto max-w-screen space-y-6 overflow-x-hidden px-4">
      <div className="pt-8 pb-4">
        <FilterPanel onRun={handleRun} meterType={currentMeterType} />
      </div>

      {/* Connection Status Indicator */}
      {selectedMeters.length > 0 && (
        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="mb-2 text-sm font-medium text-gray-700">
            Connection Status
          </h3>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-7">
            {selectedMeters.map((meterId) => (
              <div key={meterId} className="flex items-center space-x-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    getConnectionStatus(meterId) ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span className="text-xs text-gray-600">{meterId}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        {(loading || data.length > 0) && (
          <DataTable data={data} reading={selectedReading} loading={loading} />
        )}
      </div>
    </div>
  );
}
