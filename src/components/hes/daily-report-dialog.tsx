// components/DailyReportDialog.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DailyReportTable } from "@/components/hes/daily-report-table";
import { useMeters } from "@/hooks/use-assign-meter";
import { useCommunicationRangeReport } from "@/hooks/use-reports";
import { useQuery } from "@tanstack/react-query";

interface DailyReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeTab: "MD" | "Non-MD";
}

export function DailyReportDialog({
  open,
  onOpenChange,
  activeTab,
}: DailyReportDialogProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [startTimeValue, setStartTimeValue] = useState<string>("00:00");
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [endTimeValue, setEndTimeValue] = useState<string>("00:00");
  const [selectedMeters, setSelectedMeters] = useState<string[]>([]);
  const [showTable, setShowTable] = useState(false);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [isMeterDropdownOpen, setIsMeterDropdownOpen] = useState(false);

  const { data: metersData } = useMeters({
    page: 1,
    pageSize: 1000,
    searchTerm: "",
    sortBy: null,
    sortDirection: null,
    type: "assigned", // Filter for assigned meters only
  });

  const communicationRangeReportMutation = useCommunicationRangeReport();

  // Get the report data from the mutation result
  const { data: reportData } = useQuery({
    queryKey: ["communicationRangeReport"],
    queryFn: () => Promise.resolve([]),
    initialData: [],
    enabled: false, // This will be populated by the mutation
  });

  const filteredMeters =
    metersData?.actualMeters.filter((meter) => meter.type !== "VIRTUAL") ?? [];

  const handleProceed = async () => {
    if (!startDate || !endDate || selectedMeters.length === 0) {
      return;
    }

    // Format dates as required by API
    const formattedStartDate = format(startDate, "yyyy-MM-dd HH:mm:ss");
    const formattedEndDate = format(endDate, "yyyy-MM-dd HH:mm:ss");

    try {
      await communicationRangeReportMutation.mutateAsync({
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        meterNumbers: selectedMeters,
        type: activeTab,
      });
      setShowTable(true);
    } catch (error) {
      console.error("Failed to fetch communication range report:", error);
      // Error handling is done by the mutation hook (toast notifications)
    }
  };

  const handleCancel = () => {
    if (showTable) {
      setShowTable(false);
    } else {
      onOpenChange(false);
      // Reset form state when closing
      setSelectedMeters([]);
      setStartDate(undefined);
      setEndDate(undefined);
      setStartTimeValue("00:00");
      setEndTimeValue("00:00");
    }
  };

  const dialogClassNames = showTable
    ? "bg-white w-full max-w-[1000px] h-fit p-6 overflow-auto"
    : "bg-white h-fit w-full max-w-lg";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogClassNames}>
        <DialogHeader>
          <DialogTitle>Communication Report</DialogTitle>
        </DialogHeader>
        {!showTable ? (
          <>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col items-center gap-4 md:flex-row">
                <div className="w-full flex-1 space-y-4">
                  <Label htmlFor="start-date" className="text-left">
                    Start Date
                  </Label>
                  <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start border-gray-300 text-left font-normal focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2",
                          !startDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon size={12} className="mr-2 h-3 w-3" />
                        {startDate ? (
                          format(startDate, "yyyy-MM-dd HH:mm")
                        ) : (
                          <span>Select Date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto border-none bg-white p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(d) => {
                          setStartDate(d as Date | undefined);
                          setStartDateOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="w-full flex-1 space-y-4">
                  <Label htmlFor="end-date" className="text-left">
                    End Date
                  </Label>
                  <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start border-gray-300 text-left font-normal focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2",
                          !endDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon size={12} className="mr-2 h-3 w-3" />
                        {endDate ? (
                          format(endDate, "yyyy-MM-dd HH:mm")
                        ) : (
                          <span>Select Date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto border-none bg-white p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(d) => {
                          setEndDate(d as Date | undefined);
                          setEndDateOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-1 items-center gap-2">
                <Label htmlFor="meter-number" className="text-left">
                  Meter Number
                </Label>
                <Popover
                  open={isMeterDropdownOpen}
                  onOpenChange={setIsMeterDropdownOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={isMeterDropdownOpen}
                      className="w-full justify-between border-gray-200 text-gray-600"
                    >
                      {selectedMeters.length > 0
                        ? `${selectedMeters.length} meter(s) selected`
                        : "Select meter numbers..."}
                      <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full border-none p-0">
                    <Command className="border-none bg-white">
                      <CommandInput
                        placeholder="Search meter number..."
                        className="border-none"
                      />
                      <CommandList>
                        <CommandEmpty>No meter found.</CommandEmpty>
                        <CommandGroup>
                          {filteredMeters.map((meter) => (
                            <CommandItem
                              key={meter.id ?? meter.meterNumber}
                              value={meter.meterNumber}
                              onSelect={(currentValue) => {
                                const isSelected =
                                  selectedMeters.includes(currentValue);
                                if (isSelected) {
                                  setSelectedMeters(
                                    selectedMeters.filter(
                                      (m) => m !== currentValue,
                                    ),
                                  );
                                } else {
                                  setSelectedMeters([
                                    ...selectedMeters,
                                    currentValue,
                                  ]);
                                }
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedMeters.includes(meter.meterNumber)
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {meter.meterNumber}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="flex justify-between space-x-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="cursor-pointer border-[#161CCA] text-[#161CCA]"
              >
                Cancel
              </Button>
              <Button
                className="cursor-pointer border-none bg-[#161CCA] px-4 py-2 font-medium text-white"
                onClick={handleProceed}
                disabled={!startDate || !endDate || selectedMeters.length === 0}
              >
                Proceed
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogContent
              style={{
                maxWidth: "60vw",
                background: "white",
                overflow: "auto",
                padding: "1.5rem",
              }}
            >
              <DailyReportTable data={reportData} />
              <div className="mt-4 flex justify-between space-x-2">
                <Button
                  variant="outline"
                  size={"lg"}
                  className="cursor-pointer border-[#161CCA] text-[#161CCA]"
                  onClick={handleCancel}
                >
                  Back
                </Button>
                <Button
                  size={"lg"}
                  className="cursor-pointer border-none bg-[#161CCA] px-4 py-2 font-medium text-white"
                >
                  Export
                </Button>
              </div>
            </DialogContent>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
