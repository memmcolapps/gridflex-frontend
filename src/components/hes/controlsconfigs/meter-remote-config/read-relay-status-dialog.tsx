"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useReadMeter } from "@/hooks/use-configure-meter";
import type { Meter } from "@/types/meter";
import { useEffect } from "react";

interface ReadRelayStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meter?: Meter | undefined;
}

export default function ReadRelayStatusDialog({
  isOpen,
  onClose,
  meter,
}: ReadRelayStatusDialogProps) {
  const { mutate: readMeter, data, isPending, reset } = useReadMeter();

  useEffect(() => {
    if (isOpen && meter?.meter?.meterNumber) {
      readMeter({ serial: meter.meter?.meterNumber, type: "relay" });
    }
  }, [isOpen]);

  const relayValue = String(data?.responsedata?.value ?? "");
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-fit bg-white">
        <DialogHeader>
          <DialogTitle>Read Relay Status</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Label
            htmlFor="relay-status"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Relay Status
          </Label>
          <Input
            id="relay-status"
            type="text"
            readOnly
            placeholder={isPending ? "Loading..." : "No data available"}
            value={relayValue}
            className="w-full border border-gray-200"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}