"use client";

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

interface ReadCreditBalanceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meter?: Meter | undefined;
}

export default function ReadCreditBalanceDialog({
  isOpen,
  onClose,
  meter,
}: ReadCreditBalanceDialogProps) {
  const { mutate: readMeter, data, isPending, reset } = useReadMeter();

  useEffect(() => {
    if (isOpen && meter?.meter?.meterNumber) {
      readMeter({ serial: meter.meter?.meterNumber, type: "READ_PUBLIC_CREDIT" });
    }
    if (!isOpen) reset();
  }, [isOpen]);

  const responsedata = data?.responsedata;
  const creditBalance = responsedata && !Array.isArray(responsedata) ? String(responsedata.value ?? "") : "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-fit bg-white">
        <DialogHeader>
          <DialogTitle>Read Credit Balance</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Label
            htmlFor="credit-balance"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Credit Balance
          </Label>
          <Input
            id="credit-balance"
            type="text"
            readOnly
            placeholder={isPending ? "Loading..." : "No data available"}
            value={creditBalance}
            className="w-full border border-gray-200"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
