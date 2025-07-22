import { SetStateAction, useState } from 'react';
import { Card } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Ban, CheckCircle, EyeIcon, MoreVertical } from 'lucide-react';
import ViewMeterDetailsDialog from '@/components/reviewandapproval/viewmetersdetailsdialog';
import ConfirmDialog from '@/components/reviewandapproval/confirmapprovaldialog';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type MeterItem = {
    id: number;
    meterNo: string;
    simNumber: string;
    oldSGC: string;
    newSGC: string;
    manufacturer: string;
    metertype: string;
    class: string;
    category: string;
    changeDescription: string;
    approvalStatus: string;
    reason?: string;
    oldkrn?: string;
    newkrn?: string;
    oldTariffIndex?: string;
    newTariffIndex?: string;
    imageUrl?: string;
};

interface MeterTableProps {
    searchTerm?: string;
    sortConfig?: { key: string; direction: string };
    filters?: Record<string, string[]>;
}

const MeterTable = ({ searchTerm = '', sortConfig = { key: '', direction: 'asc' }, filters = {} }: MeterTableProps) => {
    const [selectedRow, setSelectedRow] = useState<MeterItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMeters, setSelectedMeters] = useState<number[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null);
    const [selectedItem, setSelectedItem] = useState<MeterItem | null>(null);
    const [dropdownOpenId, setDropdownOpenId] = useState<number | null>(null);

    // Sample data with 7 records based on the uploaded images
    const data: MeterItem[] = [
        {
            id: 1,
            meterNo: '620102123',
            simNumber: '890060873404',
            oldSGC: '999962',
            newSGC: '600894',
            manufacturer: 'Momas',
            class: 'MD',
            category: 'Prepaid',
            changeDescription: 'Meter Allocated',
            approvalStatus: 'Pending',
            oldkrn: '1234567',
            newkrn: '1234567',
            oldTariffIndex: '1',
            newTariffIndex: '3',
            metertype: 'Electricity',
        },
        {
            id: 2,
            meterNo: '620102123',
            simNumber: '890060873404',
            oldSGC: '999962',
            newSGC: '600894',
            manufacturer: 'Momas',
            class: 'Single Phase',
            category: 'Prepaid',
            changeDescription: 'Meter Assigned',
            approvalStatus: 'Pending',
            oldkrn: '1234567',
            newkrn: '1234567',
            oldTariffIndex: '1',
            newTariffIndex: '3',
            metertype: 'Electricity',
        },
        {
            id: 3,
            meterNo: '620102123',
            simNumber: '890060873404',
            oldSGC: '999962',
            newSGC: '600894',
            manufacturer: 'Momas',
            class: 'MD',
            category: 'Prepaid',
            changeDescription: 'Meter Detached',
            approvalStatus: 'Pending',
            oldkrn: '1234567',
            newkrn: '1234567',
            oldTariffIndex: '1',
            newTariffIndex: '3',
            metertype: 'Electricity'
        },
        {
            id: 4,
            meterNo: '620102123',
            simNumber: '890060873404',
            oldSGC: '999962',
            newSGC: '600894',
            manufacturer: 'Momas',
            class: 'Single Phase',
            category: 'Prepaid',
            changeDescription: 'Meter Migrated',
            approvalStatus: 'Pending',
            oldkrn: '1234567',
            newkrn: '1234567',
            oldTariffIndex: '1',
            newTariffIndex: '3',
            metertype: 'Electricity',
        },
        {
            id: 5,
            meterNo: '620102123',
            simNumber: '890060873404',
            oldSGC: '999962',
            newSGC: '600894',
            manufacturer: 'Momas',
            class: 'Three Phase',
            category: 'Prepaid',
            changeDescription: 'Meter Deactivated',
            approvalStatus: 'Pending',
            oldkrn: '1234567',
            newkrn: '1234567',
            oldTariffIndex: '1',
            newTariffIndex: '3',
            metertype: 'Electricity',
        },


        {
            id: 6,
            meterNo: '620102123',
            simNumber: '890060873404',
            oldSGC: '999962',
            newSGC: '600894',
            manufacturer: 'Momas',
            class: 'Three Phase',
            category: 'Prepaid',
            changeDescription: 'Newly Added',
            approvalStatus: 'Pending',
            oldkrn: '1234567',
            newkrn: '1234567',
            oldTariffIndex: '1',
            newTariffIndex: '3',
            metertype: 'Electricity',
        },
        {
            id: 7,
            meterNo: '620102123',
            simNumber: '890060873404',
            oldSGC: '999962',
            newSGC: '600894',
            manufacturer: 'Momas',
            class: 'MD',
            category: 'Prepaid',
            changeDescription: 'Meter Edited',
            approvalStatus: 'Pending',
            oldkrn: '1234567',
            newkrn: '1234567',
            oldTariffIndex: '1',
            newTariffIndex: '3',
            metertype: 'Electricity',
        },
    ];

    // Apply search and filters
    const filteredData = data.filter((item) => {
        const matchesSearch = searchTerm
            ? item.meterNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.simNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.changeDescription.toLowerCase().includes(searchTerm.toLowerCase())
            : true;

        const matchesFilters = filters.status?.length
            ? filters.status.includes(item.approvalStatus.toLowerCase())
            : true;

        return matchesSearch && matchesFilters;
    });

    // Apply sorting
    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortConfig.key) return 0;
        const aValue = a[sortConfig.key as keyof MeterItem] ?? '';
        const bValue = b[sortConfig.key as keyof MeterItem] ?? '';
        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        return 0;
    });

    const totalPages = Math.ceil(sortedData.length / rowsPerPage);

    const handlePrevious = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNext = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handleRowsPerPageChange = (value: string) => {
        setRowsPerPage(Number(value));
        setCurrentPage(1);
    };

    const paginatedData = sortedData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const toggleSelection = (id: number) => {
        setSelectedMeters((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleViewDetails = (item: MeterItem) => {
        console.log('View details clicked:', item);
        setSelectedRow(item);
        setIsModalOpen(true);
        setDropdownOpenId(null);
    };

    const handleApprove = (item: MeterItem) => {
        console.log('Opening confirm modal for approve:', item);
        setSelectedItem(item);
        setConfirmAction('approve');
        setIsModalOpen(false);
        setIsConfirmOpen(true);
        setDropdownOpenId(null);
    };

    const handleReject = (item: MeterItem) => {
        console.log('Opening confirm modal for reject:', item);
        setSelectedItem(item);
        setConfirmAction('reject');
        setIsModalOpen(false);
        setIsConfirmOpen(true);
        setDropdownOpenId(null);
    };

    const handleConfirmAction = () => {
        console.log('Confirm action triggered:', confirmAction, selectedItem);
        if (selectedItem && confirmAction) {
            console.log(`${confirmAction === 'approve' ? 'Approve' : 'Reject'}:`, selectedItem);
            // Add your actual approve/reject logic here (e.g., API call)
        }
        setIsConfirmOpen(false);
        setConfirmAction(null);
        setSelectedItem(null);
    };

    return (
        <Card className="border-none shadow-none bg-white overflow-x-auto">
            <Table className="table-auto w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead className="px-4 py-3 w-[100px]">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    className="h-4 w-4 border-gray-500"
                                    checked={selectedMeters.length === sortedData.length && sortedData.length > 0}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setSelectedMeters(sortedData.map((item) => item.id));
                                        } else {
                                            setSelectedMeters([]);
                                        }
                                    }}
                                />
                                <span className="text-sm font-medium text-gray-900">S/N</span>
                            </div>
                        </TableHead>
                        <TableHead className="px-4 py-3 w-[120px] text-sm font-medium text-gray-900">Meter No</TableHead>
                        <TableHead className="px-4 py-3 w-[150px] text-sm font-medium text-gray-900">SIM Number</TableHead>
                        <TableHead className="px-4 py-3 w-[120px] text-sm font-medium text-gray-900">Old SGC</TableHead>
                        <TableHead className="px-4 py-3 w-[120px] text-sm font-medium text-gray-900">New SGC</TableHead>
                        <TableHead className="px-4 py-3 w-[150px] text-sm font-medium text-gray-900">Manufacturer</TableHead>
                        <TableHead className="px-4 py-3 w-[120px] text-sm font-medium text-gray-900">Class</TableHead>
                        <TableHead className="px-4 py-3 w-[120px] text-sm font-medium text-gray-900">Category</TableHead>
                        <TableHead className="px-4 py-3 w-[150px] text-sm font-medium text-gray-900">Change Description</TableHead>
                        <TableHead className="px-4 py-3 w-[120px] text-sm font-medium text-gray-900 text-center">Approval Status</TableHead>
                        <TableHead className="px-4 py-3 w-[80px] text-sm font-medium text-gray-900 text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedData.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={11} className="h-24 text-center text-sm text-gray-500">
                                No data available
                            </TableCell>
                        </TableRow>
                    ) : (
                        paginatedData.map((item, index) => (
                            <TableRow key={item.id} className="hover:bg-gray-50 cursor-pointer">
                                <TableCell className="px-4 py-3 w-[100px]">
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            className="h-4 w-4 border-gray-500"
                                            id={`select-${item.id}`}
                                            checked={selectedMeters.includes(item.id)}
                                            onCheckedChange={() => toggleSelection(item.id)}
                                        />
                                        <span className="text-sm text-gray-900">
                                            {index + 1 + (currentPage - 1) * rowsPerPage}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 py-3 w-[120px] text-sm text-gray-900">{item.meterNo}</TableCell>
                                <TableCell className="px-4 py-3 w-[150px] text-sm text-gray-900">{item.simNumber}</TableCell>
                                <TableCell className="px-4 py-3 w-[120px] text-sm text-gray-900">{item.oldSGC}</TableCell>
                                <TableCell className="px-4 py-3 w-[120px] text-sm text-gray-900">{item.newSGC}</TableCell>
                                <TableCell className="px-4 py-3 w-[150px] text-sm text-gray-900">{item.manufacturer}</TableCell>
                                <TableCell className="px-4 py-3 w-[120px] text-sm text-gray-900">{item.class}</TableCell>
                                <TableCell className="px-4 py-3 w-[120px] text-sm text-gray-900">{item.category}</TableCell>
                                <TableCell className="px-4 py-3 w-[150px] text-sm text-[#161CCA]">{item.changeDescription}</TableCell>
                                <TableCell className="px-4 py-3 w-[120px] text-center">
                                    <span className="inline-block px-3 py-1 text-sm font-medium text-[#C86900] bg-[#FFF5EA] rounded-full">
                                        {item.approvalStatus}
                                    </span>
                                </TableCell>
                                <TableCell className="px-4 py-3 w-[80px] text-right">
                                    <DropdownMenu
                                        open={dropdownOpenId === item.id}
                                        onOpenChange={(open) => setDropdownOpenId(open ? item.id : null)}
                                    >
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 cursor-pointer">
                                                <MoreVertical size={14} className="text-gray-500" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-fit bg-white shadow-lg">
                                            <DropdownMenuItem
                                                className="flex items-center gap-2 cursor-pointer"
                                                onSelect={(e) => e.preventDefault()}
                                                onClick={() => handleViewDetails(item)}
                                            >
                                                <EyeIcon size={14} />
                                                <span className="text-sm text-gray-700">View Details</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="flex items-center gap-2 cursor-pointer"
                                                onSelect={(e) => e.preventDefault()}
                                                onClick={() => handleApprove(item)}
                                            >
                                                <CheckCircle size={14} />
                                                <span className="text-sm text-gray-700">Approve</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="flex items-center gap-2 cursor-pointer"
                                                onSelect={(e) => e.preventDefault()}
                                                onClick={() => handleReject(item)}
                                            >
                                                <Ban size={14} />
                                                <span className="text-sm text-gray-700">Reject</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            <Pagination className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Rows per page</span>
                    <Select
                        value={rowsPerPage.toString()}
                        onValueChange={handleRowsPerPageChange}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={rowsPerPage.toString()} />
                        </SelectTrigger>
                        <SelectContent
                            position="popper"
                            side="top"
                            align="center"
                            className="mb-1 ring-gray-50"
                        >
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="24">24</SelectItem>
                            <SelectItem value="48">48</SelectItem>
                        </SelectContent>
                    </Select>
                    <span className="text-sm font-medium">
                        {(currentPage - 1) * rowsPerPage + 1}-
                        {Math.min(currentPage * rowsPerPage, sortedData.length)} of {sortedData.length}
                    </span>
                </div>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handlePrevious();
                            }}
                            aria-disabled={currentPage === 1}
                        />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handleNext();
                            }}
                            aria-disabled={currentPage === totalPages}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>

            <ViewMeterDetailsDialog
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                selectedRow={selectedRow}
                onApprove={handleApprove}
                onReject={handleReject}
            />

            <ConfirmDialog
                isOpen={isConfirmOpen}
                onOpenChange={setIsConfirmOpen}
                action={confirmAction ?? 'approve'}
                onConfirm={handleConfirmAction}
            />
        </Card>
    );
};

export default MeterTable;