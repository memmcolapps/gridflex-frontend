"use client";

import { useState, useEffect, ChangeEventHandler } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  SquareArrowOutUpRight,
  Check,
  Square,
} from "lucide-react";
import { format, setHours, setMinutes } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface EventData {
  sn: number;
  meterNo: string;
  feeder: string;
  time: string;
  eventType: string;
  event: string;
}

const mockEventData: EventData[] = [
  // Add your mock data here when you have it
];

const eventTypes = [
  "Standard Event Log",
  "Relay Control Log",
  "Power Quality Log",
  "Communication Log",
  "Fraud Event Log",
  "Token Event Log",
];

// Event options based on event type
const eventOptionsByType: Record<string, string[]> = {
  "Standard Event Log": [
    "Daylight Saving Time",
    "Clock invalid",
    "Replace Battery",
    "Battery Voltage Low",
    "TOU Activated",
    "Error Registered Cleared",
    "Alarm Registered Cleared",
    "Meter Program Memory Error",
    "RAM Error",
    "NV Meter Error",
    "Watchdog Error",
    "Measurement System Error",
    "Firmware Ready for Activation",
    "Firmware Verification Failed",
    "Unexpected Consumption",
    "Phase Sequence Reversal",
    "Missing Neutrals",
    "Event Code of Standard Event Log",
    "Meter Data Cleared",
    "Load Profile Cleared",
    "Standard Event Log Cleared",
    "Event Log Cleared",
  ],
  "Relay Control Log": [
    "Power Down",
    "Power Up",
    "Disconnector Ready For Manual Connection",
    "Manual Disconnection",
    "Remote Disconnection",
    "Local Disconnection",
    "Limiter Threshold Exceeded",
    "Limiter Threshold OK",
    "Limiter Threshold Changed",
    "Disconnect/Reconnect Failure",
    "Local Reconnection",
    "Fuse Supervision L1, Threshold Exceeded",
    "Fuse Supervision L1, Threshold OK",
    "Fuse Supervision L2, Threshold Exceeded",
    "Fuse Supervision L2, Threshold OK",
    "Event Code of Fraud",
    "Relay Event Log Cleared",
  ],
  "Power Quality Log": [
    "Current Imbalance Occurs",
    "Lower Power Factor Started",
    "Lower Power Factor Stopped",
    "Under Voltage L1",
    "Normal Voltage L1",
    "Normal Voltage L2",
    "Normal Voltage L3",
    "Bad Voltage Quality L1",
    "Bad Voltage Quality L2",
    "Bad Voltage Quality L3",
    "Other Fraud Related Event",
    "SIM Registration Status",
    "Packet Switched Status",
    "Over Current L1 Started",
    "Over Current L1 Stopped",
    "Over Current L2 Started",
    "Over Current L2 Stopped",
    "Over Current L3 Started",
    "Over Current L3 Stopped",
    "Lost Current L1 Started",
    "Lost Current L1 Stopped",
    "Lost Current L2 Stopped",
    "Lost Current L3 Started",
    "Lost Current L3 Stopped",
    "Lost Current L1 Started",
    "Lost Current L2 Stopped",
    "Lost Current L3 Started",
    "Lost Current L3 Stopped",
    "Active Power Reverse L1 Started",
    "Active Power Reverse L1 Stopped",
    "Active Power Reverse L2 Started",
    "Active Power Reverse L2 Stopped",
    "Active Power Reverse L3 Started",
    "Active Power Reverse L3 Stopped",
    "Power Overload L1 Started",
    "Power Overload L1 Stopped",
    "Power Overload L2 Started",
    "Power Overload L2 Stopped",
    "Power Overload L3 Started",
    "Power Overload L3 Stopped",
    "Voltage Unbalance Start",
    "Voltage Unbalance Stopped",
    "Phase Failure L1 Started",
    "Phase Failure L1 Stopped",
    "Phase Failure L2 Started",
    "Phase Failure L2 Stopped",
    "Phase Failure L3 Started",
  ],
  "Communication Log": [
    "Terminal Power On",
    "GPRS Module Pull Out",
    "B Phase Miss",
    "C Phase Miss",
    "A Phase Lower",
    "B Phase Lower",
    "C Phase Lower",
    "A Phase High",
    "B Phase High",
    "C Phase High",
    "CPU Temperature High",
    "Terminal Top Cover Opened",
    "Terminal Top Cover Closed",
    "No Connection Timeout",
    "Modem Initialization Failure",
    "SIM Card Failure",
    "SIM Card OK",
    "GSM Registration Failure",
    "GPRS Registration Failure",
    "PDP Context Established",
    "PDP Context Destroyed",
    "PDP Context Failure",
    "Modem SW Reset",
    "Modem HW Reset",
    "GSM Outgoing Connection",
    "GSM Incoming Connection",
    "GSM Hang-Up",
    "Diagnostic Failure",
    "User Initialization Failure",
    "Signal Quality Low",
    "Auto Answer Number Of Calls Exceeded",
    "Local Communication Attempt",
    "Register Successful",
    "Module In",
    "Module Out",
  ],
  "Fraud Event Log": [
    "Terminal Cover Open",
    "Terminal Cover Closed",
    "Strong DC Field Detected",
    "Strong DC Field Removed",
    "Meter Cover Opened",
    "Meter Cover Closed",
    "Association Authentication After (n) Times",
    "CT Bypass Start",
    "CT Bypass End",
    "Decryption or Message Authentication Failure",
    "Relay Attack",
    "Current Reverse Start",
    "Event Code Of Standard Event Log",
    "Fraud Event Log Cleared",
  ],
  "Token Event Log": ["Recharge Token Event", "Token Event"],
};

