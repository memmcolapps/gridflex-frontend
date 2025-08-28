// src/components/hes/controlsconfigs/meter-remote-config/OfflineDialog.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react"; // Import alert triangle icon

interface OfflineDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OfflineDialog({ isOpen, onClose }: OfflineDialogProps) {
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
      </DialogContent>
    </Dialog>
  );
}