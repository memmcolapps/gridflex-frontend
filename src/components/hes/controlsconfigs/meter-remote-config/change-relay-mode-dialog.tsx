"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SelectPortal } from "@radix-ui/react-select";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import type { Meter } from "@/types/meter";

const relayModes = [
    {
        value: "1",
        title: "Mode 1",
        description:
            "Disconnection: Remote(b,c), Manual(f), local (g) | Reconnection: Remote(d), manual(e)",
    },
    {
        value: "2",
        title: "Mode 2",
        description:
            "Disconnection: Remote(b,c), Manual(f), local (g) | Reconnection: Remote(d), manual(e)",
    },
    {
        value: "3",
        title: "Mode 3",
        description:
            "Disconnection: Remote(b,c), Manual(f), local (g) | Reconnection: Remote(d), manual(e)",
    },
    {
        value: "4",
        title: "Mode 4",
        description:
            "Disconnection: Remote(b,c), Manual(f), local (g) | Reconnection: Remote(d), manual(e)",
    },
    {
        value: "5",
        title: "Mode 5",
        description:
            "Disconnection: Remote(b,c), Manual(f), local (g) | Reconnection: Remote(d), manual(e), local(f)",
    },
    {
        value: "6",
        title: "Mode 6",
        description:
            "Disconnection: Remote(b,c), Manual(f), local (g) | Reconnection: Remote(d), manual(e), local(f)",
    },
];

// interface Meter {
//     id: string;
//     name?: string;
//     // Add other properties as needed
// }

interface ChangeRelayModeDialogProps {
    isOpen: boolean;
    onClose: () => void;
    meter: Meter | undefined; // Replaced 'any' with 'Meter'
}

export default function ChangeRelayModeDialog({
    isOpen,
    onClose,
    meter,
}: ChangeRelayModeDialogProps) {
    const [relayMode, setRelayMode] = useState("");

    const handleChange = () => {
        console.log("Changing Relay Mode:", { relayMode, meter });
        onClose();
    };

    const isFormValid = relayMode.trim() !== "";

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white h-auto max-w-md">
                <DialogHeader>
                    <DialogTitle>Change Relay Mode</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <Label
                        htmlFor="relay-mode"
                        className="text-sm font-medium text-gray-700 mb-2 block"
                    >
                        Relay Control Mode{" "}
                        <span className="text-red-600">*</span>
                    </Label>

                    <Select onValueChange={setRelayMode} value={relayMode}>
                        <SelectTrigger
                            id="relay-mode"
                            className="w-full border border-gray-200 text-gray-400"
                        >
                            <SelectValue placeholder="Select Mode">
                                {relayMode
                                    ? relayModes.find(
                                        (mode) => mode.value === relayMode
                                    )?.title
                                    : ""}
                            </SelectValue>
                        </SelectTrigger>

                        <SelectPortal
                            container={
                                document?.getElementById("dialog-container") ??
                                undefined
                            }
                        >
                            <SelectContent className="max-h-[250px] w-fit">
                                {relayModes.map((mode) => (
                                    <SelectItem
                                        key={mode.value}
                                        value={mode.value}
                                        className="flex flex-col items-start py-2"
                                    >
                                        <span className="font-medium text-gray-900">
                                            {mode.title}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {mode.description}
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </SelectPortal>
                    </Select>
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
                        onClick={handleChange}
                        disabled={!isFormValid}
                        className={`bg-[#161CCA] text-white ${!isFormValid
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer"
                            }`}
                    >
                        Change
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}