export function Events() {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [startTimeValue, setStartTimeValue] = useState<string>("00:00");
  const [endTimeValue, setEndTimeValue] = useState<string>("00:00");
  const [meterNo, setMeterNo] = useState("");
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [availableEventOptions, setAvailableEventOptions] = useState<string[]>(
    [],
  );
  const [tableData, setTableData] = useState<EventData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [eventTypeDropdownOpen, setEventTypeDropdownOpen] = useState(false);
  const [eventsDropdownOpen, setEventsDropdownOpen] = useState(false);

  // Update available event options when event type changes
  useEffect(() => {
    if (selectedEventTypes.length === 0) {
      setAvailableEventOptions([]);
      setSelectedEvents([]);
      return;
    }

    // Get all unique event options from selected event types
    const allOptions = selectedEventTypes.flatMap(
      (type) => eventOptionsByType[type] || [],
    );
    const uniqueOptions = [...new Set(allOptions)];
    setAvailableEventOptions(uniqueOptions);

    // Reset selected events when event types change
    setSelectedEvents([]);
  }, [selectedEventTypes]);

  // Handle Event Type selection
  const handleEventTypeChange = (eventType: string) => {
    if (eventType === "Select All") {
      if (selectedEventTypes.length === eventTypes.length) {
        // If all are selected, deselect all
        setSelectedEventTypes([]);
      } else {
        // Select all event types
        setSelectedEventTypes([...eventTypes]);
      }
    } else {
      setSelectedEventTypes((prev) => {
        if (prev.includes(eventType)) {
          // Remove if already selected
          return prev.filter((type) => type !== eventType);
        } else {
          // Add if not selected
          return [...prev, eventType];
        }
      });
    }
  };

  // Handle Events selection
  const handleEventsChange = (event: string) => {
    if (event === "Select All") {
      if (selectedEvents.length === availableEventOptions.length) {
        // If all are selected, deselect all
        setSelectedEvents([]);
      } else {
        // Select all events
        setSelectedEvents([...availableEventOptions]);
      }
    } else {
      setSelectedEvents((prev) => {
        if (prev.includes(event)) {
          // Remove if already selected
          return prev.filter((e) => e !== event);
        } else {
          // Add if not selected
          return [...prev, event];
        }
      });
    }
  };

  // Get display text for dropdowns
  const getEventTypeDisplayText = () => {
    if (selectedEventTypes.length === 0) return "Select Event Type";
    if (selectedEventTypes.length === 1) return selectedEventTypes[0];
    if (selectedEventTypes.length === eventTypes.length)
      return "All Event Types";
    return `${selectedEventTypes.length} Event Types`;
  };

  const getEventsDisplayText = () => {
    if (selectedEvents.length === 0) return "Select Events";
    if (selectedEvents.length === 1) return selectedEvents[0];
    if (
      selectedEvents.length === availableEventOptions.length &&
      availableEventOptions.length > 0
    )
      return "All Events";
    return `${selectedEvents.length} Events`;
  };

  // Handle time change for start date
  const handleStartTimeChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const time = e.target.value;
    if (!startDate) {
      setStartTimeValue(time);
      return;
    }
    const [hours, minutes] = time.split(":").map((str) => parseInt(str, 10));
    const newSelectedDate = setHours(setMinutes(startDate, minutes), hours);
    setStartDate(newSelectedDate);
    setStartTimeValue(time);
  };

  // Handle time change for end date
  const handleEndTimeChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const time = e.target.value;
    if (!endDate) {
      setEndTimeValue(time);
      return;
    }
    const [hours, minutes] = time.split(":").map((str) => parseInt(str, 10));
    const newSelectedDate = setHours(setMinutes(endDate, minutes), hours);
    setEndDate(newSelectedDate);
    setEndTimeValue(time);
  };

  // Handle day select for start date
  const handleStartDaySelect = (date: Date | undefined) => {
    if (!startTimeValue || !date) {
      setStartDate(date);
      return;
    }
    const [hours, minutes] = startTimeValue
      .split(":")
      .map((str) => parseInt(str, 10));
    const newDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      hours,
      minutes,
    );
    setStartDate(newDate);
  };

  // Handle day select for end date
  const handleEndDaySelect = (date: Date | undefined) => {
    if (!endTimeValue || !date) {
      setEndDate(date);
      return;
    }
    const [hours, minutes] = endTimeValue
      .split(":")
      .map((str) => parseInt(str, 10));
    const newDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      hours,
      minutes,
    );
    setEndDate(newDate);
  };

  const handleRun = () => {
    // This is where you'd make your API call
    console.log({
      startDate,
      endDate,
      meterNo,
      selectedEventTypes,
      selectedEvents,
    });

    // For now, just set mock data
    setTableData(mockEventData);
  };

  const handleExport = () => {
    // Handle export functionality
    console.log("Exporting data...");
  };

  const totalRows = tableData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startRow = (currentPage - 1) * rowsPerPage + 1;
  const endRow = Math.min(currentPage * rowsPerPage, totalRows);

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex w-full flex-wrap items-end gap-4">
        {/* Start Date */}
        <div className="flex min-w-[180px] flex-1 flex-col gap-2">
          <Label htmlFor="start-date" className="text-sm font-medium">
            Start Date <span className="text-red-500">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start border-gray-300 text-left font-normal",
                  !startDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2" size={16} />
                {startDate
                  ? format(startDate, "dd-MM-yyyy HH:mm:ss")
                  : "Select Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto bg-white p-0" align="start">
              <div className="space-y-3 p-3">
                <div>
                  <Label
                    htmlFor="start-time"
                    className="text-xs font-medium text-gray-600"
                  >
                    Time
                  </Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={startTimeValue}
                    onChange={handleStartTimeChange}
                    className="mt-1 h-8 border-gray-300 text-sm"
                  />
                </div>
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={handleStartDaySelect}
                  className="bg-white"
                />
                {startDate && (
                  <div className="rounded bg-gray-50 px-2 py-1 text-xs text-gray-600">
                    {startDate.toLocaleString()}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* To Label */}
        <div className="flex items-center justify-center px-2 pb-2">
          <span className="text-sm">to</span>
        </div>

        {/* End Date */}
        <div className="flex min-w-[180px] flex-1 flex-col gap-2">
          <Label htmlFor="end-date" className="text-sm font-medium">
            End Date <span className="text-red-500">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start border-gray-300 text-left font-normal",
                  !endDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2" size={16} />
                {endDate
                  ? format(endDate, "dd-MM-yyyy HH:mm:ss")
                  : "Select Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto bg-white p-0" align="start">
              <div className="space-y-3 p-3">
                <div>
                  <Label
                    htmlFor="end-time"
                    className="text-xs font-medium text-gray-600"
                  >
                    Time
                  </Label>
                  <Input
                    id="end-time"
                    type="time"
                    value={endTimeValue}
                    onChange={handleEndTimeChange}
                    className="mt-1 h-8 border-gray-300 text-sm"
                  />
                </div>
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={handleEndDaySelect}
                  className="bg-white"
                />
                {endDate && (
                  <div className="rounded bg-gray-50 px-2 py-1 text-xs text-gray-600">
                    {endDate.toLocaleString()}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Meter No */}
        <div className="flex min-w-[140px] flex-1 flex-col gap-2">
          <Label htmlFor="meter-no" className="text-sm font-medium">
            Meter No. <span className="text-red-500">*</span>
          </Label>
          <Input
            id="meter-no"
            placeholder="622456789012"
            value={meterNo}
            onChange={(e) => setMeterNo(e.target.value)}
            className="w-full border-gray-300 focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50"
          />
        </div>

        {/* Events Type */}
        <div className="flex min-w-[160px] flex-1 flex-col gap-2">
          <Label className="text-sm font-medium">
            Events Type <span className="text-red-500">*</span>
          </Label>
          <DropdownMenu
            open={eventTypeDropdownOpen}
            onOpenChange={setEventTypeDropdownOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between border-gray-300"
              >
                {getEventTypeDisplayText()}
                <ChevronDown size={12} className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="max-h-60 w-[var(--radix-dropdown-menu-trigger-width)] min-w-[160px] overflow-y-auto"
              align="start"
            >
              {/* Select All Option */}
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                onClick={() => handleEventTypeChange("Select All")}
                className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-gray-50"
              >
                <span className="text-sm">Select All</span>
                <div className="flex h-4 w-4 items-center justify-center">
                  {selectedEventTypes.length === eventTypes.length ? (
                    <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-green-100">
                      <Check size={12} className="text-green-600" />
                    </div>
                  ) : (
                    <Square size={14} className="text-gray-400" />
                  )}
                </div>
              </DropdownMenuItem>

              {/* Dotted separator */}
              <div className="mx-2 border-t border-dotted border-[#4ECDC4]" />

              {eventTypes.map((type) => (
                <div key={type}>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    onClick={() => handleEventTypeChange(type)}
                    className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-gray-50"
                  >
                    <span className="text-sm">{type}</span>
                    <div className="flex h-4 w-4 items-center justify-center">
                      {selectedEventTypes.includes(type) ? (
                        <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-green-100">
                          <Check size={12} className="text-green-600" />
                        </div>
                      ) : (
                        <Square size={14} className="text-gray-400" />
                      )}
                    </div>
                  </DropdownMenuItem>
                  <div className="mx-2 border-t border-dotted border-[#4ECDC4]" />
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Events */}
        <div className="flex min-w-[120px] flex-1 flex-col gap-2">
          <Label className="text-sm font-medium">
            Events <span className="text-red-500">*</span>
          </Label>
          <DropdownMenu
            open={eventsDropdownOpen}
            onOpenChange={setEventsDropdownOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between border-gray-300"
                disabled={availableEventOptions.length === 0}
              >
                {getEventsDisplayText()}
                <ChevronDown size={12} className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="max-h-60 w-[var(--radix-dropdown-menu-trigger-width)] min-w-[160px] overflow-y-auto"
              align="start"
            >
              {/* Select All Option */}
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                onClick={() => handleEventsChange("Select All")}
                className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-gray-50"
              >
                <span className="text-sm">Select All</span>
                <div className="flex h-4 w-4 items-center justify-center">
                  {selectedEvents.length === availableEventOptions.length &&
                  availableEventOptions.length > 0 ? (
                    <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-green-100">
                      <Check size={12} className="text-green-600" />
                    </div>
                  ) : (
                    <Square size={14} className="text-gray-400" />
                  )}
                </div>
              </DropdownMenuItem>

              {/* Dotted separator */}
              <div className="mx-2 border-t border-dotted border-[#4ECDC4]" />

              {availableEventOptions.map((event) => (
                <div key={event}>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    onClick={() => handleEventsChange(event)}
                    className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-gray-50"
                  >
                    <span className="text-sm">{event}</span>
                    <div className="flex h-4 w-4 items-center justify-center">
                      {selectedEvents.includes(event) ? (
                        <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-green-100">
                          <Check size={12} className="text-green-600" />
                        </div>
                      ) : (
                        <Square size={14} className="text-gray-400" />
                      )}
                    </div>
                  </DropdownMenuItem>
                  <div className="mx-2 border-t border-dotted border-[#4ECDC4]" />
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Run Button */}
        <div className="flex items-end">
          <Button
            className="bg-[#161CCA] px-8 font-medium text-white hover:bg-[#161CCA]/90"
            onClick={handleRun}
          >
            Run
          </Button>
        </div>
      </div>

      {/* Rest of the component remains the same... */}
      {/* Table */}
      <div className="rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-3 text-sm font-medium text-gray-900">
                S/N
              </TableHead>
              <TableHead className="px-4 py-3 text-sm font-medium text-gray-900">
                Meter No.
              </TableHead>
              <TableHead className="px-4 py-3 text-sm font-medium text-gray-900">
                Feeder
              </TableHead>
              <TableHead className="px-4 py-3 text-sm font-medium text-gray-900">
                Time
              </TableHead>
              <TableHead className="px-4 py-3 text-sm font-medium text-gray-900">
                Event Type
              </TableHead>
              <TableHead className="px-4 py-3 text-sm font-medium text-gray-900">
                Event
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.length > 0 ? (
              tableData
                .slice(
                  (currentPage - 1) * rowsPerPage,
                  currentPage * rowsPerPage,
                )
                .map((row, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell className="px-4 py-3 text-sm text-gray-900">
                      {index + 1 + (currentPage - 1) * rowsPerPage}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-900">
                      {row.meterNo}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-900">
                      {row.feeder}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-900">
                      {row.time}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-900">
                      {row.eventType}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-900">
                      {row.event}
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-sm text-gray-500"
                >
                  No data available. Click "Run" to fetch events.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <Pagination className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Rows per page</span>
          <Select
            value={rowsPerPage.toString()}
            onValueChange={handleRowsPerPageChange}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              position="popper"
              side="top"
              align="center"
              className="mb-1 ring-gray-50"
            >
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="24">24</SelectItem>
              <SelectItem value="48">48</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm font-medium">
            {totalRows > 0 ? `${startRow}-${endRow} of ${totalRows}` : "0 of 0"}
          </span>
        </div>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePrevious();
              }}
              aria-disabled={currentPage === 1}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNext();
              }}
              aria-disabled={currentPage === totalPages || totalPages === 0}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
