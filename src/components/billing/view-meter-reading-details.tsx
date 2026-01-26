// components/meter-readings/ViewMeterReadingDetails.tsx
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface MeterReading {
    meterNumber: string;
    readingType: string;
    lastReading: number;
    currentReading: number;
    currentReadingDate: string;
    lastReadingDate: string;
    billMonth: string;
    billYear: string;
    createdAt: string;
    updatedAt: string;
    tariffType: string;
    feederName: string;
    dssName: string;
    meterClass: string;
    type: string;
}

interface ViewMeterReadingDetailsProps {
    open: boolean;
    onClose: () => void;
    data: MeterReading; // Pass the entire item data
}

export default function ViewMeterReadingDetails({ open, onClose, data }: ViewMeterReadingDetailsProps) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-white p-6 h-fit w-full max-w-md">
                <DialogHeader>
                    <DialogTitle>View Details</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4 text-sm">
                    <div className="grid grid-cols-2 items-center gap-2">
                        <Label className="font-semibold">Meter No.:</Label>
                        <span>{data.meterNumber}</span>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-2">
                        <Label className="font-semibold">Feeder Line:</Label>
                        <span>{data.feederName}</span>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-2">
                        <Label className="font-semibold">DSS Name:</Label>
                        <span>{data.dssName}</span>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-2">
                        <Label className="font-semibold">Tariff Type:</Label>
                        <span>{data.tariffType}</span>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-2">
                        <Label className="font-semibold">Meter Class:</Label>
                        <span>{data.meterClass}</span>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-2">
                        <Label className="font-semibold">Type:</Label>
                        <span>{data.type}</span>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-2">
                        <Label className="font-semibold">Bill Month/Year:</Label>
                        <span>{data.billMonth} {data.billYear}</span>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-2">
                        <Label className="font-semibold">Last Actual Reading Date:</Label>
                        <span>{data.lastReadingDate}</span>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-2">
                        <Label className="font-semibold">Last Actual Reading:</Label>
                        <span>{data.lastReading}</span>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-2">
                        <Label className="font-semibold">Reading Type:</Label>
                        <span>{data.readingType}</span>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-2">
                        <Label className="font-semibold">Reading Date:</Label>
                        <span>{data.currentReadingDate}</span>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-2">
                        <Label className="font-semibold">Current Readings:</Label>
                        <span>{data.currentReading}</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}