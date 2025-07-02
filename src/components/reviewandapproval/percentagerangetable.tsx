import { SetStateAction, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { MoreVertical } from 'lucide-react';
import ViewDetailsDialog from './viewpercentagedetailsdialog';

type PercentageRangeItem = {
  id: number;
  percentage: string;
  percentageCode: string;
  band: string;
  amountRange: string;
  changeDescription: string;
  approvalStatus: string;
};

const PercentageRangeTable = () => {
  const [selectedRow, setSelectedRow] = useState<PercentageRangeItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTariffs, setSelectedTariffs] = useState<number[]>([]);
  const [currentPage] = useState(1);
  const rowsPerPage = 10;

  // Sample data (replace with your actual data source)
  const data: PercentageRangeItem[] = [
    {
      id: 1,
      percentage: '2%',
      percentageCode: 'PC001',
      band: 'A',
      amountRange: '$100-$500',
      changeDescription: 'Percentage Range Edited',
      approvalStatus: 'Pending',
    },
    {
      id: 2,
      percentage: '5%',
      percentageCode: 'PC002',
      band: 'B',
      amountRange: '$501-$1000',
      changeDescription: 'Percentage Range Deactivated',
      approvalStatus: 'Pending',
    },
    {
      id: 3,
      percentage: '10%',
      percentageCode: 'PC002',
      band: 'B',
      amountRange: '$501-$1000',
      changeDescription: 'Percentage Range Deactivated',
      approvalStatus: 'Pending',
    },
    {
      id: 4,
      percentage: '15%',
      percentageCode: 'PC002',
      band: 'B',
      amountRange: '$501-$1000',
      changeDescription: 'Newly Added',
      approvalStatus: 'Pending',
    },
    {
      id: 5,
      percentage: '20%',
      percentageCode: 'PC002',
      band: 'B',
      amountRange: '$501-$1000',
      changeDescription: 'Newly Added',
      approvalStatus: 'Pending',
    },
    {
      id: 6,
      percentage: '2%',
      percentageCode: 'PC002',
      band: 'B',
      amountRange: '$501-$1000',
      changeDescription: 'Newly Added',
      approvalStatus: 'Pending',
    }
  ];

  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const toggleSelection = (id: number) => {
    setSelectedTariffs((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleViewDetails = (item: PercentageRangeItem) => {
    setSelectedRow(item);
    setIsModalOpen(true);
  };

  const handleApprove = (item: { id: number; percentage: string; percentageCode: string; band: string; amountRange: string; changeDescription: string; approvalStatus: string; }) => {
    // Implement approve logic here
    console.log('Approve:', item);
  };

  const handleReject = (item: { id: number; percentage: string; percentageCode: string; band: string; amountRange: string; changeDescription: string; approvalStatus: string; }) => {
    // Implement reject logic here
    console.log('Reject:', item);
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
                  checked={selectedTariffs.length === data.length && data.length > 0}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedTariffs(data.map((item) => item.id));
                    } else {
                      setSelectedTariffs([]);
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
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center text-sm text-gray-500">
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
                      checked={selectedTariffs.includes(item.id)}
                      onCheckedChange={() => toggleSelection(item.id)}
                    />
                    <span className="text-sm text-gray-900">
                      {index + 1 + (currentPage - 1) * rowsPerPage}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-sm text-gray-900">{item.percentage}</TableCell>
                <TableCell className="px-4 py-3 text-sm text-gray-900">{item.percentageCode}</TableCell>
                <TableCell className="px-4 py-3 text-sm text-gray-900">{item.band}</TableCell>
                <TableCell className="px-4 py-3 text-sm text-gray-900">{item.amountRange}</TableCell>
                <TableCell className="px-4 py-3 text-sm text-[#161CCA]">{item.changeDescription}</TableCell>
                <TableCell className="px-4 py-3 text-center">
                  <span className="inline-block px-3 py-1 text-sm font-medium text-[#C86900] bg-[#FFF5EA] p-1 rounded-full">
                    Pending
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 cursor-pointer">
                        <MoreVertical size={14} className="text-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-fit bg-white shadow-lg">
                      <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => handleViewDetails(item)}
                      >
                        <span className="text-sm text-gray-700">View Details</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => handleApprove(item)}
                      >
                        <span className="text-sm text-gray-700">Approve</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => handleReject(item)}
                      >
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
      <ViewDetailsDialog
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        selectedRow={selectedRow}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </Card>
  );
};
export default PercentageRangeTable;

