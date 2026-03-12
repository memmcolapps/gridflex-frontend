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
import { useAuth } from "@/context/auth-context";
import { createSchedule } from "@/service/hes-service";
import { Loader2 } from "lucide-react";

const eventTypeLabels: Record<string, string> = {
  standardEventLog: "Standard Event Log",
  relayControlLog: "Relay Control Log",
  powerQualityLog: "Power Quality Log",
  communicationLog: "Communication Log",
  tokenEventProfile: "Token Event Profile",
  energyProfile: "Energy Profile",
  instantDataProfile: "Instant Data Profile",
  billingData: "Billing Data",
  fraudEventLog: "Fraud Event Log",
};

const activeDaysMap: Record<string, string[]> = {
  repeatDaily: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
  repeatMonFri: ["MON", "TUE", "WED", "THU", "FRI"],
};

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
  const { user } = useAuth();
  const [eventType, setEventType] = useState("");
  const [timeInterval, setTimeInterval] = useState("");
  const [unit, setUnit] = useState("min");
  const [activeDays, setActiveDays] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setEventType("");
    setTimeInterval("");
    setUnit("min");
    setActiveDays("");
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

    const result = await createSchedule({
      eventProfileType: eventTypeLabels[eventType] ?? eventType,
      timeInterval: parseInt(timeInterval, 10),
      timeUnit: unit === "min" ? "MINS" : "HRS",
      activeDays: activeDaysMap[activeDays] ?? [],
      orgId: user?.orgId ?? "",
    });

    setIsLoading(false);

    if (result.success) {
      resetForm();
      onSubmit();
      onClose();
    } else {
      setError(result.error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] h-fit bg-white">
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
                  <SelectValue placeholder="Select Event/Profile Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standardEventLog">Standard Event Log</SelectItem>
                  <SelectItem value="relayControlLog">Relay Control Log</SelectItem>
                  <SelectItem value="powerQualityLog">Power Quality Log</SelectItem>
                  <SelectItem value="communicationLog">Communication Log</SelectItem>
                  <SelectItem value="tokenEventProfile">Token Event Profile</SelectItem>
                  <SelectItem value="energyProfile">Energy Profile</SelectItem>
                  <SelectItem value="instantDataProfile">Instant Data Profile</SelectItem>
                  <SelectItem value="billingData">Billing Data</SelectItem>
                  <SelectItem value="fraudEventLog">Fraud Event Log</SelectItem>
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
                  <SelectTrigger className="text-gray-400">
                    <SelectValue placeholder="Select Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="min">Minutes</SelectItem>
                    <SelectItem value="hrs">Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
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
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>

          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleClose}
              type="button"
              className="border-[#161CCA] text-[#161CCA] cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#161CCA] text-white cursor-pointer"
              disabled={!eventType || !timeInterval || !activeDays || isLoading}
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
