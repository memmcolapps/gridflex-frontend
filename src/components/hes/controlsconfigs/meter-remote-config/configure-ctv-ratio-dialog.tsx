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

interface ConfigureCTVTRatioDialogProps {
    isOpen: boolean;
    onClose: () => void;
    meter: Meter | undefined; // Replaced 'any' with 'Meter'
}

export default function ConfigureCTVTRatioDialog({ isOpen, onClose, meter }: ConfigureCTVTRatioDialogProps) {
    const [ctNumerator, setCtNumerator] = useState("");
    const [ctDenominator, setCtDenominator] = useState("");
    const [vtNumerator, setVtNumerator] = useState("");
    const [vtDenominator, setVtDenominator] = useState("");

    // Check if all required fields are filled
    const isFormValid =
        ctNumerator.trim() !== "" &&
        ctDenominator.trim() !== "" &&
        vtNumerator.trim() !== "" &&
        vtDenominator.trim() !== "";

    const handleConfigure = () => {
        // Handle CT & VT Ratio configuration logic
        console.log("Configuring CT & VT Ratio:", { ctNumerator, ctDenominator, vtNumerator, vtDenominator, meter });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white h-fit">
                <DialogHeader>
                    <DialogTitle>Configure CT & VT Ratio</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <Label htmlFor="ct-numerator" className="text-sm font-medium text-gray-700 mb-2 block">
                                CT Numerator <span className="text-red-600">*</span>
                            </Label>
                            <Input
                                id="ct-numerator"
                                type="text"
                                value={ctNumerator}
                                onChange={(e) => setCtNumerator(e.target.value)}
                                placeholder="Enter CT Numerator"
                                className="w-full border border-gray-200"
                            />
                        </div>
                        <div className="w-1/2">
                            <Label htmlFor="ct-denominator" className="text-sm font-medium text-gray-700 mb-2 block">
                                CT Denominator <span className="text-red-600">*</span>
                            </Label>
                            <Input
                                id="ct-denominator"
                                type="text"
                                value={ctDenominator}
                                onChange={(e) => setCtDenominator(e.target.value)}
                                placeholder="Enter CT Denominator"
                                className="w-full border border-gray-200"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <Label htmlFor="vt-numerator" className="text-sm font-medium text-gray-700 mb-2 block">
                                VT Numerator <span className="text-red-600">*</span>
                            </Label>
                            <Input
                                id="vt-numerator"
                                type="text"
                                value={vtNumerator}
                                onChange={(e) => setVtNumerator(e.target.value)}
                                placeholder="Enter VT Numerator"
                                className="w-full border border-gray-200"
                            />
                        </div>
                        <div className="w-1/2">
                            <Label htmlFor="vt-denominator" className="text-sm font-medium text-gray-700 mb-2 block">
                                VT Denominator <span className="text-red-600">*</span>
                            </Label>
                            <Input
                                id="vt-denominator"
                                type="text"
                                value={vtDenominator}
                                onChange={(e) => setVtDenominator(e.target.value)}
                                placeholder="Enter VT Denominator"
                                className="w-full border border-gray-200"
                            />
                        </div>
                    </div>
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