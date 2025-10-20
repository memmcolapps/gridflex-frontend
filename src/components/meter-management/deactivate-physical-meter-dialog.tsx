import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // Adjust import based on your setup
import { Button } from "@/components/ui/button"; 
import { Label } from "@/components/ui/label"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Adjust import based on your setup
import type { FC } from "react";

interface DeactivatePhysicalMeterDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onProceed: () => void;
  onMeterSelect: (meterId: string) => void;
  meters: { id: string; number: string; address: string }[];
  address: string;
}

const DeactivatePhysicalMeterDialog: FC<DeactivatePhysicalMeterDialogProps> = ({
  isOpen,
  onOpenChange,
  onProceed,
  onMeterSelect,
  meters,
  address,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="h-fit overflow-y-auto bg-white border-none" style={{ width: "500px", maxWidth: "none" }}>
        <DialogHeader>
          <DialogTitle>Deactivate Physical Meter</DialogTitle>
          <DialogDescription>
            Deactivate any existing actual meters at{" "}
            <span className="font-bold">{address}</span> before creating a virtual meter or proceed if not applicable
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="font-medium">
              Actual Meters <span className="text-red-600">*</span>
            </Label>
            <Select onValueChange={onMeterSelect}>
              <SelectTrigger className="mt-2 w-full">
                <SelectValue placeholder="Select meter" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {meters.map((meter) => (
                  <SelectItem key={meter.id} value={meter.id} className="flex items-center gap-4 w-full">
                    <div className="flex items-center justify-between flex-1 gap-12">
                      <span>{meter.number}</span>
                      <span>{meter.address}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#161CCA] text-[#161CCA] cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={onProceed}
            className="bg-[#161CCA] text-white cursor-pointer"
          >
            Proceed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeactivatePhysicalMeterDialog;