'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { ArrowRightLeft, ArrowUpDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter, CirclePlus } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { PaginationContent } from '@/components/ui/pagination';
import { Card } from '@/components/ui/card';
import { ContentHeader } from '@/components/ui/content-header';

// Sample data type (adjust based on your actual data)
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

// Sample data (replace with your actual data fetching)
const initialMeters: MeterData[] = [
    { id: 1, meterNumber: '61245269523', manufactureName: 'Momas', model: 'Mem 3-ph', meterId: 'Ojoo', meterType: 'Electricity', category: 'Prepaid', dateAdded: '09-04-2025', actions: '' },
    { id: 2, meterNumber: '61245269523', manufactureName: 'Momas', model: 'Mem 3-ph', meterId: 'Ojoo', meterType: 'Electricity', category: 'Prepaid', dateAdded: '09-04-2025', actions: '' },
    { id: 3, meterNumber: '61245269523', manufactureName: 'Momas', model: 'Mem 3-ph', meterId: 'Ojoo', meterType: 'Gas', category: 'Prepaid', dateAdded: '09-04-2025', actions: '' },
    { id: 4, meterNumber: '61245269523', manufactureName: 'Momas', model: 'Mem 1-ph', meterId: 'Ojoo', meterType: 'Electricity', category: 'Postpaid', dateAdded: '09-04-2025', actions: '' },
    { id: 5, meterNumber: '61245269523', manufactureName: 'Momas', model: 'Mem 1-ph', meterId: 'Ojoo', meterType: 'Water', category: 'Prepaid', dateAdded: '09-04-2025', actions: '' },
    { id: 6, meterNumber: '61245269523', manufactureName: 'Momas', model: 'Mem 1-ph', meterId: 'Ojoo', meterType: 'Electricity', category: 'Prepaid', dateAdded: '09-04-2025', actions: '' },
    { id: 7, meterNumber: '61245269523', manufactureName: 'Mojec', model: 'Mem 3-ph', meterId: 'Ojoo', meterType: 'Electricity', category: 'Postpaid', dateAdded: '09-04-2025', actions: '' },
    { id: 8, meterNumber: '61245269523', manufactureName: 'Mojec', model: 'Mem 3-ph', meterId: 'Ojoo', meterType: 'Electricity', category: 'Postpaid', dateAdded: '09-04-2025', actions: '' },
    { id: 9, meterNumber: '61245269523', manufactureName: 'Mojec', model: 'Mem 1-ph', meterId: 'Ojoo', meterType: 'Electricity', category: 'Postpaid', dateAdded: '09-04-2025', actions: '' },
    { id: 10, meterNumber: '61245269523', manufactureName: 'Heixing', model: 'Mem 3-ph', meterId: 'Ojoo', meterType: 'Electricity', category: 'Postpaid', dateAdded: '09-04-2025', actions: '' },
    { id: 11, meterNumber: '61245269523', manufactureName: 'Heixing', model: 'Mem 3-ph', meterId: 'Ojoo', meterType: 'Electricity', category: 'Postpaid', dateAdded: '09-04-2025', actions: '' },
];

export default function AllocateMetersPage() {
    const [meters] = useState<MeterData[]>(initialMeters);
    const [selectedMeters, setSelectedMeters] = useState<number[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [currentPage] = useState<number>(1);

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

    return (
        <div className="p-6 h-screen">
            <div className="flex items-center justify-between mb-4">
                <ContentHeader
                    title="Allocate Meter"
                    description='Manage and access meter allocation.' />
                <Button
                    size={"lg"}
                    className="bg-[#161CCA] text-white text-md font-semibold rounded-md shadow-sm hover:translate-0.5 cursor-pointer transition-transform duration-200 ease-in-out active:scale-95">
                    <CirclePlus size={14} strokeWidth={2.5} />
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

            <div className="bg-white h-3/5 rounded-md shadow-sm border border-gray-200">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox
                                    className='border-gray-500'
                                    checked={isAllSelected}
                                    onCheckedChange={handleSelectAll}
                                    aria-label="Select all meters"
                                />
                            </TableHead>
                            <TableHead>S/N</TableHead>
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
                                <TableCell className="w-12">
                                    <Checkbox
                                        className='border-gray-500'
                                        checked={selectedMeters.includes(meter.id)}
                                        onCheckedChange={(checked) => handleSelectItem(checked as boolean, meter.id)}
                                        aria-label={`Select meter ${meter.meterNumber}`}
                                    />
                                </TableCell>
                                <TableCell>{startIndex + index + 1}</TableCell>
                                <TableCell>{meter.meterNumber}</TableCell>
                                <TableCell>{meter.manufactureName}</TableCell>
                                <TableCell>{meter.model}</TableCell>
                                <TableCell>{meter.meterId}</TableCell>
                                <TableCell>{meter.meterType}</TableCell>
                                <TableCell>{meter.category}</TableCell>
                                <TableCell>{meter.dateAdded}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon">
                                        <ArrowRightLeft size={16} strokeWidth={2.5} className="text-gray-600" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {currentMeters.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={10} className="text-center py-4 text-gray-500">
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
                    <span>{`${startIndex + 1}-${Math.min(endIndex, meters.length)} of ${meters.length} row${meters.length !== 1 ? 's' : ''}`}</span>
                </div>
                <PaginationContent
                />
            </div>
        </div>
    );
}