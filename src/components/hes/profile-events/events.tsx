/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useRef } from "react";
import type { ChangeEventHandler } from "react";
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
import {
  useEventNames,
  useEvents,
  useProfileEventsData,
} from "@/hooks/use-profile-events";
import { useMeters } from "@/hooks/use-assign-meter";
import { toast } from "sonner";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ChevronsUpDown } from "lucide-react";

interface EventData {
  sn: number;
  meterNo: string;
  feeder: string;
  time: string;
  eventType: string;
  event?: string;
  eventTypeId?: string;
  criticalLevel?: string;
  [key: string]: unknown;
}

interface EventTableColumn {
  key: string;
  label: string;
}

const baseEventColumns: EventTableColumn[] = [
  { key: "sn", label: "S/N" },
  { key: "meterNo", label: "Meter No." },
  { key: "feeder", label: "Feeder" },
  { key: "time", label: "Time" },
  { key: "eventType", label: "Event Type" },
  { key: "criticalLevel", label: "Critical Level" },
];

const fallbackEventColumns: EventTableColumn[] = [
  ...baseEventColumns,
  { key: "event", label: "Event" },
];

const mappedEventKeys = new Set([
  "criticalLevel",
  "eventTime",
  "eventType",
  "feederName",
  "meterNumber",
]);

const ignoredEventKeys = new Set(["id", "meter"]);

const headerCandidates = [
  "headers",
  "tableHeaders",
  "tableHeader",
  "columns",
] as const;

const prettifyHeader = (value: string) =>
  value
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const normalizeHeaderKey = (key: string) => {
  const aliases: Record<string, string> = {
    meterNumber: "meterNo",
    eventTime: "time",
    feederName: "feeder",
  };

  return aliases[key] ?? key;
};

const uniqueColumns = (columns: EventTableColumn[]) => {
  const seen = new Set<string>();

  return columns.filter((column) => {
    if (seen.has(column.key)) return false;
    seen.add(column.key);
    return true;
  });
};

const normalizeEventTableColumns = (headers: unknown): EventTableColumn[] => {
  if (!headers) return [];

  if (Array.isArray(headers)) {
    return headers
      .map((header) => {
        if (typeof header === "string") {
          return {
            key: normalizeHeaderKey(header),
            label: prettifyHeader(header),
          };
        }

        if (header && typeof header === "object") {
          const headerRecord = header as Record<string, unknown>;
          const key =
            headerRecord.key ??
            headerRecord.field ??
            headerRecord.name ??
            headerRecord.value;
          const label =
            headerRecord.label ??
            headerRecord.header ??
            headerRecord.title ??
            headerRecord.name ??
            key;

          if (typeof key === "string") {
            return {
              key: normalizeHeaderKey(key),
              label: typeof label === "string" ? label : prettifyHeader(key),
            };
          }
        }

        return null;
      })
      .filter((column): column is EventTableColumn => Boolean(column));
  }

  if (typeof headers === "object") {
    return Object.entries(headers as Record<string, unknown>).map(
      ([key, label]) => ({
        key: normalizeHeaderKey(key),
        label: typeof label === "string" ? label : prettifyHeader(key),
      }),
    );
  }

  return [];
};

const inferEventTableColumns = (records: Record<string, unknown>[]) => {
  if (records.length === 0) return fallbackEventColumns;

  const dynamicColumns = records.flatMap((record) =>
    Object.keys(record)
      .filter(
        (key) =>
          !mappedEventKeys.has(key) &&
          !ignoredEventKeys.has(key) &&
          typeof record[key] !== "object",
      )
      .map((key) => ({
        key: normalizeHeaderKey(key),
        label: key,
      })),
  );

  return uniqueColumns([...baseEventColumns, ...dynamicColumns]);
};

const resolveEventTableColumns = (
  serverColumns: EventTableColumn[],
  records: Record<string, unknown>[],
) => {
  const columns = serverColumns.length
    ? uniqueColumns([
        ...baseEventColumns,
        ...serverColumns.filter((column) => column.key !== "feeder"),
      ])
    : inferEventTableColumns(records);

  return columns.length ? columns : fallbackEventColumns;
};

const formatCellValue = (value: unknown) => {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return "-";
  return String(value);
};

interface EventsProps {
  selectedHierarchy: string | null;
  selectedUnits: string;
  onExportDataChange?: (data: {
    exportData: EventData[];
    exportColumns: { key: string; label: string }[];
  }) => void;
}

export function Events({ selectedHierarchy, selectedUnits, onExportDataChange }: EventsProps) {
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [hasNextPage, setHasNextPage] = useState(false);
  const [startTimeValue, setStartTimeValue] = useState<string>("00:00:00");
  const [endTimeValue, setEndTimeValue] = useState<string>("00:00:00");
  const [selectedMeterNos, setSelectedMeterNos] = useState<string[]>([]);
  const [selectedMeterModels, setSelectedMeterModels] = useState<string[]>([]);
  const [selectedEventType, setSelectedEventType] = useState<number | null>(
    null,
  );
  const [tableData, setTableData] = useState<EventData[]>([]);
  const [tableColumns, setTableColumns] =
    useState<EventTableColumn[]>(fallbackEventColumns);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [eventTypeDropdownOpen, setEventTypeDropdownOpen] = useState(false);
  const [meterDropdownOpen, setMeterDropdownOpen] = useState(false);
  const rowsPerPageRef = useRef(rowsPerPage);
  const { mutate: fetchEvents, isPending: isLoading } = useEvents();
  const { data: profileEventsData } = useProfileEventsData();
  const { data: eventTypesData } = useEventNames();
  const { data: metersData } = useMeters({
    page: 1,
    pageSize: 1000,
    searchTerm: "",
    sortBy: null,
    sortDirection: null,
    type: "assigned",
  });

  const eventTypes = eventTypesData?.responsedata ?? [];

  const getCriticalLevelStyle = (criticalLevel: string) => {
    switch (criticalLevel) {
      case "1":
        return { dot: "bg-blue-500", label: "Lv 1" };
      case "2":
        return { dot: "bg-green-500", label: "Lv 2" };
      case "3":
        return { dot: "bg-yellow-500", label: "Lv 3" };
      case "4":
        return { dot: "bg-orange-500", label: "Lv 4" };
      case "5":
        return { dot: "bg-red-500", label: "Lv 5" };
      default:
        return { dot: "bg-gray-400", label: "No level" };
    }
  };

  const filteredMeters =
    metersData?.actualMeters.filter((meter) => meter.type !== "VIRTUAL") ?? [];

  const handleEventTypeChange = (eventTypeId: number) => {
    setSelectedEventType(eventTypeId);
    setEventTypeDropdownOpen(false);
  };

  const getEventsDisplayText = () => {
    if (selectedEventType === null) return "Select Event";
    return eventTypes.find((et) => et.id === selectedEventType)?.name ?? "";
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

  const handleRun = (page = 0, size?: number) => {
    const effectiveSize = size ?? rowsPerPage;
    const isMeterModelRequired = selectedHierarchy && selectedUnits;
    if (
      !startDate ||
      !endDate ||
      selectedEventType === null ||
      (selectedMeterNos.length === 0 && selectedMeterModels.length === 0)
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const startDateStr = format(startDate, "yyyy-MM-dd HH:mm:ss");
    const endDateStr = format(endDate, "yyyy-MM-dd HH:mm:ss");

    fetchEvents(
      {
        page,
        size: effectiveSize,
        startDate: startDateStr,
        endDate: endDateStr,
        meterNumber: selectedMeterNos.join(","),
        eventTypeName: "",
        eventTypeId: String(selectedEventType),
        model: selectedMeterModels.join(","),
        node: selectedUnits ?? "",
      },
      {
        onSuccess: (data) => {
          toast.success("Events fetched successfully!");
          const records = data.responsedata.data;
          setHasNextPage(records.length === effectiveSize);
          setTotalRecords(data.responsedata.totalData);
          const serverColumns =
            headerCandidates
              .map((key) => normalizeEventTableColumns(data.responsedata[key]))
              .find((columns) => columns.length > 0) ?? [];
          setTableColumns(
            resolveEventTableColumns(
              serverColumns,
              records as unknown as Record<string, unknown>[],
            ),
          );
          const transformedData: EventData[] = records.map((event) => {
            const eventTypeName =
              typeof event.eventType === "string"
                ? event.eventType
                : (event.eventType?.name ?? "N/A");

            return {
              ...event,
              sn: 0,
              meterNo: event.meterNumber,
              feeder: event.meter?.flatNode?.feederName || "N/A",
              feederName: event.meter?.flatNode?.feederName || "N/A",
              time: event.eventTime,
              eventType: eventTypeName,
              event: event.event ?? event.eventName ?? eventTypeName,
              eventTypeId: event.eventTypeId?.toString() ?? "",
              criticalLevel: event.criticalLevel?.toString() ?? "",
              node: event.meter?.nodeId || "",
            };
          });
          transformedData.sort((a, b) => {
            const aLevel = parseInt(a.criticalLevel ?? "");
            const bLevel = parseInt(b.criticalLevel ?? "");
            if (isNaN(aLevel)) return 1;
            if (isNaN(bLevel)) return -1;
            return bLevel - aLevel;
          });
          const startSn = page * effectiveSize + 1;
          transformedData.forEach((item, index) => {
            item.sn = startSn + index;
          });
          setTableData(transformedData);
          setCurrentPage(page + 1);
        },
        onError: (error) => {
          toast.error(`Failed to fetch events: ${error.message}`);
        },
      },
    );
  };

  const handlePageSizeChange = (newPageSize: number) => {
    rowsPerPageRef.current = newPageSize;
    setRowsPerPage(newPageSize);
    setCurrentPage(1);
    handleRun(0, newPageSize);
  };

  const handlePageChange = (page: number) => {
    if (page < 1) return;
    setCurrentPage(page);
    handleRun(page - 1, rowsPerPageRef.current);
  };

  useEffect(() => {
    onExportDataChange?.({ exportData: tableData, exportColumns: tableColumns });
  }, [tableData, tableColumns, onExportDataChange]);

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
                <CalendarIcon className="mr-2 h-3 w-3" size={12} />
                {startDate
                  ? format(startDate, "dd-MM-yyyy HH:mm:ss")
                  : "Select Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto bg-white p-0" align="start">
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
                <CalendarIcon className="mr-2 h-3 w-3" size={12} />
                {endDate
                  ? format(endDate, "dd-MM-yyyy HH:mm:ss")
                  : "Select Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto bg-white p-0" align="start">
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

        {/* Meter Model */}
        <div className="flex min-w-[140px] flex-1 flex-col gap-2">
          <Label className="text-sm font-medium">Meter Model</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between border-gray-300"
                // disabled={!selectedHierarchy || !selectedUnits}
              >
                {selectedMeterModels.length > 0
                  ? `${selectedMeterModels.length} selected`
                  : "Select Meter Models"}
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
                  if (
                    selectedMeterModels.length ===
                    (profileEventsData?.responsedata.models.length ?? 0)
                  ) {
                    setSelectedMeterModels([]);
                  } else {
                    setSelectedMeterModels(
                      profileEventsData?.responsedata.models.map(
                        (m) => m.meterModel,
                      ) ?? [],
                    );
                  }
                }}
                className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-gray-50"
              >
                <span className="text-sm">Select All</span>
                <div className="flex h-4 w-4 items-center justify-center">
                  {selectedMeterModels.length ===
                  (profileEventsData?.responsedata.models.length ?? 0) ? (
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
                          : [...prev, model.meterModel],
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
          <Label className="text-sm font-medium">Meter No.</Label>
          <Popover open={meterDropdownOpen} onOpenChange={setMeterDropdownOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={meterDropdownOpen}
                className="w-full justify-between border-gray-300"
              >
                {selectedMeterNos.length > 0
                  ? `${selectedMeterNos.length} selected`
                  : "Select meter numbers..."}
                <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full border-none p-0">
              <Command className="border-none bg-white">
                <CommandInput
                  placeholder="Search meter numbers..."
                  className="border-none"
                />
                <CommandList>
                  <CommandEmpty>No meter found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => {
                        if (selectedMeterNos.length === filteredMeters.length) {
                          setSelectedMeterNos([]);
                        } else {
                          setSelectedMeterNos(
                            filteredMeters.map((m) => m.meterNumber),
                          );
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
                              : [...prev, meter.meterNumber],
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
              {eventTypes.map((type, index) => (
                <div key={type.id}>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    onClick={() => handleEventTypeChange(type.id)}
                    className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-gray-50"
                  >
                    <span className="text-sm">{type.name}</span>
                    <div className="flex h-4 w-4 items-center justify-center">
                      {selectedEventType === type.id ? (
                        <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-green-100">
                          <Check size={12} className="text-green-600" />
                        </div>
                      ) : (
                        <Square size={14} className="text-gray-400" />
                      )}
                    </div>
                  </DropdownMenuItem>
                  {index < eventTypes.length - 1 && (
                    <div className="mx-2 border-t border-dotted border-[#4ECDC4]" />
                  )}
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <Button
            className="cursor-pointer bg-[#161CCA] px-8 font-medium text-white hover:bg-[#161CCA]/90"
            onClick={() => handleRun(0)}
            disabled={
              !startDate ||
              !endDate ||
              selectedEventType === null ||
              (selectedMeterNos.length === 0 &&
                selectedMeterModels.length === 0) ||
              isLoading
            }
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
              {tableColumns.map((column) => (
                <TableHead
                  key={column.key}
                  className="px-4 py-3 text-sm font-medium whitespace-nowrap text-gray-900"
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: rowsPerPage }).map((_, index) => (
                <TableRow key={index}>
                  {tableColumns.map((column) => (
                    <TableCell
                      key={column.key}
                      className="px-4 py-3 text-sm text-gray-900"
                    >
                      <div className="h-4 animate-pulse rounded bg-gray-200"></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : tableData.length > 0 ? (
              tableData.map((row, index) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  {tableColumns.map((column) => (
                    <TableCell
                      key={column.key}
                      className="px-4 py-3 text-sm whitespace-nowrap text-gray-900"
                    >
                      {column.key === "criticalLevel" && row.criticalLevel
                        ? (() => {
                            const { dot, label } = getCriticalLevelStyle(
                              row.criticalLevel,
                            );
                            return (
                              <div className="flex items-center gap-2">
                                <span
                                  className={`h-2.5 w-2.5 rounded-full ${dot}`}
                                />
                                <span>{label}</span>
                              </div>
                            );
                          })()
                        : formatCellValue(row[column.key])}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
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
        totalItems={totalRecords}
        pageSize={rowsPerPage}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        zeroBasedIndexing={false}
      />
    </div>
  );
}
