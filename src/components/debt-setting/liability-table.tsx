import type { ColumnDef } from "@tanstack/react-table";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "../ui/card";
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
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ArrowUpDown, Ban, CircleCheck, CircleX, EllipsisVertical, Pencil, Search, AlertTriangle } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type Liability = {
    sNo: number;
    liabilityName: string;
    liabilityCode: string;
    approvalStatus: "Pending" | "Rejected" | "Approved";
    deactivated?: boolean;
};

type PercentageRange = {
    sNo: number;
    percentage: string;
    percentageCode: string;
    band: string;
    amountStartRange: string;
    amountEndRange: string;
    approvalStatus: "Pending" | "Rejected" | "Approved";
    deactivated?: boolean;
};

type TableData = (Liability | PercentageRange) & { deactivated?: boolean };

type LiabilityTableProps = {
    view: "liability" | "percentage";
    onViewChange: (view: "liability" | "percentage") => void;
    onDataChange?: (data: TableData[]) => void; // Callback to send updated data to parent
    onAddPercentageRange?: (range: { percentage: string; percentageCode: string; band: string; amountStartRange: string; amountEndRange: string }) => void;
};

// Sample data for Liability Cause table
const defaultLiabilityData: Liability[] = [
    { sNo: 1, liabilityName: "Loan Default", liabilityCode: "LD001", approvalStatus: "Pending", deactivated: false },
    { sNo: 2, liabilityName: "Overdraft", liabilityCode: "OD002", approvalStatus: "Approved", deactivated: false },
    { sNo: 3, liabilityName: "Credit Card Debt", liabilityCode: "CC003", approvalStatus: "Rejected", deactivated: false },
    { sNo: 4, liabilityName: "Mortgage", liabilityCode: "MG004", approvalStatus: "Approved", deactivated: false },
];

// Sample data for Percentage Range table
const defaultPercentageData: PercentageRange[] = [
    { sNo: 1, percentage: "2%", percentageCode: "C90bqt", band: "Band A", amountStartRange: "0", amountEndRange: "9,999", approvalStatus: "Pending", deactivated: true },
    { sNo: 2, percentage: "5%", percentageCode: "C90bqt", band: "Band A", amountStartRange: "10,000", amountEndRange: "99,999", approvalStatus: "Approved", deactivated: false },
    { sNo: 3, percentage: "10%", percentageCode: "C90bqt", band: "Band A", amountStartRange: "100,000", amountEndRange: "999,999", approvalStatus: "Approved", deactivated: false },
    { sNo: 4, percentage: "15%", percentageCode: "C90bqt", band: "Band A", amountStartRange: "1,000,000", amountEndRange: "9,999,999", approvalStatus: "Approved", deactivated: false },
    { sNo: 5, percentage: "20%", percentageCode: "C90bqt", band: "Band A", amountStartRange: "10,000,000", amountEndRange: "99,999,999", approvalStatus: "Approved", deactivated: false },
    { sNo: 6, percentage: "2%", percentageCode: "C90bqt", band: "Band B", amountStartRange: "0", amountEndRange: "4,999", approvalStatus: "Approved", deactivated: false },
    { sNo: 7, percentage: "5%", percentageCode: "C90bqt", band: "Band B", amountStartRange: "5,000", amountEndRange: "9,999", approvalStatus: "Rejected", deactivated: true },
    { sNo: 8, percentage: "10%", percentageCode: "C90bqt", band: "Band B", amountStartRange: "10,000", amountEndRange: "14,999", approvalStatus: "Approved", deactivated: false },
    { sNo: 9, percentage: "15%", percentageCode: "C90bqt", band: "Band B", amountStartRange: "15,000", amountEndRange: "19,999", approvalStatus: "Approved", deactivated: false },
    { sNo: 10, percentage: "20%", percentageCode: "C90bqt", band: "Band B", amountStartRange: "20,000", amountEndRange: "24,999", approvalStatus: "Approved", deactivated: false },
];

