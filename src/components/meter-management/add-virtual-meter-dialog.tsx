import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // Adjust import based on your setup
import { Button } from "@/components/ui/button"; // Adjust import based on your setup
import { Input } from "@/components/ui/input"; // Adjust import based on your setup
import { Label } from "@/components/ui/label"; // Adjust import based on your setup
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Adjust import based on your setup
import type { FC } from "react";
import type { VirtualMeterData } from "@/types/meter"; // Adjust import based on your setup


interface AddVirtualMeterDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCustomer: VirtualMeterData | null;
  setSelectedCustomer: (customer: VirtualMeterData | null) => void;
  accountNumber: string;
  setAccountNumber: (value: string) => void;
  cin: string;
  setCin: (value: string) => void;
  feederLine: string;
  setFeederLine: (value: string) => void;
  dss: string;
  setDss: (value: string) => void;
  tariff: string;
  setTariff: (value: string) => void;
  state: string;
  setState: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  streetName: string;
  setStreetName: (value: string) => void;
  houseNo: string;
  setHouseNo: (value: string) => void;
  onProceed: () => void;
  isFormComplete: boolean;
  nigerianStates: string[];
}

const AddVirtualMeterDetailsDialog: FC<AddVirtualMeterDetailsDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedCustomer,
  setSelectedCustomer,
  accountNumber,
  setAccountNumber,
  cin,
  setCin,
  feederLine,
  setFeederLine,
  dss,
  setDss,
  setTariff,
  setState,
  city,
  setCity,
  streetName,
  setStreetName,
  houseNo,
  setHouseNo,
  onProceed,
  isFormComplete,
  nigerianStates,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="h-fit overflow-y-auto bg-white w-[800px]">
        <DialogHeader>
          <DialogTitle>Add Virtual Meter</DialogTitle>
          <DialogDescription>Fill all compulsory fields</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Customer ID <span className="text-red-600">*</span>
              </Label>
              <Input
                value={selectedCustomer?.customerId ?? ""}
                readOnly
                className="border border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label>
                First Name <span className="text-red-600">*</span>
              </Label>
              <Input
                value={selectedCustomer?.firstName ?? ""}
                readOnly
                className="border border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label>
                Last Name <span className="text-red-600">*</span>
              </Label>
              <Input
                value={selectedCustomer?.lastName ?? ""}
                readOnly
                className="border border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label>
                Phone Number <span className="text-red-600">*</span>
              </Label>
              <Input
                value={selectedCustomer?.phone ?? ""}
                readOnly
                className="border border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label>
                Account Number <span className="text-red-500">*</span>
              </Label>
              <Input
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter account number"
                className="border border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label>
                CIN <span className="text-red-500">*</span>
              </Label>
              <Input
                value={cin}
                onChange={(e) => setCin(e.target.value)}
                placeholder="Enter CIN"
                className="border border-gray-300"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>
                Feeder Line <span className="text-red-500">*</span>
              </Label>
              <Input
                value={feederLine}
                onChange={(e) => setFeederLine(e.target.value)}
                placeholder="Enter Feeder Line"
                className="border border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label>
                DSS <span className="text-red-500">*</span>
              </Label>
              <Input
                value={dss}
                onChange={(e) => setDss(e.target.value)}
                placeholder="Enter DSS"
                className="border border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label>
                Tariff <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={setTariff}>
                <SelectTrigger className="border border-gray-300">
                  <SelectValue placeholder="Select tariff" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tariff A1">Tariff A1</SelectItem>
                  <SelectItem value="Tariff A2">Tariff A2</SelectItem>
                  <SelectItem value="Tariff B1">Tariff B1</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                State <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={setState}>
                <SelectTrigger className="border border-gray-300 w-55">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {nigerianStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>
                City <span className="text-red-500">*</span>
              </Label>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city"
                className="border border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label>
                Street Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={streetName}
                onChange={(e) => setStreetName(e.target.value)}
                placeholder="Enter street name"
                className="border border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label>
                House No <span className="text-red-500">*</span>
              </Label>
              <Input
                value={houseNo}
                onChange={(e) => setHouseNo(e.target.value)}
                placeholder="Enter house number"
                className="border border-gray-300"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            onClick={() => setSelectedCustomer(null)}
            className="border-[#161CCA] text-[#161CCA] cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={onProceed}
            disabled={!isFormComplete}
            className={
              isFormComplete
                ? "bg-[#161CCA] text-white cursor-pointer"
                : "bg-blue-300 text-white cursor-not-allowed"
            }
          >
            Proceed
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddVirtualMeterDetailsDialog;