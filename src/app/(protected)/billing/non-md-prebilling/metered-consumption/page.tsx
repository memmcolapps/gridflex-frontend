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
import { SquareArrowOutUpRight } from "lucide-react";
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
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { SortControl } from "@/components/search-control/sort";

// Sample data type for meter consumption
interface MeterConsumptionData {
  id: number;
  meterNo: string;
  feederLine: string;
  tariffType: string;
  averageConsumption: number;
  cumulativeReading: number;
  currentReadings: number;
  consumptionType: "Estimate" | "Actual" | "Fixed" | "Minimum";
  consumedEnergy: number;
}

// Sample data for meter consumption
const initialMeterConsumption: MeterConsumptionData[] = [
  {
    id: 1,
    meterNo: "62010121223",
    feederLine: "Ijeun",
    tariffType: "R1",
    averageConsumption: 200,
    cumulativeReading: 500,
    currentReadings: 0,
    consumptionType: "Estimate",
    consumedEnergy: 200,
  },
  {
    id: 2,
    meterNo: "62010121223",
    feederLine: "Ijeun",
    tariffType: "R2",
    averageConsumption: 40,
    cumulativeReading: 999.998,
    currentReadings: 300,
    consumptionType: "Actual",
    consumedEnergy: 302,
  },
  {
    id: 3,
    meterNo: "V-20102123",
    feederLine: "Ijeun",
    tariffType: "R3",
    averageConsumption: 200,
    cumulativeReading: 5000,
    currentReadings: 0,
    consumptionType: "Fixed",
    consumedEnergy: 200,
  },
  {
    id: 4,
    meterNo: "62010121223",
    feederLine: "Ijeun",
    tariffType: "C1",
    averageConsumption: 50,
    cumulativeReading: 300,
    currentReadings: 400,
    consumptionType: "Actual",
    consumedEnergy: 100,
  },
  {
    id: 5,
    meterNo: "62010121223",
    feederLine: "Ijeun",
    tariffType: "C2",
    averageConsumption: 80,
    cumulativeReading: 480,
    currentReadings: 0,
    consumptionType: "Estimate",
    consumedEnergy: 80,
  },
  {
    id: 6,
    meterNo: "V-20102123",
    feederLine: "Ijeun",
    tariffType: "C3",
    averageConsumption: 400,
    cumulativeReading: 2000,
    currentReadings: 0,
    consumptionType: "Fixed",
    consumedEnergy: 400,
  },
  {
    id: 7,
    meterNo: "62010121223",
    feederLine: "Ijeun",
    tariffType: "C1",
    averageConsumption: 100,
    cumulativeReading: 500,
    currentReadings: 900,
    consumptionType: "Actual",
    consumedEnergy: 400,
  },
  {
    id: 8,
    meterNo: "62010121223",
    feederLine: "Ijeun",
    tariffType: "R2",
    averageConsumption: 75,
    cumulativeReading: 50,
    currentReadings: 30,
    consumptionType: "Minimum",
    consumedEnergy: 0,
  },
  {
    id: 9,
    meterNo: "62010121223",
    feederLine: "Ijeun",
    tariffType: "C3",
    averageConsumption: 400,
    cumulativeReading: 999.98,
    currentReadings: 0,
    consumptionType: "Estimate",
    consumedEnergy: 400,
  },
  {
    id: 10,
    meterNo: "62010121223",
    feederLine: "Ijeun",
    tariffType: "R3",
    averageConsumption: 150,
    cumulativeReading: 999.8,
    currentReadings: 999.95,
    consumptionType: "Actual",
    consumedEnergy: 150,
  },
];

export default function MeterConsumptionPage() {
  const [meterConsumption, setMeterConsumption] = useState<
    MeterConsumptionData[]
  >(initialMeterConsumption);
  const [selectedConsumption, setSelectedConsumption] = useState<number[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortMonth, setSortMonth] = useState<string>("June");
  const [sortYear, setSortYear] = useState<string>("2025");
  const [currentSort, setCurrentSort] = useState<string>("");

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedConsumption(meterConsumption.map((item) => item.id));
    } else {
      setSelectedConsumption([]);
    }
  };

  const handleSelectItem = (checked: boolean, id: number) => {
    if (checked) {
      setSelectedConsumption([...selectedConsumption, id]);
    } else {
      setSelectedConsumption(
        selectedConsumption.filter((itemId) => itemId !== id),
      );
    }
  };

  const isAllSelected =
    meterConsumption.length > 0 &&
    selectedConsumption.length === meterConsumption.length;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentItems = meterConsumption.slice(startIndex, endIndex);
  const totalPages = Math.ceil(meterConsumption.length / rowsPerPage);

  useEffect(() => {
    setMeterConsumption(initialMeterConsumption);
  }, []);

  // Search handler
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    let filtered = initialMeterConsumption;

    if (term.trim() !== "") {
      filtered = initialMeterConsumption.filter(
        (item) =>
          item.meterNo?.toLowerCase().includes(term.toLowerCase()) ||
          item.feederLine?.toLowerCase().includes(term.toLowerCase()) ||
          item.tariffType?.toLowerCase().includes(term.toLowerCase()) ||
          item.consumptionType?.toLowerCase().includes(term.toLowerCase()),
      );
    }

    setMeterConsumption(filtered);
  };

  // Sort handler
  const handleSortChange = (sortBy: string) => {
    setCurrentSort(sortBy);
    let sorted = [...meterConsumption];

    if (sortBy === "asc") {
      sorted.sort((a, b) => a.averageConsumption - b.averageConsumption);
    } else if (sortBy === "desc") {
      sorted.sort((a, b) => b.averageConsumption - a.averageConsumption);
    }

    setMeterConsumption(sorted);
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

  const handleExport = () => {
    console.log("Exporting data...");
  };

  return (
    <div className="h-fit p-6">
      <div className="mb-4 flex items-center justify-between">
        <ContentHeader
          title="Metered Consumption"
          description="Generate energy consumption based on the latest meter readings"
        />
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

          {/* Right side button */}
          <div className="flex items-center gap-2">
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
                    aria-label="Select all consumption records"
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
              <TableHead>Average Consumption</TableHead>
              <TableHead>Cumulative Reading</TableHead>
              <TableHead>Current Readings</TableHead>
              <TableHead>Consumption Type</TableHead>
              <TableHead>Consumed Energy</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      className="border-gray-500"
                      checked={selectedConsumption.includes(item.id)}
                      onCheckedChange={(checked) =>
                        handleSelectItem(checked as boolean, item.id)
                      }
                      aria-label={`Select consumption record ${item.meterNo}`}
                    />
                    <span className="text-sm text-gray-900">
                      {String(
                        index + 1 + (currentPage - 1) * rowsPerPage,
                      ).padStart(2, "0")}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{item.meterNo}</TableCell>
                <TableCell>{item.feederLine}</TableCell>
                <TableCell>{item.tariffType}</TableCell>
                <TableCell>{item.averageConsumption}</TableCell>
                <TableCell>{item.cumulativeReading}</TableCell>
                <TableCell>{item.currentReadings || "-"}</TableCell>
                <TableCell>{item.consumptionType}</TableCell>
                <TableCell>{item.consumedEnergy}</TableCell>
              </TableRow>
            ))}
            {currentItems.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="py-4 text-center text-gray-500"
                >
                  No consumption records found.
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
            {startIndex + 1} to {Math.min(endIndex, meterConsumption.length)} of{" "}
            {meterConsumption.length} rows
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
    </div>
  );
}
