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

interface ReadIPDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meter?: Meter | undefined;
}

export default function ReadIPDialog({
  isOpen,
  onClose,
  meter,
}: ReadIPDialogProps) {
  const { mutate: readMeter, data, isPending, reset } = useReadMeter();
  const [ipAddress, port] = String(data?.responsedata?.value ?? "").split(":");

  useEffect(() => {
    if (isOpen && meter?.meterNumber) {
      readMeter({ serial: meter.meter?.meterNumber, type: "READ_IP" });
    }
  }, [isOpen]);

  const isLoading = isPending ? "Loading..." : "No data available";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-fit bg-white">
        <DialogHeader>
          <DialogTitle>Read IP Address & Port</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label
              htmlFor="ip-address"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              IP Address
            </Label>
            <Input
              id="ip-address"
              type="text"
              readOnly
              value={ipAddress}
              placeholder={isLoading}
              className="w-full border border-gray-200"
            />
          </div>
          <div>
            <Label
              htmlFor="port"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Port
            </Label>
            <Input
              id="port"
              type="text"
              readOnly
              placeholder={isLoading}
              value={port}
              className="w-full border border-gray-200"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
