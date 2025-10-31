"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, Loader2 } from "lucide-react"; // Import Loader2
import type { Customer } from "@/types/customer-types";
import type { MeterInventoryItem } from "@/types/meter-inventory";
import type { VirtualMeterData } from "@/types/meter";
import { LoadingAnimation } from "@/components/ui/loading-animation";

interface ConfirmationModalDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCustomer: Customer | MeterInventoryItem | VirtualMeterData | null;
  onConfirm: () => Promise<void> | void; // Allow Promise<void> to handle async mutations
  onCancel: () => void;
  isSubmitting: boolean; // FIXED: Added required prop
}

export function ConfirmationModalDialog({
  isOpen,
  onOpenChange,
  selectedCustomer,
  onConfirm,
  onCancel,
  isSubmitting, // Use the new prop
}: ConfirmationModalDialogProps) {

  // Determine dialog context for dynamic display
  const isAssignment = !!selectedCustomer && 'cin' in selectedCustomer; // Simple heuristic for assignment flow
  const actionText = isAssignment ? "Assign meter" : selectedCustomer?.status === 'ACTIVE' ? "Deactivate Meter" : "Activate Meter";
  const actionButtonText = isAssignment ? "Assign" : selectedCustomer?.status === 'ACTIVE' ? "Deactivate" : "Activate";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white text-black h-fit" style={{ width: "400px", maxWidth: "none" }}>
        <DialogHeader>
          <div className="flex justify-items-start mb-4">
            <div className={`rounded-full p-3 ${isAssignment ? 'bg-blue-100' : selectedCustomer?.status === 'ACTIVE' ? 'bg-red-100' : 'bg-green-100'}`}>
              <AlertTriangle size={24} className={isAssignment ? 'text-[#161CCA]' : selectedCustomer?.status === 'ACTIVE' ? 'text-red-600' : 'text-green-600'} />
            </div>
          </div>
          <DialogTitle className="font-semibold">{actionText}</DialogTitle>
          <DialogDescription>
            {isAssignment ?
              <>Are you sure you want to assign meter **{selectedCustomer?.meterNumber || 'N/A'}** to customer **{selectedCustomer?.customerId ?? 'N/A'}**?</>
              :
              <>Are you sure you want to **{actionButtonText.toLowerCase()}** meter **{selectedCustomer?.customerId ?? 'N/A'}**?</>
            }
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting} // Disable cancel while submitting
            className={`border border-[#161CCA] text-[#161CCA] cursor-pointer ${isSubmitting ? 'opacity-70' : ''}`}
          >
            Cancel
          </Button>
          <Button
            onClick={() => onConfirm()}
            disabled={isSubmitting} // Disable confirm while submitting
            className={`bg-[#161CCA] text-white hover:bg-[#161CCA]/90 cursor-pointer ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : ''}`}
          >
            {isSubmitting && <LoadingAnimation variant="inline" size="sm" />}
            {isSubmitting ? 'Processing...' : actionButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}