import type { MeterStatusData, RealTimeData } from '@/hooks/use-sse';
import { env } from "@/env";

const API_URL = env.NEXT_PUBLIC_BASE_URL;

export interface SSEMeterData extends RealTimeData {
  timestamp: string;
}

export class SSEService {
  private eventSources: Map<string, EventSource> = new Map<string, EventSource>();
  private statusCallbacks: Map<string, (status: MeterStatusData) => void> = new Map<string, (status: MeterStatusData) => void>();
  private dataCallbacks: Map<string, (data: SSEMeterData) => void> = new Map<string, (data: SSEMeterData) => void>();
  private connectionStatusCallbacks: Map<string, (isConnected: boolean) => void> = new Map<string, (isConnected: boolean) => void>();

  connectToMeterStatus(meterNo: string) {
    if (this.eventSources.has(`status-${meterNo}`)) {
      this.disconnectFromMeterStatus(meterNo);
    }

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("Authentication token not found.");
      }
      const url = `${API_URL}/hes/service/meter-status/stream`;
      const eventSource = new EventSource(url); 
      this.eventSources.set(`status-${meterNo}`, eventSource);

      eventSource.onopen = (_event) => {
        console.log(`SSE meter status connected for meter ${meterNo}:`, url);
        this.connectionStatusCallbacks.get(`status-${meterNo}`)?.(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const statusData: MeterStatusData = JSON.parse(event.data);
          if (statusData.meterNo === meterNo) {
            this.statusCallbacks.get(`status-${meterNo}`)?.(statusData);
          }
        } catch (error) {
          console.error('Failed to parse meter status data:', error);
        }
      };

      eventSource.addEventListener('meter-status', (event) => {
        try {
          const statusData: MeterStatusData = JSON.parse(event.data);
          if (statusData.meterNo === meterNo) {
            this.statusCallbacks.get(`status-${meterNo}`)?.(statusData);
          }
        } catch (error) {
          console.error('Failed to parse meter-status event data:', error);
        }
      });

      eventSource.onerror = (event) => {
        console.error(`SSE meter status error for meter ${meterNo}:`, event);
        this.connectionStatusCallbacks.get(`status-${meterNo}`)?.(false);
      };

    } catch (error) {
      console.error(`Failed to connect SSE for meter ${meterNo}:`, error);
      this.connectionStatusCallbacks.get(`status-${meterNo}`)?.(false);
    }
  }
 
  connectToRealTimeData(meterNo: string) {
    if (this.eventSources.has(`data-${meterNo}`)) {
      this.disconnectFromRealTimeData(meterNo);
    }

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("Authentication token not found.");
      }
      const url = `${API_URL}/hes/service/stream`;
      const eventSource = new EventSource(url);
      this.eventSources.set(`data-${meterNo}`, eventSource);

      eventSource.onopen = (_event) => {
        console.log(`SSE real-time data connected for meter ${meterNo}:`, url);
        this.connectionStatusCallbacks.get(`data-${meterNo}`)?.(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const data: SSEMeterData = JSON.parse(event.data);
          if (data.meterNo === meterNo) {
            data.timestamp = data.timestamp || new Date().toISOString();
            this.dataCallbacks.get(`data-${meterNo}`)?.(data);
          }
        } catch (error) {
          console.error('Failed to parse real-time data:', error);
        }
      };

      eventSource.onerror = (event) => {
        console.error(`SSE real-time data error for meter ${meterNo}:`, event);
        this.connectionStatusCallbacks.get(`data-${meterNo}`)?.(false);
      };
    } catch (error) {
      console.error(`Failed to connect SSE data stream for meter ${meterNo}:`, error);
      this.connectionStatusCallbacks.get(`data-${meterNo}`)?.(false);
    }
  }

  onMeterStatus(meterNo: string, callback: (status: MeterStatusData) => void) {
    this.statusCallbacks.set(`status-${meterNo}`, callback);
  }

  onRealTimeData(meterNo: string, callback: (data: SSEMeterData) => void) {
    this.dataCallbacks.set(`data-${meterNo}`, callback);
  }

  onConnectionStatus(meterNo: string, callback: (isConnected: boolean) => void) {
    this.connectionStatusCallbacks.set(`status-${meterNo}`, callback);
    this.connectionStatusCallbacks.set(`data-${meterNo}`, callback);
  }

  disconnectFromMeterStatus(meterNo: string) {
    const eventSource = this.eventSources.get(`status-${meterNo}`);
    if (eventSource) {
      eventSource.close();
      this.eventSources.delete(`status-${meterNo}`);
      this.statusCallbacks.delete(`status-${meterNo}`);
      this.connectionStatusCallbacks.delete(`status-${meterNo}`);
    }
  }

  disconnectFromRealTimeData(meterNo: string) {
    const eventSource = this.eventSources.get(`data-${meterNo}`);
    if (eventSource) {
      eventSource.close();
      this.eventSources.delete(`data-${meterNo}`);
      this.dataCallbacks.delete(`data-${meterNo}`);
      this.connectionStatusCallbacks.delete(`data-${meterNo}`);
    }
  }

  disconnectAll() {
    this.eventSources.forEach((eventSource) => {
      eventSource.close();
    });
    this.eventSources.clear();
    this.statusCallbacks.clear();
    this.dataCallbacks.clear();
    this.connectionStatusCallbacks.clear();
  }
}

// Export a singleton instance
export const sseService = new SSEService();