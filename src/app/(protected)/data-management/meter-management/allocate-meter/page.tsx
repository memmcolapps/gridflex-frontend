// app/allocate-meters/page.tsx
"use client";

import React, { useState } from "react";
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
import { Filter, CirclePlus } from "lucide-react";
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

// Sample data type
interface MeterData {
    id: number;
    meterNumber: string;
    manufactureName: string;
    model: string;
    meterId: string;
    meterType: string;
    category: string;
    dateAdded: string;
    actions: string;
}

// Sample data
const initialMeters: MeterData[] = [
    { id: 1, meterNumber: "61245269523", manufactureName: "Momas", model: "Mem 3-ph", meterId: "Ojoo", meterType: "Electricity", category: "Prepaid", dateAdded: "09-04-2025", actions: "" },
    { id: 2, meterNumber: "61245269523", manufactureName: "Momas", model: "Mem 3-ph", meterId: "Ojoo", meterType: "Electricity", category: "Prepaid", dateAdded: "09-04-2025", actions: "" },
    { id: 3, meterNumber: "61245269523", manufactureName: "Momas", model: "Mem 3-ph", meterId: "Ojoo", meterType: "Gas", category: "Prepaid", dateAdded: "09-04-2025", actions: "" },
    { id: 4, meterNumber: "61245269523", manufactureName: "Momas", model: "Mem 1-ph", meterId: "Ojoo", meterType: "Electricity", category: "Postpaid", dateAdded: "09-04-2025", actions: "" },
    { id: 5, meterNumber: "61245269523", manufactureName: "Momas", model: "Mem 1-ph", meterId: "Ojoo", meterType: "Water", category: "Prepaid", dateAdded: "09-04-2025", actions: "" },
    { id: 6, meterNumber: "61245269523", manufactureName: "Momas", model: "Mem 1-ph", meterId: "Ojoo", meterType: "Electricity", category: "Prepaid", dateAdded: "09-04-2025", actions: "" },
    { id: 7, meterNumber: "61245269523", manufactureName: "Mojec", model: "Mem 3-ph", meterId: "Ojoo", meterType: "Electricity", category: "Postpaid", dateAdded: "09-04-2025", actions: "" },
    { id: 8, meterNumber: "61245269523", manufactureName: "Mojec", model: "Mem 3-ph", meterId: "Ojoo", meterType: "Electricity", category: "Postpaid", dateAdded: "09-04-2025", actions: "" },
    { id: 9, meterNumber: "61245269523", manufactureName: "Mojec", model: "Mem 1-ph", meterId: "Ojoo", meterType: "Electricity", category: "Postpaid", dateAdded: "09-04-2025", actions: "" },
    { id: 10, meterNumber: "61245269523", manufactureName: "Heixing", model: "Mem 3-ph", meterId: "Ojoo", meterType: "Electricity", category: "Postpaid", dateAdded: "09-04-2025", actions: "" },
    { id: 11, meterNumber: "61245269523", manufactureName: "Heixing", model: "Mem 3-ph", meterId: "Ojoo", meterType: "Electricity", category: "Postpaid", dateAdded: "09-04-2025", actions: "" },
];

export default function AllocateMetersPage() {
    const [meters, setMeters] = useState<MeterData[]>(initialMeters); // Made mutable to allow deletion
    const [selectedMeters, setSelectedMeters] = useState<number[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedMeter, setSelectedMeter] = useState<MeterData | null>(null);
    const [organizationId, setOrganizationId] = useState<string>("");
    const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
    const [bulkOrganizationId, setBulkOrganizationId] = useState<string>("");

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

    const handleAllocate = () => {
        if (selectedMeter && organizationId) {
            console.log("Allocated:", { meterNumber: selectedMeter.meterNumber, organizationId });
            // Remove the allocated meter from the table
            setMeters(meters.filter((meter) => meter.id !== selectedMeter.id));
            setSelectedMeters(selectedMeters.filter((id) => id !== selectedMeter.id));
            setIsDialogOpen(false);
            setOrganizationId("");
        } else {
            alert("Please select an Organization ID.");
        }
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
        // Remove the selected meters from the table
        setMeters(meters.filter((meter) => !selectedMeters.includes(meter.id)));
        setSelectedMeters([]);
        setIsBulkDialogOpen(false);
        setBulkOrganizationId("");
        // Adjust current page if necessary
        const totalPages = Math.ceil((meters.length - selectedMeters.length) / rowsPerPage);
        if (currentPage > totalPages) {
            setCurrentPage(totalPages || 1);
        }
    };

    return (
        <div className="p-6 h-screen">
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
                            />
                        </div>
                        <Button variant="outline" className="gap-2 border-gray-300">
                            <Filter className="text-gray-500" size={14} />
                            <span className="text-gray-800">Filter</span>
                        </Button>
                        <Button variant="outline" className="gap-2 border-gray-300">
                            <ArrowUpDown className="text-gray-500" size={14} />
                            <span className="text-gray-800">Sort</span>
                        </Button>
                    </div>
                </div>
            </Card>

            <div className="bg-white rounded-md h-4/6 shadow-sm border border-gray-200">
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
                            <TableHead>Meter Number <span className="text-red-500">*</span></TableHead>
                            <TableHead>Manufacture Name</TableHead>
                            <TableHead>Model</TableHead>
                            <TableHead>ID</TableHead>
                            <TableHead>Meter Type</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Date Added</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
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
                                <TableCell>{meter.model}</TableCell>
                                <TableCell>{meter.meterId}</TableCell>
                                <TableCell>{meter.meterType}</TableCell>
                                <TableCell>{meter.category}</TableCell>
                                <TableCell>{meter.dateAdded}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            setSelectedMeter(meter);
                                            setIsDialogOpen(true);
                                        }}
                                    >
                                        <ArrowRightLeft size={16} strokeWidth={2.5} className="text-gray-600" />
                                    </Button>
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
            </div>

            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>Rows per page:</span>
                    <Select value={rowsPerPage.toString()} onValueChange={(value) => setRowsPerPage(parseInt(value))}>
                        <SelectTrigger className="w-[80px] focus:ring-gray-300 border-gray-300">
                            <SelectValue placeholder={rowsPerPage.toString()} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                    </Select>
                    <span>{`${startIndex + 1}-${Math.min(endIndex, meters.length)} of ${meters.length} row${meters.length !== 1 ? "s" : ""}`}</span>
                </div>
            </div>

            {/* Single Meter Allocation Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-fit h-auto p-8 bg-white rounded-lg shadow-lg">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold text-gray-900">Allocate Meter</DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center gap-4 py-4">
                        <div className="flex-1">
                            <Label htmlFor="meterNumber" className="text-sm font-medium mb-2 text-gray-700">
                                Meter Number <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="meterNumber"
                                value={selectedMeter?.meterNumber ?? ""}
                                disabled
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
                </DialogContent>
            </Dialog>

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
                            <Select
                                value={bulkOrganizationId}
                                onValueChange={setBulkOrganizationId}
                                // className="col-span-3"
                            >
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