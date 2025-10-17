/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import type { Meter } from "@/types/meter";

// interface Meter {
//     id: string;
//     name?: string;
//     // Add other properties as needed
// }

interface OfflineDialogProps {
    isOpen: boolean;
    onClose: () => void;
    meter?: Meter; // Added optional 'meter' prop typed as 'Meter'
}

export default function OfflineDialog({ isOpen, onClose, meter: _meter }: OfflineDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="h-fit bg-white">
                <DialogHeader>
                    <div className="flex justify-items-start mb-4">
                        <div className="bg-red-100 rounded-full p-3">
                            <AlertTriangle size={24} className="text-red-500" />
                        </div>
                    </div>
                    <DialogTitle className="font-semibold">Meter Offline</DialogTitle>
                    <DialogDescription>
                        <p className="text-gray-700">
                            Configuration isn’t possible while the meter is offline. Please reconnect and try again.
                        </p>
                    </DialogDescription>
                </DialogHeader>
                {/* Optional: Add footer if needed, e.g., for a close button */}
              
            </DialogContent>
        </Dialog>
    );
}