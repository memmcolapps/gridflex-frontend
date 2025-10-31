// src/components/meter-management/CustomerIdDialog.tsx

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { LoadingAnimation } from "@/components/ui/loading-animation";

interface CustomerIdDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  customerIdInput: string;
  onCustomerIdChange: (value: string) => void;
  filteredCustomerIds: string[];
  onCustomerSelect: (customerId: string) => void;
  onProceed: () => void;
  isLoading: boolean;
}

export default function CustomerIdDialog({
  isOpen,
  onOpenChange,
  customerIdInput,
  onCustomerIdChange,
  filteredCustomerIds,
  onCustomerSelect,
  // NEW PROPS
  onProceed,
  isLoading,
}: CustomerIdDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white text-black h-fit max-h-[80vh] overflow-y-auto border-none">
        <DialogHeader>
          <DialogTitle>Assign Meter to Customer</DialogTitle>
          <p className="text-sm">Select customer name to assign meter</p>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>
              Customer ID <span className="text-red-500">*</span>
            </Label>
            <Input
              value={customerIdInput}
              onChange={(e) => onCustomerIdChange(e.target.value)}
              placeholder="Enter Customer ID"
              className="border-gray-300"
            />
            {filteredCustomerIds.length > 0 && (
              <ul className="w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-[200px] overflow-y-auto">
                {filteredCustomerIds.map((id) => (
                  <li
                    key={id}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
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
}