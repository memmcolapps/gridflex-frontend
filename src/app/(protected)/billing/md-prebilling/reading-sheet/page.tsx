"use client";
import AddReadingDialog from "@/components/billing/add-readings";
import GenerateReadingSheet from "@/components/billing/generate-reading";
import MeterReadings from "@/components/billing/meter-reading";
import { BulkUploadDialog } from "@/components/meter-management/bulk-upload";
import { SortControl } from "@/components/search-control";
import { Button } from "@/components/ui/button";
import { ContentHeader } from "@/components/ui/content-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  ChevronDown,
  CirclePlus,
  Printer,
  Search,
  SquareArrowOutUpRight,
} from "lucide-react";
import { useState, useCallback } from "react";
import { usePermissions } from "@/hooks/use-permissions";

export default function ReadingSheetPage() {
  const { canEdit } = usePermissions();
  const [isLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isBulkUploadDialogOpen, setIsBulkUploadDialogOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<string>("");

  // Get current month and year for filtering future dates
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonthIndex = currentDate.getMonth(); // 0-indexed

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Check if a month is in the future (only applies when current year is selected)
  const isMonthDisabled = (month: string) => {
    const selectedYearValue = selectedYear ?? displayYear;
    if (selectedYearValue === currentYear.toString()) {
      const monthIndex = months.indexOf(month);
      return monthIndex > currentMonthIndex;
    }
    return false;
  };

  // Start with undefined - no filter applied by default
  const [selectedMonth, setSelectedMonth] = useState<string | undefined>(undefined);
  const [selectedYear, setSelectedYear] = useState<string | undefined>(undefined);
  // Display values from latest API response
  const [displayMonth, setDisplayMonth] = useState<string>("");
  const [displayYear, setDisplayYear] = useState<string>("");
  // Track if filter has been manually triggered
  const [isFilterActive, setIsFilterActive] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputValue(e.target.value);

  const handleBulkUpload = (_data: unknown) => {
    setIsBulkUploadDialogOpen(false);
  };

  const handleSortChange = (sortBy: string) => {
    setSortConfig(sortBy);
  };

  // Generate years (current year and past 5 years)
  const years = [
    ...Array.from({ length: 6 }, (_, i) => (currentYear - i).toString()),
  ];

  // Handle filter changes - activates filtering
  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    setDisplayMonth(month);
    setIsFilterActive(true);
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setDisplayYear(year);
    setIsFilterActive(true);

    // If selecting current year and the selected month is in the future, reset it
    if (year === currentYear.toString() && selectedMonth) {
      const selectedMonthIndex = months.indexOf(selectedMonth);
      if (selectedMonthIndex > currentMonthIndex) {
        // Reset to current month
        const currentMonth = months[currentMonthIndex];
        setSelectedMonth(currentMonth);
        setDisplayMonth(currentMonth ?? "");
      }
    }
  };

  // Callback to receive latest data from API response
  const handleDataLoaded = useCallback((latestMonth: string, latestYear: string) => {
    if (!isFilterActive) {
      setDisplayMonth(latestMonth);
      setDisplayYear(latestYear);
    }
  }, [isFilterActive]);

  return (
    <div className="p-6">
      {/* Content Header */}
      <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
        <ContentHeader
          title="Meter Reading Sheet"
          description="Set and manage meter reading to track electricity usage."
        />
        {canEdit && (
          <div className="flex flex-col gap-2 md:flex-row">
            <Button
              className="flex w-full cursor-pointer items-center gap-2 border border-[#161CCA] font-medium text-[#161CCA] md:w-auto"
              variant="outline"
              size="lg"
              onClick={() => setIsBulkUploadDialogOpen(true)}
            >
              <CirclePlus size={14} strokeWidth={2.3} className="h-4 w-4" />
              <span className="text-sm md:text-base">Bulk Upload</span>
            </Button>
            <Button
              className="flex w-full cursor-pointer items-center gap-2 bg-[#161CCA] font-medium text-white md:w-auto"
              variant="secondary"
              size="lg"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <CirclePlus size={14} strokeWidth={2.3} className="h-4 w-4" />
              <span className="text-sm md:text-base">Add Reading</span>
            </Button>
          </div>
        )}
      </div>

      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-full lg:w-[300px]">
            <Search
              size={14}
              className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400"
            />
            <Input
              type="text"
              placeholder="Search by meter no., account no..."
              value={inputValue}
              onChange={handleChange}
              className="w-full border-gray-300 pl-10 text-sm focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50 lg:text-base"
            />
          </div>
          <div className="flex gap-2">
            <SortControl
              onSortChange={handleSortChange}
              currentSort={sortConfig}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 p-4"
                >
                  <ChevronDown size={14} />
                  {displayMonth || "Month"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {months.map((month) => {
                  const disabled = isMonthDisabled(month);
                  return (
                    <DropdownMenuItem
                      key={month}
                      onClick={() => !disabled && handleMonthChange(month)}
                      className={`${selectedMonth === month ? "bg-gray-100" : ""} ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
                      disabled={disabled}
                    >
                      {month}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 p-4"
                >
                  <ChevronDown size={14} />
                  {displayYear || "Year"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {years.map((year) => (
                  <DropdownMenuItem
                    key={year}
                    onClick={() => handleYearChange(year)}
                    className={selectedYear === year ? "bg-gray-100" : ""}
                  >
                    {year}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex gap-5">
          {canEdit && (
            <Button
              variant={"default"}
              className="text-md cursor-pointer gap-2 bg-[#22C55E] px-8 py-5 font-semibold text-white"
              onClick={() => setIsGenerateDialogOpen(true)}
            >
              <Printer size={14} />
              Generate Readings
            </Button>
          )}
          <Button
            variant={"default"}
            className="text-md cursor-pointer gap-2 border px-8 py-5 font-semibold text-[rgba(22,28,202,1)]"
          >
            <SquareArrowOutUpRight size={14} />
            Export
          </Button>
        </div>
      </div>

      <div className="flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <MeterReadings
            searchQuery={inputValue}
            sortConfig={sortConfig}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            meterClass="MD"
            onDataLoaded={handleDataLoaded}
          />
        )}
      </div>
      <AddReadingDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        meterClass="MD"
      />
      <GenerateReadingSheet
        open={isGenerateDialogOpen}
        onClose={() => setIsGenerateDialogOpen(false)}
        meterClass="MD"
      />
      <BulkUploadDialog
        isOpen={isBulkUploadDialogOpen}
        onClose={() => setIsBulkUploadDialogOpen(false)}
        onSave={handleBulkUpload}
        title="Bulk Upload readings"
        requiredColumns={[
          "id",
          "meterNumber",
          "federLine",
          "tariff",
          "larDate",
          "lastActuralReading",
          "readingType",
          "readingDate",
          "currentReadings",
        ]}
        templateUrl="/templates/readingSheet-template.xlsx"
      />
    </div>
  );
}
