"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useReadMeter } from "@/hooks/use-configure-meter";
import type { Meter } from "@/types/meter";
import { useEffect } from "react";

interface ReadDateTimeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meter?: Meter | undefined;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function parseDateTimeValue(value?: string) {
  if (!value) return null;

  const [datePart, timePart] = value.split(" ");
  if (!datePart || !timePart) return null;

  const [year, month, day] = datePart.split("-");
  const [hour, minute] = timePart.split(":");

  const monthIndex = month ? parseInt(month, 10) - 1 : -1;

  return {
    year: year ?? "",
    month: monthIndex >= 0 ? (MONTH_NAMES[monthIndex] ?? "") : "",
    day: day ? String(parseInt(day, 10)) : "",
    hour: hour ?? "",
    minute: minute ?? "",
  };
}

export default function ReadDateTimeDialog({
  isOpen,
  onClose,
  meter,
}: ReadDateTimeDialogProps) {
  const { mutate: readMeter, data, isPending } = useReadMeter();

  useEffect(() => {
    if (isOpen && meter?.meterNumber) {
      readMeter({ serial: meter.meter?.meterNumber, type: "READ_CLOCK" });
    }
  }, [isOpen]);

  const parsed = parseDateTimeValue(String(data?.responsedata?.value));
  const isLoading = isPending ? "Loading..." : "No data available";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-fit bg-white">
        <DialogHeader>
          <DialogTitle>Read Date And Time</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex gap-4">
            <div className="w-1/2">
              <Label
                htmlFor="hour-input"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Hour
              </Label>
              <Input
                id="hour-input"
                type="text"
                readOnly
                value={parsed?.hour ?? ""}
                placeholder={isLoading}
                className="border border-gray-200"
              />
            </div>
            <div className="w-1/2">
              <Label
                htmlFor="minute-input"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Minute
              </Label>
              <Input
                id="minute-input"
                type="text"
                readOnly
                value={parsed?.minute ?? ""}
                placeholder={isLoading}
                className="border border-gray-200"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-1/3">
              <Label
                htmlFor="date-input"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Date
              </Label>
              <Input
                id="date-input"
                type="text"
                readOnly
                value={parsed?.day ?? ""}
                placeholder={isLoading}
                className="border border-gray-200"
              />
            </div>
            <div className="w-1/3">
              <Label
                htmlFor="month-input"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Month
              </Label>
              <Input
                id="month-input"
                type="text"
                readOnly
                value={parsed?.month ?? ""}
                placeholder={isLoading}
                className="border border-gray-200"
              />
            </div>
            <div className="w-1/3">
              <Label
                htmlFor="year-input"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Year
              </Label>
              <Input
                id="year-input"
                type="text"
                readOnly
                value={parsed?.year ?? ""}
                placeholder={isLoading}
                className="border border-gray-200"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}