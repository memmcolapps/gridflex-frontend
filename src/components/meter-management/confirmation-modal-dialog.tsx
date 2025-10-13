"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import type { Customer } from "@/types/customer-types";
import type { MeterInventoryItem } from "@/types/meter-inventory";
import type { VirtualMeterData } from "@/types/meter";

interface ConfirmationModalDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedCustomer: Customer | MeterInventoryItem | VirtualMeterData | null;
    onConfirm: () => void;
    onCancel: () => void;
    isSubmitting: boolean; // ADDED
}

export function ConfirmationModalDialog({
    isOpen,
    onOpenChange,
    selectedCustomer,
    onConfirm,
    onCancel,
    isSubmitting, // ADDED
}: ConfirmationModalDialogProps) {

    const getCustomerDisplay = () => {
        if (!selectedCustomer) return "the selected customer";

        if ("customerId" in selectedCustomer) {
            return selectedCustomer.customerId;
        }
        if ("firstname" in selectedCustomer) {
            return selectedCustomer.firstname;
        }
        return "the selected customer";
    }

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
                        <span>{getCustomerDisplay()}</span>?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        className="border border-[#161CCA] text-[#161CCA] cursor-pointer"
                        disabled={isSubmitting} // Use isSubmitting
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={onConfirm} 
                        className="bg-[#161CCA] text-white hover:bg-[#161CCA]/90 cursor-pointer"
                        disabled={isSubmitting} // Use isSubmitting
                    >
                        {isSubmitting ? "Assigning..." : "Confirm"} {/* ADDED Loading text */}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}