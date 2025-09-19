/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { ArrowUpDown, Ban, CircleCheck, CircleX, EllipsisVertical, Pencil, Search, AlertTriangle, Loader2 } from "lucide-react";
import React, { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { getStatusStyle } from "../status-style";
import {
    useAllLiabilityCauses,
    useUpdateLiabilityCause,
    useAllPercentageRanges,
    useUpdatePercentageRange,
} from "@/hooks/use-debit-settings";
import { type LiabilityCause, type PercentageRange, type UpdatedLiabilityCausePayload, type UpdatedPercentageRangePayload, type Band } from "@/types/credit-debit";
import { useBand } from "@/hooks/use-band";

// This is correct as is, it's a good way to handle the type extension.
type FixedLiabilityCause = LiabilityCause & { approveStatus: "Pending" | "Rejected" | "Approved" };

// This union type is also correct.
type TableData = (FixedLiabilityCause & { deactivated?: boolean }) | (PercentageRange & { deactivated?: boolean });

type LiabilityTableProps = {
    view: "liability" | "percentage";
    onViewChange: (view: "liability" | "percentage") => void;
};

const LiabilityTable = ({ view, onViewChange }: LiabilityTableProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<TableData | null>(null);
    const [editFormData, setEditFormData] = useState<Partial<TableData>>({});

    const { data: liabilityData, isLoading: isLoadingLiabilities, refetch: refetchLiabilities } = useAllLiabilityCauses();
    const { data: percentageData, isLoading: isLoadingPercentages, refetch: refetchPercentages } = useAllPercentageRanges();
    const { mutate: updateLiability } = useUpdateLiabilityCause();
    const { mutate: updatePercentage } = useUpdatePercentageRange();
    const { bands } = useBand();

    const tableData = useMemo(() => {
        if (view === "liability" && liabilityData) {
            // Your original code here is fine; the casting is necessary.
            return liabilityData.map(item => ({ ...(item as FixedLiabilityCause), deactivated: item.deactivated ?? false }));
        }
        if (view === "percentage" && percentageData) {
            return percentageData.map(item => ({ ...item, deactivated: item.deactivated ?? false }));
        }
        return [];
    }, [view, liabilityData, percentageData]);

    const isLoading = isLoadingLiabilities || isLoadingPercentages;

    const handleEditClick = (row: TableData) => {
        setSelectedRow(row);
        setEditFormData({ ...row });
        setIsEditDialogOpen(true);
    };

    const handleDeactivateClick = (row: TableData) => {
        setSelectedRow(row);
        setIsDeactivateDialogOpen(true);
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

        if (view === "liability") {
            const liabilityCauseId = (selectedRow as FixedLiabilityCause).id;
            const payload: UpdatedLiabilityCausePayload = {
                liabilityCauseId,
                name: (editFormData as FixedLiabilityCause).name,
                code: (editFormData as FixedLiabilityCause).code,
            };
            updateLiability(payload, {
                onSuccess: () => {
                    setIsEditDialogOpen(false);
                    setSelectedRow(null);
                    setEditFormData({});
                    refetchLiabilities();
                }
            });
        } else {
            const percentageId = (selectedRow as PercentageRange).id;
            const payload: UpdatedPercentageRangePayload = {
                percentageId,
                percentage: ("percentage" in editFormData && editFormData.percentage) ? editFormData.percentage : undefined,
                code: ("code" in editFormData && editFormData.code) ? editFormData.code : undefined,
                bandId: ("band" in editFormData && editFormData.band) ? editFormData.band.id : undefined,
                amountStartRange:
                    'amountStartRange' in editFormData && editFormData.amountStartRange
                        ? (editFormData.amountStartRange as string)
                        : undefined,
                amountEndRange:
                    'amountEndRange' in editFormData && editFormData.amountEndRange
                        ? (editFormData.amountEndRange as string)
                        : undefined,
            };
            updatePercentage(payload, {
                onSuccess: () => {
                    setIsEditDialogOpen(false);
                    setSelectedRow(null);
                    setEditFormData({});
                    refetchPercentages();
                }
            });
        }
    };

    const handleDeactivateSubmit = () => {
        if (!selectedRow) return;

        if (view === "liability") {
            const liability = selectedRow as FixedLiabilityCause;
            updateLiability({ liabilityCauseId: liability.id, deactivated: true }, {
                onSuccess: () => {
                    setIsDeactivateDialogOpen(false);
                    setSelectedRow(null);
                    refetchLiabilities();
                }
            });
        } else {
            const percentage = selectedRow as PercentageRange;
            updatePercentage({ percentageId: percentage.id, deactivated: true }, {
                onSuccess: () => {
                    setIsDeactivateDialogOpen(false);
                    setSelectedRow(null);
                    refetchPercentages();
                }
            });
        }
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
                            {(row.index + 1)}
                        </div>
                    ),
                },
                { accessorKey: "name", header: "Liability Name" },
                { accessorKey: "code", header: "Liability Code" },
                {
                    // Correcting the header text as requested.
                    accessorKey: "approveStatus",
                    header: "Liability Cause Stage",
                    cell: ({ row }) => {
                        // Access the correct property from the row object.
                        const status = (row.original as FixedLiabilityCause).approveStatus;
                        // Your `getStatusStyle` function will handle the dynamic styling.
                        return <span className={getStatusStyle(status)}>{status}</span>;
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
                            {(row.index + 1)}
                        </div>
                    ),
                },
                { accessorKey: "percentage", header: "Percentage" },
                { accessorKey: "code", header: "Percentage Code" },
                { accessorKey: "band.name", header: "Band" },
                { accessorKey: "amountStartRange", header: "Amount Start Range" },
                { accessorKey: "amountEndRange", header: "Amount End Range" },
                {
                    accessorKey: "approveStatus",
                    header: "Approval Status",
                    cell: ({ row }) => {
                        const status = (row.original as PercentageRange).approveStatus;
                        return <span className={getStatusStyle(status)}>{status}</span>;
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
                const liabilityItem = item as FixedLiabilityCause;
                return (
                    liabilityItem.name?.toLowerCase().includes(lowerSearch) ||
                    liabilityItem.code?.toLowerCase().includes(lowerSearch) ||
                    // Ensure approvalStatus is also searchable
                    liabilityItem.approveStatus?.toLowerCase().includes(lowerSearch)
                );
            } else {
                const percentageItem = item as PercentageRange;
                return (
                    percentageItem.percentage?.toString().toLowerCase().includes(lowerSearch) ||
                    percentageItem.code?.toLowerCase().includes(lowerSearch) ||
                    percentageItem.band?.name?.toLowerCase().includes(lowerSearch) ||
                    // Using optional chaining to prevent error if range properties are null
                    String(percentageItem.amountStartRange)?.toLowerCase().includes(lowerSearch) ||
                    String(percentageItem.amountEndRange)?.toLowerCase().includes(lowerSearch) ||
                    // Ensure approvalStatus is also searchable
                    percentageItem.approveStatus?.toLowerCase().includes(lowerSearch)
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
        <div className="w-full bg-transparent">
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
                            placeholder="Search by Name, Code, Status..."
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
            <Card className="overflow-auto rounded-lg border-gray-100 mt-10 bg-transparent">
                <Table className="w-full h-4/6 bg-transparent">
                    <TableHeader className="bg-transparent">
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
                        ) : isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                <Loader2 className="mx-auto animate-spin" />
                                    Loading
                                </TableCell>
                            </TableRow>
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
                                        name="name"
                                        placeholder="Enter liability name"
                                        value={"name" in editFormData ? editFormData.name ?? "" : ""}
                                        onChange={handleEditFormChange}
                                        className="border-[#bebebe] focus:ring-ring/50"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="liabilityCode">Liability Code</Label>
                                    <Input
                                        id="liabilityCode"
                                        name="code"
                                        placeholder="Enter liability code"
                                        value={"code" in editFormData ? editFormData.code ?? "" : ""}
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
                                            name="code"
                                            placeholder="Enter percentage code"
                                            value={"code" in editFormData ? editFormData.code ?? "" : ""}
                                            onChange={handleEditFormChange}
                                            className="border-[#bebebe] focus:ring-ring/50"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="band" className="mb-2">Band</Label>
                                        <Select
                                            value={"band" in editFormData ? (editFormData.band)?.name ?? "" : ""}
                                            onValueChange={(value) => {
                                                const selectedBand = bands.find(b => b.name === value);
                                                setEditFormData((prev) => ({ ...prev, band: selectedBand }));
                                            }}
                                        >
                                            <SelectTrigger className="w-full border-[#bebebe] focus:ring-ring/50 rounded-md h-10 px-3">
                                                <SelectValue placeholder="Select Band" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {bands.map(bandItem => (
                                                    <SelectItem key={bandItem.id} value={bandItem.name}>{bandItem.name}</SelectItem>
                                                ))}
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
                                    !("code" in editFormData && editFormData.code) ||
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