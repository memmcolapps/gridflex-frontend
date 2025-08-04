import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import type { VirtualMeterData } from "@/types/meter";


interface ViewVirtualMeterDetailsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    meter: VirtualMeterData | null;
}

export function ViewVirtualMeterDetailsDialog({ isOpen, onClose, meter }: ViewVirtualMeterDetailsDialogProps) {
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
                            <span className="font-medium text-gray-700">Customer ID:</span>
                            <span className="text-gray-900 font-bold">{meter.customerId}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                            <span className="font-medium text-gray-700">Meter Number:</span>
                            <span className="text-gray-900 font-bold">{meter.meterNumber}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                            <span className="font-medium text-gray-700">Account Number:</span>
                            <span className="text-gray-900 font-bold">{meter.accountNumber}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                            <span className="font-medium text-gray-700">Consumption Type:</span>
                            <span className="text-gray-900 font-bold">{meter.consumptionType}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                            <span className="font-medium text-gray-700">Feeder:</span>
                            <span className="text-gray-900 font-bold">{meter.feeder}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                            <span className="font-medium text-gray-700">DSS:</span>
                            <span className="text-gray-900 font-bold">{meter.dss}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                            <span className="font-medium text-gray-700">CIN:</span>
                            <span className="text-gray-900 font-bold">{meter.cin}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                            <span className="font-medium text-gray-700">Energy Type:</span>
                            <span className="text-gray-900 font-bold">{meter.energyType}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                            <span className="font-medium text-gray-700">Fixed Energy:</span>
                            <span className="text-gray-900 font-bold">{meter.fixedEnergy}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                            <span className="font-medium text-gray-700">Tariff:</span>
                            <span className="text-gray-900 font-bold">{meter.tariff}</span>
                        </div>
                    </div>
                )}
                <DialogFooter />
            </DialogContent>
        </Dialog>
    );
}