"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Meter } from "@/types/meter";

interface ReadDateTimeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meter?: Meter | undefined;
}

export default function ReadDateTimeDialog({
  isOpen,
  onClose,
  meter,
}: ReadDateTimeDialogProps) {
  const dateOptions = Array.from({ length: 31 }, (_, i) => ({
    value: (i + 1).toString(),
    label: (i + 1).toString(),
  }));

  const monthOptions = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

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
                placeholder="--"
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
                placeholder="--"
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
              <Select>
                <SelectTrigger className="w-full border border-gray-200 text-gray-400">
                  <SelectValue placeholder="--" />
                </SelectTrigger>
                <SelectContent>
                  {dateOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-1/3">
              <Label
                htmlFor="month-input"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Month
              </Label>
              <Select>
                <SelectTrigger className="w-full border border-gray-200 text-gray-400">
                  <SelectValue placeholder="--" />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                placeholder="--"
                className="border border-gray-200"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
