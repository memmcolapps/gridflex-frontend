import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Card } from "../ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { PaginationControls } from "@/components/ui/pagination-controls";

interface MeterConsumption {
    id: number;
    meterNo: string;
    feederLine: string;
    tariffType: string;
    averageConsumption: number;
    cumulativeReading: number | string;
    currentReadings: number | string;
    consumptionType: string;
    consumedEnergy: number;
    larDate: string;
    lastReading: number;
    readingType: string;
    readingDate: string;
}

interface MeterConsumptionsProps {
    searchQuery: string;
    sortConfig: string;
    selectedMonth: string;
    selectedYear: string;
}

export default function MeterConsumptions({ searchQuery, sortConfig, selectedMonth, selectedYear }: MeterConsumptionsProps) {
    const data: MeterConsumption[] = [
        { id: 1, meterNo: "62010223", feederLine: "Ijeun", tariffType: "D1", averageConsumption: 200, cumulativeReading: 500, currentReadings: 0, consumptionType: "Estimate", consumedEnergy: 200, larDate: "16-05-2025", lastReading: 500, readingType: "Normal", readingDate: "16-06-2025" },
        { id: 2, meterNo: "62010224", feederLine: "Ijeun", tariffType: "D2", averageConsumption: 40, cumulativeReading: 999998, currentReadings: 300, consumptionType: "Actual", consumedEnergy: 302, larDate: "16-07-2025", lastReading: 300, readingType: "Rollover", readingDate: "16-06-2025" },
        { id: 3, meterNo: "V-201021223", feederLine: "Ijeun", tariffType: "D3", averageConsumption: 200, cumulativeReading: 5000, currentReadings: "-", consumptionType: "Fixed", consumedEnergy: 200, larDate: "16-05-2025", lastReading: 450, readingType: "Normal", readingDate: "16-06-2025" },
        { id: 4, meterNo: "62010225", feederLine: "Ijeun", tariffType: "D1", averageConsumption: 50, cumulativeReading: 300, currentReadings: 400, consumptionType: "Actual", consumedEnergy: 100, larDate: "16-05-2025", lastReading: 400, readingType: "Normal", readingDate: "16-06-2025" },
        { id: 5, meterNo: "62010226", feederLine: "Ijeun", tariffType: "D2", averageConsumption: 80, cumulativeReading: 480, currentReadings: 0, consumptionType: "Estimate", consumedEnergy: 80, larDate: "16-07-2025", lastReading: 480, readingType: "Normal", readingDate: "16-06-2025" },
        { id: 6, meterNo: "V-201021224", feederLine: "Ijeun", tariffType: "D3", averageConsumption: 400, cumulativeReading: 2000, currentReadings: "-", consumptionType: "Fixed", consumedEnergy: 400, larDate: "16-05-2025", lastReading: 800, readingType: "Normal", readingDate: "16-06-2025" },
        { id: 7, meterNo: "62010227", feederLine: "Ijeun", tariffType: "D1", averageConsumption: 100, cumulativeReading: 500, currentReadings: 900, consumptionType: "Actual", consumedEnergy: 400, larDate: "16-06-2025", lastReading: 900, readingType: "Normal", readingDate: "16-06-2025" },
        { id: 8, meterNo: "62010228", feederLine: "Ijeun", tariffType: "D2", averageConsumption: 75, cumulativeReading: 50, currentReadings: 30, consumptionType: "Minimum", consumedEnergy: 0, larDate: "16-05-2025", lastReading: 30, readingType: "Normal", readingDate: "16-06-2025" },
        { id: 9, meterNo: "62010229", feederLine: "Ijeun", tariffType: "D3", averageConsumption: 400, cumulativeReading: 999980, currentReadings: 0, consumptionType: "Estimate", consumedEnergy: 400, larDate: "16-05-2025", lastReading: 99980, readingType: "Normal", readingDate: "16-06-2025" },
        { id: 10, meterNo: "62010230", feederLine: "Ijeun", tariffType: "D3", averageConsumption: 150, cumulativeReading: 999800, currentReadings: 999950, consumptionType: "Actual", consumedEnergy: 150, larDate: "16-05-2025", lastReading: 99950, readingType: "Normal", readingDate: "16-06-2025" },
        { id: 11, meterNo: "62010231", feederLine: "Ijeun", tariffType: "D1", averageConsumption: 120, cumulativeReading: 600, currentReadings: 100, consumptionType: "Actual", consumedEnergy: 100, larDate: "17-05-2025", lastReading: 600, readingType: "Normal", readingDate: "17-06-2025" },
        { id: 12, meterNo: "62010232", feederLine: "Ijeun", tariffType: "D2", averageConsumption: 60, cumulativeReading: 520, currentReadings: 50, consumptionType: "Estimate", consumedEnergy: 60, larDate: "17-07-2025", lastReading: 520, readingType: "Normal", readingDate: "17-06-2025" },
        { id: 13, meterNo: "V-201021225", feederLine: "Ijeun", tariffType: "D3", averageConsumption: 250, cumulativeReading: 5500, currentReadings: "-", consumptionType: "Fixed", consumedEnergy: 250, larDate: "17-05-2025", lastReading: 500, readingType: "Normal", readingDate: "17-06-2025" },
        { id: 14, meterNo: "62010233", feederLine: "Ijeun", tariffType: "D1", averageConsumption: 70, cumulativeReading: 350, currentReadings: 450, consumptionType: "Actual", consumedEnergy: 100, larDate: "17-05-2025", lastReading: 450, readingType: "Normal", readingDate: "17-06-2025" },
        { id: 15, meterNo: "62010234", feederLine: "Ijeun", tariffType: "D2", averageConsumption: 90, cumulativeReading: 500, currentReadings: 0, consumptionType: "Estimate", consumedEnergy: 90, larDate: "17-07-2025", lastReading: 500, readingType: "Normal", readingDate: "17-06-2025" },
        { id: 16, meterNo: "62010235", feederLine: "Ijeun", tariffType: "D1", averageConsumption: 110, cumulativeReading: 550, currentReadings: 950, consumptionType: "Actual", consumedEnergy: 400, larDate: "18-06-2025", lastReading: 950, readingType: "Normal", readingDate: "18-06-2025" },
        { id: 17, meterNo: "62010236", feederLine: "Ijeun", tariffType: "D2", averageConsumption: 85, cumulativeReading: 70, currentReadings: 40, consumptionType: "Minimum", consumedEnergy: 0, larDate: "18-05-2025", lastReading: 40, readingType: "Normal", readingDate: "18-06-2025" },
    ];

    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedRowIds, setSelectedRowIds] = useState<Set<number>>(new Set());

    const parseDate = (dateStr: string): Date => {
        const parts = dateStr.split('-');
        const day = Number(parts[0]);
        const month = Number(parts[1]);
        const year = Number(parts[2]);

        const safeDay = isNaN(day) ? 1 : day;
        const safeMonth = isNaN(month) ? 1 : month;
        const safeYear = isNaN(year) ? new Date().getFullYear() : year;

        return new Date(safeYear, safeMonth - 1, safeDay);
    };

    const filteredData = data.filter((item) => {
        const larDate = parseDate(item.larDate);
        const monthMatch = selectedMonth === "All" ||
            larDate.toLocaleString('default', { month: 'long' }) === selectedMonth;
        const yearMatch = selectedYear === "All" ||
            larDate.getFullYear().toString() === selectedYear;
        const searchMatch = searchQuery === "" ||
            item.meterNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.feederLine.toLowerCase().includes(searchQuery.toLowerCase());
        return monthMatch && yearMatch && searchMatch;
    });

    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortConfig) return 0;
        const [key, direction] = sortConfig.split(':');
        const multiplier = direction === 'desc' ? -1 : 1;

        if (key === 'meterNo' || key === 'feederLine' || key === 'tariffType' || key === 'consumptionType') {
            return String(a[key as keyof MeterConsumption]).localeCompare(String(b[key as keyof MeterConsumption])) * multiplier;
        }
        if (key === 'larDate' || key === 'readingDate') {
            return (parseDate(a[key as 'larDate' | 'readingDate']).getTime() - parseDate(b[key as 'larDate' | 'readingDate']).getTime()) * multiplier;
        }
        if (key === 'averageConsumption' || key === 'consumedEnergy' || key === 'lastReading') {
            return (Number(a[key as keyof MeterConsumption]) - Number(b[key as keyof MeterConsumption])) * multiplier;
        }
        if (key === 'cumulativeReading' || key === 'currentReadings') {
            const valA = a[key as keyof MeterConsumption] === '-' ? -Infinity : Number(a[key as keyof MeterConsumption]);
            const valB = b[key as keyof MeterConsumption] === '-' ? -Infinity : Number(b[key as keyof MeterConsumption]);
            return (valA - valB) * multiplier;
        }
        return 0;
    });

    const paginatedData = sortedData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const isAllSelected = paginatedData.length > 0 && paginatedData.every(item => selectedRowIds.has(item.id));

    const handlePageSizeChange = (newPageSize: number) => {
        setRowsPerPage(newPageSize);
        setCurrentPage(1);
    };

    const handleCheckboxChange = (id: number, checked: boolean) => {
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
                paginatedData.forEach(item => newSelected.add(item.id));
            } else {
                paginatedData.forEach(item => newSelected.delete(item.id));
            }
            return newSelected;
        });
    };

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
                  Consumption Type
                </TableHead>
                <TableHead className="py-3 font-medium text-gray-700">
                  Consumed Energy
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-50">
              {paginatedData.map((item) => (
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
                  <TableCell className="py-3 ">
                    {item.id}
                  </TableCell>
                  <TableCell className="py-3 ">
                    {item.meterNo}
                  </TableCell>
                  <TableCell className="py-3 ">
                    {item.feederLine}
                  </TableCell>
                  <TableCell className="py-3 ">
                    {item.tariffType}
                  </TableCell>
                  <TableCell className="py-3 ">
                    {item.averageConsumption}
                  </TableCell>
                  <TableCell className="py-3 ">
                    {item.cumulativeReading}
                  </TableCell>
                  <TableCell className="py-3 ">
                    {item.currentReadings}
                  </TableCell>
                  <TableCell className="py-3 ">
                    {item.consumptionType}
                  </TableCell>
                  <TableCell className="py-3 ">
                    {item.consumedEnergy}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4">
          <PaginationControls
            currentPage={currentPage}
            totalItems={sortedData.length}
            pageSize={rowsPerPage}
            onPageChange={setCurrentPage}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      </Card>
    );
}