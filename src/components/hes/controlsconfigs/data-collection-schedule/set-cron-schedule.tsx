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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchProfileEvents, resetCronSchedule } from "@/service/hes-service";
import { ResetCronPayload, type ProfileEvent } from "@/types/hes";
import { Loader2 } from "lucide-react";

type Frequency = "interval" | "daily" | "weekly" | "monthly" | "yearly";

interface SetCronScheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const INTERVAL_COUNTS = Array.from({ length: 10 }, (_, i) => i + 1);

const DAYS_OF_WEEK = [
  { id: "MON", label: "Mon" },
  { id: "TUE", label: "Tue" },
  { id: "WED", label: "Wed" },
  { id: "THU", label: "Thu" },
  { id: "FRI", label: "Fri" },
  { id: "SAT", label: "Sat" },
  { id: "SUN", label: "Sun" },
];

const MONTHS = [
  { id: "JAN", label: "January" },
  { id: "FEB", label: "February" },
  { id: "MAR", label: "March" },
  { id: "APR", label: "April" },
  { id: "MAY", label: "May" },
  { id: "JUN", label: "June" },
  { id: "JUL", label: "July" },
  { id: "AUG", label: "August" },
  { id: "SEP", label: "September" },
  { id: "OCT", label: "October" },
  { id: "NOV", label: "November" },
  { id: "DEC", label: "December" },
];

const DAYS_OF_MONTH = Array.from({ length: 31 }, (_, i) => i + 1);

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
}

