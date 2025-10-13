import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { MoveRight } from 'lucide-react';
import type { Band } from '@/types/review-approval';
import { useAuth } from '@/context/auth-context';

interface ViewBandDetailsDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedRow: Band | null;
    onApprove: (row: Band) => void;
    onReject: (row: Band) => void;
}

const ViewBandDetailsDialog: React.FC<ViewBandDetailsDialogProps> = ({
    isOpen,
    onOpenChange,
    selectedRow,
    onApprove,
    onReject,
}) => {
     const { user } = useAuth();
    const isNewlyAdded = selectedRow?.description === 'Newly Added';

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent
                className="w-fit lg:max-w-[1250px] bg-white text-black p-4 sm:p-6 rounded-lg shadow-lg overflow-hidden h-fit"
            >
                <div className="w-fit">
                    <DialogHeader>
                        <DialogTitle className="text-left text-base sm:text-lg font-semibold text-gray-900 truncate">
                            {selectedRow?.description ?? 'Band Details'}
                        </DialogTitle>
                        <span className="text-gray-500 text-sm sm:text-base">
                            Operator: {user?.business?.businessName?.toUpperCase() ?? 'BUSINESS NAME'}
                        </span>
                    </DialogHeader>

                    <div className="flex flex-col gap-3 py-4 sm:py-6">
                        {selectedRow?.description === 'Band Edited' && (
                            <div className="hidden sm:flex items-center gap-2 ml-[100px] sm:ml-[140px] mb-1">
                                <div className="w-[120px] text-center font-semibold text-gray-500">From</div>
                                <div className="w-[120px] text-center font-semibold text-gray-500 ml-22">To</div>
                            </div>
                        )}

                        {[
                            {
                                label: 'Band Name:',
                                oldValue: selectedRow?.oldBandInfo?.name,
                                newValue: selectedRow?.name, 
                            },
                            {
                                label: 'Electricity Hour:',
                                oldValue: selectedRow?.oldBandInfo?.hour,
                                newValue: selectedRow?.hour, 
                            },
                        ].map(({ label, oldValue, newValue }) => (
                            <div
                                key={label}
                                className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
                            >
                                <div className="w-[100px] sm:w-[120px] text-sm sm:text-base font-medium text-gray-700 whitespace-nowrap">
                                    {label}
                                </div>

                                <div className="w-full sm:w-[120px] lg:max-w-[700px] text-sm sm:text-base font-bold text-gray-900 whitespace-nowrap ml-20">
                                    {oldValue ?? 'N/A'}
                                </div>

                                {!isNewlyAdded && newValue != null && (
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

export default ViewBandDetailsDialog;