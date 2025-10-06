"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import type { MeterInventoryItem } from "@/types/meter-inventory";
import type { VirtualMeterData } from "@/types/meter";

interface ConfirmationModalDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCustomer:  MeterInventoryItem| VirtualMeterData | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationModalDialog({
  isOpen,
  onOpenChange,
  selectedCustomer,
  onConfirm,
  onCancel,
}: ConfirmationModalDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white text-black h-fit" style={{ width: "400px", maxWidth: "none" }}>
        <DialogHeader>
          <div className="flex justify-items-start mb-4">
            <div className="bg-blue-100 rounded-full p-3">
              <AlertTriangle size={24} className="text-[#161CCA]" />
            </div>
          </div>
          <DialogTitle className="font-semibold">Assign meter</DialogTitle>
          <DialogDescription>
            Are you sure you want to assign actual meter to <br />
            <span>{selectedCustomer?.customerId}</span>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onCancel}
            className="border border-[#161CCA] text-[#161CCA] cursor-pointer"
          >
            Cancel
          </Button>
          <Button onClick={onConfirm} className="bg-[#161CCA] text-white cursor-pointer">
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}