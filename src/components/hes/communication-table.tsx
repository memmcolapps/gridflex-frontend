// components/CommunicationTable.tsx
"use client";
import { useState, useMemo } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { BanIcon, CircleCheck, EllipsisVertical, SendIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Label } from '../ui/label';
import { getStatusStyle } from '../status-style';
import { PaginationControls } from '../ui/pagination-controls';
import { useAllCommunicationReports } from '@/hooks/use-reports';
import { type CommunicationReportData } from '@/types/reports';

interface CommunicationTableProps {
    searchQuery?: string;
    activeTab?: 'MD' | 'Non-MD';
}

export function CommunicationTable({ searchQuery = "", activeTab = 'MD' }: CommunicationTableProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<CommunicationReportData | null>(null);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);

    const [isTokenDialogOpen, setIsTokenDialogOpen] = useState(false);
    const [token, setToken] = useState('');
    const [meterToTokenize, setMeterToTokenize] = useState<string | null>(null);

    // --- Start of added pagination state and handlers ---
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10)


    const { data: communicationReport, isLoading } = useAllCommunicationReports({
        type: activeTab,  
        page: currentPage - 1,  
        size: rowsPerPage,
        search: searchQuery
    });

    const filteredData = useMemo(() => {
        return communicationReport ?? [];
    }, [communicationReport]);

    const totalItems = filteredData.length;
    const paginatedData = filteredData;



    const handlePageSizeChange = (newPageSize: number) => {
        setRowsPerPage(newPageSize);
        setCurrentPage(1);
    };
    // --- End of added pagination state and handlers ---

    const handleRowClick = (rowData: CommunicationReportData) => {
        setSelectedRow(rowData);
        setDialogOpen(true);
    };

    const handleCheckboxChange = (meterNo: string, isChecked: boolean) => {
        if (isChecked) {
            setSelectedRows(prev => [...prev, meterNo]);
        } else {
            setSelectedRows(prev => prev.filter(mn => mn !== meterNo));
        }
    };

    const handleSelectAll = (isChecked: boolean) => {
        if (isChecked) {
            setSelectedRows(paginatedData.map(row => row.meterNo ?? ''));
        } else {
            setSelectedRows([]);
        }
    };

    const handleSendToken = (meterNo: string) => {
        setMeterToTokenize(meterNo);
        setIsTokenDialogOpen(true);
    };

    const handleTokenSubmit = () => {
        console.log(`Sending token: ${token} to meter: ${meterToTokenize}`);
        toast.success(`Successfully sent token to meter ${meterToTokenize}`);

        setToken('');
        setMeterToTokenize(null);
        setIsTokenDialogOpen(false);
    };

    // Determine which columns to show based on the data structure
    const hasMeterModel = paginatedData.length > 0 && paginatedData[0]?.meter?.smartMeterInfo?.meterModel != null;

    if (isLoading) {
        return <div className="p-4 text-center">Loading...</div>;
    }

    return (
        <div className="rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-10">
                            <Checkbox
                                checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                                className='mr-2 cursor-pointer'
                                onCheckedChange={handleSelectAll}
                            />
                        </TableHead>
                        <TableHead>S/N</TableHead>
                        <TableHead>Meter No.</TableHead>
                        {hasMeterModel && <TableHead>Meter Model</TableHead>}
                        <TableHead>Connection Type</TableHead>
                        <TableHead>Online Time</TableHead>
                        <TableHead>Offline Time</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedData.map((row, index) => (
                        <TableRow
                            key={row.meterNo || `row-${index}`}
                            onClick={(e) => {
                                if ((e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'BUTTON') {
                                    handleRowClick(row);
                                }
                            }}
                            className="cursor-pointer hover:bg-gray-50"
                        >
                            <TableCell onClick={(e) => e.stopPropagation()}>
                                <Checkbox
                                    checked={selectedRows.includes(row.meterNo ?? '')}
                                    className='mr-2 cursor-pointer'
                                    onCheckedChange={(checked) => handleCheckboxChange(row.meterNo ?? '', Boolean(checked))}
                                />
                            </TableCell>
                            <TableCell>{(currentPage - 1) * rowsPerPage + index + 1}</TableCell>
                            <TableCell>{row.meterNo}</TableCell>
                            {hasMeterModel && <TableCell>{row.meter?.smartMeterInfo?.meterModel}</TableCell>}
                            <TableCell>
                                <span className={getStatusStyle(row.connectionType)}>
                                    {row.connectionType}
                                </span>
                            </TableCell>
                            <TableCell>{row.onlineTime ? new Date(row.onlineTime).toLocaleString() : '-'}</TableCell>
                            <TableCell>{row.offlineTime ? new Date(row.offlineTime).toLocaleString() : '-'}</TableCell>
                            <TableCell>{row.updatedAt ? new Date(row.updatedAt).toLocaleString() : '-'}</TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className='p-0 focus:ring-gray-300/20'>
                                            <EllipsisVertical className="h-4 w-4" size={14} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-full p-3 shadow-lg">
                                        <DropdownMenuItem
                                            className="cursor-pointer"
                                            onClick={() => handleSendToken(row.meterNo ?? '')}
                                        >
                                            <SendIcon size={14} className="mr-2" /> Send Token
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination and row count controls */}
            <div className="p-4">
                <PaginationControls
                    currentPage={currentPage}
                    totalItems={totalItems}
                    pageSize={rowsPerPage}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={handlePageSizeChange}
                />
            </div>

            {/* View Details Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="bg-white p-6 w-full h-fit rounded-lg">
                    <DialogHeader>
                        <DialogTitle>View Details</DialogTitle>
                    </DialogHeader>
                    {selectedRow && (
                        <div className="grid gap-4 py-4 text-sm">
                            <div className="grid grid-cols-2 gap-2">
                                <Label className="font-semibold">Meter Number:</Label>
                                <span>{selectedRow.meterNo}</span>
                            </div>
                            {selectedRow.meter?.smartMeterInfo?.meterModel && (
                                <div className="grid grid-cols-2 gap-2">
                                    <Label className="font-semibold">Meter Model:</Label>
                                    <span>{selectedRow.meter.smartMeterInfo.meterModel}</span>
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-2">
                                <Label className="font-semibold">Connection Type:</Label>
                                <span>{selectedRow.connectionType}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <Label className="font-semibold">Online Time:</Label>
                                <span>{selectedRow.onlineTime ? new Date(selectedRow.onlineTime).toLocaleString() : '-'}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <Label className="font-semibold">Offline Time:</Label>
                                <span>{selectedRow.offlineTime ? new Date(selectedRow.offlineTime).toLocaleString() : '-'}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <Label className="font-semibold">Last Updated:</Label>
                                <span>{selectedRow.updatedAt ? new Date(selectedRow.updatedAt).toLocaleString() : '-'}</span>
                            </div>
                            {selectedRow.meter && (
                                <>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Label className="font-semibold">Account Number:</Label>
                                        <span>{selectedRow.meter.accountNumber}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Label className="font-semibold">Meter Class:</Label>
                                        <span>{selectedRow.meter.meterClass}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Label className="font-semibold">Customer ID:</Label>
                                        <span>{selectedRow.meter.customerId}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Send Token Dialog */}
            <Dialog open={isTokenDialogOpen} onOpenChange={setIsTokenDialogOpen}>
                <DialogContent className="bg-white p-6 w-full h-fit rounded-lg">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-lg">Send Token</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 text-sm">
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="token">
                                Token <span className="text-red-500">*</span>
                            </Label>
                            <input
                                id="token"
                                type="text"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                placeholder="Enter Token"
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#161CCA]/50 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="flex justify-between gap-2 mt-4">
                        <Button
                            variant="outline"
                            className='border-[#161CCA] text-[#161CCA] cursor-pointer'
                            onClick={() => {
                                setIsTokenDialogOpen(false);
                                setToken('');
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            className='bg-[#161CCA] text-white cursor-pointer'
                            onClick={handleTokenSubmit}
                            disabled={token.length === 0}
                        >
                            Proceed
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}