/* eslint-disable @typescript-eslint/no-unused-vars */
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { VirtualMeterData } from "@/types/meter";
import type { MeterInventoryItem } from "@/types/meter-inventory";
import type { Customer } from "@/types/customer-types";
import { useTariff } from "@/hooks/use-tarrif";

type CustomerDisplay = {
  firstName?: string;
  firstname?: string;
  lastName?: string;
  lastname?: string;
  phone?: string;
  phoneNumber?: string;
};

interface AssignMeterDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | MeterInventoryItem | VirtualMeterData | null;
  meterNumber: string;
  setMeterNumber: (value: string) => void;
  cin: string;
  setCin: (value: string) => void;
  accountNumber: string;
  setAccountNumber: (value: string) => void;
  tariff: string;
  setTariff: (value: string) => void;
  feeder: string;
  setFeeder: (value: string) => void;
  dss: string;
  setDss: (value: string) => void;
  state: string;
  setState: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  streetName: string;
  setStreetName: (value: string) => void;
  houseNo: string;
  setHouseNo: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  feederLine?: string;
  setFeederLine?: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  onProceed: () => void;
  isFormComplete: boolean;
  progress: number;
}

export function AssignMeterDialog({
  isOpen,
  onOpenChange,
  customer,
  meterNumber,
  setMeterNumber,
  cin,
  setCin,
  accountNumber,
  setAccountNumber,
  tariff,
  setTariff,
  feeder,
  setFeeder,
  dss,
  setDss,
  state,
  setState,
  city,
  setCity,
  streetName,
  setStreetName,
  houseNo,
  setHouseNo,
  // category,
  // setCategory,
  phone,
  setPhone,
  onProceed,
  isFormComplete,
  // progress,
}: AssignMeterDialogProps) {
  const { tariffs, isLoading: tariffsLoading } = useTariff();

  // Type guard to check if customer is MeterInventoryItem
  const isMeterInventoryItem = (customer: Customer | MeterInventoryItem | VirtualMeterData): customer is MeterInventoryItem => {
    return "meterManufacturer" in customer;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white text-black h-fit">
        {/* {customer?.category === "Prepaid" && <Progress value={progress} className="w-full" />} */}
        <DialogHeader>
          <DialogTitle>Assign meter to customer</DialogTitle>
          <p className="text-sm">Fill all compulsory fields</p>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Customer ID
                <span className="text-red-700">*</span>
              </Label>
              <Input
                value={customer?.customerId ?? ""}

                readOnly
                placeholder={customer && isMeterInventoryItem(customer) ? "Enter Meter ID" : "Enter Customer ID"}
                className="border-gray-200 text-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label>
                First Name<span className="text-red-700">*</span>
              </Label>
              <Input
                value={(customer as CustomerDisplay)?.firstName ?? (customer as CustomerDisplay)?.firstname ?? ""}
                readOnly
                placeholder="Enter First Name"
                className="border-gray-200 text-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label>
                Last Name<span className="text-red-700">*</span>
              </Label>
              <Input
                value={(customer as CustomerDisplay)?.lastName ?? (customer as CustomerDisplay)?.lastname ?? ""}
                readOnly
                placeholder="Enter Last Name"
                className="border-gray-200 text-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label>
                Phone Number<span className="text-red-700">*</span>
              </Label>
              <Input
                value={(customer as CustomerDisplay)?.phone ?? (customer as CustomerDisplay)?.phoneNumber ?? ""}
                readOnly
                placeholder="Enter Phone Number"
                className="border-gray-200 text-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label>
                Meter Number<span className="text-red-700">*</span>
              </Label>
              <Input
                value={meterNumber}
                onChange={(e) => setMeterNumber(e.target.value)}
                placeholder="Enter Meter Number"
                className="border-gray-200 text-gray-600"
              />
            </div>
            {/* {customer && !isMeterData(customer) && ( */}

            <div className="space-y-2">
              <Label>
                CIN<span className="text-red-700">*</span>
              </Label>
              <Input
                value={cin}
                onChange={(e) => setCin(e.target.value)}
                placeholder="Enter CIN"
                readOnly
                className="border-gray-200 text-gray-600"
              />
            </div>


            {/* )} */}
            <div className="space-y-2">
              <Label>
                Account Number<span className="text-red-700">*</span>
              </Label>
              <Input
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                readOnly
                placeholder="Enter Account Number"
                className="border-gray-200 text-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label>
                Tariff<span className="text-red-700">*</span>
              </Label>
              <Select onValueChange={setTariff} value={tariff} disabled={tariffsLoading}>
                <SelectTrigger className="border-gray-200 text-gray-600 w-full">
                  <SelectValue placeholder="Select Tariff" />
                </SelectTrigger>
                <SelectContent>
                  {tariffs.map((t) => (
                    <SelectItem key={t.id} value={t.name}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>
                Feeder Line
                <span className="text-red-700">*</span>
              </Label>
              <Input
                value={feeder}
                onChange={(e) => setFeeder(e.target.value)}
                placeholder="Enter Feeder Line ID"
                className="border-gray-200 text-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label>
                Distribution Substation (DSS)<span className="text-red-700">*</span>
              </Label>
              <Input
                value={dss}
                onChange={(e) => setDss(e.target.value)}
                placeholder="Enter DSS ID"
                className="border-gray-200 text-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label>
                State<span className="text-red-700">*</span>
              </Label>
              <Input
                value={state}
                onChange={(e) => setState(e.target.value)}
                readOnly
                placeholder="Enter City"
                className="border-gray-100 text-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label>
                City<span className="text-red-700">*</span>
              </Label>
              <Input
                value={city}
                readOnly
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter City"
                className="border-gray-100 text-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label>
                Street Name<span className="text-red-700">*</span>
              </Label>
              <Input
                value={streetName}
                readOnly
                onChange={(e) => setStreetName(e.target.value)}
                placeholder="Enter Street Name"
                className="border-gray-100 text-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label>
                House No.<span className="text-red-700">*</span>
              </Label>
              <Input
                value={houseNo}
                readOnly
                onChange={(e) => setHouseNo(e.target.value)}
                placeholder="Enter House No"
                className="border-gray-100 text-gray-600"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
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
                : "bg-[#161CCA] text-white cursor-not-allowed"
            }
          >
            Proceed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}