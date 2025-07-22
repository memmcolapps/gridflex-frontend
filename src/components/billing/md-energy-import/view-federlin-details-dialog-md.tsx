import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface ViewDetailsDialogProps {
    open: boolean;
    onClose: () => void;
    data: {
        meterNumber: string;
        accountNumber: string;
        customerName: string;
        customerAddress: string;
        dss: string;
        averageConsumption: string;
        previousConsumption: string;
        consumedEnergy: string;
        energyType: string;
        cumulativeReading: string;
        tariffType: string;
    };
}

export default function ViewDetailsDialog({ open, onClose, data }: ViewDetailsDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-full h-fit bg-white ring-0 ring-gray-50 border-none focus:border-none rounded-lg shadow-lg">
                <DialogHeader>
                    <DialogTitle>View Details</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 space-y-2 p-4">
                        <Label className="text-sm font-medium text-gray-700">Meter Number:</Label>
                        <p className="text-sm text-black">{data.meterNumber}</p>
                        <Label className="text-sm font-medium text-gray-700">Account Number:</Label>
                        <p className="text-sm text-black">{data.accountNumber}</p>
                        <Label className="text-sm font-medium text-gray-700">Customer Name:</Label>
                        <p className="text-sm text-black">{data.customerName}</p>
                        <Label className="text-sm font-medium text-gray-700">Customer Address:</Label>
                        <p className="text-sm text-black">{data.customerAddress}</p>
                        <Label className="text-sm font-medium text-gray-700">DSS:</Label>
                        <p className="text-sm text-black">{data.dss}</p>
                        <Label className="text-sm font-medium text-gray-700">Average Consumption:</Label>
                        <p className="text-sm text-black">{data.averageConsumption}</p>
                        <Label className="text-sm font-medium text-gray-700">Previous Consumption:</Label>
                        <p className="text-sm text-black">{data.previousConsumption}</p>
                        <Label className="text-sm font-medium text-gray-700">Consumed Energy:</Label>
                        <p className="text-sm text-black">{data.consumedEnergy}</p>
                        <Label className="text-sm font-medium text-gray-700">Energy Type:</Label>
                        <p className="text-sm text-black">{data.energyType}</p>
                        <Label className="text-sm font-medium text-gray-700">Cumulative Reading:</Label>
                        <p className="text-sm text-black">{data.cumulativeReading}</p>
                        <Label className="text-sm font-medium text-gray-700">Tariff Type:</Label>
                        <p className="text-sm text-black">{data.tariffType}</p>
                </div>
            </DialogContent>
        </Dialog>
    );
}