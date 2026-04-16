/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
import React, { useState, useEffect, useRef } from 'react';
import { FilterPanel } from './FilterPanel';
import { DataTable } from './DataTable';
import type { RealTimeData } from '@/hooks/use-sse';
import type { RealtimeStreamRequest } from '@/service/hes-service';

type MeterId = string;

interface MeterData {
    [key: string]: string;
    meter: string;
    time: string;
}

interface RealTimeDataTableProps {
    sseData?: RealTimeData[];
    connectionStatus?: {[key: string]: boolean};
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
    meterType: currentMeterType = 'MD',
    onRunStream
}: RealTimeDataTableProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<MeterData[]>([]);
    const [selectedReading, setSelectedReading] = useState<string[]>([]);
    const [realTimeData, setRealTimeData] = useState<Record<string, unknown>>({});
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Update real-time data when SSE data changes
    useEffect(() => {
        if (sseData && sseData.length > 0) {
            const newRealTimeData: Record<string, unknown> = {};
            
            sseData.forEach((dataPoint: RealTimeData) => {
                if (dataPoint.meterNo) {
                    const existing = (newRealTimeData[dataPoint.meterNo] as Record<string, unknown>) || {};
                    newRealTimeData[dataPoint.meterNo] = {
                        ...existing,
                        ...dataPoint,
                        timestamp: dataPoint.timestamp || new Date().toISOString(),
                    };
                }
            });
            
            setRealTimeData(prevData => ({
                ...prevData,
                ...newRealTimeData
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
        setData([]);
        setSelectedReading(filters.reading);
        
        // Notify parent component about selected meters
        if (onMeterSelection) {
            onMeterSelection(filters.meters);
        }

        try {
            if (onRunStream) {
                const response = await onRunStream({
                    meterType: currentMeterType,
                    meters: filters.meters.map((meterNumber) => ({ meterNumber })),
                    obisCode: filters.obisCodes.map((code) => ({ code })),
                });

                const responseData = (response as { responsedata?: unknown })?.responsedata ?? response;
                const rows = Array.isArray(responseData) ? responseData : [];

                if (rows.length > 0) {
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
            const newData = filters.meters.map(meter => {
                // Get real-time data for the meter
                const rtData = (realTimeData[meter] as Record<string, unknown>) ?? {};

                const row: MeterData = {
                    meter,
                    time: (rtData.timestamp as string) ?? new Date().toISOString(),
                };

                filters.reading.forEach(r => {
                    row[r] = (rtData[r] as string) ?? 'N/A';
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
        <div className="mx-auto max-w-screen overflow-x-hidden px-4 space-y-6">
            <div className="py-8">
                <FilterPanel onRun={handleRun} />
            </div>
            
            {/* Connection Status Indicator */}
            {selectedMeters.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Connection Status</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                        {selectedMeters.map(meterId => (
                            <div key={meterId} className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${
                                    getConnectionStatus(meterId) ? 'bg-green-500' : 'bg-red-500'
                                }`} />
                                <span className="text-xs text-gray-600">{meterId}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            <div className="py-8">
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