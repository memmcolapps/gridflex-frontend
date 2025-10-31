/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
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
import { PaginationControls } from '@/components/ui/pagination-controls';
import type { Band } from '@/types/review-approval';
import { toast } from 'sonner';
import { useBands } from '@/hooks/use-ReviewApproval';
import type { FetchParams } from '@/service/reviewapproval-service';

const BandTable = () => {
    const [fetchParams, setFetchParams] = useState<FetchParams>({
        page: 1,
        pageSize: 10,
        searchTerm: '',
        sortBy: null,
        sortDirection: null,
        type: 'pending-state',
    });
    const [selectedRow, setSelectedRow] = useState<Band | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null);
    const [selectedItem, setSelectedItem] = useState<Band | null>(null);
    const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);

    const { bands, isLoading, isError, error, reviewMutation } = useBands(fetchParams);

    // Filter out approved bands
    const filteredBands = bands.filter(item => item.approveStatus !== 'Approved');

    // We are now getting the total count from the filtered data
    const totalCount = filteredBands.length;
    const totalPages = Math.ceil(totalCount / fetchParams.pageSize);

    const handlePageChange = (page: number) => {
        setFetchParams({ ...fetchParams, page });
    };

    const handlePageSizeChange = (pageSize: number) => {
        setFetchParams({ ...fetchParams, pageSize, page: 1 });
    };

    const toggleSelection = (id: string) => {
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleViewDetails = (item: Band) => {
        setSelectedRow(item);
        setIsModalOpen(true);
        setDropdownOpenId(null);
    };

    const handleApprove = (item: Band) => {
        setSelectedItem(item);
        setConfirmAction('approve');
        setIsModalOpen(false);
        setIsConfirmOpen(true);
        setDropdownOpenId(null);
    };

    const handleReject = (item: Band) => {
        setSelectedItem(item);
        setConfirmAction('reject');
        setIsModalOpen(false);
        setIsConfirmOpen(true);
        setDropdownOpenId(null);
    };

    const handleConfirmAction = async (reason?: string) => {
        if (selectedItem && confirmAction) {
            try {
                await reviewMutation.mutateAsync({
                    id: selectedItem.bandId,
                    approveStatus: confirmAction,
                    reason,
                });
                toast.success(`Band ${confirmAction}d successfully!`, {
                    // description: `Name: ${selectedItem.name}, ID: ${selectedItem.bandId}`,
                });
            } catch (error) {
                toast.error(`Failed to ${confirmAction} band.`, {
                    // description: error instanceof Error ? error.message : 'An error occurred',
                });
            }
        }
        setIsConfirmOpen(false);
        setConfirmAction(null);
        setSelectedItem(null);
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) {
        toast.error('Failed to fetch bands.', {
            description: error instanceof Error ? error.message : 'An unknown error occurred',
        });
        return <div>Error: {error?.message}</div>;
    }

    const paginatedData = filteredBands.slice(
        (fetchParams.page - 1) * fetchParams.pageSize,
        fetchParams.page * fetchParams.pageSize
    );

    return (
        <Card className="border-none shadow-none bg-transparent overflow-x-auto min-h-[calc(100vh-300px)]">
            <Table className="table-auto w-full">
                <TableHeader className='bg-transparent'>
                    <TableRow>
                        <TableHead className="px-4 py-3 w-[100px]">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    className="h-4 w-4 border-gray-500"
                                    checked={selectedItems.length === totalCount && totalCount > 0}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setSelectedItems(filteredBands.map((item) => item.id));
                                        } else {
                                            setSelectedItems([]);
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
                    {paginatedData.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-sm text-gray-500">
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
                                <TableCell className="px-4 py-3 text-sm text-gray-900">{item.name}</TableCell>
                                <TableCell className="px-4 py-3 text-sm text-gray-900">{item.hour}</TableCell>
                                <TableCell className="px-4 py-3 text-sm text-[#161CCA]">{item.description}</TableCell>
                                <TableCell className="px-4 py-3 text-center">
                                    <span className="inline-block px-3 py-1 text-sm font-medium text-[#C86900] bg-[#FFF5EA] p-1 rounded-full">
                                        {item.approveStatus ?? 'Pending'}
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

            <PaginationControls
                currentPage={fetchParams.page}
                totalItems={totalCount}
                pageSize={fetchParams.pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
            />

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
                selectedItem={selectedItem}
            />
        </Card>
    );
};

export default BandTable;