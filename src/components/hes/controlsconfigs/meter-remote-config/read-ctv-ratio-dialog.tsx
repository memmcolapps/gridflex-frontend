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

interface ReadCTVTRatioDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meter?: Meter | undefined;
}

export default function ReadCTVTRatioDialog({
  isOpen,
  onClose,
  meter,
}: ReadCTVTRatioDialogProps) {
  const { mutate: readMeter, data, isPending, reset } = useReadMeter();

  useEffect(() => {
    if (isOpen && meter?.meterNumber) {
      readMeter({ serial: meter.meter?.meterNumber, type: "READ_RATIO" });
    }
  }, [isOpen]);

  const responseValue = Array.isArray(data?.responsedata) ? data.responsedata : [];

  const getValueByDescription = (description: string): string => {
    const item = responseValue.find(
      (entry: { description: string; value: number }) =>
        entry.description?.toLowerCase() === description.toLowerCase()
    );
    return item?.value !== undefined ? String(item.value) : "";
  };

  const ctNumerator = getValueByDescription("Numerator of CT ratio");
  const ctDenominator = getValueByDescription("Denominator of CT ratio");
  const vtNumerator = getValueByDescription("Numerator of PT ratio");
  const vtDenominator = getValueByDescription("Denominator of PT ratio");

  const isLoading = isPending ? "Loading..." : "No data available";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-fit bg-white">
        <DialogHeader>
          <DialogTitle>Read CT & VT Ratio</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex gap-4">
            <div className="w-1/2">
              <Label
                htmlFor="ct-numerator"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                CT Numerator
              </Label>
              <Input
                id="ct-numerator"
                type="text"
                readOnly
                value={ctNumerator}
                placeholder={isLoading}
                className="w-full border border-gray-200"
              />
            </div>
            <div className="w-1/2">
              <Label
                htmlFor="ct-denominator"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                CT Denominator
              </Label>
              <Input
                id="ct-denominator"
                type="text"
                readOnly
                value={ctDenominator}
                placeholder={isLoading}
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
                VT Numerator
              </Label>
              <Input
                id="vt-numerator"
                type="text"
                readOnly
                value={vtNumerator}
                placeholder={isLoading}
                className="w-full border border-gray-200"
              />
            </div>
            <div className="w-1/2">
              <Label
                htmlFor="vt-denominator"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                VT Denominator
              </Label>
              <Input
                id="vt-denominator"
                type="text"
                readOnly
                value={vtDenominator}
                placeholder={isLoading}
                className="w-full border border-gray-200"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}