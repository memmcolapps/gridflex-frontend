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
import ViewBandDetailsDialog from '@/components/reviewandapproval/viewbanddetailsdialog';
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

type BandItem = {
    id: number;
    bandName: string;
    electricityHr: string;
    changeDescription: string;
    approvalStatus: string;
    newBandName?: string;
    newElectricityHr?: string;
};

const BandTable = () => {
    const [selectedRow, setSelectedRow] = useState<BandItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBands, setSelectedBands] = useState<number[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null);
    const [selectedItem, setSelectedItem] = useState<BandItem | null>(null);
    const [dropdownOpenId, setDropdownOpenId] = useState<number | null>(null);

    // Sample data for BandItem
    const data: BandItem[] = [
        {
            id: 1,
            bandName: 'Band A',
            electricityHr: '20',
            changeDescription: 'Band Edited',
            approvalStatus: 'Pending',
            newBandName: 'Band A1',
            newElectricityHr: '22',
        },
        {
            id: 4,
            bandName: 'Band B',
            electricityHr: '16',
            changeDescription: 'Newly Added',
            approvalStatus: 'Pending',
        },
        {
            id: 5,
            bandName: 'Band C',
            electricityHr: '12',
            changeDescription: 'Newly Added',
            approvalStatus: 'Pending',
        },

    ];

    const totalPages = Math.ceil(data.length / rowsPerPage);

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

    const paginatedData = data.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const toggleSelection = (id: number) => {
        setSelectedBands((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleViewDetails = (item: BandItem) => {
        console.log('View details clicked:', item);
        setSelectedRow(item);
        setIsModalOpen(true);
        setDropdownOpenId(null);
    };

    const handleApprove = (item: BandItem) => {
        console.log('Opening confirm modal for approve:', item);
        setSelectedItem(item);
        setConfirmAction('approve');
        setIsModalOpen(false);
        setIsConfirmOpen(true);
        setDropdownOpenId(null);
    };

    const handleReject = (item: BandItem) => {
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
        <Card className="border-none shadow-none bg-white overflow-x-auto min-h-[calc(100vh-300px)]">
            <Table className="table-auto w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead className="px-4 py-3 w-[100px]">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    className="h-4 w-4 border-gray-500"
                                    checked={selectedBands.length === data.length && data.length > 0}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setSelectedBands(data.map((item) => item.id));
                                        } else {
                                            setSelectedBands([]);
                                        }
                                    }}
                                />
                                <span className="text-sm font-medium text-gray-900">S/N</span>
                            </div>
                        </TableHead>
                        <TableHead className="px-4 py-3 text-sm font-medium text-gray-900">Band Name</TableHead>
                        <TableHead className="px-4 py-3 text-sm font-medium text-gray-900">Electricity Hr</TableHead>
                        <TableHead className="px-4 py-3 text-sm font-medium text-gray-900">Change Description</TableHead>
                        <TableHead className="px-4 py-3 text-sm font-medium text-gray-900 text-center">Approval Status</TableHead>
                        <TableHead className="px-4 py-3 text-sm font-medium text-gray-900 text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-sm text-gray-500">
                                No data available
                            </TableCell>
                        </TableRow>
                    ) : (
                        paginatedData.map((item, index) => (
                            <TableRow
                                key={item.id}
                                className="hover:bg-gray-50 cursor-pointer"
                            >
                                <TableCell className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            className="h-4 w-4 border-gray-500"
                                            id={`select-${item.id}`}
                                            checked={selectedBands.includes(item.id)}
                                            onCheckedChange={() => toggleSelection(item.id)}
                                        />
                                        <span className="text-sm text-gray-900">
                                            {index + 1 + (currentPage - 1) * rowsPerPage}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 py-3 text-sm text-gray-900">{item.bandName}</TableCell>
                                <TableCell className="px-4 py-3 text-sm text-gray-900">{item.electricityHr}</TableCell>
                                <TableCell className="px-4 py-3 text-sm text-[#161CCA]">{item.changeDescription}</TableCell>
                                <TableCell className="px-4 py-3 text-center">
                                    <span className="inline-block px-3 py-1 text-sm font-medium text-[#C86900] bg-[#FFF5EA] p-1 rounded-full">
                                        Pending
                                    </span>
                                </TableCell>
                                <TableCell className="px-4 py-3 text-right">
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
                        {Math.min(currentPage * rowsPerPage, data.length)} of {data.length}
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

            <ViewBandDetailsDialog
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

export default BandTable;