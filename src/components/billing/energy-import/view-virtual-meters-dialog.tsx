// components/billing/energy-import/view-virtual-meters-dialog.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

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

interface VirtualMeterData {
  id: number;
  sn: string;
  meterNumber: string;
  accountNumber: string;
  dss: string;
  averageConsumption: number;
  cumulativeReading: number;
  tariffType: string;
  energyType: string;
  consumedEnergy: number;
}

interface ViewVirtualMetersDialogProps {
  open: boolean;
  onClose: () => void;
  data: EnergyImportData;
}

export default function ViewVirtualMetersDialog({
  open,
  onClose,
  data,
}: ViewVirtualMetersDialogProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [isExporting, setIsExporting] = useState(false);

  // Define tariff types array
  const tariffTypes = ["R1", "R2", "R3", "C1", "C2", "C3"];

  // Mock data for virtual meters based on the feeder
  const virtualMeters: VirtualMeterData[] = Array.from(
    { length: 40 },
    (_, index) => {
      const randomTariffIndex = Math.floor(Math.random() * tariffTypes.length);
      return {
        id: index + 1,
        sn: (index + 1).toString().padStart(2, "0"),
        meterNumber: `V-${data.assetId}`,
        accountNumber: "0159004612",
        dss: data.feederName.toLowerCase(),
        averageConsumption: Math.floor(Math.random() * 400) + 50,
        cumulativeReading: Math.floor(Math.random() * 2000) + 300,
        tariffType: tariffTypes[randomTariffIndex] ?? "R1",
        energyType: "Estimate",
        consumedEnergy: Math.floor(Math.random() * 700) + 200,
      };
    },
  );

  const totalPages = Math.ceil(virtualMeters.length / rowsPerPage);
  const paginatedData = virtualMeters.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const isAllSelected =
    paginatedData.length > 0 &&
    paginatedData.every((item) => selectedRows.has(item.id));
  const isSomeSelected =
    paginatedData.some((item) => selectedRows.has(item.id)) && !isAllSelected;

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
    setSelectedRows((prev) => {
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
    setSelectedRows((prev) => {
      const newSelected = new Set(prev);
      if (checked) {
        paginatedData.forEach((item) => newSelected.add(item.id));
      } else {
        paginatedData.forEach((item) => newSelected.delete(item.id));
      }
      return newSelected;
    });
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const dataToExport =
        selectedRows.size > 0
          ? virtualMeters.filter((meter) => selectedRows.has(meter.id))
          : virtualMeters;

      const exportData = dataToExport.map((meter) => ({
        "S/N": meter.sn,
        "Meter Number": meter.meterNumber,
        "Account Number": meter.accountNumber,
        DSS: meter.dss,
        "Average Consumption": meter.averageConsumption,
        "Cumulative Reading": meter.cumulativeReading,
        "Tariff Type": meter.tariffType,
        "Energy Type": meter.energyType,
        "Consumed Energy": meter.consumedEnergy,
      }));

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        `${data.feederName} Virtual Meters`,
      );

      const fileName = `${data.feederName}_Virtual_Meters_${new Date().toISOString().split("T")[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      toast.success(
        `Successfully exported ${dataToExport.length} virtual meters to ${fileName}`,
      );

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch {
      toast.error("Failed to export data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="h-fit border-none bg-white p-6"
        style={{
          width: "98vw",
          maxWidth: "1400px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {data.feederName}
          </DialogTitle>
          <p className="text-sm text-gray-600">Asset ID: {data.assetId}</p>
        </DialogHeader>

        <div className="py-4">
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px] text-center">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                      className={
                        isSomeSelected
                          ? "indeterminate"
                          : "mx-auto cursor-pointer border-gray-500 hover:border-gray-500"
                      }
                    />
                  </TableHead>
                  <TableHead className="min-w-[60px] py-3 font-medium text-gray-700">
                    S/N
                  </TableHead>
                  <TableHead className="min-w-[140px] py-3 font-medium text-gray-700">
                    Meter Number
                  </TableHead>
                  <TableHead className="min-w-[140px] py-3 font-medium text-gray-700">
                    Account Number
                  </TableHead>
                  <TableHead className="min-w-[80px] py-3 font-medium text-gray-700">
                    DSS
                  </TableHead>
                  <TableHead className="min-w-[160px] py-3 font-medium text-gray-700">
                    Average Consumption
                  </TableHead>
                  <TableHead className="min-w-[160px] py-3 font-medium text-gray-700">
                    Cumulative Reading
                  </TableHead>
                  <TableHead className="min-w-[100px] py-3 font-medium text-gray-700">
                    Tariff Type
                  </TableHead>
                  <TableHead className="min-w-[110px] py-3 font-medium text-gray-700">
                    Energy Type
                  </TableHead>
                  <TableHead className="min-w-[140px] py-3 font-medium text-gray-700">
                    Consumed Energy
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((meter) => (
                  <TableRow key={meter.id} className="hover:bg-gray-50">
                    <TableCell className="text-center">
                      <Checkbox
                        checked={selectedRows.has(meter.id)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(meter.id, Boolean(checked))
                        }
                        aria-label={`Select row ${meter.id}`}
                        className="mx-auto cursor-pointer border-gray-500 hover:border-gray-500"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{meter.sn}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {meter.meterNumber}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {meter.accountNumber}
                    </TableCell>
                    <TableCell className="capitalize">{meter.dss}</TableCell>
                    <TableCell className="text-right">
                      {meter.averageConsumption.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {meter.cumulativeReading.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {meter.tariffType}
                    </TableCell>
                    <TableCell>{meter.energyType}</TableCell>
                    <TableCell className="text-right">
                      {meter.consumedEnergy.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Rows per page</span>
              <Select
                value={rowsPerPage.toString()}
                onValueChange={handleRowsPerPageChange}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm font-medium">
                {(currentPage - 1) * rowsPerPage + 1}-
                {Math.min(currentPage * rowsPerPage, virtualMeters.length)} of{" "}
                {virtualMeters.length} rows
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
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isExporting}
            className="cursor-pointer border-[#161CCA] text-[#161CCA]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="cursor-pointer bg-[#161CCA] text-white"
          >
            {isExporting
              ? "Exporting..."
              : `Export${selectedRows.size > 0 ? ` (${selectedRows.size} selected)` : ""}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
