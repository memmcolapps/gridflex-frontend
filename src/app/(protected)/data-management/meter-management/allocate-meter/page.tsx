"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { ArrowRightLeft, ArrowUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {  CirclePlus } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ContentHeader } from "@/components/ui/content-header";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FilterControl } from "@/components/search-control";

// Define filter sections for FilterControl
const filterSections = [
    {
        title: "Meter Class",
        options: [
            { label: "Single Phase", id: "singlePhase" },
            { label: "Three Phase", id: "threePhase" },
            { label: "MD", id: "md" },
        ],
    },
    {
        title: "Meter Type",
        options: [
            { label: "Prepaid", id: "prepaid" },
            { label: "Postpaid", id: "postPaid" },
        ],
    },
];

// Sample data type
interface MeterData {
    id: number;
    meterNumber: string;
    manufactureName: string;
    class: string;
    meterId: string;
    meterType: string;
    category: string;
    dateAdded: string;
    status: "Approved" | "Pending";
}

// Sample data
const initialMeters: MeterData[] = [
    { id: 1, meterNumber: "61245269523", manufactureName: "Momas", class: "MD", meterId: "Ojoo", meterType: "Electricity", category: "Prepaid", dateAdded: "09-04-2025", status: "Approved" },
    { id: 2, meterNumber: "61245269524", manufactureName: "Momas", class: "Single Phase", meterId: "Ojoo", meterType: "Electricity", category: "Prepaid", dateAdded: "09-04-2025", status: "Pending" },
    { id: 3, meterNumber: "61245269525", manufactureName: "Momas", class: "Three Phase", meterId: "Ojoo", meterType: "Gas", category: "Prepaid", dateAdded: "09-04-2025", status: "Approved" },
    { id: 4, meterNumber: "61245269526", manufactureName: "Momas", class: "MD", meterId: "Ojoo", meterType: "Electricity", category: "Postpaid", dateAdded: "09-04-2025", status: "Approved" },
    { id: 5, meterNumber: "61245269527", manufactureName: "Momas", class: "Single Phase", meterId: "Ojoo", meterType: "Water", category: "Prepaid", dateAdded: "09-04-2025", status: "Pending" },
    { id: 6, meterNumber: "61245269528", manufactureName: "Momas", class: "Three Phase", meterId: "Ojoo", meterType: "Electricity", category: "Prepaid", dateAdded: "09-04-2025", status: "Approved" },
    { id: 7, meterNumber: "61245269529", manufactureName: "Mojec", class: "MD", meterId: "Ojoo", meterType: "Electricity", category: "Postpaid", dateAdded: "09-04-2025", status: "Pending" },
    { id: 8, meterNumber: "61245269530", manufactureName: "Mojec", class: "Single Phase", meterId: "Ojoo", meterType: "Electricity", category: "Postpaid", dateAdded: "09-04-2025", status: "Approved" },
    { id: 9, meterNumber: "61245269531", manufactureName: "Mojec", class: "Three Phase", meterId: "Ojoo", meterType: "Electricity", category: "Postpaid", dateAdded: "09-04-2025", status: "Pending" },
    { id: 10, meterNumber: "61245269532", manufactureName: "Heixing", class: "MD", meterId: "Ojoo", meterType: "Electricity", category: "Postpaid", dateAdded: "09-04-2025", status: "Approved" },
    { id: 11, meterNumber: "61245269533", manufactureName: "Heixing", class: "Single Phase", meterId: "Ojoo", meterType: "Electricity", category: "Postpaid", dateAdded: "09-04-2025", status: "Pending" },
];

