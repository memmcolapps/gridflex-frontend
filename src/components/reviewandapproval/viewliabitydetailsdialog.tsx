import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { MoveRight } from 'lucide-react';

interface LiabilityCauseItem {
  id: number;
  liabilityName: string;
  liabilityCode: string;
  changeDescription: string;
  approvalStatus: string;
  newLiabilityName?: string;
  newLiabilityCode?: string;
}

interface ViewLiabilityDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRow: LiabilityCauseItem | null;
  onApprove: (row: LiabilityCauseItem) => void;
  onReject: (row: LiabilityCauseItem) => void;
}

const ViewLiabilityDetailsDialog: React.FC<ViewLiabilityDetailsDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedRow,
  onApprove,
  onReject,
}) => {
  const isNewlyAdded = selectedRow?.changeDescription === 'Newly Added';
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] h-fit mx-auto bg-white text-black">
        <DialogHeader>
          <DialogTitle className="text-left">{selectedRow?.changeDescription}</DialogTitle>
          <span className="text-gray-500">
            Operator: <span>Margaret</span>
          </span>
        </DialogHeader>
        <div className="grid gap-4 py-8">
          {[
            {
              label: 'Liability Name:',
              oldValue: selectedRow?.liabilityName,
              newValue: selectedRow?.newLiabilityName,
            },
            {
              label: 'Liability Code:',
              oldValue: selectedRow?.liabilityCode,
              newValue: selectedRow?.newLiabilityCode,
            },
          ].map(({ label, oldValue, newValue }) => (
            <div key={label} className="flex items-center gap-4">
              <div className="w-[150px] text-sm font-medium text-gray-700">{label}</div>
              <div className="flex-1 text-sm text-gray-900 font-bold whitespace-nowrap">{oldValue}</div>
              {!isNewlyAdded && newValue != null ? (
                <div className="w-[180px] flex items-center gap-1 text-sm text-gray-900 ml-20">
                  <MoveRight
                    size={14}
                    className="text-black scale-x-[2] scale-y-[1] origin-left"
                  />
                  <span className="font-bold ml-4">{newValue ?? ''}</span>
                </div>
              ) : (
                ''
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between w-[440px]">
          <Button
            onClick={() => selectedRow && onReject(selectedRow)}
            variant="outline"
            className="border-red-500 text-red-500 bg-white"
            disabled={!selectedRow}
          >
            Reject
          </Button>
          <Button
            variant="default"
            onClick={() => selectedRow && onApprove(selectedRow)}
            className="bg-[#22C55E] text-white"
            disabled={!selectedRow}
          >
            Approve
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewLiabilityDetailsDialog;