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
  const filtersRef = useRef<{ meters: string[]; reading: string[] }>({
    meters: [],
    reading: [],
  });

  const stop = useCallback(() => {
    readerRef.current?.cancel();
    readerRef.current = null;
    setIsStreaming(false);
  }, []);

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

    try {
      const response = await fetch(
        `${env.NEXT_PUBLIC_BASE_URL}/hes/service/stream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token ?? ""}`,
            custom: env.NEXT_PUBLIC_CUSTOM_HEADER,
            Accept: "text/event-stream",
          },
          body: JSON.stringify({
            meterType: filters.meterType,
            meters: filters.meters,
            obisString: filters.obisCodes,
          }),
        }
      );

      if (!response.ok || !response.body) {
        setError(`Stream failed: ${response.status}`);
        setIsStreaming(false);
        return;
      }

      const reader = response.body.getReader();
      readerRef.current = reader;
      const decoder = new TextDecoder();
      let buffer = "";

      const processLine = (line: string) => {
        if (!line.startsWith("data:")) return;

        const jsonStr = line.slice(5).trim();
        if (!jsonStr) return;

        let parsed: Record<string, unknown>;
        try {
          parsed = JSON.parse(jsonStr) as Record<string, unknown>;
        } catch {
          return;
        }

        const meterNo = parsed.meterNo as string;
        const obisString = parsed.obisString as string;
        const statuscode = parsed.statuscode as number;
        const value = parsed.value as string | undefined;
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
            statuscode === -1 || value === undefined ? "N/A" : value;

          next[rowIdx] = {
            ...row,
            time:
              statuscode === 0 && timestamp && row.time === "—"
                ? timestamp
                : row.time,
            [readingKey]: resolvedValue,
            [`${readingKey}__status`]: String(statuscode),
            [`${readingKey}__loading`]: "false",
          };

          const { reading } = filtersRef.current;
          const allDone = next.every(r =>
            reading.every(rk => r[`${rk}__loading`] === "false")
          );
          if (allDone) setTimeout(() => stop(), 0);

          return next;
        });
      };

      while (true) {
        const { done, value: chunk } = await reader.read();
        if (done) break;

        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) processLine(line.trim());
      }

      if (buffer.trim()) processLine(buffer.trim());

    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError(err.message);
        console.error("Stream error:", err);
      }
    } finally {
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