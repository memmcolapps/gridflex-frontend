import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MoveRight } from 'lucide-react';

interface TariffItem {
  id: number;
  tariffName: string;
  tariffId: string;
  tariffType: string;
  bandCode: string;
  tariffRate: string;
  effectiveDate: string;
  changeDescription: string;
  approvalStatus: string;
  newTariffName?: string;
  newTariffId?: string;
  newTariffType?: string;
  newBandCode?: string;
  newTariffRate?: string;
  newEffectiveDate?: string;
}

interface ViewTariffDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRow: TariffItem | null;
  onApprove: (row: TariffItem) => void;
  onReject: (row: TariffItem) => void;
}

const ViewTariffDetailsDialog: React.FC<ViewTariffDetailsDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedRow,
  onApprove,
  onReject,
}) => {
  const isTariffEdited = selectedRow?.changeDescription === 'Tariff Edited';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-fit lg:max-w-[1200px] bg-white text-black p-4 sm:p-6 rounded-lg shadow-lg overflow-hidden h-fit"
      >
        <div className="w-full">
          <DialogHeader>
            <DialogTitle className="text-left text-base sm:text-lg font-semibold text-gray-900 truncate">
              {selectedRow?.changeDescription ?? 'Tariff Details'}
            </DialogTitle>
            <span className="text-gray-500 text-sm sm:text-base">
              Operator: <span className="font-medium">Margaret</span>
            </span>
          </DialogHeader>

          <div className="flex flex-col gap-3 py-4 sm:py-6">
            {[
              {
                label: 'Tariff Name:',
                oldValue: selectedRow?.tariffName,
                newValue: selectedRow?.newTariffName,
              },
              {
                label: 'Tariff ID:',
                oldValue: selectedRow?.tariffId,
                newValue: selectedRow?.newTariffId,
              },
              {
                label: 'Tariff Type:',
                oldValue: selectedRow?.tariffType,
                newValue: selectedRow?.newTariffType,
              },
              {
                label: 'Band Code:',
                oldValue: selectedRow?.bandCode,
                newValue: selectedRow?.newBandCode,
              },
              {
                label: 'Tariff Rate:',
                oldValue: selectedRow?.tariffRate,
                newValue: selectedRow?.newTariffRate,
              },
              {
                label: 'Effective Date:',
                oldValue: selectedRow?.effectiveDate,
                newValue: selectedRow?.newEffectiveDate,
              },
            ].map(({ label, oldValue, newValue }) => (
              <div
                key={label}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                {/* Label */}
                <div className="w-[100px] sm:w-[120px] text-sm sm:text-base font-medium text-gray-700 whitespace-nowrap">
                  {label}
                </div>

                {/* Old Value */}
                <div className="w-full sm:w-[120px] lg:max-w-[700px] text-sm sm:text-base font-bold text-gray-900 whitespace-nowrap ml-20">
                  {oldValue ?? 'N/A'}
                </div>

                {/* New Value */}
                {isTariffEdited && newValue != null && (
                  <div className="flex items-start text-sm sm:text-base text-gray-900 whitespace-nowrap ml-10">
                    <MoveRight
                      className="text-gray-900 mr-6 scale-x-185"
                      size={16}
                    />
                    <span className="font-bold truncate">{newValue}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
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

export default ViewTariffDetailsDialog;