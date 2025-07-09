"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CirclePlus,
  Printer,
  SquareArrowOutUpRight,
  Eye,
  PenLine,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ContentHeader } from "@/components/ui/content-header";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BulkUploadDialog } from "@/components/meter-management/bulk-upload";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { SortControl } from "@/components/search-control/sort";
import AddReadingDialog from "@/components/billing/add-readings";
import EditMeterReading from "@/components/billing/edit-reading";
import GenerateReadingSheet from "@/components/billing/generate-reading";

// Sample data type for meter readings
interface MeterReadingData {
  id: number;
  meterNo: string;
  feederLine: string;
  tariffType: string;
  larDate: string;
  lastActualReading: number;
  readingType: "Normal" | "Rollover";
  readingDate: string;
  currentReadings: number;
}

// Sample data for meter readings
const initialMeterReadings: MeterReadingData[] = [
  {
    id: 1,
    meterNo: "62010121223",
    feederLine: "Ijeun",
    tariffType: "R1",
    larDate: "16-06-2025",
    lastActualReading: 500,
    readingType: "Normal",
    readingDate: "16-06-2025",
    currentReadings: 0,
  },
  {
    id: 2,
    meterNo: "62010121223",
    feederLine: "Ijeun",
    tariffType: "R2",
    larDate: "16-06-2025",
    lastActualReading: 300,
    readingType: "Rollover",
    readingDate: "16-06-2025",
    currentReadings: 300,
  },
  {
    id: 3,
    meterNo: "62010121223",
    feederLine: "Ijeun",
    tariffType: "R3",
    larDate: "16-06-2025",
    lastActualReading: 450,
    readingType: "Normal",
    readingDate: "16-06-2025",
    currentReadings: 450,
  },
  {
    id: 4,
    meterNo: "62010121223",
    feederLine: "Ijeun",
    tariffType: "C1",
    larDate: "16-06-2025",
    lastActualReading: 400,
    readingType: "Normal",
    readingDate: "16-06-2025",
    currentReadings: 400,
  },
  {
    id: 5,
    meterNo: "62010121223",
    feederLine: "Ijeun",
    tariffType: "C2",
    larDate: "16-06-2025",
    lastActualReading: 480,
    readingType: "Normal",
    readingDate: "16-06-2025",
    currentReadings: 0,
  },
  {
    id: 6,
    meterNo: "62010121223",
    feederLine: "Ijeun",
    tariffType: "C3",
    larDate: "16-06-2025",
    lastActualReading: 800,
    readingType: "Normal",
    readingDate: "16-06-2025",
    currentReadings: 800,
  },
  {
    id: 7,
    meterNo: "62010121223",
    feederLine: "Ijeun",
    tariffType: "R1",
    larDate: "16-06-2025",
    lastActualReading: 900,
    readingType: "Normal",
    readingDate: "16-06-2025",
    currentReadings: 900,
  },
  {
    id: 8,
    meterNo: "62010121223",
    feederLine: "Ijeun",
    tariffType: "C2",
    larDate: "16-06-2025",
    lastActualReading: 30,
    readingType: "Normal",
    readingDate: "16-06-2025",
    currentReadings: 30,
  },
  {
    id: 9,
    meterNo: "62010121223",
    feederLine: "Ijeun",
    tariffType: "R3",
    larDate: "16-06-2025",
    lastActualReading: 999.98,
    readingType: "Normal",
    readingDate: "16-06-2025",
    currentReadings: 0,
  },
  {
    id: 10,
    meterNo: "62010121223",
    feederLine: "Ijeun",
    tariffType: "R3",
    larDate: "16-06-2025",
    lastActualReading: 999.95,
    readingType: "Normal",
    readingDate: "16-06-2025",
    currentReadings: 999.95,
  },
];

