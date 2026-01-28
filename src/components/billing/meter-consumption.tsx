import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { useMonthlyConsumption } from "@/hooks/use-billing";

interface MeterConsumptionsProps {
    searchQuery: string;
    sortConfig: string;
    selectedMonth: string;
    selectedYear: string;
    meterClass: "MD" | "Non-MD";
}

export default function MeterConsumptions({ searchQuery, sortConfig, selectedMonth, selectedYear, meterClass }: MeterConsumptionsProps) {
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

    const monthMap: Record<string, string> = {
        "January": "JANUARY",
        "February": "FEBRUARY",
        "March": "MARCH",
        "April": "APRIL",
        "May": "MAY",
        "June": "JUNE",
        "July": "JULY",
        "August": "AUGUST",
        "September": "SEPTEMBER",
        "October": "OCTOBER",
        "November": "NOVEMBER",
        "December": "DECEMBER",
    };

    const { data, isLoading, isError } = useMonthlyConsumption({
        search: searchQuery || undefined,
        month: selectedMonth !== "All" ? monthMap[selectedMonth] : undefined,
        year: selectedYear !== "All" ? selectedYear : undefined,
        virtual: meterClass === "MD",
        page: currentPage - 1,
        size: rowsPerPage,
    });

    const consumptions = data?.consumptions ?? [];
    const totalCount = data?.totalCount ?? 0;

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedMonth, selectedYear, meterClass]);

    const isAllSelected = consumptions.length > 0 && consumptions.every(item => selectedRowIds.has(item.id));

    const handlePageSizeChange = (newPageSize: number) => {
        setRowsPerPage(newPageSize);
        setCurrentPage(1);
    };

    const handleCheckboxChange = (id: string, checked: boolean) => {
        setSelectedRowIds(prev => {
            const newSelected = new Set(prev);
            if (checked) {
                newSelected.add(id);
            } else {
                newSelected.delete(id);
            }
            return newSelected;
        });
    };

    const handleSelectAll = (checked: boolean) => {
        setSelectedRowIds(prev => {
            const newSelected = new Set(prev);
            if (checked) {
                consumptions.forEach(item => newSelected.add(item.id));
            } else {
                consumptions.forEach(item => newSelected.delete(item.id));
            }
            return newSelected;
        });
    };

    if (isLoading) {
        return (
            <Card className="h-full border-none p-4">
                <div className="flex items-center justify-center p-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
                </div>
            </Card>
        );
    }

    if (isError) {
        return (
            <Card className="h-full border-none p-4">
                <div className="flex items-center justify-center p-8 text-red-500">
                    Failed to load consumption data. Please try again.
                </div>
            </Card>
        );
    }

    return (
      <Card className="h-full border-none p-4">
        <div>
          <Table className="h-full">
            <TableHeader className="bg-transparent">
              <TableRow>
                <TableHead className="w-[50px] py-3 text-center">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                    className="mx-auto cursor-pointer border-gray-400 hover:border-gray-600 focus:ring-0 focus:ring-offset-0"
                  />
                </TableHead>
                <TableHead className="py-3 font-medium text-gray-700">
                  S/N
                </TableHead>
                <TableHead className="py-3 font-medium text-gray-700">
                  Meter No.
                </TableHead>
                <TableHead className="py-3 font-medium text-gray-700">
                  Feeder Line
                </TableHead>
                <TableHead className="py-3 font-medium text-gray-700">
                  Tariff Type
                </TableHead>
                <TableHead className="py-3 font-medium text-gray-700">
                  Avg. Consumption
                </TableHead>
                <TableHead className="py-3 font-medium text-gray-700">
                  Cumulative Reading
                </TableHead>
                <TableHead className="py-3 font-medium text-gray-700">
                  Current Readings
                </TableHead>
                <TableHead className="py-3 font-medium text-gray-700">
                  Reading Type
                </TableHead>
                <TableHead className="py-3 font-medium text-gray-700">
                  Consumed Energy
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-50">
              {consumptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="py-8 text-center text-gray-500">
                    No consumption data found.
                  </TableCell>
                </TableRow>
              ) : (
                consumptions.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="py-3 text-center">
                      <Checkbox
                        checked={selectedRowIds.has(item.id)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(item.id, Boolean(checked))
                        }
                        aria-label={`Select row ${item.id}`}
                        className="mx-auto cursor-pointer border-gray-500 hover:border-gray-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white"
                      />
                    </TableCell>
                    <TableCell className="py-3">
                      {(currentPage - 1) * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell className="py-3">
                      {item.meterNumber}
                    </TableCell>
                    <TableCell className="py-3">
                      {item.feederName}
                    </TableCell>
                    <TableCell className="py-3">
                      {item.tariffType}
                    </TableCell>
                    <TableCell className="py-3">
                      {item.averageConsumption}
                    </TableCell>
                    <TableCell className="py-3">
                      {item.cumulativeReading}
                    </TableCell>
                    <TableCell className="py-3">
                      {item.currentReading}
                    </TableCell>
                    <TableCell className="py-3">
                      {item.readingType}
                    </TableCell>
                    <TableCell className="py-3">
                      {item.consumption}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4">
          <PaginationControls
            currentPage={currentPage}
            totalItems={totalCount}
            pageSize={rowsPerPage}
            onPageChange={setCurrentPage}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      </Card>
    );
}