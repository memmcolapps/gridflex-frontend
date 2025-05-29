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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ArrowUpDown, Ban, CircleCheck, CircleX, EllipsisVertical, Pencil, Search } from "lucide-react";
import React, { useState } from "react";
type Liability = {
    sNo: number;
    liabilityName: string;
    liabilityCode: string;
    approvalStatus: "Pending" | "Rejected" | "Approved";
};

type PercentageRange = {
    sNo: number;
    percentage: string;
    amountRange: string;
    approvalStatus: "Pending" | "Rejected" | "Approved";
};

type TableData = Liability | PercentageRange;

type LiabilityTableProps = {
    data?: TableData[];
    view: "liability" | "percentage";
    onViewChange: (view: "liability" | "percentage") => void;
};

// Sample data for Liability Cause table
const defaultLiabilityData: Liability[] = [
    {
        sNo: 1,
        liabilityName: "Loan Default",
        liabilityCode: "LD001",
        approvalStatus: "Pending",
    },
    {
        sNo: 2,
        liabilityName: "Overdraft",
        liabilityCode: "OD002",
        approvalStatus: "Approved",
    },
    {
        sNo: 3,
        liabilityName: "Credit Card Debt",
        liabilityCode: "CC003",
        approvalStatus: "Rejected",
    },
    {
        sNo: 4,
        liabilityName: "Mortgage",
        liabilityCode: "MG004",
        approvalStatus: "Approved",
    },
];

