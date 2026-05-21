import { useState, useEffect, useRef } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { env } from "@/env";

export interface RealTimeData {
  meterNo: string;
  obisString: string;
  value?: string;
  statuscode: number;
  timestamp: string;
  desc?: string;
}

export interface MeterStatusData {
  meterNo: string;
  status: "ONLINE" | "OFFLINE" | "CONNECTED";
  lastSeen: string;
}

export function useSSE(
  url: string,
  p0: {
    onOpen: () => void;
    onError: () => void;
    onMessage: (data: unknown) => void;
    reconnectAttempts: number;
  },
  enabled = true,
) {
  const [data, setData] = useState<RealTimeData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const controllerRef = useRef<AbortController | null>(null);

  const connect = () => {
    if (!url || typeof window === "undefined") return;

    const token = localStorage.getItem("auth_token");

    const controller = new AbortController();
    controllerRef.current = controller;

    fetchEventSource(url, {
      method: "GET",
      signal: controller.signal,
      headers: {
        Accept: "text/event-stream",
        Authorization: `Bearer ${token}`,
        custom: env.NEXT_PUBLIC_CUSTOM_HEADER,
      },

      onopen: async (res) => {
        if (!res.ok) throw new Error("SSE failed");
        setIsConnected(true);
        setError(null);
      },

      onmessage: (event) => {
        try {
          if (!event.data) return;

          const parsed = JSON.parse(event.data);

          const normalized: RealTimeData = {
            meterNo: parsed.meterNo,
            obisString: parsed.obisString,
            value: parsed.value,
            statuscode: parsed.statuscode,
            timestamp: parsed.timestamp,
            desc: parsed.desc,
          };

          setData((prev) => [...prev, normalized]);
        } catch (e) {
          console.error("SSE parse error:", e);
        }
      },

      onerror: () => {
        setIsConnected(false);
        setError("SSE error");
        throw new Error("SSE crashed");
      },
    });
  };

  useEffect(() => {
    if (enabled) connect();

    return () => {
      controllerRef.current?.abort();
    };
  }, [url, enabled]);

  return { data, isConnected, error };
}
