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
import ViewTariffDetailsDialog from '@/components/reviewandapproval/viewtariffdetailsdialog';
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

type TariffItem = {
    id: number;
    tariffName: string;
    tariffId: string;
    tariffType: string;
    bandCode: string;
    tariffRate: string;
    effectiveDate: string;
    changeDescription: string;
    approvalStatus: string;
    newTariffName?: string;
    newTariffId?: string;
    newTariffType?: string;
    newBandCode?: string;
    newTariffRate?: string;
    newEffectiveDate?: string;
};

interface TariffTableProps {
    searchTerm?: string;
    sortConfig?: { key: string; direction: string };
    filters?: Record<string, string[]>;
}

const TariffTable = ({ searchTerm = '', sortConfig = { key: '', direction: 'asc' }, filters = {} }: TariffTableProps) => {
    const [selectedRow, setSelectedRow] = useState<TariffItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTariffs, setSelectedTariffs] = useState<number[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null);
    const [selectedItem, setSelectedItem] = useState<TariffItem | null>(null);
    const [dropdownOpenId, setDropdownOpenId] = useState<number | null>(null);

    // Sample data with 5 records
    const data: TariffItem[] = [
        {
            id: 1,
            tariffName: 'Tariff A1',
            tariffId: 'C134',
            tariffType: 'R1',
            bandCode: 'Band A',
            tariffRate: '250',
            effectiveDate: '2025-01-01',
            changeDescription: 'Tariff Edited',
            approvalStatus: 'Pending',
            newTariffName: 'Residential Standard',
            newTariffId: 'T002',
            newTariffType: 'Residential',
            newBandCode: 'Band B',
            newTariffRate: '255',
            newEffectiveDate: '2025-02-01',
        },
        {
            id: 2,
            tariffName: 'Tariff A1',
            tariffId: 'C902',
            tariffType: 'R2',
            bandCode: 'Band A',
            tariffRate: '250',
            effectiveDate: '2025-01-01',
            changeDescription: 'Tariff Deactivated',
            approvalStatus: 'Pending',
            newTariffRate: '$0.00/kWh',
            newEffectiveDate: '2025-01-01',
        },
        {
            id: 3,
            tariffName: 'Tariff A1',
            tariffId: 'C455',
            tariffType: 'R3',
            bandCode: 'Band C',
            tariffRate: '250',
            effectiveDate: '2025-01-01',
            changeDescription: 'Newly Added',
            approvalStatus: 'Pending',
        },
        {
            id: 4,
            tariffName: 'Tariff A1',
            tariffId: 'C784',
            tariffType: 'C1',
            bandCode: 'Band B',
            tariffRate: '250',
            effectiveDate: '2025-01-01',
            changeDescription: 'Tariff Activated',
            approvalStatus: 'Pending',
        },
        {
            id: 5,
            tariffName: 'Tariff A1',
            tariffId: 'C895',
            tariffType: 'C2',
            bandCode: 'Band A',
            tariffRate: '250',
            effectiveDate: '2025-01-01',
            changeDescription: 'Tariff Edited',
            approvalStatus: 'Pending',
            newTariffRate: '$0.17/kWh',
            newEffectiveDate: '2025-02-01',
        },
    ];

    // Apply search and filters
    const filteredData = data.filter((item) => {
        const matchesSearch = searchTerm
            ? item.tariffName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.tariffId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.changeDescription?.toLowerCase().includes(searchTerm.toLowerCase())
            : true;

        const matchesFilters = filters.status?.length
            ? filters.status.includes(item.approvalStatus.toLowerCase())
            : true;

        return matchesSearch && matchesFilters;
    });

    // Apply sorting
    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortConfig.key) return 0;
        const aValue = a[sortConfig.key as keyof TariffItem] ?? '';
        const bValue = b[sortConfig.key as keyof TariffItem] ?? '';
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
        setSelectedTariffs((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleViewDetails = (item: TariffItem) => {
        console.log('View details clicked:', item);
        setSelectedRow(item);
        setIsModalOpen(true);
        setDropdownOpenId(null);
    };

    const handleApprove = (item: TariffItem) => {
        console.log('Opening confirm modal for approve:', item);
        setSelectedItem(item);
        setConfirmAction('approve');
        setIsModalOpen(false);
        setIsConfirmOpen(true);
        setDropdownOpenId(null);
    };

    const handleReject = (item: TariffItem) => {
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
                                    checked={selectedTariffs.length === sortedData.length && sortedData.length > 0}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setSelectedTariffs(sortedData.map((item) => item.id));
                                        } else {
                                            setSelectedTariffs([]);
                                        }
                                    }}
                                />
                                <span className="text-sm font-medium text-gray-900">S/N</span>
                            </div>
                        </TableHead>
                        <TableHead className="px-4 py-3 w-[150px] text-sm font-medium text-gray-900">Tariff Name</TableHead>
                        <TableHead className="px-4 py-3 w-[100px] text-sm font-medium text-gray-900">Tariff ID</TableHead>
                        <TableHead className="px-4 py-3 w-[120px] text-sm font-medium text-gray-900">Tariff Type</TableHead>
                        <TableHead className="px-4 py-3 w-[100px] text-sm font-medium text-gray-900">Band Code</TableHead>
                        <TableHead className="px-4 py-3 w-[100px] text-sm font-medium text-gray-900">Tariff Rate</TableHead>
                        <TableHead className="px-4 py-3 w-[120px] text-sm font-medium text-gray-900">Effective Date</TableHead>
                        <TableHead className="px-4 py-3 w-[150px] text-sm font-medium text-gray-900">Change Description</TableHead>
                        <TableHead className="px-4 py-3 w-[120px] text-sm font-medium text-gray-900 text-center">Approval Status</TableHead>
                        <TableHead className="px-4 py-3 w-[80px] text-sm font-medium text-gray-900 text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedData.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={10} className="h-24 text-center text-sm text-gray-500">
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
                                            checked={selectedTariffs.includes(item.id)}
                                            onCheckedChange={() => toggleSelection(item.id)}
                                        />
                                        <span className="text-sm text-gray-900">
                                            {index + 1 + (currentPage - 1) * rowsPerPage}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 py-3 w-[150px] text-sm text-gray-900">{item.tariffName}</TableCell>
                                <TableCell className="px-4 py-3 w-[100px] text-sm text-gray-900">{item.tariffId}</TableCell>
                                <TableCell className="px-4 py-3 w-[120px] text-sm text-gray-900">{item.tariffType}</TableCell>
                                <TableCell className="px-4 py-3 w-[100px] text-sm text-gray-900">{item.bandCode}</TableCell>
                                <TableCell className="px-4 py-3 w-[100px] text-sm text-gray-900">{item.tariffRate}</TableCell>
                                <TableCell className="px-4 py-3 w-[120px] text-sm text-gray-900">{item.effectiveDate}</TableCell>
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

            <ViewTariffDetailsDialog
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

export default TariffTable;