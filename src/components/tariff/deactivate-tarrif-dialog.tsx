"use client";

import { AlertTriangle, X } from "lucide-react";
import { type Tariff } from "@/service/tarriff-service";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

interface DeactivateTariffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tariff: Tariff | null;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeactivateTariffDialog({
  open,
  onOpenChange,
  tariff,
  onConfirm,
  isLoading = false,
}: DeactivateTariffDialogProps) {
  const isActive = tariff?.approve_status === "Approved";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm rounded-xl border-[rgba(228,231,236,1)] p-6">
        <AlertDialogCancel asChild>
          <button className="absolute top-4 right-4 rounded-sm border-none bg-transparent p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <X size={16} />
          </button>
        </AlertDialogCancel>

        <div className="flex flex-col space-y-4 pt-2">
          <div className="">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-full ${
                isActive !== false
                  ? "bg-red-100 text-red-600"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              <AlertTriangle size={28} />
            </div>
          </div>

          {/* Header content */}
          <AlertDialogHeader className="space-y-2 text-center">
            <AlertDialogTitle className="text-xl font-semibold text-gray-900">
              {isActive !== false ? "Deactivate" : "Activate"} Tariff
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-600">
              {isActive !== false
                ? "Are you sure you want to deactivate this band? It will no longer be available for use."
                : "Are you sure you want to activate this band? It will be available for use."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Footer with buttons */}
          <AlertDialogFooter className="flex flex-row gap-3 pt-4">
            <AlertDialogCancel className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 rounded-lg px-4 py-2.5 font-medium text-white transition-colors ${
                isActive !== false
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-[#161CCA] hover:bg-[#121eb3]"
              } ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
            >
              {isLoading
                ? `${isActive !== false ? "Deactivating" : "Activating"}...`
                : isActive !== false
                  ? "Deactivate"
                  : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
