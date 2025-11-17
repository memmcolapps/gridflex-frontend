"use client";
// components/PercentageRangeTable.tsx
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
import ViewDetailsDialog from '@/components/reviewandapproval/viewpercentagedetailsdialog';
import ConfirmDialog from '@/components/reviewandapproval/confirmapprovaldialog';
import type { PercentageRange } from '@/types/review-approval';
import { usePercentageRanges } from '@/hooks/use-ReviewApproval';
import type { FetchParams } from '@/service/reviewapproval-service';
import { toast } from 'sonner';
import { PaginationControls } from "@/components/ui/pagination-controls";
import { LoadingAnimation } from '@/components/ui/loading-animation';

interface PercentageRangeTableProps {
  selectedPercentageRangeCodes: string[];
  setSelectedPercentageRangeCodes: React.Dispatch<React.SetStateAction<string[]>>;
}

const PercentageRangeTable = ({ selectedPercentageRangeCodes, setSelectedPercentageRangeCodes }: PercentageRangeTableProps) => {
  const [fetchParams, setFetchParams] = useState<FetchParams>({
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortBy: null,
    sortDirection: null,
    type: 'pending-state',
  });
  const [selectedRow, setSelectedRow] = useState<PercentageRange | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null);
  const [selectedItem, setSelectedItem] = useState<PercentageRange | null>(null);
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);

  const { percentageRanges, isLoading, isError, error, reviewMutation } = usePercentageRanges(fetchParams);

  // Filter out approved percentage ranges
  const filteredPercentageRanges = percentageRanges.filter(item => item.approveStatus !== 'Approved');

  const totalData = filteredPercentageRanges.length;

  const handlePageChange = (page: number) => {
    setFetchParams({ ...fetchParams, page });
  };

  const handlePageSizeChange = (pageSize: number) => {
    setFetchParams({ ...fetchParams, pageSize, page: 1 });
  };

  const toggleSelection = (code: string) => {
    setSelectedPercentageRangeCodes((prev) =>
      prev.includes(code) ? prev.filter((item) => item !== code) : [...prev, code]
    );
  };

  const handleViewDetails = (item: PercentageRange) => {
    setSelectedRow(item);
    setIsModalOpen(true);
    setDropdownOpenId(null);
  };

  const handleApprove = (item: PercentageRange) => {
    setSelectedItem(item);
    setConfirmAction('approve');
    setIsModalOpen(false);
    setIsConfirmOpen(true);
    setDropdownOpenId(null);
  };

  const handleReject = (item: PercentageRange) => {
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
          id: selectedItem.percentageId,
          approveStatus: confirmAction,
          reason,
        });
        toast.success(`Percentage range ${confirmAction}d successfully!`, {
          // description: `Percentage: ${selectedItem.percentage}, Code: ${selectedItem.code}`,
        });
      } catch {
        toast.error(`Failed to ${confirmAction} percentage range.`, {
          // description: error instanceof Error ? error.message : 'An error occurred',
        });
      }
    }
    setIsConfirmOpen(false);
    setConfirmAction(null);
    setSelectedItem(null);
  };


  if (isLoading) return (
      <div className="flex min-h-96 items-center justify-center">
          <LoadingAnimation variant="spinner" message="Loading percentage ranges..." size="lg" />
      </div>
  );
  if (isError) {
    toast.error('Failed to fetch percentage ranges.', {
      description: error instanceof Error ? error.message : 'An unknown error occurred',
    });
    return <div>Error: {error?.message}</div>;
  }

  // Use the filtered data
  const dataToDisplay = filteredPercentageRanges;

  return (
    <Card className="border-none shadow-none bg-transparent overflow-x-auto min-h-[calc(100vh-300px)]">
      <Table className="table-auto w-full">
        <TableHeader className="bg-transparent">
          <TableRow>
            <TableHead className="px-4 py-3 w-[100px]">
              <div className="flex items-center gap-2">
                <Checkbox
                  className="h-4 w-4 border-gray-500"
                  checked={selectedPercentageRangeCodes.length === dataToDisplay.length && dataToDisplay.length > 0}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedPercentageRangeCodes(filteredPercentageRanges.map((item) => item.code));
                    } else {
                      setSelectedPercentageRangeCodes([]);
                    }
                  }}
                />
                <span className="text-sm font-medium text-gray-900">S/N</span>
              </div>
            </TableHead>
            <TableHead className="px-4 py-3 text-sm font-medium text-gray-900">Percentage</TableHead>
            <TableHead className="px-4 py-3 text-sm font-medium text-gray-900">Percentage Code</TableHead>
            <TableHead className="px-4 py-3 text-sm font-medium text-gray-900">Band</TableHead>
            <TableHead className="px-4 py-3 text-sm font-medium text-gray-900">Amount Range</TableHead>
            <TableHead className="px-4 py-3 text-sm font-medium text-gray-900">Change Description</TableHead>
            <TableHead className="px-4 py-3 text-sm font-medium text-gray-900 text-center">Approval Status</TableHead>
            <TableHead className="px-4 py-3 text-sm font-medium text-gray-900 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataToDisplay.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center text-sm text-gray-500">
                No data available
              </TableCell>
            </TableRow>
          ) : (
            dataToDisplay.map((item, index) => (
              <TableRow key={item.id} className="hover:bg-gray-50 cursor-pointer">
                <TableCell className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      className="h-4 w-4 border-gray-500"
                      id={`select-${item.id}`}
                      checked={selectedPercentageRangeCodes.includes(item.code)}
                      onCheckedChange={() => toggleSelection(item.code)}
                    />
                    <span className="text-sm text-gray-900">
                      {index + 1 + (fetchParams.page - 1) * fetchParams.pageSize}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-sm text-gray-900">{item.percentage}</TableCell>
                <TableCell className="px-4 py-3 text-sm text-gray-900">{item.code}</TableCell>
                <TableCell className="px-4 py-3 text-sm text-gray-900">{item.band.name}</TableCell>
                <TableCell className="px-4 py-3 text-sm text-gray-900">
                  {item.amountStartRange} - {item.amountEndRange}
                </TableCell>
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
        totalItems={totalData}
        pageSize={fetchParams.pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      <ViewDetailsDialog
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

export default PercentageRangeTable;