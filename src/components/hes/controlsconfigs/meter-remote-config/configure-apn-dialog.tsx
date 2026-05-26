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
import { useSetAPN } from "@/hooks/use-configure-meter";

interface ConfigureAPNDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meter?: Meter | undefined;
}

export default function ConfigureAPNDialog({
  isOpen,
  onClose,
  meter,
}: ConfigureAPNDialogProps) {
  const [apn, setApn] = useState("");
  const { mutate: setAPN, isPending } = useSetAPN();
  const isFormValid = apn.trim() !== "";

  const handleConfigure = () => {
    if (!meter?.meterNumber) return;
    setAPN(
      { serial: meter.meterNumber, apn },
      { onSuccess: () => { setApn(""); onClose(); } },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => { setApn(""); onClose(); }}>
      <DialogContent className="h-fit bg-white">
        <DialogHeader>
          <DialogTitle>Configure APN</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Label
            htmlFor="apn-input"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            APN &nbsp;<span className="text-red-500">*</span>
          </Label>
          <Input
            id="apn-input"
            type="text"
            value={apn}
            onChange={(e) => setApn(e.target.value)}
            placeholder="Enter APN"
            className="w-full border border-gray-200"
          />
        </div>
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => { setApn(""); onClose(); }}
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
