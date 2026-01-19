import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSSE } from './use-sse';
import { env } from '@/env';
import { useState, useEffect } from 'react';
import { MeterStatusData, RealTimeData } from './use-sse';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};


// Types for our query data
export interface MeterConnectionStatus {
  [meterNo: string]: boolean;
}

export interface SSEDataPoint {
  id: string;
  timestamp: string;
  data: any;
  type: 'meter-status' | 'real-time-data';
}

// Query key factory
export const hesQueryKeys = {
  all: ['hes'] as const,
  realtimeData: (meterNo?: string) => [...hesQueryKeys.all, 'realtime-data', meterNo] as const,
  connectionStatus: (meterNo?: string) => [...hesQueryKeys.all, 'connection-status', meterNo] as const,
  sseStream: () => [...hesQueryKeys.all, 'sse-stream'] as const,
} as const;

// Custom hook for managing SSE connection
export function useSSEManagement() {
  const baseUrl = env.NEXT_PUBLIC_BASE_URL;
  const queryClient = useQueryClient();
  const [connectionStatus, setConnectionStatus] = useState<MeterConnectionStatus>({});
  
  // Get auth token
  const authToken = getAuthToken();

  return {
    baseUrl,
    connectionStatus,
    setConnectionStatus
  };
}

// Custom hook for managing individual meter connections
export function useMeterConnections(selectedMeters: string[]) {
  const { baseUrl, connectionStatus, setConnectionStatus } = useSSEManagement();
  const queryClient = useQueryClient();

  // SSE for meter status
  const statusUrl = baseUrl ? `${baseUrl}/hes/service/meter-status/stream` : '';
  const { data: statusData, isConnected: statusConnected, error: statusError } = useSSE(statusUrl, {
    onOpen: () => {
      console.log('Meter status SSE connected');
      setConnectionStatus(prev => {
        const newStatus = { ...prev };
        selectedMeters.forEach(meterNo => {
          newStatus[meterNo] = true;
        });
        return newStatus;
      });
    },
    onError: () => {
      console.log('Meter status SSE error');
      setConnectionStatus(prev => {
        const newStatus = { ...prev };
        selectedMeters.forEach(meterNo => {
          newStatus[meterNo] = false;
        });
        return newStatus;
      });
    },
    onMessage: (parsedData) => {
      if (parsedData.meterNo && selectedMeters.includes(parsedData.meterNo)) {
        const status: MeterStatusData = parsedData;
        console.log(`Meter ${parsedData.meterNo} status:`, status);
        setConnectionStatus(prev => ({
          ...prev,
          [parsedData.meterNo]: status.status === 'CONNECTED'
        }));

        // Update query cache
        queryClient.setQueryData(
          hesQueryKeys.connectionStatus(parsedData.meterNo),
          status.status === 'CONNECTED'
        );
      }
    }
  });

  // SSE for real-time data
  const dataUrl = baseUrl ? `${baseUrl}/hes/service/stream` : '';
  const { data: realtimeData, isConnected: dataConnected, error: dataError } = useSSE(dataUrl, {
    onOpen: () => {
      console.log('Real-time data SSE connected');
      setConnectionStatus(prev => {
        const newStatus = { ...prev };
        selectedMeters.forEach(meterNo => {
          newStatus[meterNo] = true;
        });
        return newStatus;
      });
    },
    onError: () => {
      console.log('Real-time data SSE error');
      setConnectionStatus(prev => {
        const newStatus = { ...prev };
        selectedMeters.forEach(meterNo => {
          newStatus[meterNo] = false;
        });
        return newStatus;
      });
    },
    onMessage: (parsedData) => {
      if (parsedData.meterNo && selectedMeters.includes(parsedData.meterNo)) {
        const data: RealTimeData = parsedData;
        console.log(`Meter ${parsedData.meterNo} real-time data:`, data);

        // Update query cache with new real-time data
        queryClient.setQueryData(
          hesQueryKeys.realtimeData(parsedData.meterNo),
          (oldData: any) => ({
            ...oldData,
            ...data,
            timestamp: data.timestamp || new Date().toISOString(),
          })
        );
      }
    }
  });

  useEffect(() => {
    // Update connection status in query cache
    selectedMeters.forEach(meterNo => {
      queryClient.setQueryData(
        hesQueryKeys.connectionStatus(meterNo),
        connectionStatus[meterNo] || false
      );
    });
  }, [selectedMeters, connectionStatus, queryClient]);

  return {
    connectionStatus,
    isConnected: Object.values(connectionStatus).some(status => status),
    baseUrl
  };
}

// Query hook for fetching meter data (if needed for initial data)
export function useMeterData(meterNo?: string, enabled: boolean = true) {
  const { baseUrl } = useSSEManagement();
  const authToken = getAuthToken();

  return useQuery({
    queryKey: hesQueryKeys.realtimeData(meterNo),
    queryFn: async () => {
      if (!baseUrl || !meterNo || !authToken) return null;

      // This would be a regular HTTP request if needed for initial data
      // For now, we're using SSE, so this might not be necessary
      const response = await fetch(`${baseUrl}/hes/service/stream`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'custom': env.NEXT_PUBLIC_CUSTOM_HEADER,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch meter data');
      return response.json();
    },
    enabled: enabled && !!baseUrl && !!meterNo && !!authToken,
    staleTime: 30000, // Consider data stale after 30 seconds
    refetchInterval: 60000, // Refetch every minute as backup
  });
}


// Hook for managing connection status across all meters
export function useConnectionStatus() {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: hesQueryKeys.connectionStatus(),
    queryFn: async () => {
      // This could be an API call to get overall connection status
      // For now, we'll get it from the SSE service state
      return {};
    },
    staleTime: 10000,
    refetchInterval: 15000,
  });
}