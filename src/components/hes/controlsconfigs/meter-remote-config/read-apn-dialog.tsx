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
import type { Meter } from "@/types/meter";

interface ReadAPNDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meter?: Meter | undefined;
}

export default function ReadAPNDialog({
  isOpen,
  onClose,
  meter,
}: ReadAPNDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-fit bg-white">
        <DialogHeader>
          <DialogTitle>Read APN</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Label
            htmlFor="apn-input"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            APN
          </Label>
          <Input
            id="apn-input"
            type="text"
            readOnly
            placeholder="--"
            className="w-full border border-gray-200"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
