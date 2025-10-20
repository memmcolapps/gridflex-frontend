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
import type { Meter } from '@/types/review-approval';
import { useMeters } from '@/hooks/use-ReviewApproval';
import type { FetchParams } from '@/service/reviewapproval-service';
import { toast } from 'sonner';



const MeterTable = () => {
    const [fetchParams, setFetchParams] = useState<FetchParams>({
        page: 1,
        pageSize: 10,
        searchTerm: '',
        sortBy: null,
        sortDirection: null,
        type: 'pending-state',
    });
    const [selectedRow, setSelectedRow] = useState<Meter | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null);
    const [selectedItem, setSelectedItem] = useState<Meter | null>(null);
    const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);

    const { meters, isLoading, isError, error, reviewMutation } = useMeters(fetchParams);
    const totalCount = meters.length; // API already paginates, so this is the current page's data length
    const totalPages = Math.ceil(totalCount / fetchParams.pageSize); // This might not be accurate if API doesn't provide total

    const handlePrevious = () => {
        setFetchParams({ ...fetchParams, page: Math.max(fetchParams.page - 1, 1) });
    };

    const handleNext = () => {
        setFetchParams({ ...fetchParams, page: Math.min(fetchParams.page + 1, totalPages) });
    };

    const handleRowsPerPageChange = (value: string) => {
        setFetchParams({ ...fetchParams, pageSize: Number(value), page: 1 });
    };

    const toggleSelection = (id: string) => {
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleViewDetails = (item: Meter) => {
        setSelectedRow(item);
        setIsModalOpen(true);
        setDropdownOpenId(null);
    };

    const handleApprove = (item: Meter | null) => {
        if (item) {
            setSelectedItem(item);
            setConfirmAction('approve');
            setIsModalOpen(false);
            setIsConfirmOpen(true);
            setDropdownOpenId(null);
        }
    };

    const handleReject = (item: Meter | null) => {
        if (item) {
            setSelectedItem(item);
            setConfirmAction('reject');
            setIsModalOpen(false);
            setIsConfirmOpen(true);
            setDropdownOpenId(null);
        }
    };

  const handleConfirmAction = async () => {
    if (selectedItem && confirmAction) {
        try {
            await reviewMutation.mutateAsync({
                id: selectedItem.meterId.toString(),
                approveStatus: confirmAction,
            });
            toast.success(`Meter ${confirmAction}d successfully!`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            toast.error(errorMessage);
        }
    }
    setIsConfirmOpen(false);
    setConfirmAction(null);
    setSelectedItem(null);
};

    if (isLoading) return <div>Loading...</div>;
    if (isError) {
        toast.error('Failed to fetch meters.', {
            // description: error instanceof Error ? error.message : 'An unknown error occurred',
        });
        return <div>Error: {error?.message}</div>;
    }

    // API already provides paginated data, so use meters directly
    const paginatedData = meters;

    return (
        <Card className="border-none shadow-none bg-transparent overflow-x-auto min-h-[calc(100vh-300px)]">
            <Table className="table-auto w-full">
                <TableHeader className="bg-transparent">
                    <TableRow>
                        <TableHead className="px-4 py-3 w-[100px]">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    className="h-4 w-4 border-gray-500"
                                    checked={selectedItems.length === paginatedData.length && paginatedData.length > 0}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setSelectedItems(paginatedData.map((item) => item.id));
                                        } else {
                                            setSelectedItems([]);
                                        }
                                    }}
                                />
                                <span className="text-sm font-medium text-gray-900">S/N</span>
                            </div>
                        </TableHead>
                        <TableHead className="px-4 py-3 text-sm font-medium text-gray-900">Meter Number</TableHead>
                        <TableHead className="px-4 py-3 text-sm font-medium text-gray-900">Sim No</TableHead>
                        <TableHead className="px-4 py-3 text-sm font-medium text-gray-900">Manufacturer</TableHead>
                        <TableHead className="px-4 py-3 text-sm font-medium text-gray-900">Class</TableHead>
                        <TableHead className="px-4 py-3 text-sm font-medium text-gray-900"> Type</TableHead>
                        <TableHead className="px-4 py-3 text-sm font-medium text-gray-900">Category</TableHead>
                        <TableHead className="px-4 py-3 text-sm font-medium text-gray-900">Change Description</TableHead>                      
                        <TableHead className="px-4 py-3 text-sm font-medium text-gray-900 text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedData.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={9} className="h-24 text-center text-sm text-gray-500">
                                No data available
                            </TableCell>
                        </TableRow>
                    ) : (
                        paginatedData.map((item, index) => (
                            <TableRow key={item.id} className="hover:bg-gray-50 cursor-pointer">
                                <TableCell className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            className="h-4 w-4 border-gray-500"
                                            id={`select-${item.id}`}
                                            checked={selectedItems.includes(item.id)}
                                            onCheckedChange={() => toggleSelection(item.id)}
                                        />
                                        <span className="text-sm text-gray-900">
                                            {index + 1 + (fetchParams.page - 1) * fetchParams.pageSize}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 py-3  text-sm text-gray-900">{item.meterNumber}</TableCell>
                                <TableCell className="px-4 py-3  text-sm text-gray-900">{item.simNumber}</TableCell>
                                <TableCell className="px-4 py-3  text-sm text-gray-900">{item.manufacturer?.name}</TableCell>
                                <TableCell className="px-4 py-3  text-sm text-gray-900">{item.meterClass}</TableCell>
                                <TableCell className="px-4 py-3  text-sm text-gray-900">{item.meterType}</TableCell>
                                <TableCell className="px-4 py-3  text-sm text-gray-900">{item.meterCategory}</TableCell>
                                <TableCell className="px-4 py-3  text-sm text-[#161CCA]">
                                    {(item.description)}
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
                        value={fetchParams.pageSize.toString()}
                        onValueChange={handleRowsPerPageChange}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={fetchParams.pageSize.toString()} />
                        </SelectTrigger>
                        <SelectContent position="popper" side="top" align="center" className="mb-1 ring-gray-50">
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="24">24</SelectItem>
                            <SelectItem value="48">48</SelectItem>
                        </SelectContent>
                    </Select>
                    <span className="text-sm font-medium">
                        {(fetchParams.page - 1) * fetchParams.pageSize + 1}-
                        {Math.min(fetchParams.page * fetchParams.pageSize, totalCount)} of {totalCount} (page {fetchParams.page} of {totalPages})
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
                            aria-disabled={fetchParams.page === 1}
                        />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handleNext();
                            }}
                            aria-disabled={fetchParams.page === totalPages}
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
                selectedItem={selectedItem}
            />
        </Card>
    );
};

export default MeterTable;