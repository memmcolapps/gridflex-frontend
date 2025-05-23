"use client";

import { ContentHeader } from "@/components/ui/content-header";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import {
    Filter,
    ArrowUpDown,
    CirclePlus,
    Search,
    Check,
    SquareArrowOutUpRight,
    ChevronUp,
    MoreVertical,
    Ban,
    Link,
    CircleCheck,
    Pencil,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AddMeterDialog } from "@/components/meter-management/add-edit-meter-dialog";
import { ApproveDialog, AssignDialog, DeactivateDialog } from "@/components/meter-management/meter-dialogs";
import { BulkUploadDialog } from "@/components/meter-management/bulk-upload";

export default function MeterManagementPage() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedTariffs, setSelectedTariffs] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rowsPerPage, setRowsPerPage] = useState<number>(12);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isBulkUploadDialogOpen, setIsBulkUploadDialogOpen] = useState(false);
    const [editMeter, setEditMeter] = useState<MeterData | undefined>(undefined);
    const [data, setData] = useState<MeterData[]>([]);
    const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
    const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
    const [selectedMeter, setSelectedMeter] = useState<MeterData | null>(null);

    interface MeterData {
        meterNumber: string;
        simNumber: string;
        model: string;
        accountNumber: string;
        sgc: string;
        tariff: string;
        id: string;
        approvalStatus: string;
        status: string;
    }

    const toggleSelection = (id: string) => {
        setSelectedTariffs(
            selectedTariffs.includes(id)
                ? selectedTariffs.filter((selectedId) => selectedId !== id)
                : [...selectedTariffs, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedTariffs.length === data.length) {
            setSelectedTariffs([]);
        } else {
            setSelectedTariffs(data.map((item) => item.id));
        }
    };

    const handleSaveMeter = (updatedMeter: MeterData) => {
        if (editMeter) {
            setData((prev) =>
                prev.map((meter) => (meter.id === updatedMeter.id ? updatedMeter : meter))
            );
            setEditMeter(undefined);
        } else {
            setData((prev) => [...prev, updatedMeter]);
        }
    };

    // Removed unused handleEditMeter function

    const handleDeactivate = (reason: string) => {
        if (selectedMeter) {
            setData((prev) =>
                prev.map((meter) =>
                    meter.id === selectedMeter.id ? { ...meter, status: "Deactivated", reason } : meter
                )
            );
        }
    };

    const handleApprove = () => {
        if (selectedMeter) {
            setData((prev) =>
                prev.map((meter) =>
                    meter.id === selectedMeter.id ? { ...meter, approvalStatus: "Approved" } : meter
                )
            );
        }
    };

    const handleAssign = (data: {
        firstName: string;
        lastName: string;
        accountNumber: string;
        nin: string;
        phone: string;
        email: string;
        state: string;
        city: string;
        streetName: string;
        houseNo: string;
    }) => {
        if (selectedMeter) {
            setData((prev) =>
                prev.map((meter) =>
                    meter.id === selectedMeter.id ? { ...meter, status: "Assigned", ...data } : meter
                )
            );
        }
    };

    const handleBulkApprove = () => {
        const updatedData = data.map((meter) => {
            if (selectedTariffs.includes(meter.id) && meter.approvalStatus !== "Approved") {
                return { ...meter, approvalStatus: "Approved" };
            }
            return meter;
        });
        setData(updatedData);
        setSelectedTariffs([]);
    };

    const handleBulkUpload = (newData: MeterData[]) => {
        setData((prev) => [...prev, ...newData]);
    };

    const isBulkApproveDisabled = selectedTariffs.length === 0 || data.every((meter) => selectedTariffs.includes(meter.id) && meter.approvalStatus === "Approved");

    const totalPages = Math.ceil(data.length / rowsPerPage);
    const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    return (
        <div className="p-6 h-screen overflow-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <ContentHeader
                    title="Meters"
                    description="Manage and Access All Meter Records."
                />
                <div className="flex flex-col md:flex-row gap-2">
                    <Button
                        className="flex items-center gap-2 border font-medium border-[#161CCA] text-[#161CCA] w-full md:w-auto"
                        variant="outline"
                        size="lg"
                        onClick={() => setIsBulkUploadDialogOpen(true)}
                    >
                        <CirclePlus size={14} strokeWidth={2.3} className="h-4 w-4" />
                        <span className="text-sm md:text-base">Bulk Upload</span>
                    </Button>
                    <Button
                        className="flex items-center gap-2 bg-[#161CCA] text-white font-medium w-full md:w-auto"
                        variant="secondary"
                        size="lg"
                        onClick={() => {
                            setEditMeter(undefined);
                            setIsAddDialogOpen(true);
                        }}
                    >
                        <CirclePlus size={14} strokeWidth={2.3} className="h-4 w-4" />
                        <span className="text-sm md:text-base">Add New Meter</span>
                    </Button>
                </div>
            </div>

            {/* Search and Filter Section */}
            <Card className="p-4 mb-4 border-none shadow-none bg-white">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 w-full lg:w-auto">
                        <div className="relative w-full lg:w-[300px]">
                            <Search
                                size={14}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                            />
                            <Input
                                type="text"
                                placeholder="Search by meter no., account no..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-full border-gray-300 focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50 text-sm lg:text-base"
                            />
                        </div>
                        <Button variant="outline" className="gap-2 border-gray-300 w-full lg:w-auto">
                            <Filter className="text-gray-500" size={14} />
                            <span className="text-gray-800 text-sm lg:text-base">Filter</span>
                        </Button>
                        <Button variant="outline" className="gap-2 border-gray-300 w-full lg:w-auto">
                            <ArrowUpDown className="text-gray-500" size={14} />
                            <span className="text-gray-800 text-sm lg:text-base">Sort</span>
                        </Button>
                    </div>
                    <div className="flex gap-2 w-full lg:w-auto">
                        <Button
                            variant="secondary"
                            size="lg"
                            className="gap-2 bg-[#22C55E] text-white font-medium w-full lg:w-auto"
                            onClick={handleBulkApprove}
                            disabled={isBulkApproveDisabled}
                        >
                            <Check className="text-white" size={15} strokeWidth={2.3} />
                            <span className="text-sm lg:text-base font-medium">Bulk Approve</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="gap-2 border border-[#161CCA] text-[#161CCA] font-medium w-full lg:w-auto"
                        >
                            <SquareArrowOutUpRight className="text-[#161CCA]" size={15} strokeWidth={2.3} />
                            <span className="text-sm lg:text-base font-medium">Export</span>
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Table */}
            <Card className="border-none shadow-none bg-white overflow-x-auto min-h-[calc(100vh-300px)]">
                <Table className="table-fixed w-full">
                    <TableHeader>
                        <TableRow className="bg-gray-50 hover:bg-gray-50">
                            <TableHead className="w-[80px] px-4 py-3 text-left">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        className="h-4 w-4 border-gray-500"
                                        id="select-all"
                                        checked={data.length > 0 && selectedTariffs.length === data.length}
                                        onCheckedChange={toggleSelectAll}
                                    />
                                    <Label htmlFor="select-all" className="text-sm lg:text-base font-semibold text-gray-700">
                                        S/N
                                    </Label>
                                </div>
                            </TableHead>
                            <TableHead className="min-w-[120px] px-4 py-3 text-left text-sm lg:text-base font-semibold text-gray-700">
                                Meter Number
                            </TableHead>
                            <TableHead className="min-w-[100px] px-4 py-3 text-left text-sm lg:text-base font-semibold text-gray-700">
                                SIM No
                            </TableHead>
                            <TableHead className="min-w-[80px] px-4 py-3 text-left text-sm lg:text-base font-semibold text-gray-700">
                                Meter Type
                            </TableHead>
                            <TableHead className="min-w-[100px] px-4 py-3 text-left text-sm lg:text-base font-semibold text-gray-700">
                                Manufacturer
                            </TableHead>
                            <TableHead className="min-w-[80px] px-4 py-3 text-left text-sm lg:text-base font-semibold text-gray-700">
                                Class
                            </TableHead>
                            <TableHead className="min-w-[80px] px-4 py-3 text-left text-sm lg:text-base font-semibold text-gray-700">
                                Category
                            </TableHead>
                            <TableHead className="min-w-[120px] px-4 py-3 text-left text-sm lg:text-base font-semibold text-gray-700">
                                <div className="flex items-center gap-1">
                                    Approval Status
                                    <ChevronUp size={14} className="text-gray-500" />
                                </div>
                            </TableHead>
                            <TableHead className="min-w-[100px] px-4 py-3 text-left text-sm lg:text-base font-semibold text-gray-700">
                                <div className="flex items-center gap-1">
                                    Status
                                    <ChevronUp size={14} className="text-gray-500" />
                                </div>
                            </TableHead>
                            <TableHead className="min-w-[80px] px-4 py-3 text-right text-sm lg:text-base font-semibold text-gray-700">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={11} className="h-24 text-center text-sm lg:text-base text-gray-500">
                                    No data available
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedData.map((item, index) => (
                                <TableRow key={item.id} className="hover:bg-gray-50">
                                    <TableCell className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                className="border-gray-500"
                                                id={`select-${item.id}`}
                                                checked={selectedTariffs.includes(item.id)}
                                                onCheckedChange={() => toggleSelection(item.id)}
                                            />
                                            <span className="text-sm lg:text-base text-gray-900">
                                                {index + 1 + (currentPage - 1) * rowsPerPage}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-sm lg:text-base text-gray-900">{item.meterNumber}</TableCell>
                                    <TableCell className="px-4 py-3 text-sm lg:text-base text-gray-900">{item.simNumber}</TableCell>
                                    <TableCell className="px-4 py-3 text-sm lg:text-base text-gray-900">{item.model}</TableCell>
                                    <TableCell className="px-4 py-3 text-sm lg:text-base text-gray-900">{item.accountNumber}</TableCell>
                                    <TableCell className="px-4 py-3 text-sm lg:text-base text-gray-900">{item.sgc}</TableCell>
                                    <TableCell className="px-4 py-3 text-sm lg:text-base text-gray-900">{item.tariff}</TableCell>
                                    <TableCell className="px-4 py-3 text-sm lg:text-base text-gray-900">{item.id}</TableCell>
                                    <TableCell className="px-4 py-3">
                                        {item.approvalStatus === "Approved" ? (
                                            <span className="text-green-600 font-medium text-sm lg:text-base">Approved</span>
                                        ) : item.approvalStatus === "Rejected" ? (
                                            <span className="text-red-600 font-medium text-sm lg:text-base">Rejected</span>
                                        ) : item.approvalStatus === "Pending" ? (
                                            <span className="text-orange-500 font-medium text-sm lg:text-base">Pending</span>
                                        ) : (
                                            <span className="text-sm lg:text-base text-gray-900">{item.approvalStatus}</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        {item.status === "Assigned" ? (
                                            <span className="text-green-600 font-medium text-sm lg:text-base">Assigned</span>
                                        ) : item.status === "In-Stock" ? (
                                            <span className="text-blue-600 font-medium text-sm lg:text-base">In-Stock</span>
                                        ) : item.status === "Deactivated" ? (
                                            <span className="text-red-600 font-medium text-sm lg:text-base">Deactivated</span>
                                        ) : (
                                            <span className="text-sm lg:text-base text-gray-900">{item.status}</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="border-gray-500 focus:ring-gray-500">
                                                    <MoreVertical size={16} className="text-gray-500" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 bg-white shadow-lg">
                                                <DropdownMenuItem
                                                    className="flex items-center gap-2"
                                                    onClick={() => {
                                                        setSelectedMeter(item);
                                                        setEditMeter(item);
                                                        setIsAddDialogOpen(true);
                                                    }}
                                                >
                                                    <Pencil size={14} className="text-gray-500" />
                                                    <span className="text-sm lg:text-base text-gray-700">Edit Meter</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="flex items-center gap-2"
                                                    onClick={() => {
                                                        setSelectedMeter(item);
                                                        setIsApproveDialogOpen(true);
                                                    }}
                                                    disabled={item.approvalStatus === "Approved"}
                                                >
                                                    <CircleCheck size={10} className="text-gray-500" />
                                                    <span className="text-sm lg:text-base text-gray-700">Approve</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="flex items-center gap-2"
                                                    onClick={() => {
                                                        setSelectedMeter(item);
                                                        setIsAssignDialogOpen(true);
                                                    }}
                                                    disabled={item.status === "Assigned"}
                                                >
                                                    <Link size={16} className="text-gray-500" />
                                                    <span className="text-sm lg:text-base text-gray-700">Assign</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="flex items-center gap-2"
                                                    onClick={() => {
                                                        setSelectedMeter(item);
                                                        setIsDeactivateDialogOpen(true);
                                                    }}
                                                    disabled={item.status === "Deactivated"}
                                                >
                                                    <Ban size={16} className="text-gray-500" />
                                                    <span className="text-sm lg:text-base text-gray-700">Deactivate</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Pagination */}
            <div className="flex justify-between items-center py-4 px-6 text-sm lg:text-base text-gray-600">
                <div className="flex items-center gap-2">
                    <span>Rows per page</span>
                    <select
                        value={rowsPerPage}
                        onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
                        className="w-16 border-gray-300 rounded-md text-sm lg:text-base"
                    >
                        <option value="12">12</option>
                        <option value="24">24</option>
                        <option value="48">48</option>
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <span>
                        {data.length > 0 ? `1-${paginatedData.length} of ${data.length}` : "0-0 of 0"} rows
                    </span>
                    <Button
                        className="cursor-pointer"
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="cursor-pointer"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages || data.length === 0}
                    >
                        Next
                    </Button>
                </div>
            </div>

            <AddMeterDialog
                isOpen={isAddDialogOpen}
                onClose={() => {
                    setIsAddDialogOpen(false);
                    setEditMeter(undefined);
                    setSelectedMeter(null);
                }}
                onSaveMeter={handleSaveMeter}
                editMeter={editMeter}
            />

            <DeactivateDialog
                isOpen={isDeactivateDialogOpen}
                onClose={() => setIsDeactivateDialogOpen(false)}
                onDeactivate={handleDeactivate}
                meterNumber={selectedMeter?.meterNumber ?? ""}
            />

            <ApproveDialog
                isOpen={isApproveDialogOpen}
                onClose={() => setIsApproveDialogOpen(false)}
                onApprove={handleApprove}
                meterNumber={selectedMeter?.meterNumber ?? ""}
            />

            <AssignDialog
                isOpen={isAssignDialogOpen}
                onClose={() => setIsAssignDialogOpen(false)}
                onAssign={handleAssign}
                meterNumber={selectedMeter?.meterNumber ?? ""}
            />

            <BulkUploadDialog
                isOpen={isBulkUploadDialogOpen}
                onClose={() => setIsBulkUploadDialogOpen(false)}
                onSave={handleBulkUpload}
            />
        </div>
    );
}