"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Meter } from "@/types/meter";

interface ViewDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meter: Meter | undefined;
}

export default function ViewDetailsDialog({
  isOpen,
  onClose,
  meter,
}: ViewDetailsDialogProps) {
  const meterDetail = meter?.meter;
  const flatNode = meterDetail?.flatNode;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-fit w-[700px] overflow-y-auto rounded-lg bg-white">
        <DialogHeader>
          <DialogTitle>View Meter Details</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        {meter && (
          <div className="grid gap-4 px-4 py-2">
            <div className="grid grid-cols-[150px_1fr] items-center gap-16">
              <span className="font-medium text-gray-700">Meter Number:</span>
              <span className="font-bold text-gray-900">
                {meter.meterNumber}
              </span>
            </div>
            <div className="grid grid-cols-[150px_1fr] items-center gap-16">
              <span className="font-medium text-gray-700">
                Meter Manufacturer:
              </span>
              <span className="font-bold text-gray-900">
                {meterDetail?.meterManufacturerName}
              </span>
            </div>
            <div className="grid grid-cols-[150px_1fr] items-center gap-16">
              <span className="font-medium text-gray-700">Meter Class:</span>
              <span className="font-bold text-gray-900">
                {meterDetail?.meterClass}
              </span>
            </div>
            <div className="grid grid-cols-[150px_1fr] items-center gap-16">
              <span className="font-medium text-gray-700">Meter Category:</span>
              <span className="font-bold text-gray-900">
                {meterDetail?.meterCategory}
              </span>
            </div>
            <div className="grid grid-cols-[150px_1fr] items-center gap-16">
              <span className="font-medium text-gray-700">Meter Model:</span>
              <span className="font-bold text-gray-900">
                {meterDetail?.smartMeterInfo?.meterModel}
              </span>
            </div>
            <div className="grid grid-cols-[150px_1fr] items-center gap-16">
              <span className="font-medium text-gray-700">Region:</span>
              <span className="font-bold text-gray-900">
                {flatNode?.regionName}
              </span>
            </div>
            <div className="grid grid-cols-[150px_1fr] items-center gap-16">
              <span className="font-medium text-gray-700">Business Hub:</span>
              <span className="font-bold text-gray-900">
                {flatNode?.businessName}
              </span>
            </div>
            <div className="grid grid-cols-[150px_1fr] items-center gap-16">
              <span className="font-medium text-gray-700">Service Center:</span>
              <span className="font-bold text-gray-900">
                {flatNode?.serviceName}
              </span>
            </div>
            <div className="grid grid-cols-[150px_1fr] items-center gap-16">
              <span className="font-medium text-gray-700">Feeder:</span>
              <span className="font-bold text-gray-900">
                {flatNode?.feederName}
              </span>
            </div>
            <div className="grid grid-cols-[150px_1fr] items-center gap-16">
              <span className="font-medium text-gray-700">Transformer:</span>
              <span className="font-bold text-gray-900">
                {flatNode?.dssName}
              </span>
            </div>
            <div className="grid grid-cols-[150px_1fr] items-center gap-16">
              <span className="font-medium text-gray-700">Status:</span>
              <span className="font-bold text-gray-900">
                {meter.connectionType}
              </span>
            </div>
            <div className="grid grid-cols-[150px_1fr] items-center gap-16">
              <span className="font-medium text-gray-700">Last Sync:</span>
              <span className="font-bold text-gray-900">
                {meter.updatedAt
                  ? new Date(meter.updatedAt).toLocaleString()
                  : ""}
              </span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
