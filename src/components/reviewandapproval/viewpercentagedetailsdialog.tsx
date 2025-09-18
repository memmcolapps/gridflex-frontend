// components/viewpercentagedetailsdialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PercentageRange } from '@/types/review-approval';

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
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-fit lg:max-w-[1200px] bg-white text-black p-4 sm:p-6 rounded-lg shadow-lg overflow-hidden h-fit">
        <div className="w-full">
          <DialogHeader>
            <DialogTitle className="text-left text-base sm:text-lg font-semibold text-gray-900 truncate">
              {selectedRow?.description ?? 'Percentage Range Details'}
            </DialogTitle>
            <span className="text-gray-500 text-sm sm:text-base">
              Created By: <span className="font-medium">{selectedRow?.createdBy ?? 'Unknown'}</span>
            </span>
          </DialogHeader>

          <div className="flex flex-col gap-3 py-4 sm:py-6 p-4">
            {[
              { label: 'Percentage:', value: selectedRow?.percentage },
              { label: 'Code:', value: selectedRow?.code },
              { label: 'Band:', value: selectedRow?.band.name },
              {
                label: 'Amount Range:',
                value: selectedRow ? `${selectedRow.amountStartRange} - ${selectedRow.amountEndRange}` : 'N/A',
              },
              { label: 'Description:', value: selectedRow?.description },
              { label: 'Status:', value: selectedRow?.status ? 'Active' : 'Inactive' },
              { label: 'Approval Status:', value: selectedRow?.approveStatus },
              { label: 'Created At:', value: new Date(selectedRow?.createdAt ?? '').toLocaleString() },
              { label: 'Updated At:', value: new Date(selectedRow?.updatedAt ?? '').toLocaleString() },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-[120px] text-sm sm:text-base font-medium text-gray-700 whitespace-nowrap">
                  {label}
                </div>
                <div className="w-full text-sm sm:text-base font-bold text-gray-900 truncate">
                  {value ?? 'N/A'}
                </div>
              </div>
            ))}
          </div>

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