// components/reviewandapproval/confirmapprovaldialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { PercentageRange } from '@/types/review-approval';

interface ConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  action: 'approve' | 'reject';
  onConfirm: () => void;
  selectedItem: PercentageRange | null;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onOpenChange,
  action,
  onConfirm,
  selectedItem,
}) => {
  const isApprove = action === 'approve';
  const title = isApprove ? 'Confirm Approval' : 'Confirm Rejection';
  const message = selectedItem
    ? `Are you sure you want to ${action} the percentage range with code "${selectedItem.code}" and percentage "${selectedItem.percentage}"?`
    : `Please confirm you would like to ${action} this change`;
  const confirmButtonText = isApprove ? 'Approve' : 'Reject';
  const confirmButtonClass = isApprove
    ? 'bg-[#22C55E] text-white hover:bg-[#1ea34d]'
    : 'bg-[#F50202] text-white hover:bg-red-600';
  const alertTriangleClass = isApprove
    ? 'text-[#22C55E] bg-green-200/80 rounded-full p-2'
    : 'text-red-500 bg-red-200/80 rounded-full p-2';
  const cancelButtonClass = isApprove
    ? 'border-[#22C55E] text-[#22C55E] bg-white hover:bg-gray-100'
    : 'border-red-500 text-red-500 bg-white hover:bg-gray-100';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[380px] h-fit mx-auto bg-white text-black z-[1000]">
        <DialogHeader>
          <div className="mb-2 flex justify-center">
            <AlertTriangle size={24} className={alertTriangleClass} />
          </div>
          <DialogTitle className="text-center text-lg font-semibold text-gray-900">{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-700 text-center">{message}</p>
          {selectedItem && (
            <div className="mt-2 text-sm text-gray-600">
              <p>Band: {selectedItem.band.name}</p>
              <p>Amount Range: {selectedItem.amountStartRange} - {selectedItem.amountEndRange}</p>
            </div>
          )}
        </div>
        <div className="flex justify-between gap-2">
          <Button
            variant="outline"
            className={`text-sm font-medium w-full sm:w-auto px-4 py-2 rounded-md transition-colors ${cancelButtonClass}`}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            className={`text-sm font-medium w-full sm:w-auto px-4 py-2 rounded-md transition-colors ${confirmButtonClass}`}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmButtonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;