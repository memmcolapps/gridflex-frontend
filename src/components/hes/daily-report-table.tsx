/* eslint-disable react-hooks/exhaustive-deps */
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { PaginationControls } from "@/components/ui/pagination-controls";

const data = [
    {
        sn: '01',
        meterNo: '6212556846',
        region: 'Ogun',
        businessUnit: 'Ibafo',
        serviceCenter: 'Olowotedo',
        feeder: 'Ijeun',
        time: '2025-07-28 00:00:00',
        totalActiveEnergy: '1000',
        totalActiveEnergyT1: '316.4',
        totalActiveEnergyT2: '316.4',
        totalActiveEnergyT3: '316.4',
        totalActiveEnergyT4: '316.4',
        importReactiveEnergy: '0',
        exportReactiveEnergy: '0',
        reactiveEnergyQ1: '0',
        reactiveEnergyQ2: '0',
        reactiveEnergyQ3: '0',
        reactiveEnergyQ4: '0',
        importApparentEnergy: '0',
        exportApparentEnergy: '0',
    },
    {
        sn: '02',
        meterNo: '6212556846',
        region: 'Ogun',
        businessUnit: 'Ibafo',
        serviceCenter: 'Olowotedo',
        feeder: 'Ijeun',
        time: '2025-07-27 00:00:00',
        totalActiveEnergy: '949',
        totalActiveEnergyT1: '316.4',
        totalActiveEnergyT2: '316.4',
        totalActiveEnergyT3: '316.4',
        totalActiveEnergyT4: '316.4',
        importReactiveEnergy: '0',
        exportReactiveEnergy: '0',
        reactiveEnergyQ1: '0',
        reactiveEnergyQ2: '0',
        reactiveEnergyQ3: '0',
        reactiveEnergyQ4: '0',
        importApparentEnergy: '0',
        exportApparentEnergy: '0',
    },
    {
        sn: '03',
        meterNo: '6212556846',
        region: 'Ogun',
        businessUnit: 'Ibafo',
        serviceCenter: 'Olowotedo',
        feeder: 'Ijeun',
        time: '2025-07-26 00:00:00',
        totalActiveEnergy: '898',
        totalActiveEnergyT1: '316.4',
        totalActiveEnergyT2: '316.4',
        totalActiveEnergyT3: '316.4',
        totalActiveEnergyT4: '316.4',
        importReactiveEnergy: '0',
        exportReactiveEnergy: '0',
        reactiveEnergyQ1: '0',
        reactiveEnergyQ2: '0',
        reactiveEnergyQ3: '0',
        reactiveEnergyQ4: '0',
        importApparentEnergy: '0',
        exportApparentEnergy: '0',
    },
    {
        sn: '04',
        meterNo: '6212556846',
        region: 'Ogun',
        businessUnit: 'Ibafo',
        serviceCenter: 'Olowotedo',
        feeder: 'Ijeun',
        time: '2025-07-25 00:00:00',
        totalActiveEnergy: '847',
        totalActiveEnergyT1: '316.4',
        totalActiveEnergyT2: '316.4',
        totalActiveEnergyT3: '316.4',
        totalActiveEnergyT4: '316.4',
        importReactiveEnergy: '0',
        exportReactiveEnergy: '0',
        reactiveEnergyQ1: '0',
        reactiveEnergyQ2: '0',
        reactiveEnergyQ3: '0',
        reactiveEnergyQ4: '0',
        importApparentEnergy: '0',
        exportApparentEnergy: '0',
    },
    {
        sn: '05',
        meterNo: '6212556846',
        region: 'Ogun',
        businessUnit: 'Ibafo',
        serviceCenter: 'Olowotedo',
        feeder: 'Ijeun',
        time: '2025-07-24 00:00:00',
        totalActiveEnergy: '796',
        totalActiveEnergyT1: '316.4',
        totalActiveEnergyT2: '316.4',
        totalActiveEnergyT3: '316.4',
        totalActiveEnergyT4: '316.4',
        importReactiveEnergy: '0',
        exportReactiveEnergy: '0',
        reactiveEnergyQ1: '0',
        reactiveEnergyQ2: '0',
        reactiveEnergyQ3: '0',
        reactiveEnergyQ4: '0',
        importApparentEnergy: '0',
        exportApparentEnergy: '0',
    },
    {
        sn: '06',
        meterNo: '6212556846',
        region: 'Ogun',
        businessUnit: 'Ibafo',
        serviceCenter: 'Olowotedo',
        feeder: 'Ijeun',
        time: '2025-07-23 00:00:00',
        totalActiveEnergy: '745',
        totalActiveEnergyT1: '316.4',
        totalActiveEnergyT2: '316.4',
        totalActiveEnergyT3: '316.4',
        totalActiveEnergyT4: '316.4',
        importReactiveEnergy: '0',
        exportReactiveEnergy: '0',
        reactiveEnergyQ1: '0',
        reactiveEnergyQ2: '0',
        reactiveEnergyQ3: '0',
        reactiveEnergyQ4: '0',
        importApparentEnergy: '0',
        exportApparentEnergy: '0',
    },
    {
        sn: '07',
        meterNo: '6212556846',
        region: 'Ogun',
        businessUnit: 'Ibafo',
        serviceCenter: 'Olowotedo',
        feeder: 'Ijeun',
        time: '2025-07-22 00:00:00',
        totalActiveEnergy: '694',
        totalActiveEnergyT1: '316.4',
        totalActiveEnergyT2: '316.4',
        totalActiveEnergyT3: '316.4',
        totalActiveEnergyT4: '316.4',
        importReactiveEnergy: '0',
        exportReactiveEnergy: '0',
        reactiveEnergyQ1: '0',
        reactiveEnergyQ2: '0',
        reactiveEnergyQ3: '0',
        reactiveEnergyQ4: '0',
        importApparentEnergy: '0',
        exportApparentEnergy: '0',
    },
    {
        sn: '08',
        meterNo: '6212556846',
        region: 'Ogun',
        businessUnit: 'Ibafo',
        serviceCenter: 'Olowotedo',
        feeder: 'Ijeun',
        time: '2025-07-21 00:00:00',
        totalActiveEnergy: '643',
        totalActiveEnergyT1: '316.4',
        totalActiveEnergyT2: '316.4',
        totalActiveEnergyT3: '316.4',
        totalActiveEnergyT4: '316.4',
        importReactiveEnergy: '0',
        exportReactiveEnergy: '0',
        reactiveEnergyQ1: '0',
        reactiveEnergyQ2: '0',
        reactiveEnergyQ3: '0',
        reactiveEnergyQ4: '0',
        importApparentEnergy: '0',
        exportApparentEnergy: '0',
    },
    {
        sn: '09',
        meterNo: '6212556846',
        region: 'Ogun',
        businessUnit: 'Ibafo',
        serviceCenter: 'Olowotedo',
        feeder: 'Ijeun',
        time: '2025-07-20 00:00:00',
        totalActiveEnergy: '592',
        totalActiveEnergyT1: '316.4',
        totalActiveEnergyT2: '316.4',
        totalActiveEnergyT3: '316.4',
        totalActiveEnergyT4: '316.4',
        importReactiveEnergy: '0',
        exportReactiveEnergy: '0',
        reactiveEnergyQ1: '0',
        reactiveEnergyQ2: '0',
        reactiveEnergyQ3: '0',
        reactiveEnergyQ4: '0',
        importApparentEnergy: '0',
        exportApparentEnergy: '0',
    },
    {
        sn: '10',
        meterNo: '6212556846',
        region: 'Ogun',
        businessUnit: 'Ibafo',
        serviceCenter: 'Olowotedo',
        feeder: 'Ijeun',
        time: '2025-07-19 00:00:00',
        totalActiveEnergy: '541',
        totalActiveEnergyT1: '316.4',
        totalActiveEnergyT2: '316.4',
        totalActiveEnergyT3: '316.4',
        totalActiveEnergyT4: '316.4',
        importReactiveEnergy: '0',
        exportReactiveEnergy: '0',
        reactiveEnergyQ1: '0',
        reactiveEnergyQ2: '0',
        reactiveEnergyQ3: '0',
        reactiveEnergyQ4: '0',
        importApparentEnergy: '0',
        exportApparentEnergy: '0',
    },
    {
        sn: '11',
        meterNo: '6212556846',
        region: 'Ogun',
        businessUnit: 'Ibafo',
        serviceCenter: 'Olowotedo',
        feeder: 'Ijeun',
        time: '2025-07-18 00:00:00',
        totalActiveEnergy: '490',
        totalActiveEnergyT1: '316.4',
        totalActiveEnergyT2: '316.4',
        totalActiveEnergyT3: '316.4',
        totalActiveEnergyT4: '316.4',
        importReactiveEnergy: '0',
        exportReactiveEnergy: '0',
        reactiveEnergyQ1: '0',
        reactiveEnergyQ2: '0',
        reactiveEnergyQ3: '0',
        reactiveEnergyQ4: '0',
        importApparentEnergy: '0',
        exportApparentEnergy: '0',
    },
    {
        sn: '12',
        meterNo: '6212556846',
        region: 'Ogun',
        businessUnit: 'Ibafo',
        serviceCenter: 'Olowotedo',
        feeder: 'Ijeun',
        time: '2025-07-17 00:00:00',
        totalActiveEnergy: '439',
        totalActiveEnergyT1: '316.4',
        totalActiveEnergyT2: '316.4',
        totalActiveEnergyT3: '316.4',
        totalActiveEnergyT4: '316.4',
        importReactiveEnergy: '0',
        exportReactiveEnergy: '0',
        reactiveEnergyQ1: '0',
        reactiveEnergyQ2: '0',
        reactiveEnergyQ3: '0',
        reactiveEnergyQ4: '0',
        importApparentEnergy: '0',
        exportApparentEnergy: '0',
    },
];

