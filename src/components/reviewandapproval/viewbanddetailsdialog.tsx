import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { MoveRight } from 'lucide-react';

interface BandItem {
    id: number;
    bandName: string;
    electricityHr: string;
    changeDescription: string;
    approvalStatus: string;
    newBandName?: string;
    newElectricityHr?: string;
}

interface ViewBandDetailsDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedRow: BandItem | null;
    onApprove: (row: BandItem) => void;
    onReject: (row: BandItem) => void;
}

const ViewBandDetailsDialog: React.FC<ViewBandDetailsDialogProps> = ({
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
                className="w-full bg-white text-black p-4 sm:p-6 rounded-lg shadow-lg overflow-hidden h-fit 

"
            >
                <div className="w-full">
                    <DialogHeader>
                        <DialogTitle className="text-left text-base sm:text-lg">{selectedRow?.changeDescription}</DialogTitle>
                        <span className="text-gray-500 text-sm sm:text-base">
                            Operator: <span>Margaret</span>
                        </span>
                    </DialogHeader>
                    <div className="grid gap-4 py-6 sm:py-8">
                        {[
                            {
                                label: 'Band Name:',
                                oldValue: selectedRow?.bandName,
                                newValue: selectedRow?.newBandName,
                            },
                            {
                                label: 'Electricity Hr:',
                                oldValue: selectedRow?.electricityHr,
                                newValue: selectedRow?.newElectricityHr,
                            },
                        ].map(({ label, oldValue, newValue }) => (
                            <div key={label} className="flex items-center gap-2 sm:gap-4 flex-col sm:flex-row">
                                <div className="w-[100px] sm:w-[120px] text-sm font-medium text-gray-700 shrink-0">{label}</div>
                                <div className="flex-1 text-sm text-gray-900 font-bold whitespace-nowrap overflow-hidden text-ellipsis">{oldValue}</div>
                                {!isNewlyAdded && newValue != null ? (
                                    <div className="w-[120px] sm:w-[140px] flex items-center gap-1 text-sm text-gray-900 ml-2 sm:ml-4">
                                        <MoveRight
                                            size={14}
                                            className="text-black scale-x-[2] scale-y-[1] origin-left"
                                        />
                                        <span className="font-bold ml-4 whitespace-nowrap">{newValue ?? ''}</span>
                                    </div>
                                ) : (
                                    ''
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center">
                        <div className="flex justify-between w-full ml-4 sm:ml-4">
                            <Button
                                onClick={() => selectedRow && onReject(selectedRow)}
                                variant="outline"
                                className="border-red-500 focus:ring-red-500/20 text-red-500 bg-white text-sm sm:text-base px-4 sm:px-6"
                                disabled={!selectedRow}
                            >
                                Reject
                            </Button>
                            <Button
                                variant="default"
                                onClick={() => selectedRow && onApprove(selectedRow)}
                                className="bg-[#22C55E] text-white text-sm sm:text-base px-4 sm:px-6"
                                disabled={!selectedRow}
                            >
                                Approve
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewBandDetailsDialog;