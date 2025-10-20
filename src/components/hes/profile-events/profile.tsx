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

interface ProfileData {
  sn: number;
  meterNo: string;
  feeder: string;
  time: string;
  profileType: string;
  profile: string;
  value: string;
}

const mockProfileData: ProfileData[] = [
  // Add your mock data here when you have it
];

const profileTypes = [
  "Energy Profile",
  "Instant Data Profile",
  "Billing Data Daily",
  "Billing Data Monthly",
];

// Profile options based on profile type
const profileOptionsByType: Record<string, string[]> = {
  "Energy Profile": [
    "Status Word",
    "Cumulative Total Active Energy kWh",
    "Cumulative Import Active Energy kWh",
    "Cumulative Export Active Energy kWh",
    "Cumulative Apparent Energy kWh",
    "Cumulative Import Apparent Energy kWh",
    "Cumulative Export Apparent Energy kWh",
  ],
  "Instant Data Profile": [
    "Status Word",
    "Clock",
    "Voltage L1",
    "Voltage L2",
    "Voltage L3",
    "Current L1",
    "Current L2",
    "Current L3",
    "Active Power +P",
    "Active Power -P",
    "Reactive Power +Q",
    "Reactive Power -Q",
    "Apparent Power +S",
    "Apparent Power -S",
    "Power Factor",
    "Frequency",
    "Quadrant",
    "Maximum Demand kW",
    "Maximum Demand kVA",
    "TOU Tariff",
    "Billing Count",
    "Cumulative Total Active Energy kWh",
    "Cumulative Import Active Energy kWh",
    "Cumulative Export Active Energy kWh",
    "Cumulative Total Reactive Energy kVARh",
    "Cumulative Import Reactive Energy kVARh",
    "Cumulative Export Reactive Energy kVARh",
    "Cumulative Apparent Energy kVAh",
    "Cumulative Import Apparent Energy kVAh",
    "Cumulative Export Apparent Energy kVAh",
  ],
  "Billing Data Daily": [
    "Residual Credit",
    "Daily Consumption",
    "Cumulative Total Active Energy kWh",
    "Cumulative Import Active Energy kWh",
    "Cumulative Export Active Energy kWh",
    "Cumulative Apparent Energy kWh",
    "Cumulative Import Apparent Energy kWh",
    "Cumulative Export Apparent Energy kWh",
  ],
  "Billing Data Monthly": [
    "Residual Credit",
    "Increase Active Energy kWh",
    "Cumulative Power Purchase Credit kWh",
    "Monthly Cumulative Running Hours kWh",
    "Cumulative Total Active Energy kWh",
    "Cumulative Import Active Energy kWh",
    "Cumulative Export Active Energy kWh",
    "Cumulative Apparent Energy kWh",
    "Cumulative Import Apparent Energy kWh",
    "Cumulative Export Apparent Energy kWh",
  ],
};

export function Profile() {
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [startTimeValue, setStartTimeValue] = useState<string>("00:00");
  const [endTimeValue, setEndTimeValue] = useState<string>("00:00");
  const [meterNo, setMeterNo] = useState("");
  const [selectedProfileTypes, setSelectedProfileTypes] = useState<string[]>(
    [],
  );
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [availableProfileOptions, setAvailableProfileOptions] = useState<
    string[]
  >([]);
  const [tableData, setTableData] = useState<ProfileData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [profileTypeDropdownOpen, setProfileTypeDropdownOpen] = useState(false);
  const [profilesDropdownOpen, setProfilesDropdownOpen] = useState(false);

  // Update available profile options when profile type changes
  useEffect(() => {
    if (selectedProfileTypes.length === 0) {
      setAvailableProfileOptions([]);
      setSelectedProfiles([]);
      return;
    }

    // Get all unique profile options from selected profile types
    const allOptions = selectedProfileTypes.flatMap(
      (type) => profileOptionsByType[type] ?? [],
    );
    const uniqueOptions = [...new Set(allOptions)];
    setAvailableProfileOptions(uniqueOptions);

    // Reset selected profiles when profile types change
    setSelectedProfiles([]);
  }, [selectedProfileTypes]);

  // Handle Profile Type selection
  const handleProfileTypeChange = (profileType: string) => {
    if (profileType === "Select All") {
      if (selectedProfileTypes.length === profileTypes.length) {
        // If all are selected, deselect all
        setSelectedProfileTypes([]);
      } else {
        // Select all profile types
        setSelectedProfileTypes([...profileTypes]);
      }
    } else {
      setSelectedProfileTypes((prev) => {
        if (prev.includes(profileType)) {
          // Remove if already selected
          return prev.filter((type) => type !== profileType);
        } else {
          // Add if not selected
          return [...prev, profileType];
        }
      });
    }
  };

  // Handle Profiles selection
  const handleProfilesChange = (profile: string) => {
    if (profile === "Select All") {
      if (selectedProfiles.length === availableProfileOptions.length) {
        // If all are selected, deselect all
        setSelectedProfiles([]);
      } else {
        // Select all profiles
        setSelectedProfiles([...availableProfileOptions]);
      }
    } else {
      setSelectedProfiles((prev) => {
        if (prev.includes(profile)) {
          // Remove if already selected
          return prev.filter((p) => p !== profile);
        } else {
          // Add if not selected
          return [...prev, profile];
        }
      });
    }
  };

  // Get display text for dropdowns
  const getProfileTypeDisplayText = () => {
    if (selectedProfileTypes.length === 0) return "Select Profile Type";
    if (selectedProfileTypes.length === 1) return selectedProfileTypes[0];
    if (selectedProfileTypes.length === profileTypes.length)
      return "All Profile Types";
    return `${selectedProfileTypes.length} Profile Types`;
  };

  const getProfilesDisplayText = () => {
    if (selectedProfiles.length === 0) return "Select Profiles";
    if (selectedProfiles.length === 1) return selectedProfiles[0];
    if (
      selectedProfiles.length === availableProfileOptions.length &&
      availableProfileOptions.length > 0
    )
      return "All Profiles";
    return `${selectedProfiles.length} Profiles`;
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
    // This is where you'd make your API call
    console.log({
      startDate,
      endDate,
      meterNo,
      selectedProfileTypes,
      selectedProfiles,
    });

    // For now, just set mock data
    setTableData(mockProfileData);
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
                  ? format(startDate, "dd-MM-yyyy HH:mm")
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
                {endDate ? format(endDate, "dd-MM-yyyy HH:mm") : "Select Date"}
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
              />
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

        {/* Profile Type */}
        <div className="flex min-w-[160px] flex-1 flex-col gap-2">
          <Label className="text-sm font-medium">
            Profile Type <span className="text-red-500">*</span>
          </Label>
          <DropdownMenu
            open={profileTypeDropdownOpen}
            onOpenChange={setProfileTypeDropdownOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between border-gray-300"
              >
                {getProfileTypeDisplayText()}
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
                onClick={() => handleProfileTypeChange("Select All")}
                className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-gray-50"
              >
                <span className="text-sm">Select All</span>
                <div className="flex h-4 w-4 items-center justify-center">
                  {selectedProfileTypes.length === profileTypes.length ? (
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

              {profileTypes.map((type) => (
                <div key={type}>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    onClick={() => handleProfileTypeChange(type)}
                    className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-gray-50"
                  >
                    <span className="text-sm">{type}</span>
                    <div className="flex h-4 w-4 items-center justify-center">
                      {selectedProfileTypes.includes(type) ? (
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

        {/* Profiles */}
        <div className="flex min-w-[120px] flex-1 flex-col gap-2">
          <Label className="text-sm font-medium">
            Profiles <span className="text-red-500">*</span>
          </Label>
          <DropdownMenu
            open={profilesDropdownOpen}
            onOpenChange={setProfilesDropdownOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between border-gray-300"
                disabled={availableProfileOptions.length === 0}
              >
                {getProfilesDisplayText()}
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
                onClick={() => handleProfilesChange("Select All")}
                className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-gray-50"
              >
                <span className="text-sm">Select All</span>
                <div className="flex h-4 w-4 items-center justify-center">
                  {selectedProfiles.length === availableProfileOptions.length &&
                  availableProfileOptions.length > 0 ? (
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

              {availableProfileOptions.map((profile) => (
                <div key={profile}>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    onClick={() => handleProfilesChange(profile)}
                    className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-gray-50"
                  >
                    <span className="text-sm">{profile}</span>
                    <div className="flex h-4 w-4 items-center justify-center">
                      {selectedProfiles.includes(profile) ? (
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
            className="cursor-pointer bg-[#161CCA] px-8 font-medium text-white hover:bg-[#161CCA]/90"
            onClick={handleRun}
          >
            Run
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
                Profile Type
              </TableHead>
              <TableHead className="px-4 py-3 text-sm font-medium text-gray-900">
                Profile
              </TableHead>
              <TableHead className="px-4 py-3 text-sm font-medium text-gray-900">
                Value
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
                      {row.profileType}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-900">
                      {row.profile}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-900">
                      {row.value}
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-8 text-center text-sm text-gray-500"
                >
                  No data available. Click &ldquo;Run&rdquo; to fetch profiles.
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