const LiabilityTable = ({ view, onViewChange, onDataChange, onAddPercentageRange: _onAddPercentageRange }: LiabilityTableProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<TableData | null>(null);
    const [editFormData, setEditFormData] = useState<Partial<TableData>>({});
    const [tableData, setTableData] = useState<TableData[]>(() => {
        return view === "liability"
            ? defaultLiabilityData.map(item => ({ ...item, deactivated: item.deactivated ?? false }))
            : defaultPercentageData.map(item => ({ ...item, deactivated: item.deactivated ?? false }));
    });

    // Custom comparison function for deep equality of TableData arrays
    const areDataArraysEqual = (arr1: TableData[], arr2: TableData[]): boolean => {
        if (arr1.length !== arr2.length) return false;
        return arr1.every((item1, index) => {
            const item2 = arr2[index];
            if (!item2) return false;
            return (
                item1.sNo === item2.sNo &&
                ("liabilityName" in item1 ? item1.liabilityName === (item2 as Liability).liabilityName : true) &&
                ("liabilityCode" in item1 ? item1.liabilityCode === (item2 as Liability).liabilityCode : true) &&
                ("percentage" in item1 ? item1.percentage === (item2 as PercentageRange).percentage : true) &&
                ("percentageCode" in item1 ? item1.percentageCode === (item2 as PercentageRange).percentageCode : true) &&
                ("band" in item1 ? item1.band === (item2 as PercentageRange).band : true) &&
                ("amountStartRange" in item1 ? item1.amountStartRange === (item2 as PercentageRange).amountStartRange : true) &&
                ("amountEndRange" in item1 ? item1.amountEndRange === (item2 as PercentageRange).amountEndRange : true) &&
                item1.approvalStatus === item2.approvalStatus &&
                (item1.deactivated ?? false) === (item2.deactivated ?? false)
            );
        });
    };

    // Update tableData when view changes
    useEffect(() => {
        const newData = view === "liability"
            ? defaultLiabilityData.map(item => ({ ...item, deactivated: item.deactivated ?? false }))
            : defaultPercentageData.map(item => ({ ...item, deactivated: item.deactivated ?? false }));
        if (!areDataArraysEqual(tableData, newData)) {
            setTableData(newData);
        }
    }, [view, tableData]);

    // Notify parent of data changes
    useEffect(() => {
        if (onDataChange) {
            onDataChange(tableData);
        }
    }, [tableData, onDataChange]);


    const handleEditClick = (row: TableData) => {
        setSelectedRow(row);
        setEditFormData({
            sNo: row.sNo,
            liabilityName: "liabilityName" in row ? row.liabilityName : undefined,
            liabilityCode: "liabilityCode" in row ? row.liabilityCode : undefined,
            percentage: "percentage" in row ? row.percentage : undefined,
            percentageCode: "percentageCode" in row ? row.percentageCode : undefined,
            band: "band" in row ? row.band : undefined,
            amountStartRange: "amountStartRange" in row ? row.amountStartRange : undefined,
            amountEndRange: "amountEndRange" in row ? row.amountEndRange : undefined,
            approvalStatus: row.approvalStatus,
        });
        setIsEditDialogOpen(true);
    };

    const handleDeactivateClick = (row: TableData) => {
        setSelectedRow(row);
        setIsDeactivateDialogOpen(true);
    };

    const handleApproveClick = (row: TableData) => {
        const updatedData = tableData.map((item) =>
            item.sNo === row.sNo ? { ...item, approvalStatus: "Approved" as const, deactivated: false } : item
        );
        setTableData(updatedData);
    };

    const handleRejectClick = (row: TableData) => {
        const updatedData = tableData.map((item) =>
            item.sNo === row.sNo ? { ...item, approvalStatus: "Rejected" as const } : item
        );
        setTableData(updatedData);
    };

    const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEditSubmit = () => {
        if (!selectedRow) return;

        const updatedData = tableData.map((item) => {
            if (item.sNo === selectedRow.sNo) {
                if (view === "liability") {
                    return {
                        ...item,
                        liabilityName: ("liabilityName" in editFormData && editFormData.liabilityName !== undefined)
                            ? editFormData.liabilityName
                            : (item as Liability).liabilityName,
                        liabilityCode: ("liabilityCode" in editFormData && editFormData.liabilityCode !== undefined)
                            ? editFormData.liabilityCode
                            : (item as Liability).liabilityCode,
                    };
                } else {
                    return {
                        ...item,
                        percentage: ("percentage" in editFormData && editFormData.percentage !== undefined)
                            ? editFormData.percentage
                            : (item as PercentageRange).percentage,
                        percentageCode: ("percentageCode" in editFormData && editFormData.percentageCode !== undefined)
                            ? editFormData.percentageCode
                            : (item as PercentageRange).percentageCode,
                        band: ("band" in editFormData && editFormData.band !== undefined)
                            ? editFormData.band
                            : (item as PercentageRange).band,
                        amountStartRange: ("amountStartRange" in editFormData && editFormData.amountStartRange !== undefined)
                            ? editFormData.amountStartRange
                            : (item as PercentageRange).amountStartRange,
                        amountEndRange: ("amountEndRange" in editFormData && editFormData.amountEndRange !== undefined)
                            ? editFormData.amountEndRange
                            : (item as PercentageRange).amountEndRange,
                    };
                }
            }
            return item;
        });

        setTableData(updatedData);
        setIsEditDialogOpen(false);
        setSelectedRow(null);
        setEditFormData({});
    };

    const handleDeactivateSubmit = () => {
        if (!selectedRow) return;

        const updatedData = tableData.map((item) =>
            item.sNo === selectedRow.sNo ? { ...item, deactivated: true } : item
        );
        setTableData(updatedData);
        setIsDeactivateDialogOpen(false);
        setSelectedRow(null);
    };

    const getColumns = (): ColumnDef<TableData>[] => {
        if (view === "liability") {
            return [
                {
                    accessorKey: "sNo",
                    header: () => (
                        <div className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            S/N
                        </div>
                    ),
                    cell: ({ row }) => (
                        <div className="flex items-center">
                            <input type="checkbox" className="mr-2" disabled={row.original.deactivated} />
                            {row.getValue("sNo")}
                        </div>
                    ),
                },
                { accessorKey: "liabilityName", header: "Liability Name" },
                { accessorKey: "liabilityCode", header: "Liability Code" },
                {
                    accessorKey: "approvalStatus",
                    header: "Approval Status",
                    cell: ({ row }) => {
                        const status = row.getValue("approvalStatus") as string;
                        const getStatusColor = (status: string) => ({
                            Pending: "bg-yellow-100 text-yellow-800",
                            Rejected: "bg-red-100 text-red-800",
                            Approved: "bg-blue-100 text-blue-800",
                        }[status] ?? "bg-gray-100 text-gray-800");
                        return <span className={`px-2 py-1 rounded ${getStatusColor(status)}`}>{status}</span>;
                    },
                },
                {
                    id: "actions",
                    header: "Actions",
                    cell: ({ row }) => (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="secondary"
                                    className="p-1 text-gray-600 hover:text-gray-800 border-none cursor-pointer focus:outline-none ring-[rgba(22,28,202,0)]"
                                    disabled={row.original.deactivated}
                                >
                                    <EllipsisVertical size={14} strokeWidth={2.7} className="border border-gray-500 p-1 rounded-lg" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem
                                    className="cursor-pointer gap-2"
                                    onClick={() => handleEditClick(row.original)}
                                    disabled={row.original.deactivated}
                                >
                                    <Pencil size={14} className="text-gray-700" /> Edit Liability
                                </DropdownMenuItem>
                                {row.original.approvalStatus === "Pending" && (
                                    <DropdownMenuItem
                                        className="cursor-pointer gap-2"
                                        onClick={() => handleApproveClick(row.original)}
                                        disabled={row.original.deactivated}
                                    >
                                        <CircleCheck size={14} className="text-gray-700" /> Approve
                                    </DropdownMenuItem>
                                )}
                                {row.original.approvalStatus === "Pending" && (
                                    <DropdownMenuItem
                                        className="cursor-pointer gap-2"
                                        onClick={() => handleRejectClick(row.original)}
                                        disabled={row.original.deactivated}
                                    >
                                        <CircleX size={14} className="text-gray-700" /> Reject
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                    className="cursor-pointer gap-2"
                                    onClick={() => handleDeactivateClick(row.original)}
                                    disabled={row.original.deactivated}
                                >
                                    <Ban size={14} className="text-gray-700" /> Deactivate Liability
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ),
                },
            ];
        } else {
            return [
                {
                    accessorKey: "sNo",
                    header: () => (
                        <div className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            S/N
                        </div>
                    ),
                    cell: ({ row }) => (
                        <div className="flex items-center">
                            <input type="checkbox" className="mr-2" disabled={row.original.deactivated} />
                            {row.getValue("sNo")}
                        </div>
                    ),
                },
                { accessorKey: "percentage", header: "Percentage" },
                { accessorKey: "percentageCode", header: "Percentage Code" },
                { accessorKey: "band", header: "Band" },
                { accessorKey: "amountStartRange", header: "Amount Start Range" },
                { accessorKey: "amountEndRange", header: "Amount End Range" },
                {
                    accessorKey: "approvalStatus",
                    header: "Approval Status",
                    cell: ({ row }) => {
                        const status = row.getValue("approvalStatus") as string;
                        const getStatusColor = (status: string) => ({
                            Pending: "bg-yellow-100 text-yellow-800",
                            Rejected: "bg-red-100 text-red-800",
                            Approved: "bg-blue-100 text-blue-800",
                        }[status] ?? "bg-gray-100 text-gray-800");
                        return <span className={`px-2 py-1 rounded ${getStatusColor(status)}`}>{status}</span>;
                    },
                },
                {
                    id: "status",
                    header: "Status",
                    cell: ({ row }) => {
                        const isActive = !row.original.deactivated;
                        return (
                            <span className={`px-2 py-1 rounded ${isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                {isActive ? "Active" : "Inactive"}
                            </span>
                        );
                    },
                },
                {
                    id: "actions",
                    header: "Actions",
                    cell: ({ row }) => (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="secondary"
                                    className="p-1 text-gray-600 hover:text-gray-800 border-none cursor-pointer focus:outline-none ring-[rgba(22,28,202,0)]"
                                    disabled={row.original.deactivated}
                                >
                                    <EllipsisVertical size={14} strokeWidth={2.7} className="border border-gray-500 p-1 rounded-lg" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem
                                    className="cursor-pointer gap-2"
                                    onClick={() => handleEditClick(row.original)}
                                    disabled={row.original.deactivated}
                                >
                                    <Pencil size={14} className="text-gray-700" /> Edit Range
                                </DropdownMenuItem>
                                {row.original.approvalStatus === "Pending" && (
                                    <DropdownMenuItem
                                        className="cursor-pointer gap-2"
                                        onClick={() => handleApproveClick(row.original)}
                                        disabled={row.original.deactivated}
                                    >
                                        <CircleCheck size={14} className="text-gray-700" /> Approve
                                    </DropdownMenuItem>
                                )}
                                {row.original.approvalStatus === "Pending" && (
                                    <DropdownMenuItem
                                        className="cursor-pointer gap-2"
                                        onClick={() => handleRejectClick(row.original)}
                                        disabled={row.original.deactivated}
                                    >
                                        <CircleX size={14} className="text-gray-700" /> Reject
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                    className="cursor-pointer gap-2"
                                    onClick={() => handleDeactivateClick(row.original)}
                                    disabled={row.original.deactivated}
                                >
                                    <Ban size={14} className="text-gray-700" /> Deactivate Range
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ),
                },
            ];
        }
    };

    const filteredTableData = useMemo(() => {
        return tableData.filter((item) => {
            if (!searchTerm) return true;
            const lowerSearch = searchTerm.toLowerCase();
            if (view === "liability") {
                return (
                    ("liabilityName" in item && item.liabilityName.toLowerCase().includes(lowerSearch)) ||
                    ("liabilityCode" in item && item.liabilityCode.toLowerCase().includes(lowerSearch))
                );
            } else {
                return (
                    ("percentage" in item && item.percentage.toLowerCase().includes(lowerSearch)) ||
                    ("percentageCode" in item && item.percentageCode.toLowerCase().includes(lowerSearch)) ||
                    ("band" in item && item.band.toLowerCase().includes(lowerSearch)) ||
                    ("amountStartRange" in item && item.amountStartRange.toLowerCase().includes(lowerSearch)) ||
                    ("amountEndRange" in item && item.amountEndRange.toLowerCase().includes(lowerSearch))
                );
            }
        });
    }, [tableData, searchTerm, view]);

    const columns = getColumns();
    const table = useReactTable({
        data: filteredTableData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="w-full">
            <div className="flex justify-between mb-4 items-center">
                <div className="space-x-2 border-[rgba(22,28,202,1)] border rounded-lg p-1 cursor-pointer">
                    <Button
                        variant="default"
                        className={`px-8 cursor-pointer ${view === "liability" ? "bg-[rgba(22,28,202,1)] text-white" : "bg-white text-gray-800"}`}
                        size="lg"
                        onClick={() => onViewChange("liability")}
                    >
                        Liability Cause
                    </Button>
                    <Button
                        variant="default"
                        size="lg"
                        className={`cursor-pointer ${view === "percentage" ? "bg-[rgba(22,28,202,1)] text-white" : "bg-white text-gray-800"}`}
                        onClick={() => onViewChange("percentage")}
                    >
                        Percentage Range
                    </Button>
                </div>
                <div className="flex items-center justify-between gap-2 w-full lg:w-auto">
                    <div className="relative w-fit lg:w-1/2">
                        <Search
                            size={14}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                        />
                        <Input
                            type="text"
                            placeholder="Search by Name, Id, cont..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-fit border-gray-300 focus:border-[#161CCA]/30 focus:ring-[#161CCA]/50 text-sm lg:text-base"
                        />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-2 border-gray-300 w-full lg:w-auto ring-gray-100/20">
                                <ArrowUpDown className="text-gray-500" size={14} />
                                <span className="text-gray-800 text-sm lg:text-base">Sort</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full p-3 shadow-lg">
                            <DropdownMenuItem className="cursor-pointer">Newest - Oldest</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">Oldest - Newest</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">Highest - Lowest</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">Lowest - Highest</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <Card className="overflow-auto rounded-lg border-gray-100 mt-10">
                <Table className="w-full h-4/6">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className={row.original.deactivated ? "bg-gray-200 opacity-50" : ""}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="bg-white border-none w-full h-fit">
                    <DialogHeader>
                        <DialogTitle>{view === "liability" ? "Edit Liability" : "Edit Percentage Range"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {view === "liability" ? (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="liabilityName">Liability Name</Label>
                                    <Input
                                        id="liabilityName"
                                        name="liabilityName"
                                        placeholder="Enter liability name"
                                        value={"liabilityName" in editFormData ? editFormData.liabilityName ?? "" : ""}
                                        onChange={handleEditFormChange}
                                        className="border-[#bebebe] focus:ring-ring/50"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="liabilityCode">Liability Code</Label>
                                    <Input
                                        id="liabilityCode"
                                        name="liabilityCode"
                                        placeholder="Enter liability code"
                                        value={"liabilityCode" in editFormData ? editFormData.liabilityCode ?? "" : ""}
                                        onChange={handleEditFormChange}
                                        className="border-[#bebebe] focus:ring-ring/50"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="percentage">Percentage</Label>
                                    <Input
                                        id="percentage"
                                        name="percentage"
                                        placeholder="Enter percentage"
                                        value={"percentage" in editFormData ? editFormData.percentage ?? "" : ""}
                                        onChange={handleEditFormChange}
                                        className="border-[#bebebe] focus:ring-ring/50"
                                    />
                                </div>
                                <div className="grid gap-2 grid-cols-2 gap-x-4">
                                    <div>
                                        <Label htmlFor="percentageCode" className="mb-2">Percentage Code</Label>
                                        <Input
                                            id="percentageCode"
                                            name="percentageCode"
                                            placeholder="Enter percentage code"
                                            value={"percentageCode" in editFormData ? editFormData.percentageCode ?? "" : ""}
                                            onChange={handleEditFormChange}
                                            className="border-[#bebebe] focus:ring-ring/50"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="band" className="mb-2">Band</Label>
                                        <Select
                                            value={"band" in editFormData ? editFormData.band ?? "" : ""}
                                            onValueChange={(value) => setEditFormData((prev) => ({ ...prev, band: value }))}
                                        >
                                            <SelectTrigger className="w-full border-[#bebebe] focus:ring-ring/50 rounded-md h-10 px-3">
                                                <SelectValue placeholder="Select Band" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Band A">Band A</SelectItem>
                                                <SelectItem value="Band B">Band B</SelectItem>
                                                <SelectItem value="Band C">Band C</SelectItem>
                                                <SelectItem value="Band D">Band D</SelectItem>
                                                <SelectItem value="Band E">Band E</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid gap-2 grid-cols-2 gap-x-4">
                                    <div>
                                        <Label htmlFor="amountStartRange" className="mb-2">Amount Start Range</Label>
                                        <Input
                                            id="amountStartRange"
                                            name="amountStartRange"
                                            placeholder="Enter amount"
                                            value={"amountStartRange" in editFormData ? editFormData.amountStartRange ?? "" : ""}
                                            onChange={handleEditFormChange}
                                            className="border-[#bebebe] focus:ring-ring/50"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="amountEndRange" className="mb-2">Amount End Range</Label>
                                        <Input
                                            id="amountEndRange"
                                            name="amountEndRange"
                                            placeholder="Enter amount"
                                            value={"amountEndRange" in editFormData ? editFormData.amountEndRange ?? "" : ""}
                                            onChange={handleEditFormChange}
                                            className="border-[#bebebe] focus:ring-ring/50"
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                            className="border-[#161CCA] text-[#161CCA]"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleEditSubmit}
                            className="bg-[#161CCA] text-white"
                            disabled={
                                view === "percentage" &&
                                (
                                    !("percentage" in editFormData && editFormData.percentage) ||
                                    !("percentageCode" in editFormData && editFormData.percentageCode) ||
                                    !("band" in editFormData && editFormData.band) ||
                                    !("amountStartRange" in editFormData && editFormData.amountStartRange) ||
                                    !("amountEndRange" in editFormData && editFormData.amountEndRange)
                                )
                            }
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Deactivate Dialog */}
            <Dialog open={isDeactivateDialogOpen} onOpenChange={setIsDeactivateDialogOpen}>
                <DialogContent className="bg-white border-none w-full h-fit">
                    <DialogHeader>
                        <div className="flex items-center space-x-3">
                            <AlertTriangle size={16} className="text-[#F50202] p-2 rounded-full bg-[#FEE2E2]" />
                            <DialogTitle>{view === "liability" ? "Deactivate Liability Cause" : "Deactivate Percentage Range"}</DialogTitle>
                        </div>
                        <DialogDescription className="pt-2">
                            Are you sure you want to deactivate this {view === "liability" ? "liability cause" : "percentage range"}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsDeactivateDialogOpen(false)}
                            className="border-[#F50202] text-[#F50202] hover:bg-[#F50202]/10 ring-[#f50202]/20 cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDeactivateSubmit}
                            className="bg-[#F50202] text-white hover:bg-[#F50202]/90"
                        >
                            Deactivate
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default LiabilityTable;