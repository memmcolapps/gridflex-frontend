import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
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

export function DeactivateDialog({
    isOpen,
    onClose,
    onDeactivate,
    action,
    meterNumber,
}: DeactivateDialogProps) {
    const [reason, setReason] = useState<string>("");
    const [isFinalConfirmOpen, setIsFinalConfirmOpen] = useState(false);

    const handleProceed = () => {
        if (action === "deactivate" && !reason.trim()) return;
        setIsFinalConfirmOpen(true);
    };

    const handleFinalConfirm = () => {
        onDeactivate(action === "deactivate" ? reason : undefined);
        setReason("");
        setIsFinalConfirmOpen(false);
        onClose();
    };

    const handleClose = () => {
        setReason("");
        setIsFinalConfirmOpen(false);
        onClose();
    };

    const getColorScheme = (type: "border" | "text" | "bg") => {
        if (action === "activate") {
            return type === "border"
                ? "border-[#161CCA]"
                : type === "text"
                    ? "text-[#161CCA]"
                    : "bg-[#161CCA]";
        } else {
            return type === "border"
                ? "border-[#F50202]"
                : type === "text"
                    ? "text-[#F50202]"
                    : "bg-[#F50202]";
        }
    };

    const getHoverBg = () => {
        return action === "activate" ? "hover:bg-blue-700" : "hover:bg-red-700";
    };

    const getAlertClass = () => {
        return action === "activate"
            ? "text-blue-600 bg-blue-100 p-3 rounded-full mt-4"
            : "text-[#F50202] bg-red-100 p-3 rounded-full mt-4";
    };

    // Auto-open confirm dialog if action is activate
    useEffect(() => {
        if (isOpen && action === "activate") {
            setIsFinalConfirmOpen(true);
        }
    }, [isOpen, action]);

    return (
        <>
            {/* Show input dialog only for deactivation */}
            {isOpen && !isFinalConfirmOpen && action === "deactivate" && (
                <Dialog open onOpenChange={(open) => !open && handleClose()}>
                    <DialogContent className="sm:max-w-[350px] h-fit bg-white rounded-lg p-6">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-semibold text-gray-900">
                                Deactivate Meter
                            </DialogTitle>
                        </DialogHeader>
                        <div>
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
                                className={`${getColorScheme("border")} ${getColorScheme(
                                    "text"
                                )} hover:bg-opacity-10`}
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                className={`${!reason.trim()
                                        ? "bg-opacity-30 cursor-not-allowed"
                                        : `${getColorScheme("bg")} text-white ${getHoverBg()}`
                                    }`}
                                onClick={handleProceed}
                                disabled={!reason.trim()}
                            >
                                Deactivate
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Confirmation Dialog (both activate & deactivate) */}
            {isFinalConfirmOpen && (
                <Dialog open onOpenChange={(open) => setIsFinalConfirmOpen(open)}>
                    <DialogContent className="sm:max-w-[350px] h-fit bg-white rounded-lg p-6">
                        <DialogHeader className="pb-3">
                            <div className="flex flex-col gap-2">
                                <AlertTriangle size={20} className={getAlertClass()} />
                                <DialogTitle className="text-lg font-semibold text-gray-900 mt-2">
                                    {action === "deactivate" ? "Deactivate Meter" : "Activate Meter"}
                                </DialogTitle>
                            </div>
                        </DialogHeader>
                        <p className="text-sm text-gray-700">
                            Are you sure you want to{" "}
                            <span className="font-medium">{action}</span> meter{" "}
                            <b>{meterNumber}</b>?
                        </p>
                        <DialogFooter className="flex justify-end gap-3 mt-4">
                            <Button
                                variant="outline"
                                className={`${getColorScheme("border")} ${getColorScheme(
                                    "text"
                                )} hover:bg-opacity-10`}
                                onClick={() => setIsFinalConfirmOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className={`${getColorScheme("bg")} text-white ${getHoverBg()}`}
                                onClick={handleFinalConfirm}
                            >
                                {action === "deactivate" ? "Deactivate" : "Activate"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}
