// components/CommunicationTable.tsx
"use client";
import { useState, useEffect } from 'react';
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

interface RowData {
    sn: string;
    meterNo: string;
    meterModel?: string;
    status: string;
    lastSync: string;
    tamperState: string;
    tamperSync: string;
    relayControl: 'Connected' | 'Disconnected';
    relaySync: string;
    category?: 'Prepaid' | 'PostPaid';
}

interface CommunicationTableProps {
    data: RowData[];
    searchQuery?: string;
}

// Initial dummy data for the MD table
export const mdData: RowData[] = [
    { sn: '01', meterNo: '6212456987', meterModel: 'MMX 310-NG', status: 'Offline', lastSync: '1:32am', tamperState: 'No Tamper', tamperSync: '2:30am', relayControl: 'Disconnected', relaySync: '2:30am' },
    { sn: '02', meterNo: '6212456987', meterModel: 'MMX 110-NG', status: 'Online', lastSync: '1:00am', tamperState: 'Tamper Detected', tamperSync: '1:32am', relayControl: 'Disconnected', relaySync: '1:32am' },
    { sn: '03', meterNo: '6212456987', meterModel: 'MMX 110-NG', status: 'Offline', lastSync: '1:00am', tamperState: 'No Tamper', tamperSync: '1:00am', relayControl: 'Disconnected', relaySync: '1:00am' },
    { sn: '04', meterNo: '6212456987', meterModel: 'MMX 110-NG', status: 'Online', lastSync: '1:00am', tamperState: 'No Tamper', tamperSync: '1:00am', relayControl: 'Connected', relaySync: '1:00am' },
    { sn: '05', meterNo: '6212456987', meterModel: 'MMX 310-NG', status: 'Online', lastSync: '1:00am', tamperState: 'No Tamper', tamperSync: '1:00am', relayControl: 'Connected', relaySync: '1:00am' },
    { sn: '06', meterNo: '6212456987', meterModel: 'MMX 110-NG', status: 'Offline', lastSync: '1:00am', tamperState: 'No Tamper', tamperSync: '1:00am', relayControl: 'Connected', relaySync: '1:00am' },
    { sn: '07', meterNo: '6212456987', meterModel: 'MMX 110-NG', status: 'Online', lastSync: '1:00am', tamperState: 'No Tamper', tamperSync: '1:00am', relayControl: 'Connected', relaySync: '1:00am' },
    { sn: '08', meterNo: '6212456987', meterModel: 'MMX 310-NG', status: 'Online', lastSync: '1:00am', tamperState: 'No Tamper', tamperSync: '1:00am', relayControl: 'Connected', relaySync: '1:00am' },
    { sn: '09', meterNo: '6212456987', meterModel: 'MMX 110-NG', status: 'Online', lastSync: '1:00am', tamperState: 'No Tamper', tamperSync: '1:00am', relayControl: 'Connected', relaySync: '1:00am' },
    { sn: '10', meterNo: '6212456987', meterModel: 'MMX 110-NG', status: 'Online', lastSync: '1:00am', tamperState: 'No Tamper', tamperSync: '1:00am', relayControl: 'Connected', relaySync: '1:00am' },
];

// New dummy data for the non-MD table
export const nonMdData: RowData[] = [
    { sn: '01', meterNo: '6212456987', category: 'Prepaid', status: 'Offline', lastSync: '1:32am', tamperState: 'No Tamper', tamperSync: '2:30am', relayControl: 'Disconnected', relaySync: '2:30am' },
    { sn: '02', meterNo: '6212456987', category: 'PostPaid', status: 'Online', lastSync: '1:00am', tamperState: 'Tamper Detected', tamperSync: '1:32am', relayControl: 'Disconnected', relaySync: '1:32am' },
    { sn: '03', meterNo: '6212456987', category: 'PostPaid', status: 'Offline', lastSync: '1:00am', tamperState: 'No Tamper', tamperSync: '1:00am', relayControl: 'Disconnected', relaySync: '1:00am' },
    { sn: '04', meterNo: '6212456987', category: 'Prepaid', status: 'Online', lastSync: '1:00am', tamperState: 'No Tamper', tamperSync: '1:00am', relayControl: 'Connected', relaySync: '1:00am' },
    { sn: '05', meterNo: '6212456987', category: 'PostPaid', status: 'Online', lastSync: '1:00am', tamperState: 'No Tamper', tamperSync: '1:00am', relayControl: 'Connected', relaySync: '1:00am' },
    { sn: '06', meterNo: '6212456987', category: 'Prepaid', status: 'Offline', lastSync: '1:00am', tamperState: 'No Tamper', tamperSync: '1:00am', relayControl: 'Connected', relaySync: '1:00am' },
    { sn: '07', meterNo: '6212456987', category: 'Prepaid', status: 'Online', lastSync: '1:00am', tamperState: 'No Tamper', tamperSync: '1:00am', relayControl: 'Connected', relaySync: '1:00am' },
    { sn: '08', meterNo: '6212456987', category: 'PostPaid', status: 'Online', lastSync: '1:00am', tamperState: 'No Tamper', tamperSync: '1:00am', relayControl: 'Connected', relaySync: '1:00am' },
    { sn: '09', meterNo: '6212456987', category: 'Prepaid', status: 'Online', lastSync: '1:00am', tamperState: 'No Tamper', tamperSync: '1:00am', relayControl: 'Connected', relaySync: '1:00am' },
    { sn: '10', meterNo: '6212456987', category: 'PostPaid', status: 'Offline', lastSync: '1:00am', tamperState: 'No Tamper', tamperSync: '1:00am', relayControl: 'Connected', relaySync: '1:00am' },
];