export default function AllocateMetersPage() {
    const [meters, setMeters] = useState<MeterData[]>(initialMeters);
    const [selectedMeters, setSelectedMeters] = useState<number[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [, setIsDialogOpen] = useState(false);
    const [selectedMeter, setSelectedMeter] = useState<MeterData | null>(null);
    const [organizationId, setOrganizationId] = useState<string>("");
    const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
    const [bulkOrganizationId, setBulkOrganizationId] = useState<string>("");
    const [meterNumberInput, setMeterNumberInput] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");

    // Add state for active filters
    // const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({});

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedMeters(meters.map((meter) => meter.id));
        } else {
            setSelectedMeters([]);
        }
    };

    const handleSelectItem = (checked: boolean, id: number) => {
        if (checked) {
            setSelectedMeters([...selectedMeters, id]);
        } else {
            setSelectedMeters(selectedMeters.filter((meterId) => meterId !== id));
        }
    };

    const isAllSelected = meters.length > 0 && selectedMeters.length === meters.length;

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentMeters = meters.slice(startIndex, endIndex);
    const totalPages = Math.ceil(meters.length / rowsPerPage);

    const onRowsPerPageChange = (value: number) => {
        setRowsPerPage(value);
        setCurrentPage(1); // Reset to first page when rows per page changes
    };

    const onPageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const handleMeterNumberChange = (value: string) => {
        setMeterNumberInput(value);
        const meter = meters.find((m) => m.meterNumber === value);
        setSelectedMeter(meter ?? null);
    };

    const handleAllocate = () => {
        console.log("handleAllocate called with:", { selectedMeter, organizationId }); // Debugging
        if (!selectedMeter) {
            alert("Please select a valid meter number.");
            return;
        }
        if (!organizationId) {
            alert("Please select an Organization ID.");
            return;
        }
        console.log("Allocated:", { meterNumber: selectedMeter.meterNumber, organizationId });
        setMeters(meters.filter((meter) => meter.id !== selectedMeter.id));
        setSelectedMeters(selectedMeters.filter((id) => id !== selectedMeter.id));
        setIsDialogOpen(false);
        setOrganizationId("");
        setMeterNumberInput("");
        setSelectedMeter(null);
    };

    const handleBulkAllocate = () => {
        if (selectedMeters.length === 0) {
            alert("Please select at least one meter to allocate.");
            return;
        }
        if (!bulkOrganizationId) {
            alert("Please select an Organization ID for bulk allocation.");
            return;
        }
        console.log("Bulk Allocated:", { selectedMeters, organizationId: bulkOrganizationId });
        setMeters(meters.filter((meter) => !selectedMeters.includes(meter.id)));
        setSelectedMeters([]);
        setIsBulkDialogOpen(false);
        setBulkOrganizationId("");
        const totalPages = Math.ceil((meters.length - selectedMeters.length) / rowsPerPage);
        if (currentPage > totalPages) {
            setCurrentPage(totalPages ?? 1);
        }
    };

    // Add these state variables
    const [sortConfig, setSortConfig] = useState<{
        key: keyof MeterData | null;
        direction: "asc" | "desc";
    }>({ key: null, direction: "asc" });

    useEffect(() => {
        setMeters(initialMeters);
    }, []);

    // Enhanced search handler
    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
        applyFiltersAndSort(term, sortConfig.key, sortConfig.direction);
    };

    // Sort handler
    const handleSortChange = () => {
        const sortKey: keyof MeterData = sortConfig.key ?? "meterNumber";
        const newDirection = sortConfig.direction === "asc" ? "desc" : "asc";

        setSortConfig({ key: sortKey, direction: newDirection });
        applyFiltersAndSort(searchTerm, sortKey, newDirection);
    };

    // Combined filter and sort function
    const applyFiltersAndSort = (
        term: string,
        sortBy: keyof MeterData | null,
        direction: "asc" | "desc"
    ) => {
        // 1. Filter first
        let results = initialMeters;
        if (term.trim() !== "") {
            results = initialMeters.filter(item =>
                item.meterNumber?.toLowerCase().includes(term.toLowerCase()) ??
                item.manufactureName?.toLowerCase().includes(term.toLowerCase()) ??
                item.meterId?.toLowerCase().includes(term.toLowerCase()) ??
                item.category?.toLowerCase().includes(term.toLowerCase())
            );
        }

        // 2. Then sort if a sort field is selected
        if (sortBy) {
            results = [...results].sort((a, b) => {
                const aValue = a[sortBy] ?? "";
                const bValue = b[sortBy] ?? "";

                if (aValue < bValue) return direction === "asc" ? -1 : 1;
                if (aValue > bValue) return direction === "asc" ? 1 : -1;
                return 0;
            });
        }

        setMeters(results);
    };

    // Moved setActiveFilters logic outside of return
    const handleSetActiveFilters = (filters: Record<string, boolean>) => {
        // Reset to first page when filters change
        setCurrentPage(1);

        let filtered = initialMeters;

        // Apply search filter if term exists
        if (searchTerm.trim() !== "") {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(meter =>
                meter.meterNumber.toLowerCase().includes(term) ??
                meter.manufactureName.toLowerCase().includes(term) ??
                meter.meterId.toLowerCase().includes(term) ??
                meter.category.toLowerCase().includes(term)
            );
        }

        // Apply other filters
        filtered = filtered.filter((meter) => {
            // Meter Class filter
            const classMatch =
                (!filters.singlePhase && !filters.threePhase && !filters.md) ??
                (filters.singlePhase && meter.class.toLowerCase().includes("single phase")) ??
                (filters.threePhase && meter.class.toLowerCase().includes("three phase")) ??
                (filters.md && meter.class.toLowerCase().includes("md"));

            // Meter Type filter
            const typeMatch =
                (!filters.prepaid && !filters.postPaid) ??
                (filters.prepaid && meter.category.toLowerCase() === "prepaid") ??
                (filters.postPaid && meter.category.toLowerCase() === "postpaid");

            return classMatch && typeMatch;
        });

        // Apply sorting
        if (sortConfig.key) {
            filtered = [...filtered].sort((a, b) => {
                const aValue = a[sortConfig.key!] ?? "";
                const bValue = b[sortConfig.key!] ?? "";
                if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
            });
        }

        setMeters(filtered);
    };

    return (
        <div className="p-6 h-fit">
            <div className="flex items-center justify-between mb-4">
                <ContentHeader title="Allocate Meters" description="Manage and access meter allocation." />
                <Button
                    size="lg"
                    className="bg-[#161CCA] text-white text-md font-semibold rounded-md shadow-sm hover:translate-0.5 cursor-pointer transition-transform duration-200 ease-in-out active:scale-95"
                    onClick={() => setIsBulkDialogOpen(true)}
                    disabled={selectedMeters.length === 0}
                >
                    <CirclePlus size={14} strokeWidth={2.5} className="mr-2" />
                    Bulk Allocate Meter
                </Button>
            </div>

            <Card className="p-4 mb-4 border-none shadow-none bg-white">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative w-full md:w-[300px]">
                            <Search
                                size={14}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                            />
                            <Input
                                type="text"
                                placeholder="Search by meter no., account no..."
                                className="pl-10 w-full border-gray-300 focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50"
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                            />
                        </div>
                        <FilterControl
                            sections={filterSections}
                            onApply={(filters) => handleSetActiveFilters(filters)}
                            onReset={() => handleSetActiveFilters({})}
                        />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="gap-2 border-gray-300 w-full sm:w-auto">
                                    <ArrowUpDown className="text-gray-500" size={14} />
                                    <span className="hidden sm:inline text-gray-800">Sort</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem
                                    onClick={handleSortChange}
                                    className="text-sm cursor-pointer hover:bg-gray-100"
                                >
                                    Z-A
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={handleSortChange}
                                    className="text-sm cursor-pointer hover:bg-gray-100"
                                >
                                    A-Z
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={handleSortChange}
                                    className="text-sm cursor-pointer hover:bg-gray-100"
                                >
                                    Newest-Oldest
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={handleSortChange}
                                    className="text-sm cursor-pointer hover:bg-gray-100"
                                >
                                    Oldest-Newest
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className="flex items-center gap-4 py-4">
                    <div className="flex-1">
                        <Label htmlFor="meterNumber" className="text-sm font-medium mb-2 text-gray-700">
                            Meter Number
                        </Label>
                        <Input
                            id="meterNumber"
                            value={meterNumberInput}
                            onChange={(e) => handleMeterNumberChange(e.target.value)}
                            placeholder="Enter Meter Number"
                            className="w-full border-gray-300 focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50"
                        />
                    </div>
                    <div className="flex items-center justify-center">
                        <ArrowRightLeft
                            className="text-white bg-green-500 p-1 rounded-full cursor-pointer"
                            size={18}
                            strokeWidth={2.75}
                            onClick={handleAllocate}
                        />
                    </div>
                    <div className="flex-1">
                        <Label htmlFor="organizationId" className="text-sm font-medium mb-2 text-gray-700">
                            Organization ID <span className="text-red-500">*</span>
                        </Label>
                        <Select value={organizationId} onValueChange={setOrganizationId}>
                            <SelectTrigger className="w-full border-gray-300 focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50">
                                <SelectValue placeholder="Select Organization ID" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Ojoo">Ojoo</SelectItem>
                                <SelectItem value="Molete">Molete</SelectItem>
                                <SelectItem value="Ibadan">Ibadan</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </Card>

            <Card className="rounded-md h-4/6 border-none">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px] px-4 py-3 text-left">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        className="border-gray-500"
                                        checked={isAllSelected}
                                        onCheckedChange={handleSelectAll}
                                        aria-label="Select all meters"
                                    />
                                    <Label htmlFor="select-all" className="text-sm font-semibold text-gray-700">
                                        S/N
                                    </Label>
                                </div>
                            </TableHead>
                            <TableHead>Meter Number</TableHead>
                            <TableHead>Manufacture</TableHead>
                            <TableHead>Class</TableHead>
                            <TableHead>ID</TableHead>
                            <TableHead>Meter Type</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Date Added</TableHead>
                            <TableHead>Approval Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentMeters.map((meter, index) => (
                            <TableRow key={meter.id}>
                                <TableCell className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            className="border-gray-500"
                                            checked={selectedMeters.includes(meter.id)}
                                            onCheckedChange={(checked) => handleSelectItem(checked as boolean, meter.id)}
                                            aria-label={`Select meter ${meter.meterNumber}`}
                                        />
                                        <span className="text-sm text-gray-900">
                                            {index + 1 + (currentPage - 1) * rowsPerPage}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>{meter.meterNumber}</TableCell>
                                <TableCell>{meter.manufactureName}</TableCell>
                                <TableCell>{meter.class}</TableCell>
                                <TableCell>{meter.meterId}</TableCell>
                                <TableCell>{meter.meterType}</TableCell>
                                <TableCell>{meter.category}</TableCell>
                                <TableCell>{meter.dateAdded}</TableCell>
                                <TableCell>
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${meter.status === "Pending" ? "bg-[#FFF5EA] text-[#C86900]" : "bg-[#E9F6FF] text-[#161CCA]"}`}
                                    >
                                        {meter.status}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                        {currentMeters.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center py-4 text-gray-500">
                                    No meters found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            <div className="flex flex-col sm:flex-row justify-between items-center py-3 px-4 sm:py-4 sm:px-6 text-xs sm:text-sm text-gray-600 gap-3 sm:gap-0">
                <div className="flex items-center gap-2 justify-between sm:justify-start">
                    <span className="whitespace-nowrap">Rows per page</span>
                    <select
                        value={rowsPerPage}
                        onChange={(e) => onRowsPerPageChange(parseInt(e.target.value))}
                        className="w-16 border-gray-300 text-sm rounded-md focus:ring-[#161CCA]/50 focus:border-[#161CCA]/30"
                    >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                        disabled={currentPage === 1}
                        className="cursor-pointer px-2 sm:px-3"
                    >
                        Previous
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                        disabled={currentPage === totalPages || meters.length === 0}
                        className="cursor-pointer px-2 sm:px-3 text-gray-400"
                    >
                        Next
                    </Button>
                </div>
            </div>


            {/* Bulk Allocation Dialog */}
            <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
                <DialogContent className="sm:max-w-[350px] h-fit bg-white rounded-lg shadow-lg">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold text-gray-900">Bulk Allocate Meter</DialogTitle>
                    </DialogHeader>
                    <div className="gap-4 py-4">
                        <div className="items-center w-full gap-4">
                            <Label htmlFor="bulkOrganizationId" className="text-sm mb-3 font-medium text-gray-700">
                                Organization ID <span className="text-red-500">*</span>
                            </Label>
                            <Select value={bulkOrganizationId} onValueChange={setBulkOrganizationId}>
                                <SelectTrigger className="w-full border-gray-300 focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50">
                                    <SelectValue placeholder="Select Organization ID" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Ojoo">Ojoo</SelectItem>
                                    <SelectItem value="Molete">Molete</SelectItem>
                                    <SelectItem value="Ibadan">Ibadan</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsBulkDialogOpen(false)}
                            className="mr-2 bg-transparent text-[#161CCA] border-[#161CCA]"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleBulkAllocate}
                            className="bg-[#161CCA] text-white hover:bg-[#161CCA]/90"
                        >
                            Allocate
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}