"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DetachMeterDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  detachReason: string;
  setDetachReason: (value: string) => void;
  onProceed: () => void;
  onCancel: () => void;
}

export function DetachMeterDialog({
  isOpen,
  onOpenChange,
  detachReason,
  setDetachReason,
  onProceed,
  onCancel,
}: DetachMeterDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white text-black h-fit">
        <DialogHeader>
          <DialogTitle>Detach Meter</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>
              Reason <span className="text-red-500">*</span>
            </Label>
            <Input
              value={detachReason}
              onChange={(e) => setDetachReason(e.target.value)}
              placeholder="Enter reason for detaching meter"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-[#F50202] text-[#F50202] bg-white cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={onProceed}
            disabled={!detachReason.trim()}
            className={
              detachReason.trim()
                ? "bg-[#F50202] text-white cursor-pointer"
                : "bg-red-200 text-white cursor-not-allowed"
            }
          >
            Detach
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}