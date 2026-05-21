import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useEffect, useRef } from "react";
import { env } from "@/env";
import type { MeterStatusData } from "@/hooks/use-sse";

type MeterStatusHandler = (status: MeterStatusData) => void;

const isMeterStatusData = (value: unknown): value is MeterStatusData => {
  if (!value || typeof value !== "object") return false;

  const event = value as Partial<MeterStatusData>;
  return (
    typeof event.meterNo === "string" &&
    typeof event.lastSeen === "string" &&
    (event.status === "ONLINE" ||
      event.status === "OFFLINE" ||
      event.status === "CONNECTED")
  );
};

export function useMeterStatusStream(onStatus: MeterStatusHandler) {
  const onStatusRef = useRef(onStatus);

  useEffect(() => {
    onStatusRef.current = onStatus;
  }, [onStatus]);

  useEffect(() => {
    const url = `${env.NEXT_PUBLIC_BASE_URL}/hes/service/meter-status/stream`;
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    const controller = new AbortController();

    void fetchEventSource(url, {
      method: "GET",
      signal: controller.signal,
      openWhenHidden: true,
      headers: {
        Accept: "text/event-stream",
        Authorization: `Bearer ${token}`,
        custom: env.NEXT_PUBLIC_CUSTOM_HEADER,
      },
      onopen: async (response) => {
        if (!response.ok) {
          throw new Error(`Meter status stream failed (${response.status})`);
        }
      },
      onmessage: (message) => {
        if (!message.data) return;

        try {
          const status = JSON.parse(message.data) as unknown;
          if (!isMeterStatusData(status) || status.meterNo === "SYSTEM") {
            return;
          }

          onStatusRef.current(status);
        } catch (error) {
          console.error("Failed to parse meter status event:", error);
        }
      },
      onerror: (error) => {
        console.error("Meter status stream error:", error);
      },
    }).catch((error: unknown) => {
      if (!controller.signal.aborted) {
        console.error("Meter status stream closed:", error);
      }
    });

    return () => controller.abort();
  }, []);
}
