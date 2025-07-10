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
            <DialogContent className="max-w-2xl h-fit mx-auto bg-white text-black p-4 sm:p-6">
                <div className="w-full">
                    <DialogHeader>
                        <DialogTitle className="text-left text-base sm:text-lg">
                            {selectedRow?.changeDescription}
                        </DialogTitle>
                        <span className="text-gray-500 text-sm sm:text-base">
                            Operator: <span>Margaret</span>
                        </span>
                    </DialogHeader>

                    <div className="flex flex-col gap-3 py-4">
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
                            <div
                                key={label}
                                className="flex items-center gap-4 px-1 sm:px-2"
                            >
                                <div className="min-w-[130px] text-sm font-medium text-gray-700 whitespace-nowrap">
                                    {label}
                                </div>

                                <div className="flex-1 text-sm font-bold text-gray-900 truncate">
                                    {oldValue}
                                </div>

                                {!isNewlyAdded && newValue != null && (
                                    <div className="min-w-[150px] flex items-center gap-6 text-sm text-gray-900 ml-6">
                                        <MoveRight
                                            className="text-black scale-x-[2] origin-left"
                                            size={14}
                                        />
                                        <span className="font-bold whitespace-nowrap">{newValue ?? ''}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between mt-6 w-[300px]">
                        <Button
                            onClick={() => selectedRow && onReject(selectedRow)}
                            variant="outline"
                            className="border-red-500 focus:ring-red-500/0 text-red-500 bg-white text-sm sm:text-base"
                            disabled={!selectedRow}
                        >
                            Reject
                        </Button>
                        <Button
                            variant="default"
                            onClick={() => selectedRow && onApprove(selectedRow)}
                            className="bg-[#22C55E] text-white text-sm sm:text-base"
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