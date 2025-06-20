import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomerIdDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  customerIdInput: string;
  onCustomerIdChange: (value: string) => void;
  filteredCustomerIds: string[];
  onCustomerSelect: (customerId: string) => void;
}

export default function CustomerIdDialog({
  isOpen,
  onOpenChange,
  customerIdInput,
  onCustomerIdChange,
  filteredCustomerIds,
  onCustomerSelect,
}: CustomerIdDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white text-black h-fit max-h-[80vh] overflow-y-auto">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}