const LiabilityTable = ({ data, view, onViewChange }: LiabilityTableProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<TableData | null>(null);
    const [editFormData, setEditFormData] = useState<Partial<TableData>>({});

    // Use provided data or fallback to default data for liability view
    const [tableData, setTableData] = useState<TableData[]>(
        data && data.length > 0
            ? data
            : view === "liability"
            ? defaultLiabilityData
            : []
    );

    React.useEffect(() => {
        if (data && data.length > 0) {
            setTableData(data);
        } else if (view === "liability") {
            setTableData(defaultLiabilityData);
        } else {
            setTableData([]);
        }
    }, [data, view]);

    const handleEditClick = (row: TableData) => {
        setSelectedRow(row);
        setEditFormData({
            sNo: row.sNo,
            liabilityName: "liabilityName" in row ? row.liabilityName : undefined,
            liabilityCode: "liabilityCode" in row ? row.liabilityCode : undefined,
            percentage: "percentage" in row ? row.percentage : undefined,
            amountRange: "amountRange" in row ? row.amountRange : undefined,
            approvalStatus: row.approvalStatus,
        });
        setIsEditDialogOpen(true);
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
                        liabilityName:
                            "liabilityName" in editFormData && editFormData.liabilityName !== undefined
                                ? editFormData.liabilityName
                                : (item as Liability).liabilityName,
                        liabilityCode:
                            "liabilityCode" in editFormData && editFormData.liabilityCode !== undefined
                                ? editFormData.liabilityCode
                                : (item as Liability).liabilityCode,
                    };
                } else {
                    return {
                        ...item,
                        percentage: "percentage" in editFormData && editFormData.percentage !== undefined
                            ? editFormData.percentage
                            : (item as PercentageRange).percentage,
                        amountRange: "amountRange" in editFormData && editFormData.amountRange !== undefined
                            ? editFormData.amountRange
                            : (item as PercentageRange).amountRange,
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
                            <input type="checkbox" className="mr-2" />
                            {row.getValue("sNo")}
                        </div>
                    ),
                },
                {
                    accessorKey: "liabilityName",
                    header: "Liability Name",
                },
                {
                    accessorKey: "liabilityCode",
                    header: "Liability Code",
                },
                {
                    accessorKey: "approvalStatus",
                    header: "Approval Status",
                    cell: ({ row }) => {
                        const status = row.getValue("approvalStatus") as string;
                        const getStatusColor = (status: string) => {
                            switch (status) {
                                case "Pending": return "bg-yellow-100 text-yellow-800";
                                case "Rejected": return "bg-red-100 text-red-800";
                                case "Approved": return "bg-blue-100 text-blue-800";
                                default: return "bg-gray-100 text-gray-800";
                            }
                        };
                        return (
                            <span className={`px-2 py-1 rounded ${getStatusColor(status)}`}>
                                {status}
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
                                >
                                    <EllipsisVertical size={14} strokeWidth={2.7} className="border border-gray-500 p-1 rounded-lg" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem
                                    className="cursor-pointer gap-2"
                                    onClick={() => handleEditClick(row.original)}
                                >
                                    <Pencil size={14} className="text-gray-700" />
                                    Edit Liability
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer gap-2">
                                    <CircleCheck size={14} className="text-gray-700" />
                                    Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer gap-2">
                                    <CircleX size={14} className="text-gray-700" />
                                    Reject
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer gap-2">
                                    <Ban size={14} className="text-gray-700" />
                                    Deactivate Liability
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
                            <input type="checkbox" className="mr-2" />
                            {row.getValue("sNo")}
                        </div>
                    ),
                },
                {
                    accessorKey: "percentage",
                    header: "Percentage",
                },
                {
                    accessorKey: "amountRange",
                    header: "Amount Range",
                },
                {
                    accessorKey: "approvalStatus",
                    header: "Approval Status",
                    cell: ({ row }) => {
                        const status = row.getValue("approvalStatus") as string;
                        const getStatusColor = (status: string) => {
                            switch (status) {
                                case "Pending": return "bg-yellow-100 text-yellow-800";
                                case "Rejected": return "bg-red-100 text-red-800";
                                case "Approved": return "bg-blue-100 text-blue-800";
                                default: return "bg-gray-100 text-gray-800";
                            }
                        };
                        return (
                            <span className={`px-2 py-1 rounded ${getStatusColor(status)}`}>
                                {status}
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
                                >
                                    <EllipsisVertical size={14} strokeWidth={2.7} className="border border-gray-500 p-1 rounded-lg" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem
                                    className="cursor-pointer gap-2"
                                    onClick={() => handleEditClick(row.original)}
                                >
                                    <Pencil size={14} className="text-gray-700" />
                                    Edit Range
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer gap-2">
                                    <CircleCheck size={14} className="text-gray-700" />
                                    Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer gap-2">
                                    <CircleX size={14} className="text-gray-700" />
                                    Reject
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer gap-2">
                                    <Ban size={14} className="text-gray-700" />
                                    Deactivate Range
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ),
                },
            ];
        }
    };

    const columns = getColumns();
    const table = useReactTable({
        data: tableData,
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
                            <DropdownMenuItem className="cursor-pointer">
                                Newest - Oldest
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                                Oldest - Newest
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                                Highest - Lowest
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                                Lowest - Highest
                            </DropdownMenuItem>
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
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
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
                        <DialogTitle>
                            {view === "liability" ? "Edit Liability" : "Edit Percentage Range"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {view === "liability" ? (
                            <>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="liabilityName" className="text-right">
                                        Liability Name
                                    </Label>
                                    <Input
                                        id="liabilityName"
                                        name="liabilityName"
                                        value={"liabilityName" in editFormData ? editFormData.liabilityName ?? "" : ""}
                                        onChange={handleEditFormChange}
                                        className="col-span-3 border-gray-300"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="liabilityCode" className="text-right">
                                        Liability Code
                                    </Label>
                                    <Input
                                        id="liabilityCode"
                                        name="liabilityCode"
                                        value={"liabilityCode" in editFormData ? editFormData.liabilityCode ?? "" : ""}
                                        onChange={handleEditFormChange}
                                        className="col-span-3 border-gray-300"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="percentage" className="text-right">
                                        Percentage
                                    </Label>
                                    <Input
                                        id="percentage"
                                        name="percentage"
                                        value={"percentage" in editFormData ? editFormData.percentage ?? "" : ""}
                                        onChange={handleEditFormChange}
                                        className="col-span-3 border-gray-300"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="amountRange" className="text-right">
                                        Amount Range
                                    </Label>
                                    <Input
                                        id="amountRange"
                                        name="amountRange"
                                        value={view === "percentage" && "amountRange" in editFormData ? editFormData.amountRange ?? "" : ""}
                                        onChange={handleEditFormChange}
                                        className="col-span-3 border-gray-300"
                                    />
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
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default LiabilityTable;