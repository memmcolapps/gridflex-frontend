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
import { useState } from "react";

export default function ReadingSheetPage() {
  const [isLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isBulkUploadDialogOpen, setIsBulkUploadDialogOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<string>("");

  // Get current month and year
  const currentDate = new Date();
  const currentMonthIndex = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

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

  const [selectedMonth, setSelectedMonth] = useState<string>(
    months[currentMonthIndex] ?? "January",
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    currentYear.toString(),
  );

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

  // Handle filter changes
  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
  };

  return (
    <div className="p-6">
      {/* Content Header */}
      <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
        <ContentHeader
          title="Meter Reading Sheet"
          description="Set and manage meter reading to track electricity usage."
        />
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
                  {selectedMonth}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {months.map((month) => (
                  <DropdownMenuItem
                    key={month}
                    onClick={() => handleMonthChange(month)}
                    className={selectedMonth === month ? "bg-gray-100" : ""}
                  >
                    {month}
                  </DropdownMenuItem>
                ))}
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
                  {selectedYear}
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
          <Button
            variant={"default"}
            className="text-md cursor-pointer gap-2 bg-[#22C55E] px-8 py-5 font-semibold text-white"
            onClick={() => setIsGenerateDialogOpen(true)}
          >
            <Printer size={14} />
            Generate Readings
          </Button>
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