export function DailyReportTable() {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / rowsPerPage);

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

    const handlePageSizeChange = (newPageSize: number) => {
        setRowsPerPage(newPageSize);
        setCurrentPage(1);
    };

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return data.slice(startIndex, endIndex);
    }, [data, currentPage, rowsPerPage]);

    return (
        <div className="overflow-x-auto rounded-md w-full pt-5">
            <Table className='min-w-full'>
                <TableHeader>
                    <TableRow>
                        <TableHead>S/N</TableHead>
                        <TableHead>Meter No.</TableHead>
                        <TableHead>Region</TableHead>
                        <TableHead>Business Unit</TableHead>
                        <TableHead>Service Center</TableHead>
                        <TableHead>Feeder</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Total Active Energy</TableHead>
                        <TableHead>Total Active Energy T1</TableHead>
                        <TableHead>Total Active Energy T2</TableHead>
                        <TableHead>Total Active Energy T3</TableHead>
                        <TableHead>Total Active Energy T4</TableHead>
                        <TableHead>Import Reactive Energy</TableHead>
                        <TableHead>Export Reactive Energy</TableHead>
                        <TableHead>Reactive Energy Q1</TableHead>
                        <TableHead>Reactive Energy Q2</TableHead>
                        <TableHead>Reactive Energy Q3</TableHead>
                        <TableHead>Reactive Energy Q4</TableHead>
                        <TableHead>Import Apparent Energy</TableHead>
                        <TableHead>Export Apparent Energy</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedData.map((row) => (
                        <TableRow key={row.sn}>
                            <TableCell>{row.sn}</TableCell>
                            <TableCell>{row.meterNo}</TableCell>
                            <TableCell>{row.region}</TableCell>
                            <TableCell>{row.businessUnit}</TableCell>
                            <TableCell>{row.serviceCenter}</TableCell>
                            <TableCell>{row.feeder}</TableCell>
                            <TableCell>{row.time}</TableCell>
                            <TableCell>{row.totalActiveEnergy}</TableCell>
                            <TableCell>{row.totalActiveEnergyT1}</TableCell>
                            <TableCell>{row.totalActiveEnergyT2}</TableCell>
                            <TableCell>{row.totalActiveEnergyT3}</TableCell>
                            <TableCell>{row.totalActiveEnergyT4}</TableCell>
                            <TableCell>{row.importReactiveEnergy}</TableCell>
                            <TableCell>{row.exportReactiveEnergy}</TableCell>
                            <TableCell>{row.reactiveEnergyQ1}</TableCell>
                            <TableCell>{row.reactiveEnergyQ2}</TableCell>
                            <TableCell>{row.reactiveEnergyQ3}</TableCell>
                            <TableCell>{row.reactiveEnergyQ4}</TableCell>
                            <TableCell>{row.importApparentEnergy}</TableCell>
                            <TableCell>{row.exportApparentEnergy}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="p-4">
                <PaginationControls
                    currentPage={currentPage}
                    totalItems={data.length}
                    pageSize={rowsPerPage}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={handlePageSizeChange}
                />
            </div>
        </div>
    );
}