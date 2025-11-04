// components/billing/md-energy-import/energy-import-table.tsx
import { MoreVertical, Eye, Zap, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Card } from "../../ui/card";
import { PaginationControls } from "@/components/ui/pagination-controls";
import ViewEnergyImportDetails from "@/components/billing/md-energy-import/view-energy-import-details";
import ViewVirtualMetersDialog from "@/components/billing/md-energy-import/view-virtual-meters-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AddReadings from "./add-readings-dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface EnergyImportData {
    id: number;
    feederName: string;
    assetId: string;
    feederConsumption: string;
    prepaidConsumption: string;
    postpaidConsumption: string;
    mdVirtual: string;
    nonMdVirtual: string;
    month: string;
    year: string;
    technicalLoss: string;
    commercialLoss: string;
}

interface EnergyImportTableProps {
    searchQuery: string;
    sortConfig: string;
    selectedMonth: string;
    selectedYear: string;
    onSelectionChange?: (selectedIds: Set<number>) => void;
    allData: EnergyImportData[];
    setAllData: React.Dispatch<React.SetStateAction<EnergyImportData[]>>;
}

export default function EnergyImportTable({
    searchQuery,
    sortConfig,
    onSelectionChange,
    allData,
    setAllData,
}: EnergyImportTableProps) {
    const router = useRouter();
    const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<EnergyImportData | null>(null);
    const [isViewVirtualMetersOpen, setIsViewVirtualMetersOpen] = useState(false);
    const [isEditReadingsDialogOpen, setIsEditReadingsDialogOpen] = useState(false);
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
    const handleEditReadings = (item: EnergyImportData) => {
        setSelectedItem(item);
        setIsEditReadingsDialogOpen(true);
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
    const filteredData = allData.filter((item) => {
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
                    .localeCompare(b[key as keyof EnergyImportData].toString()) * multiplier
            );
        }
        return 0;
    });


    const paginatedData = sortedData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    // Check if all items on the current page are selected
    const isAllSelected =
        paginatedData.length > 0 &&
        paginatedData.every((item) => selectedRowIds.has(item.id));

    // Check if some items on the current page are selected (for indeterminate state)
    const isSomeSelected =
        paginatedData.some((item) => selectedRowIds.has(item.id)) && !isAllSelected;

    const handlePageSizeChange = (newPageSize: number) => {
        setRowsPerPage(newPageSize);
        setCurrentPage(1);
    };

    const handleRowDoubleClick = (item: EnergyImportData) => {
        router.push(`/billing/md-prebilling/energy-import/${item.assetId}`);
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
        <Card className="border-none p-4 bg-transparent">
            <Table className="bg-transparent">
                <TableHeader className="bg-transparent">
                    <TableRow>
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
                        <TableHead className="py-3 font-medium text-gray-700">S/N</TableHead>
                        <TableHead className="py-3 font-medium text-gray-700">Feeder Name</TableHead>
                        <TableHead className="py-3 font-medium text-gray-700">Asset ID</TableHead>
                        <TableHead className="py-3 font-medium text-gray-700">Feeder Consumption</TableHead>
                        <TableHead className="py-3 font-medium text-gray-700">Prepaid Consumption</TableHead>
                        <TableHead className="py-3 font-medium text-gray-700">Postpaid Consumption</TableHead>
                        <TableHead className="py-3 font-medium text-gray-700">MD Virtual</TableHead>
                        <TableHead className="py-3 font-medium text-gray-700">Non MD Virtual</TableHead>
                        <TableHead className="py-3 font-medium text-gray-700">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedData.map((item, index) => {
                        const serialNumber = String(
                            (currentPage - 1) * rowsPerPage + index + 1
                        ).padStart(2, "0");

                        return (
                            <TableRow
                                key={item.id}
                                onDoubleClick={() => handleRowDoubleClick(item)}
                                className="cursor-pointer hover:bg-gray-50"
                            >
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
                                <TableCell className="text-blue font-medium">{item.assetId}</TableCell>
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
                                                onClick={() => handleEditReadings(item)}
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
            <PaginationControls
                currentPage={currentPage}
                totalItems={sortedData.length}
                pageSize={rowsPerPage}
                onPageChange={setCurrentPage}
                onPageSizeChange={handlePageSizeChange}
            />

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

            {selectedItem && (
                <Dialog open={isEditReadingsDialogOpen} onOpenChange={setIsEditReadingsDialogOpen}>
                    <DialogContent className="w-full max-w-2xl bg-white p-6 h-fit">
                        <DialogHeader>
                            <DialogTitle>Edit Readings</DialogTitle>
                        </DialogHeader>
                        <AddReadings
                            onClose={() => setIsEditReadingsDialogOpen(false)}
                            data={selectedItem}
                            onSave={(formData) => {
                                setAllData((prevData) =>
                                    prevData.map((item) =>
                                        item.assetId === formData.assetId
                                            ? {
                                                ...item,
                                                feederConsumption: formData.feederConsumption,
                                                month: formData.month,
                                                year: formData.year,
                                                technicalLoss: formData.technicalLoss,
                                                commercialLoss: formData.commercialLoss,
                                            }
                                            : item
                                    )
                                );
                                setIsEditReadingsDialogOpen(false);
                                setSelectedItem(null);
                            }}
                        />
                    </DialogContent>
                </Dialog>
            )}
        </Card>
    );
}