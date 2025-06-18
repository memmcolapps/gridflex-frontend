import { SearchControl, SortControl } from "../search-control";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import React, { useState, useMemo } from "react";
import { AuditLogDetailsDialog } from "./audit-log-details";

interface AuditLogEntry {
    username: string;
    email: string;
    group: string;
    activity: string;
    userAgent: string;
    ip: string;
    timestamp: string | number | Date;
}

const dummyData: AuditLogEntry[] = [
    {
        username: "john doe",
        email: "johndoe@gridflex.com",
        group: "Admin",
        activity: "Logged in",
        userAgent: "Chrome",
        ip: "192.168.1.1",
        timestamp: "2024-06-01 10:00:00",
    },
    // Add more rows as needed
    {
        username: "jane doe",
        email: "jandoe@gridflex.com",
        group: "User",
        activity: "Created report",
        userAgent: "Firefox",
        ip: "192.168.1.2",
        timestamp: "2024-06-01 11:30:00",
    },
    {
        username: "josh doe",
        email: "joshdoe@gridflex.com",
        group: "Admin",
        activity: "Deleted user",
        userAgent: "Safari",
        ip: "192.168.1.3",
        timestamp: "2024-06-01 14:15:00",
    },
];
export function AuditLog() {
    const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const totalRows = dummyData.length;
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = useMemo(
        () => dummyData.slice(startIndex, endIndex),
        [startIndex, endIndex]
    );
    const handleRowClick = (entry: AuditLogEntry) => {
        setSelectedEntry(entry);
        setIsDialogOpen(true);
    };
    return (
        <div className="p-6 h-screen overflow-auto">
            <div className="flex flex-col gap-4 h-full">
                <h1 className="text-2xl font-bold">Audit Log</h1>
                <p className="text-gray-600">
                    Track system events and user actions for security and accountability here.
                </p>
                <div className="flex items-center mb-6 gap-4 w-80">
                    <div className='flex items-center gap-2'>
                        <SearchControl />
                    </div>
                    <SortControl />
                </div>
                <div>
                    <div className="w-full overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Username</TableHead>
                                    <TableHead>Group Permission</TableHead>
                                    <TableHead>Activity</TableHead>
                                    <TableHead>User Agent</TableHead>
                                    <TableHead>IP Address</TableHead>
                                    <TableHead>Time Stamp</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedData.map((row, idx) => (
                                    <TableRow
                                        key={idx}
                                        onClick={() => handleRowClick(row)}
                                        className="cursor-pointer hover:bg-gray-100 transition-colors"
                                    >
                                        <TableCell><span>{row.username}</span><br />
                                            <span className="text-xs text-gray-500">{row.email}</span>
                                        </TableCell>
                                        <TableCell>{row.group}</TableCell>
                                        <TableCell>{row.activity}</TableCell>
                                        <TableCell>{row.userAgent}</TableCell>
                                        <TableCell>{row.ip}</TableCell>
                                        <TableCell>{typeof row.timestamp === "string" || typeof row.timestamp === "number" ? row.timestamp : row.timestamp.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <AuditLogDetailsDialog
                        open={isDialogOpen}
                        onOpenChange={setIsDialogOpen}
                        entry={selectedEntry}
                    />
                </div>
                <div className="sticky bottom-0 bg-white border-t border-gray-200 flex items-center justify-between px-4 py-3 mt-4 z-10">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Rows per page</span>
                        <select
                            value={rowsPerPage}
                            onChange={(e) => {
                                setRowsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                        >
                            {[5, 10, 12, 20, 50].map((num) => (
                                <option key={num} value={num}>
                                    {num}
                                </option>
                            ))}
                        </select>
                        <span className="text-sm text-gray-600 ml-4">
                            {startIndex + 1}-{Math.min(endIndex, totalRows)} of {totalRows} rows
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm text-black-600 disabled:opacity-50 cursor-pointer"
                        >
                            Previous
                        </button>
                        <button
                            disabled={endIndex >= totalRows}
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm text-black-600 disabled:opacity-50 cursor-pointer"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}