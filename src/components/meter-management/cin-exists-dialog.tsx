"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import type { MeterAPIItem } from "@/service/assign-meter-service";

interface CinExistsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  existingMeter: MeterAPIItem | null;
  onProceed: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function CinExistsDialog({
  isOpen,
  onOpenChange,
  existingMeter,
  onProceed,
  onCancel,
  isSubmitting,
}: CinExistsDialogProps) {
  const customer = existingMeter?.customer;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="h-fit max-w-md bg-white text-black">
        <DialogHeader>
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-yellow-100 p-3">
              <AlertTriangle size={24} className="text-yellow-600" />
            </div>
          </div>
          <DialogTitle className="text-center font-semibold">
            CIN Already Registered
          </DialogTitle>
          <DialogDescription className="text-center">
            This CIN already exists on another meter.
          </DialogDescription>
        </DialogHeader>

        {existingMeter && (
          <div className="my-4 space-y-3 rounded-lg bg-gray-50 p-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-600">CIN:</span>
              <span className="font-medium">{existingMeter.cin}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-600">Meter Number:</span>
              <span className="font-medium">{existingMeter.meterNumber}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-600">Customer ID:</span>
              <span className="font-medium">{existingMeter.customerId}</span>
            </div>
            {customer && (
              <>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-600">Customer Name:</span>
                  <span className="font-medium">
                    {customer.firstname} {customer.lastname}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{customer.phoneNumber}</span>
                </div>
              </>
            )}
          </div>
        )}

        <p className="text-center text-sm text-gray-600">
          Would you like to continue and assign this meter?
        </p>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={onCancel}
            className="cursor-pointer border border-gray-300 text-gray-700"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={onProceed}
            className="cursor-pointer bg-[#161CCA] text-white hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
