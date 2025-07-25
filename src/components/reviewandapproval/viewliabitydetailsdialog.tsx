import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
            <DialogContent
                className="w-fit lg:max-w-[1000px] bg-white text-black p-4 sm:p-6 rounded-lg shadow-lg overflow-hidden h-fit 

"
            >
                <div className="w-full">
                    <DialogHeader>
                        <DialogTitle className="text-left text-base sm:text-lg font-semibold text-gray-900 truncate">
                            {selectedRow?.changeDescription ?? 'Details'}
                        </DialogTitle>
                        <span className="text-gray-500 text-sm sm:text-base">
                            Operator: <span className="font-medium">Margaret</span>
                        </span>
                    </DialogHeader>

                    <div className="flex flex-col gap-3 py-4 sm:py-6">
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
                            <div
                                key={label}
                                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full"
                            >
                                {/* Label */}
                                <div className="w-full sm:w-[120px] text-sm sm:text-base font-medium text-gray-700 whitespace-nowrap">
                                    {label}
                                </div>

                                {/* Old Value */}
                                <div className="w-full sm:w-[150px] text-sm sm:text-base font-bold text-gray-900 whitespace-nowrap ml-10">
                                    {oldValue ??'N/A'}
                                </div>

                                {/* New Value */}
                                {!isNewlyAdded && newValue != null && (
                                    <div className="flex items-center w-full sm:w-[150px] text-sm sm:text-base text-gray-900 whitespace-nowrap ml-14">
                                        <MoveRight
                                            className="text-gray-900 mr-3 sm:mr-4 scale-x-185"
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

export default ViewLiabilityDetailsDialog;