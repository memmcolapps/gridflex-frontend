import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { MoveRight } from 'lucide-react';

interface PercentageRangeItem {
    id: number;
    percentage: string;
    percentageCode: string;
    band: string;
    amountRange: string;
    changeDescription: string;
    approvalStatus: string;
    newPercentage?: string;
    newPercentageCode?: string;
    newBand?: string;
    newAmountRange?: string;
}

interface ViewDetailsDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedRow: PercentageRangeItem | null;
    onApprove: (row: PercentageRangeItem) => void;
    onReject: (row: PercentageRangeItem) => void;
}

const ViewDetailsDialog: React.FC<ViewDetailsDialogProps> = ({
    isOpen,
    onOpenChange,
    selectedRow,
    onApprove,
    onReject,
}) => {
    const isNewlyAdded = selectedRow?.changeDescription === 'Newly Added';
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="w-fit h-fit mx-auto bg-white text-black">
                <DialogHeader>
                    <DialogTitle className="text-left">{selectedRow?.changeDescription}</DialogTitle>
                    <span className='text-gray-500'>Operator:<span>Margaret</span></span>
                </DialogHeader>
                {/* <div className="grid gap-4 py-8"> */}
                    <div className="grid gap-4 py-8">
                        {[
                            {
                                label: 'Percentage:',
                                oldValue: selectedRow?.percentage,
                                newValue: selectedRow?.newPercentage,
                            },
                            {
                                label: 'Percentage Code:',
                                oldValue: selectedRow?.percentageCode,
                                newValue: selectedRow?.newPercentageCode,
                            },
                            {
                                label: 'Band Code:',
                                oldValue: selectedRow?.band,
                                newValue: selectedRow?.newBand,
                            },
                            {
                                label: 'Amount Range:',
                                oldValue: selectedRow?.amountRange,
                                newValue: selectedRow?.newAmountRange,
                            },
                        ].map(({ label, oldValue, newValue }) => (
                            <div key={label} className="flex items-center gap-4">
                                <div className="w-[150px] text-sm font-medium text-gray-700">{label}</div>
                                <div className="flex-1 text-sm text-gray-900 font-bold">{oldValue}</div>
                                {!isNewlyAdded && (
                                    <div className="w-[180px] flex items-center gap-1 text-sm text-gray-900 ml-20">
                                        <MoveRight
                                            size={14}
                                            className="text-black scale-x-[2] scale-y-[1] origin-left"
                                        />
                                        <span className="font-bold ml-4">{newValue ?? 'N/A'}</span>
                                    </div>

                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between">
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
                {/* </div> */}

            </DialogContent>
        </Dialog>
    );
};

export default ViewDetailsDialog;