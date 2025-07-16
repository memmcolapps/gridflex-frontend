// components/ui/confirmation-dialog.tsx
import * as React from "react";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export function ConfirmationDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  onCancel,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
}: ConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white h-auto">
        <DialogHeader className="flex space-y-4 text-center">
          {/* Warning icon with background */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <AlertTriangle className="h-8 w-8 text-blue-600" />
          </div>

          <div className="space-y-2">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              {title}
            </DialogTitle>
            <DialogDescription className="max-w-sm text-sm text-gray-600">
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="flex justify-between gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="max-w-[120px] flex-1 cursor-pointer border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="max-w-[120px] flex-1 cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
          >
            {isLoading ? "Processing..." : confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
