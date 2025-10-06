"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import type { MeterInventoryItem } from "@/types/meter-inventory";

interface DetachConfirmationDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    customerToDetach: MeterInventoryItem | null;
    onConfirm: () => void;
    onCancel: () => void;
}

export function DetachConfirmationDialog({
    isOpen,
    onOpenChange,
    customerToDetach,
    onConfirm,
    onCancel,
}: DetachConfirmationDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white text-black h-fit" style={{ width: "350px", maxWidth: "none" }}>
                <DialogHeader>
                    <div className="flex justify-items-start mb-4">
                        <div className="bg-red-100 rounded-full p-3">
                            <AlertTriangle size={24} className="text-red-600" />
                        </div>
                    </div>
                    <DialogTitle className="font-semibold">Detach Meter</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to detach meter from <br />
                        <span className="font-bold">{customerToDetach?.customerId}</span>?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        className="border border-[#F50202] text-[#F50202] cursor-pointer"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className="bg-[#F50202] text-white hover:bg-red-700 cursor-pointer"
                    >
                        Detach
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}