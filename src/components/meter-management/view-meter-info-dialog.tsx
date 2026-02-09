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

                    </div>
                )}
                <DialogFooter>

                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}