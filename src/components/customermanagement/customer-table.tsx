"use client";

import { useState } from "react";
import { MoreVertical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getStatusStyle } from "@/components/status-style";

import { useCustomers } from "@/hooks/use-customer";
import { toast } from "sonner";
import { type Customer } from "@/types/customer-types";
import { FilterControl, SearchControl, SortControl } from "../search-control";
import { Card } from "../ui/card";

interface CustomerTableProps {
    onEditCustomer: (customer: Customer) => void;
    onViewCustomer: (customer: Customer) => void;
    onViewMeter: (customer: Customer) => void;
    onBlockCustomer: (customer: Customer) => void;
}

export default function CustomerTable({
    onEditCustomer,
    onViewCustomer,
    onViewMeter,
    onBlockCustomer,
}: CustomerTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Customer;
        direction: "asc" | "desc";
    } | null>(null);

    const { data, isLoading, isError, error } = useCustomers({
        page: currentPage,
        pageSize: rowsPerPage,
        searchTerm,
        sortBy: sortConfig?.key,
        sortDirection: sortConfig?.direction,
    });

    if (isError) {
        toast.error(error.message);
    }

    const customers = data?.responsedata?.data ?? [];
    const totalPages = data?.responsedata?.totalPages ?? 1;
    const totalCustomers = data?.responsedata?.totalData ?? 0;

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const requestSort = (key: keyof Customer) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig?.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
        setCurrentPage(1);
    };

    const handlePrevious = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNext = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handleRowsPerPageChange = (value: string) => {
        setRowsPerPage(Number(value));
        setCurrentPage(1);
    };

    const colSpan = 9;

    const renderTableBody = () => {
        if (isLoading) {
            return (
                <TableRow>
                    <TableCell colSpan={colSpan} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                            <p className="mt-2 text-sm text-gray-500">Fetching customer data...</p>
                        </div>
                    </TableCell>
                </TableRow>
            );
        }

        if (isError) {
            return (
                <TableRow>
                    <TableCell colSpan={colSpan} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center py-8">
                            <p className="text-lg font-medium text-red-500">Failed to load data</p>
                            <p className="text-sm text-gray-400">Please check your network and try again.</p>
                        </div>
                    </TableCell>
                </TableRow>
            );
        }

        if (customers.length === 0) {
            return (
                <TableRow>
                    <TableCell colSpan={colSpan} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center py-8">
                            <p className="text-lg font-medium text-gray-500">No Customers Found</p>
                            <p className="text-sm text-gray-400">Try adjusting your search or add a new customer to get started.</p>
                        </div>
                    </TableCell>
                </TableRow>
            );
        }

        return customers.map((customer: Customer, index: number) => {
            // Add a console.log here to inspect the customer object

            return (
                <TableRow
                    key={customer.id}
                    className="hover:bg-muted/50 cursor-pointer"
                    onClick={() => onViewCustomer(customer)}
                >
                    <TableCell className="text-center">
                        <div className="flex items-center gap-2">
                            <span>{(currentPage - 1) * rowsPerPage + index + 1}</span>
                        </div>
                    </TableCell>
                    <TableCell className="text-center">{customer.customerId}</TableCell>
                    <TableCell className="text-center">{customer.firstname}</TableCell>
                    <TableCell className="text-center">{customer.lastname}</TableCell>
                    <TableCell className="text-center">{customer.phoneNumber}</TableCell>
                    <TableCell className="text-center">{customer.streetName}</TableCell>
                    <TableCell className="text-center">{customer.city}</TableCell>
                    <TableCell className="text-center">{customer.state}</TableCell>
                    <TableCell className="text-center">
                        <span className={getStatusStyle(customer.status.toString())}>
                            {customer.status.toString()}
                        </span>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-2 cursor-pointer">
                                    <MoreVertical size={14} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="center" className="w-fit cursor-pointer">
                                <DropdownMenuItem
                                    onSelect={() => onEditCustomer(customer)}
                                    className="w-fit"
                                >
                                    <div className="flex items-center w-fit gap-2">
                                        <span className="cursor-pointer w-fit">Edit Customer</span>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => onViewMeter(customer)}>
                                    <div className="flex items-center w-full gap-2">
                                        <span className="cursor-pointer">View Meter</span>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => onBlockCustomer(customer)}>
                                    <div className="flex items-center w-full gap-2">
                                        <span className="cursor-pointer">Block</span>
                                    </div>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
            );
        });
    };

    return (
        <div className="h-screen flex flex-col">
            <div className="flex items-center mb-6 gap-4 w-80">
                <div className="relative flex-1">
                    <SearchControl
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Search by meter no., account no..."
                    />
                </div>
                <FilterControl />
                <SortControl />
            </div>
            <Card className="h-4/6 overflow-x-hidden border-none bg-transparent shadow-none">
                <Table className="h-fit">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[30px] pr-0">
                                <div className="flex items-center gap-2 text-center">
                                    <span>S/N</span>
                                </div>
                            </TableHead>
                            <TableHead onClick={() => requestSort("customerId")} className="text-center">
                                Customer ID
                            </TableHead>
                            <TableHead onClick={() => requestSort("firstname")} className="text-center">
                                First Name
                            </TableHead>
                            <TableHead onClick={() => requestSort("lastname")} className="text-center">
                                Last Name
                            </TableHead>
                            <TableHead onClick={() => requestSort("phoneNumber")} className="text-center">
                                Phone Number
                            </TableHead>
                            <TableHead onClick={() => requestSort("streetName")} className="text-center">
                                Street
                            </TableHead>
                            <TableHead onClick={() => requestSort("city")} className="text-center">
                                City
                            </TableHead>
                            <TableHead onClick={() => requestSort("state")} className="text-center">
                                State
                            </TableHead>
                            <TableHead onClick={() => requestSort("status")} className="text-center">
                                Status
                            </TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {renderTableBody()}
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
                        {Math.min(currentPage * rowsPerPage, totalCustomers)} of {totalCustomers}
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
        </div>
    );
}