"use client";

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
import { useState } from "react";
import type { Meter } from "@/types/meter";

// interface Meter {
//     id: string;
//     name?: string;
//     // Add other properties as needed
// }

interface ConfigureAPNDialogProps {
    isOpen: boolean;
    onClose: () => void;
    meter?: Meter | undefined; // Replaced 'any' with 'Meter'
}

export default function ConfigureAPNDialog({ isOpen, onClose, meter }: ConfigureAPNDialogProps) {
    const [apn, setApn] = useState("");

    // Check if the APN field is filled
    const isFormValid = apn.trim() !== "";

    const handleConfigure = () => {
        // Handle APN configuration logic
        console.log("Configuring APN:", { apn, meter });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white h-fit">
                <DialogHeader>
                    <DialogTitle>Configure APN</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <Label htmlFor="apn-input" className="text-sm font-medium text-gray-700 mb-2 block">
                        APN &nbsp;<span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="apn-input"
                        type="text"
                        value={apn}
                        onChange={(e) => setApn(e.target.value)}
                        placeholder="Enter APN"
                        className="w-full border border-gray-200"
                    />
                </div>
                <div className="flex justify-between">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="border-[#161CCA] text-[#161CCA] cursor-pointer"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfigure}
                        disabled={!isFormValid} // Disable when form is invalid
                        className={`bg-[#161CCA] text-white ${!isFormValid ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                            }`}
                    >
                        Configure
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    );
}