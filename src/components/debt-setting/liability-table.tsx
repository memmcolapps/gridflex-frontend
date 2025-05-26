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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ArrowUpDown, CircleAlert, CircleCheck, EllipsisVertical, Search } from "lucide-react";
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
    data: TableData[];
    view: "liability" | "percentage";
    onViewChange: (view: "liability" | "percentage") => void;
};

const LiabilityTable = ({ data, view, onViewChange }: LiabilityTableProps) => {
    const [searchTerm, setSearchTerm] = useState("");

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
                    cell: () => (
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
                                <DropdownMenuItem className="cursor-pointer gap-2">
                                    <CircleCheck size={14} className="text-gray-700" />
                                    Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer gap-2">
                                    <CircleAlert size={14} className="text-gray-700" />
                                    Reject
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
                    cell: () => (
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
                                <DropdownMenuItem className="cursor-pointer gap-2">
                                    <CircleCheck size={14} className="text-gray-700" />
                                    Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer gap-2">
                                    <CircleAlert size={14} className="text-gray-700" />
                                    Reject
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
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="w-full">
            <div className="flex justify-between mb-4 items-center">
                <div className="space-x-2 border-[rgba(22,28,202,1)] border rounded-lg px-2 py-1 cursor-pointer">
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
                    </div><DropdownMenu>
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
        </div>
    );
};

export default LiabilityTable;