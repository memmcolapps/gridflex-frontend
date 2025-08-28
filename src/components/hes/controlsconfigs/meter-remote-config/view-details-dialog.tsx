"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Define a type for better safety
interface MeterData {
  id?: string;
  meterNumber: string;
  simNo?: string;
  class: string;
  category?: string;
  meterType?: string;
  manufacturer?: string;
  model?: string;
  region?: string;
  businessHub?: string;
  serviceCenter?: string;
  feeder?: string;
  transformer?: string;
  serviceLocation?: string;
  status?: string;
  lastSync?: string;
}

interface ViewDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meter: MeterData | null;
}

export default function ViewDetailsDialog({
  isOpen,
  onClose,
  meter,
}: ViewDetailsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-fit overflow-y-auto bg-white w-[700px] rounded-lg">
        <DialogHeader>
          <DialogTitle>View Meter Details</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        {meter && (
          <div className="grid gap-4 py-2 px-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-16">
              <span className="font-medium text-gray-700">Meter Number:</span>
              <span className="text-gray-900 font-bold">{meter.meterNumber}</span>
            </div>
            <div className="grid grid-cols-[150px_1fr] items-center gap-16">
              <span className="font-medium text-gray-700">Meter Manufacturer:</span>
              <span className="text-gray-900 font-bold">{meter.manufacturer}</span>
            </div>
            <div className="grid grid-cols-[150px_1fr] items-center gap-16">
              <span className="font-medium text-gray-700">Meter Class:</span>
              <span className="text-gray-900 font-bold">{meter.class}</span>
            </div>
            <div className="grid grid-cols-[150px_1fr] items-center gap-16">
              <span className="font-medium text-gray-700">Meter Category:</span>
              <span className="text-gray-900 font-bold">{meter.category}</span>
            </div>
            <div className="grid grid-cols-[150px_1fr] items-center gap-16">
              <span className="font-medium text-gray-700">Meter Model:</span>
              <span className="text-gray-900 font-bold">{meter.model}</span>
            </div>
            <div className="grid grid-cols-[150px_1fr] items-center gap-16">
              <span className="font-medium text-gray-700">Region:</span>
              <span className="text-gray-900 font-bold">{meter.region}</span>
            </div>
            <div className="grid grid-cols-[150px_1fr] items-center gap-16">
              <span className="font-medium text-gray-700">Business Hub:</span>
              <span className="text-gray-900 font-bold">{meter.businessHub}</span>
            </div>
            <div className="grid grid-cols-[150px_1fr] items-center gap-16">
              <span className="font-medium text-gray-700">Service Center:</span>
              <span className="text-gray-900 font-bold">{meter.serviceCenter}</span>
            </div>
            <div className="grid grid-cols-[150px_1fr] items-center gap-16">
              <span className="font-medium text-gray-700">Feeder:</span>
              <span className="text-gray-900 font-bold">{meter.feeder}</span>
            </div>
            <div className="grid grid-cols-[150px_1fr] items-center gap-16">
              <span className="font-medium text-gray-700">Transformer:</span>
              <span className="text-gray-900 font-bold">{meter.transformer }</span>
            </div>
            <div className="grid grid-cols-[150px_1fr] items-center gap-16">
              <span className="font-medium text-gray-700">Service Location:</span>
              <span className="text-gray-900 font-bold">
                {meter.serviceLocation ?? `KM 40, Lagos - Ibadan Expressway, ${meter.region}`}
              </span>
            </div>
            <div className="grid grid-cols-[150px_1fr] items-center gap-16">
              <span className="font-medium text-gray-700">Status:</span>
              <span className="text-gray-900 font-bold">{meter.status}</span>
            </div>
            <div className="grid grid-cols-[150px_1fr] items-center gap-16">
              <span className="font-medium text-gray-700">Last Sync:</span>
              <span className="text-gray-900 font-bold">{meter.lastSync}</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
