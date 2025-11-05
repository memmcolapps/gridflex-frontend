import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { FC } from "react";
import { LoadingAnimation } from "@/components/ui/loading-animation";

interface SelectCustomerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  customerIdInput: string;
  onCustomerIdChange: (value: string) => void;
  filteredCustomerIds: string[];
  onCustomerSelect: (customerId: string) => void;
  onProceed: () => void;
  isLoading: boolean;
}

const SelectCustomerDialog: FC<SelectCustomerDialogProps> = ({
  isOpen,
  onOpenChange,
  customerIdInput,
  onCustomerIdChange,
  filteredCustomerIds,
  onCustomerSelect,
  onProceed,
  isLoading,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="h-fit overflow-y-auto bg-white border-none text-black max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Add Virtual Meter</DialogTitle>
          <DialogDescription>Select customer to assign a virtual meter</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>
              Customer ID <span className="text-red-500">*</span>
            </Label>
            <Input
              value={customerIdInput}
              onChange={(e) => onCustomerIdChange(e.target.value)}
              placeholder="Enter Customer ID"
              className="border border-gray-100"
            />
            {filteredCustomerIds.length > 0 && (
              <ul className="border border-gray-100 rounded-md mt-1 max-h-60 overflow-y-auto">
                {filteredCustomerIds.map((id) => (
                  <li
                    key={id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => onCustomerSelect(id)}
                  >
                    {id}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex justify-end">
            <Button
              onClick={onProceed}
              disabled={!customerIdInput || isLoading}
              className="mt-4 cursor-pointer bg-[#162acc] text-white hover:bg-[#162acc] hover:text-white"
              size={"lg"}
            >
              {isLoading ? (
                <LoadingAnimation variant="inline" size="sm" />
              ) : (
                "Proceed"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SelectCustomerDialog;