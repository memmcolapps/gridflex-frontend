import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MoveRight } from 'lucide-react';
import type { PercentageRange } from '@/types/review-approval';
import { useAuth } from '@/context/auth-context';

interface ViewDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRow: PercentageRange | null;
  onApprove: (row: PercentageRange) => void;
  onReject: (row: PercentageRange) => void;
}

const ViewDetailsDialog: React.FC<ViewDetailsDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedRow,
  onApprove,
  onReject,
}) => {
  const { user } = useAuth();

  const renderContent = () => {
    if (!selectedRow) return null;

    switch (selectedRow.description) {
      case 'Newly Added':
      case 'Percentage Range Deactivated':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-left text-base sm:text-lg font-semibold text-gray-900 truncate">
                {selectedRow.description}
              </DialogTitle>
              <span className="text-gray-500 text-sm sm:text-base">
                Operator:{' '}
                <span className="font-medium">
                  {user?.business?.businessName?.toUpperCase() ?? 'BUSINESS NAME'}
                </span>
              </span>
            </DialogHeader>
            <div className="flex flex-col gap-3 py-4 sm:py-6">
              {[
                { label: 'Percentage:', value: selectedRow.percentage },
                { label: 'Percentage Code:', value: selectedRow.code },
                { label: 'Band Code:', value: selectedRow.band.name },
                {
                  label: 'Amount Range:',
                  value: `${selectedRow.amountStartRange} - ${selectedRow.amountEndRange}`,
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full"
                >
                  <div className="w-full sm:w-[120px] text-sm sm:text-base font-medium text-gray-700 whitespace-nowrap">
                    {label}
                  </div>
                  <div className="w-full sm:w-[150px] text-sm sm:text-base font-bold text-gray-900 whitespace-nowrap ml-0 sm:ml-10">
                    {value ?? 'N/A'}
                  </div>
                </div>
              ))}
            </div>
          </>
        );

      case 'Percentage Range Edited':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-left text-base sm:text-lg font-semibold text-gray-900 truncate">
                Percentage Range Edited
              </DialogTitle>
              <span className="text-gray-500 text-sm sm:text-base">
                Operator:{' '}
                <span className="font-medium">
                  {user?.business?.businessName?.toUpperCase() ?? 'BUSINESS NAME'}
                </span>
              </span>
            </DialogHeader>
            <div className="flex flex-col gap-3 py-4 sm:py-6">
              {/* Header row with From and To labels */}
              <div className="flex flex-row items-center gap-4">
                <div className="w-[120px] text-sm sm:text-base  whitespace-nowrap"></div>
                <div className="w-[120px] text-sm sm:text-base  whitespace-nowrap">
                  From
                </div>
                <div className="w-[120px] text-sm sm:text-base  whitespace-nowrap ml-14">
                  To
                </div>
              </div>
              {/* Data rows */}
              {[
                {
                  label: 'Percentage:',
                  oldValue: selectedRow.oldPercentageRangeInfo.percentage,
                  newValue: selectedRow.percentage,
                },
                {
                  label: 'Percentage Code:',
                  oldValue: selectedRow.oldPercentageRangeInfo.code,
                  newValue: selectedRow.code,
                },
                {
                  label: 'Band Code:',
                  oldValue: selectedRow.oldPercentageRangeInfo.band.name,
                  newValue: selectedRow.band.name,
                },
                {
                  label: 'Amount Range:',
                  oldValue: `${selectedRow.oldPercentageRangeInfo.amountStartRange} - ${selectedRow.oldPercentageRangeInfo.amountEndRange}`,
                  newValue: `${selectedRow.amountStartRange} - ${selectedRow.amountEndRange}`,
                },
              ].map(({ label, oldValue, newValue }) => (
                <div
                  key={label}
                  className="flex flex-row items-center gap-4"
                >
                  <div className="w-[120px] text-sm sm:text-base font-medium text-gray-700 whitespace-nowrap">
                    {label}
                  </div>
                  <div className="w-[120px] text-sm sm:text-base font-bold text-gray-900 whitespace-nowrap">
                    {oldValue ?? 'N/A'}
                  </div>
                  <div className="flex items-center text-sm sm:text-base text-gray-900 whitespace-nowrap ml-4">
                    <MoveRight className="text-gray-900 mr-4 scale-x-185" size={16} />
                    <span className="font-bold truncate">{newValue ?? 'N/A'}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-fit lg:max-w-[1000px] bg-white text-black p-4 sm:p-6 rounded-lg shadow-lg overflow-hidden h-fit">
        <div className="w-full">
          {renderContent()}
          <div className="flex justify-between gap-2 mt-4">
            <Button
              onClick={() => selectedRow && onReject(selectedRow)}
              variant="outline"
              className="border-red-500 text-red-500 bg-white hover:bg-red-50 hover:text-red-600 text-sm sm:text-base font-medium w-full sm:w-auto px-3 py-2 sm:px-4 sm:py-2 rounded-md transition-colors focus:ring-red-500/0"
              disabled={!selectedRow}
            >
              Reject
            </Button>
            <Button
              onClick={() => selectedRow && onApprove(selectedRow)}
              variant="default"
              className="bg-[#22C55E] text-white hover:bg-[#1ea34d] text-sm sm:text-base font-medium w-full sm:w-auto px-3 py-2 sm:px-4 sm:py-2 rounded-md transition-colors"
              disabled={!selectedRow}
            >
              Approve
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewDetailsDialog;