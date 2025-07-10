import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox"; // Added Checkbox import
import type { FC } from "react";
import type { VirtualMeterData } from "@/types/meter";

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
  energyType: string;
  setEnergyType: (value: string) => void;
  custoType?: string; 
  setCustomerType?: (value: string) => void; 
  fixedEnergy: string;
  setFixedEnergy: (value: string) => void;
  onProceed: () => void;
  isFormComplete: boolean;
  nigerianStates: string[];
  customerTypes:string[];
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
  // tariff,
  setTariff,
  // state,
  setState,
  city,
  setCity,
  streetName,
  setStreetName,
  houseNo,
  setHouseNo,
  energyType,
  setEnergyType,
  fixedEnergy,
  // custoType,
  setCustomerType,
  setFixedEnergy,
  onProceed,
  isFormComplete,
  nigerianStates,
  customerTypes
}) => {
  // Determine if the Fixed checkbox is selected
  const isFixedChecked = energyType === "Fixed";

  // Update isFormComplete to include new fields
  const updatedIsFormComplete =
    isFormComplete &&
    (isFixedChecked ? fixedEnergy.trim() !== "" : true); // Require fixedEnergy only if Fixed is checked

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


          <div className="grid grid-cols-2 gap-4">
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
                Customer Type <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={setCustomerType}>
                <SelectTrigger className="border border-gray-300 w-55">
                  <SelectValue placeholder="Select Customer Type" />
                </SelectTrigger>
                <SelectContent>
                  {customerTypes.map((custoType) => (
                    <SelectItem key={custoType} value={custoType}>
                      {custoType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>
                Tariff <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={setTariff}>
                <SelectTrigger className="border border-gray-300 w-55">
                  <SelectValue placeholder="Select tariff" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tariff A1">Tariff A1</SelectItem>
                  <SelectItem value="Tariff A2">Tariff A2</SelectItem>
                  <SelectItem value="Tariff B1">Tariff B1</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
          {/* Added Energy Type Checkbox and Fixed Energy Input */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Energy Type <span className="text-red-500">*</span>
              </Label>
              <div className="flex justify-between gap-2 border border-gray-300 rounded-md px-3 py-2">
                <Label htmlFor="fixed-energy-type" className="text-sm text-gray-700">
                  Fixed
                </Label>
                <Checkbox            
                  id="fixed-energy-type"
                  checked={isFixedChecked}
                  onCheckedChange={(checked) => {
                    setEnergyType(checked ? "Fixed" : "");
                    if (!checked) setFixedEnergy(""); // Clear fixedEnergy if unchecked
                  }}
                  className="h-4 w-4 border-gray-500 data-[state=checked]:bg-green-500 data-[state=checked]:text-white rounded-full"           
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>
                Fixed Energy <span className="text-red-500">{isFixedChecked ? "*" : ""}</span>
              </Label>
              <Input
                value={fixedEnergy}
                onChange={(e) => setFixedEnergy(e.target.value)}
                placeholder="Enter fixed energy"
                className="border border-gray-300"
                disabled={!isFixedChecked}
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
            disabled={!updatedIsFormComplete}
            className={
              updatedIsFormComplete
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