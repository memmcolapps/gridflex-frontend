"use client";

import { useState } from "react";
import { MoreVertical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { getStatusStyle } from "@/components/status-style";

import { useCustomers } from "@/hooks/use-customer";
import { toast } from "sonner";
import { type Customer } from "@/types/customer-types";
import { FilterControl, SearchControl, SortControl } from "../search-control";
import { Card } from "../ui/card";
import { LoadingAnimation } from "@/components/ui/loading-animation";

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

  const allCustomers = data?.responsedata?.data ?? [];

  // Apply client-side pagination (API may return all data regardless of pageSize)
  // Calculate pagination indices
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const customers = allCustomers.slice(startIndex, endIndex);

  // Use API totalData if available, otherwise use length of returned data
  const totalCustomers = data?.responsedata?.totalData ?? allCustomers.length;

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

  const handlePageSizeChange = (newPageSize: number) => {
    setRowsPerPage(newPageSize);
    setCurrentPage(1);
  };

  const colSpan = 9;

  const renderTableBody = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={colSpan} className="h-24 text-center">
            <div className="flex flex-col items-center justify-center py-8">
              <LoadingAnimation variant="spinner" message="Fetching customer data..." size="md" />
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
              <p className="text-lg font-medium text-red-500">
                Failed to load data
              </p>
              <p className="text-sm text-gray-400">
                Please check your network and try again.
              </p>
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
              <p className="text-lg font-medium text-gray-500">
                No Customers Found
              </p>
              <p className="text-sm text-gray-400">
                Try adjusting your search or add a new customer to get started.
              </p>
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
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 cursor-pointer p-2"
                >
                  <MoreVertical size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                className="w-fit cursor-pointer"
              >
                <DropdownMenuItem
                  onSelect={() => onEditCustomer(customer)}
                  className="w-fit"
                >
                  <div className="flex w-fit items-center gap-2">
                    <span className="w-fit cursor-pointer">Edit Customer</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onViewMeter(customer)}>
                  <div className="flex w-full items-center gap-2">
                    <span className="cursor-pointer">View Meter</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onBlockCustomer(customer)}>
                  <div className="flex w-full items-center gap-2">
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
    <div className="flex h-screen flex-col">
      <div className="mb-6 flex w-80 items-center gap-4">
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
              <TableHead
                onClick={() => requestSort("customerId")}
                className="text-center"
              >
                Customer ID
              </TableHead>
              <TableHead
                onClick={() => requestSort("firstname")}
                className="text-center"
              >
                First Name
              </TableHead>
              <TableHead
                onClick={() => requestSort("lastname")}
                className="text-center"
              >
                Last Name
              </TableHead>
              <TableHead
                onClick={() => requestSort("phoneNumber")}
                className="text-center"
              >
                Phone Number
              </TableHead>
              <TableHead
                onClick={() => requestSort("streetName")}
                className="text-center"
              >
                Street
              </TableHead>
              <TableHead
                onClick={() => requestSort("city")}
                className="text-center"
              >
                City
              </TableHead>
              <TableHead
                onClick={() => requestSort("state")}
                className="text-center"
              >
                State
              </TableHead>
              <TableHead
                onClick={() => requestSort("status")}
                className="text-center"
              >
                Status
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{renderTableBody()}</TableBody>
        </Table>
      </Card>
      <PaginationControls
        currentPage={currentPage}
        totalItems={totalCustomers}
        pageSize={rowsPerPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
