import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,

} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import {  MoveRight } from 'lucide-react';

interface ViewDetailsDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedRow: {
        changeDescription?: string;
        percentage?: string | number;
        percentageCode?: string;
        band?: string;
        amountRange?: string;
        [key: string]: any;
    } | null;
    onApprove: (row: any) => void;
    onReject: (row: any) => void;
}

const ViewDetailsDialog: React.FC<ViewDetailsDialogProps> = ({ isOpen, onOpenChange, selectedRow, onApprove, onReject }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[380px] h-fit mx-auto bg-white text-black">
                <DialogHeader>
                    <DialogTitle className="text-left">{selectedRow?.changeDescription}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-8">
                    <div className="grid grid-cols-[150px_2fr_2fr] items-center gap-4">
                        <span className="text-sm font-medium text-gray-700">Percentage:</span>
                        <span className="text-sm text-gray-900">{selectedRow?.percentage}</span>

                        <span className="text-sm text-gray-900 flex items-center justify-end gap-1">
                            <MoveRight size={14} className="text-black-500 transform scale-x-200" />&nbsp;&nbsp;&nbsp;&nbsp;
                            {selectedRow?.newPercentage || 'N/A'}
                        </span>

                    </div>
                    <div className="grid grid-cols-[150px_1fr_1fr] items-center gap-4">
                        <span className="text-sm font-medium text-gray-700">Percentage Code:</span>
                        <span className="text-sm text-gray-900">{selectedRow?.percentageCode}</span>
                        <span className="text-sm text-gray-900 flex items-center justify-end gap-1">
                           <MoveRight size={14} className="text-black-500 transform scale-x-200" />&nbsp;&nbsp;&nbsp;&nbsp;
                            {selectedRow?.newPercentageCode || 'N/A'}
                        </span>
                    </div>
                    <div className="grid grid-cols-[150px_1fr_1fr] items-center gap-4">
                        <span className="text-sm font-medium text-gray-700">Band Code:</span>
                        <span className="text-sm text-gray-900">{selectedRow?.band}</span>
                        <span className="text-sm text-gray-900 flex items-center justify-end gap-1">
                             <MoveRight size={14} className="text-black-500 transform scale-x-200" />&nbsp;&nbsp;&nbsp;&nbsp;
                            {selectedRow?.newBand || 'N/A'}
                        </span>
                    </div>
                    <div className="grid grid-cols-[150px_1fr_1fr] items-center gap-4">
                        <span className="text-sm font-medium text-gray-700">Amount Range:</span>
                        <span className="text-sm text-gray-900">{selectedRow?.band}</span>
                        <span className="text-sm text-gray-900 flex items-center justify-end gap-1">
                            <MoveRight size={14} className="text-black-500 transform scale-x-200" />&nbsp;&nbsp;&nbsp;&nbsp;
                            {selectedRow?.newBand || 'N/A'}
                        </span>
                    </div>
                </div>
                <div className="flex justify-between">
                    <Button
                        onClick={() => onReject(selectedRow)}
                        className="border-red-300 text-red-500"
                    >
                        Reject
                    </Button>
                    <Button
                        variant="default"
                        onClick={() => onApprove(selectedRow)}
                        className="bg-green-600 text-white"
                    >
                        Approve
                    </Button>

                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewDetailsDialog;