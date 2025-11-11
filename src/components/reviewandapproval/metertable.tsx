/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { PaginationControls } from '@/components/ui/pagination-controls';
import type { Meter } from '@/types/review-approval';
import { useMeters } from '@/hooks/use-ReviewApproval';
import type { FetchParams } from '@/service/reviewapproval-service';
import { toast } from 'sonner';
import { LoadingAnimation } from '@/components/ui/loading-animation';


interface MeterTableProps {
    selectedMeterNumbers: string[];
    setSelectedMeterNumbers: React.Dispatch<React.SetStateAction<string[]>>;
}

const MeterTable = ({ selectedMeterNumbers, setSelectedMeterNumbers }: MeterTableProps) => {
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
    // Remove local selectedItems state since we're using selectedMeterNumbers from parent
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null);
    const [selectedItem, setSelectedItem] = useState<Meter | null>(null);
    const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);

    const { meters, isLoading, isError, error, reviewMutation } = useMeters(fetchParams);
    const totalCount = meters.length; // API already paginates, so this is the current page's data length
    const totalPages = Math.ceil(totalCount / fetchParams.pageSize); // This might not be accurate if API doesn't provide total


    const toggleSelection = (meterNumber: string) => {
        setSelectedMeterNumbers((prev) =>
            prev.includes(meterNumber) ? prev.filter((item) => item !== meterNumber) : [...prev, meterNumber]
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

    if (isLoading) return (
        <div className="flex min-h-96 items-center justify-center">
            <LoadingAnimation variant="spinner" message="Loading meters..." size="lg" />
        </div>
    );
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
                                    checked={selectedMeterNumbers.length === paginatedData.length && paginatedData.length > 0}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setSelectedMeterNumbers(paginatedData.map((item) => item.meterNumber));
                                        } else {
                                            setSelectedMeterNumbers([]);
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
                                            checked={selectedMeterNumbers.includes(item.meterNumber)}
                                            onCheckedChange={() => toggleSelection(item.meterNumber)}
                                        />
                                        <span className="text-sm text-gray-900">
                                            {index + 1 + (fetchParams.page - 1) * fetchParams.pageSize}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 py-3  text-sm text-gray-900">{item.meterNumber}</TableCell>
                                <TableCell className="px-4 py-3  text-sm text-gray-900">{item.simNumber}</TableCell>
                                <TableCell className="px-4 py-3  text-sm text-gray-900">{item.oldMeterInfo?.manufacturer?.name || '-'}</TableCell>
                                <TableCell className="px-4 py-3  text-sm text-gray-900">{item.meterClass}</TableCell>
                                <TableCell className="px-4 py-3  text-sm text-gray-900">{item.meterType}</TableCell>
                                <TableCell className="px-4 py-3  text-sm text-gray-900">{item.meterCategory}</TableCell>
                                <TableCell className="px-4 py-3 text-sm text-[#161CCA]">
                                    {item.description
                                        ?.split(' ')
                                        .map((word, index) =>
                                            index < 2 ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : word
                                        )
                                        .join(' ')}
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
                onPageChange={(page) => setFetchParams({ ...fetchParams, page })}
                onPageSizeChange={(pageSize) => setFetchParams({ ...fetchParams, pageSize, page: 1 })}
                pageSizeOptions={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                className="mt-4"
                rowsPerPageLabel="Rows per page"
                showRange={true}
            />

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