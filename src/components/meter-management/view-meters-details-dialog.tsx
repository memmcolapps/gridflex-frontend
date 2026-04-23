import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { MeterInventoryItem } from "@/types/meter-inventory";

// interface MeterData {
//   id: string;
//   meterNumber: string;
//   simNo: string;
//   class: string;
//   category?: string;
//   meterType: string;
//   oldTariffIndex: string;
//   newTariffIndex: string;
//   manufactureName: string;
//   accountNumber: string;
//   oldSgc: string;
//   oldKrn: string;
//   newKrn: string;
//   newSgc: string;
//   tariff: string;
//   assignedStatus: string;
//   status: string;
//   smartMeter?: string
// }

interface ViewMeterDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meter: MeterInventoryItem | null;
}

export function ViewMeterDetailsDialog({
  isOpen,
  onClose,
  meter,
}: ViewMeterDetailsDialogProps) {
  const hasSmartInfo = meter?.smartStatus === true
    && !!meter?.smartMeterInfo;
    console.log("Meter in Details Dialog:", meter?.smartMeterInfo);
  const isMdMeter = meter?.meterClass === "MD";
  //    && !!meter?.mdMeterInfo;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-fit max-h-[400px] w-[500px] overflow-y-auto rounded-lg bg-white">
        <DialogHeader>
          <DialogTitle>View Meter Details</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        {meter && (
          <div className="grid gap-4 px-4 py-2">
            <div className="grid grid-cols-[150px_1fr] items-center gap-16">
              <span className="font-medium text-gray-700">Meter Number:</span>
              <span className="font-bold text-gray-900">
                {meter.meterNumber}
              </span>
            </div>
            <div className="grid grid-cols-[150px_1fr] items-center gap-16">
              <span className="font-medium text-gray-700">SIM No:</span>
              <span className="font-bold text-gray-900">{meter.simNumber}</span>
            </div>

            <div className="grid grid-cols-[150px_1fr] items-center gap-16">
              <span className="font-medium text-gray-700">
                Meter Manufacturer:
              </span>
              <span className="font-bold text-gray-900">
                {meter.manufacturer?.name}
              </span>
            </div>
            <div className="grid grid-cols-[150px_1fr] items-center gap-16">
              <span className="font-medium text-gray-700">Meter Class:</span>
              <span className="font-bold text-gray-900">
                {meter.meterClass}
              </span>
            </div>
            <div className="grid grid-cols-[150px_1fr] items-center gap-16">
              <span className="font-medium text-gray-700">Meter Category:</span>
              <span className="font-bold text-gray-900">
                {meter.category ?? "-"}
              </span>
            </div>
            <div className="grid grid-cols-[150px_1fr] items-center gap-16">
              <span className="font-medium text-gray-700">Smart Meter:</span>
              <span className="font-bold text-gray-900">
                {meter.smartStatus === true
                  ? "Smart"
                  : meter.smartStatus === false
                    ? "Not Smart"
                    : "-"}
              </span>
            </div>
            <div className="grid grid-cols-[150px_1fr] items-center gap-16">
              <span className="font-medium text-gray-700">Old SGC:</span>
              <span className="font-bold text-gray-900">{meter.oldSgc}</span>
            </div>
            <div className="grid grid-cols-[150px_1fr] items-center gap-16">
              <span className="font-medium text-gray-700">New SGC:</span>
              <span className="font-bold text-gray-900">{meter.newSgc}</span>
            </div>
            <div className="grid grid-cols-[150px_1fr] items-center gap-16">
              <span className="font-medium text-gray-700">Old KRN:</span>
              <span className="font-bold text-gray-900">{meter.oldKrn}</span>
            </div>
            <div className="grid grid-cols-[150px_1fr] items-center gap-16">
              <span className="font-medium text-gray-700">New KRN:</span>
              <span className="font-bold text-gray-900">{meter.newKrn}</span>
            </div>
            <div className="grid grid-cols-[150px_1fr] items-center gap-16">
              <span className="font-medium text-gray-700">
                Old Tariff Index:
              </span>
              <span className="font-bold text-gray-900">
                {meter.oldTariffIndex}
              </span>
            </div>
            <div className="grid grid-cols-[150px_1fr] items-center gap-16">
              <span className="font-medium text-gray-700">
                New Tariff Index:
              </span>
              <span className="font-bold text-gray-900">
                {meter.newTariffIndex}
              </span>
            </div>
            {isMdMeter && (
              <>
                <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                  <span className="font-medium text-gray-700">
                    CT Ratio Numerator :
                  </span>
                  <span className="font-bold text-gray-900">
                    {meter.mdMeterInfo?.ctRatioNum}
                  </span>
                </div>
                <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                  <span className="font-medium text-gray-700">
                    CT Ratio Denominator :
                  </span>
                  <span className="font-bold text-gray-900">
                    {meter.mdMeterInfo?.ctRatioDenom}
                  </span>
                </div>
                <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                  <span className="font-medium text-gray-700">
                    Voltage Ratio Numerator:
                  </span>
                  <span className="font-bold text-gray-900">
                    {meter.mdMeterInfo?.voltRatioNum}
                  </span>
                </div>
                <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                  <span className="font-medium text-gray-700">
                    Voltage Ratio Denominator:
                  </span>
                  <span className="font-bold text-gray-900">
                    {meter.mdMeterInfo?.voltRatioDenom}
                  </span>
                </div>
                <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                  <span className="font-medium text-gray-700">Multiplier:</span>
                  <span className="font-bold text-gray-900">
                    {meter.mdMeterInfo?.multiplier}
                  </span>
                </div>
                <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                  <span className="font-medium text-gray-700">
                    Meter Rating:
                  </span>
                  <span className="font-bold text-gray-900">
                    {meter.mdMeterInfo?.meterRating}
                  </span>
                </div>
                <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                  <span className="font-medium text-gray-700">
                    Initial Reading:
                  </span>
                  <span className="font-bold text-gray-900">
                    {meter.mdMeterInfo?.initialReading}
                  </span>
                </div>
                <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                  <span className="font-medium text-gray-700">Dial:</span>
                  <span className="font-bold text-gray-900">
                    {meter.mdMeterInfo?.dial}
                  </span>
                </div>
                <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                  <span className="font-medium text-gray-700">Longitude:</span>
                  <span className="font-bold text-gray-900">
                    {meter.mdMeterInfo?.longitude}
                  </span>
                </div>
                <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                  <span className="font-medium text-gray-700">Latitude:</span>
                  <span className="font-bold text-gray-900">
                    {meter.mdMeterInfo?.latitude}
                  </span>
                </div>
              </>
            )}
            {hasSmartInfo && (
              <>
                <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                  <span className="font-medium text-gray-700">
                    Meter Model:
                  </span>
                  <span className="font-bold text-gray-900">
                    {meter.smartMeterInfo?.meterModel}
                  </span>
                </div>
                <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                  <span className="font-medium text-gray-700">Protocol:</span>
                  <span className="font-bold text-gray-900">
                    {meter.smartMeterInfo?.protocol}
                  </span>
                </div>
                <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                  <span className="font-medium text-gray-700">
                    Authentication:
                  </span>
                  <span className="font-bold text-gray-900">
                    {meter.smartMeterInfo?.authentication}
                  </span>
                </div>
                <div className="grid grid-cols-[150px_1fr] items-center gap-16">
                  <span className="font-medium text-gray-700">
                    Meter Password:
                  </span>
                  <span className="font-bold text-gray-900">
                    {meter.smartMeterInfo?.password}
                  </span>
                </div>
              </>
            )}
          </div>
        )}
        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}
