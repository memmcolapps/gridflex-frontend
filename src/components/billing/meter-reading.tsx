import { Eye, MoreVertical, Pencil } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import EditMeterReading from "./edit-reading";
import { Card } from "../ui/card";
import ViewMeterReadingDetails from "./view-meter-reading-details";
import { Checkbox } from "@/components/ui/checkbox"; // Import the Checkbox component
import { useMeterReadings } from "@/hooks/use-billing";
import { LoadingAnimation } from "@/components/ui/loading-animation";
import { usePermissions } from "@/hooks/use-permissions";

interface MeterReading {
    meterNumber: string;
    readingType: string;
    lastReading: number;
    currentReading: number;
    currentReadingDate: string;
    lastReadingDate: string;
    billMonth: string;
    billYear: string;
    createdAt: string;
    updatedAt: string;
    tariffType: string;
    feederName: string;
    dssName: string;
    meterClass: string;
    type: string;
}

interface MeterReadingsProps {
    searchQuery: string;
    sortConfig: string;
    selectedMonth?: string;
    selectedYear?: string;
    meterClass: string;
    onDataLoaded?: (latestMonth: string, latestYear: string) => void;
}

export default function MeterReadings({ searchQuery, sortConfig, selectedMonth, selectedYear, meterClass, onDataLoaded }: MeterReadingsProps) {
    const { canEdit } = usePermissions();
    // Prevent hydration mismatch by ensuring consistent initial state
    const [mounted, setMounted] = useState(false);

    useState(() => {
        setMounted(true);
    });
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MeterReading | null>(null);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set()); // New state for selected row IDs

    const [sortBy, sortDirection] = sortConfig ? sortConfig.split(':') : [null, null] as [string | null, string | null];

    const { data: meterReadingsData, isLoading, error } = useMeterReadings({
        searchTerm: searchQuery,
        sortBy: sortBy as keyof MeterReading ?? null,
        sortDirection: sortDirection as "asc" | "desc" ?? null,
        meterClass,
        selectedMonth,
        selectedYear,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const data = meterReadingsData?.meterReadings ?? [];
    const totalData = meterReadingsData?.totalData ?? 0;

    // Notify parent component of latest data's month/year
    useEffect(() => {
        if (data.length > 0 && onDataLoaded) {
            const firstItem = data[0];
            if (firstItem?.billMonth && firstItem?.billYear) {
                // Convert month to title case (e.g., "FEBRUARY" -> "February")
                const formattedMonth = firstItem.billMonth.charAt(0).toUpperCase() +
                    firstItem.billMonth.slice(1).toLowerCase();
                onDataLoaded(formattedMonth, firstItem.billYear);
            }
        }
    }, [data, onDataLoaded]);


    const paginatedData = data.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    // Check if all items on the current page are selected
    const isAllSelected = paginatedData.length > 0 && paginatedData.every(item => selectedRowIds.has(item.meterNumber));
    // Check if some items on the current page are selected (for indeterminate state)
    const isSomeSelected = paginatedData.some(item => selectedRowIds.has(item.meterNumber)) && !isAllSelected;


    const handleView = (meterNumber: string) => {
        const item = paginatedData.find((item) => item.meterNumber === meterNumber);
        setSelectedItem(item ?? null);
        setViewDialogOpen(true);
    };

    const handleEdit = (meterNumber: string) => {
        const item = paginatedData.find((item) => item.meterNumber === meterNumber);
        setSelectedItem(item ?? null);
        setEditDialogOpen(true);
    };

    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
        setSelectedItem(null);
    };

    const handleViewDialogClose = () => {
        setViewDialogOpen(false);
        setSelectedItem(null);
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setRowsPerPage(newPageSize);
        setCurrentPage(1);
    };

    // Function to handle individual checkbox change
    const handleCheckboxChange = (meterNumber: string, checked: boolean) => {
        setSelectedRowIds(prev => {
            const newSelected = new Set(prev);
            if (checked) {
                newSelected.add(meterNumber);
            } else {
                newSelected.delete(meterNumber);
            }
            return newSelected;
        });
    };

    // Function to handle master checkbox change (select/deselect all on current page)
    const handleSelectAll = (checked: boolean) => {
        setSelectedRowIds(prev => {
            const newSelected = new Set(prev);
            if (checked) {
                paginatedData.forEach(item => newSelected.add(item.meterNumber));
            } else {
                paginatedData.forEach(item => newSelected.delete(item.meterNumber));
            }
            return newSelected;
        });
    };

    // Prevent hydration mismatch by only rendering after mount
    if (!mounted) {
        return (
            <Card className="p-4 border-none">
                <Table>
                    <TableHeader className="bg-transparent">
                        <TableRow>
                            <TableHead className="w-[50px] text-center">
                                <Checkbox
                                    checked={false}
                                    aria-label="Select all"
                                    className="mx-auto border-gray-500 hover:border-gray-500 focus:ring-0 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-white cursor-pointer"
                                />
                            </TableHead>
                            <TableHead className="py-3 font-medium text-gray-700">S/N</TableHead>
                            <TableHead className="py-3 font-medium text-gray-700">Meter No.</TableHead>
                            <TableHead className="py-3 font-medium text-gray-700">Feeder Line</TableHead>
                            <TableHead className="py-3 font-medium text-gray-700">Tariff Type</TableHead>
                            <TableHead className="py-3 font-medium text-gray-700">LAR Date</TableHead>
                            <TableHead className="py-3 font-medium text-gray-700">Last Actual Reading</TableHead>
                            <TableHead className="py-3 font-medium text-gray-700">Reading Type</TableHead>
                            <TableHead className="py-3 font-medium text-gray-700">Reading Date</TableHead>
                            <TableHead className="py-3 font-medium text-gray-700">Current Readings</TableHead>
                            <TableHead className="py-3 font-medium text-gray-700">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={11} className="text-center py-8">
                                <LoadingAnimation />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Card>
        );
    }

    return (
        <Card className="p-4 border-none">
            <Table>
                <TableHeader className="bg-transparent">
                    <TableRow>
                        {/* Checkbox for Select All */}
                        <TableHead className="w-[50px] text-center">
                            <Checkbox
                                checked={isAllSelected}
                                onCheckedChange={handleSelectAll}
                                aria-label="Select all"
                                // Indeterminate state
                                className={isSomeSelected ? "indeterminate" : "mx-auto border-gray-500 hover:border-gray-500 focus:ring-0 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-white cursor-pointer"}
                            />
                        </TableHead>
                        <TableHead className="py-3 font-medium text-gray-700">S/N</TableHead>
                        <TableHead className="py-3 font-medium text-gray-700">Meter No.</TableHead>
                        <TableHead className="py-3 font-medium text-gray-700">Feeder Line</TableHead>
                        <TableHead className="py-3 font-medium text-gray-700">Tariff Type</TableHead>
                        <TableHead className="py-3 font-medium text-gray-700">LAR Date</TableHead>
                        <TableHead className="py-3 font-medium text-gray-700">Last Actual Reading</TableHead>
                        <TableHead className="py-3 font-medium text-gray-700">Reading Type</TableHead>
                        <TableHead className="py-3 font-medium text-gray-700">Reading Date</TableHead>
                        <TableHead className="py-3 font-medium text-gray-700">Current Readings</TableHead>
                        <TableHead className="py-3 font-medium text-gray-700">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={11} className="text-center py-8">
                                <LoadingAnimation />
                            </TableCell>
                        </TableRow>
                    ) : error ? (
                        <TableRow>
                            <TableCell colSpan={11} className="text-center py-8 text-red-500">
                                Error loading meter readings: {error.message}
                            </TableCell>
                        </TableRow>
                    ) : data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={11} className="text-center py-8 text-gray-500">
                                No meter readings found
                            </TableCell>
                        </TableRow>
                    ) : (
                        paginatedData.map((item, index) => (
                            <TableRow key={`${item.meterNumber}-${index}`}>
                                {/* Individual Checkbox */}
                                <TableCell className="text-center">
                                    <Checkbox
                                        checked={selectedRowIds.has(item.meterNumber)}
                                        onCheckedChange={(checked) => handleCheckboxChange(item.meterNumber, Boolean(checked))}
                                        aria-label={`Select row ${item.meterNumber}`}
                                        className="mx-auto border-gray-500 hover:border-gray-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white cursor-pointer"
                                    />
                                </TableCell>
                                <TableCell>{(currentPage - 1) * rowsPerPage + index + 1}</TableCell>
                                <TableCell>{item.meterNumber}</TableCell>
                                <TableCell>{item.feederName}</TableCell>
                                <TableCell>{item.tariffType}</TableCell>
                                <TableCell>{item.lastReadingDate}</TableCell>
                                <TableCell>{item.lastReading}</TableCell>
                                <TableCell>{item.readingType}</TableCell>
                                <TableCell>{item.currentReadingDate}</TableCell>
                                <TableCell>{item.currentReading}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical size={16} />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => handleView(item.meterNumber)}>
                                                <Eye size={16} className="mr-2" />
                                                View details
                                            </DropdownMenuItem>
                                            {canEdit && (
                                                <DropdownMenuItem onClick={() => handleEdit(item.meterNumber)}>
                                                    <Pencil size={16} className="mr-2" />
                                                    Edit Current Readings
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            <PaginationControls
                currentPage={currentPage}
                totalItems={totalData}
                pageSize={rowsPerPage}
                onPageChange={setCurrentPage}
                onPageSizeChange={handlePageSizeChange}
            />

            {/* Edit Dialog */}
            {selectedItem && isEditDialogOpen && (
                <EditMeterReading
                    id={selectedItem.meterNumber}
                    onClose={handleEditDialogClose}
                    initialData={{
                        meterNo: selectedItem.meterNumber,
                        month: selectedItem.currentReadingDate.split("-")[1] ?? "",
                        year: selectedItem.currentReadingDate.split("-")[0] ?? "",
                        readingType: selectedItem.readingType,
                        currentReadings: selectedItem.currentReading,
                    }}
                />
            )}

            {/* View Dialog */}
            {selectedItem && isViewDialogOpen && (
                <ViewMeterReadingDetails
                    open={isViewDialogOpen}
                    onClose={handleViewDialogClose}
                    data={selectedItem}
                />
            )}
        </Card>
    );
}