import { useState } from "react";
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
// import { useAuth } from "@/context/auth-context";
import { Loader2 } from "lucide-react";
import { useCreateSchedule, useProfileEvents } from "@/hooks/use-hes-hierarchy";

// const eventTypeLabels: Record<string, string> = {
//   standardEventLog: "Standard Event Log",
//   relayControlLog: "Relay Control Log",
//   powerQualityLog: "Power Quality Log",
//   communicationLog: "Communication Log",
//   fraudEventLog: "Fraud Event Log",
//   tokenEventProfile: "Token Event Profile",
//   loadProfile1: "Load Profile 1",
//   loadProfile2: "Load Profile 2",
//   dailyBilling: "Daily Billing",
//   monthlyBilling: "Monthly Billing",
// };

// const activeDaysMap: Record<string, string[]> = {
//   repeatDaily: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
//   repeatMonFri: ["MON", "TUE", "WED", "THU", "FRI"],
// };

interface SetSyncScheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const SetSyncScheduleDialog: React.FC<SetSyncScheduleDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  // const { user } = useAuth();
  const [eventType, setEventType] = useState("");
  const [repeatTime, setRepeatTime] = useState("");
  const [unit, setUnit] = useState("min");
  // const [activeDays, setActiveDays] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
const { data: profileEvents = [], isLoading: isLoadingEvents } = useProfileEvents();
const { mutateAsync: submitCreateSchedule } = useCreateSchedule();

  const resetForm = () => {
    setEventType("");
    setRepeatTime("");
    setUnit("min");
    // setActiveDays("");
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);

  const selectedEvent = profileEvents.find(
    (event) => event.jobName === eventType,
  );

  try {
    await submitCreateSchedule({
      jobGroup: selectedEvent?.jobGroup ?? "",
      jobName: selectedEvent?.jobName ?? "",
      repeatTime: parseInt(repeatTime, 10),
      unit: unit === "min" ? "minutes" : unit === "hrs" ? "hours" : "seconds",
    });
    resetForm();
    onSubmit();
    onClose();
  } catch (err) {
    setError(err instanceof Error ? err.message : "An unexpected error occurred");
  } finally {
    setIsLoading(false); 
  }
};

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="h-fit bg-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Sync Schedule</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="eventType">
                Event/Profile Type <span className="text-red-600">*</span>
              </Label>
              <Select onValueChange={setEventType} value={eventType}>
                <SelectTrigger className="w-full text-gray-400">
                  <SelectValue
                    placeholder={
                      isLoadingEvents
                        ? "Loading..."
                        : "Select Event/Profile Type"
                    }
                  />
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
                <Label htmlFor="timeInterval">
                  Time Interval <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="timeInterval"
                  type="number"
                  value={repeatTime}
                  onChange={(e) => setRepeatTime(e.target.value)}
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
                  <SelectTrigger className="text-gray-400">
                    <SelectValue placeholder="Select Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="secs">Seconds</SelectItem>
                    <SelectItem value="min">Minutes</SelectItem>
                    <SelectItem value="hrs">Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* <div className="flex flex-col gap-2">
              <Label htmlFor="activeDays">
                Active Days <span className="text-red-600">*</span>
              </Label>
              <Select onValueChange={setActiveDays} value={activeDays}>
                <SelectTrigger className="w-full text-gray-400">
                  <SelectValue placeholder="Select Active Days" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="repeatDaily">Repeat Daily</SelectItem>
                  <SelectItem value="repeatMonFri">Repeat (Mon-Fri)</SelectItem>
                </SelectContent>
              </Select>
            </div> */}

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
              disabled={!eventType || !repeatTime || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                "Set Sync"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SetSyncScheduleDialog;
