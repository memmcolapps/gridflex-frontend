// components/billing/energy-import/view-energy-import-details.tsx
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface EnergyImportData {
    id: number;
    feederName: string;
    assetId: string;
    feederConsumption: string;
    prepaidConsumption: string;
    postpaidConsumption: string;
    mdVirtual: string;
    nonMdVirtual: string;
}

interface ViewEnergyImportDetailsProps {
    open: boolean;
    onClose: () => void;
    data: EnergyImportData;
}

export default function ViewEnergyImportDetails({
    open,
    onClose,
    data,
}: ViewEnergyImportDetailsProps) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="h-fit w-full max-w-3xl bg-white p-6">
                <DialogHeader>
                    <DialogTitle>View Details</DialogTitle>
                </DialogHeader>
                <div
                    className="grid gap-4 py-4 text-sm"
                    style={{ gridTemplateColumns: "1fr 1fr" }}
                >
                    <Label className="whitespace-nowrap text-gray-600">
                        Feeder Name:
                    </Label>
                    <span className="font-semibold text-gray-900">{data.feederName}</span>

                    <Label className="whitespace-nowrap text-gray-600">Asset ID:</Label>
                    <span className="font-semibold text-gray-900">{data.assetId}</span>

                    <Label className="whitespace-nowrap text-gray-600">
                        Feeder Consumption:
                    </Label>
                    <span className="font-semibold text-gray-900">
                        {parseFloat(data.feederConsumption).toLocaleString()}
                    </span>

                    <Label className="whitespace-nowrap text-gray-600">
                        Prepaid Consumption:
                    </Label>
                    <span className="font-semibold text-gray-900">
                        {parseFloat(data.prepaidConsumption).toLocaleString()}
                    </span>

                    <Label className="whitespace-nowrap text-gray-600">
                        Number of Prepaid Meters:
                    </Label>
                    <span className="font-semibold text-gray-900">4500</span>

                    <Label className="whitespace-nowrap text-gray-600">
                        MD Postpaid Consumption:
                    </Label>
                    <span className="font-semibold text-gray-900">
                        {parseFloat(data.postpaidConsumption).toLocaleString()}
                    </span>

                    <Label className="whitespace-nowrap text-gray-600">
                        Number of MD Postpaid Meters:
                    </Label>
                    <span className="font-semibold text-gray-900">2400</span>

                    <Label className="whitespace-nowrap text-gray-600">
                        Non-MD Postpaid Consumption:
                    </Label>
                    <span className="font-semibold text-gray-900">
                        {parseFloat(data.postpaidConsumption).toLocaleString()}
                    </span>

                    <Label className="whitespace-nowrap text-gray-600">
                        Number of Non-MD Postpaid Meters:
                    </Label>
                    <span className="font-semibold text-gray-900">2400</span>

                    <Label className="whitespace-nowrap text-gray-600">
                        Technical Loss:
                    </Label>
                    <span className="font-semibold text-gray-900">15%</span>

                    <Label className="whitespace-nowrap text-gray-600">
                        Commercial Loss:
                    </Label>
                    <span className="font-semibold text-gray-900">10%</span>

                    <Label className="whitespace-nowrap text-gray-600">
                        Total Energy Balance Left:
                    </Label>
                    <span className="font-semibold text-gray-900">223,00.01</span>

                    <Label className="whitespace-nowrap text-gray-600">
                        Efficiency Score:
                    </Label>
                    <span className="font-semibold text-gray-900">95%</span>
                </div>
            </DialogContent>
        </Dialog>
    );
}
