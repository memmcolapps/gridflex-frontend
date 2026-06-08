// SendTokenDialog.jsx
import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SendTokenDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (token: string) => void | Promise<void>;
    meterNumber?: string;
    initialToken?: string;
}

const SendTokenDialog = ({ isOpen, onClose, onSubmit, meterNumber, initialToken }: SendTokenDialogProps) => {
    const [token, setToken] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setToken(initialToken || "");
        } else {
            setToken("");
        }
    }, [isOpen, initialToken]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!token || isSubmitting) return;
        setIsSubmitting(true);
        try {
            await onSubmit(token);
            setToken("");
            onClose();
        } catch {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[360px] h-fit bg-white">
                <DialogHeader>
                    <DialogTitle className="font-medium">Send Token</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col gap-2 p-2">
                            <Label htmlFor="meterNumber" className="text-left font-normal text-gray-400 text-base sm:text-sm md:text-sm">
                                Meter Number <span className="text-red-600">*</span>
                            </Label>
                            <Input
                                id="meterNumber"
                                value={meterNumber || ""}
                                disabled
                                className="w-full h-12 border border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                            />
                        </div>
                        <div className="flex flex-col gap-2 p-2">
                            <Label htmlFor="token" className="text-left font-normal text-black text-base sm:text-sm md:text-sm">
                                Token <span className="text-red-600">*</span>
                            </Label>
                            <Input
                                id="token"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                placeholder="Enter Token"
                                className="w-full h-12 border border-gray-300"
                            />
                        </div>
                    </div>
                    {/* <DialogFooter className="flex justify-between"> */}
                    <div className="flex justify-between gap-2">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            type="button"
                            className="border-[#161CCA] text-[#161CCA] cursor-pointer h-10"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-[#161CCA] text-white cursor-pointer h-10"
                            disabled={!token || isSubmitting}
                        >
                            {isSubmitting ? "Proceeding..." : "Proceed"}
                        </Button>
                    </div>
                    {/* </DialogFooter> */}
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default SendTokenDialog;