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
import { useSetCTPTRatio } from "@/hooks/use-configure-meter";

// interface Meter {
//     id: string;
//     name?: string;
//     // Add other properties as needed
// }

interface ConfigureCTVTRatioDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meter: Meter | undefined; // Replaced 'any' with 'Meter'
}

export default function ConfigureCTVTRatioDialog({
  isOpen,
  onClose,
  meter,
}: ConfigureCTVTRatioDialogProps) {
  const [ctNumerator, setCtNumerator] = useState("");
  const [ctDenominator, setCtDenominator] = useState("");
  const [vtNumerator, setVtNumerator] = useState("");
  const [vtDenominator, setVtDenominator] = useState("");

  const { mutate: setCTPTRatio, isPending } = useSetCTPTRatio();

  // Check if all required fields are filled
  const isFormValid =
    ctNumerator.trim() !== "" &&
    ctDenominator.trim() !== "" &&
    vtNumerator.trim() !== "" &&
    vtDenominator.trim() !== "";

  const handleConfigure = () => {
    // Handle CT & VT Ratio configuration logic
    if (!meter?.meterNumber) return;

    setCTPTRatio(
      {
        serials: meter?.meterNumber,
        ctNumerator: Number(ctNumerator),
        ctDenominator: Number(ctDenominator),
        ptNumerator: Number(vtNumerator),
        ptDenominator: Number(vtDenominator),
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
    // console.log("Configuring CT & VT Ratio:", { ctNumerator, ctDenominator, vtNumerator, vtDenominator, meter });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-fit bg-white">
        <DialogHeader>
          <DialogTitle>Configure CT & VT Ratio</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex gap-4">
            <div className="w-1/2">
              <Label
                htmlFor="ct-numerator"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                CT Numerator <span className="text-red-600">*</span>
              </Label>
              <Input
                id="ct-numerator"
                type="text"
                value={ctNumerator}
                onChange={(e) => setCtNumerator(e.target.value)}
                placeholder="Enter CT Numerator"
                className="w-full border border-gray-200"
              />
            </div>
            <div className="w-1/2">
              <Label
                htmlFor="ct-denominator"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                CT Denominator <span className="text-red-600">*</span>
              </Label>
              <Input
                id="ct-denominator"
                type="text"
                value={ctDenominator}
                onChange={(e) => setCtDenominator(e.target.value)}
                placeholder="Enter CT Denominator"
                className="w-full border border-gray-200"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <Label
                htmlFor="vt-numerator"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                VT Numerator <span className="text-red-600">*</span>
              </Label>
              <Input
                id="vt-numerator"
                type="text"
                value={vtNumerator}
                onChange={(e) => setVtNumerator(e.target.value)}
                placeholder="Enter VT Numerator"
                className="w-full border border-gray-200"
              />
            </div>
            <div className="w-1/2">
              <Label
                htmlFor="vt-denominator"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                VT Denominator <span className="text-red-600">*</span>
              </Label>
              <Input
                id="vt-denominator"
                type="text"
                value={vtDenominator}
                onChange={(e) => setVtDenominator(e.target.value)}
                placeholder="Enter VT Denominator"
                className="w-full border border-gray-200"
              />
            </div>
          </div>
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
