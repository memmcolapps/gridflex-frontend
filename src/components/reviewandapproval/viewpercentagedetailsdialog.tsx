import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { MoveRight } from 'lucide-react';

interface ViewDetailsDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedRow: {
        changeDescription?: string;
        percentage?: string | number;
        percentageCode?: string;
        band?: string;
        amountRange?: string;
        newPercentage?: string | number;
        newPercentageCode?: string;
        newBand?: string;
        newAmountRange?: string;
        [key: string]: any;
    } | null;
    onApprove: (row: any) => void;
    onReject: (row: any) => void;
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
            <DialogContent className="sm:max-w-fit h-fit mx-auto bg-white text-black">
                <DialogHeader>
                    <DialogTitle className="text-left">{selectedRow?.changeDescription}</DialogTitle>
                    <span className='text-gray-500'>Operator:<span>Margaret</span></span>
                </DialogHeader>
                <div className="grid gap-4 py-8">
                    <div className="grid grid-cols-[150px_1fr_150px] items-center gap-4">
                        <span className="text-sm font-medium text-gray-700">Percentage:</span>
                        <span className="text-sm text-gray-900 font-bold">{selectedRow?.percentage}</span>
                        {!isNewlyAdded && (
                            <span className="text-sm text-gray-900 flex items-center justify-end gap-1 w-20 ml-[37px]">
                                <MoveRight size={14} className="text-black transform scale-x-250" />&nbsp;&nbsp;&nbsp;
                                <span className='font-bold'>{selectedRow?.newPercentage ?? 'N/A'}</span>
                            </span>
                        )}
                    </div>
                    <div className="grid grid-cols-[150px_1fr_150px] items-center gap-4">
                        <span className="text-sm font-medium text-gray-700">Percentage Code:</span>
                        <span className="text-sm text-gray-900 font-bold">{selectedRow?.percentageCode}</span>
                        {!isNewlyAdded && (
                            <span className="text-sm text-gray-900 flex items-center justify-end gap-1 w-25 ml-[40px]">
                                <MoveRight size={14} className="text-black transform scale-x-250" />&nbsp;&nbsp;
                                <span className='font-bold'>{selectedRow?.newPercentageCode ?? 'N/A'}</span>
                            </span>
                        )}
                    </div>
                    <div className="grid grid-cols-[150px_1fr_150px] items-center gap-4">
                        <span className="text-sm font-medium text-gray-700">Band Code:</span>
                        <span className="text-sm text-gray-900 font-bold">{selectedRow?.band}</span>
                        {!isNewlyAdded && (
                            <span className="text-sm text-gray-900 flex items-center justify-end gap-1 w-25 ml-[40px]">
                                <MoveRight size={14} className="text-black transform scale-x-250" />&nbsp;&nbsp;
                                <span className='font-bold'>{selectedRow?.newBand ?? 'N/A'}</span>
                            </span>
                        )}
                    </div>
                    <div className="grid grid-cols-[150px_1fr_150px] items-center gap-4">
                        <span className="text-sm font-medium text-gray-700">Amount Range:</span>
                        <span className="text-sm text-gray-900 font-bold w-40">{selectedRow?.amountRange}</span>
                        {!isNewlyAdded && (
                            <span className="text-sm text-gray-900 flex items-center justify-end gap-1 w-38 ml-[25px]">
                                <MoveRight size={14} className="text-black transform scale-x-250" />&nbsp;&nbsp;                            
                                <span className='font-bold w-20'>{selectedRow?.newAmountRange ?? 'N/A'}</span>                           
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex justify-between">
                    <Button
                        onClick={() => onReject(selectedRow)}
                        variant="outline"
                        className="border-red-500 text-red-500 bg-white"
                    >
                        Reject
                    </Button>
                    <Button
                        variant="default"
                        onClick={() => onApprove(selectedRow)}
                        className="bg-[#22C55E] text-white"
                    >
                        Approve
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewDetailsDialog;