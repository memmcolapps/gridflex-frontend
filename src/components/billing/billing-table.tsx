/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { useState } from "react";
import { Card } from "../ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface BillingData {
    id: number;
    accountNo: string;
    outstanding: number;
    payment: number;
    adjustment: number;
    netArrears: number;
    tariffRate: number;
    energyConsumed: number;
    costOfEnergy: number;
    vat: number;
    newOutstanding: number;
}

interface BillingProps {
    searchQuery: string;
    sortConfig: string;
    selectedMonth: string;
    selectedYear: string;
}

export default function BillingTable({ searchQuery, sortConfig, selectedMonth, selectedYear }: BillingProps) {
    const data: BillingData[] = [
        { id: 1, accountNo: "015904612077", outstanding: 120000, payment: 10000, adjustment: 50000, netArrears: 160000, tariffRate: 50, energyConsumed: 400, costOfEnergy: 20000, vat: 2000, newOutstanding: 182000 },
        { id: 2, accountNo: "015904612077", outstanding: 140000, payment: 20000, adjustment: 0, netArrears: 120000, tariffRate: 100, energyConsumed: 350, costOfEnergy: 35000, vat: 2000, newOutstanding: 137000 },
        { id: 3, accountNo: "015904612077", outstanding: 140000, payment: 20000, adjustment: -20000, netArrears: 140000, tariffRate: 200, energyConsumed: 200, costOfEnergy: 40000, vat: 0, newOutstanding: 180000 },
        { id: 4, accountNo: "015904612077", outstanding: 140000, payment: 20000, adjustment: 50000, netArrears: 160000, tariffRate: 100, energyConsumed: 150, costOfEnergy: 15000, vat: 2000, newOutstanding: 177000 },
        { id: 5, accountNo: "015904612077", outstanding: 140000, payment: 20000, adjustment: -50000, netArrears: 170000, tariffRate: 100, energyConsumed: 150, costOfEnergy: 15000, vat: 0, newOutstanding: 185000 },
        { id: 6, accountNo: "015904612077", outstanding: 140000, payment: 20000, adjustment: 0, netArrears: 70000, tariffRate: 100, energyConsumed: 150, costOfEnergy: 15000, vat: 3000, newOutstanding: 88000 },
        { id: 7, accountNo: "015904612077", outstanding: 140000, payment: 20000, adjustment: 50000, netArrears: 70000, tariffRate: 100, energyConsumed: 150, costOfEnergy: 15000, vat: 3000, newOutstanding: 88000 },
        { id: 8, accountNo: "015904612077", outstanding: 140000, payment: 20000, adjustment: -50000, netArrears: 70000, tariffRate: 100, energyConsumed: 150, costOfEnergy: 15000, vat: 3000, newOutstanding: 88000 },
        { id: 9, accountNo: "015904612077", outstanding: 140000, payment: 20000, adjustment: 50000, netArrears: 70000, tariffRate: 100, energyConsumed: 150, costOfEnergy: 15000, vat: 3000, newOutstanding: 88000 },
        { id: 10, accountNo: "015904612077", outstanding: 140000, payment: 20000, adjustment: 50000, netArrears: 70000, tariffRate: 100, energyConsumed: 150, costOfEnergy: 15000, vat: 3000, newOutstanding: 88000 },
        { id: 11, accountNo: "015904612077", outstanding: 140000, payment: 20000, adjustment: 50000, netArrears: 70000, tariffRate: 100, energyConsumed: 150, costOfEnergy: 15000, vat: 3000, newOutstanding: 88000 },
        { id: 12, accountNo: "015904612077", outstanding: 140000, payment: 20000, adjustment: 50000, netArrears: 70000, tariffRate: 100, energyConsumed: 150, costOfEnergy: 15000, vat: 3000, newOutstanding: 88000 },
        { id: 13, accountNo: "015904612077", outstanding: 140000, payment: 20000, adjustment: 50000, netArrears: 70000, tariffRate: 100, energyConsumed: 150, costOfEnergy: 15000, vat: 3000, newOutstanding: 88000 },
        { id: 14, accountNo: "015904612077", outstanding: 140000, payment: 20000, adjustment: 50000, netArrears: 70000, tariffRate: 100, energyConsumed: 150, costOfEnergy: 15000, vat: 3000, newOutstanding: 88000 },
        { id: 15, accountNo: "015904612077", outstanding: 140000, payment: 20000, adjustment: 50000, netArrears: 70000, tariffRate: 100, energyConsumed: 150, costOfEnergy: 15000, vat: 3000, newOutstanding: 88000 },
        { id: 16, accountNo: "015904612077", outstanding: 140000, payment: 20000, adjustment: 50000, netArrears: 70000, tariffRate: 100, energyConsumed: 150, costOfEnergy: 15000, vat: 3000, newOutstanding: 88000 },
        { id: 17, accountNo: "015904612077", outstanding: 140000, payment: 20000, adjustment: 50000, netArrears: 70000, tariffRate: 100, energyConsumed: 150, costOfEnergy: 15000, vat: 3000, newOutstanding: 88000 },
    ];

    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedRowIds, setSelectedRowIds] = useState<Set<number>>(new Set());

    const filteredData = data.filter((item) => {
        const searchMatch = searchQuery === "" ||
            item.accountNo.toLowerCase().includes(searchQuery.toLowerCase());
        return searchMatch;
    });

    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortConfig) return 0;
        const [key, direction] = sortConfig.split(':');
        const multiplier = direction === 'desc' ? -1 : 1;

        if (key === 'accountNo') {
            return String(a[key as keyof BillingData]).localeCompare(String(b[key as keyof BillingData])) * multiplier;
        }
        if (key === 'outstanding' || key === 'payment' || key === 'adjustment' || key === 'netArrears' || key === 'tariffRate' || key === 'energyConsumed' || key === 'costOfEnergy' || key === 'vat' || key === 'newOutstanding') {
            return (Number(a[key as keyof BillingData]) - Number(b[key as keyof BillingData])) * multiplier;
        }
        return 0;
    });

    const totalPages = Math.ceil(sortedData.length / rowsPerPage);

    const paginatedData = sortedData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const isAllSelected = paginatedData.length > 0 && paginatedData.every(item => selectedRowIds.has(item.id));

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
        <>
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
                            <TableHead className="font-medium text-gray-700">S/N</TableHead>
                            <TableHead className="font-medium text-gray-700">Account No.</TableHead>
                            <TableHead className="font-medium text-gray-700">Outstanding</TableHead>
                            <TableHead className="font-medium text-gray-700">Payment</TableHead>
                            <TableHead className="font-medium text-gray-700">Adjustment</TableHead>
                            <TableHead className="font-medium text-gray-700">Net Arrears</TableHead>
                            <TableHead className="font-medium text-gray-700">Tariff Rate</TableHead>
                            <TableHead className="font-medium text-gray-700">Energy Consumed</TableHead>
                            <TableHead className="font-medium text-gray-700">Cost of Energy</TableHead>
                            <TableHead className="font-medium text-gray-700">VAT</TableHead>
                            <TableHead className="font-medium text-gray-700">New Outstanding</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-50">
                        {paginatedData.map((item) => (
                            <TableRow key={item.id}>
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
                                <TableCell className="py-4 items-center">{item.id}</TableCell>
                                <TableCell className="py-4 items-center">{item.accountNo}</TableCell>
                                <TableCell className="py-4 items-center">{item.outstanding.toLocaleString()}</TableCell>
                                <TableCell className="py-4 items-center">{item.payment.toLocaleString()}</TableCell>
                                <TableCell className="py-4 items-center">{item.adjustment.toLocaleString()}</TableCell>
                                <TableCell className="py-4 items-center">{item.netArrears.toLocaleString()}</TableCell>
                                <TableCell className="py-4 items-center">{item.tariffRate.toLocaleString()}</TableCell>
                                <TableCell className="py-4 items-center">{item.energyConsumed.toLocaleString()}</TableCell>
                                <TableCell className="py-4 items-center">{item.costOfEnergy.toLocaleString()}</TableCell>
                                <TableCell className="py-4 items-center">{item.vat.toLocaleString()}</TableCell>
                                <TableCell className="py-4 items-center">{item.newOutstanding.toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="mt-4">
                <Pagination className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-600">Rows per page</span>
                            <Select
                                value={rowsPerPage.toString()}
                                onValueChange={handleRowsPerPageChange}
                            >
                                <SelectTrigger className="h-8 w-[70px] border-gray-300 focus:ring-0 focus:ring-offset-0">
                                    <SelectValue placeholder={rowsPerPage.toString()} />
                                </SelectTrigger>
                                <SelectContent side="top" className="min-w-[70px]">
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="24">24</SelectItem>
                                    <SelectItem value="48">48</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <span className="text-sm font-medium text-gray-600">
                            {(currentPage - 1) * rowsPerPage + 1}-
                            {Math.min(currentPage * rowsPerPage, sortedData.length)} of{" "}
                            {sortedData.length}
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
                                className=""
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
                                className=""
                                aria-disabled={currentPage === totalPages}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </>
    );
}