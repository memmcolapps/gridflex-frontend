import { Eye, MoreVertical, Pencil } from "lucide-react";
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
import { useState } from "react";
import EditMeterReading from "./edit-reading";
import { Card } from "../ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import ViewMeterReadingDetails from "./view-meter-reading-details";
import { Checkbox } from "@/components/ui/checkbox"; // Import the Checkbox component
import { useMeterReadings } from "@/hooks/use-billing";

interface MeterReading {
    id: number;
    meterNo: string;
    feederLine: string;
    tariffType: string;
    larDate: string;
    lastReading: number;
    readingType: string;
    readingDate: string;
    currentReadings: number;
}

interface MeterReadingsProps {
    searchQuery: string;
    sortConfig: string;
    selectedMonth: string;
    selectedYear: string;
    meterClass: string;
}

export default function MeterReadings({ searchQuery, sortConfig, selectedMonth, selectedYear, meterClass }: MeterReadingsProps) {
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MeterReading | null>(null);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedRowIds, setSelectedRowIds] = useState<Set<number>>(new Set()); // New state for selected row IDs

    const [sortBy, sortDirection] = sortConfig ? sortConfig.split(':') : [null, null];

    const { data: meterReadingsData } = useMeterReadings({
        searchTerm: searchQuery,
        sortBy: sortBy as keyof MeterReading | null,
        sortDirection: sortDirection as "asc" | "desc" | null,
        meterClass,
        selectedMonth,
        selectedYear,
    });

    const data = meterReadingsData?.meterReadings ?? [];
    const totalData = meterReadingsData?.totalData ?? 0;

    // Since filtering and sorting is now handled by the API, we use the data directly
    const totalPages = Math.ceil(totalData / rowsPerPage);

    const paginatedData = data.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    // Check if all items on the current page are selected
    const isAllSelected = paginatedData.length > 0 && paginatedData.every(item => selectedRowIds.has(item.id));
    // Check if some items on the current page are selected (for indeterminate state)
    const isSomeSelected = paginatedData.some(item => selectedRowIds.has(item.id)) && !isAllSelected;


    const handleView = (id: number) => {
        const item = paginatedData.find((item) => item.id === id);
        setSelectedItem(item ?? null);
        setViewDialogOpen(true);
    };

    const handleEdit = (id: number) => {
        const item = paginatedData.find((item) => item.id === id);
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

    // Function to handle individual checkbox change
    const handleCheckboxChange = (id: number, checked: boolean) => {
        setSelectedRowIds(prev => {
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
        setSelectedRowIds(prev => {
            const newSelected = new Set(prev);
            if (checked) {
                paginatedData.forEach(item => newSelected.add(item.id));
            } else {
                paginatedData.forEach(item => newSelected.delete(item.id));
            }
            return newSelected;
        });
    };

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
                    {paginatedData.map((item) => (
                        <TableRow key={item.id}>
                            {/* Individual Checkbox */}
                            <TableCell className="text-center">
                                <Checkbox
                                    checked={selectedRowIds.has(item.id)}
                                    onCheckedChange={(checked) => handleCheckboxChange(item.id, Boolean(checked))}
                                    aria-label={`Select row ${item.id}`}
                                    className="mx-auto border-gray-500 hover:border-gray-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white cursor-pointer"
                                />
                            </TableCell>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.meterNo}</TableCell>
                            <TableCell>{item.feederLine}</TableCell>
                            <TableCell>{item.tariffType}</TableCell>
                            <TableCell>{item.larDate}</TableCell>
                            <TableCell>{item.lastReading}</TableCell>
                            <TableCell>{item.readingType}</TableCell>
                            <TableCell>{item.readingDate}</TableCell>
                            <TableCell>{item.currentReadings}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreVertical size={16} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => handleView(item.id)}>
                                            <Eye size={16} className="mr-2" />
                                            View details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleEdit(item.id)}>
                                            <Pencil size={16} className="mr-2" />
                                            Edit Current Readings
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
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
                        {Math.min(currentPage * rowsPerPage, totalData)} of {totalData}
                    </span>
                </div>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={e => {
                                e.preventDefault();
                                handlePrevious();
                            }}
                            aria-disabled={currentPage === 1}
                        />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={e => {
                                e.preventDefault();
                                handleNext();
                            }}
                            aria-disabled={currentPage === totalPages}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>

            {/* Edit Dialog */}
            {selectedItem && isEditDialogOpen && (
                <EditMeterReading
                    id={selectedItem.id}
                    onClose={handleEditDialogClose}
                    initialData={{
                        ...selectedItem,
                        month: selectedItem.larDate.split("-")[1] ?? "",
                        year: selectedItem.larDate.split("-")[2] ?? "",
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