// components/reviewandapproval/confirmapprovaldialog.tsx

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import type { PercentageRange, Liability, Band, Tariff, Meter } from '@/types/review-approval';

type SupportedItem = PercentageRange | Liability | Band | Tariff | Meter;

interface ConfirmDialogProps<T extends SupportedItem | null> {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  action: 'approve' | 'reject';
  onConfirm: () => void;
  selectedItem: T;
}

const ConfirmDialog = <T extends SupportedItem | null>({
  isOpen,
  onOpenChange,
  action,
  onConfirm,
  selectedItem,
}: ConfirmDialogProps<T>) => {
  const isApprove = action === 'approve';
  const title = isApprove ? 'Confirm Approval' : 'Confirm Rejection';
  const confirmButtonText = isApprove ? 'Approve' : 'Reject';
  const confirmButtonClass = isApprove
    ? 'bg-[#161CCA] text-white'
    : 'bg-[#F50202] text-white';
  const alertTriangleClass = isApprove
    ? 'text-[#161CCA] bg-[#E8E9FC] rounded-full p-2'
    : 'text-red-500 bg-red-200/80 rounded-full p-2';
  const cancelButtonClass = isApprove
    ? 'border-[#161CCA] text-[#161CCA] bg-white'
    : 'border-red-500 text-red-500 bg-white';

  // Generate message and details based on item type
  const getMessageAndDetails = () => {
    if (!selectedItem) {
      return {
        message: `Please confirm you would like to approve this changes`,
        details: null,
      };
    }

    if ('percentage' in selectedItem && 'code' in selectedItem && 'band' in selectedItem) {
      // PercentageRange

      return {
        message: `Please confirm you would like to approve this changes`,
      };
    } else if ('name' in selectedItem && 'code' in selectedItem && 'description' in selectedItem && !('percentage' in selectedItem) && !('tariff_id' in selectedItem) && !('bandId' in selectedItem)) {

      // Liability
      return {
        message: `Are you sure you want to ${action} the liability with name "${selectedItem.name}" and code "${selectedItem.code}"?`,
        // details: (
        //   <div className="mt-2 text-sm text-gray-600">
        //     <p>Description: {selectedItem.description || 'N/A'}</p>
        //   </div>
        // ),
      };
    } else if ('bandId' in selectedItem && 'name' in selectedItem && 'hour' in selectedItem) {
      // Band
      return {
        message: `Are you sure you want to ${action} the band with name "${selectedItem.name}" and ID "${selectedItem.bandId}"?`,
        details: (
          <div className="mt-2 text-sm text-gray-600">
            <p>Hour: {selectedItem.hour || 'N/A'}</p>
            <p>Description: {selectedItem.description || 'N/A'}</p>
          </div>
        ),
      };
    } else if ('tariff_id' in selectedItem && 'name' in selectedItem && 'tariff_type' in selectedItem) {
      // Tariff
      return {
        message: `Are you sure you want to ${action} the tariff with name "${selectedItem.name}" and ID "${selectedItem.tariff_id}"?`,
        details: (
          <div className="mt-2 text-sm text-gray-600">
            <p>Tariff Type: {selectedItem.tariff_type || 'N/A'}</p>
            <p>Effective Date: {selectedItem.effective_date || 'N/A'}</p>
            <p>Tariff Rate: {selectedItem.tariff_rate || 'N/A'}</p>
            <p>Band: {selectedItem.band || 'N/A'}</p>
            <p>Description: {selectedItem.description || 'N/A'}</p>
          </div>
        ),
      };
    } else if ('meterNumber' in selectedItem && 'meterType' in selectedItem) {
      // Meter
      return {
        message: `Are you sure you want to ${action} the meter with number "${selectedItem.meterNumber}" and type "${selectedItem.meterType}"?`,
        details: (
          <div className="mt-2 text-sm text-gray-600">
            <p>Category: {selectedItem.category || 'N/A'}</p>
            <p>Manufacturer: {selectedItem.manufacturer || 'N/A'}</p>
            <p>Status: {selectedItem.status ? 'Active' : 'Inactive'}</p>
          </div>
        ),
      };
    }

    return {
      message: `Please confirm you would like to ${action} this change`,
      details: null,
    };
  };

  const { message, details } = getMessageAndDetails();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[380px] h-fit mx-auto bg-white text-black z-[1000]">
        <DialogHeader>
          <div className="mb-2 flex justify-items-start">
            <AlertTriangle size={24} className={alertTriangleClass} />
          </div>
          <DialogTitle className="text-start text-lg font-semibold text-gray-900">{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-700 text-start">{message}</p>
          {details}
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