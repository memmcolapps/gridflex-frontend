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
import { Loader2 } from "lucide-react";
import { useCreateSchedule, useProfileEvents } from "@/hooks/use-hes-hierarchy";

export interface EditScheduleInitialData {
  sNo: string;
  eventType: string;
  jobName: string;
  jobGroup: string;
  repeatTime: string;
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
  const [repeatTime, setRepeatTime] = useState("");
  const [unit, setUnit] = useState("minutes");
  const [eventType, setEventType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: submitCreateSchedule } = useCreateSchedule();
  const { data: profileEvents = [], isLoading: isLoadingEvents } =
    useProfileEvents();

  useEffect(() => {
    setRepeatTime("");
    setUnit("minutes");
    setError(null);
  }, [initialData.sNo]);

  const handleClose = () => {
    setRepeatTime("");
    setUnit("minutes");
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await submitCreateSchedule({
        jobGroup: initialData.jobGroup,
        jobName: initialData.jobName,
        repeatTime: parseInt(repeatTime, 10),
        unit,
      });
      onSubmit();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
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
            <div className="flex flex-col gap-2">
              <Label htmlFor="eventType">Event/Profile Type</Label>
              <Select onValueChange={setEventType} value={eventType}>
                <SelectTrigger className="w-full text-gray-700">
                  <SelectValue placeholder={initialData.eventType || "—"} />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingEvents ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : profileEvents.length === 0 ? (
                    <SelectItem value="empty" disabled>
                      No events available
                    </SelectItem>
                  ) : (
                    profileEvents.map((event) => (
                      <SelectItem key={event.jobName} value={event.jobName}>
                        {event.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="repeatTime">
                  Time Interval <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="repeatTime"
                  type="number"
                  value={repeatTime}
                  onChange={(e) => setRepeatTime(e.target.value)}
                  placeholder={initialData.repeatTime || 'Enter time interval'}
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
              disabled={!repeatTime || !unit || isLoading}
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
