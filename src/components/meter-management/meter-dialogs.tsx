"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

interface DeactivateDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onDeactivate: (reason?: string) => void;
    meterNumber: string;
    action: "deactivate" | "activate";
}

export function DeactivateDialog({ isOpen, onClose, onDeactivate, action, meterNumber }: DeactivateDialogProps) {
    const [reason, setReason] = useState<string>("");
    const [isFinalConfirmOpen, setIsFinalConfirmOpen] = useState(false);

    // Open confirmation dialog directly for activate action when dialog is opened
    useEffect(() => {
        if (isOpen && action === "activate") {
            setIsFinalConfirmOpen(true);
            onClose(); // Close the initial dialog
        }
    }, [isOpen, action, onClose]);

    const handleProceed = () => {
        if (action === "deactivate") {
            if (!reason.trim()) return; // Require reason for deactivation
            setIsFinalConfirmOpen(true); // Open confirmation dialog for deactivate
        }
    };

    const handleFinalConfirm = () => {
        if (action === "deactivate") {
            onDeactivate(reason); // Pass reason for deactivation
            setReason(""); // Reset reason after deactivation
        } else {
            onDeactivate(undefined); // No reason needed for activation
        }
        setIsFinalConfirmOpen(false);
        onClose();
    };

    return (
        <>
            <Dialog open={isOpen && action === "deactivate"} onOpenChange={(open) => {
                if (!open) {
                    setReason("");
                    setIsFinalConfirmOpen(false); // Ensure confirmation dialog closes if initial dialog is closed
                }
                onClose();
            }}>
                <DialogContent className="sm:max-w-[350px] h-fit bg-white rounded-lg p-6">
                    <DialogHeader className="flex flex-row items-center justify-between">
                        <div className="flex-col items-center gap-2">
                            <DialogTitle className="text-lg font-semibold text-gray-900">
                                Deactivate Meter
                            </DialogTitle>
                        </div>
                    </DialogHeader>
                    <div className="">
                        <Label className="text-sm text-gray-700">
                            Reason <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full mt-2 border-gray-300"
                            placeholder="Enter reason to deactivate"
                        />
                    </div>
                    <DialogFooter className="flex justify-end gap-3 mt-4">
                        <Button
                            variant="outline"
                            className="border-[#F50202] text-[#F50202] hover:bg-red-50"
                            onClick={() => {
                                setReason("");
                                onClose();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            className={
                                !reason.trim()
                                    ? "bg-red-200 text-white cursor-not-allowed"
                                    : "bg-[#F50202] text-white hover:bg-red-700 cursor-pointer"
                            }
                            onClick={handleProceed}
                            disabled={!reason.trim()}
                        >
                            Deactivate
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isFinalConfirmOpen} onOpenChange={setIsFinalConfirmOpen}>
                <DialogContent className="sm:max-w-[350px] h-fit bg-white rounded-lg p-6">
                    <DialogHeader className="flex flex-row items-center justify-between pb-3">
                        <div className="flex-col gap-2">
                            <AlertTriangle size={20} className="text-[#F50202] bg-red-100 p-3 rounded-full mt-4" />
                            <DialogTitle className="text-lg font-semibold text-gray-900 mt-2">
                                {action === "deactivate" ? "Deactivate Meter" : "Activate Meter"}
                            </DialogTitle>
                        </div>
                    </DialogHeader>
                    <div className="">
                        <p className="text-sm text-gray-700">
                            Are you sure you want to {action === "deactivate" ? "deactivate" : "activate"} meter ?
                        </p>
                    </div>
                    <DialogFooter className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-50"
                            onClick={() => setIsFinalConfirmOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-red-600 text-white hover:bg-red-700"
                            onClick={handleFinalConfirm}
                        >
                            {action === "deactivate" ? "Deactivate" : "Activate"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}