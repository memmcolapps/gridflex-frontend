import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import type { MeterData } from "@/types/meter";

// interface MeterData {
//     id: number;
//     meterNumber: string;
//     manufactureName: string;
//     class: string;
//     meterType: string;
//     category: string;
//     dateAdded: string;
//     oldSgc: string;
//     newSgc: string;
//     oldKrn: string;
//     newKrn: string;
//     oldTariffIndex: string;
//     newTariffIndex: string;
//     simNo: string;
//     smartMeter: string;
//     ctRatioNumerator: string;
//     ctRatioDenominator: string;
//     voltageRatioNumerator: string;
//     voltageRatioDenominator: string;
//     multiplier: string;
//     meterRating: string;
//     initialReading: string;
//     dial: string;
//     longitude: string;
//     latitude: string;
//     meterModel: string,
//     protocol: string
//     authentication: string
//     password: string
// }
interface ViewMeterInfoDialogProps {
    isOpen: boolean;
    onClose: () => void;
    meter: MeterData | null;
}

export function ViewMeterInfoDialog({ isOpen, onClose, meter }: ViewMeterInfoDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="h-fit overflow-y-auto bg-white w-[500px] rounded-lg">
                <DialogHeader>
                    <DialogTitle>View Details</DialogTitle>
                    <DialogDescription />
                </DialogHeader>
                {meter && (
                    <div className="grid gap-4 py-2 px-4">
                        <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                            <span className="font-medium text-gray-700">Meter Number:</span>
                            <span className="text-gray-900 font-bold">{meter.meterNumber}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                            <span className="font-medium text-gray-700">SIM No:</span>
                            <span className="text-gray-900 font-bold">{meter.simNo}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                            <span className="font-medium text-gray-700">Meter Type:</span>
                            <span className="text-gray-900 font-bold">{meter.meterType}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                            <span className="font-medium text-gray-700">Meter Manufacturer:</span>
                            <span className="text-gray-900 font-bold">{meter.manufactureName}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                            <span className="font-medium text-gray-700">Meter Class:</span>
                            <span className="text-gray-900 font-bold">{meter.class}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                            <span className="font-medium text-gray-700">Meter Category:</span>
                            <span className="text-gray-900 font-bold">{meter.category}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                            <span className="font-medium text-gray-700">Smart Meter:</span>
                            <span className="text-gray-900 font-bold">{meter.smartMeter ?? "N/A"}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                            <span className="font-medium text-gray-700">Old SGC:</span>
                            <span className="text-gray-900 font-bold">{meter.oldSgc}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                            <span className="font-medium text-gray-700">New SGC:</span>
                            <span className="text-gray-900 font-bold">{meter.newSgc}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                            <span className="font-medium text-gray-700">Old KRN:</span>
                            <span className="text-gray-900 font-bold">{meter.oldKrn}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                            <span className="font-medium text-gray-700">New KRN:</span>
                            <span className="text-gray-900 font-bold">{meter.newKrn}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                            <span className="font-medium text-gray-700">Old Tariff Index:</span>
                            <span className="text-gray-900 font-bold">{meter.oldTariffIndex}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                            <span className="font-medium text-gray-700">New Tariff Index:</span>
                            <span className="text-gray-900 font-bold">{meter.newTariffIndex}</span>
                        </div>
                    
                    </div>
                )}
                <DialogFooter>
                 
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}