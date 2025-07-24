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
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Card } from "../../ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreVertical, Eye } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import ViewDetailsDialog from "./view-federlin-details-dialog-md";

interface FeederDetailsData {
    id: number;
    accountNumber: string;
    dss: string;
    tariffType: string;
    average: string;
    cumulativeReading: string;
    previousConsumption: string;
    energyType: string;
    consumptionEnergy: string;
}

interface FeederDetailsTableProps {
    feederId: string;
    searchQuery: string;
    sortConfig: string;
    selectedMonth: string;
    selectedYear: string;
    onDataChange: (data: FeederDetailsData[]) => void;
    onApply: () => Promise<void>;
}

export default function FeederDetailsTable({
    searchQuery,
    sortConfig,
    onDataChange,
}: FeederDetailsTableProps) {
    const initialData: FeederDetailsData[] = [
        {
            id: 1,
            accountNumber: "0159004612",
            dss: "Ijeun",
            tariffType: "D1",
            average: "200",
            cumulativeReading: "620,200",
            previousConsumption: "125,244.45",
            energyType: "Estimate",
            consumptionEnergy: "",
        },
        {
            id: 2,
            accountNumber: "0159004613",
            dss: "Ijeun",
            tariffType: "D2",
            average: "150",
            cumulativeReading: "450,300",
            previousConsumption: "89,330.12",
            energyType: "Estimate",
            consumptionEnergy: "",
        },
        {
            id: 3,
            accountNumber: "0159004614",
            dss: "Sagamu",
            tariffType: "D1",
            average: "180",
            cumulativeReading: "780,500",
            previousConsumption: "156,780.89",
            energyType: "Actual",
            consumptionEnergy: "",
        },
        {
            id: 4,
            accountNumber: "0159004615",
            dss: "Ijeun",
            tariffType: "D2",
            average: "220",
            cumulativeReading: "890,700",
            previousConsumption: "234,567.34",
            energyType: "Estimate",
            consumptionEnergy: "",
        },
        {
            id: 5,
            accountNumber: "0159004616",
            dss: "Mowe",
            tariffType: "D1",
            average: "190",
            cumulativeReading: "1,200,000",
            previousConsumption: "345,123.67",
            energyType: "Actual",
            consumptionEnergy: "",
        },
    ];

    const [data, setData] = useState<FeederDetailsData[]>(initialData);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedRowIds, setSelectedRowIds] = useState<Set<number>>(new Set());
    const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<FeederDetailsData | null>(null);

    useEffect(() => {
        onDataChange(data);
    }, [data, onDataChange]);

    const filteredData = data.filter((item) => {
        const searchMatch =
            searchQuery === "" ||
            item.accountNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.dss.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.tariffType.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.average.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.cumulativeReading.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.previousConsumption.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.energyType.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.consumptionEnergy.toLowerCase().includes(searchQuery.toLowerCase());
        return searchMatch;
    });

    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortConfig) return 0;
        const [key, direction] = sortConfig.split(":");
        const multiplier = direction === "desc" ? -1 : 1;

        if (key === "tariffType" || key === "dss" || key === "energyType") {
            return (
                a[key as keyof FeederDetailsData]
                    .toString()
                    .localeCompare(b[key as keyof FeederDetailsData].toString()) *
                multiplier
            );
        }
        if (key === "average" || key === "cumulativeReading" || key === "previousConsumption") {
            return (
                parseFloat(a[key as keyof FeederDetailsData].toString().replace(",", "")) -
                parseFloat(b[key as keyof FeederDetailsData].toString().replace(",", "")) *
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

    const isAllSelected =
        paginatedData.length > 0 &&
        paginatedData.every((item) => selectedRowIds.has(item.id));

    const isSomeSelected =
        paginatedData.some((item) => selectedRowIds.has(item.id)) && !isAllSelected;

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

    const handleConsumptionEnergyChange = (id: number, value: string) => {
        setData((prevData) =>
            prevData.map((item) =>
                item.id === id ? { ...item, consumptionEnergy: value } : item,
            ),
        );
    };

    const handleViewDetails = (item: FeederDetailsData) => {
        setSelectedItem(item);
        setIsViewDetailsOpen(true);
    };

    const viewDetailsData = selectedItem
        ? {
            meterNumber: `V-${selectedItem.id.toString().padStart(8, "0")}`, // Example format
            accountNumber: selectedItem.accountNumber,
            customerName: "Dangote PLC", // Placeholder
            customerAddress: "Km 25, Lagos/Ibadan Expressway, Magboro, Ogun, Nigeria", // Placeholder
            dss: selectedItem.dss,
            averageConsumption: selectedItem.average,
            previousConsumption: selectedItem.previousConsumption,
            consumedEnergy: selectedItem.consumptionEnergy || "550", // Placeholder or user input
            energyType: selectedItem.energyType,
            cumulativeReading: selectedItem.cumulativeReading,
            tariffType: selectedItem.tariffType,
        }
        : null;

    return (
        <Card className="border-none p-4">
            <Table>
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
                                        : "mx-auto cursor-pointer border-gray-500 hover:border-gray-500 focus:ring-0 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-white"
                                }
                            />
                        </TableHead>
                        <TableHead className="py-3 font-medium text-gray-700">S/N</TableHead>
                        <TableHead className="py-3 font-medium text-gray-700">Account Number</TableHead>
                        <TableHead className="py-3 font-medium text-gray-700">DSS</TableHead>
                        <TableHead className="py-3 font-medium text-gray-700">Tariff Type</TableHead>
                        <TableHead className="py-3 font-medium text-gray-700">Average</TableHead>
                        <TableHead className="py-3 font-medium text-gray-700">Cumulative Reading</TableHead>
                        <TableHead className="py-3 font-medium text-gray-700">Previous Consumption</TableHead>
                        <TableHead className="py-3 font-medium text-gray-700">Energy Type</TableHead>
                        <TableHead className="py-3 font-medium text-gray-700">Consumption Energy</TableHead>
                        <TableHead className="py-3 font-medium text-gray-700">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedData.map((item, index) => {
                        const serialNumber = String(
                            (currentPage - 1) * rowsPerPage + index + 1,
                        ).padStart(2, "0");

                        return (
                            <TableRow key={item.id} className="hover:bg-gray-50">
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
                                <TableCell>{item.accountNumber}</TableCell>
                                <TableCell>{item.dss}</TableCell>
                                <TableCell>{item.tariffType}</TableCell>
                                <TableCell>{item.average}</TableCell>
                                <TableCell>{item.cumulativeReading}</TableCell>
                                <TableCell>{item.previousConsumption}</TableCell>
                                <TableCell>{item.energyType}</TableCell>
                                <TableCell>
                                    <Input
                                        type="number"
                                        value={item.consumptionEnergy}
                                        onChange={(e) =>
                                            handleConsumptionEnergyChange(item.id, e.target.value)
                                        }
                                        placeholder="Enter consumption"
                                        className="w-full min-w-[150px] border-gray-300 focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50"
                                    />
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

            <ViewDetailsDialog
                open={isViewDetailsOpen}
                onClose={() => setIsViewDetailsOpen(false)}
                data={viewDetailsData ?? {
                    meterNumber: "",
                    accountNumber: "",
                    customerName: "",
                    customerAddress: "",
                    dss: "",
                    averageConsumption: "",
                    previousConsumption: "",
                    consumedEnergy: "",
                    energyType: "",
                    cumulativeReading: "",
                    tariffType: "",
                }}
            />
        </Card>
    );
}