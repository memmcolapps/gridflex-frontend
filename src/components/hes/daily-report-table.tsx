'use client';

import React, { useState, useMemo } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { PaginationControls } from "@/components/ui/pagination-controls";

interface DailyReportData {
    meterNo?: string;
    connectionType?: string;
    meter?: {
        smartMeterInfo?: {
            meterModel?: string;
        };
        meterModel?: string;
        meterClass?: string;
        accountNumber?: string;
        customerId?: string;
    };
    updatedAt?: string;
    onlineTime?: string;
    offlineTime?: string;
}

interface DailyReportTableProps {
    data?: DailyReportData[];
    searchQuery?: string;
}

export function DailyReportTable({ data = [], searchQuery = "" }: DailyReportTableProps = {}) {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handlePageSizeChange = (newPageSize: number) => {
        setRowsPerPage(newPageSize);
        setCurrentPage(1);
    };

    // Filter data based on search query
    const filteredData = useMemo(() => {
        if (!searchQuery) return data;
        const searchLower = searchQuery.toLowerCase();
        return data.filter((item) => {
            const fields = [
                item.meterNo,
                item.connectionType,
                item.meter?.meterModel,
                item.meter?.meterClass
            ];
            return fields.some(field => field?.toLowerCase().includes(searchLower));
        });
    }, [data, searchQuery]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return filteredData.slice(startIndex, endIndex);
    }, [filteredData, currentPage, rowsPerPage]);

    return (
        <div className="overflow-x-auto rounded-md w-full pt-5">
            <Table className='min-w-full'>
                <TableHeader>
                    <TableRow>
                        <TableHead>S/N</TableHead>
                        <TableHead>Meter No.</TableHead>
                        <TableHead>Meter Model</TableHead>
                        <TableHead>Connection Type</TableHead>
                        <TableHead>Online Time</TableHead>
                        <TableHead>Offline Time</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead>Meter Class</TableHead>
                        <TableHead>Account Number</TableHead>
                        <TableHead>Customer ID</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedData.map((row, index) => (
                        <TableRow key={row.meterNo ?? `row-${index}`}>
                            <TableCell>{(currentPage - 1) * rowsPerPage + index + 1}</TableCell>
                            <TableCell>{row.meterNo}</TableCell>
                            <TableCell>{row.meter?.smartMeterInfo?.meterModel ?? '-'}</TableCell>
                            <TableCell>{row.connectionType}</TableCell>
                            <TableCell>{row.onlineTime ? new Date(row.onlineTime).toLocaleString() : '-'}</TableCell>
                            <TableCell>{row.offlineTime ? new Date(row.offlineTime).toLocaleString() : '-'}</TableCell>
                            <TableCell>{row.updatedAt ? new Date(row.updatedAt).toLocaleString() : '-'}</TableCell>
                            <TableCell>{row.meter?.meterClass ?? '-'}</TableCell>
                            <TableCell>{row.meter?.accountNumber ?? '-'}</TableCell>
                            <TableCell>{row.meter?.customerId ?? '-'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="p-4">
                <PaginationControls
                    currentPage={currentPage}
                    totalItems={filteredData.length}
                    pageSize={rowsPerPage}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={handlePageSizeChange}
                />
            </div>
        </div>
    );
}