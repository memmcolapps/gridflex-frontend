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
  selectedMonth,
  selectedYear,
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
  const [selectedRowIds, setSelectedRowIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedRowIds);
    }
  }, [selectedRowIds, onSelectionChange]);

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
  const isAllSelected =
    paginatedData.length > 0 &&
    paginatedData.every((item) => selectedRowIds.has(item.id));

  // Check if some items on the current page are selected
  const isSomeSelected =
    paginatedData.some((item) => selectedRowIds.has(item.id)) && !isAllSelected;

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handleRowClick = (item: PaymentHistoryData) => {
    handleViewDetails(item);
  };

  const handleRowDoubleClick = (item: PaymentHistoryData) => {
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

  // Function to handle master checkbox change
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

  // Format amount as currency
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "decimal",
      minimumFractionDigits: 3,
    }).format(amount);
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
              Account Number
            </TableHead>
            <TableHead className="py-3 font-medium text-gray-700">
              Meter Number
            </TableHead>
            <TableHead className="py-3 font-medium text-gray-700">
              Feeder
            </TableHead>
            <TableHead className="py-3 font-medium text-gray-700">
              DSS
            </TableHead>
            <TableHead className="py-3 font-medium text-gray-700">
              Payment Type
            </TableHead>
            <TableHead className="py-3 font-medium text-gray-700">
              Transaction ID
            </TableHead>
            <TableHead className="py-3 font-medium text-gray-700">
              Transaction Date
            </TableHead>
            <TableHead className="py-3 font-medium text-gray-700">
              Amount
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((item, index) => {
            return (
              <TableRow
                key={item.id}
                onClick={() => handleRowClick(item)}
                onDoubleClick={() => handleRowDoubleClick(item)}
                className="cursor-pointer hover:bg-gray-50"
              >
                {/* Individual Checkbox */}
                <TableCell className="text-center">
                  <Checkbox
                    checked={selectedRowIds.has(item.id)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(item.id, Boolean(checked))
                    }
                    onClick={(e) => e.stopPropagation()} // Prevent row click when clicking checkbox
                    aria-label={`Select row ${item.id}`}
                    className="mx-auto cursor-pointer border-gray-500 hover:border-gray-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white"
                  />
                </TableCell>
                <TableCell className="font-medium">{item.sn}</TableCell>
                <TableCell className="font-medium">
                  {item.accountNumber}
                </TableCell>
                <TableCell className="font-medium">
                  {item.meterNumber}
                </TableCell>
                <TableCell>{item.feeder}</TableCell>
                <TableCell>{item.dss}</TableCell>
                <TableCell>{item.paymentType}</TableCell>
                <TableCell className="font-medium">
                  {item.transactionId}
                </TableCell>
                <TableCell>{item.transactionDate}</TableCell>
                <TableCell className="font-medium">
                  {formatAmount(item.amount)}
                </TableCell>
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
              <SelectItem value="12">12</SelectItem>
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
