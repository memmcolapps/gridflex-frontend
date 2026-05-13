import { useState, useRef, useCallback, useEffect } from "react";
import { env } from "@/env";

export interface MeterData {
  [key: string]: string;
  meter: string;
  time: string;
}

export interface RunStreamFilters {
  meterType: string;
  meters: string[];
  reading: string[];
  obisCodes: string[];
}

export function useRealtimeStream() {
  const [data, setData] = useState<MeterData[]>([]);
  const [selectedReading, setSelectedReading] = useState<string[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const obisToReadingKeyRef = useRef<Record<string, string>>({});
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const wallClockRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const filtersRef = useRef<{ meters: string[]; reading: string[] }>({
    meters: [],
    reading: [],
  });

  const stop = useCallback(() => {
    if (wallClockRef.current) {
      clearTimeout(wallClockRef.current);
      wallClockRef.current = null;
    }
    readerRef.current?.cancel().catch(() => undefined);
    readerRef.current = null;
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
  }, []);

  // Hard ceiling on a single realtime read. If the stream never sends a terminal
  // event (network wedge, proxy crash, etc) this guarantees the spinner stops.
  const WALL_CLOCK_TIMEOUT_MS = 90_000;

  useEffect(() => () => stop(), [stop]);

  const run = useCallback(async (filters: RunStreamFilters) => {
    stop();
    setError(null);
    setSelectedReading(filters.reading);
    filtersRef.current = { meters: filters.meters, reading: filters.reading };

    const obisMap: Record<string, string> = {};
    filters.obisCodes.forEach((obis, i) => {
      if (filters.reading[i]) obisMap[obis] = filters.reading[i]!;
    });
    obisToReadingKeyRef.current = obisMap;

    const initialRows: MeterData[] = filters.meters.map(meter => {
      const row: MeterData = { meter, time: "—" };
      filters.reading.forEach(r => {
        row[r] = "";
        row[`${r}__status`] = "";
        row[`${r}__loading`] = "true";
      });
      return row;
    });
    setData(initialRows);
    setIsStreaming(true);

    const token = localStorage.getItem("auth_token");

    const controller = new AbortController();
    abortRef.current = controller;
    wallClockRef.current = setTimeout(() => {
      setError("Realtime read timed out");
      controller.abort();
    }, WALL_CLOCK_TIMEOUT_MS);

    // Mark every still-loading cell as failed so the UI never spins after a terminal event.
    const finalizePending = (reason: string) => {
      setData(prev => {
        const { reading } = filtersRef.current;
        return prev.map(row => {
          const next: MeterData = { ...row };
          for (const rk of reading) {
            if (next[`${rk}__loading`] === "true") {
              next[rk] = reason;
              next[`${rk}__status`] = "-1";
              next[`${rk}__loading`] = "false";
            }
          }
          return next;
        });
      });
    };

    const applyReading = (parsed: Record<string, unknown>) => {
      const meterNo = parsed.meterNo as string | undefined;
      const obisString = parsed.obisString as string | undefined;
      const statuscode = parsed.statuscode as number | undefined;
      const value = parsed.value as string | undefined;
      const statusmessage = parsed.statusmessage as string | undefined;
      const timestamp = parsed.timestamp as string | undefined;

      if (!meterNo || !obisString) return;
      const readingKey = obisToReadingKeyRef.current[obisString];
      if (!readingKey) return;

      setData(prev => {
        const next = prev.map(row => ({ ...row }));
        const rowIdx = next.findIndex(r => r.meter === meterNo);
        if (rowIdx === -1) return prev;

        const row = next[rowIdx]!;
        const resolvedValue =
          statuscode === -1 ? (statusmessage ?? "Failed") : (value ?? "N/A");

        next[rowIdx] = {
          ...row,
          time:
            statuscode === 0 && timestamp && row.time === "—"
              ? timestamp
              : row.time,
          [readingKey]: resolvedValue,
          [`${readingKey}__status`]: String(statuscode ?? -1),
          [`${readingKey}__loading`]: "false",
        };
        return next;
      });
    };

    try {
      const response = await fetch(
        `${env.NEXT_PUBLIC_BASE_URL}/hes/service/stream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token ?? ""}`,
            custom: env.NEXT_PUBLIC_CUSTOM_HEADER ?? "",
            Accept: "text/event-stream",
          },
          body: JSON.stringify({
            meterType: filters.meterType,
            meters: filters.meters,
            obisString: filters.obisCodes,
          }),
          signal: controller.signal,
        }
      );

      if (!response.ok || !response.body) {
        setError(`Stream failed: ${response.status}`);
        finalizePending("No response");
        return;
      }

      const reader = response.body.getReader();
      readerRef.current = reader;
      const decoder = new TextDecoder();
      let buffer = "";

      // Per-frame state for proper SSE parsing (frames are \n\n-separated).
      let currentEvent: string | null = null;
      const currentData: string[] = [];

      const dispatch = (eventName: string, data: string) => {
        if (!data) return;
        let parsed: Record<string, unknown>;
        try {
          parsed = JSON.parse(data) as Record<string, unknown>;
        } catch {
          return;
        }

        switch (eventName) {
          case "reading":
          case "message":
            applyReading(parsed);
            break;
          case "completed":
            finalizePending("No response");
            stop();
            break;
          case "warning":
            setError(
              typeof parsed.statusmessage === "string"
                ? parsed.statusmessage
                : "Realtime read warning"
            );
            finalizePending("Timed out");
            stop();
            break;
          case "heartbeat":
          default:
            // ignore
            break;
        }
      };

      const flushFrame = () => {
        if (currentEvent === null && currentData.length === 0) return;
        const eventName = currentEvent ?? "message";
        const data = currentData.join("\n");
        currentEvent = null;
        currentData.length = 0;
        dispatch(eventName, data);
      };

      const processLine = (line: string) => {
        if (line === "") {
          flushFrame();
          return;
        }
        if (line.startsWith(":")) return; // comment
        const colonIdx = line.indexOf(":");
        const field = colonIdx === -1 ? line : line.slice(0, colonIdx);
        const rawVal = colonIdx === -1 ? "" : line.slice(colonIdx + 1);
        const val = rawVal.startsWith(" ") ? rawVal.slice(1) : rawVal;
        if (field === "event") currentEvent = val;
        else if (field === "data") currentData.push(val);
        // id/retry intentionally ignored
      };

      while (true) {
        const { done, value: chunk } = await reader.read();
        if (done) break;

        buffer += decoder.decode(chunk, { stream: true });
        let nlIdx;
        while ((nlIdx = buffer.indexOf("\n")) !== -1) {
          const line = buffer.slice(0, nlIdx).replace(/\r$/, "");
          buffer = buffer.slice(nlIdx + 1);
          processLine(line);
        }
      }
      if (buffer.length > 0) processLine(buffer.replace(/\r$/, ""));
      flushFrame();
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError(err.message);
        console.error("Stream error:", err);
      }
      finalizePending("Connection lost");
    } finally {
      if (wallClockRef.current) {
        clearTimeout(wallClockRef.current);
        wallClockRef.current = null;
      }
      abortRef.current = null;
      setIsStreaming(false);
    }
  }, [stop]);

  const reset = useCallback(() => {
    stop();
    setData([]);
    setSelectedReading([]);
    setError(null);
  }, [stop]);

  return {
    data,
    selectedReading,
    isStreaming,
    error,
    run,
    stop,
    reset,
  };
}
