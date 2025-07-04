import { Eye, MoreVertical, Pencil } from "lucide-react";
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
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import EditMeterReading from "./edit-reading";
import { Card } from "../ui/card";

export default function MeterReadings() {
    const data = [
        { id: 1, meterNo: "62010223", feederLine: "jeun", tariffType: "R1", larDate: "16-05-2025", lastReading: 500, readingType: "Normal", readingDate: "16-06-2025", currentReadings: 0 },
        { id: 2, meterNo: "62010223", feederLine: "jeun", tariffType: "R2", larDate: "16-05-2025", lastReading: 300, readingType: "Rollover", readingDate: "16-06-2025", currentReadings: 300 },
        { id: 3, meterNo: "62010223", feederLine: "jeun", tariffType: "R3", larDate: "16-05-2025", lastReading: 450, readingType: "Normal", readingDate: "16-06-2025", currentReadings: 450 },
        { id: 4, meterNo: "62010223", feederLine: "jeun", tariffType: "C1", larDate: "16-05-2025", lastReading: 400, readingType: "Normal", readingDate: "16-06-2025", currentReadings: 400 },
        { id: 5, meterNo: "62010223", feederLine: "jeun", tariffType: "C2", larDate: "16-05-2025", lastReading: 480, readingType: "Normal", readingDate: "16-06-2025", currentReadings: 0 },
        { id: 6, meterNo: "62010223", feederLine: "jeun", tariffType: "C3", larDate: "16-05-2025", lastReading: 800, readingType: "Normal", readingDate: "16-06-2025", currentReadings: 800 },
        { id: 7, meterNo: "62010223", feederLine: "jeun", tariffType: "D1", larDate: "16-05-2025", lastReading: 900, readingType: "Normal", readingDate: "16-06-2025", currentReadings: 900 },
        { id: 8, meterNo: "62010223", feederLine: "jeun", tariffType: "D2", larDate: "16-05-2025", lastReading: 30, readingType: "Normal", readingDate: "16-06-2025", currentReadings: 30 },
        { id: 9, meterNo: "62010223", feederLine: "jeun", tariffType: "D3", larDate: "16-05-2025", lastReading: 99980, readingType: "Normal", readingDate: "16-06-2025", currentReadings: 0 },
        { id: 10, meterNo: "62010223", feederLine: "jeun", tariffType: "R3", larDate: "16-05-2025", lastReading: 99950, readingType: "Normal", readingDate: "16-06-2025", currentReadings: 99950 },
    ];

    type MeterReading = {
        id: number;
        meterNo: string;
        feederLine: string;
        tariffType: string;
        larDate: string;
        lastReading: number;
        readingType: string;
        readingDate: string;
        currentReadings: number;
    };

    const [, setEditDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MeterReading | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);

    const totalPages = Math.ceil(data.length / rowsPerPage);
    const paginatedData = data.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handleView = (id: number) => {
        console.log(`Viewing meter reading ${id}`);
    };

    const handleEdit = (id: number) => {
        const item = data.find((item) => item.id === id);
        setSelectedItem(item ?? null);
        setEditDialogOpen(true);
    };

    const handleDialogClose = () => {
        setEditDialogOpen(false);
        setSelectedItem(null);
    };

    const handlePrevious = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNext = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handleRowsPerPageChange = (value: string) => {
        setRowsPerPage(Number(value));
        setCurrentPage(1);
    };

    return (
        <Card className="p-4 border-none shadow-sm rounded">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>S/N</TableHead>
                        <TableHead>Meter No.</TableHead>
                        <TableHead>Feeder Line</TableHead>
                        <TableHead>Tariff Type</TableHead>
                        <TableHead>LAR Date</TableHead>
                        <TableHead>Last Actual Reading</TableHead>
                        <TableHead>Reading Type</TableHead>
                        <TableHead>Reading Date</TableHead>
                        <TableHead>Current Readings</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedData.map((item, index) => (
                        <TableRow key={item.id}>
                            <TableCell>{(currentPage - 1) * rowsPerPage + index + 1}</TableCell>
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
                        {Math.min(currentPage * rowsPerPage, data.length)} of {data.length}
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
            {selectedItem && (
                <EditMeterReading
                    id={selectedItem.id}
                    onClose={handleDialogClose}
                    initialData={{
                        ...selectedItem,
                        month: selectedItem.readingDate.split("-")[1] ?? "",
                        year: selectedItem.readingDate.split("-")[2] ?? "",
                    }}
                />
            )}
        </Card>
    );
}