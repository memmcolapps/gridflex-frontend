// EnergyImportPage.tsx
"use client";
import { BulkUploadDialog } from "@/components/meter-management/bulk-upload";
import { SortControl } from "@/components/search-control";
import { Button } from "@/components/ui/button";
import { ContentHeader } from "@/components/ui/content-header";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, CirclePlus, SquareArrowOutUpRight } from "lucide-react";
import { useState, useEffect } from "react";
import { usePermissions } from "@/hooks/use-permissions";
import ExportEnergyImportDialog from "@/components/billing/energy-import/export-energy-import-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddReadings from "@/components/billing/md-energy-import/add-readings-dialog";
import EnergyImportTable from "@/components/billing/md-energy-import/emergy-import";
import { useEnergyImportList } from "@/hooks/use-billing";
import { Loader2 } from "lucide-react";

interface EnergyImportData {
  id: number;
  feederName: string;
  assetId: string;
  feederConsumption: string;
  prepaidConsumption: string;
  postpaidConsumption: string;
  mdVirtual: string;
  nonMdVirtual: string;
  month: string; // Required to match AddReadings
  year: string;
  technicalLoss: string;
  commercialLoss: string;
  nodeId?: string;
}

export default function EnergyImportPage() {
  const [inputValue, setInputValue] = useState("");
  const [isBulkUploadDialogOpen, setIsBulkUploadDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isAddReadingsDialogOpen, setIsAddReadingsDialogOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("6");
  const [selectedYear, setSelectedYear] = useState<string>("2025");
  const [selectedRowIds, setSelectedRowIds] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [allData, setAllData] = useState<EnergyImportData[]>([]);

  // Fetch data from API
  const {
    data: apiData,
    isLoading,
    error,
  } = useEnergyImportList({
    search: inputValue || undefined,
    month: selectedMonth,
    year: selectedYear,
    page: currentPage,
    size: pageSize,
    enabled: true,
  });

  // Update allData when API data changes
  useEffect(() => {
    if (apiData?.feeders) {
      // Transform API data to match EnergyImportData interface
      const transformedData: EnergyImportData[] = apiData.feeders.map(
        (feeder, index) => ({
          id: index + 1,
          feederName: feeder.feederName,
          assetId: feeder.assetId,
          feederConsumption: feeder.feederConsumption?.toString() ?? "0",
          prepaidConsumption: feeder.prepaidConsumption?.toString() ?? "0",
          postpaidConsumption: feeder.postpaidConsumption?.toString() ?? "0",
          mdVirtual: feeder.mdVirtual?.toString() ?? "0",
          nonMdVirtual: feeder.nonMdVirtual?.toString() ?? "NOT SET",
          month: selectedMonth,
          year: selectedYear,
          technicalLoss: feeder.technicalLoss?.toString() ?? "0",
          commercialLoss: feeder.commercialLoss?.toString() ?? "0",
          nodeId: feeder.nodeId,
        }),
      );
      setAllData(transformedData);
    }
  }, [apiData, selectedMonth, selectedYear]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setCurrentPage(0); // Reset to first page on search
  };

  const handleBulkUpload = (_data: unknown) => {
    setIsBulkUploadDialogOpen(false);
  };

  const handleSortChange = (sortBy: string) => {
    setSortConfig(sortBy);
  };

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

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) =>
    (currentYear - i).toString(),
  );

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    setCurrentPage(0); // Reset to first page when filters change
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setCurrentPage(0); // Reset to first page when filters change
  };

  const handleExport = () => {
    setIsExportDialogOpen(true);
  };

  const handleSaveReadings = (formData: {
    assetId: string;
    month: string;
    year: string;
    technicalLoss: string;
    commercialLoss: string;
    feederConsumption: string;
  }) => {
    // Generate a new ID (e.g., max existing ID + 1)
    const newId =
      allData.length > 0 ? Math.max(...allData.map((item) => item.id)) + 1 : 1;
    // Create a new entry with default values for fields not in formData
    const newEntry: EnergyImportData = {
      id: newId,
      feederName: formData.assetId, // Use assetId as feederName for new entries (adjust as needed)
      assetId: formData.assetId,
      feederConsumption: formData.feederConsumption,
      prepaidConsumption: "0", // Default value (adjust based on your logic)
      postpaidConsumption: "0", // Default value
      mdVirtual: "0", // Default value
      nonMdVirtual: "NOT SET", // Default value
      month: formData.month,
      year: formData.year,
      technicalLoss: formData.technicalLoss,
      commercialLoss: formData.commercialLoss,
    };
    setAllData([...allData, newEntry]);
    setIsAddReadingsDialogOpen(false);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(0);
  };

  return (
    <div className="bg-transparent p-6">
      <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
        <ContentHeader
          title="Energy Import"
          description="Set and manage feeder readings to track electricity usage and generate bills"
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
            onClick={() => setIsAddReadingsDialogOpen(true)}
          >
            <CirclePlus size={14} strokeWidth={2.3} className="h-4 w-4" />
            <span className="text-sm md:text-base">Add Readings</span>
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
              placeholder="Search by meter no., feeder, cont..."
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
            <Select value={selectedMonth} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month, index) => (
                  <SelectItem key={month} value={(index + 1).toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={handleYearChange}>
              <SelectTrigger className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex cursor-pointer items-center gap-2 border-[#161CCA] font-medium text-[#161CCA]"
            onClick={handleExport}
          >
            <SquareArrowOutUpRight size={14} />
            Export
          </Button>
        </div>
      </div>

      <div className="flex-1 bg-transparent">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-[#161CCA]" />
            <span className="ml-2">Loading energy import data...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-8 text-red-500">
            <p>Error loading data</p>
            <p className="text-sm">{error.message}</p>
          </div>
        ) : (
          <EnergyImportTable
            searchQuery={inputValue}
            sortConfig={sortConfig}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onSelectionChange={setSelectedRowIds}
            allData={allData} // Pass allData to EnergyImportTable
            setAllData={setAllData}
            currentPage={currentPage}
            pageSize={pageSize}
            totalPages={apiData?.totalPages ?? 0}
            totalCount={apiData?.totalCount ?? 0}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </div>

      <BulkUploadDialog
        isOpen={isBulkUploadDialogOpen}
        onClose={() => setIsBulkUploadDialogOpen(false)}
        onSave={handleBulkUpload}
        title="Bulk Upload Energy Import"
        requiredColumns={[
          "feederName",
          "assetId",
          "feederConsumption",
          "prepaidConsumption",
          "postpaidConsumption",
          "mdVirtual",
          "nonMdVirtual",
        ]}
        templateUrl="/templates/energy-import-template.xlsx"
      />

      <ExportEnergyImportDialog
        open={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        selectedRowIds={selectedRowIds}
        allData={allData}
      />

      <Dialog
        open={isAddReadingsDialogOpen}
        onOpenChange={setIsAddReadingsDialogOpen}
      >
        <DialogContent className="h-fit w-full max-w-2xl bg-white p-6">
          <DialogHeader>
            <DialogTitle>Add Readings</DialogTitle>
            <p className="text-sm text-gray-500">
              Enter asset ID and add readings.
            </p>
          </DialogHeader>
          <AddReadings
            onClose={() => setIsAddReadingsDialogOpen(false)}
            onSave={handleSaveReadings}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
