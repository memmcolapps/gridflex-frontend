// components/billing/md-energy-import/view-virtual-meters-dialog.tsx
import { useState, useEffect } from "react";
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
import {
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { useMDEnergyImport } from "@/hooks/use-billing";
import { Loader2 } from "lucide-react";

interface EnergyImportData {
    id: number;
    feederName: string;
    assetId: string;
    feederConsumption: string;
    prepaidConsumption: string;
    postpaidConsumption: string;
    mdVirtual: string;
    nonMdVirtual: string;
    nodeId?: string;
}

interface ViewVirtualMetersDialogProps {
    open: boolean;
    onClose: () => void;
    data: EnergyImportData;
    month?: string;
    year?: string;
}

export default function ViewVirtualMetersDialog({
    open,
    onClose,
    data,
    month,
    year,
}: ViewVirtualMetersDialogProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
    const [isExporting, setIsExporting] = useState(false);

    // Use the MD Energy Import hook to fetch data
    const { data: apiData, isLoading, error } = useMDEnergyImport({
        nodeId: data.nodeId ?? "",
        month: month,
        year: year,
        page: currentPage - 1,
        size: rowsPerPage,
        enabled: open && !!data.nodeId,
    });

    // Reset pagination when dialog opens or filters change
    useEffect(() => {
        if (open) {
            setCurrentPage(1);
            setSelectedRows(new Set());
        }
    }, [open, month, year]);

    const virtualMeters = apiData?.consumptions ?? [];
    const totalCount = apiData?.totalCount ?? 0;
    const totalPages = apiData?.totalPages ?? Math.ceil(totalCount / rowsPerPage);

    const isAllSelected =
        virtualMeters.length > 0 &&
        virtualMeters.every((item) => selectedRows.has(item.meterId));
    const isSomeSelected =
        virtualMeters.some((item) => selectedRows.has(item.meterId)) && !isAllSelected;

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

    const handleCheckboxChange = (id: string, checked: boolean) => {
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
                virtualMeters.forEach((item) => newSelected.add(item.meterId));
            } else {
                virtualMeters.forEach((item) => newSelected.delete(item.meterId));
            }
            return newSelected;
        });
    };

    const handleExport = async () => {
        setIsExporting(true);

        try {
            const dataToExport =
                selectedRows.size > 0
                    ? virtualMeters.filter((meter) => selectedRows.has(meter.meterId))
                    : virtualMeters;

            const exportData = dataToExport.map((meter, index) => ({
                "S/N": (index + 1).toString().padStart(2, "0"),
                "Meter Number": meter.meterNumber,
                "Feeder Name": meter.feederName,
                "DSS": meter.dssName,
                "Average Consumption": meter.averageConsumption,
                "Cumulative Reading": meter.cumulativeReading,
                "Tariff Type": meter.tariffType,
                "Meter Class": meter.meterClass,
                "Type": meter.type,
                "Consumption": meter.consumption,
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

    const startIndex = (currentPage - 1) * rowsPerPage;

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
                    {!data.nodeId ? (
                        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                            <p>No node ID available for this feeder.</p>
                            <p className="text-sm">Unable to fetch virtual meters data.</p>
                        </div>
                    ) : isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-[#161CCA]" />
                            <span className="ml-2">Loading virtual meters...</span>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-8 text-red-500">
                            <p>Error loading virtual meters data.</p>
                            <p className="text-sm">{error.message}</p>
                        </div>
                    ) : virtualMeters.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                            <p>No virtual meters found for this feeder.</p>
                        </div>
                    ) : (
                        <>
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
                                            <TableHead className="min-w-[120px] py-3 font-medium text-gray-700">
                                                Feeder Name
                                            </TableHead>
                                            <TableHead className="min-w-[100px] py-3 font-medium text-gray-700">
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
                                            <TableHead className="min-w-[100px] py-3 font-medium text-gray-700">
                                                Meter Class
                                            </TableHead>
                                            <TableHead className="min-w-[140px] py-3 font-medium text-gray-700">
                                                Consumption
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {virtualMeters.map((meter, index) => (
                                            <TableRow key={meter.meterId} className="hover:bg-gray-50">
                                                <TableCell className="text-center">
                                                    <Checkbox
                                                        checked={selectedRows.has(meter.meterId)}
                                                        onCheckedChange={(checked) =>
                                                            handleCheckboxChange(meter.meterId, Boolean(checked))
                                                        }
                                                        aria-label={`Select row ${meter.meterId}`}
                                                        className="mx-auto cursor-pointer border-gray-500 hover:border-gray-500"
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {(startIndex + index + 1).toString().padStart(2, "0")}
                                                </TableCell>
                                                <TableCell className="font-mono text-sm">
                                                    {meter.meterNumber}
                                                </TableCell>
                                                <TableCell>{meter.feederName}</TableCell>
                                                <TableCell className="capitalize">{meter.dssName}</TableCell>
                                                <TableCell className="text-right">
                                                    {meter.averageConsumption.toLocaleString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {meter.cumulativeReading.toLocaleString()}
                                                </TableCell>
                                                <TableCell className="font-semibold">
                                                    {meter.tariffType}
                                                </TableCell>
                                                <TableCell>{meter.meterClass}</TableCell>
                                                <TableCell className="text-right">
                                                    {meter.consumption.toLocaleString()}
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
                                        {startIndex + 1}-
                                        {Math.min(startIndex + rowsPerPage, totalCount)} of{" "}
                                        {totalCount} rows
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
                        </>
                    )}
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
                        disabled={isExporting || isLoading || virtualMeters.length === 0}
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
