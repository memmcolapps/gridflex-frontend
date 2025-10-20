import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // Adjust import based on your setup
import { Button } from "@/components/ui/button"; // Adjust import based on your setup
import { AlertTriangle } from "lucide-react"; // Adjust import for your icon library
import type { FC } from "react";

interface VirtualMeterConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: string | undefined;
  onConfirm: () => void;
}

const VirtualMeterConfirmDialog: FC<VirtualMeterConfirmDialogProps> = ({
  isOpen,
  onOpenChange,
  customerId,
  onConfirm,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="h-fit bg-white w-md border-none">
        <DialogHeader>
          <div className="flex justify-items-start mb-4">
            <div className="bg-blue-100 rounded-full p-3">
              <AlertTriangle size={24} className="text-[#161CCA]" />
            </div>
          </div>
          <DialogTitle>Add Virtual Meter</DialogTitle>
          <DialogDescription>
            Are you sure you want to add a virtual meter to<br />
            <span className="font-bold">{customerId}</span>?
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-between gap-4 mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#161CCA] text-[#161CCA] cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-[#161CCA] text-white cursor-pointer"
          >
            Add
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VirtualMeterConfirmDialog;