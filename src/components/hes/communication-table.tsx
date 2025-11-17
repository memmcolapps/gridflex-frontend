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

    const handleCheckboxChange = (serialNumber: string, isChecked: boolean) => {
        if (isChecked) {
            setSelectedRows(prev => [...prev, serialNumber]);
        } else {
            setSelectedRows(prev => prev.filter(sn => sn !== serialNumber));
        }
    };

    const handleSelectAll = (isChecked: boolean) => {
        if (isChecked) {
            setSelectedRows(paginatedData.map(row => row.serialNumber ?? ''));
        } else {
            setSelectedRows([]);
        }
    };

    const handleConnectRelay = (serialNumber: string) => {
        toast.success(`Successfully connected relay for meter ${serialNumber}`);
    };

    const handleDisconnectRelay = (serialNumber: string) => {
        toast.error(`Successfully disconnected relay for meter ${serialNumber}`);
    };

    const handleSendToken = (serialNumber: string) => {
        setMeterToTokenize(serialNumber);
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
    // const hasCategory = paginatedData.length > 0 && paginatedData[0]?.category != null;
    const hasMeterModel = paginatedData.length > 0 && paginatedData[0]?.meterModel != null;

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
                        {/* {hasCategory && <TableHead>Category</TableHead>} */}
                        {hasMeterModel && <TableHead>Meter Model</TableHead>}
                        <TableHead>Status</TableHead>
                        <TableHead>Last Sync</TableHead>
                        <TableHead>Tamper State</TableHead>
                        <TableHead>Tamper Sync</TableHead>
                        <TableHead>Relay Control</TableHead>
                        <TableHead>Relay Sync</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedData.map((row, index) => (
                        <TableRow
                            key={row.serialNumber}
                            onClick={(e) => {
                                if ((e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'BUTTON') {
                                    handleRowClick(row);
                                }
                            }}
                            className="cursor-pointer hover:bg-gray-50"
                        >
                            <TableCell onClick={(e) => e.stopPropagation()}>
                                <Checkbox
                                    checked={selectedRows.includes(row.serialNumber ?? '')}
                                    className='mr-2 cursor-pointer'
                                    onCheckedChange={(checked) => handleCheckboxChange(row.serialNumber ?? '', Boolean(checked))}
                                />
                            </TableCell>
                            <TableCell>{(currentPage - 1) * rowsPerPage + index + 1}</TableCell>
                            <TableCell>{row.meterNo}</TableCell>
                            {/* {hasCategory && <TableCell>{row.category}</TableCell>} */}
                            {hasMeterModel && <TableCell>{row.meterModel}</TableCell>}
                            <TableCell>
                                <span className={getStatusStyle(row.status)}>
                                    {row.status}
                                </span>
                            </TableCell>
                            <TableCell>{row.lastSync}</TableCell>
                            <TableCell>{row.tamperState}</TableCell>
                            <TableCell>{row.tamperSync}</TableCell>
                            <TableCell>
                                <span className={getStatusStyle(row.relayControl)}>
                                    {row.relayControl}
                                </span>
                            </TableCell>
                            <TableCell>{row.relaySync}</TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className='p-0 focus:ring-gray-300/20'>
                                            <EllipsisVertical className="h-4 w-4" size={14} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-full p-3 shadow-lg">
                                        {row.relayControl === 'Disconnected' ? (
                                            <DropdownMenuItem
                                                className="cursor-pointer"
                                                onClick={() => handleConnectRelay(row.serialNumber ?? '')}
                                            >
                                                <CircleCheck size={14} className="mr-2" /> Connect Relay
                                            </DropdownMenuItem>
                                        ) : (
                                            <>
                                                <DropdownMenuItem
                                                    className="cursor-pointer"
                                                    onClick={() => handleDisconnectRelay(row.serialNumber ?? '')}
                                                >
                                                    <BanIcon size={14} className="mr-2" /> Disconnect Relay
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="cursor-pointer"
                                                    onClick={() => handleSendToken(row.serialNumber ?? '')}
                                                >
                                                    <SendIcon size={14} className="mr-2" /> Send Token
                                                </DropdownMenuItem>
                                            </>
                                        )}
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
                            {/* {selectedRow.category && (
                                <div className="grid grid-cols-2 gap-2">
                                    <Label className="font-semibold">Category:</Label>
                                    <span>{selectedRow.category}</span>
                                </div>
                            )} */}
                            {selectedRow.meterModel && (
                                <div className="grid grid-cols-2 gap-2">
                                    <Label className="font-semibold">Meter Model:</Label>
                                    <span>{selectedRow.meterModel}</span>
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-2">
                                <Label className="font-semibold">Status:</Label>
                                <span>{selectedRow.status}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <Label className="font-semibold">Last Sync:</Label>
                                <span>{selectedRow.lastSync}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <Label className="font-semibold">Tamper State:</Label>
                                <span>{selectedRow.tamperState}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <Label className="font-semibold">Tamper Sync:</Label>
                                <span>{selectedRow.tamperSync}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <Label className="font-semibold">Relay Control:</Label>
                                <span>{selectedRow.relayControl}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <Label className="font-semibold">Relay Sync:</Label>
                                <span>{selectedRow.relaySync}</span>
                            </div>
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