// The rest of your component remains the same.
export function CommunicationTable({ data, searchQuery = "" }: CommunicationTableProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [tableData, setTableData] = useState<RowData[]>(data);

    // This is important to update the table data when the `data` prop changes
    useEffect(() => {
        setTableData(data);
    }, [data]);

    // Filter data based on search query
    const filteredData = tableData.filter((item) => {
        if (!searchQuery) return true;
        const searchLower = searchQuery.toLowerCase();
        return (
            item.meterNo?.toLowerCase().includes(searchLower) ??
            item.status?.toLowerCase().includes(searchLower) ??
            item.meterModel?.toLowerCase().includes(searchLower) ??
            item.category?.toLowerCase().includes(searchLower)
        );
    });

    const [isTokenDialogOpen, setIsTokenDialogOpen] = useState(false);
    const [token, setToken] = useState('');
    const [meterToTokenize, setMeterToTokenize] = useState<string | null>(null);

    // --- Start of added pagination state and handlers ---
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const totalItems = filteredData.length;
    const paginatedData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        (currentPage - 1) * rowsPerPage + rowsPerPage
    );


    const handlePageSizeChange = (newPageSize: number) => {
        setRowsPerPage(newPageSize);
        setCurrentPage(1);
    };
    // --- End of added pagination state and handlers ---

    const handleRowClick = (rowData: RowData) => {
        setSelectedRow(rowData);
        setDialogOpen(true);
    };

    const handleCheckboxChange = (sn: string, isChecked: boolean) => {
        if (isChecked) {
            setSelectedRows(prev => [...prev, sn]);
        } else {
            setSelectedRows(prev => prev.filter(rowSn => rowSn !== sn));
        }
    };

    const handleSelectAll = (isChecked: boolean) => {
        if (isChecked) {
            setSelectedRows(paginatedData.map(row => row.sn));
        } else {
            setSelectedRows([]);
        }
    };

    const handleConnectRelay = (sn: string) => {
        setTableData(prevData =>
            prevData.map(row =>
                row.sn === sn ? { ...row, relayControl: 'Connected' } : row
            )
        );
        toast.success(`Successfully connected relay for meter ${sn}`);
    };

    const handleDisconnectRelay = (sn: string) => {
        setTableData(prevData =>
            prevData.map(row =>
                row.sn === sn ? { ...row, relayControl: 'Disconnected' } : row
            )
        );
        toast.error(`Successfully disconnected relay for meter ${sn}`);
    };

    const handleSendToken = (sn: string) => {
        setMeterToTokenize(sn);
        setIsTokenDialogOpen(true);
    };

    const handleTokenSubmit = () => {
        console.log(`Sending token: ${token} to meter: ${meterToTokenize}`);
        toast.success(`Successfully sent token to meter ${meterToTokenize}`);

        setToken('');
        setMeterToTokenize(null);
        setIsTokenDialogOpen(false);
    };

    const hasCategory = tableData.length > 0 && tableData[0]?.category != null;
    const hasMeterModel = tableData.length > 0 && tableData[0]?.meterModel != null;

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
                        {hasCategory && <TableHead>Category</TableHead>}
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
                    {paginatedData.map((row) => (
                        <TableRow
                            key={row.sn}
                            onClick={(e) => {
                                if ((e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'BUTTON') {
                                    handleRowClick(row);
                                }
                            }}
                            className="cursor-pointer hover:bg-gray-50"
                        >
                            <TableCell onClick={(e) => e.stopPropagation()}>
                                <Checkbox
                                    checked={selectedRows.includes(row.sn)}
                                    className='mr-2 cursor-pointer'
                                    onCheckedChange={(checked) => handleCheckboxChange(row.sn, Boolean(checked))}
                                />
                            </TableCell>
                            <TableCell>{row.sn}</TableCell>
                            <TableCell>{row.meterNo}</TableCell>
                            {hasCategory && <TableCell>{row.category}</TableCell>}
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
                                                onClick={() => handleConnectRelay(row.sn)}
                                            >
                                                <CircleCheck size={14} className="mr-2" /> Connect Relay
                                            </DropdownMenuItem>
                                        ) : (
                                            <>
                                                <DropdownMenuItem
                                                    className="cursor-pointer"
                                                    onClick={() => handleDisconnectRelay(row.sn)}
                                                >
                                                    <BanIcon size={14} className="mr-2" /> Disconnect Relay
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="cursor-pointer"
                                                    onClick={() => handleSendToken(row.sn)}
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
                            {selectedRow.category && (
                                <div className="grid grid-cols-2 gap-2">
                                    <Label className="font-semibold">Category:</Label>
                                    <span>{selectedRow.category}</span>
                                </div>
                            )}
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