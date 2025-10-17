/* eslint-disable @typescript-eslint/no-unused-vars */
// components/billing/payment-history/payment-history-table.tsx
import { useRouter } from "next/navigation";
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
import { useEffect, useState, useMemo } from "react";
import { Card } from "../../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import ViewPaymentDetails from "./view-payment-details";

interface PaymentHistoryData {
  id: number;
  sn: string;
  accountNumber: string;
  meterNumber: string;
  feeder: string;
  dss: string;
  paymentType: "Manual" | "API";
  transactionId: string;
  transactionDate: string;
  amount: number;
}

interface PaymentHistoryTableProps {
  searchQuery: string;
  sortConfig: string;
  selectedMonth: string;
  selectedYear: string;
  onSelectionChange?: (selectedIds: Set<number>) => void;
}

export default function PaymentHistoryTable({
  searchQuery,
  sortConfig,
  selectedMonth: _selectedMonth,
  selectedYear: _selectedYear,
  onSelectionChange,
}: PaymentHistoryTableProps) {
  const router = useRouter();
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PaymentHistoryData | null>(
    null,
  );

  // Mock data based on your screenshot
  const data: PaymentHistoryData[] = useMemo(
    () => [
      {
        id: 1,
        sn: "01",
        accountNumber: "015900461207T",
        meterNumber: "620102123",
        feeder: "Ijeun",
        dss: "Ijeun",
        paymentType: "Manual",
        transactionId: "TRX-240710-AY0001-77",
        transactionDate: "07-07-2025",
        amount: 100000,
      },
      {
        id: 2,
        sn: "02",
        accountNumber: "015900461207T",
        meterNumber: "620102123",
        feeder: "Ijeun",
        dss: "Ijeun",
        paymentType: "API",
        transactionId: "TRX-240710-AY0001-77",
        transactionDate: "06-07-2025",
        amount: 100000,
      },
      {
        id: 3,
        sn: "03",
        accountNumber: "015900461207T",
        meterNumber: "620102123",
        feeder: "Ijeun",
        dss: "Ijeun",
        paymentType: "Manual",
        transactionId: "TRX-240710-AY0001-77",
        transactionDate: "06-07-2025",
        amount: 100000,
      },
      {
        id: 4,
        sn: "04",
        accountNumber: "015900461207T",
        meterNumber: "620102123",
        feeder: "Ijeun",
        dss: "Ijeun",
        paymentType: "API",
        transactionId: "TRX-240710-AY0001-77",
        transactionDate: "06-07-2025",
        amount: 100000,
      },
      {
        id: 5,
        sn: "05",
        accountNumber: "015900461207T",
        meterNumber: "620102123",
        feeder: "Ijeun",
        dss: "Ijeun",
        paymentType: "Manual",
        transactionId: "TRX-240710-AY0001-77",
        transactionDate: "05-07-2025",
        amount: 100000,
      },
      {
        id: 6,
        sn: "06",
        accountNumber: "015900461207T",
        meterNumber: "620102123",
        feeder: "Ijeun",
        dss: "Ijeun",
        paymentType: "API",
        transactionId: "TRX-240710-AY0001-77",
        transactionDate: "05-07-2025",
        amount: 100000,
      },
      {
        id: 7,
        sn: "07",
        accountNumber: "015900461207T",
        meterNumber: "620102123",
        feeder: "Ijeun",
        dss: "Ijeun",
        paymentType: "Manual",
        transactionId: "TRX-240710-AY0001-77",
        transactionDate: "05-07-2025",
        amount: 100000,
      },
      {
        id: 8,
        sn: "08",
        accountNumber: "015900461207T",
        meterNumber: "620102123",
        feeder: "Ijeun",
        dss: "Ijeun",
        paymentType: "Manual",
        transactionId: "TRX-240710-AY0001-77",
        transactionDate: "04-07-2025",
        amount: 100000,
      },
      {
        id: 9,
        sn: "09",
        accountNumber: "015900461207T",
        meterNumber: "620102123",
        feeder: "Ijeun",
        dss: "Ijeun",
        paymentType: "API",
        transactionId: "TRX-240710-AY0001-77",
        transactionDate: "04-07-2025",
        amount: 100000,
      },
      {
        id: 10,
        sn: "10",
        accountNumber: "015900461207T",
        meterNumber: "620102123",
        feeder: "Ijeun",
        dss: "Ijeun",
        paymentType: "Manual",
        transactionId: "TRX-240710-AY0001-77",
        transactionDate: "04-07-2025",
        amount: 100000,
      },
    ],
    [],
  );

  const [rowsPerPage, setRowsPerPage] = useState<number>(12);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRowIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedRowIds);
    }
  }, [onSelectionChange, selectedRowIds]);

  // Handle view details
  const handleViewDetails = (item: PaymentHistoryData) => {
    setSelectedItem(item);
    setIsViewDetailsOpen(true);
  };

  const handleViewDetailsClose = () => {
    setIsViewDetailsOpen(false);
    setSelectedItem(null);
  };

  // Filter data based on search query
  const filteredData = data.filter((item) => {
    const searchMatch =
      searchQuery === "" ||
      item.accountNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.meterNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.feeder.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.transactionId.toLowerCase().includes(searchQuery.toLowerCase());
    return searchMatch;
  });

  // Sort data based on sortConfig
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0;
    const [key, direction] = sortConfig.split(":");
    const multiplier = direction === "desc" ? -1 : 1;

    if (
      key === "accountNumber" ||
      key === "meterNumber" ||
      key === "feeder" ||
      key === "transactionId"
    ) {
      return (
        a[key as keyof PaymentHistoryData]
          .toString()
          .localeCompare(b[key as keyof PaymentHistoryData].toString()) *
        multiplier
      );
    }
    if (key === "amount") {
      return (a.amount - b.amount) * multiplier;
    }
    if (key === "transactionDate") {
      return (
        (new Date(a.transactionDate).getTime() -
          new Date(b.transactionDate).getTime()) *
        multiplier
      );
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  // Check if all items on the current page are selected
  const isAllSelected = false;

  // Check if some items on the current page are selected
  const isSomeSelected = false;

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handleRowClick = (
    item: PaymentHistoryData,
    event: React.MouseEvent<HTMLTableRowElement>,
  ) => {
    // Prevent row click when clicking checkbox
    if ((event.target as HTMLElement).closest('input[type="checkbox"]')) {
      return;
    }
    handleViewDetails(item);
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Function to handle individual checkbox change
  const handleCheckboxChange = (id: number, checked: boolean) => {
    // Implementation removed as selectedRowIds is not used
  };

  // Function to handle master checkbox change
  const handleSelectAll = (checked: boolean) => {
    // Implementation removed as selectedRowIds is not used
  };

  // Format amount as currency
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Card className="min-h-[calc(100vh-300px)] border-none bg-transparent shadow-none">
      <div className="overflow-x-auto">
        <Table className="w-full table-auto">
          <TableHeader className="bg-transparent">
            <TableRow className="bg-transparent hover:bg-gray-50">
              <TableHead className="w-20 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                    className="h-4 w-4 border-gray-500"
                  />
                  <Label className="text-sm font-semibold text-gray-700">
                    S/N
                  </Label>
                </div>
              </TableHead>
              <TableHead className="px-4 py-3 text-sm font-semibold text-gray-700">
                Account Number
              </TableHead>
              <TableHead className="px-4 py-3 text-sm font-semibold text-gray-700">
                Meter Number
              </TableHead>
              <TableHead className="px-4 py-3 text-sm font-semibold text-gray-700">
                Feeder
              </TableHead>
              <TableHead className="px-4 py-3 text-sm font-semibold text-gray-700">
                DSS
              </TableHead>
              <TableHead className="px-4 py-3 text-sm font-semibold text-gray-700">
                Payment Type
              </TableHead>
              <TableHead className="px-4 py-3 text-sm font-semibold text-gray-700">
                Transaction ID
              </TableHead>
              <TableHead className="px-4 py-3 text-sm font-semibold text-gray-700">
                Transaction Date
              </TableHead>
              <TableHead className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                Amount
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="h-24 text-center text-sm text-gray-500"
                >
                  No payment history available
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, index) => (
                <TableRow
                  key={item.id}
                  onClick={(event) => handleRowClick(item, event)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={false}
                        onCheckedChange={() => undefined}
                        aria-label={`Select row ${item.id}`}
                        className="h-4 w-4 border-gray-500"
                      />
                      <span className="text-sm text-gray-900">
                        {index + 1 + (currentPage - 1) * rowsPerPage}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-gray-900">
                    {item.accountNumber}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-gray-900">
                    {item.meterNumber}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-gray-900">
                    {item.feeder}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-gray-900">
                    {item.dss}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-gray-900">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium`}
                    >
                      {item.paymentType}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 font-mono text-sm text-gray-900">
                    {item.transactionId}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-gray-900">
                    {item.transactionDate}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                    ₦{formatAmount(item.amount)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

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
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="24">24</SelectItem>
              <SelectItem value="48">48</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm font-medium">
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

      {/* View Details Dialog */}
      {selectedItem && (
        <ViewPaymentDetails
          open={isViewDetailsOpen}
          onClose={handleViewDetailsClose}
          data={selectedItem}
        />
      )}
    </Card>
  );
}
