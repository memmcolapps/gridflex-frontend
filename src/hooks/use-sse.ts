import { useState, useEffect, useRef } from 'react';

export interface MeterStatusData {
  meterNo: string;
  lastSeen: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'UNKNOWN';
}

export interface RealTimeData {
  meterNo: string;
  timestamp: string;
  [key: string]: any; // For dynamic meter readings
}

export interface SSEHookOptions {
  onMessage?: (data: any) => void;
  onError?: (error: Event) => void;
  onOpen?: (event: Event) => void;
  reconnectInterval?: number;
  reconnectAttempts?: number;
}

export function useSSE(
  url: string,
  options: SSEHookOptions = {}
): {
  data: any[];
  isConnected: boolean;
  error: string | null;
  reconnect: () => void;
  close: () => void;
} {
  const [data, setData] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const {
    onMessage,
    onError,
    onOpen,
    reconnectInterval = 5000,
    reconnectAttempts = 5
  } = options;

  const reconnect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    setError(null);
    connect();
  };

  const close = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsConnected(false);
  };

  const connect = () => {
    try {
      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      eventSource.onopen = (event) => {
        console.log('SSE connected:', url);
        setIsConnected(true);
        setError(null);
        onOpen?.(event);
      };

      eventSource.onmessage = (event) => {
        console.log('SSE message received:', event.data);
        try {
          const parsedData = JSON.parse(event.data);
          setData(prev => [...prev, parsedData]);
          onMessage?.(parsedData);
        } catch (err) {
          console.error('Failed to parse SSE data:', err);
        }
      };

      eventSource.addEventListener('meter-status', (event) => {
        console.log('Meter status event:', event.data);
        try {
          const parsedData = JSON.parse(event.data);
          setData(prev => [...prev, { type: 'meter-status', ...parsedData }]);
          onMessage?.(parsedData);
        } catch (err) {
          console.error('Failed parse meter-status data:', err);
        }
      });

      eventSource.onerror = (event) => {
        console.error('SSE error:', event);
        setIsConnected(false);
        const errorMsg = 'Connection failed';
        setError(errorMsg);
        onError?.(event);

        // Attempt to reconnect
        if (reconnectAttempts > 0) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('Attempting to reconnect...');
            reconnect();
          }, reconnectInterval);
        }
      };
    } catch (err) {
      console.error('Failed to create EventSource:', err);
      setError('Failed to connect');
      setIsConnected(false);
    }
  };

  useEffect(() => {
    connect();

    return () => {
      close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return {
    data,
    isConnected,
    error,
    reconnect,
    close
  };
}