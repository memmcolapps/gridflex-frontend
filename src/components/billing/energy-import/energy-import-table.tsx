// components/energy-import/energy-import-table.tsx
import { MoreVertical, Eye, Zap, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
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
import ViewEnergyImportDetails from "./view-energy-import-details";
import ViewVirtualMetersDialog from "./view-virtual-meters-dialog";


interface EnergyImportData {
  id: number;
  feederName: string;
  assetId: string;
  feederConsumption: string;
  prepaidConsumption: string;
  postpaidConsumption: string;
  mdVirtual: string;
  nonMdVirtual: string;
}

interface EnergyImportTableProps {
  searchQuery: string;
  sortConfig: string;
  selectedMonth: string;
  selectedYear: string;
  onSelectionChange?: (selectedIds: Set<number>) => void; 
}

export default function EnergyImportTable({
  searchQuery,
  sortConfig,
  selectedMonth: _selectedMonth,
  selectedYear: _selectedYear,
  onSelectionChange,
}: EnergyImportTableProps) {
  const router = useRouter();
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<EnergyImportData | null>(
    null,
  );
  const [isViewVirtualMetersOpen, setIsViewVirtualMetersOpen] = useState(false);

  // Updated data with unique asset IDs for each feeder
  const data: EnergyImportData[] = useMemo(
    () => [
      {
        id: 1,
        feederName: "Molara",
        assetId: "6201021223",
        feederConsumption: "250488930.789",
        prepaidConsumption: "250488930.789",
        postpaidConsumption: "250488930.789",
        mdVirtual: "313111.349",
        nonMdVirtual: "NOT SET",
      },
      {
        id: 2,
        feederName: "Ijeun",
        assetId: "6201021224",
        feederConsumption: "250488930.789",
        prepaidConsumption: "125244445.395",
        postpaidConsumption: "9393334.046",
        mdVirtual: "313111.349",
        nonMdVirtual: "NOT SET",
      },
      {
        id: 3,
        feederName: "Sagamu",
        assetId: "6201021225",
        feederConsumption: "250488930.789",
        prepaidConsumption: "125244445.395",
        postpaidConsumption: "9393334.046",
        mdVirtual: "313111.349",
        nonMdVirtual: "NOT SET",
      },
      {
        id: 4,
        feederName: "Olowotedo",
        assetId: "6201021226",
        feederConsumption: "250488930.789",
        prepaidConsumption: "125244445.395",
        postpaidConsumption: "9393334.046",
        mdVirtual: "313111.349",
        nonMdVirtual: "NOT SET",
      },
      {
        id: 5,
        feederName: "Isofo",
        assetId: "6201021227",
        feederConsumption: "250488930.789",
        prepaidConsumption: "125244445.395",
        postpaidConsumption: "9393334.046",
        mdVirtual: "313111.349",
        nonMdVirtual: "NOT SET",
      },
      {
        id: 6,
        feederName: "Mowe",
        assetId: "6201021228",
        feederConsumption: "250488930.789",
        prepaidConsumption: "125244445.395",
        postpaidConsumption: "9393334.046",
        mdVirtual: "313111.349",
        nonMdVirtual: "NOT SET",
      },
      {
        id: 7,
        feederName: "Asese",
        assetId: "6201021229",
        feederConsumption: "250488930.789",
        prepaidConsumption: "125244445.395",
        postpaidConsumption: "9393334.046",
        mdVirtual: "313111.349",
        nonMdVirtual: "NOT SET",
      },
      {
        id: 8,
        feederName: "Berger",
        assetId: "6201021230",
        feederConsumption: "250488930.789",
        prepaidConsumption: "125244445.395",
        postpaidConsumption: "9393334.046",
        mdVirtual: "313111.349",
        nonMdVirtual: "NOT SET",
      },
      {
        id: 9,
        feederName: "Orimuramu",
        assetId: "6201021231",
        feederConsumption: "250488930.789",
        prepaidConsumption: "125244445.395",
        postpaidConsumption: "9393334.046",
        mdVirtual: "313111.349",
        nonMdVirtual: "NOT SET",
      },
      {
        id: 10,
        feederName: "Abeokuta",
        assetId: "6201021232",
        feederConsumption: "250488930.789",
        prepaidConsumption: "125244445.395",
        postpaidConsumption: "9393334.046",
        mdVirtual: "313111.349",
        nonMdVirtual: "NOT SET",
      },
    ],
    [],
  );

  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRowIds, setSelectedRowIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedRowIds);
    }
  }, [selectedRowIds, onSelectionChange]);

  // Handle view details
  const handleViewDetails = (item: EnergyImportData) => {
    setSelectedItem(item);
    setIsViewDetailsOpen(true);
  };

  // Handle view virtual meters
  const handleViewVirtualMeters = (item: EnergyImportData) => {
    setSelectedItem(item);
    setIsViewVirtualMetersOpen(true);
  };

  // Handle edit feeder consumption
  const handleEditFeederConsumption = (item: EnergyImportData) => {
    console.log("Edit feeder consumption for:", item.feederName);
    router.push(`/billing/non-md-prebilling/energy-import/${item.assetId}`);
  };

  const handleViewDetailsClose = () => {
    setIsViewDetailsOpen(false);
    setSelectedItem(null);
  };

  const handleViewVirtualMetersClose = () => {
    setIsViewVirtualMetersOpen(false);
    setSelectedItem(null);
  };

  // Filter data based on search query
  const filteredData = data.filter((item) => {
    const searchMatch =
      searchQuery === "" ||
      item.feederName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.assetId.toLowerCase().includes(searchQuery.toLowerCase());
    return searchMatch;
  });

  // Sort data based on sortConfig
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0;
    const [key, direction] = sortConfig.split(":");
    const multiplier = direction === "desc" ? -1 : 1;

    if (key === "feederName" || key === "assetId") {
      return (
        a[key as keyof EnergyImportData]
          .toString()
          .localeCompare(b[key as keyof EnergyImportData].toString()) *
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

  // Check if some items on the current page are selected (for indeterminate state)
  const isSomeSelected =
    paginatedData.some((item) => selectedRowIds.has(item.id)) && !isAllSelected;

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handleRowDoubleClick = (item: EnergyImportData) => {
    // Navigate to the feeder details page using the unique assetId
    router.push(`/billing/non-md-prebilling/energy-import/${item.assetId}`);
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

  return (
    <Card className="rounded border-none p-4 shadow-sm bg-transparent">
      <Table className="bg-transparent">
        <TableHeader className="bg-transparent">
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
              Feeder Name
            </TableHead>
            <TableHead className="py-3 font-medium text-gray-700">
              Asset ID
            </TableHead>
            <TableHead className="py-3 font-medium text-gray-700">
              Feeder Consumption
            </TableHead>
            <TableHead className="py-3 font-medium text-gray-700">
              Prepaid Consumption
            </TableHead>
            <TableHead className="py-3 font-medium text-gray-700">
              Postpaid Consumption
            </TableHead>
            <TableHead className="py-3 font-medium text-gray-700">
              MD Virtual
            </TableHead>
            <TableHead className="py-3 font-medium text-gray-700">
              Non MD Virtual
            </TableHead>
            <TableHead className="py-3 font-medium text-gray-700">
              Actions
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
              <TableRow
                key={item.id}
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
                    aria-label={`Select row ${item.id}`}
                    className="mx-auto cursor-pointer border-gray-500 hover:border-gray-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white"
                  />
                </TableCell>
                <TableCell className="font-medium">{serialNumber}</TableCell>
                <TableCell className="font-medium">{item.feederName}</TableCell>
                <TableCell className="text-blue font-medium">
                  {item.assetId}
                </TableCell>
                <TableCell>{item.feederConsumption}</TableCell>
                <TableCell>{item.prepaidConsumption}</TableCell>
                <TableCell>{item.postpaidConsumption}</TableCell>
                <TableCell>{item.mdVirtual}</TableCell>
                <TableCell>
                  <span
                    className={
                      item.nonMdVirtual === "NOT SET" ? "text-gray-500" : ""
                    }
                  >
                    {item.nonMdVirtual}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleViewDetails(item)}>
                        <Eye size={16} className="mr-2" />
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleViewVirtualMeters(item)}
                      >
                        <Zap size={16} className="mr-2" />
                        View virtual meters
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleEditFeederConsumption(item)}
                      >
                        <Pencil size={16} className="mr-2" />
                        Edit feeder consumption
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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

      {/* View Details Dialog */}
      {selectedItem && (
        <ViewEnergyImportDetails
          open={isViewDetailsOpen}
          onClose={handleViewDetailsClose}
          data={selectedItem}
        />
      )}

      {selectedItem && (
        <ViewVirtualMetersDialog
          open={isViewVirtualMetersOpen}
          onClose={handleViewVirtualMetersClose}
          data={selectedItem}
        />
      )}
    </Card>
  );
}
