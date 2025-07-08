"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import type { MeterData } from "@/app/(protected)/data-management/meter-management/assign-meter/page";

interface EditCustomerDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editCustomer: MeterData | null;
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
  phone: string;
  setPhone: (value: string) => void;
  progress: number;
  isFormComplete: boolean;
  onProceed: () => void;
}

export function EditCustomerDetailsDialog({
  isOpen,
  onOpenChange,
  editCustomer,
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
  phone,
  setPhone,
  progress,
  isFormComplete,
  onProceed,
}: EditCustomerDetailsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white text-black h-fit">
        {editCustomer?.category === "Prepaid" && <Progress value={progress} className="w-full mt-4" />}
        <DialogHeader>
          <DialogTitle>Edit Customer Details</DialogTitle>
          <p className="text-sm">Fill all compulsory fields</p>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Customer ID<span className="text-red-700">*</span>
              </Label>
              <Input
                value={editCustomer?.customerId ?? ""}
                readOnly
                disabled
                placeholder="Enter Customer ID"
                className="border-gray-200 text-gray-600 bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <Label>
                First Name<span className="text-red-700">*</span>
              </Label>
              <Input
                value={editCustomer?.firstName ?? ""}
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
                value={editCustomer?.lastName ?? ""}
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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
            <div className="space-y-2">
              <Label>CIN</Label>
              <Input
                value={cin}
                onChange={(e) => setCin(e.target.value)}
                placeholder="Enter CIN"
                className="border-gray-200 text-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label>
                Account Number<span className="text-red-700">*</span>
              </Label>
              <Input
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter Account Number"
                className="border-gray-200 text-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label>
                Tariff<span className="text-red-700">*</span>
              </Label>
              <Select onValueChange={setTariff} value={tariff}>
                <SelectTrigger className="border-gray-200 text-gray-600 w-full">
                  <SelectValue placeholder="Select Tariff" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tariff1">Tariff 1</SelectItem>
                  <SelectItem value="tariff2">Tariff 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>
                Feeder Line<span className="text-red-700">*</span>
              </Label>
              <Select onValueChange={setFeeder} value={feeder}>
                <SelectTrigger className="border-gray-100 text-gray-600 w-full">
                  <SelectValue placeholder="Select Feeder Line" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feeder1">Feeder 1</SelectItem>
                  <SelectItem value="feeder2">Feeder 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>
                Distribution Substation (DSS)<span className="text-red-700">*</span>
              </Label>
              <Select onValueChange={setDss} value={dss}>
                <SelectTrigger className="border-gray-100 text-gray-600 w-full">
                  <SelectValue placeholder="Select DSS" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dss1">DSS 1</SelectItem>
                  <SelectItem value="dss2">DSS 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>
                State<span className="text-red-700">*</span>
              </Label>
              <Select onValueChange={setState} value={state}>
                <SelectTrigger className="border-gray-100 text-gray-600 w-full">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="state1">State 1</SelectItem>
                  <SelectItem value="state2">State 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>
                City<span className="text-red-700">*</span>
              </Label>
              <Input
                value={city}
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
                onChange={(e) => setStreetName(e.target.value)}
                placeholder="Enter Street Name"
                className="border-gray-100 text-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label>
                House No. <span className="text-red-700">*</span>
              </Label>
              <Input
                value={houseNo}
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
            disabled={editCustomer ? false : !isFormComplete}
            className={
              editCustomer || isFormComplete
                ? "bg-[#161CCA] text-white cursor-pointer"
                : "bg-blue-200 text-white cursor-not-allowed"
            }
          >
            Proceed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}