export default function MeterReadingSheetPage() {
  const [meterReadings, setMeterReadings] =
    useState<MeterReadingData[]>(initialMeterReadings);
  const [selectedReadings, setSelectedReadings] = useState<number[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isBulkUploadDialogOpen, setIsBulkUploadDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortMonth, setSortMonth] = useState<string>("June");
  const [sortYear, setSortYear] = useState<string>("2025");
  const [currentSort, setCurrentSort] = useState<string>("");

  // Dialog states
  const [isAddReadingDialogOpen, setIsAddReadingDialogOpen] = useState(false);
  const [isEditReadingDialogOpen, setIsEditReadingDialogOpen] = useState(false);
  const [isGenerateReadingSheetOpen, setIsGenerateReadingSheetOpen] =
    useState(false);
  const [selectedReadingForEdit, setSelectedReadingForEdit] =
    useState<MeterReadingData | null>(null);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedReadings(meterReadings.map((reading) => reading.id));
    } else {
      setSelectedReadings([]);
    }
  };

  const handleSelectItem = (checked: boolean, id: number) => {
    if (checked) {
      setSelectedReadings([...selectedReadings, id]);
    } else {
      setSelectedReadings(
        selectedReadings.filter((readingId) => readingId !== id),
      );
    }
  };

  const isAllSelected =
    meterReadings.length > 0 &&
    selectedReadings.length === meterReadings.length;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentReadings = meterReadings.slice(startIndex, endIndex);
  const totalPages = Math.ceil(meterReadings.length / rowsPerPage);

  const handleBulkUpload = (newData: MeterReadingData[]) => {
    setMeterReadings((prev) => [...prev, ...newData]);
  };

  useEffect(() => {
    setMeterReadings(initialMeterReadings);
  }, []);

  // Search handler
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    let filtered = initialMeterReadings;

    if (term.trim() !== "") {
      filtered = initialMeterReadings.filter(
        (item) =>
          item.meterNo?.toLowerCase().includes(term.toLowerCase()) ||
          item.feederLine?.toLowerCase().includes(term.toLowerCase()) ||
          item.tariffType?.toLowerCase().includes(term.toLowerCase()) ||
          item.readingType?.toLowerCase().includes(term.toLowerCase()),
      );
    }

    setMeterReadings(filtered);
  };

  // Sort handler
  const handleSortChange = (sortBy: string) => {
    setCurrentSort(sortBy);
    const sorted = [...meterReadings];

    if (sortBy === "asc") {
      sorted.sort(
        (a, b) =>
          new Date(a.readingDate).getTime() - new Date(b.readingDate).getTime(),
      );
    } else if (sortBy === "desc") {
      sorted.sort(
        (a, b) =>
          new Date(b.readingDate).getTime() - new Date(a.readingDate).getTime(),
      );
    }

    setMeterReadings(sorted);
  };

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

  const handleGenerateReadingSheet = () => {
    setIsGenerateReadingSheetOpen(true);
  };

  const handleExport = () => {
    console.log("Exporting data...");
  };

  const handleAddReadings = () => {
    setIsAddReadingDialogOpen(true);
  };

  const handleViewDetails = (reading: MeterReadingData) => {
    console.log("View details for:", reading);
  };

  const handleEditCurrentReadings = (reading: MeterReadingData) => {
    setSelectedReadingForEdit(reading);
    setIsEditReadingDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditReadingDialogOpen(false);
    setSelectedReadingForEdit(null);
  };

  return (
    <div className="h-fit p-6">
      <div className="mb-4 flex items-center justify-between">
        <ContentHeader
          title="Metered Reading Sheet"
          description="Set and manage meter readings to track electricity usage"
        />

        <div className="flex items-center gap-2">
          <Button
            className="flex items-center gap-2 border bg-white font-medium text-gray-700 hover:bg-gray-50"
            variant="outline"
            size="lg"
            onClick={() => setIsBulkUploadDialogOpen(true)}
          >
            <CirclePlus size={14} strokeWidth={2.3} className="h-4 w-4" />
            <span className="text-sm">Bulk Upload</span>
          </Button>
          <Button
            className="flex items-center gap-2 border bg-[#161CCA] font-medium text-white"
            variant="outline"
            size="lg"
            onClick={handleAddReadings}
          >
            <CirclePlus
              size={14}
              strokeWidth={2.3}
              className="h-4 w-4 text-white"
            />
            <span className="text-sm">Add Readings</span>
          </Button>
        </div>
      </div>

      <Card className="mb-4 border-none bg-white px-4 py-8 shadow-none">
        <div className="flex items-center justify-between gap-4">
          {/* Left side controls */}
          <div className="flex items-center gap-2">
            <div className="relative w-[300px]">
              <Search
                size={14}
                className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400"
              />
              <Input
                type="text"
                placeholder="Search by meter no., feeder, conf..."
                className="w-full border-gray-300 pl-10 focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
            <SortControl
              onSortChange={handleSortChange}
              currentSort={currentSort}
            />
            <Select value={sortMonth} onValueChange={setSortMonth}>
              <SelectTrigger className="w-[120px] border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="January">January</SelectItem>
                <SelectItem value="February">February</SelectItem>
                <SelectItem value="March">March</SelectItem>
                <SelectItem value="April">April</SelectItem>
                <SelectItem value="May">May</SelectItem>
                <SelectItem value="June">June</SelectItem>
                <SelectItem value="July">July</SelectItem>
                <SelectItem value="August">August</SelectItem>
                <SelectItem value="September">September</SelectItem>
                <SelectItem value="October">October</SelectItem>
                <SelectItem value="November">November</SelectItem>
                <SelectItem value="December">December</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortYear} onValueChange={setSortYear}>
              <SelectTrigger className="w-[100px] border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-2">
            <Button
              className="flex h-12 items-center gap-2 rounded border bg-[#22C55E] px-3 py-2 text-white hover:bg-[#22C55E]/90"
              onClick={handleGenerateReadingSheet}
            >
              <Printer size={14} className="h-4 w-4" />
              Generate Reading Sheet
            </Button>
            <Button
              className="flex h-12 items-center gap-2 rounded border border-[#161CCA] px-3 py-2 text-[#161CCA] hover:bg-[#161CCA]/10"
              variant="outline"
              onClick={handleExport}
            >
              <SquareArrowOutUpRight
                size={14}
                className="h-4 w-4 text-[#161CCA]"
              />
              Export
            </Button>
          </div>
        </div>
      </Card>

      <Card className="h-4/6 rounded-md border-none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px] px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <Checkbox
                    className="border-gray-500"
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all readings"
                  />
                  <Label
                    htmlFor="select-all"
                    className="text-sm font-semibold text-gray-700"
                  >
                    S/N
                  </Label>
                </div>
              </TableHead>
              <TableHead>Meter No.</TableHead>
              <TableHead>Feeder Line</TableHead>
              <TableHead>Tariff Type</TableHead>
              <TableHead>LAR Date</TableHead>
              <TableHead>Last Actual Reading</TableHead>
              <TableHead>Reading Type</TableHead>
              <TableHead>Reading Date</TableHead>
              <TableHead>Current Readings</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentReadings.map((reading, index) => (
              <TableRow key={reading.id}>
                <TableCell className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      className="border-gray-500"
                      checked={selectedReadings.includes(reading.id)}
                      onCheckedChange={(checked) =>
                        handleSelectItem(checked as boolean, reading.id)
                      }
                      aria-label={`Select reading ${reading.meterNo}`}
                    />
                    <span className="text-sm text-gray-900">
                      {String(
                        index + 1 + (currentPage - 1) * rowsPerPage,
                      ).padStart(2, "0")}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{reading.meterNo}</TableCell>
                <TableCell>{reading.feederLine}</TableCell>
                <TableCell>{reading.tariffType}</TableCell>
                <TableCell>{reading.larDate}</TableCell>
                <TableCell>{reading.lastActualReading}</TableCell>
                <TableCell>{reading.readingType}</TableCell>
                <TableCell>{reading.readingDate}</TableCell>
                <TableCell>{reading.currentReadings}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <span className="text-lg">⋮</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={() => handleViewDetails(reading)}
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <Eye size={14} className="h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleEditCurrentReadings(reading)}
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <PenLine size={14} className="h-4 w-4" />
                        Edit Current Readings
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {currentReadings.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="py-4 text-center text-gray-500"
                >
                  No meter readings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Pagination className="mt-4 flex items-center justify-between">
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
            {startIndex + 1} to {Math.min(endIndex, meterReadings.length)} of{" "}
            {meterReadings.length} rows
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
              className="border border-gray-300 hover:bg-gray-50"
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNext();
              }}
              aria-disabled={currentPage === totalPages}
              className="border border-gray-300 hover:bg-gray-50"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Bulk Upload Dialog */}
      <BulkUploadDialog<MeterReadingData>
        isOpen={isBulkUploadDialogOpen}
        onClose={() => setIsBulkUploadDialogOpen(false)}
        onSave={handleBulkUpload}
        title="Bulk Upload Meter Readings"
        requiredColumns={[
          "id",
          "meterNo",
          "feederLine",
          "tariffType",
          "larDate",
          "lastActualReading",
          "readingType",
          "readingDate",
          "currentReadings",
        ]}
        templateUrl="/templates/meter-readings-template.xlsx"
      />

      {/* Add Reading Dialog */}
      <AddReadingDialog
        open={isAddReadingDialogOpen}
        onClose={() => setIsAddReadingDialogOpen(false)}
      />

      {/* Edit Reading Dialog */}
      {selectedReadingForEdit && (
        <EditMeterReading
          id={selectedReadingForEdit.id}
          onClose={handleCloseEditDialog}
          initialData={{
            meterNo: selectedReadingForEdit.meterNo,
            month: "06", // Convert from date format
            year: "2025",
            readingType: selectedReadingForEdit.readingType,
            currentReadings: selectedReadingForEdit.currentReadings,
          }}
        />
      )}

      {/* Generate Reading Sheet Dialog */}
      <GenerateReadingSheet
        open={isGenerateReadingSheetOpen}
        onClose={() => setIsGenerateReadingSheetOpen(false)}
      />
    </div>
  );
}
