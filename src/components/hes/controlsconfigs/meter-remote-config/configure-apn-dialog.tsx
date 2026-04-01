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

// interface Meter {
//     id: string;
//     name?: string;
//     // Add other properties as needed
// }

interface ConfigureAPNDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meter?: Meter | undefined; // Replaced 'any' with 'Meter'
}

export default function ConfigureAPNDialog({
  isOpen,
  onClose,
  meter,
}: ConfigureAPNDialogProps) {
  const [apn, setApn] = useState("");

  const { mutate: setAPN, isPending } = useSetAPN();

  // Check if the APN field is filled
  const isFormValid = apn.trim() !== "";

  const handleConfigure = () => {
    // Handle APN configuration logic
    if (!meter?.meterNumber) return;

    setAPN(
      {
        serials: meter?.meterNumber,
        apn,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
    // console.log("Configuring APN:", { apn, meter });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
            onClick={onClose}
            className="cursor-pointer border-[#161CCA] text-[#161CCA]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfigure}
            disabled={!isFormValid} // Disable when form is invalid
            className={`bg-[#161CCA] text-white ${
              !isFormValid ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            }`}
          >
            Configure
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
