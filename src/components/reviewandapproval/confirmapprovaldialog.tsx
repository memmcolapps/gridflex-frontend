import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  action: 'approve' | 'reject';
  onConfirm: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onOpenChange,
  action,
  onConfirm,
}) => {
  console.log('ConfirmDialog rendering, isOpen:', isOpen, 'action:', action); // Debug log
  const isApprove = action === 'approve';
  const title = isApprove ? 'Confirm Approval' : 'Confirm Rejection';
  const message = `Please confirm you would like to ${action} this change`;
  const confirmButtonText = isApprove ? 'Approve' : 'Reject';
  const confirmButtonClass = isApprove
    ? 'bg-[#161CCA] text-white hover:bg-[#161CCA]/80'
    : 'bg-[#F50202] text-white hover:bg-red-600';
  // Conditionally set styles for reject action
  const alertTriangleClass = isApprove ? 'text-[#161CCA] bg-blue-200/80 rounded-full p-2' : 'text-red-500 bg-red-200/80 rounded-full p-2';
  const cancelButtonClass = isApprove
    ? 'border-[#161CCA] text-[#161CCA] bg-white hover:bg-gray-100'
    : 'border-red-500 text-red-500 bg-white hover:bg-gray-100';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[380px] h-fit mx-auto bg-white text-black z-[1000]">
        <DialogHeader>
          <div className="mb-2">
            <AlertTriangle size={22} className={alertTriangleClass}/>
          </div>
          <DialogTitle className="">{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-700">{message}</p>
        </div>
        <div className="flex justify-between">
          <Button
            variant="outline"
            className={cancelButtonClass}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            className={confirmButtonClass}
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