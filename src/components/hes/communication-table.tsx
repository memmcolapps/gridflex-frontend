// components/CommunicationTable.tsx
"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { getStatusStyle } from "../status-style";
import { PaginationControls } from "../ui/pagination-controls";
import { type CommunicationReportData } from "@/types/reports";

interface CommunicationTableProps {
  communicationData: CommunicationReportData[];
  isLoading: boolean;
  currentPage: number;
  rowsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function CommunicationTable({
  communicationData,
  isLoading,
  currentPage,
  rowsPerPage,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: CommunicationTableProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] =
    useState<CommunicationReportData | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const [isTokenDialogOpen, setIsTokenDialogOpen] = useState(false);
  const [token, setToken] = useState("");
  const [meterToTokenize, setMeterToTokenize] = useState<string | null>(null);

  const paginatedData = communicationData;

  const handleRowClick = (rowData: CommunicationReportData) => {
    setSelectedRow(rowData);
    setDialogOpen(true);
  };

  const handleCheckboxChange = (meterNo: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedRows((prev) => [...prev, meterNo]);
    } else {
      setSelectedRows((prev) => prev.filter((mn) => mn !== meterNo));
    }
  };

  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedRows(paginatedData.map((row) => row.meterNo ?? ""));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSendToken = (meterNo: string) => {
    setMeterToTokenize(meterNo);
    setIsTokenDialogOpen(true);
  };

  const handleTokenSubmit = () => {
    console.log(`Sending token: ${token} to meter: ${meterToTokenize}`);
    toast.success(`Successfully sent token to meter ${meterToTokenize}`);

    setToken("");
    setMeterToTokenize(null);
    setIsTokenDialogOpen(false);
  };

  // Determine which columns to show based on the data structure
  const hasMeterModel =
    paginatedData.length > 0 &&
    paginatedData[0]?.meter?.smartMeterInfo?.meterModel != null;
  const formatDateTime = (value?: string) =>
    value ? new Date(value).toLocaleString() : "-";

  if (isLoading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox
                checked={
                  selectedRows.length === paginatedData.length &&
                  paginatedData.length > 0
                }
                className="mr-2 cursor-pointer"
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>S/N</TableHead>
            <TableHead>Meter No.</TableHead>
            {hasMeterModel && <TableHead>Meter Model</TableHead>}
            <TableHead>Connection Type</TableHead>

            <TableHead>Last Online At</TableHead>
            <TableHead>Last Updated At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((row, index) => (
            <TableRow
              key={row.meterNo ?? `row-${index}`}
              onClick={(e) => {
                if (
                  (e.target as HTMLElement).tagName !== "INPUT" &&
                  (e.target as HTMLElement).tagName !== "BUTTON"
                ) {
                  handleRowClick(row);
                }
              }}
              className="cursor-pointer hover:bg-gray-50"
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedRows.includes(row.meterNo ?? "")}
                  className="mr-2 cursor-pointer"
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(row.meterNo ?? "", Boolean(checked))
                  }
                />
              </TableCell>
              <TableCell>
                {(currentPage - 1) * rowsPerPage + index + 1}
              </TableCell>
              <TableCell>{row.meterNo}</TableCell>
              {hasMeterModel && (
                <TableCell>{row.meter?.smartMeterInfo?.meterModel}</TableCell>
              )}
              <TableCell>
                <span className={getStatusStyle(row.connectionType)}>
                  {row.connectionType}
                </span>
              </TableCell>
              <TableCell>{formatDateTime(row.onlineTime)}</TableCell>
              <TableCell>{formatDateTime(row.updatedAt)}</TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="p-0 focus:ring-gray-300/20"
                    >
                      <EllipsisVertical className="h-4 w-4" size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full p-3 shadow-lg">
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => handleRowClick(row)}
                    >
                      <Eye size={14} className="mr-2" /> View Details
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination and row count controls */}
      <div className="p-4">
        <PaginationControls
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={rowsPerPage}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>

      {/* View Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="h-fit w-full rounded-lg bg-white p-6">
          <DialogHeader>
            <DialogTitle>View Details</DialogTitle>
          </DialogHeader>
          {selectedRow && (
            <div className="grid gap-4 py-4 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <Label className="font-semibold">Meter Number:</Label>
                <span>{selectedRow.meterNo}</span>
              </div>
              {selectedRow.meter?.smartMeterInfo?.meterModel && (
                <div className="grid grid-cols-2 gap-2">
                  <Label className="font-semibold">Meter Model:</Label>
                  <span>{selectedRow.meter.smartMeterInfo.meterModel}</span>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <Label className="font-semibold">Connection Type:</Label>
                <span>{selectedRow.connectionType}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Label className="font-semibold">Last Online At:</Label>
                <span>{formatDateTime(selectedRow.onlineTime)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Label className="font-semibold">Offline Time:</Label>
                <span>{formatDateTime(selectedRow.offlineTime)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Label className="font-semibold">Last Updated At:</Label>
                <span>{formatDateTime(selectedRow.updatedAt)}</span>
              </div>
              {selectedRow.meter && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <Label className="font-semibold">Account Number:</Label>
                    <span>{selectedRow.meter.accountNumber}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Label className="font-semibold">Meter Class:</Label>
                    <span>{selectedRow.meter.meterClass}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Label className="font-semibold">Customer ID:</Label>
                    <span>{selectedRow.meter.customerId}</span>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Send Token Dialog */}
      <Dialog open={isTokenDialogOpen} onOpenChange={setIsTokenDialogOpen}>
        <DialogContent className="h-fit w-full rounded-lg bg-white p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-lg">Send Token</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 text-sm">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="token">
                Token <span className="text-red-500">*</span>
              </Label>
              <input
                id="token"
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter Token"
                className="rounded-md border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-[#161CCA]/50 focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-between gap-2">
            <Button
              variant="outline"
              className="cursor-pointer border-[#161CCA] text-[#161CCA]"
              onClick={() => {
                setIsTokenDialogOpen(false);
                setToken("");
              }}
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer bg-[#161CCA] text-white"
              onClick={handleTokenSubmit}
              disabled={token.length === 0}
            >
              Proceed
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