function TimePicker({ value, onChange }: TimePickerProps) {
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("00");
  const [period, setPeriod] = useState<"AM" | "PM">("AM");

  useEffect(() => {
    if (!value) return;
    const parts = value.split(":");
    const h = parseInt(parts[0] ?? "", 10);
    const m = parseInt(parts[1] ?? "", 10);
    if (isNaN(h) || isNaN(m)) return;
    const isPM = h >= 12;
    const display12 = h % 12 === 0 ? 12 : h % 12;
    setHour(display12.toString());
    setMinute(m.toString().padStart(2, "0"));
    setPeriod(isPM ? "PM" : "AM");
  }, [value]);

  const emit = (h: string, m: string, p: "AM" | "PM") => {
    let h24 = parseInt(h, 10) % 12;
    if (p === "PM") h24 += 12;
    onChange(`${h24.toString().padStart(2, "0")}:${m}`);
  };

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0"),
  );

  return (
    <div className="flex items-center gap-2">
      <Select
        value={hour}
        onValueChange={(v) => {
          setHour(v);
          emit(v, minute, period);
        }}
      >
        <SelectTrigger className="w-[72px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-48">
          {hours.map((h) => (
            <SelectItem key={h} value={h}>
              {h}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span className="font-medium text-gray-500">:</span>

      <Select
        value={minute}
        onValueChange={(v) => {
          setMinute(v);
          emit(hour, v, period);
        }}
      >
        <SelectTrigger className="w-[72px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-48">
          {minutes.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={period}
        onValueChange={(v) => {
          const p = v as "AM" | "PM";
          setPeriod(p);
          emit(hour, minute, p);
        }}
      >
        <SelectTrigger className="w-[72px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="AM">AM</SelectItem>
          <SelectItem value="PM">PM</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

interface CheckboxGroupProps {
  options: { id: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

function CheckboxGroup({ options, selected, onChange }: CheckboxGroupProps) {
  const toggle = (id: string) => {
    onChange(
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id],
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <label
          key={opt.id}
          className={`flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors ${
            selected.includes(opt.id)
              ? "border-[#161CCA] bg-[#161CCA]/10 text-[#161CCA]"
              : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
          }`}
        >
          <Checkbox
            checked={selected.includes(opt.id)}
            onCheckedChange={() => toggle(opt.id)}
            className="hidden"
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

const SetCronScheduleDialog: React.FC<SetCronScheduleDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [profileEvents, setProfileEvents] = useState<ProfileEvent[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [eventType, setEventType] = useState("");
  const [frequency, setFrequency] = useState<Frequency | "">("");
  const [intervalCount, setIntervalCount] = useState("");
  const [intervalUnit, setIntervalUnit] = useState("");
  const [dailyInterval, setDailyInterval] = useState("");
  const [dailyTime, setDailyTime] = useState("08:00");
  const [weeklyDays, setWeeklyDays] = useState<string[]>([]);
  const [weeklyTime, setWeeklyTime] = useState("08:00");
  const [monthlyDay, setMonthlyDay] = useState("");
  const [monthlyTime, setMonthlyTime] = useState("08:00");
  const [yearlyMonths, setYearlyMonths] = useState<string[]>([]);
  const [yearlyDay, setYearlyDay] = useState("");
  const [yearlyTime, setYearlyTime] = useState("08:00");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoadingEvents(true);
      const result = await fetchProfileEvents();
      if (result.success) setProfileEvents(result.data);
      setIsLoadingEvents(false);
    };
    void load();
  }, []);

  const resetForm = () => {
    setEventType("");
    setFrequency("");
    setIntervalCount("");
    setIntervalUnit("");
    setDailyInterval("");
    setDailyTime("08:00");
    setWeeklyDays([]);
    setWeeklyTime("08:00");
    setMonthlyDay("");
    setMonthlyTime("08:00");
    setYearlyMonths([]);
    setYearlyDay("");
    setYearlyTime("08:00");
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const isValid = (() => {
    if (!eventType || !frequency) return false;
    switch (frequency) {
      case "interval":
        return !!intervalCount && !!intervalUnit;
      case "daily":
        return !!dailyInterval && !!dailyTime;
      case "weekly":
        return weeklyDays.length > 0 && !!weeklyTime;
      case "monthly":
        return !!monthlyDay && !!monthlyTime;
      case "yearly":
        return yearlyMonths.length > 0 && !!yearlyDay && !!yearlyTime;
      default:
        return false;
    }
  })();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid) return;

    setIsLoading(true);
    setError(null);

    const selectedEvent = profileEvents.find((ev) => ev.jobName === eventType);

    let payload: ResetCronPayload = {
      jobName: selectedEvent?.jobName ?? "",
      jobGroup: selectedEvent?.jobGroup ?? "",
      frequency,
    };

    if (frequency === "interval") {
      payload = {
        ...payload,
        interval: parseInt(intervalCount, 10),
        unit:
          intervalUnit === "min"
            ? "minutes"
            : intervalUnit === "hrs"
              ? "hours"
              : "seconds",
      };
    }

    if (frequency === "daily") {
      payload = {
        ...payload,
        interval: parseInt(dailyInterval, 10),
        time: dailyTime,
      };
    }

    if (frequency === "weekly") {
      payload = {
        ...payload,
        daysOfWeek: weeklyDays, // ["MON", "FRI"] ✅ matches API
        time: weeklyTime,
      };
    }

    if (frequency === "monthly") {
      payload = {
        ...payload,
        daysOfMonth: [parseInt(monthlyDay, 10)], // [15] ✅ matches API
        time: monthlyTime,
      };
    }

    if (frequency === "yearly") {
      payload = {
        ...payload,
        monthsOfYear: yearlyMonths.map(
          (m) => MONTHS.findIndex((mo) => mo.id === m) + 1,
        ), // [2,8,3] ✅ matches API
        daysOfMonth: [parseInt(yearlyDay, 10)],
        time: yearlyTime,
      };
    }

    const result = await resetCronSchedule(payload);
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
      <DialogContent className="h-fit max-h-[90vh] overflow-y-auto bg-white sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Reset Cron Schedule</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 py-4">
            <div className="flex flex-col gap-2">
              <Label>
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
                    profileEvents.map((ev) => (
                      <SelectItem key={ev.jobName} value={ev.jobName}>
                        {ev.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>
                Frequency <span className="text-red-600">*</span>
              </Label>
              <Select
                onValueChange={(v) => {
                  setFrequency(v as Frequency);
                }}
                value={frequency}
              >
                <SelectTrigger className="w-full text-gray-400">
                  <SelectValue placeholder="Select Frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="interval">Interval</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {frequency === "interval" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>
                    Interval <span className="text-red-600">*</span>
                  </Label>
                  <Select
                    onValueChange={setIntervalCount}
                    value={intervalCount}
                  >
                    <SelectTrigger className="text-gray-400">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {INTERVAL_COUNTS.map((n) => (
                        <SelectItem key={n} value={n.toString()}>
                          {`Every ${n}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>
                    Unit <span className="text-red-600">*</span>
                  </Label>
                  <Select onValueChange={setIntervalUnit} value={intervalUnit}>
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
            )}

            {frequency === "daily" && (
              <>
                <div className="flex flex-col gap-2">
                  <Label>
                    Interval <span className="text-red-600">*</span>
                  </Label>
                  <Select
                    onValueChange={setDailyInterval}
                    value={dailyInterval}
                  >
                    <SelectTrigger className="text-gray-400">
                      <SelectValue placeholder="Select interval" />
                    </SelectTrigger>
                    <SelectContent>
                      {INTERVAL_COUNTS.map((n) => (
                        <SelectItem key={n} value={n.toString()}>
                          {n === 1 ? "Once daily" : `${n} times daily`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>
                    Time <span className="text-red-600">*</span>
                  </Label>
                  <TimePicker value={dailyTime} onChange={setDailyTime} />
                </div>
              </>
            )}

            {frequency === "weekly" && (
              <>
                <div className="flex flex-col gap-2">
                  <Label>
                    Days of the Week <span className="text-red-600">*</span>
                  </Label>
                  <CheckboxGroup
                    options={DAYS_OF_WEEK}
                    selected={weeklyDays}
                    onChange={setWeeklyDays}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>
                    Time <span className="text-red-600">*</span>
                  </Label>
                  <TimePicker value={weeklyTime} onChange={setWeeklyTime} />
                </div>
              </>
            )}

            {frequency === "monthly" && (
              <>
                <div className="flex flex-col gap-2">
                  <Label>
                    Day of the Month <span className="text-red-600">*</span>
                  </Label>
                  <Select onValueChange={setMonthlyDay} value={monthlyDay}>
                    <SelectTrigger className="text-gray-400">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent className="max-h-48">
                      {DAYS_OF_MONTH.map((d) => (
                        <SelectItem key={d} value={d.toString()}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>
                    Time <span className="text-red-600">*</span>
                  </Label>
                  <TimePicker value={monthlyTime} onChange={setMonthlyTime} />
                </div>
              </>
            )}

            {frequency === "yearly" && (
              <>
                <div className="flex flex-col gap-2">
                  <Label>
                    Months <span className="text-red-600">*</span>
                  </Label>
                  <CheckboxGroup
                    options={MONTHS}
                    selected={yearlyMonths}
                    onChange={setYearlyMonths}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>
                    Day of Selected Month(s){" "}
                    <span className="text-red-600">*</span>
                  </Label>
                  <Select onValueChange={setYearlyDay} value={yearlyDay}>
                    <SelectTrigger className="text-gray-400">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent className="max-h-48">
                      {DAYS_OF_MONTH.map((d) => (
                        <SelectItem key={d} value={d.toString()}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>
                    Time <span className="text-red-600">*</span>
                  </Label>
                  <TimePicker value={yearlyTime} onChange={setYearlyTime} />
                </div>
              </>
            )}

            {/* <div className="flex flex-col gap-2">
              <Label htmlFor="activeDays">
                Active Days <span className="text-red-600">*</span>
              </Label>
              <Select onValueChange={setActiveDays} value={activeDays}>
                <SelectTrigger className="w-full text-gray-800 [&_[data-placeholder]]:text-gray-400">
                  <SelectValue placeholder="Select Active Days" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="repeatDaily">Repeat Daily</SelectItem>
                  <SelectItem value="repeatMonFri">Repeat (Mon-Fri)</SelectItem>
                  <SelectItem value="repeatOnly">Repeat Only</SelectItem>
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
              disabled={!isValid || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SetCronScheduleDialog;
