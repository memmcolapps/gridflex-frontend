"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createSchedule } from "@/service/hes-service";
import { Loader2 } from "lucide-react";

export interface EditScheduleInitialData {
  sNo: string;
  eventType: string;
  jobName: string;
  jobGroup: string;
  timeInterval: string;
  unit: string;
}

interface EditSyncScheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void; 
  initialData: EditScheduleInitialData;
}

const EditSyncScheduleDialog: React.FC<EditSyncScheduleDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [timeInterval, setTimeInterval] = useState("");
  const [unit, setUnit] = useState("minutes");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTimeInterval("");
    setUnit("minutes");
    setError(null);
  }, [initialData.sNo]);

  const handleClose = () => {
    setTimeInterval("");
    setUnit("minutes");
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await createSchedule({
      jobGroup: initialData.jobGroup,
      jobName: initialData.jobName,
      timeInterval: parseInt(timeInterval, 10),
      unit,
    });

    setIsLoading(false);

    if (result.success) {
      onSubmit(); // refresh table
      handleClose();
    } else {
      setError(result.error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="h-fit bg-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Sync Schedule</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">

            {/* Read-only — shows which schedule is being edited */}
            <div className="flex flex-col gap-2">
              <Label>Event/Profile Type</Label>
              <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                {initialData.eventType || "—"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="timeInterval">
                  Time Interval <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="timeInterval"
                  type="number"
                  value={timeInterval}
                  onChange={(e) => setTimeInterval(e.target.value)}
                  placeholder="Enter Time Interval"
                  required
                  className="border border-gray-200"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="unit">
                  Unit <span className="text-red-600">*</span>
                </Label>
                <Select onValueChange={setUnit} value={unit}>
                  <SelectTrigger className="text-gray-800 placeholder:text-gray-400">
                    <SelectValue placeholder="Select Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seconds">Seconds</SelectItem>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>

          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleClose}
              type="button"
              className="cursor-pointer border-[#161CCA] text-[#161CCA]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="cursor-pointer bg-[#161CCA] text-white"
              disabled={!timeInterval || !unit || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSyncScheduleDialog;