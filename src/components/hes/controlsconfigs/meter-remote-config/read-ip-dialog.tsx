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

interface ReadIPDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meter?: Meter | undefined;
}

export default function ReadIPDialog({
  isOpen,
  onClose,
  meter,
}: ReadIPDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-fit bg-white">
        <DialogHeader>
          <DialogTitle>Read IP Address & Port</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label
              htmlFor="ip-address"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              IP Address
            </Label>
            <Input
              id="ip-address"
              type="text"
              readOnly
              placeholder="--"
              className="w-full border border-gray-200"
            />
          </div>
          <div>
            <Label
              htmlFor="port"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Port
            </Label>
            <Input
              id="port"
              type="text"
              readOnly
              placeholder="--"
              className="w-full border border-gray-200"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
