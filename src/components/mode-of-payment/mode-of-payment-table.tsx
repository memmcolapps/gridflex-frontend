"use client";
import { ArrowUpDown, Filter, MoreVertical, Pencil, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

type TableItem = {
    id: string;
    meterNumber: string;
    accountNumber: string;
    debitModeOfPayment: "Percentage" | "One-off" | "Monthly";
    debitInstallmentRange: string;
    creditModeOfPayment: "Percentage" | "One-off" | "Monthly";
    creditInstallmentRange: string;
};

export function ModeOfPaymentTable() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rowsPerPage, setRowsPerPage] = useState<number>(12);

    const toggleSelection = (id: string) => {
        setSelectedItems(
            selectedItems.includes(id)
                ? selectedItems.filter((selectedId) => selectedId !== id)
                : [...selectedItems, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedItems.length === data.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(data.map((item) => item.id));
        }
    };

    const data: TableItem[] = [
        { id: "1", meterNumber: "620102123", accountNumber: "015904612077", debitModeOfPayment: "Percentage", debitInstallmentRange: "", creditModeOfPayment: "Percentage", creditInstallmentRange: "" },
        { id: "2", meterNumber: "620102123", accountNumber: "015904612077", debitModeOfPayment: "One-off", debitInstallmentRange: "", creditModeOfPayment: "One-off", creditInstallmentRange: "" },
        { id: "3", meterNumber: "620102123", accountNumber: "015904612077", debitModeOfPayment: "Monthly", debitInstallmentRange: "6", creditModeOfPayment: "Monthly", creditInstallmentRange: "6" },
        { id: "4", meterNumber: "620102123", accountNumber: "015904612077", debitModeOfPayment: "One-off", debitInstallmentRange: "", creditModeOfPayment: "One-off", creditInstallmentRange: "" },
        { id: "5", meterNumber: "620102123", accountNumber: "015904612077", debitModeOfPayment: "Percentage", debitInstallmentRange: "", creditModeOfPayment: "Percentage", creditInstallmentRange: "" },
        { id: "6", meterNumber: "620102123", accountNumber: "015904612077", debitModeOfPayment: "One-off", debitInstallmentRange: "", creditModeOfPayment: "One-off", creditInstallmentRange: "" },
        { id: "7", meterNumber: "620102123", accountNumber: "015904612077", debitModeOfPayment: "Monthly", debitInstallmentRange: "6", creditModeOfPayment: "Monthly", creditInstallmentRange: "6" },
        { id: "8", meterNumber: "620102123", accountNumber: "015904612077", debitModeOfPayment: "Monthly", debitInstallmentRange: "6", creditModeOfPayment: "Monthly", creditInstallmentRange: "6" },
        { id: "9", meterNumber: "620102123", accountNumber: "015904612077", debitModeOfPayment: "One-off", debitInstallmentRange: "", creditModeOfPayment: "One-off", creditInstallmentRange: "" },
        { id: "10", meterNumber: "620102123", accountNumber: "015904612077", debitModeOfPayment: "Percentage", debitInstallmentRange: "", creditModeOfPayment: "Percentage", creditInstallmentRange: "" },
        { id: "11", meterNumber: "620102123", accountNumber: "015904612077", debitModeOfPayment: "Monthly", debitInstallmentRange: "6", creditModeOfPayment: "Monthly", creditInstallmentRange: "6" },
        { id: "12", meterNumber: "620102123", accountNumber: "015904612077", debitModeOfPayment: "Percentage", debitInstallmentRange: "", creditModeOfPayment: "Percentage", creditInstallmentRange: "" },
        // Add more data up to 40 rows as needed to match the screenshot
    ];

    const totalPages = Math.ceil(data.length / rowsPerPage);
    const paginatedData = data
        .filter((item) =>
            item.meterNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.accountNumber.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    return (
        <>
            {/* Search and Filter Section */}
            <Card className="p-4 mb-4 border-none shadow-none bg-white">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 w-full lg:w-auto">
                        <div className="relative w-full lg:w-[300px]">
                            <Search
                                size={14}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                            />
                            <Input
                                type="text"
                                placeholder="Search by meter no., account no..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-full border-gray-300 focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50 text-sm lg:text-base"
                            />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="gap-2 border-gray-300 w-full lg:w-auto ring-gray-300/20">
                                    <Filter className="text-gray-500" size={14} />
                                    <span className="text-gray-800 text-sm lg:text-base">Filter</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48 bg-white shadow-lg">
                                <DropdownMenuItem className="text-sm lg:text-base text-gray-700">One-Off</DropdownMenuItem>
                                <DropdownMenuItem className="text-sm lg:text-base text-gray-700">Percentage</DropdownMenuItem>
                                <DropdownMenuItem className="text-sm lg:text-base text-gray-700">Monthly</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="gap-2 border-gray-300 w-full lg:w-auto ring-gray-300/20">
                                    <ArrowUpDown className="text-gray-500" size={14} />
                                    <span className="text-gray-800 text-sm lg:text-base">Sort</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48 bg-white shadow-lg">
                                <DropdownMenuItem className="text-sm lg:text-base text-gray-700">Newest - Oldest</DropdownMenuItem>
                                <DropdownMenuItem className="text-sm lg:text-base text-gray-700">Oldest - Newest</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </Card>
            {/* Table */}
            <Card className="border-none shadow-none bg-white overflow-x-auto min-h-[calc(100vh-300px)]">
                <Table className="table-fixed w-full">
                    <TableHeader>
                        <TableRow className="bg-gray-50 hover:bg-gray-50">
                            <TableHead className="w-[80px] px-4 py-3 text-left">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        className="h-4 w-4 border-gray-500"
                                        id="select-all"
                                        checked={data.length > 0 && selectedItems.length === data.length}
                                        onCheckedChange={toggleSelectAll}
                                    />
                                    <Label htmlFor="select-all" className="text-sm lg:text-base font-semibold text-gray-700">
                                        S/N
                                    </Label>
                                </div>
                            </TableHead>
                            <TableHead className="min-w-[120px] px-4 py-3 text-left text-sm lg:text-base font-semibold text-gray-700">
                                Meter No.
                            </TableHead>
                            <TableHead className="min-w-[150px] px-4 py-3 text-left text-sm lg:text-base font-semibold text-gray-700">
                                Account No.
                            </TableHead>
                            <TableHead className="min-w-[180px] px-4 py-3 text-left text-sm lg:text-base font-semibold text-gray-700">
                                Debit Mode of Payment
                            </TableHead>
                            <TableHead className="min-w-[150px] px-4 py-3 text-left text-sm lg:text-base font-semibold text-gray-700">
                                Installment Range
                            </TableHead>
                            <TableHead className="min-w-[180px] px-4 py-3 text-left text-sm lg:text-base font-semibold text-gray-700">
                                Credit Mode of Payment
                            </TableHead>
                            <TableHead className="min-w-[150px] px-4 py-3 text-left text-sm lg:text-base font-semibold text-gray-700">
                                Installment Range
                            </TableHead>
                            <TableHead className="min-w-[80px] px-4 py-3 text-right text-sm lg:text-base font-semibold text-gray-700">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center text-sm lg:text-base text-gray-500">
                                    No data available
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedData.map((item, index) => (
                                <TableRow key={item.id} className="hover:bg-gray-50">
                                    <TableCell className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                className="border-gray-500"
                                                id={`select-${item.id}`}
                                                checked={selectedItems.includes(item.id)}
                                                onCheckedChange={() => toggleSelection(item.id)}
                                            />
                                            <span className="text-sm lg:text-base text-gray-900">
                                                {index + 1 + (currentPage - 1) * rowsPerPage}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-sm lg:text-base text-gray-900">{item.meterNumber}</TableCell>
                                    <TableCell className="px-4 py-3 text-sm lg:text-base text-gray-900">{item.accountNumber}</TableCell>
                                    <TableCell className="px-4 py-3 text-sm lg:text-base text-gray-900">{item.debitModeOfPayment}</TableCell>
                                    <TableCell className="px-4 py-3 text-sm lg:text-base text-gray-900">{item.debitInstallmentRange}</TableCell>
                                    <TableCell className="px-4 py-3 text-sm lg:text-base text-gray-900">{item.creditModeOfPayment}</TableCell>
                                    <TableCell className="px-4 py-3 text-sm lg:text-base text-gray-900">{item.creditInstallmentRange}</TableCell>
                                    <TableCell className="px-4 py-3 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="border-gray-500 focus:ring-gray-500">
                                                    <MoreVertical size={16} className="text-gray-500" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 bg-white shadow-lg">
                                                <DropdownMenuItem className="flex items-center gap-2">
                                                    <Pencil size={14} className="text-gray-500" />
                                                    <span className="text-sm lg:text-base text-gray-700">Edit</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Pagination */}
            <div className="flex justify-between items-center py-4 px-6 text-sm lg:text-base text-gray-600">
                <div className="flex items-center gap-2">
                    <span>Rows per page</span>
                    <select
                        value={rowsPerPage}
                        onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
                        className="w-16 border-gray-300 rounded-md text-sm lg:text-base"
                    >
                        <option value="12">12</option>
                        <option value="24">24</option>
                        <option value="48">48</option>
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <span>
                        {data.length > 0 ? `1-${paginatedData.length} of ${data.length}` : "0-0 of 0"} rows
                    </span>
                    <Button
                        className="cursor-pointer"
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="cursor-pointer"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages || data.length === 0}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </>
    );
}