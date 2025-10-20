// components/billing/energy-import/feeder-details-table.tsx
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Card } from "../../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface FeederDetailsData {
  id: number;
  tariffType: string;
  previousConsumption: string;
  noOfVirtualMeters: number;
  totalConsumption: string;
  consumptionMeter: string;
}

interface FeederDetailsTableProps {
  feederId: string; // Added feederId prop
  searchQuery: string;
  sortConfig: string;
  selectedMonth: string;
  selectedYear: string;
  onDataChange: (data: FeederDetailsData[]) => void;
  onApply: () => Promise<void>;
}

export default function FeederDetailsTable({
  feederId: _feederId,
  searchQuery: _searchQuery,
  sortConfig: _sortConfig,
  selectedMonth: _selectedMonth,
  selectedYear: _selectedYear,
  onDataChange,
  onApply: _onApply,
}: FeederDetailsTableProps) {
  // Sample data - in real app, this would come from API based on feederId
  const initialData: FeederDetailsData[] = [
    {
      id: 1,
      tariffType: "R2 - Residential",
      previousConsumption: "125,244.45",
      noOfVirtualMeters: 1250,
      totalConsumption: "",
      consumptionMeter: "125,244.45",
    },
    {
      id: 2,
      tariffType: "C1 - Commercial",
      previousConsumption: "89,330.12",
      noOfVirtualMeters: 450,
      totalConsumption: "",
      consumptionMeter: "89,330.12",
    },
    {
      id: 3,
      tariffType: "C2 - Commercial",
      previousConsumption: "156,780.89",
      noOfVirtualMeters: 320,
      totalConsumption: "",
      consumptionMeter: "156,780.89",
    },
    {
      id: 4,
      tariffType: "I1 - Industrial",
      previousConsumption: "234,567.34",
      noOfVirtualMeters: 75,
      totalConsumption: "",
      consumptionMeter: "234,567.34",
    },
    {
      id: 5,
      tariffType: "I2 - Industrial",
      previousConsumption: "345,123.67",
      noOfVirtualMeters: 45,
      totalConsumption: "",
      consumptionMeter: "345,123.67",
    },
  ];

  const [data, setData] = useState<FeederDetailsData[]>(initialData);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRowIds, setSelectedRowIds] = useState<Set<number>>(new Set());

  // Notify parent component of data changes
  useEffect(() => {
    onDataChange(data);
  }, [data, onDataChange]);

  // Filter data based on search query
  const filteredData = data.filter((item) => {
    const searchMatch =
      _searchQuery === "" ||
      item.tariffType.toLowerCase().includes(_searchQuery.toLowerCase()) ||
      item.previousConsumption
        .toLowerCase()
        .includes(_searchQuery.toLowerCase()) ||
      item.totalConsumption.toLowerCase().includes(_searchQuery.toLowerCase());
    return searchMatch;
  });

  // Sort data based on sortConfig
  const sortedData = [...filteredData].sort((a, b) => {
    if (!_sortConfig) return 0;
    const [key, direction] = _sortConfig.split(":");
    const multiplier = direction === "desc" ? -1 : 1;

    if (key === "tariffType") {
      return (
        a[key as keyof FeederDetailsData]
          .toString()
          .localeCompare(b[key as keyof FeederDetailsData].toString()) *
        multiplier
      );
    }
    if (key === "noOfVirtualMeters") {
      return (a.noOfVirtualMeters - b.noOfVirtualMeters) * multiplier;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  const paginatedData = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  // Check if all items on the current page are selected
  const isAllSelected =
    paginatedData.length > 0 &&
    paginatedData.every((item) => selectedRowIds.has(item.id));

  // Check if some items on the current page are selected (for indeterminate state)
  const isSomeSelected =
    paginatedData.some((item) => selectedRowIds.has(item.id)) && !isAllSelected;

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

  // Function to handle individual checkbox change
  const handleCheckboxChange = (id: number, checked: boolean) => {
    setSelectedRowIds((prev) => {
      const newSelected = new Set(prev);
      if (checked) {
        newSelected.add(id);
      } else {
        newSelected.delete(id);
      }
      return newSelected;
    });
  };

  // Function to handle master checkbox change (select/deselect all on current page)
  const handleSelectAll = (checked: boolean) => {
    setSelectedRowIds((prev) => {
      const newSelected = new Set(prev);
      if (checked) {
        paginatedData.forEach((item) => newSelected.add(item.id));
      } else {
        paginatedData.forEach((item) => newSelected.delete(item.id));
      }
      return newSelected;
    });
  };

  // Handle input change for total consumption
  const handleTotalConsumptionChange = (id: number, value: string) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, totalConsumption: value } : item,
      ),
    );
  };

  return (
    <Card className="rounded border-none p-4 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            {/* Checkbox for Select All */}
            <TableHead className="w-[50px] text-center">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Select all"
                className={
                  isSomeSelected
                    ? "indeterminate"
                    : "mx-auto cursor-pointer border-gray-500 hover:border-gray-500 focus:ring-0 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-white"
                }
              />
            </TableHead>
            <TableHead className="py-3 font-medium text-gray-700">
              S/N
            </TableHead>
            <TableHead className="py-3 font-medium text-gray-700">
              Tariff Type
            </TableHead>
            <TableHead className="py-3 font-medium text-gray-700">
              Previous Consumption
            </TableHead>
            <TableHead className="py-3 font-medium text-gray-700">
              No. of Virtual Meters
            </TableHead>
            <TableHead className="py-3 font-medium text-gray-700">
              Total Consumption
            </TableHead>
            <TableHead className="py-3 font-medium text-gray-700">
              Consumption Meter
            </TableHead>
           
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((item, index) => {
            // Generate S/N based on current page and index
            const serialNumber = String(
              (currentPage - 1) * rowsPerPage + index + 1,
            ).padStart(2, "0");

            return (
              <TableRow key={item.id} className="hover:bg-gray-50">
                {/* Individual Checkbox */}
                <TableCell className="text-center">
                  <Checkbox
                    checked={selectedRowIds.has(item.id)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(item.id, Boolean(checked))
                    }
                    aria-label={`Select row ${item.id}`}
                    className="mx-auto cursor-pointer border-gray-500 hover:border-gray-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white"
                  />
                </TableCell>
                <TableCell className="font-medium">{serialNumber}</TableCell>
                <TableCell className="font-medium">{item.tariffType}</TableCell>
                <TableCell>{item.previousConsumption}</TableCell>
                <TableCell className="text-center">
                  {item.noOfVirtualMeters}
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.totalConsumption}
                    onChange={(e) =>
                      handleTotalConsumptionChange(item.id, e.target.value)
                    }
                    placeholder="Enter consumption"
                    className="w-full min-w-[150px] border-gray-300 focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50"
                  />
                </TableCell>
                <TableCell>{item.consumptionMeter}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Pagination className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Rows per page</span>
          <Select
            value={rowsPerPage.toString()}
            onValueChange={handleRowsPerPageChange}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={rowsPerPage.toString()} />
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
            {(currentPage - 1) * rowsPerPage + 1}-
            {Math.min(currentPage * rowsPerPage, sortedData.length)} of{" "}
            {sortedData.length} rows
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
              aria-disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </Card>
  );
}
