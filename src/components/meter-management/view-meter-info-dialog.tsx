import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import type { MeterInventoryItem } from "@/types/meter-inventory";

interface ViewMeterInfoDialogProps {
    isOpen: boolean;
    onClose: () => void;
    meter: MeterInventoryItem | null;
}

export function ViewMeterInfoDialog({ isOpen, onClose, meter }: ViewMeterInfoDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="h-fit max-h-[400px] overflow-y-auto bg-white w-[500px] rounded-lg">
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
                            <span className="text-gray-900 font-bold">{meter.simNumber}</span>
                        </div>
                        
                        <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                            <span className="font-medium text-gray-700">Meter Manufacturer:</span>
                            <span className="text-gray-900 font-bold">{meter.manufacturer?.name}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                            <span className="font-medium text-gray-700">Meter Class:</span>
                            <span className="text-gray-900 font-bold">{meter.meterClass}</span>
                        </div>
                      
                        <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                            <span className="font-medium text-gray-700">Smart Meter:</span>
                            <span className="text-gray-900 font-bold">
                                {meter.smartStatus ? "Smart" : "Not Smart"}
                            </span>
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
                    {meter.meterClass === 'MD' && (
                        <>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                            <span className="font-medium text-gray-700">CT Ratio Numerator :</span>
                            <span className="text-gray-900 font-bold">{meter.mdMeterInfo?.ctRatioNum}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                            <span className="font-medium text-gray-700">CT Ratio Denominator :</span>
                            <span className="text-gray-900 font-bold">{meter.mdMeterInfo?.ctRatioDenom}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                            <span className="font-medium text-gray-700">Voltage Ratio Numerator:</span>
                            <span className="text-gray-900 font-bold">{meter.mdMeterInfo?.voltRatioNum}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                            <span className="font-medium text-gray-700">Voltage Ratio Denominator:</span>
                            <span className="text-gray-900 font-bold">{meter.mdMeterInfo?.voltRatioDenom}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                            <span className="font-medium text-gray-700">Multiplier:</span>
                            <span className="text-gray-900 font-bold">{meter.mdMeterInfo?.multiplier}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                            <span className="font-medium text-gray-700">Meter Rating:</span>
                            <span className="text-gray-900 font-bold">{meter.mdMeterInfo?.meterRating}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                            <span className="font-medium text-gray-700">Initial Reading:</span>
                            <span className="text-gray-900 font-bold">{meter.mdMeterInfo?.initialReading}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                            <span className="font-medium text-gray-700">Dial:</span>
                            <span className="text-gray-900 font-bold">{meter.mdMeterInfo?.dial}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                            <span className="font-medium text-gray-700">Longitude:</span>
                            <span className="text-gray-900 font-bold">{meter.mdMeterInfo?.longitude}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                            <span className="font-medium text-gray-700">Latitude:</span>
                            <span className="text-gray-900 font-bold">{meter.mdMeterInfo?.latitude}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                            <span className="font-medium text-gray-700">Meter Model:</span>
                            <span className="text-gray-900 font-bold">{meter.smartMeterInfo?.meterModel}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                            <span className="font-medium text-gray-700">Protocol:</span>
                            <span className="text-gray-900 font-bold">{meter.smartMeterInfo?.protocol}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                            <span className="font-medium text-gray-700">Authentication:</span>
                            <span className="text-gray-900 font-bold">{meter.smartMeterInfo?.authentication}</span>
                        </div>
                        
                        </>
                    )}
                    </div>
                )}
                <DialogFooter>

                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}