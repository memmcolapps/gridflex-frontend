import { useState, useEffect, useRef } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { env } from '@/env';

export interface MeterStatusData {
  meterNo: string;
  lastSeen: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'UNKNOWN';
}

export interface RealTimeData {
  meterNo: string;
  timestamp: string;
  [key: string]: unknown; // For dynamic meter readings
}

export interface SSEHookOptions {
  onMessage?: (data: Record<string, unknown>) => void;
  onError?: (error: Event) => void;
  onOpen?: (event: Event) => void;
  reconnectInterval?: number;
  reconnectAttempts?: number;
}

export function useSSE(
  url: string,
  options: SSEHookOptions = {},
  enabled = true
): {
  data: Record<string, unknown>[];
  isConnected: boolean;
  error: string | null;
  reconnect: () => void;
  close: () => void;
} {
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptRef = useRef(0);
  
  const {
    onMessage,
    onError,
    onOpen,
    reconnectInterval = 5000,
    reconnectAttempts = 5
  } = options;

  const reconnect = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setError(null);
    reconnectAttemptRef.current = 0;
    connect();
  };

  const close = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsConnected(false);
  };

  const connect = () => {
    if (!url) return;
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('auth_token');
    if (!token) {
      setError('Authentication token not found');
      setIsConnected(false);
      return;
    }

    try {
      const controller = new AbortController();
      abortControllerRef.current = controller;

      void fetchEventSource(url, {
        method: 'GET',
        headers: {
          Accept: 'text/event-stream',
          Authorization: `Bearer ${token}`,
          custom: env.NEXT_PUBLIC_CUSTOM_HEADER,
        },
        signal: controller.signal,
        openWhenHidden: true,
        onopen: async (response) => {
          if (!response.ok) {
            throw new Error(`Connection failed with status ${response.status}`);
          }
          setIsConnected(true);
          setError(null);
          reconnectAttemptRef.current = 0;
          onOpen?.(new Event('open'));
        },
        onmessage: (event) => {
          try {
            const parsedData = JSON.parse(event.data);
            if (event.event === 'meter-status') {
              setData(prev => [...prev, { type: 'meter-status', ...parsedData }]);
            } else {
              setData(prev => [...prev, parsedData]);
            }
            onMessage?.(parsedData);
          } catch (err) {
            console.error('Failed to parse SSE data:', err);
          }
        },
        onclose: () => {
          throw new Error('SSE connection closed');
        },
        onerror: (err) => {
          throw err;
        },
      }).catch(() => {
        if (controller.signal.aborted) return;
        setIsConnected(false);
        setError('Connection failed');
        onError?.(new Event('error'));

        const shouldReconnect =
          reconnectAttempts === 0 ||
          reconnectAttemptRef.current < reconnectAttempts;

        if (shouldReconnect) {
          reconnectAttemptRef.current += 1;
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      });
    } catch (err) {
      console.error('Failed to create EventSource:', err);
      setError('Failed to connect');
      setIsConnected(false);
    }
  };

  useEffect(() => {
    if (!enabled || !url) {
      return;
    }

    connect();

    return () => {
      close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, enabled]);

  return {
    data,
    isConnected,
    error,
    reconnect,
    close
  };
}