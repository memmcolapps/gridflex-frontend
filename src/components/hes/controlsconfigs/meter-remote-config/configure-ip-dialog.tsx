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
import { useState } from "react";
import type { Meter } from "@/types/meter";
import { useSetIpPort } from "@/hooks/use-configure-meter";

interface ConfigureIPDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meters: Meter[];
}

export default function ConfigureIPDialog({
  isOpen,
  onClose,
  meters,
}: ConfigureIPDialogProps) {
  const [ipAddress, setIpAddress] = useState("");
  const [port, setPort] = useState("");
  const isFormValid = ipAddress.trim() !== "" && port.trim() !== "";
  const { mutateAsync: IpAddress, isPending } = useSetIpPort();

  const handleConfigure = async () => {
    if (!meters || meters.length === 0) return;
    for (const meter of meters) {
      try {
        await IpAddress({
          serial: meter.meterNumber,
          ip: String(ipAddress),
          port: Number(port),
        });
      } catch (err) {
        // Error toast already shown by mutation's onError
      }
    }
    setIpAddress("");
    setPort("");
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setIpAddress("");
        setPort("");
        onClose();
      }}
    >
      <DialogContent className="h-fit bg-white">
        <DialogHeader>
          <DialogTitle>Configure IP Address & Port</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label
              htmlFor="ip-address"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              IP Address&nbsp;<span className="text-red-500">*</span>
            </Label>
            <Input
              id="ip-address"
              type="text"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              placeholder="Enter IP Address"
              className="w-full border border-gray-200"
            />
          </div>
          <div>
            <Label
              htmlFor="port"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Port <span className="text-red-500">*</span>
            </Label>
            <Input
              id="port"
              type="text"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              placeholder="Enter Port"
              className="w-full border border-gray-200"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              setIpAddress("");
              setPort("");
              onClose();
            }}
            className="cursor-pointer border-[#161CCA] text-[#161CCA]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfigure}
            disabled={!isFormValid || isPending}
            className={`bg-[#161CCA] text-white ${
              !isFormValid ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            }`}
          >
            {isPending ? "Configuring..." : "Configure"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}