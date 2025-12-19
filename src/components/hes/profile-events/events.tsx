/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import type { ChangeEventHandler } from "react";
import { Button } from "@/components/ui/button";
import { SimplifiedCalendar } from "@/components/ui/calendar";
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
import { PaginationControls } from "@/components/ui/pagination-controls";
import { useEvents, useProfileEventsData } from "@/hooks/use-profile-events";
import { useMeters } from "@/hooks/use-assign-meter";
import { toast } from "sonner";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ChevronsUpDown } from 'lucide-react';

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


interface EventsProps {
  selectedHierarchy: string | null;
  selectedUnits: string;
}

export function Events({ selectedHierarchy, selectedUnits }: EventsProps) {
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [startTimeValue, setStartTimeValue] = useState<string>("00:00:00");
  const [endTimeValue, setEndTimeValue] = useState<string>("00:00:00");
  const [selectedMeterNos, setSelectedMeterNos] = useState<string[]>([]);
  const [selectedMeterModels, setSelectedMeterModels] = useState<string[]>([]);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [tableData, setTableData] = useState<EventData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [eventTypeDropdownOpen, setEventTypeDropdownOpen] = useState(false);
  const [meterDropdownOpen, setMeterDropdownOpen] = useState(false);

  const { mutate: fetchEvents, isPending: isLoading } = useEvents();
  const { data: profileEventsData } = useProfileEventsData();
  const { data: metersData } = useMeters({
    page: 1,
    pageSize: 1000,
    searchTerm: "",
    sortBy: null,
    sortDirection: null,
    type: "assigned",
  });

  const filteredMeters = metersData?.actualMeters.filter(meter =>
    meter.type !== 'VIRTUAL'
  ) || [];
  

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

  // Get display text for dropdowns
  const getEventsDisplayText = () => {
    if (selectedEventTypes.length === 0) return "Select Events";
    if (selectedEventTypes.length === 1) return selectedEventTypes[0];
    if (selectedEventTypes.length === eventTypes.length)
      return "All Events";
    return `${selectedEventTypes.length} Events`;
  };

  // Handle time change for start date
  const handleStartTimeChange: ChangeEventHandler<HTMLInputElement> = (_e) => {
    // Implementation removed as function is not used
  };

  // Handle time change for end date
  const handleEndTimeChange: ChangeEventHandler<HTMLInputElement> = (_e) => {
    // Implementation removed as function is not used
  };

  // Handle day select for start date
  const handleStartDaySelect = (_date: Date | undefined) => {
    // Implementation removed as function is not used
  };

  // Handle day select for end date
  const handleEndDaySelect = (_date: Date | undefined) => {
    // Implementation removed as function is not used
  };

  const handleRun = () => {
    const isMeterModelRequired = selectedHierarchy && selectedUnits;
    if (!startDate || !endDate || selectedMeterNos.length === 0 || (isMeterModelRequired && selectedMeterModels.length === 0) || selectedEventTypes.length === 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    const startDateStr = format(startDate, "yyyy-MM-dd HH:mm:ss");
    const endDateStr = format(endDate, "yyyy-MM-dd HH:mm:ss");

    fetchEvents(
      {
        page: 0,
        size: 100,
        startDate: startDateStr,
        endDate: endDateStr,
        meterNumber: selectedMeterNos.join(','),
        eventTypeName: selectedEventTypes.join(','),
        model: selectedMeterModels.join(','),
        search: selectedMeterNos.join(','),
        node: selectedUnits,
      },
      {
        onSuccess: (data) => {
          toast.success("Events fetched successfully!");
          // Transform the data to match EventData interface
          const transformedData: EventData[] = data.responsedata.data.map((event, index) => ({
            sn: index + 1,
            meterNo: event.meterNumber,
            feeder: event.meter.flatNode?.feederName || "N/A",
            time: event.eventTime,
            eventType: event.eventType.name,
            event: event.eventName,
          }));
          setTableData(transformedData);
        },
        onError: (error) => {
          toast.error(`Failed to fetch events: ${error.message}`);
        },
      }
    );
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

  const handlePageSizeChange = (newPageSize: number) => {
    setRowsPerPage(newPageSize);
    setCurrentPage(1);
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
          <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
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
              <SimplifiedCalendar
                selected={startDate}
                timeValue={startTimeValue}
                onSelect={setStartDate}
                onTimeChange={setStartTimeValue}
                onClose={() => {
                  setStartDateOpen(false);
                }}
                showSeconds={true}
              />
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
          <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
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
              <SimplifiedCalendar
                selected={endDate}
                timeValue={endTimeValue}
                onSelect={setEndDate}
                onTimeChange={setEndTimeValue}
                onClose={() => {
                  setEndDateOpen(false);
                }}
                showSeconds={true}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Meter Model */}
        <div className="flex min-w-[140px] flex-1 flex-col gap-2">
          <Label className="text-sm font-medium">
            Meter Model <span className="text-red-500">*</span>
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between border-gray-300"
                disabled={!selectedHierarchy || !selectedUnits}
              >
                {selectedMeterModels.length > 0 ? `${selectedMeterModels.length} selected` : "Select Meter Models"}
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
                onClick={() => {
                  if (selectedMeterModels.length === (profileEventsData?.responsedata.models.length || 0)) {
                    setSelectedMeterModels([]);
                  } else {
                    setSelectedMeterModels(profileEventsData?.responsedata.models.map(m => m.meterModel) || []);
                  }
                }}
                className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-gray-50"
              >
                <span className="text-sm">Select All</span>
                <div className="flex h-4 w-4 items-center justify-center">
                  {selectedMeterModels.length === (profileEventsData?.responsedata.models.length || 0) ? (
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

              {profileEventsData?.responsedata.models.map((model) => (
                <div key={model.meterModel}>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    onClick={() => {
                      setSelectedMeterModels((prev) =>
                        prev.includes(model.meterModel)
                          ? prev.filter((m) => m !== model.meterModel)
                          : [...prev, model.meterModel]
                      );
                    }}
                    className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-gray-50"
                  >
                    <span className="text-sm">{model.meterModel}</span>
                    <div className="flex h-4 w-4 items-center justify-center">
                      {selectedMeterModels.includes(model.meterModel) ? (
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

        {/* Meter No */}
        <div className="flex min-w-[140px] flex-1 flex-col gap-2">
          <Label className="text-sm font-medium">
            Meter No. <span className="text-red-500">*</span>
          </Label>
          <Popover open={meterDropdownOpen} onOpenChange={setMeterDropdownOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={meterDropdownOpen}
                className="w-full justify-between border-gray-300"
              >
                {selectedMeterNos.length > 0 ? `${selectedMeterNos.length} selected` : "Select meter numbers..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 border-none">
              <Command className="bg-white border-none">
                <CommandInput placeholder="Search meter numbers..." className="border-none" />
                <CommandList>
                  <CommandEmpty>No meter found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => {
                        if (selectedMeterNos.length === filteredMeters.length) {
                          setSelectedMeterNos([]);
                        } else {
                          setSelectedMeterNos(filteredMeters.map(m => m.meterNumber));
                        }
                      }}
                      className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-gray-50"
                    >
                      <span className="text-sm">Select All</span>
                      <div className="flex h-4 w-4 items-center justify-center">
                        {selectedMeterNos.length === filteredMeters.length ? (
                          <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-green-100">
                            <Check size={12} className="text-green-600" />
                          </div>
                        ) : (
                          <Square size={14} className="text-gray-400" />
                        )}
                      </div>
                    </CommandItem>
                    <div className="mx-2 border-t border-dotted border-[#4ECDC4]" />
                    {filteredMeters.map((meter) => (
                      <CommandItem
                        key={meter.id ?? meter.meterNumber}
                        value={meter.meterNumber}
                        onSelect={() => {
                          setSelectedMeterNos((prev) =>
                            prev.includes(meter.meterNumber)
                              ? prev.filter((m) => m !== meter.meterNumber)
                              : [...prev, meter.meterNumber]
                          );
                        }}
                        className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-gray-50"
                      >
                        <span className="text-sm">{meter.meterNumber}</span>
                        <div className="flex h-4 w-4 items-center justify-center">
                          {selectedMeterNos.includes(meter.meterNumber) ? (
                            <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-green-100">
                              <Check size={12} className="text-green-600" />
                            </div>
                          ) : (
                            <Square size={14} className="text-gray-400" />
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Events */}
        <div className="flex min-w-[160px] flex-1 flex-col gap-2">
          <Label className="text-sm font-medium">
            Events <span className="text-red-500">*</span>
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

        {/* Search Button */}
        <div className="flex items-end">
          <Button
            className="cursor-pointer bg-[#161CCA] px-8 font-medium text-white hover:bg-[#161CCA]/90"
            onClick={handleRun}
            disabled={isLoading}
          >
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </div>
      </div>

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
            {isLoading ? (
              Array.from({ length: rowsPerPage }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="px-4 py-3 text-sm text-gray-900">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-gray-900">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-gray-900">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-gray-900">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-gray-900">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-gray-900">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : tableData.length > 0 ? (
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
                  No data available. Click &ldquo;Search&rdquo; to fetch events.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <PaginationControls
        currentPage={currentPage}
        totalItems={tableData.length}
        pageSize={rowsPerPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}